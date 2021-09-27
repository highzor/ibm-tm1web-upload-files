let attachmentText = "";
const latin = ". . . . . . . . . . . . . . . . .";

const queryStringParams = getUriSearchDataParams();

const serverName = queryStringParams['serverName'];
const formname = queryStringParams['formname'];
const currentDate = queryStringParams['currentDate'];

Dropzone.autoDiscover = false;
$(function () {
    const myDropzone = new Dropzone(".dropzone", {
        maxFiles: 1,
        autoProcessQueue: false,
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
    myDropzone.on('queuecomplete', function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on('dragstart', function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("dragenter", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("dragend", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("dragover", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("drop", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("addedfile", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("addedfiles", function (file, xhr, formData) {
        let stop = '';
    });
    myDropzone.on("success", function (file, response) {

        if (this.files.length > 2) {

            this.removeAllFiles();
            alert('Загрузите не более 1 файла');
            return;
        }
        else if (this.files.length == 2) {
            
            this.removeFile(this.files[0]);
        }

        response = JSON.parse(response);

        if (sessionStorage.attachments) delete sessionStorage.attachments;
        sessionStorage.setItem('attachments', ` Attachments: !. . . .-!${response['formname']} !. . . .!${response['name']}!-. . . .! ${response['name']}(${response['size']})${latin}`);
        parent.postMessage('complete', window.parent.location.href);
    });
});

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