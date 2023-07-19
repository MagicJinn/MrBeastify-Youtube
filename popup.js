var toggle = document.getElementById('toggle');

toggle.addEventListener('change', function (event) {
    document.getElementById('reloadHint').style.visibility = 'visible';

    var newState = event.target.checked;
    // Save the state to storage
    chrome.storage.local.set({ toggleState: newState });
});


// Retrieve the stored state on popup load
chrome.storage.local.get('toggleState', function (data) {
    toggle.checked = data.toggleState;
});