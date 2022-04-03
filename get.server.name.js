$(document).ready(function() {
    setInterval(function(){
        getServerName();
    }, 300);
    function getServerName(){
        if ($('#divTopMid').find('.dijitSelectLabel').is(':visible')){
            var name = $('.dijitSelectLabel').text();
            if (name != ""){
                serverName = name;
            }
        }
    }
});