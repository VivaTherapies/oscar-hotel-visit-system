// Clear contaminated localStorage data
// This script should be run once to clean up any existing cross-contaminated data

function clearContaminatedData() {
    console.log('Clearing contaminated localStorage data...');
    
    // List of keys that might have contaminated data
    const keysToCheck = [
        'visitFormDraft',
        'visitFormDraft_generic', 
        'businessCardImage',
        'businessCardImage_generic',
        'currentVisit'
    ];
    
    // Clear old generic keys
    keysToCheck.forEach(key => {
        if (localStorage.getItem(key)) {
            console.log(`Removing contaminated key: ${key}`);
            localStorage.removeItem(key);
        }
    });
    
    // Clear any keys that don't have hotel-specific suffixes
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
        if (key.startsWith('visitFormDraft_') && !key.includes('_')) {
            console.log(`Removing old format key: ${key}`);
            localStorage.removeItem(key);
        }
    });
    
    console.log('Contaminated data cleanup completed!');
    
    // Show user notification
    if (typeof showNotification === 'function') {
        showNotification('Form data cleaned up successfully!', 'success');
    } else {
        alert('Form data cleaned up successfully!');
    }
}

// Auto-run cleanup
clearContaminatedData();
