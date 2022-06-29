var contextMenus = {};
var studentIds;

/*
    Creates a context menu for loading a zoom chat (chat needs to be dragged into the
    browser and opened as a pre-formatted text file).
 */
contextMenus.createLoaderMenu =
    chrome.contextMenus.create(
        {"title": "Load Zoom Chat"},
        function () {
            console.log("ContextMenu : createLoaderMenu - created");
        }
    );

/*
    Creates a mark page menu for when the user is on the Hope Registers page
 */
contextMenus.createMarkerMenu =
    chrome.contextMenus.create(
        {"title": "Mark Page"},
        function () {
            console.log("ContextMenu : createMarkerMenu - created");
        }
    );

/*
    Menu listeners:
        1. createLoaderMenu - injects loader.js into the active tag
        2. createMarkerMenu - injects marker.js into the active tab THEN sends the
           tab a message containing the currently stores studentIds array
 */
chrome.contextMenus.onClicked.addListener(contextMenuHandler)
function contextMenuHandler(info, tab) {
    if(info.menuItemId === contextMenus.createLoaderMenu) {
        // Inject the loader script into the active tab
        chrome.tabs.executeScript({
            file : "js/loader.js"
        })
    }
    else if(info.menuItemId === contextMenus.createMarkerMenu) {
        // inject the marker script into the active tab
        chrome.tabs.executeScript({
            file : "js/marker.js"
        })
        // send the studentIds to the injected script as a message
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {"mark_student_ids": studentIds});
        });
    }
}

/*
    Receives a message from the injected loader.js script and sets a local variable in the background page
    This variable will be sent as a message to the active tab when the user selects the 'Mark Page'
    to the injected script (marker.js) in the active tab.
 */
chrome.runtime.onMessage.addListener(
    function(message, sender) {
        studentIds = message.load_student_ids;
    });