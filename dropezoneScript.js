function insertDropezone(modalWindow) {
    let iframe = createGetIframe();
    document.body.addEventListener("DOMNodeRemoved", removeUploadListener, false);
    modalWindow.appendChild(iframe);
    setUploadListener();
}

function setUploadListener() {
    window.addEventListener("message", uploadListener);
    console.log('событие на сообщение установлено');
}

function removeUploadListener() {
    let modalWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
    if (modalWindow) return;
    window.removeEventListener("message", uploadListener);
    document.body.removeEventListener("DOMNodeRemoved", removeUploadListener, false);
    console.log('событие на сообщение удалено');
}

function uploadListener(event) {
    let btnPrimary = document.getElementsByClassName('tm1WebBtnPrimary')[0];
    if (event.data == 'uploading') {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton
         dijitButtonDisabled dijitDisabled dijitButtonFocused dijitButtonDisabledFocused dijitDisabledFocused dijitFocused`;
    }
    else if (event.data.indexOf("setImmediate") !== 0) {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
        let attachmentText = event.data;
        console.log(attachmentText);
    }
    else {
        btnPrimary.className = `dijit dijitReset dijitInline tm1webButton tm1WebBtnPrimary dijitButton`;
        alert(event.data);
    }
}



function createGetIframe() {

    let currentDate = new Date();
    let formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();

    let iframe = document.createElement('iframe');
    iframe.style.border = '0px';
    iframe.style.height = '130px';
    iframe.style.marginBottom = '24px';
    iframe.style.width = '100%';
    iframe.src = `/tm1web/upload/app/iframe.html?serverName=${serverName}&ver=300&formname=${formname}&currentDate=${currentDate}`

    return iframe;
}

export { insertDropezone };