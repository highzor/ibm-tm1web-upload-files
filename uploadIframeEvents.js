let attachmentText = "";
const latin = ". . . . . . . . . . . . . . . . .";

const queryStringParams = getUriSearchDataParams();

const serverName = queryStringParams['serverName'];
const formname = queryStringParams['formname'];
const currentDate = queryStringParams['currentDate'];
const user = queryStringParams['user'];
let fileName = '';
// удаляем файл при нажатии 'Отмена'
const btnSecondary = parent.document.getElementsByClassName('tm1webBtnSecondary')[0];
btnSecondary.onclick = onClickBtnSecondaryHandler.bind(null, btnSecondary);
// подгружаем файл
Dropzone.autoDiscover = false;
$(function () {
    const myDropzone = new Dropzone(".dropzone", {

        addRemoveLinks: true
    });

    myDropzone.on('sending', function (file, xhr, formData) {

        formData.append('serverName', serverName);
        formData.append('formname', formname);
        formData.append('currentDate', currentDate); 
        parent.postMessage('uploading', window.parent.location.href);
    });

    myDropzone.on('error', function (file, xhr, formData) {

        parent.postMessage('error', window.parent.location.href);
    });

    myDropzone.on('removedfile', function (file) {

        deleteFileFromStorage(file);
    });

    myDropzone.on("success", function (file, response) {

        response = JSON.parse(response);

        fileName = response['name'];

        if (sessionStorage.attachments) delete sessionStorage.attachments;
        sessionStorage.setItem('attachments', ` Attachments: !. . . .-!${response['formname']} !. . . .!${response['name']}!-. . . .! ${response['name']}(${response['size']})${latin}`);
        parent.postMessage('complete', window.parent.location.href);
    });

    myDropzone.on("addedfile", function (file, xhr, formData) {

        if (this.files.length > 2) {

            deleteFileFromStorage(this.files[0]);
            this.removeAllFiles();
            file = [];
            alert('Загрузите не более 1 файла');
            return;
        }
        else if (this.files.length == 2) {

            deleteFileFromStorage(this.files[0]);
            this.removeFile(this.files[0]);
        }
    });

    myDropzone.on("addedfiles", function (file, xhr, formData) {

        if (file.length >= 2) {

            deleteFileFromStorage(this.files[0]);
            this.removeAllFiles();
            file = [];
            alert('Загрузите не более 1 файла');
            return;
        }

        if (this.files.length > 2) {

            deleteFileFromStorage(this.files[0]);
            this.removeAllFiles();
            file = [];
            alert('Загрузите не более 1 файла');
            return;
        }
        else if (this.files.length == 2) {

            deleteFileFromStorage(this.files[0]);
            this.removeFile(this.files[0]);
        }
    });
});
// функция удаления файла
function deleteFileFromStorage(file) {
    
    if (sessionStorage.attachments) delete sessionStorage.attachments;
    const settings = {
      "url": `/tm1web/upload/app/remove.jsp?fileName=${fileName}&serverName=${serverName}&formname=${formname}&user=${user}`,
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "text/html"
      }
    };
  
    $.ajax(settings).done(function (response) {
      
    });
}
// удаляем файл при нажатии 'Отмена'
function onClickBtnSecondaryHandler() {

    if (serverName && queryStringParams && queryStringParams && fileName && fileName.length > 0) {

        deleteFileFromStorage();
    }
};
// получаем параметры из url'а
function getUriSearchDataParams() {
    
    const search = window.location.search;
    const decodedSearchWithoutData = decodeURIComponent(search.replace('?', ''));
    const hashes = decodedSearchWithoutData.slice(search.indexOf('?')).split('&')
    const params = {}

    hashes.map(hash => {
        const [key, val] = hash.split('=')
        params[key] = val
    });

    return params;
}