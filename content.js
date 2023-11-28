chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'newTab') {
        console.log("Received URL in content script:", message.url);
    }
});
