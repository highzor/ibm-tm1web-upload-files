import {insertDropezone} from './dropezoneScript.js';

document.addEventListener("DOMContentLoaded", ready);

function ready() {

    const switcherEvents = (event) => {

    }

    // 2.
    const InsertOrDeleteDomElemEventHandler = (event) => {

        //модальное окно с комментарием || с файлами
        let modalWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
        let modalWindowType = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].type : undefined : undefined;
        let modalWindowClass = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].classList[0] : undefined : undefined;

        if (event.type == 'DOMNodeInserted' && modalWindow) {

            console.log('insert event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
        }
        else if (event.type == 'DOMNodeRemoved' && !modalWindow) {

            console.log('remove event');
            document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.removeEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
        }
        if (event.type == 'DOMNodeInserted' && modalWindowType == 'textarea') {

            console.log('textArea event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            insertDropezone(modalWindow);
        }
        else if (event.type == 'DOMNodeInserted' && modalWindowClass == 'tm1WebAnotationGridContainer') {
            console.log('filesList event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
        }
    }

    // 1.
    document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);

}