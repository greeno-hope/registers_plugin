//@ sourceURL = loader.js

/*
    loader.js
    This script is injected into a tab displaying the seminar log text file
    We are not doing any error checking to make sure this is the case but
    it won't find many student IDs if the context menu is invoked from
    anywhere else!

    It just parses the chat log and extracts a list of student IDs which it sends
    back to the background.js script (the actual plugin/extension)
 */

/*
    Uses a regex to find 8 digit sequences in the text file
    No real error checking done here. It's not really for general use.
 */
function parseBodyText() {
    const textElements = document.body.getElementsByTagName("pre");

    try {
        const text = textElements[0].innerText;
        const re = /\D(\d{8})\D/g;
        var ids = [...text.matchAll(re)];
        var studentIds = []
        for (const id of ids) {
            // Element in the iterable at index 1 is the 'capture text'!
            const studentId = id[1];
            studentIds.push(studentId);
        }
    } catch (err) {
        window.alert("This doesn't look like a pre-formatted chat text file!");
    }
    return studentIds;
}

/*
    Prompts the user to check that this tab should be searched for student IDs
 */
function promptForSearchPage() {
    return window.confirm('Search this text file?');
}

/*
    Prompts the user to load the 'found' student IDs
 */
function promptForLoadStudentIds() {
    return window.confirm('Found ' + studentIds.length + ' student IDs: Load these for marking?');
}

/*
    function doPostData()
    Posts the data back to the background.js script.
 */
function doPostDataToBackgroundPage(studentIds) {
    chrome.runtime.sendMessage({"load_student_ids": studentIds});
}

/*
    Main script.
 */
var studentIds = [];
var doSearch = false;
var doLoad = false;

doSearch = promptForSearchPage();
if (doSearch == true ) {
    studentIds = parseBodyText()
} else {
    console.log("Cancelled loading operation");
}

if(studentIds) {
    doLoad = promptForLoadStudentIds()
    if(doLoad) {
        doPostDataToBackgroundPage(studentIds);
    }
}

delete studentIds;
delete doSearch;
delete doLoad;


