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
    const removedFileInfoObject = JSON.parse(response);
    replaceCell(removedFileInfoObject);
    alert('Файл удален!');
  });
}

function replaceCell(fileInfo) {
  $(`[data-filename-log="${fileInfo.name}"]`)
  .html(`<br>
             <span style="cursor:pointer; border-bottom:1px dashed gray;" 
               title="Файл '${fileInfo.name}' удален пользователем '${fileInfo.user}' в '${fileInfo.datetime}'">Файл удален
               </span> - `);
}

function getUserName() {
  const userName = $('#ibm-banner-welcome').text();
  return userName;
}

function getFormname() {
  const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();
  return formname;
}

// const div = document.createElement('div');
// div.innerHTML = "<span class=\"dijit dijitReset dijitInline tm1webButton tm1webBtnSecondary dijitButton\" role=\"presentation\" widgetid=\"dijit_form_Button_14\"><span class=\"dijitReset dijitInline dijitButtonNode\" data-dojo-attach-event=\"ondijitclick:__onClick\" role=\"presentation\"><span class=\"dijitReset dijitStretch dijitButtonContents\" data-dojo-attach-point=\"titleNode,focusNode\" role=\"button\" aria-labelledby=\"dijit_form_Button_14_label\" tabindex=\"0\" id=\"dijit_form_Button_14\" style=\"user-select: none;\"><span class=\"dijitReset dijitInline dijitIcon dijitNoIcon\" data-dojo-attach-point=\"iconNode\"></span><span class=\"dijitReset dijitToggleButtonIconChar\">●</span><span class=\"dijitReset dijitInline dijitButtonText\" id=\"dijit_form_Button_14_label\" data-dojo-attach-point=\"containerNode\">Отмена</span></span></span><input type=\"button\" value=\"\" class=\"dijitOffScreen\" data-dojo-attach-event=\"onclick:_onClick\" tabindex=\"-1\" role=\"presentation\" aria-hidden=\"true\" data-dojo-attach-point=\"valueNode\"></span>";
// let take = document.getElementsByClassName('tm1webDialogButtons')[0];
// take.appendChild(div.firstElementChild);

export { replaceComments, removeFile }