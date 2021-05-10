let attachmentText = "";
        let latin = ". . . . . . . . . . . . . . . . .";

        const queryStringParams = getUriSearchDataParams();

        let serverName = queryStringParams['serverName'];
		let formname = queryStringParams['formname'];
		let currentDate = queryStringParams['currentDate'];
		
        Dropzone.autoDiscover = false;
        $(function() {
            let myDropzone = new Dropzone(".dropzone");
            let attachments = false;
            myDropzone.on('sending', function (file, xhr, formData) {
                formData.append('serverName', serverName);
				formData.append('formame', formname);
				formData.append('currentDate', currentDate);
                parent.postMessage('uploading', "*");
            });
            myDropzone.on('error', function (file, xhr, formData) {
                parent.postMessage('error', "*");
            });
            myDropzone.on("success", function(file, response) {
                response = JSON.parse(response);
                if (!attachments){
                    attachmentText += '\n\rAttachments:';
                    attachments = true;
                }

                attachmentText += '\n' + '!. . . .!' + response['name'] + '!-. . . .! ' + response['name'] + ' (' + response['size'] + ')' + latin;
                parent.postMessage(attachmentText, "*");
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