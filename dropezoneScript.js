function insertDropezone(modalWindow, btnPrimary) {
    const btnPrimaryClass = document.getElementsByClassName('tm1WebBtnPrimary')[0];
    console.log('функция insertDropezone');
    const iframe = createGetIframe();
    document.body.addEventListener("DOMNodeRemoved", removeUploadListener.bind(null, modalWindow), false);
    modalWindow.appendChild(iframe);
    setUploadListener(btnPrimary, btnPrimaryClass);
}

function setUploadListener(btnPrimary, btnPrimaryClass) {
    document.body.addEventListener("message", onMessageUploadListener.bind(null, btnPrimaryClass));
    btnPrimary.onclick = onClickBtnPrimaryHandler.bind(null, btnPrimary, btnPrimaryClass);
    console.log('событие на сообщение установлено');
}

function removeUploadListener(modalWindow) {
    if (modalWindow) return;
    document.body.removeEventListener("message", onMessageUploadListener);
    document.body.removeEventListener("DOMNodeRemoved", removeUploadListener, false);
    console.log('событие на сообщение удалено');
}

function onMessageUploadListener(btnPrimaryClass, event) {
    if (event.data == 'uploading') {
        btnPrimaryClass.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton
         dijitButtonDisabled dijitDisabled dijitButtonFocused dijitButtonDisabledFocused dijitDisabledFocused dijitFocused`;
    }
    else {
        const annotationDialogValue = getTextAreaValue();
        if (annotationDialogValue.length > 0) {
            btnPrimaryClass.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
        }
    }
}

function onClickBtnPrimaryHandler(btnPrimary, btnPrimaryClass) {
    if (btnPrimaryClass.className.includes('dijitButtonDisabled')) return;

    btnPrimary.onclick = null;
    let fileName = '';
    console.log('нажата кнопка ОК');
    const textrareaId = $('.tm1webAddAnnotationDialog').find('textarea').attr('id');
    const annotationDialogValue = getTextAreaValue();
    if (sessionStorage.attachments) fileName = sessionStorage.attachments;

    require(['dojo','dijit'], function (dojo, dijit) {
        dijit.byId(textrareaId).setValue(`${annotationDialogValue}${fileName}`);
    });
    delete sessionStorage.attachments;
}

function createGetIframe() {

    const currentDate = new Date();
    const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();

    const iframe = document.createElement('iframe');
    iframe.style.border = '0px';
    iframe.style.height = '130px';
    iframe.style.marginBottom = '24px';
    iframe.style.width = '100%';
    iframe.src = `/tm1web/upload/app/iframe.html?serverName=${serverName}&ver=300&formname=${formname}&currentDate=${currentDate}`

    return iframe;
}

function getTextAreaValue() {
    const textrareaId = $('.tm1webAddAnnotationDialog').find('textarea').attr('id');
    const annotationDialog = document.getElementById(textrareaId);
    return annotationDialog.value;
}

export { insertDropezone }