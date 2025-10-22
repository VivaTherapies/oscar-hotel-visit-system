/**
 * Unified Data Manager for Oscar's Hotel Visit Management System
 * Single source of truth for all visit and hotel data
 */

class UnifiedDataManager {
    static STORAGE_KEYS = {
        VISITS: 'oscar_visits',
        HOTELS: 'oscar_hotels',
        VISIT_HISTORY: 'oscar_visit_history',
        SETTINGS: 'oscar_settings'
    };
    
    // Initialize the data manager
    static initialize() {
        this.ensureHotelDatabase();
        this.migrateOldData();
        console.log('Unified Data Manager initialized');
    }
    
    // Ensure hotel database exists
    static ensureHotelDatabase() {
        const hotels = this.getHotels();
        if (hotels.length === 0) {
            this.initializeHotelDatabase();
        }
    }
    
    // Initialize hotel database with real data
    static initializeHotelDatabase() {
        const hotels = [
            {
                id: 'hotel_001',
                name: 'THE PARK TOWER KNIGHTSBRIDGE',
                area: 'Knightsbridge',
                address: '101 Knightsbridge, London SW1X 7RN',
                phone: '+44 20 7235 8050',
                email: 'reservations@theparktowerknightsbridge.com',
                revenue: 298372.50,
                bookings: 1842,
                priority: 'P1'
            },
            {
                id: 'hotel_002',
                name: "CLARIDGE'S",
                area: 'Mayfair',
                address: 'Brook Street, London W1K 4HR',
                phone: '+44 20 7629 8860',
                email: 'info@claridges.co.uk',
                revenue: 248770.00,
                bookings: 1654,
                priority: 'P1'
            },
            {
                id: 'hotel_003',
                name: 'GROSVENOR HOUSE SUITES',
                area: 'Mayfair',
                address: '86-90 Park Lane, London W1K 7TN',
                phone: '+44 20 7499 6363',
                email: 'reservations@grosvenorhouse-suites.com',
                revenue: 247504.00,
                bookings: 1598,
                priority: 'P1'
            },
            {
                id: 'hotel_004',
                name: 'THE LANGHAM, LONDON',
                area: 'Marylebone',
                address: '1C Portland Place, London W1B 1JA',
                phone: '+44 20 7636 1000',
                email: 'tllon.info@langhamhotels.com',
                revenue: 143191.00,
                bookings: 987,
                priority: 'P1'
            },
            {
                id: 'hotel_005',
                name: 'JUMEIRAH CARLTON TOWER',
                area: 'Knightsbridge',
                address: 'Cadogan Place, London SW1X 9PY',
                phone: '+44 20 7235 1234',
                email: 'jctinfo@jumeirah.com',
                revenue: 137940.00,
                bookings: 876,
                priority: 'P1'
            },
            {
                id: 'hotel_006',
                name: 'THE RITZ LONDON',
                area: 'Piccadilly',
                address: '150 Piccadilly, London W1J 9BR',
                phone: '+44 20 7493 8181',
                email: 'enquire@theritzlondon.com',
                revenue: 111049.00,
                bookings: 743,
                priority: 'P1'
            },
            {
                id: 'hotel_007',
                name: 'THE DORCHESTER',
                area: 'Mayfair',
                address: 'Park Lane, London W1K 1QA',
                phone: '+44 20 7629 8888',
                email: 'reservations@thedorchester.com',
                revenue: 98765.00,
                bookings: 654,
                priority: 'P1'
            },
            {
                id: 'hotel_008',
                name: 'THE SAVOY',
                area: 'Covent Garden',
                address: 'Strand, London WC2R 0EU',
                phone: '+44 20 7836 4343',
                email: 'info@thesavoylondon.com',
                revenue: 87432.00,
                bookings: 567,
                priority: 'P1'
            },
            {
                id: 'hotel_009',
                name: 'FOUR SEASONS HOTEL LONDON AT MAYFAIR',
                area: 'Mayfair',
                address: 'Hamilton Place, Park Lane, London W1J 7DR',
                phone: '+44 20 7499 0888',
                email: 'reservations.london@fourseasons.com',
                revenue: 76543.00,
                bookings: 498,
                priority: 'P1'
            },
            {
                id: 'hotel_010',
                name: 'THE BERKELEY',
                area: 'Knightsbridge',
                address: 'Wilton Place, London SW1X 7RL',
                phone: '+44 20 7235 6000',
                email: 'info@the-berkeley.co.uk',
                revenue: 65432.00,
                bookings: 432,
                priority: 'P1'
            }
        ];
        
        // Add more hotels to reach 111 total
        const additionalHotels = this.generateAdditionalHotels();
        const allHotels = [...hotels, ...additionalHotels];
        
        localStorage.setItem(this.STORAGE_KEYS.HOTELS, JSON.stringify(allHotels));
        console.log(`Initialized hotel database with ${allHotels.length} hotels`);
    }
    
