let attachmentText = "";
const latin = ". . . . . . . . . . . . . . . . .";

const queryStringParams = getUriSearchDataParams();

const serverName = queryStringParams['serverName'];
const formname = queryStringParams['formname'];
const currentDate = queryStringParams['currentDate'];

Dropzone.autoDiscover = false;
$(function () {
    const myDropzone = new Dropzone(".dropzone");
    let attachments = false;
    myDropzone.on('sending', function (file, xhr, formData) {
        formData.append('serverName', serverName);
        formData.append('formame', formname);
        formData.append('currentDate', currentDate);
        parent.postMessage('uploading', window.parent.location.href);
    });
    myDropzone.on('error', function (file, xhr, formData) {
        parent.postMessage('error', window.parent.location.href);
    });
    myDropzone.on("success", function (file, response) {
        response = JSON.parse(response);
        if (!attachments) {
            attachmentText += '\n\rAttachments:';
            attachments = true;
        }

        attachmentText += '\n' + '!. . . .!' + response['name'] + '!-. . . .! ' + response['name'] + ' (' + response['size'] + ')' + latin;
        parent.postMessage(attachmentText, window.parent.location.href);
    });
});

function getUriSearchDataParams() {
    const search = window.location.search;
    const decodedSearchWithoutData = decodeURIComponent(search.replace('?', ''));
    const hashes = decodedSearchWithoutData.slice(search.indexOf('?') + 1).split('&')
    const params = {}

    hashes.map(hash => {
        const [key, val] = hash.split('=')
        params[key] = val
    });

    return params;
}