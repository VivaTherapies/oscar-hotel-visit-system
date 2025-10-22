/**
 * Optimized Data Storage System for Oscar's Hotel Visit Management
 * Handles large capacity visit history with compression, archival, and performance optimization
 */

class OptimizedDataStorage {
    constructor() {
        this.STORAGE_KEYS = {
            VISITS_ACTIVE: 'oscar_visits_active',
            VISITS_ARCHIVED: 'oscar_visits_archived',
            HOTELS: 'oscar_hotels',
            VISIT_HISTORY: 'oscar_visit_history',
            SETTINGS: 'oscar_settings',
            METADATA: 'oscar_metadata'
        };
        
        this.COMPRESSION_THRESHOLD = 100; // Archive visits older than 100 days
        this.MAX_ACTIVE_VISITS = 500; // Keep max 500 active visits in memory
        this.BATCH_SIZE = 50; // Process data in batches
        
        this.initialize();
    }
    
    // Initialize storage system
    initialize() {
        this.createIndexes();
        this.migrateOldData();
        this.setupPeriodicMaintenance();
        console.log('Optimized Data Storage initialized');
    }
    
    // Create indexes for faster queries
    createIndexes() {
        const metadata = this.getMetadata();
        
        if (!metadata.indexes) {
            metadata.indexes = {
                visitsByDate: {},
                visitsByHotel: {},
                visitsByStatus: {},
                lastUpdated: new Date().toISOString()
            };
            this.saveMetadata(metadata);
        }
    }
    
