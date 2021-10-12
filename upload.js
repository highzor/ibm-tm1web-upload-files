import {insertDropezone} from './dropezoneScript.js';
import {replaceComments, removeFile, downloadFiles} from './replaceCommentScript.js';

document.addEventListener("DOMContentLoaded", ready);

function ready() {

    window.removeFile = removeFile;
    window.downloadFiles = downloadFiles;

    // 2.
    const InsertOrDeleteDomElemEventHandler = (event) => {

        //модальное окно с комментарием || с файлами
        const modalWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
        const modalWindowType = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].type : undefined : undefined;
        const modalWindowClass = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].classList[0] : undefined : undefined;
        const id = $('.tm1WebBtnPrimary').children('span').children('span').attr('id');
        const btnPrimary = document.getElementById(id);
        const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
        const tm1webDialogButtons = document.getElementsByClassName('tm1webDialogButtons')[0];

        if (event.type == 'DOMNodeInserted' && modalWindowType == 'textarea' && btnPrimary) {

            console.log('textArea event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            insertDropezone(modalWindow, btnPrimary);
        }
        else if (event.type == 'DOMNodeRemoved' && !modalWindow) {

            console.log('remove event');
            document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.removeEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
        }
        else if (event.type == 'DOMNodeInserted' && modalWindowClass == 'tm1WebAnotationGridContainer' && gridContent && tm1webDialogButtons) {
            
            console.log('filesList event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            replaceComments(gridContent, tm1webDialogButtons);
        }
    }

    // 1.
    document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);

}