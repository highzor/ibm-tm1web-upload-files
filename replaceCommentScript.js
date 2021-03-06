// 1. функция, переписывающая стандартное окно с комментариями
function replaceComments(gridContent, tm1webDialogButtons) {

  gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
  appendDownloadAllButton(tm1webDialogButtons);
}
// 2. ждем подгрузку контента
function InsertPresentationRoleElemHandler() {
  const gridContent = document.getElementsByClassName('dojoxGridContent')[0];
  if (gridContent && gridContent.children.length > 0) {

    setTimeout(replaceTable, 200);
    gridContent.removeEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
  }
}
// 3. добавляем кнопку загрузки всех файлов в '.zip'
async function appendDownloadAllButton(tm1webDialogButtons) {
  const divTemp = document.createElement('div');
  divTemp.innerHTML = `<span onclick="downloadFiles();" class="dijit dijitReset dijitInline tm1webButton tm1webBtnSecondary dijitButton" 
                       role="presentation" widgetid="dijit_form_Button_14"><span class="dijitReset dijitInline dijitButtonNode" 
                       role="presentation">
                       <span class="dijitReset dijitStretch dijitButtonContents" data-dojo-attach-point="titleNode,focusNode" 
                       role="button" aria-labelledby="dijit_form_Button_14_label" tabindex="0" id="dijit_form_Button_14" 
                       style="user-select: none;"><span class="dijitReset dijitInline dijitIcon dijitNoIcon" 
                       data-dojo-attach-point="iconNode"></span><span class="dijitReset dijitToggleButtonIconChar">●</span>
                       <span class="dijitReset dijitInline dijitButtonText" id="dijit_form_Button_14_label" 
                       data-dojo-attach-point="containerNode">Скачать все</span></span></span><input type="button" value="" 
                       class="dijitOffScreen" tabindex="-1" role="presentation" 
                       aria-hidden="true" data-dojo-attach-point="valueNode"></span>`;

  tm1webDialogButtons.appendChild(divTemp.firstElementChild);
}
// функция, отправляющая в 'createTable.jsp' стандартную таблицу с комментариями для преобразования
async function replaceTable() {
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
    setAbleToCopyFields();
    gridContent.addEventListener("DOMNodeInserted", InsertPresentationRoleElemHandler, false);
  });
}
// функция, дающая возможность копирования текста в окне комментариев
async function setAbleToCopyFields() {
  const tm1webAnnotationGrid = document.getElementsByClassName('dojoxGrid tm1webAnnotationGrid')[0];
  tm1webAnnotationGrid.style.userSelect = 'auto';
}
// функция скачивания всех файлов в '.zip'
async function downloadFiles() {
  const gridScrollbox = document.getElementsByClassName('dojoxGridScrollbox')[0];
  gridScrollbox.style.overflow = 'hidden';
  replayMe(null, gridScrollbox, false, null);
}
// функция автоксролла окна с комментариями, перед тем как 'скачать все', все комментарии д.б. прогружены
async function replayMe(files, gridScrollbox, wasCalledToTop, scrollComebackPls) {
  if (!wasCalledToTop) {
    scrollComebackPls = gridScrollbox.scrollTop;
    gridScrollbox.scrollTop = 0;
    await sleepMe(500);
    wasCalledToTop = true;
  }
  if (!files) {
    files = [];
  }

  let scrollBeforeValue = gridScrollbox.scrollTop;

  let scrollCurrentValue = gridScrollbox.scrollTop;

  scrollCurrentValue += 999;

  $(gridScrollbox).animate({ scrollTop: scrollCurrentValue }, 3000, function () {

    $(this).after(function () {

      let scrollAfterValue = gridScrollbox.scrollTop;

      const FileClass = document.getElementsByClassName('FileDownload');

      Array.prototype.forEach.call(FileClass, fileName => {

        const dataHref = fileName.getAttribute('data-href').replaceAll('+', '%2b');
        const dataFormname = fileName.getAttribute('data-formname');

        if (!files.includes(`${dataFormname}//attachments//${dataHref}`)) {
          files.push(`${dataFormname}//attachments//${dataHref}`);
        }
      });

      if (scrollBeforeValue != scrollAfterValue) {

        replayMe(files, gridScrollbox, wasCalledToTop, scrollComebackPls);
      }
      else {
        gridScrollbox.style.overflow = 'auto';
        $(gridScrollbox).animate({ scrollTop: scrollComebackPls }, 'slow');
        if (files.length == 0) {
          alert('Файлов для скачивания нет');
          return;
        }
        prepareFilesForDownload(files);
      }
    })
  });

}
// функция загрузки файлов через окно браузера
async function downloadViaBrowser(url) {
  var aElem = document.createElement('a');
  aElem.href = url;
  aElem.target = '_blank';
  aElem.onload = function (e) {
    window.URL.revokeObjectURL(aElem.href);
  };
  document.body.appendChild(aElem);
  aElem.click();
  document.body.removeChild(aElem);
}

function sleepMe(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
// подготовка всех существующих файлов в окне с комментариями для скачивания разом в '.zip'
async function prepareFilesForDownload(files) {
  const user = getUserName();
  const formname = getFormname();

  downloadViaBrowser(`/tm1web/upload/app/getAllFiles.jsp?fileNames=${files.join('!=-=!')}&serverName=${serverName}&formname=${formname}&user=${user}`);
}
// функция удаления файла
async function removeFile(cellElement) {
  if (!confirm("Вы подтверждаете удаление?")) return false;
  const user = getUserName();
  const formname = cellElement.attr('data-formname');
  const fileName = cellElement.attr('data-href').replaceAll('+', '%2b');

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
// добавляем пояснение к удаленному файлу
async function replaceCell(fileInfo) {
  $(`[data-filename-log="${fileInfo.name}"]`)
    .html(`<br>
             <span style="cursor:pointer; border-bottom:1px dashed gray;" 
               title="Файл '${fileInfo.name}' удален пользователем '${fileInfo.user}' в '${fileInfo.datetime}'">Файл удален
               </span> - `);
}

function getUserName() {
  const userName = $('#ibm-banner-welcome').text().split(' / ')[0];
  return userName;
}

function getFormname() {
  const formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel')).attr("title").split(': ').pop();
  return formname;
}

export { replaceComments, removeFile, downloadFiles }