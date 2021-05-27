function replaceComments(gridContent) {

    gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
}

function InsertPresentationRoleElemHandler() {
    const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
    if (gridContent && gridContent.children.length > 0) {

        setTimeout(replaceTable, 200);
        gridContent.removeEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
    }
}

function replaceTable() {
  const user = getUserName();
  const scrollBoxTurnOff = document.getElementsByClassName('dojoxGridScrollbox')[0];
  scrollBoxTurnOff.style.overflow = 'hidden';
    let lastPresentationElem = document.getElementsByClassName('dojoxGridContent')[0].lastElementChild;
    const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
    var settings = {
        "url": `/tm1web/upload/app/createTable.jsp?serverName=${serverName}&formname=${formname}&user=${user}`,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "text/html"
        },
        "data": lastPresentationElem.innerHTML
      };

      $.ajax(settings).done(function (response) {
        scrollBoxTurnOff.style.overflow = 'auto';
        const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
        let lastPresentationElem = document.getElementsByClassName('dojoxGridContent')[0].lastElementChild;
        lastPresentationElem.innerHTML = response;
        gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
      });
}

function getUserName() {
    const userName = $('#ibm-banner-welcome').text();
    return userName;
}

export { replaceComments }