// 1. функция добавления dropeZone
function insertDropezone(modalWindow, btnPrimary) {

    const btnPrimaryClass = document.getElementsByClassName('tm1WebBtnPrimary')[0];
    console.log('функция insertDropezone');
    const iframe = createGetIframe();
    document.body.addEventListener("DOMNodeRemoved", removeUploadListener.bind(null, modalWindow), false);
    modalWindow.appendChild(iframe);
    setUploadListener(btnPrimary, btnPrimaryClass);
}
// 4. функция блокировки/разблокировки кнопки ОК
function onMessageUploadListener(btnPrimary, btnPrimaryClass, event) {

    if (event.data == 'uploading') {

        btnPrimaryClass.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton
         dijitButtonDisabled dijitDisabled dijitButtonFocused dijitButtonDisabledFocused dijitDisabledFocused dijitFocused`;
    }
    else if (event.data == 'complete') {

        btnPrimaryClass.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
    }
    else {

        const annotationDialogValue = getTextAreaValue();
        if (annotationDialogValue && annotationDialogValue.length > 0) {
            btnPrimaryClass.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
        }
    }
}
// удаляем слушателя на удаление модального окна
function removeUploadListener(modalWindow) {

    if (modalWindow) return;

    window.onmessage = null;
    document.body.removeEventListener("DOMNodeRemoved", removeUploadListener, false);
    console.log('событие на сообщение удалено');
}
// 5. функция сохранения комментария, содержащего сообщение пользователя + имя подгруженного файла
function onClickBtnPrimaryHandler(btnPrimary, btnPrimaryClass) {

    if (btnPrimaryClass.className.includes('dijitButtonDisabled')) return;

    btnPrimary.onclick = null;
    let fileName = '';
    console.log('нажата кнопка ОК');
    const textrareaId = $('.tm1webAddAnnotationDialog').find('textarea').attr('id');
    const annotationDialogValue = getTextAreaValue(textrareaId);
    if (sessionStorage.attachments) fileName = sessionStorage.attachments;

    require(['dojo', 'dijit'], function (dojo, dijit) {

        dijit.byId(textrareaId).setValue(`${annotationDialogValue}${fileName}`);
    });
    delete sessionStorage.attachments;
}
// 3. функция обработки клика ОК после подгрузки файла
function setUploadListener(btnPrimary, btnPrimaryClass) {

    window.onmessage = onMessageUploadListener.bind(null, btnPrimary, btnPrimaryClass);
    btnPrimary.onclick = onClickBtnPrimaryHandler.bind(null, btnPrimary, btnPrimaryClass);
    console.log('событие на сообщение установлено');
}
// 2. создаем iframe, куда подгружаем файл
function createGetIframe() {

    const currentDate = new Date();
    const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();
    const userName = $('#ibm-banner-welcome').text();
    const iframe = document.createElement('iframe');
    iframe.style.border = '0px';
    iframe.style.height = '130px';
    iframe.style.marginBottom = '24px';
    iframe.style.width = '100%';
    iframe.src = `/tm1web/upload/app/iframe.html?serverName=${serverName}&ver=300&formname=${formname}&currentDate=${currentDate}&user=${userName}`

    return iframe;
}

function getTextAreaValue(textrareaId) {
    
    const annotationDialog = document.getElementById(textrareaId);
    if (annotationDialog)
     return annotationDialog.value;
}

export { insertDropezone }