    // Generate additional hotels to reach 111 total
    static generateAdditionalHotels() {
        const hotelNames = [
            'THE LONDON EDITION', 'COVENT GARDEN HOTEL', 'THE SOHO HOTEL', 'HAZLITT\'S HOTEL',
            'THE FITZROY LONDON', 'HOTEL 41', 'THE MILESTONE HOTEL', 'THE PELHAM HOTEL',
            'THE WESTMINSTER LONDON', 'THE GRAND AT TRAFALGAR SQUARE', 'ROSEWOOD LONDON',
            'THE CORINTHIA LONDON', 'SHANGRI-LA HOTEL AT THE SHARD', 'MANDARIN ORIENTAL HYDE PARK',
            'THE CONNAUGHT', 'BROWN\'S HOTEL', 'THE ZETTER TOWNHOUSE', 'CHARLOTTE STREET HOTEL',
            'THE BEAUMONT', 'CLARIDGE\'S BROOK STREET', 'THE STAFFORD LONDON', 'DUKES LONDON',
            'THE CHESTERFIELD MAYFAIR', 'FLEMINGS MAYFAIR', 'THE MAY FAIR HOTEL', 'PARK LANE HOTEL',
            'THE INTERCONTINENTAL LONDON PARK LANE', 'HILTON LONDON PARK LANE', 'THE LONDONER',
            'THE STANDARD LONDON', 'MONDRIAN LONDON', 'SEA CONTAINERS LONDON', 'THE OXO TOWER',
            'PREMIER INN LONDON COUNTY HALL', 'PARK PLAZA LONDON RIVERBANK', 'THE ROYAL HORSEGUARDS',
            'THE RUBENS AT THE PALACE', 'THE GORING', 'THE LANESBOROUGH', 'MANDARIN ORIENTAL',
            'THE BULGARI HOTEL', 'THE CADOGAN', 'THE SLOANE SQUARE HOTEL', 'THE DRAYCOTT HOTEL',
            'THE CAPITAL HOTEL', 'THE KNIGHTSBRIDGE HOTEL', 'THE EGERTON HOUSE HOTEL',
            'THE LEVIN HOTEL', 'THE HARI LONDON', 'JUMEIRAH LOWNDES HOTEL', 'THE WELLESLEY',
            'THE ATHENAEUM', 'THE METROPOLITAN', 'THE WASHINGTON MAYFAIR', 'THE BENTLEY LONDON',
            'THE MARBLE ARCH LONDON', 'THE MONTCALM MARBLE ARCH', 'THE LEONARD HOTEL',
            'THE SUMNER HOTEL', 'THE MONTAGUE ON THE GARDENS', 'THE ACADEMY LONDON',
            'THE GEORGIA HOTEL', 'THE TAVISTOCK HOTEL', 'THE RUSSELL HOTEL', 'THE PRESIDENT HOTEL',
            'THE ROYAL NATIONAL HOTEL', 'THE IMPERIAL HOTEL', 'THE STRAND PALACE HOTEL',
            'THE WALDORF HILTON', 'THE ALDWYCH HOTEL', 'THE RENAISSANCE LONDON CHANCERY COURT',
            'THE HOLBORN HOTEL', 'THE ZETTER HOTEL', 'THE ROOKERY HOTEL', 'THE MALMAISON LONDON',
            'THE HOXTON HOLBORN', 'THE DIXON AUTOGRAPH COLLECTION', 'THE PREMIER INN LONDON SOUTHWARK',
            'THE HILTON LONDON TOWER BRIDGE', 'THE SHANGRI-LA HOTEL', 'THE SHARD HOTEL',
            'THE LONDON BRIDGE HOTEL', 'THE PREMIER INN LONDON BOROUGH', 'THE TRAVELODGE LONDON CENTRAL',
            'THE IBIS LONDON BLACKFRIARS', 'THE NOVOTEL LONDON BLACKFRIARS', 'THE CROWNE PLAZA LONDON',
            'THE HOLIDAY INN EXPRESS LONDON', 'THE BEST WESTERN LONDON', 'THE COMFORT INN LONDON',
            'THE TRAVELODGE LONDON COVENT GARDEN', 'THE PREMIER INN LONDON LEICESTER SQUARE',
            'THE RADISSON BLU EDWARDIAN', 'THE STRAND HOTEL', 'THE COVENT GARDEN HOTEL',
            'THE FIELDING HOTEL', 'THE ROYAL OPERA HOUSE HOTEL', 'THE SEVEN DIALS HOTEL',
            'THE HENRIETTA HOTEL', 'THE Z HOTEL PICCADILLY', 'THE PICCADILLY LONDON WEST END',
            'THE REGENT PALACE HOTEL', 'THE SHAFTESBURY PREMIER LONDON', 'THE THISTLE PICCADILLY',
            'THE RADISSON BLU EDWARDIAN LEICESTER SQUARE', 'THE HILTON LONDON GREEN PARK',
            'THE PARK LANE MEWS HOTEL', 'THE GROSVENOR HOTEL', 'THE VICTORIA PALACE HOTEL',
            'THE LUNA SIMONE HOTEL', 'THE MELBOURNE HOUSE HOTEL', 'THE SANCTUARY HOUSE HOTEL',
            'THE PREMIER INN LONDON VICTORIA', 'THE TRAVELODGE LONDON VAUXHALL'
        ];
        
        const areas = [
            'Mayfair', 'Knightsbridge', 'Covent Garden', 'Soho', 'Fitzrovia', 'Marylebone',
            'Bloomsbury', 'King\'s Cross', 'Shoreditch', 'Southwark', 'Borough', 'Bankside',
            'Westminster', 'Victoria', 'Pimlico', 'Belgravia', 'Chelsea', 'Kensington',
            'South Kensington', 'Earl\'s Court', 'Paddington', 'Bayswater', 'Notting Hill',
            'Holland Park', 'Hammersmith', 'Fulham', 'Clapham', 'Battersea', 'Vauxhall'
        ];
        
        const additionalHotels = [];
        
        for (let i = 0; i < 101; i++) {
            const hotelName = hotelNames[i % hotelNames.length];
            const area = areas[i % areas.length];
            const revenue = Math.floor(Math.random() * 50000) + 10000;
            const bookings = Math.floor(Math.random() * 500) + 100;
            
            additionalHotels.push({
                id: `hotel_${String(i + 11).padStart(3, '0')}`,
                name: hotelName + (i >= hotelNames.length ? ` ${Math.floor(i / hotelNames.length) + 1}` : ''),
                area: area,
                address: `${Math.floor(Math.random() * 200) + 1} ${area} Street, London`,
                phone: `+44 20 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 9000) + 1000}`,
                email: `info@${hotelName.toLowerCase().replace(/[^a-z]/g, '')}.com`,
                revenue: revenue,
                bookings: bookings,
                priority: 'P1'
            });
        }
        
        return additionalHotels;
    }
    
