$(document).ready(function() {

	const elem = document.getElementById('Tm1web');
	var actualTabs = [''];
	var Re = /[^:]*$/;
	elem.addEventListener('mouseup', e => {	
		if (e.toElement.className=="dijitTreeLabel"){
			var type = e.toElement.parentElement.parentElement.title;
			if(type =="Веб-лист" || type=="Представление куба"|| type=="Куб"){
				SendEvent(e.toElement.outerText,"Открытие");
			}
		}
		if (e.toElement.className=="dijitInline dijitIcon dijitTreeIcon tm1webNavTreeIcon tm1webWebsheetNavIcon"){
			var type = e.toElement.parentElement.parentElement.title;
			if(type =="Веб-лист" || type=="Представление куба"|| type=="Куб"){
				SendEvent(e.toElement.parentElement.outerText, "Открытие");
			}
		}
		if (e.toElement.className=="dijitTreeRow dijitTreeRowHover dijitTreeRowSelected"){
			var type = e.toElement.title;
			if(type =="Веб-лист" || type=="Представление куба"|| type=="Куб"){
				SendEvent(e.toElement.lastElementChild.outerText,"Открытие");
			}
		}
		
		var tabs = document.getElementsByClassName("dijitTabLabel");
		if(tabs.length){
			var tabName = "";
			for(let i=0; i<tabs.length;i++){ 
				if (tabs[i].ariaSelected=="true"){
					tabName = Re.exec(tabs[i].title)[0]; 
					break;
				}
			}			
			//кнопки
						
			if(e.toElement.className=="dijitReset dijitInline dijitIcon tm1webRecalculateIcon" || e.toElement.className=="dijitReset dijitInline dijitIcon tm1webRebuildCurrentSheetIcon" || e.toElement.className=="dijitReset dijitInline dijitIcon tm1webRebuildCurrentWorkbookIcon"){
				SendEvent(tabName, "Пересчет");
			}
		}
		setTimeout(()=>{
			var foundTabs = GetActualTabs();
			if(actualTabs.length<foundTabs.length){
				SendEvent(foundTabs[foundTabs.length-1],"Открытие");
				actualTabs=foundTabs;	
			}
			if(actualTabs.length>foundTabs.length){
				actualTabs=foundTabs;	
			}
		}, 100);
	});

	function SendEvent(title, action){
		actualTabs=GetActualTabs();	
		actualTabs.push(title);
		$.ajax({
		type: "POST",
		async: true,
		url: "/tm1web/upload/app/SendToDb.jsp",
		data: { 'title': title, 'event': action, 'dateTime': new Date(), 'user': getUserName() },
		});
		
	}	

	function getUserName(){
	  const userName = $('#ibm-banner-welcome').text();
	  return userName;
	}
	
	
	function GetActualTabs(){
		var tabs = document.getElementsByClassName("dijitTabLabel");
		var tabsNames= [''];
		if(tabs.length){
			
			for(let i=0; i<tabs.length;i++){ 
				if(tabs[i].childElementCount>0){
					tabsNames.push(Re.exec(tabs[i].innerText)[0]);
				}
			}
		}
		return 	tabsNames;
	}
});