var myWidth = $('#myModal').width();
var storageRef;
var APPKEY = '';
var contentsOffset = 10;
var tagOffset = 10;
var userOffset = 10;

function getStorageRef(token, callback){
	if (storageRef == null) {
		APPKEY = localStorage.getItem("APPKEY");
		console.log("on Storage ref created")
		storageRef = Realtime.Storage.create({
			applicationKey: APPKEY,
			authenticationToken: token,
			isCluster:true,
			url:"http://storage-balancer.realtime.co/server/1.0"
		}, function success(){
			console.log("Storage ref created")
			callback();
		});
	};
	
	return storageRef;
}



function setModal(img){	
	$('body').css('overflow', 'hidden');
	var myimg = img.getElementsByTagName('img')[0];
	//var imgs = $('.imgBorder');
	var mysrc = myimg.src;
	var windowHeight = $(window).height();
	var windowWidth = $(window).width();

	var imgheight = document.getElementById('bimg').height;
	var imgwidth = document.getElementById('bimg').width;

	if (imgheight < $('#myModal').height()) {
		$('#myModal').css('height','auto');
	}else{
		$('#myModal').css('height','30%');
	}

	if (imgwidth < $('#myModal').width()) {
		$('#myModal').css('width','auto');
	}else{
		$('#myModal').css('width',myWidth);
	}

	console.log($('#myModal').width() * 5);
	var modal = '<img id="bimg" class="img-thumbnail" zindex="1" style="width:'+$('#myModal').width() / 2+'px; height:'+$('#myModal').height() / 2+'px;" src='+mysrc+'>';
	$('#myModal').html(modal);
	$('#myModal').modal('show');
	
}


var contentsDict = new Array();

function getItems(){
	var tableRef = storageRef.table("Contents");
	var count = 0;
	// Get all of the table's items
	tableRef.desc().getItems(function success(itemSnapshot) {
		if (itemSnapshot != null) {

			contentsDict[count] = itemSnapshot;
			count++;

		}else
		{			
			setContenPages(1);		
		}
	});	
}