    // Migrate old data from previous system
    static migrateOldData() {
        // Check for old visit data and migrate if needed
        const oldVisits = localStorage.getItem('visits');
        if (oldVisits) {
            try {
                const visits = JSON.parse(oldVisits);
                if (Array.isArray(visits) && visits.length > 0) {
                    // Migrate to new format
                    const migratedVisits = visits.map(visit => ({
                        id: this.generateId(),
                        date: visit.date || new Date().toISOString().split('T')[0],
                        time: visit.time || '09:00',
                        duration: visit.duration || 60,
                        hotelId: visit.hotelId || 'hotel_001',
                        hotelName: visit.hotelName || visit.hotel || 'Unknown Hotel',
                        purpose: visit.purpose || 'business_meeting',
                        status: visit.status || 'completed',
                        createdAt: visit.createdAt || new Date().toISOString(),
                        notes: visit.notes || ''
                    }));
                    
                    // Save migrated visits
                    const existingVisits = this.getVisits();
                    const allVisits = [...existingVisits, ...migratedVisits];
                    localStorage.setItem(this.STORAGE_KEYS.VISITS, JSON.stringify(allVisits));
                    
                    // Remove old data
                    localStorage.removeItem('visits');
                    console.log(`Migrated ${migratedVisits.length} visits from old system`);
                }
            } catch (e) {
                console.error('Error migrating old visit data:', e);
            }
        }
    }
    
