chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === 'getPapaplattify') {
        chrome.storage.local.get('toggleState', function (result) {
            // Send the value back to the content script
            sendResponse({ value: result.toggleState });
        });
    }
    return true; // Needed for sendResponse to work asynchronously
});
