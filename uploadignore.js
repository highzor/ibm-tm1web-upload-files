//vischenko
$(document).ready(function() {
	$.getScript('admin.js', function(){
		var admins1 = admin;
		getadmin(admin)
	});
	let admins1 = [];
	function getadmin(admin) { admins1 = admin;}
	
		//let admins1 = admin;
		var attachmentText = "";
		var filesRemoved = [];
		var filesNameRemoved = [];
		var userName = "";
		var userNameReady = false;
		var FilesRemoveReady = false;
		var downloadStatus = true;
		var timeInterval = 200;
		var DownloadSupported = AttrDownloadSupported();
		var AnnotationTextareaIds = []; 
		var startHref = "!. . . .!";
		var finishHref = "!-. . . .!";
		var latin = ". . . . . . . . . . . . . . . . .";
		var readOnly = false;
		var formname = 'none';
		var isActionAndbindCalled = false;
		var needRebuild = false;
	//var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();

	//var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
	var tabname = $('.dijitTabInner .dijitTabContent .dijitClosable .dijitTab .dijitTabChecked .dijitChecked').find($('.dijitTabLabel') ).text();  
	var CheckUserAd = false;
	var PortNumber = '43';
	let curent_date = '';
	let prev_date = '';
	let test;
	let dd = '';
	let mm = '';
	let yy = '';
	let time = '';
	let strd = ''
	let str = '';
	
	function listener(event) {
		if (event.data.indexOf("setImmediate") !== 0) {
			attachmentText = event.data; 
		}
	} 

	if (window.addEventListener) {
		window.addEventListener("message", listener);
	} else {
		window.attachEvent("onmessage", listener);
	}

	function getIframe(serverName, formname){
		let  currentDate = new Date();

		  // console.log(formname);
		  return '<iframe src="/tm1web/upload/app/iframe.html?serverName='+serverName+'&ver=300&formname='+formname+'&currentDate='+currentDate+'" style="border: 0; height: 130px; margin-bottom: 24px; width:100%;"></iframe>';
		}


/* startActions(timeInterval);
	
	
    function startActions(timeInterval){
        setInterval(function(){
          // getFilesRemove();
            ActionsBrowseComments();
            bindAnnotationActions();
            ActionsAddComment();
            getUserName();
			//var tabname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop(); 
		
			
        }, timeInterval);

        setInterval(function(){
            checkReadOnly();
        }, 100);
    } */
    
	   ////////////////////////
	  ///Sasha's Code Start///
	 ////////////////////////

	 var listenerForAddHTMLElement = function(e) {
	 	
	 	var addCommentWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
	 	
	 	if (addCommentWindow) {
	 		
	 		document.body.removeEventListener("DOMNodeInserted", listenerForAddHTMLElement, false);
	 		document.body.addEventListener("DOMNodeRemoved", listenerForDeleteHTMLElement, false);
	 		
	 		var refreshIntervalId = setInterval(function () {childChecker(addCommentWindow, refreshIntervalId);}, timeInterval);

	 	}
	 }

	 var listenerForDeleteHTMLElement = function(e) {
	 	var deletedCommentWindow = document.getElementsByClassName('dijitDialogPaneContent')[0];
	 	if (!deletedCommentWindow) {
	 		
	 		document.body.addEventListener("DOMNodeInserted", listenerForAddHTMLElement, false);
	 		document.body.removeEventListener("DOMNodeRemoved", listenerForDeleteHTMLElement, false);
	 	} 
	 	
	 }
	 
	 var listenerForDeleteBrowseCommentWindow = function(e) {
	 	var browseCommentWindow = document.getElementsByClassName('tm1WebAnotationGridContainer')[0];
	 	if (!browseCommentWindow) {
			document.body.removeEventListener("DOMNodeRemoved", listenerForDeleteBrowseCommentWindow, false);
			isActionAndbindCalled = false;
			needRebuild = false;
	 	}
		else if (browseCommentWindow && !needRebuild) {
			needRebuild = true;
		}
	 }

	 function childChecker(addCommentWindow, refreshIntervalId) {
	 	getUserName();
	 	checkReadOnly();
	 	if (addCommentWindow.childElementCount > 0 && addCommentWindow.children[0].type == 'textarea') {
	 		clearInterval(refreshIntervalId);
	 		ActionsAddComment();
	 		console.log('ActionsAddComment сработал');
	 		
	 	} else if (addCommentWindow.childElementCount > 0 && addCommentWindow.children[0].classList[0] == 'tm1WebAnotationGridContainer') {
	 		clearInterval(refreshIntervalId);
	 		var addHtmlEvent = document.body.addEventListener("DOMNodeInserted", listenerForAddHTMLElement, false);
	 		var removeHtmlEvent = document.body.removeEventListener("DOMNodeRemoved", listenerForDeleteHTMLElement, false);
			var removeBrowseCommEvent = document.body.addEventListener("DOMNodeRemoved", listenerForDeleteBrowseCommentWindow, false);
			var browseCommentWindow = document.getElementsByClassName('tm1WebAnotationGridContainer')[0];
	 		if (!isActionAndbindCalled) {
	 		ActionsBrowseComments();
	 		bindAnnotationActions();
	 		console.log('bindAnnotationActions сработал');
			isActionAndbindCalled = true;
			}
			else if (browseCommentWindow && needRebuild && isActionAndbindCalled) {
			ActionsBrowseComments();
	 		bindAnnotationActions();
	 		console.log('bindAnnotationActions сработал');
			needRebuild = false;
		    } 
	 	}
	 }

	 
	 document.body.addEventListener("DOMNodeInserted", listenerForAddHTMLElement, false);

       //////////////////////
	  ///Sasha's Code End///
	 //////////////////////
	 
	 

	 function checkReadOnly(){
	 	var count = 0;
	 	$(".tm1webCell_selected_and_readonly").each(function( i ) {
	 		if ($(this).is(':visible') ){
	 			count++;
	 			readOnly = true;
	 		}
	 	});
	 	if (count === 0) {
	 		readOnly = false;
	 	}
	 }
	 (function () {
	 	var f = function () {};
	 	if (!window.console) {
	 		window.console = {
	 			log:f, info:f, warn:f, debug:f, error:f
	 		};
	 	}
	 }());
	 function getFilesRemove(){
	 	if (!FilesRemoveReady){
	 		if (serverName != "" && userName != ""){
               // FilesRemoveReady = true;
               var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
			 //  console.log(formname);
			 var fileName = '/logs/remove.txt';

			 $.ajax({
			 	type: "POST",
			 	async: false,
			 	url: "/tm1web/upload/app/getfile.jsp",
			 	data: {'fileName' : fileName, 'serverName' : serverName , 'formname' : formname },
			 	success: function(r){ 
			 		r = r.replace(/\r|\n/g, '');
			 		filesRemoved = JSON.parse("["+r.slice(0,-1) +"]");
			 		for (var i = 0; i < filesRemoved.length; ++i) {
			 			if (!inArray(filesRemoved[i].name, filesNameRemoved)){
			 				filesNameRemoved.push(filesRemoved[i].name);
			 			}
			 		}
			 	}
			 });
			}
		}
	}

	function getRemovedFile(fileName){
		for (var i = 0; i < filesRemoved.length; ++i) {
			if (fileName == filesRemoved[i].name){
				return filesRemoved[i];
			}
		}
	}

	function inArray(needle, haystack) {
		var length = haystack.length;
		for(var i = 0; i < length; i++) {
			if(haystack[i] == needle) return true;
		}
		return false;
	}

	function getUserName(){
		if (!userNameReady && $('#ibm-banner-welcome').is(':visible')){
			var name = $('#ibm-banner-welcome').text();
			if (name != ""){
				userName = name;
				userNameReady = true;
				
			}
		}
	}

	function EventClickOK(textareaId){
		var id = $('.tm1WebBtnPrimary').children('span').children('span').attr('id');
		var elemButton = '#'+id;
		var AnnotationDialogId = '#'+textareaId;
		$(elemButton).on('click', function(){
			if (attachmentText == "uploading"){
				return false;
			}
			var AnnotationDialogText = $(AnnotationDialogId).val();
			if ($(AnnotationDialogId).val() != "") {
				AnnotationDialogText = AnnotationDialogText + attachmentText;
				
				require([
					'dojo',
					'dijit'
					], function (dojo, dijit) {
						dijit.byId(textareaId).setValue(AnnotationDialogText);
					//console.log(AnnotationDialogText);
				});
			}
		});
	}


	function ActionsAddComment(){
		if($('.tm1webAddAnnotationDialog').is(':visible')){

			var textreaId = $('.tm1webAddAnnotationDialog').find('textarea').attr('id');
			var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
			var tabname = $('.dijitTabInner .dijitTabContent .dijitClosable .dijitTab .dijitTabChecked .dijitChecked').find($('.dijitTabLabel') ).text();  
			if (!inArray(textreaId, AnnotationTextareaIds)){
				attachmentText = "";
				AnnotationTextareaIds[AnnotationTextareaIds.length] = textreaId;
				$('.tm1webAddAnnotationDialog').find('textarea').after(getIframe(serverName, formname));
				EventClickOK(textreaId);

			}
		}
	}

	function fileRemove(el){
		if (confirm("Вы подтверждаете удаление?")) {
			var fileName = el.attr('data-href');
			var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
			var tabname = $('.dijitTabInner .dijitTabContent .dijitClosable .dijitTab .dijitTabChecked .dijitChecked').find($('.dijitTabLabel') ).text();  
			
			$.ajax({
				type: "POST",
				url: "/tm1web/upload/app/remove.jsp",
				data: {'fileName' : fileName, 'serverName' : serverName, 'user' : userName ,'formname' : formname},
				success: function(r){
					fileRemoveMessage(fileName, false, false);
                    FilesRemoveReady = false; // update list remove files
                    alert('Файл удален!');
                }
            });
		}
		return false;
	}

	function getFormattedDate() {
		var date = new Date();

		var month = date.getMonth() + 1;
		var day = date.getDate();
		var hour = date.getHours();
		var min = date.getMinutes();
		var sec = date.getSeconds();

		month = (month < 10 ? "0" : "") + month;
		day = (day < 10 ? "0" : "") + day;
		hour = (hour < 10 ? "0" : "") + hour;
		min = (min < 10 ? "0" : "") + min;
		sec = (sec < 10 ? "0" : "") + sec;

		var str = date.getFullYear() + "." + month + "." + day + "-" +  hour + "." + min + "." + sec;

		return str;
	}

	function fileRemoveMessage(fileName, user, datetime){
		if (user === false){
			user = userName;
		}
		if (datetime === false){
			datetime = getFormattedDate();
		}
		$('[data-filename-log="'+fileName+'"]').html('<br><span style="cursor:pointer; border-bottom:1px dashed gray;" title="Файл &quot;'+fileName+'&quot; удален пользователем '+user+' в ' + datetime + '">Файл удален</span> - ');
	}

	function fileDownload(el){
		if (downloadStatus){
			downloadStatus = false;
			var fileName = el.attr('data-filename');
			$.ajax({
				type: "POST",
				async: false,
				url: "/tm1web/upload/app/download.jsp",
				data: {'fileName' : fileName, 'serverName' : serverName, 'formname' : formname},
				success: function(){
					downloadStatus = true;
				}
			});
		}
	}

	function AttrDownloadSupported(){
		var a = document.createElement('a');
		if(typeof a.download != "undefined") {
			return true;
		} else {
			return false;
		}
	}

	function getDownloadMethod(fileName, serverName,formname){
		//return '<a href="/tm1web/upload/app/getfile.jsp?fileName='+ fileName +'&serverName='+serverName+'" target="_blank">Скачать</a>';
		return '<a id="downloadButton" href="/tm1web/upload/app/getfile.jsp?fileName='+ encodeURIComponent(fileName) +'&serverName='+encodeURIComponent(serverName)+'&formname='+encodeURIComponent(formname)+'" target="_blank">Скачать</a>';
		
		
     //   if (!DownloadSupported) { // загрузка из сервера
      //      return '<a href="/tm1web/upload/app/getfile.jsp?fileName='+fileName+'&serverName='+serverName+'" target="_blank">Скачать</a>';
       // } else { // загрузка с веб-сервера
       //     return '<a class="fileDownload" data-filename="'+fileName+'" href="/tm1web/upload/repository/'+serverName+'/'+fileName+'" download target="_blank">Скачать</a>';
       // }
   }

   function searchFilesInAnnotation(index, text,UserOwnerComment){
   	var i = 0;
   	var e = 0;
   	var replaceArr = {};
   	var replaceText = "";
   	
   	let checkOwner = (userName == UserOwnerComment);
		//console.log(admins1);
		
		let checkAdmin = false
		if (admins1.indexOf(userName) == -1) {checkAdmin = false} else {checkAdmin = true}
			do {
				var x = text.indexOf(startHref, i);
				if (x != -1) {
					var f = text.indexOf(finishHref, e);
					var fileName = text.substring(x + startHref.length, f);
					var formname = $('.dijitTabInner.dijitTabContent.dijitClosable.dijitTab.dijitTabChecked.dijitChecked').find($('.dijitTabLabel') ).attr("title").split(': ').pop();
					var tabname = $('.dijitTabInner .dijitTabContent .dijitClosable .dijitTab .dijitTabChecked .dijitChecked').html();  
					replaceText = '<span data-filename-log="'+fileName+'">' + '<br>' + getDownloadMethod(fileName, serverName, formname);
					if (!readOnly && checkOwner || checkAdmin) {replaceText += ' (<a href="javascript:;" style="color:red;" class="ActionsBrowseCommentsFileRemove" data-href="' + fileName + '" >&#215; Удалить</a>)';}
				//if (!readOnly && CheckUserAd && !checkOwner) {replaceText += ' (<a href="javascript:;" style="color:red;" class="ActionsBrowseCommentsFileRemove" data-href="' + fileName + '" >&#215; неУдалить</a>)';}
				//if (!readOnly && !checkOwner) {replaceText += ' (<a href="javascript:;" style="color:red;" class="ActionsBrowseCommentsFileRemove1" data-href="' + fileName + '" >&#215; Нельзя удалить!</a>)';}
				replaceText += '</span>';
				replaceArr[fileName] = replaceText;
				i = x + 1;
				e = f + 1;
			}
		} while (x != -1);
		console.log(replaceArr);
		return replaceArr;
	}
	


	function getNewAnnotationText(text, replaceArr){
		console.log("Сработал getNewAnnotationText");
		for (var name in replaceArr) {
			text = text.replace(startHref + name + finishHref, replaceArr[name]);
		}
		text = text.replace("Attachments:", "");
		text = text.replace(latin, "");
		return text;
	}

	function updateDOMRemovedFiles(replaceArr){
		for (var name_file in replaceArr) {
			//console.log(name_file);
			//console.log(filesNameRemoved);
			if (inArray(name_file, filesNameRemoved)){
				var file = getRemovedFile(name_file);
				fileRemoveMessage(file.name, file.user, file.datetime);
				//console.log(file);
			}
			//console.log(replaceArr);
			//console.log(name_file);
		}
	}

	function bindAnnotationActions(){
		$('.ActionsBrowseCommentsFileRemove').unbind( "click" );
		$('.ActionsBrowseCommentsFileRemove').on('click', function () {fileRemove($(this));});
       // $('.fileDownload').unbind( "click" );
       // $('.fileDownload').on('click', function () {fileDownload($(this));});
   }
   
   
   function movechar(string,a,b){
   	if(a==b)return string;
   	if (a>b){c=a;a=b;b=c;}
   	return (string.slice(0, a)+string.charAt(b)+string.slice(a+1,b)+string.charAt(a)+string.slice(b+1));
   }


   function ActionsBrowseComments(){
   	curent_date = '';
   	prevRowCell = {};
   	prev_date = ''
   	$(".dojoxGridRow").each(function (index, element) {
		
		
   		///Изменения 16.04.2021
		var text = $(element).html();
			var pos = text.indexOf(latin);
			if (-1 < pos ) { // это ячейка с комментарием и вложенными файлами
            	var UserOwnerComment = $(element).next().text();
            	var replaceArr = searchFilesInAnnotation(index, text,UserOwnerComment);
            	text = getNewAnnotationText(text, replaceArr);
            	$(element).html(text);
			updateDOMRemovedFiles(replaceArr);	
		}
		///
		
		
		
		
			 //Получили время в текущей строке 09.06.2020, 17:44:47
			 curent_date = $(element).find("[idx=2]").text();
			 str = $(element).find("[idx=2]").text();
			 if (curent_date.indexOf('/') != -1) {
			 	curent_date = Date.parse(curent_date);
			 	curent_date = new Date(curent_date);
			 	
			 } else {
			 	curent_date.replace(",", "").replace("-", "/").replace("-", "/").replace(".", "/").replace(".", "/");
			 	curent_date = movechar(curent_date,0,3);
			 	curent_date = movechar(curent_date,1,4);	
			 	
			//curent_date = '2/25/2020, 5:44:31 PM';

			curent_date = Date.parse(curent_date);
			curent_date = new Date(curent_date); 
		}
		
		
		
		
		
			 //	  console.log(curent_date); 2/25/2020, 5:44:31 PM
			 
			 

			 
			 if (index > 0 && curent_date > prev_date){
			 	
				//Время прошлого элемента 
				element.parentNode.insertBefore(element, prevRowCell);
				
				
			}
			
			
			// console.log(element);
			// console.log($(element).next().next().next());
			
			//console.log( $(element).find("[idx=2]").text() );
			
        // получаем unicode время: 1480227617000

	 // вывод объекта

	 
	 
	 prev_date =curent_date;
	 prevRowCell = element;
	})
   	
		///// dojoxGridCell dijitDialogPaneContent  tm1WebAnotationGridContainer
		
		$(".tm1WebAnotationGridContainer").each(function (index, element) {
			console.log('ajax is working');
			getFilesRemove();
			
			
			
			///var text = $(element).html();
			///var pos = text.indexOf(latin);
			
			
		//	if (index == 4 && -1 < pos) {console.log(element);}
		
		
		
           /// if (-1 < pos ) { // это ячейка с комментарием и вложенными файлами
            ///	var UserOwnerComment = $(element).next().text();
            ///	var replaceArr = searchFilesInAnnotation(index, text,UserOwnerComment);
            ///	text = getNewAnnotationText(text, replaceArr);
            ///	$(element).html(text);
			
			
			//console.log($(element).next().text());
			
			
			///updateDOMRemovedFiles(replaceArr);
			
			
				//console.log("open comments");
				//console.log(pos);console.log(index);
				
			
			
		
	});
	}
});