    // Migrate old data to new optimized format
    migrateOldData() {
        const oldKeys = ['visits', 'oscar_visits', 'scheduledVisits', 'visitHistory'];
        let migratedCount = 0;
        
        oldKeys.forEach(key => {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    let visits = [];
                    
                    if (Array.isArray(parsed)) {
                        visits = parsed;
                    } else if (typeof parsed === 'object') {
                        // Handle scheduledVisits format
                        visits = Object.values(parsed).flat();
                    }
                    
                    visits.forEach(visit => {
                        if (visit && visit.id) {
                            this.saveVisit(visit, false); // Don't rebuild indexes for each visit
                            migratedCount++;
                        }
                    });
                    
                    // Remove old data after migration
                    localStorage.removeItem(key);
                    
                } catch (e) {
                    console.error(`Error migrating ${key}:`, e);
                }
            }
        });
        
        if (migratedCount > 0) {
            this.rebuildIndexes();
            console.log(`Migrated ${migratedCount} visits to optimized storage`);
        }
    }
    
    // Save visit with optimization
    saveVisit(visit, rebuildIndexes = true) {
        try {
            // Ensure visit has required fields
            if (!visit.id) {
                visit.id = this.generateId();
            }
            
            if (!visit.createdAt) {
                visit.createdAt = new Date().toISOString();
            }
            
            visit.updatedAt = new Date().toISOString();
            
            // Determine if visit should be archived
            const visitDate = new Date(visit.date || visit.createdAt);
            const daysSinceVisit = (Date.now() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
            
            if (daysSinceVisit > this.COMPRESSION_THRESHOLD) {
                this.saveArchivedVisit(visit);
            } else {
                this.saveActiveVisit(visit);
            }
            
            if (rebuildIndexes) {
                this.updateIndexes(visit);
            }
            
            return visit.id;
            
        } catch (error) {
            console.error('Error saving visit:', error);
            return null;
        }
    }
    
    // Save active visit
    saveActiveVisit(visit) {
        const activeVisits = this.getActiveVisits();
        
        // Remove existing visit if updating
        const existingIndex = activeVisits.findIndex(v => v.id === visit.id);
        if (existingIndex !== -1) {
            activeVisits[existingIndex] = visit;
        } else {
            activeVisits.push(visit);
        }
        
        // Check if we need to archive old visits
        if (activeVisits.length > this.MAX_ACTIVE_VISITS) {
            this.archiveOldVisits(activeVisits);
        }
        
        this.saveActiveVisits(activeVisits);
    }
    
    // Save archived visit with compression
    saveArchivedVisit(visit) {
        const archivedVisits = this.getArchivedVisits();
        
        // Compress visit data
        const compressedVisit = this.compressVisit(visit);
        
        // Remove existing visit if updating
        const existingIndex = archivedVisits.findIndex(v => v.id === visit.id);
        if (existingIndex !== -1) {
            archivedVisits[existingIndex] = compressedVisit;
        } else {
            archivedVisits.push(compressedVisit);
        }
        
        this.saveArchivedVisits(archivedVisits);
    }
    
    // Compress visit data to save space
    compressVisit(visit) {
        return {
            id: visit.id,
            d: visit.date,
            t: visit.time,
            h: visit.hotelId,
            hn: visit.hotelName,
            p: visit.purpose,
            s: visit.status,
            c: visit.createdAt,
            u: visit.updatedAt,
            // Store only essential fields for archived visits
            cp: visit.contactPerson,
            ce: visit.contactEmail,
            vs: visit.visitSummary ? visit.visitSummary.substring(0, 200) : '', // Truncate summary
            vo: visit.visitOutcome,
            vr: visit.visitRating
        };
    }
    
    // Decompress visit data
    decompressVisit(compressedVisit) {
        return {
            id: compressedVisit.id,
            date: compressedVisit.d,
            time: compressedVisit.t,
            hotelId: compressedVisit.h,
            hotelName: compressedVisit.hn,
            purpose: compressedVisit.p,
            status: compressedVisit.s,
            createdAt: compressedVisit.c,
            updatedAt: compressedVisit.u,
            contactPerson: compressedVisit.cp,
            contactEmail: compressedVisit.ce,
            visitSummary: compressedVisit.vs,
            visitOutcome: compressedVisit.vo,
            visitRating: compressedVisit.vr,
            archived: true
        };
    }
    
    // Archive old visits to free up active storage
    archiveOldVisits(activeVisits) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.COMPRESSION_THRESHOLD);
        
        const toArchive = activeVisits.filter(visit => {
            const visitDate = new Date(visit.date || visit.createdAt);
            return visitDate < cutoffDate;
        });
        
        const remaining = activeVisits.filter(visit => {
            const visitDate = new Date(visit.date || visit.createdAt);
            return visitDate >= cutoffDate;
        });
        
        // Archive old visits
        toArchive.forEach(visit => {
            this.saveArchivedVisit(visit);
        });
        
        // Keep only recent visits active
        this.saveActiveVisits(remaining);
        
        console.log(`Archived ${toArchive.length} old visits`);
    }
    
    // Get all visits (active + archived)
    getAllVisits() {
        const activeVisits = this.getActiveVisits();
        const archivedVisits = this.getArchivedVisits().map(v => this.decompressVisit(v));
        
        return [...activeVisits, ...archivedVisits];
    }
    
    // Get active visits only
    getActiveVisits() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.VISITS_ACTIVE);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading active visits:', error);
            return [];
        }
    }
    
    // Get archived visits
    getArchivedVisits() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.VISITS_ARCHIVED);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error loading archived visits:', error);
            return [];
        }
    }
    
    // Save active visits
    saveActiveVisits(visits) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.VISITS_ACTIVE, JSON.stringify(visits));
        } catch (error) {
            console.error('Error saving active visits:', error);
            // If storage is full, try to archive more visits
            this.emergencyArchival();
        }
    }
    
    // Save archived visits
    saveArchivedVisits(visits) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.VISITS_ARCHIVED, JSON.stringify(visits));
        } catch (error) {
            console.error('Error saving archived visits:', error);
        }
    }
    
    // Emergency archival when storage is full
    emergencyArchival() {
        const activeVisits = this.getActiveVisits();
        
        // Sort by date and archive oldest 50%
        activeVisits.sort((a, b) => {
            const dateA = new Date(a.date || a.createdAt);
            const dateB = new Date(b.date || b.createdAt);
            return dateA - dateB;
        });
        
        const midpoint = Math.floor(activeVisits.length / 2);
        const toArchive = activeVisits.slice(0, midpoint);
        const remaining = activeVisits.slice(midpoint);
        
        // Archive older half
        toArchive.forEach(visit => {
            this.saveArchivedVisit(visit);
        });
        
        // Keep newer half active
        this.saveActiveVisits(remaining);
        
        console.log(`Emergency archival: moved ${toArchive.length} visits to archive`);
    }
    
    // Update indexes for faster queries
    updateIndexes(visit) {
        const metadata = this.getMetadata();
        
        // Index by date
        const dateKey = visit.date || visit.createdAt.split('T')[0];
        if (!metadata.indexes.visitsByDate[dateKey]) {
            metadata.indexes.visitsByDate[dateKey] = [];
        }
        if (!metadata.indexes.visitsByDate[dateKey].includes(visit.id)) {
            metadata.indexes.visitsByDate[dateKey].push(visit.id);
        }
        
        // Index by hotel
        if (visit.hotelId) {
            if (!metadata.indexes.visitsByHotel[visit.hotelId]) {
                metadata.indexes.visitsByHotel[visit.hotelId] = [];
            }
            if (!metadata.indexes.visitsByHotel[visit.hotelId].includes(visit.id)) {
                metadata.indexes.visitsByHotel[visit.hotelId].push(visit.id);
            }
        }
        
        // Index by status
        if (visit.status) {
            if (!metadata.indexes.visitsByStatus[visit.status]) {
                metadata.indexes.visitsByStatus[visit.status] = [];
            }
            if (!metadata.indexes.visitsByStatus[visit.status].includes(visit.id)) {
                metadata.indexes.visitsByStatus[visit.status].push(visit.id);
            }
        }
        
        metadata.indexes.lastUpdated = new Date().toISOString();
        this.saveMetadata(metadata);
    }
    
    // Rebuild all indexes
    rebuildIndexes() {
        const metadata = this.getMetadata();
        metadata.indexes = {
            visitsByDate: {},
            visitsByHotel: {},
            visitsByStatus: {},
            lastUpdated: new Date().toISOString()
        };
        
        const allVisits = this.getAllVisits();
        allVisits.forEach(visit => {
            this.updateIndexes(visit);
        });
        
        console.log('Indexes rebuilt for', allVisits.length, 'visits');
    }
    
    // Fast query by date using indexes
    getVisitsByDate(date) {
        const metadata = this.getMetadata();
        const visitIds = metadata.indexes.visitsByDate[date] || [];
        
        return this.getVisitsByIds(visitIds);
    }
    
    // Fast query by hotel using indexes
    getVisitsByHotel(hotelId) {
        const metadata = this.getMetadata();
        const visitIds = metadata.indexes.visitsByHotel[hotelId] || [];
        
        return this.getVisitsByIds(visitIds);
    }
    
    // Fast query by status using indexes
    getVisitsByStatus(status) {
        const metadata = this.getMetadata();
        const visitIds = metadata.indexes.visitsByStatus[status] || [];
        
        return this.getVisitsByIds(visitIds);
    }
    
    // Get visits by IDs
    getVisitsByIds(visitIds) {
        const activeVisits = this.getActiveVisits();
        const archivedVisits = this.getArchivedVisits();
        
        const results = [];
        
        visitIds.forEach(id => {
            // Check active visits first
            const activeVisit = activeVisits.find(v => v.id === id);
            if (activeVisit) {
                results.push(activeVisit);
                return;
            }
            
            // Check archived visits
            const archivedVisit = archivedVisits.find(v => v.id === id);
            if (archivedVisit) {
                results.push(this.decompressVisit(archivedVisit));
            }
        });
        
        return results;
    }
    
    // Get visit by ID
    getVisitById(visitId) {
        // Check active visits first
        const activeVisits = this.getActiveVisits();
        const activeVisit = activeVisits.find(v => v.id === visitId);
        if (activeVisit) {
            return activeVisit;
        }
        
        // Check archived visits
        const archivedVisits = this.getArchivedVisits();
        const archivedVisit = archivedVisits.find(v => v.id === visitId);
        if (archivedVisit) {
            return this.decompressVisit(archivedVisit);
        }
        
        return null;
    }
    
    // Delete visit
    deleteVisit(visitId) {
        try {
            // Remove from active visits
            let activeVisits = this.getActiveVisits();
            const activeIndex = activeVisits.findIndex(v => v.id === visitId);
            if (activeIndex !== -1) {
                activeVisits.splice(activeIndex, 1);
                this.saveActiveVisits(activeVisits);
                this.removeFromIndexes(visitId);
                return true;
            }
            
            // Remove from archived visits
            let archivedVisits = this.getArchivedVisits();
            const archivedIndex = archivedVisits.findIndex(v => v.id === visitId);
            if (archivedIndex !== -1) {
                archivedVisits.splice(archivedIndex, 1);
                this.saveArchivedVisits(archivedVisits);
                this.removeFromIndexes(visitId);
                return true;
            }
            
            return false;
            
        } catch (error) {
            console.error('Error deleting visit:', error);
            return false;
        }
    }
    
    // Remove visit from indexes
    removeFromIndexes(visitId) {
        const metadata = this.getMetadata();
        
        // Remove from all indexes
        Object.keys(metadata.indexes.visitsByDate).forEach(date => {
            metadata.indexes.visitsByDate[date] = metadata.indexes.visitsByDate[date].filter(id => id !== visitId);
            if (metadata.indexes.visitsByDate[date].length === 0) {
                delete metadata.indexes.visitsByDate[date];
            }
        });
        
        Object.keys(metadata.indexes.visitsByHotel).forEach(hotelId => {
            metadata.indexes.visitsByHotel[hotelId] = metadata.indexes.visitsByHotel[hotelId].filter(id => id !== visitId);
            if (metadata.indexes.visitsByHotel[hotelId].length === 0) {
                delete metadata.indexes.visitsByHotel[hotelId];
            }
        });
        
        Object.keys(metadata.indexes.visitsByStatus).forEach(status => {
            metadata.indexes.visitsByStatus[status] = metadata.indexes.visitsByStatus[status].filter(id => id !== visitId);
            if (metadata.indexes.visitsByStatus[status].length === 0) {
                delete metadata.indexes.visitsByStatus[status];
            }
        });
        
        this.saveMetadata(metadata);
    }
    
    // Get storage statistics
    getStorageStats() {
        const activeVisits = this.getActiveVisits();
        const archivedVisits = this.getArchivedVisits();
        
        const activeSize = JSON.stringify(activeVisits).length;
        const archivedSize = JSON.stringify(archivedVisits).length;
        
        return {
            activeVisits: activeVisits.length,
            archivedVisits: archivedVisits.length,
            totalVisits: activeVisits.length + archivedVisits.length,
            activeSize: activeSize,
            archivedSize: archivedSize,
            totalSize: activeSize + archivedSize,
            compressionRatio: archivedVisits.length > 0 ? (archivedSize / (archivedVisits.length * 500)) : 0 // Estimate
        };
    }
    
    // Export data for backup
    exportData() {
        return {
            activeVisits: this.getActiveVisits(),
            archivedVisits: this.getArchivedVisits(),
            metadata: this.getMetadata(),
            exportDate: new Date().toISOString()
        };
    }
    
    // Import data from backup
    importData(data) {
        try {
            if (data.activeVisits) {
                this.saveActiveVisits(data.activeVisits);
            }
            
            if (data.archivedVisits) {
                this.saveArchivedVisits(data.archivedVisits);
            }
            
            if (data.metadata) {
                this.saveMetadata(data.metadata);
            } else {
                this.rebuildIndexes();
            }
            
            console.log('Data imported successfully');
            return true;
            
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
    
    // Metadata management
    getMetadata() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEYS.METADATA);
            return data ? JSON.parse(data) : { indexes: {}, settings: {} };
        } catch (error) {
            console.error('Error loading metadata:', error);
            return { indexes: {}, settings: {} };
        }
    }
    
    saveMetadata(metadata) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.METADATA, JSON.stringify(metadata));
        } catch (error) {
            console.error('Error saving metadata:', error);
        }
    }
    
    // Setup periodic maintenance
    setupPeriodicMaintenance() {
        // Run maintenance every hour
        setInterval(() => {
            this.performMaintenance();
        }, 60 * 60 * 1000);
        
        // Run initial maintenance after 5 minutes
        setTimeout(() => {
            this.performMaintenance();
        }, 5 * 60 * 1000);
    }
    
    // Perform maintenance tasks
    performMaintenance() {
        try {
            const stats = this.getStorageStats();
            
            // Archive old visits if active storage is getting full
            if (stats.activeVisits > this.MAX_ACTIVE_VISITS * 0.8) {
                const activeVisits = this.getActiveVisits();
                this.archiveOldVisits(activeVisits);
            }
            
            // Clean up empty index entries
            this.cleanupIndexes();
            
            console.log('Maintenance completed. Stats:', stats);
            
        } catch (error) {
            console.error('Error during maintenance:', error);
        }
    }
    
    // Clean up empty index entries
    cleanupIndexes() {
        const metadata = this.getMetadata();
        
        // Remove empty date indexes
        Object.keys(metadata.indexes.visitsByDate).forEach(date => {
            if (metadata.indexes.visitsByDate[date].length === 0) {
                delete metadata.indexes.visitsByDate[date];
            }
        });
        
        // Remove empty hotel indexes
        Object.keys(metadata.indexes.visitsByHotel).forEach(hotelId => {
            if (metadata.indexes.visitsByHotel[hotelId].length === 0) {
                delete metadata.indexes.visitsByHotel[hotelId];
            }
        });
        
        // Remove empty status indexes
        Object.keys(metadata.indexes.visitsByStatus).forEach(status => {
            if (metadata.indexes.visitsByStatus[status].length === 0) {
                delete metadata.indexes.visitsByStatus[status];
            }
        });
        
        this.saveMetadata(metadata);
    }
    
    // Generate unique ID
    generateId() {
        return 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize optimized storage
window.optimizedStorage = new OptimizedDataStorage();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OptimizedDataStorage;
}
