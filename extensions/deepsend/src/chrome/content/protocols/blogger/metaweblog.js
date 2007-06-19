const metabundle = document.getElementById("metabundle");
var commonbundle = document.getElementById("commonbundle");



function doMetaWeblogStuff() {
	if ((metaWeblog.enablecategories) && (metaWeblog.categories[0].length > 0)) {
		var postcat = document.getElementById("categories");
		//postcat.appendChild(document.createElement("menupopup"));
	
		for (i = 0; i < metaWeblog.categories[0].length; i++) {
			postcat.appendItem(metaWeblog.categories[0][i]["description"], metaWeblog.categories[0][i]["description"]);
		}
		postcat.appendItem(metabundle.getString("Multiple"));
		postcat.lastChild.lastChild.setAttribute("oncommand", "window.openDialog('categories.xul','dscategories','chrome,modal',metaWeblog,this);");
		
		document.getElementById("catbox").collapsed = false;
		postcat.selectedIndex = 0;
	} else if (metaWeblog.categories[0].length < 1) {
		metaWeblog.enablecategories = false;
	}
	//document.getElementById("activeblog").collapsed = true;
	document.getElementById("linkbox").collapsed = true;
}

dsPosts.metaPostToServer = function() {
	document.getElementById("statuswhat").value = commonbundle.getString("PostingTo") + " " + metaWeblog.blogs[0][0]["blogName"];
	dsMidas.updateSourceTab();
	var params = [];
	params.push(metaWeblog.blogs[0][0]["blogid"]);
	params.push(metaWeblog.username);
	params.push(metaWeblog.password);
	var blogstruct = new Object();
	var subjectbox = document.getElementById("subject");
	if (subjectbox.value.trim().length > 0) {
		blogstruct["title"] = subjectbox.value;
	}
	blogstruct["description"] = document.getElementById("messagesource").value;
	if (metaWeblog.enablecategories) { 
		blogstruct["categories"] = [];
		var cats = document.getElementById("categories").selectedItem;
		catarr = cats.getAttribute("value").split("/|-");
		for (i = 0; i < catarr.length; i++) {
			alert(catarr[i]);
			blogstruct["categories"].push(catarr[i]);
		}
	}
	params.push(blogstruct);
	params.push(!document.getElementById("draftcheck").checked);
	var blogpost = makeXMLRpcCall("metaWeblog.newPost", params);
	
	//wd
	//var serializer = new XMLSerializer();
	//var xmlstr = serializer.serializeToString(blogpost);
	//alert(xmlstr);
	//metaWeblog.dumpXml(blogpost);

	metaWeblog.httpreq = new XMLHttpRequest();
	metaWeblog.httpreq.onload = dsPosts.metaPostHandler;
	metaWeblog.httpreq.onerror = function() {
		alert(commonbundle.getString("ErrorConnecting"));
		dsPosts.sendPost();
	}
	metaWeblog.httpreq.open("POST", metaWeblog.posturl, true);
	metaWeblog.httpreq.setRequestHeader("Content-Type", "text/xml");
	document.getElementById("statuslabel").value = commonbundle.getString("Posting");
	metaWeblog.httpreq.send(blogpost);
}

dsPosts.metaPostHandler = function() {
	if (dsPosts.posting) {
		try {
			var response = parseXMLRpcResponse(metaWeblog.httpreq.responseXML);
			//metaWeblog.dumpXml(metaWeblog.httpreq.responseXML);
			if ((response["faultCode"]) || (response["faultString"])) {
				alert(commonbundle.getString("ErrorPosting") + " " + response["faultString"]);
			} else {
				// success!
				dsPosts.resetPostParameters();
			}
		} catch (e) {
			alert(e);
		}
		dsPosts.sendPost();
	}
}
