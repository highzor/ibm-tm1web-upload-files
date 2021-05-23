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
    let lastPresentationElem = document.getElementsByClassName('dojoxGridContent')[0].lastElementChild;
    let fileName = 'package-lock.json';
    let serverName = 'Rosseti_DUS';
    let formname = 'ОФК_01';
    var settings = {
        "url": `/tm1web/upload/app/createTable.jsp?fileName=${fileName}&serverName=${serverName}&formname=${formname}`,
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "text/html"
        },
        "data": lastPresentationElem.innerHTML
      };

      $.ajax(settings).done(function (response) {
        const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
        gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
        console.log(response);
      });
}

export { replaceComments }