function setContentPagesIndex(page)
{
	var pages = contentsDict.length / contentsOffset;
	console.log('pages: '+ pages);
	var pagesList = '';
	for (var i = 1; i < pages + 1; i++) {
		console.log('pages: '+ pages + ' i: '+ i);
		if (i == page) {
			pagesList += '<li class="active"><a href="javascript:setContenPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}else{
			pagesList += '<li><a href="javascript:setContenPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}				
	};

	var contentsPagination1 = document.getElementById('contentsPagination1');
	contentsPagination1.innerHTML = pagesList;	

	var contentsPagination2 = document.getElementById('contentsPagination2');
	contentsPagination2.innerHTML = pagesList;
}


function setContenPages(page){
	setContentPagesIndex(page);
	var contents = '';
	var init = (page - 1) * contentsOffset;
	var end = ((page * contentsOffset > contentsDict.length - 1) ? contentsDict.length : page * contentsOffset);

	for (var j = init; j < end; j++) {
				var itemSnapshot = contentsDict[j];
				
				contents += '<tr class="active">';	
				contents += '<td>';
					contents += '<h5>'+itemSnapshot.val().MonthYear+'</h5>';
				contents += '</td>';				
				contents += '<td>';
					if (itemSnapshot.val().Type == 'Blog') {
						contents += '<span class="label label-danger">'+itemSnapshot.val().Type+'</span>';
					}else
					{
						contents += '<span class="label label-info">'+itemSnapshot.val().Type+'</span>';
					}
				contents += '</td>';
				contents += '<td>';
					var d = new Date(parseInt(itemSnapshot.val().Timestamp));
					var date = '0'+d.getDate();
					date = date.substring(date.length - 2);
					var mount = ('0'+(d.getMonth()+1));
					mount = mount.substring(mount.length - 2);
					contents += '<h5>'+date + '/' + mount + '/' + d.getFullYear()+'</h5>';
				contents += '</td>';
				contents += '<td>';
					contents += '<img class="img-thumbnail" data-src="holder.js/200x90" style="width: auto; max-height: 190px; min-width: 150px;" src="'+itemSnapshot.val().IMG+'">';
				contents += '</td>';
				contents += '<td>';
					contents += '<span class="label label-primary">'+itemSnapshot.val().Tag+'</>';
				contents += '</td>';
				contents += '<td>';
					contents += '<h5>'+itemSnapshot.val().Title+'</h5>';
				contents += '</td>';
				contents += '<td>';
				if (itemSnapshot.val().URL && itemSnapshot.val().URL != '') {
					var url = '';
					for ( var i = 0; i < itemSnapshot.val().URL.length; i++ )
					{
						if (i % 15 == 0) {
							url += '\n';
						}
					  url += itemSnapshot.val().URL.charAt(i);
					}

					contents += '<a href="'+url+'">'+url+'</a>';
				};
				contents += '</td>';
				contents += '<td>';

					if (itemSnapshot.val().Description.length > 200) {
						contents += itemSnapshot.val().Description.substring(0, 200) + ' ...';
					}else{
						contents += itemSnapshot.val().Description;
					}

				contents += '</td>';
				contents += '<td>';
					var location = "javascript:window.location='NewItem.html?MonthYear="+itemSnapshot.val().MonthYear+"&timestamp="+itemSnapshot.val().Timestamp+"';";
					contents += '<button class="btn btn-success" type="button" onclick="'+location+'"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></button>';
				contents += '</td>';
				contents += '<td>';


					var remove = "'"+itemSnapshot.val().MonthYear+"','"+itemSnapshot.val().Timestamp+"'";
					contents += '<button class="btn btn-danger" type="button" id="BT_'+itemSnapshot.val().MonthYear+itemSnapshot.val().Timestamp+'" onclick="removeContent('+remove+', this)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
				contents += '</td>';
			contents += '</tr>';
	};

	var table = document.getElementById('contentsBoby');
	table.innerHTML = contents;
	return false;
}

var tagsDict = new Array();

function getTags(){
	var contents = '';
	// Create a storage reference
	// Create a table reference
	var tableRef = storageRef.table("Tags");
	var count = 0;
	// Get all of the table's items
	tableRef.desc().getItems(function success(itemSnapshot) {
		if (itemSnapshot != null) {
			console.log("tags: " + itemSnapshot);
			tagsDict[count] = itemSnapshot;
			count++;
		}else
		{		console.log("tags: /");	
			setTagsPages(1);	
		}
	});	
}

function setTagsPagesIndex(page)
{
	var pages = tagsDict.length / tagOffset;
	console.log('pages: '+ pages);
	var pagesList = '';
	for (var i = 1; i < pages + 1; i++) {
		console.log('pages: '+ pages + ' i: '+ i);
		if (i == page) {
			pagesList += '<li class="active"><a href="javascript:setTagsPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}else{
			pagesList += '<li><a href="javascript:setTagsPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}				
	};

	var tagsPagination1 = document.getElementById('tagsPagination1');
	tagsPagination1.innerHTML = pagesList;	

	var tagsPagination2 = document.getElementById('tagsPagination2');
	tagsPagination2.innerHTML = pagesList;
}

function setTagsPages(page){
	setTagsPagesIndex(page);
	var contents = '';
	var init = (page - 1) * tagOffset;
	var end = ((page * tagOffset > tagsDict.length - 1) ? tagsDict.length : page * tagOffset);

	for (var j = init; j < end; j++) {
				var itemSnapshot = tagsDict[j];

				contents += '<tr class="active">';					
				contents += '<td>';
					contents += '<span class="label label-primary">'+itemSnapshot.val().Tag+'</>';
				contents += '</td>';
				contents += '<td>';
					if (itemSnapshot.val().Type == 'Blog') 
					{
						contents += '<span class="label label-danger">'+itemSnapshot.val().Type+'</span>';
					}else
					{
						contents += '<span class="label label-info">'+itemSnapshot.val().Type+'</span>';
					}
				contents += '</td>';
				contents += '<td>';
					var location = "javascript:window.location='NewTag.html?type="+itemSnapshot.val().Type+"&tag="+itemSnapshot.val().Tag+"';";
					contents += '<button class="btn btn-success" type="button" onclick="'+location+'"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></button>';
				contents += '</td>';
				contents += '<td>';
					var remove = "'"+itemSnapshot.val().Type+"','"+itemSnapshot.val().Tag+"'";
					contents += '<button class="btn btn-danger" type="button" id="BT_'+itemSnapshot.val().Type+itemSnapshot.val().Tag+'" onclick="removeTag('+remove+', this)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
				contents += '</td>';
			contents += '</tr>';
	};

	var table = document.getElementById('tagsBoby');
	table.innerHTML = contents;
	return false;
}


//-------------------------------------

var usersDict = new Array();

function getUsers(){

	var contents = '';
	// Create a storage reference
	// Create a table reference
	var tableRef = storageRef.table("Users");
	var count = 0;
	// Get all of the table's items
	tableRef.desc().getItems(function success(itemSnapshot) {
		if (itemSnapshot != null) {
			console.log("Users: " + itemSnapshot);
			usersDict[count] = itemSnapshot;
			count++;
		}else
		{		
			console.log("Users: /");	
			setUsersPages(1);	
		}
	});	
}

function setUsersPagesIndex(page)
{
	var pages = usersDict.length / userOffset;
	console.log('pages: '+ pages);
	var pagesList = '';
	for (var i = 1; i < pages + 1; i++) {
		console.log('pages: '+ pages + ' i: '+ i);
		if (i == page) {
			pagesList += '<li class="active"><a href="javascript:setUsersPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}else{
			pagesList += '<li><a href="javascript:setUsersPages('+i+');" data-original-title="Pag '+i+'" title="Pag '+i+'">'+i+'</a></li>';
		}				
	};

	var usersPagination1 = document.getElementById('usersPagination1');
	usersPagination1.innerHTML = pagesList;	

	var usersPagination2 = document.getElementById('usersPagination2');
	usersPagination2.innerHTML = pagesList;
}

function setUsersPages(page){
	setUsersPagesIndex(page);
	var contents = '';
	var init = (page - 1) * userOffset;
	var end = ((page * userOffset > usersDict.length - 1) ? usersDict.length : page * userOffset);

	for (var j = init; j < end; j++) {
				var itemSnapshot = usersDict[j];

				contents += '<tr class="active">';					
				contents += '<td>';
					contents += '<span class="label label-primary">'+itemSnapshot.val().UserName+'</>';
				contents += '</td>';
				contents += '<td>';
					contents += '<span class="label label-info">'+itemSnapshot.val().Password+'</span>';
				contents += '</td>';
				contents += '<td>';
					var remove = "'"+itemSnapshot.val().UserName+"'";
					contents += '<button class="btn btn-danger" type="button" id="BT_'+itemSnapshot.val().UserName+'" onclick="removeUser('+remove+', this)"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span></button>';
				contents += '</td>';
			contents += '</tr>';
	};

	var table = document.getElementById('usersBoby');
	table.innerHTML = contents;
	return false;
}


function loadUsers(){

	var user = getParameterByName('user');
	var pass = getParameterByName('pass');
	if (user && pass) {
		$('#newUsername').val(user);
		$('#newUserPass').val(pass);
	};	
}


function saveUser(){

	// Create a table reference
	var tableRef = storageRef.table("Users");

	// Creates an item reference
	var user = $('#newUsername').val();	
	var pass = $('#newUserPass').val();
	
	if (user == '' || pass == '') {
		alert('Must fill user and password fields');
		return;
	};
	var passhash = CryptoJS.MD5(pass);
	var itemRef = tableRef.push({ UserName: user, Password: passhash.toString()}, 
		function success(itemSnapshot) {
			window.location='ItemList.html';
	}, function error(message) {
			alert('Error saving data.');
		console.log('error:' + message);
	});
	
}


//-------------------------------------
function setTag(){
	$('#tagSelector').show();
	var type = getParameterByName('type');
	var timestamp = getParameterByName('timestamp');

	if (!type && !timestamp) {
		document.getElementById("tagsSelector").innerHTML = '';
		
		var contents = '';
		// Create a storage reference
		// Create a table reference
		var tableRef = storageRef.table("Tags");

		// Get all of the table's items
		console.log('selector:'+String($('#typesSelector').val()));

		tableRef.equals({ item: "Type", value: String($('#typesSelector').val()) }).getItems(function success(itemSnapshot) {
			if (itemSnapshot != null) {
				contents += '<option value="'+itemSnapshot.val().Tag+'">'+itemSnapshot.val().Tag+'</option>';
				
			}else
			{
				document.getElementById("tagsSelector").innerHTML = contents;
				console.log('contents tags: '+contents);
			}
		});	
	};
}

function setNewContent(){
	$('#newContent').show();
}

function imageDialog() {
    var url = prompt("Please the url for the image", "");
    
    if (url != null) {
        $("#imagePreview").attr("src", url);
    }
}


function confirmRemoveContent(MonthYear, timestamp){
	$('#myModal').modal('hide');
	grow.parentNode.parentNode.remove();

	// Create a table reference
	var tableRef = storageRef.table("Contents");

	var itemRef = tableRef.item({
	primary: MonthYear,
	secondary: timestamp
});

// delete item
itemRef.del(
	function success(itemSnapshot) {
		// Logs the value of the item
		contentsDict = new Array();

		getItems();
		console.log(itemSnapshot.val());
	}, 
	function error(data) { 
		console.error("Error:", data); 
	}
);
}

var grow;

function removeContent(type, timestamp, row){
	grow = row;
	console.log(row.parentNode.parentNode.nodeName);
	$('#myModal').modal('show');
	var confirm = "confirmRemoveContent('"+type+"','"+timestamp+"');";
	document.getElementById('modalFooter').innerHTML = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-danger" onclick="'+confirm+'">Remove content</button>';
}


function saveData(){

	var isNew = 0;
	var tableRef = storageRef.table("Contents");
	var type = $('#typesSelector').val();
	var timestamp = getParameterByName('timestamp');

	if (!timestamp) {
		timestamp = String(new Date().getTime());
		isNew = 1;
	};

	var contents = '';
	var d = new Date(parseInt(timestamp));
	var mount = ('0' + (d.getMonth()+1) );
	mount = mount.substring(mount.length - 2);
	contents += mount + '/' + d.getFullYear();

	var tag = $('#tagsSelector').val();
	if (!tag) {
		alert('Must have a valid tag before saving data.');
		return;
	};

	var title = $('#titleText').val();
	var url = $('#textURL').val();
	var img = $('#imagePreview').attr("src");
	var textArea = $('#textDesc').val();
	var textBody = $('#textBody').val();

	if (url == '' && textBody == '') {
		alert('Must fill field URL or field Body');
		return;
	};

	var json;
	if (itemReference) {
		if (textBody != '') {
			json = { Type: type, Tag: tag, Title: title, Body: textBody, IMG: img, Description: textArea};
		}else
		{
			json = { Type: type, Tag: tag, Title: title, URL: url, IMG: img, Description: textArea};
		}
		itemReference.set(
			json,
			function success(itemSnapshot) {
				window.location='ItemList.html';
			}, 
			function error(data) {
				alert('Error saving data.');
				console.error("Error:", data); 
			}
		);
	}else{
		if (textBody != '') {
			json = { MonthYear: contents, Type: type, Timestamp: timestamp,  Tag: tag, Title: title, Body: textBody, IMG: img, Description: textArea};
		}else
		{
			json = { MonthYear: contents, Type: type, Timestamp: timestamp,  Tag: tag, Title: title, URL: url, IMG: img, Description: textArea};
		}
		var itemRef = tableRef.push( json, 
			function success(itemSnapshot) {
				window.location='ItemList.html';
		}, function error(message) {
				alert('Error saving data.');
			console.log('error:' + message);
		});
	}
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var itemReference;

function loadData(){

	console.log('on load');
	var MonthYear = getParameterByName('MonthYear');
	var timestamp = getParameterByName('timestamp');

	console.log('MonthYear: ' + MonthYear);

	var contents = '';

	// Create a table reference
	var tableRef = storageRef.table("Contents");	
	// Get all of the table's items

	tableRef.equals({ item: "MonthYear", value: MonthYear, item: "Timestamp", value: timestamp }).getItems(function success(itemSnapshot) {
		if (itemSnapshot != null) {
			itemReference = itemSnapshot.ref();
			$('#titleText').val(itemSnapshot.val().Title);

			$('#textURL').val((itemSnapshot.val().URL != null) ? itemSnapshot.val().URL : '');

			$('#imagePreview').attr("src", itemSnapshot.val().IMG);

			$('#textDesc').val(itemSnapshot.val().Description);	
			
			$('#textBody').val((itemSnapshot.val().Body != null) ? itemSnapshot.val().Body : '');	

			$("#typesSelector").val(itemSnapshot.val().Type);

			
			console.log('on tag' + itemSnapshot.val().Tag);
			var type = itemSnapshot.val().Type;
			if (type && timestamp) {
				$("#typesSelector").prop('disabled', 'disabled');
				$("#tagsSelector").html('<option value="'+itemSnapshot.val().Tag+'">'+itemSnapshot.val().Tag+'</option>');
				$("#tagsSelector").val(itemSnapshot.val().Tag);
				$("#tagsSelector").prop('disabled', 'disabled');				
			};

		}
	});	
		
}

function loadTags(){

	var tag = getParameterByName('tag');
	var type = getParameterByName('type');
		if (tag && type) {
			$("#typesSelector").val(type);
			$("#typesSelector").prop('disabled', 'disabled');

			$('#newTagName').val(tag);
		};	
}


function saveTag(){

	// Create a table reference
	var tableRef = storageRef.table("Tags");

	// Creates an item reference

	var type = $('#typesSelector').val();
	console.log('type: '+type);
	
	var tag = $('#newTagName').val();
	console.log('tag: '+tag);
	
	if (tag == '') {
		alert('Must fill tag field');
		return;
	};

	var itemRef = tableRef.push({ Type: type, Tag: tag}, 
		function success(itemSnapshot) {
			var oldTag = getParameterByName('tag');
			if (oldTag) {
				var itemRef = tableRef.item({
					primary: oldTag,
				});
				// delete item
				itemRef.del(
					function success(itemSnapshot) {
						updateTagInContents(oldTag, tag, type);
						console.log("on delete:"); 
					}, 
					function error(data) { 
						console.log("Error:", data); 
					}
				);
			}else{
				window.location='ItemList.html';
			}

	}, function error(message) {
			alert('Error saving data.');
		console.log('error:' + message);
	});
	
}

function updateTagInContents(oldTag, newTag, MonthYear){
	var count = 0;
	// Create a table reference
	var tableRef = storageRef.table("Contents");	
	// Get all of the table's items
	console.log("old: " + oldTag);
	tableRef.equals({item: "MonthYear", value: MonthYear, item: "Tag", value: oldTag}).getItems(
		function success(itemSnapshot) {
			if (itemSnapshot) {
				console.log("item:" + itemSnapshot.val()); 
				count++;

				var itemRef = tableRef.push({ MonthYear: itemSnapshot.val().MonthYear, Type: itemSnapshot.val().Type, Timestamp: itemSnapshot.val().Timestamp,  Tag: newTag, Title: itemSnapshot.val().Title, URL: itemSnapshot.val().URL, IMG: itemSnapshot.val().IMG, Description: itemSnapshot.val().Description}, 
				function success(itemSnapshot) {
					console.log("on update success:" + itemSnapshot); 
					count--;
					if (count == 0) {
						window.location='ItemList.html';
					};
				}, 
				function error(message) {
					alert('Error saving data.');
					console.log('on update error:' + message);
				});
			}
	});
}




function confirmRemoveTag(type, tag){
	$('#myModal').modal('hide');
	delete tagsDict[grow.parentNode.parentNode.rowIndex];
	grow.parentNode.parentNode.remove();

	console.log('tag ' + tag);
	console.log('type ' + type);

	// Create a table reference
	var tableRef = storageRef.table("Tags");

	var itemRef = tableRef.item({
		primary: tag,
	});

	// delete item
	itemRef.del(
		function success(itemSnapshot) {
			tagsDict = new Array();

			getTags();
			
			console.log(itemSnapshot.val());
		}, 
		function error(data) { 
			console.error("Error:", data); 
		}
	);
}

var grow;

function removeTag(type, tag, row){
	grow = row;
	console.log(row.parentNode.parentNode.nodeName);
	$('#myModal').modal('show');
	var confirm = "confirmRemoveTag('"+type+"','"+tag+"');";
	document.getElementById('modalFooter').innerHTML = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-danger" onclick="'+confirm+'">Remove tag</button>';
}


function removeUser(user, row){
	grow = row;
	console.log(row.parentNode.parentNode.nodeName);
	$('#myModal').modal('show');
	console.log("removeUser user " + user);
	var confirm = "confirmRemoveUser('"+user+"');";
	document.getElementById('modalFooter').innerHTML = '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button><button type="button" class="btn btn-danger" onclick="'+confirm+'">Remove user</button>';
}

function confirmRemoveUser(user){
	$('#myModal').modal('hide');
	delete usersDict[grow.parentNode.parentNode.rowIndex];
	grow.parentNode.parentNode.remove();


	console.log("delete user " + user);
	// Create a table reference
	var tableRef = storageRef.table("Users");

	var itemRef = tableRef.item({
		primary: user
	});

	// delete item
	itemRef.del(
		function success(itemSnapshot) {
			usersDict = new Array();
			getUsers();
			
			console.log(itemSnapshot.val());
		}, 
		function error(data) { 
			console.error("Error:", data); 
		}
	);
}








