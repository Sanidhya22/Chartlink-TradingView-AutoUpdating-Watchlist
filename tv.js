
document.querySelector('div[data-name="add-symbol-button"]')?.click();

function simulateEnterKeyPress(target) {
    const keyboardEvent = new KeyboardEvent('keydown', {
        bubbles: true, // Event bubbles up the DOM
        cancelable: true,
        key: 'Enter',
        keyCode: 13 // keyCode for Enter key
    });
    target.dispatchEvent(keyboardEvent);
}


setTimeout(() => {

    (async () => {


        try {

            const inputElement = document.querySelector('[data-role="search"]');

            // Check if the input element is found
            if (inputElement) {
                inputElement.focus();
                chrome.storage.local.get('screenerList', (data) => {

                    selectedStocks = data.screenerList

                    // Set the clipboard text as the value of the input
                    inputElement.value = selectedStocks

                    // Optionally, if there's a need to trigger a change event manually (for some frameworks or vanilla JS that watches for changes):
                    inputElement.dispatchEvent(new Event('change', { bubbles: true }));

                    // Simulating pressing Enter in the input field
                    setTimeout(() => {
                        simulateEnterKeyPress(inputElement);
                    }, 300); // A

                });
                // Or, if instead the form should be submitted directly, you can try:
                // inputElement.form.submit(); // Uncomment this if applicable
            } else {
                console.error('Input element not found.');
            }
        } catch (error) {
            console.error('Error accessing the clipboard or finding the input.', error);
        }
    })();

}, 1000);
