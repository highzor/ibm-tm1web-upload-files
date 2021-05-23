var formToJSON = function(elem) {
    var data = {};
    for (var i = 0; i < elem.length; i++) {
      var item = elem[i];
      data[i] = item.innerHTML;
    }
    return data;
  }