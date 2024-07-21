let autoUpdateInterval;

function startAutomaticUpdates() {
    clearInterval(autoUpdateInterval); // Clear any existing interval

    autoUpdateInterval = setInterval(() => {
        const now = new Date();
        const start = new Date();
        start.setHours(9, 0, 0); // 9:00 AM
        const end = new Date();
        end.setHours(15, 30, 0); // 3:30 PM

        // if (now >= start && now <= end) {
        console.log('loop');
        injectContentScript();
        // }
    }, 5000); // Adjust interval time as needed
}

function stopAutomaticUpdates() {
    clearInterval(autoUpdateInterval); // Stops the interval
}

// Combined logic into a single listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if (message.action === "startAutomaticUpdates") {
        startAutomaticUpdates();
    } else if (message.action === "stopAutomaticUpdates") {
        stopAutomaticUpdates();
    }
});

// Renamed for clarity, and to directly call without messaging
function injectContentScript() {
    console.log('Injecting Content Script');
    chrome.tabs.query({ url: "https://chartink.com/screener/*" }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["main.js"],
            }).then(() => {
                console.log("Chartink script injected");
                addItemInTV(); // Ensure this call is appropriate here
            });
        }
    });
}

// This remains unchanged, but ensure `chrome.tabs.query` is needed each time
const addItemInTV = () => {
    chrome.tabs.query({ url: "https://www.tradingview.com/*" }, (tabs) => {
        if (tabs.length > 0) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ["tv.js"],
            }).then(() => {
                console.log("TradingView script injected");
            });
        }
    });
};


chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    checkTabs();
});

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    checkTabs();
});


function checkTabs() {
    let urls = ["https://chartink.com/screener/", "https://www.tradingview.com"];
    let found = [false, false];
    chrome.tabs.query({}, function (tabs) {

        tabs.forEach(function (tab) {
            if (tab.url.includes(urls[0])) found[0] = true;
            if (tab.url.includes(urls[1])) found[1] = true;
        });
        chrome.storage.local.set({ enableButton: found[0] && found[1] });
    });
}