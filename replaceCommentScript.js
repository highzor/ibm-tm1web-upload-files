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
  const formname = getFormname();
  const lastPresentationElem = document.getElementsByClassName('dojoxGridContent')[0].lastElementChild;
  const scrollBoxTurnOff = document.getElementsByClassName('dojoxGridScrollbox')[0];
  scrollBoxTurnOff.style.overflow = 'hidden';
  const settings = {
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
    lastPresentationElem.innerHTML = response;
    gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
  });
}

function removeFile(cellElement) {
  if (!confirm("Вы подтверждаете удаление?")) return false;
  const user = getUserName();
  const formname = getFormname();
  const fileName = cellElement.attr('data-href');

  const settings = {
    "url": `/tm1web/upload/app/remove.jsp?fileName=${fileName}&serverName=${serverName}&formname=${formname}&user=${user}`,
    "method": "POST",
    "timeout": 0
  };

  $.ajax(settings).done(function (response) {
    const removedFileObject = JSON.parse(response);
    alert('Файл удален!');
  });
}

function getUserName() {
  const userName = $('#ibm-banner-welcome').text();
  return userName;
}

function getFormname() {
  const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();
  return formname;
}

export { replaceComments, removeFile }