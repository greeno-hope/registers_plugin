//@ sourceURL = marker.js

/*
    marker.js
    Injected into the register page (we hope! - no error checking for that) and
    manipulates the DOM according to a passed in list of students that were present in the
    seminar/tutorial for which we are marking presence.
 */

/*
    This function just finds the radio boxes associated with a student (by ID - bad HTML)
    and checks the radio boxes according to the passed in 'present' boolean.
 */
function setStudentPresent(studentRow, studentId, present) {
    const id = 'att_' + studentId;
    const selectorString = '[id=' + id + ']';
    const radios = Array.from(document.querySelectorAll(selectorString));
    radios[0].checked = present;
    radios[1].checked = !present;
}

/*
    This function is called when the ID list from the chat log is sent by the background page (in the plugin context)
    to this injected script on the register page). All it does is loop the students on the register page
    and looks for the ID associated with that student row in the passed in list. If found the student was
    present (or at least remembered to enter an ID) if not found the student was absent.
 */
chrome.runtime.onMessage.addListener(

    function(message, sender) {

        // Get the students who entered an ID into the chat
        const studentIds = message.mark_student_ids;

        // Get each of the student rows on the page (if we are on the page - need error reporting ??)
        const studentRows = document.body.getElementsByClassName("row no-gutters student-row mt-1 mb-1")

        // Iterate the student rows setting them present or absent according to the studentIds array
        for(const studentRow of studentRows) {
            const studentRowElements = studentRow.children;
            const onFormStudentId = studentRowElements[3].innerHTML;
            if(studentIds.indexOf(onFormStudentId.toString()) != -1) {
                setStudentPresent(studentRow, onFormStudentId, true);
            } else {
                setStudentPresent(studentRow, onFormStudentId, false);
            }
        }
    });