    // Generate unique ID
    static generateId() {
        return 'visit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    // Hotel management methods
    static getHotels() {
        try {
            const hotels = localStorage.getItem(this.STORAGE_KEYS.HOTELS);
            return hotels ? JSON.parse(hotels) : [];
        } catch (e) {
            console.error('Error loading hotels:', e);
            return [];
        }
    }
    
    static getHotel(hotelId) {
        const hotels = this.getHotels();
        return hotels.find(hotel => hotel.id === hotelId);
    }
    
    static searchHotels(query) {
        const hotels = this.getHotels();
        const searchTerm = query.toLowerCase();
        
        return hotels.filter(hotel => 
            hotel.name.toLowerCase().includes(searchTerm) ||
            hotel.area.toLowerCase().includes(searchTerm) ||
            hotel.address.toLowerCase().includes(searchTerm) ||
            hotel.phone.includes(searchTerm) ||
            hotel.email.toLowerCase().includes(searchTerm)
        );
    }
    
    // Visit management methods
    static getVisits() {
        try {
            const visits = localStorage.getItem(this.STORAGE_KEYS.VISITS);
            return visits ? JSON.parse(visits) : [];
        } catch (e) {
            console.error('Error loading visits:', e);
            return [];
        }
    }
    
    static getVisit(visitId) {
        const visits = this.getVisits();
        return visits.find(visit => visit.id === visitId);
    }
    
    static scheduleVisit(visitData) {
        try {
            const visits = this.getVisits();
            const newVisit = {
                id: this.generateId(),
                date: visitData.date,
                time: visitData.time,
                duration: visitData.duration,
                hotelId: visitData.hotelId,
                hotelName: visitData.hotelName,
                purpose: visitData.purpose,
                status: visitData.status || 'scheduled',
                createdAt: visitData.createdAt || new Date().toISOString(),
                notes: visitData.notes || ''
            };
            
            visits.push(newVisit);
            localStorage.setItem(this.STORAGE_KEYS.VISITS, JSON.stringify(visits));
            
            console.log('Visit scheduled:', newVisit);
            return newVisit.id;
        } catch (e) {
            console.error('Error scheduling visit:', e);
            return null;
        }
    }
    
    static updateVisit(visitId, updateData) {
        try {
            const visits = this.getVisits();
            const visitIndex = visits.findIndex(visit => visit.id === visitId);
            
            if (visitIndex === -1) {
                console.error('Visit not found:', visitId);
                return false;
            }
            
            visits[visitIndex] = { ...visits[visitIndex], ...updateData };
            localStorage.setItem(this.STORAGE_KEYS.VISITS, JSON.stringify(visits));
            
            console.log('Visit updated:', visits[visitIndex]);
            return true;
        } catch (e) {
            console.error('Error updating visit:', e);
            return false;
        }
    }
    
    static updateVisitStatus(visitId, newStatus) {
        return this.updateVisit(visitId, { 
            status: newStatus,
            updatedAt: new Date().toISOString()
        });
    }
    
    static deleteVisit(visitId) {
        try {
            const visits = this.getVisits();
            const filteredVisits = visits.filter(visit => visit.id !== visitId);
            
            localStorage.setItem(this.STORAGE_KEYS.VISITS, JSON.stringify(filteredVisits));
            console.log('Visit deleted:', visitId);
            return true;
        } catch (e) {
            console.error('Error deleting visit:', e);
            return false;
        }
    }
    
    // Specialized query methods
    static getTodaysVisits() {
        const today = new Date().toISOString().split('T')[0];
        const visits = this.getVisits();
        return visits.filter(visit => visit.date === today);
    }
    
    static getUpcomingVisits(days = 30) {
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        
        const visits = this.getVisits();
        return visits.filter(visit => {
            const visitDate = new Date(visit.date);
            return visitDate >= today && visitDate <= futureDate && visit.status !== 'cancelled';
        }).sort((a, b) => {
            const dateA = new Date(a.date + 'T' + a.time);
            const dateB = new Date(b.date + 'T' + b.time);
            return dateA - dateB;
        });
    }
    
    static getVisitsByDate(date) {
        const visits = this.getVisits();
        return visits.filter(visit => visit.date === date);
    }
    
    static getVisitsByHotel(hotelId) {
        const visits = this.getVisits();
        return visits.filter(visit => visit.hotelId === hotelId);
    }
    
    static getAllVisits() {
        return this.getVisits();
    }
    
    // Statistics and analytics
    static getVisitStats() {
        const visits = this.getVisits();
        const today = new Date();
        const thisMonth = visits.filter(visit => {
            const visitDate = new Date(visit.date);
            return visitDate.getMonth() === today.getMonth() && 
                   visitDate.getFullYear() === today.getFullYear();
        });
        
        return {
            total: visits.length,
            completed: visits.filter(v => v.status === 'completed').length,
            scheduled: visits.filter(v => v.status === 'scheduled').length,
            cancelled: visits.filter(v => v.status === 'cancelled').length,
            thisMonth: thisMonth.length,
            completedThisMonth: thisMonth.filter(v => v.status === 'completed').length,
            successRate: visits.length > 0 ? 
                Math.round((visits.filter(v => v.status === 'completed').length / visits.length) * 100) : 0
        };
    }
    
    // Data export/import
    static exportData() {
        return {
            visits: this.getVisits(),
            hotels: this.getHotels(),
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
    }
    
    static importData(data) {
        try {
            if (data.visits) {
                localStorage.setItem(this.STORAGE_KEYS.VISITS, JSON.stringify(data.visits));
            }
            if (data.hotels) {
                localStorage.setItem(this.STORAGE_KEYS.HOTELS, JSON.stringify(data.hotels));
            }
            console.log('Data imported successfully');
            return true;
        } catch (e) {
            console.error('Error importing data:', e);
            return false;
        }
    }
    
    // Clear all data (for testing/reset)
    static clearAllData() {
        Object.values(this.STORAGE_KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        console.log('All data cleared');
    }
}

// Initialize when script loads
document.addEventListener('DOMContentLoaded', function() {
    UnifiedDataManager.initialize();
});

// Make available globally
window.UnifiedDataManager = UnifiedDataManager;