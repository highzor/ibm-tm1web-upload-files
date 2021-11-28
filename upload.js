import {insertDropezone} from './dropezoneScript.js';
import {replaceComments, removeFile, downloadFiles} from './replaceCommentScript.js';

// 1. как только загрузился DOM запускается функция 'ready()'
document.addEventListener("DOMContentLoaded", ready);

function ready() {

    window.removeFile = removeFile;
    window.downloadFiles = downloadFiles;

    const InsertOrDeleteDomElemEventHandler = (event) => {

        // 3. модальное окно с просмотром комментариев ИЛИ подгрузкой файлов
        const modalWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
        const modalWindowType = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].type : undefined : undefined;
        const modalWindowClass = modalWindow ? modalWindow.children[0] ? modalWindow.children[0].classList[0] : undefined : undefined;
        const id = $('.tm1WebBtnPrimary').children('span').children('span').attr('id');
        const btnPrimary = document.getElementById(id);
        const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
        const tm1webDialogButtons = document.getElementsByClassName('tm1webDialogButtons')[0];

        // если открытие модалки с подгрузкой файлов, то запускаем функцию 'insertDropezone()'
        if (event.type == 'DOMNodeInserted' && modalWindowType == 'textarea' && btnPrimary) {

            console.log('textArea event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            insertDropezone(modalWindow, btnPrimary);
        }
        // если закрытие любого из модального окон, то 
        else if (event.type == 'DOMNodeRemoved' && !modalWindow) {

            console.log('remove event');
            document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.removeEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
        }
        // если открытие модалки с комментариями, то запускаем функцию 'replaceComments'
        else if (event.type == 'DOMNodeInserted' && modalWindowClass == 'tm1WebAnotationGridContainer' && gridContent && tm1webDialogButtons) {
            
            console.log('filesList event');
            document.body.removeEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);
            document.body.addEventListener("DOMNodeRemoved", InsertOrDeleteDomElemEventHandler, false);
            replaceComments(gridContent, tm1webDialogButtons);
        }
    }

    // 2. как только произойдет какое-либо изменение в DOM (закрытие/открытие html элемента), запустится 'InsertOrDeleteDomElemEventHandler'
    document.body.addEventListener("DOMNodeInserted", InsertOrDeleteDomElemEventHandler, false);

}