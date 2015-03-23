var pdata;

function auth (user,pass,APPKEY,callBack) {

	$.ajax({
	    url: 'https://codehosting.realtime.co/'+APPKEY+'/authenticate?user='+user+'&password='+pass+'&role=BackofficeApp',
	    type: 'POST',
	    success: function(data) { 
	    	callBack(data);
	    },error: function(data) { 
	    	console.log(error);
	    }
	});
}

function logout(){
	localStorage.setItem("token", '');
	window.location='Login.html';
}

function checkLogin(){
	var token = localStorage.getItem("token");
	if (!token || token == '') {
		window.location='Login.html';
	};
}


function removeParam(key, sourceURL) {

	console.log('URL: ' + sourceURL);
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    console.log('rtn: ' + rtn);
    return rtn;
}


