function insertDropezone(modalWindow, btnPrimary) {
    console.log('функция insertDropezone');
    const iframe = createGetIframe();
    document.body.addEventListener("DOMNodeRemoved", removeUploadListener, false);
    modalWindow.appendChild(iframe);
    setUploadListener(btnPrimary);
}

function setUploadListener(btnPrimary) {
    window.addEventListener("message", onMessageUploadListener.bind(null, btnPrimary));
    btnPrimary.onclick = onClickBtnPrimaryHandler.bind(null, btnPrimary);
    console.log('событие на сообщение установлено');
}

function removeUploadListener() {
    const modalWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
    if (modalWindow) return;
    window.removeEventListener("message", onMessageUploadListener);
    document.body.removeEventListener("DOMNodeRemoved", removeUploadListener, false);
    console.log('событие на сообщение удалено');
}

function onMessageUploadListener(btnPrimary, event) {
    if (event.data == 'uploading') {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton
         dijitButtonDisabled dijitDisabled dijitButtonFocused dijitButtonDisabledFocused dijitDisabledFocused dijitFocused`;
    }
    else if (event.data == 'complete') {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
    }
    else {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
    }
}

function onClickBtnPrimaryHandler(btnPrimary) {
    btnPrimary.onclick = null;
    let fileName = '';
    console.log('нажата кнопка ОК');
    const textrareaId = $('.tm1webAddAnnotationDialog').find('textarea').attr('id');
    const annotationDialog = document.getElementById(textrareaId);
    if (sessionStorage.attachments) fileName = sessionStorage.attachments;
    annotationDialog.value = `${annotationDialog.value}${sessionStorage.attachments}`;
    // require(['dojo','dijit'], function (dojo, dijit) {
    //         dijit.byId(textrareaId).setValue(annotationDialogText);
    // });
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

export { insertDropezone }