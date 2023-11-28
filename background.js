function handleTabCreated(tab) {
    console.log("New tab created:", tab);
    console.log("URL of the new tab:", tab.url);
    chrome.tabs.sendMessage(tab.id, { action: 'newTab', url: tab.url });
}

function handleTabUpdated(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        console.log("Tab updated:", tab);
        console.log("URL of the tab:", tab.url);
    }
}

chrome.tabs.onCreated.addListener(handleTabCreated);
chrome.tabs.onUpdated.addListener(handleTabUpdated);
