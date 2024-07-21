console.log("in popup");
const handleButtonClick = () => {

    chrome.runtime.sendMessage({ action: "startAutomaticUpdates" });
}

const stopInterval = () => {
    chrome.runtime.sendMessage({ action: "stopAutomaticUpdates" });
}


function updateButtonState() {
    chrome.storage.local.get("enableButton", function (data) {
        const btnStart = document.getElementById('start');
        const btnStop = document.getElementById('stop');
        const shouldBeEnabled = data.enableButton;

        btnStart.disabled = !shouldBeEnabled;

        if (shouldBeEnabled) {
            // Add the event listener if it should be enabled
            // Note: It's safe to repeatedly call this if the exact same function is used

            btnStart.addEventListener('click', handleButtonClick, false);
        } else {
            // Remove the event listener if it should not be enabled
            // If it was never added (or already removed), this call has no effect
            btnStart.removeEventListener('click', handleButtonClick, false);
            stopInterval()
        }

        btnStop.addEventListener('click', stopInterval, false);
    });
}

updateButtonState();



