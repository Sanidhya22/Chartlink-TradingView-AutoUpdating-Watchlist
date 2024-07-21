copyHeadingText()

async function copyHeadingText() {
    const allTags = [];
    getToFirstPage()
    const numberOfPages = getPaginationLength();

    let i = 0;
    while (i < numberOfPages) {
        if (i > 0) {
            await delay(200); // Wait before fetching and clicking next
        }
        allTags.push(
            document.querySelectorAll(
                'a[href^="https://in.tradingview.com/chart/?symbol=NSE:"]'
            )
        );
        // Navigate to next page
        nextPage(); // Clicks on the next button
        i++;
    }
    const flattenedArray = flattenNodeListArray(allTags);

    const symbols = extractSymbols(flattenedArray);

    const uniqueSymbols = [...new Set(symbols)];

    chrome.storage.local.set({ screenerList: uniqueSymbols });
    createFakeTextAreaToCopyText(symbols)

}


function getPaginationLength() {
    //Get li tags of the pagination list

    const paginationList = document
        .getElementsByClassName("pagination")[0]
        .getElementsByTagName("li");

    // Second last pagination element contains the last page number

    return paginationList[paginationList.length - 2].innerText;
}


function nextPage() {
    document.evaluate("//a[text()='Next']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null)
        .singleNodeValue.click();

}

async function waitForNavigationToComplete() {
    await delay(200);
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function flattenNodeListArray(arrayOfNodeLists) {
    // Transform each NodeList into an array and flatten the structure
    return [].concat(...arrayOfNodeLists.map(nodeList => [...nodeList]));
}


function extractSymbols(elements) {
    return elements.map(element => {
        const url = new URL(element.href); // Create a URL object
        return url.searchParams.get("symbol"); // Extract the 'symbol' query parameter
    });
}

function getToFirstPage() {
    var element = document.querySelector('a[data-dt-idx="0"]');

    // Check if the element exists to avoid errors
    if (element) {
        // Simulate a click on the element
        element.click();
    }
}