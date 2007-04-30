var post, postlink;
metaEdit = new Object();
blogEdit = new Object();

const editbundle = document.getElementById("editbundle");
var commonbundle = document.getElementById("commonbundle");

// This section is very inefficient, but I was short of time when writing it. It will be cleaned up in subsequent versions. <-- yeah right

function InitEditing() {
	dsMidas.dontautoformat = false;
	dsMidas.setUpMidas();
	document.getElementById("cmd_logout").setAttribute("disabled", true);
	document.getElementById("postbutton").collapsed = true;
	document.getElementById("deletebutton").collapsed = false;
	document.getElementById("savebutton").collapsed = false;
	if (usemeta) {
		//document.getElementById("linkbox").collapsed = true;
		post = metaWeblog.posthistory.httpreq.response[0][itemid];
		document.title = editbundle.getString("EditingPost") + " " + post["postid"] + "/" + metaWeblog.blogs[0][0]["blogName"];
		if (metaWeblog.enablecategories) {
			var categories = post["categories"];
			var catsnode = document.getElementById("categories"); 
			if (categories.length > 1) {
				catsnode.selectedIndex = catsnode.firstChild.childNodes.length - 1;
				catsnode.selectedItem.setAttribute("value", categories.join(","));
			} else {
				for (i = 0; i < metaWeblog.categories[0].length; i++) {
					if (metaWeblog.categories[0][i]["description"] == categories[0]) {
						catsnode.selectedIndex = i;
						break;
					}
				}
			}
		}
		if (post["title"]) {
			document.getElementById("subject").value = post["title"];
		}
		document.getElementById("messagesource").value = post["description"];
	} else {
		blogger.entry = blogger.entries[itemid];
		document.title = editbundle.getString("EditingPost") + " " + blogger.entry.getElementsByTagName("id")[0].textContent;
		var subject = blogger.entry.getElementsByTagName("title")[0].textContent;
		var links = blogger.entry.getElementsByTagName("link");
		for (var x = 0; x < links.length; x++) {
			if (links[x].getAttribute("rel") == "related") {
				var link = links[x];
				break;
			}
		}
		var event = blogger.entry.getElementsByTagName("content")[0];
		var draft = blogger.entry.getElementsByTagNameNS("http://purl.org/atom/app#", "draft")[0];
		//var linebreak = blogger.entry.getElementsByTagNameNS("http://purl.org/atom-blog/ns#", "convertLineBreaks")[0];
		post = event.textContent;
		post = post.replace(/\n/g, "");
		post = post.replace(/<br[\s\/]*?>/g, "\n");
		post = post.replace(/<.*?>(.*)<\/div>/gi, "$1");
		if (subject) {
			// Blogger returns titles as about 50 characters with ... at the end if there's no actual title to the post.
			// This is annoying and creates more work for me. I hate you, Blogger.
			if (subject.substr(0, subject.length - 3) != event.textContent.replace(/\n+/g, " ").substr(0, subject.length - 3)) {
				document.getElementById("subject").value = subject;
			} else {
				document.getElementById("subject").value = null;
			}
		}
		
		if (link) {
			document.getElementById("link").value = link.getAttribute("href");
		}
		
		if ((draft) && (draft.textContent == "yes")) {
			document.getElementById("draftcheck").setAttribute("checked", true);
		}
		postlinks = blogger.entry.getElementsByTagName("link");
		for (var i = 0; i < postlinks.length; i++) {
			if (postlinks[i].getAttribute("rel") == "edit") {
				postlink = postlinks[i].getAttribute("href");
				continue;
			}
		}
		document.getElementById("messagesource").value = post;
	}
	document.getElementById("message").contentDocument.designMode = "On";
	document.getElementById("message").contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
	dsMidas.syncNormalTab();
}

dsPosts.saveEdit = function() {
	if (usemeta) {
		metaEdit.saveEdit();
	} else {
		blogEdit.saveEdit();
	}
}

dsPosts.deletePost = function() {
	if (usemeta) {
		metaEdit.deletePost();
	} else {
		blogEdit.deletePost();
	}
}

// metaWeblog-specific stuff.

metaEdit.deletePost = function() {
	if (metaEdit.posting) {
		metaEdit.posting = false;
		metaEdit.httpreq.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("savebutton").label = commonbundle.getString("Save");
	} else {
		if (confirm(commonbundle.getString("SureToDelete"))) {
			metaEdit.posting = true;
			document.getElementById("savebutton").label = commonbundle.getString("Cancel");
			document.getElementById("maindisabler").setAttribute("disabled", true);
			document.getElementById("statuslabel").value = commonbundle.getString("Deleting");
			document.getElementById("statuswhat").value = editbundle.getString("DeletingFromServer");
			document.getElementById("progressbar").mode = "undetermined";
			document.getElementById("messagedeck").selectedIndex = 1;
			
			var params = [];
			params.push("0123456789ABCDEF");
			params.push(post["postid"]);
			params.push(metaWeblog.username);
			params.push(metaWeblog.password);
			params.push(true);
			
			var deletepost = makeXMLRpcCall("blogger.deletePost", params);
			
			metaEdit.httpreq = new XMLHttpRequest();
			metaEdit.httpreq.onload = metaEdit.editHandler;
			metaEdit.httpreq.onerror = function() {
				alert(commonbundle.getString("ErrorConnecting"));
				metaEdit.deletePost();
			}
			metaEdit.httpreq.open("POST", metaWeblog.posturl, true);
			metaEdit.httpreq.setRequestHeader("Content-Type", "text/xml");
			metaEdit.httpreq.send(deletepost);
		}
	}
}

metaEdit.editHandler = function() {
	try {
		var response = parseXMLRpcResponse(metaEdit.httpreq.responseXML);
		dump(metaWeblog.httpreq.responseText);
		if ((response["faultCode"]) || (response["faultString"])) {
			alert(editbundle.getString("ErrorSaving") + " " + response["faultString"]);
			metaEdit.deletePost();
		} else {
			var history = GetWindowByType("deepestsender:history");
			if (history) {
				history.setTimeout("LoadPostHistory();", 1);
			}
			setTimeout("window.close();", 1);
		}
	} catch (e) {
		alert(e);
		metaEdit.deletePost();
	}
}

metaEdit.saveEdit = function() {
	if (metaEdit.posting) {
		metaEdit.posting = false;
		metaEdit.httpreq.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("savebutton").label = commonbundle.getString("Save");
	} else {
		dsMidas.updateSourceTab();
		metaEdit.posting = true;
		document.getElementById("savebutton").label = commonbundle.getString("Cancel");
		document.getElementById("maindisabler").setAttribute("disabled", true);
		document.getElementById("statuslabel").value = editbundle.getString("Saving");
		document.getElementById("statuswhat").value = editbundle.getString("SavingToServer");
		document.getElementById("progressbar").mode = "undetermined";
		document.getElementById("messagedeck").selectedIndex = 1;
		
		var params = [];
		params.push(post["postid"]);
		params.push(metaWeblog.username);
		params.push(metaWeblog.password);
		params.push(post);
		delete params[3]["postid"];
		var subjectbox = document.getElementById("subject");
		if (subjectbox.value.trim().length > 0) {
			params[3]["title"] = subjectbox.value;
		}
		params[3]["description"] = document.getElementById("messagesource").value;
		if (metaWeblog.enablecategories) {
			params[3]["categories"] = []
			var cats = document.getElementById("categories").selectedItem;
			catarr = cats.getAttribute("value").split(",");
			for (i = 0; i < catarr.length; i++) {
				params[3]["categories"].push(catarr[i]);
			}
		}
		delete params[3]["dateCreated"];
		params.push(!document.getElementById("draftcheck").checked);
		
		var blogpost = makeXMLRpcCall("metaWeblog.editPost", params);
		metaEdit.httpreq = new XMLHttpRequest();
		metaEdit.httpreq.onload = metaEdit.editHandler;
		metaEdit.httpreq.onerror = function() {
			alert(commonbundle.getString("ErrorConnecting"));
			metaEdit.saveEdit();
		}
		metaEdit.httpreq.open("POST", metaWeblog.posturl, true);
		metaEdit.httpreq.setRequestHeader("Content-Type", "text/xml");
		metaEdit.httpreq.send(blogpost);
	}
}

// Blogger-specific stuff.

blogEdit.deletePost = function() {
	if (blogEdit.posting) {
		blogEdit.posting = false;
		blogEdit.httpreq.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("savebutton").label = commonbundle.getString("Save");
	} else {
		if (confirm(commonbundle.getString("SureToDelete"))) {
			blogEdit.posting = true;
			document.getElementById("savebutton").label = commonbundle.getString("Cancel");
			document.getElementById("maindisabler").setAttribute("disabled", true);
			document.getElementById("statuslabel").value = commonbundle.getString("Deleting");
			document.getElementById("statuswhat").value = editbundle.getString("DeletingFromServer");
			document.getElementById("progressbar").mode = "undetermined";
			document.getElementById("messagedeck").selectedIndex = 1;
			
			blogEdit.httpreq = new blogger.BloggerRequest(postlink, "DELETE");
			blogEdit.httpreq.onload = function(){}
			blogEdit.httpreq.request.onreadystatechange = blogEdit.editHandler;
			blogEdit.httpreq.onerror = function() {
				alert(commonbundle.getString("ErrorConnecting"));
				blogEdit.deletePost();
			}
			blogEdit.httpreq.send(null);
		}
	}
}

blogEdit.editHandler = function() {
	if (blogEdit.httpreq.request.readyState == 4) {
		if ((blogEdit.httpreq.request.status == 200) || (blogEdit.httpreq.request.status == 201) || (blogEdit.httpreq.request.status == 204) || (blogEdit.httpreq.request.status == 205)) {
			var history = GetWindowByType("deepestsender:history");
			if (history) {
				history.setTimeout("LoadPostHistory();", 1);
			}
			setTimeout("window.close();", 1);
		} else {
			alert(editbundle.getString("ErrorSaving") + " " + blogEdit.httpreq.request.responseText);
			blogEdit.deletePost();
		}
	}
}

blogEdit.saveEdit = function() {
	if (blogEdit.posting) {
		blogEdit.posting = false;
		blogEdit.httpreq.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("savebutton").label = commonbundle.getString("Save");
	} else {
		dsMidas.updateSourceTab();
		blogEdit.posting = true;
		document.getElementById("savebutton").label = commonbundle.getString("Cancel");
		document.getElementById("maindisabler").setAttribute("disabled", true);
		document.getElementById("statuslabel").value = editbundle.getString("Saving");
		document.getElementById("statuswhat").value = editbundle.getString("SavingToServer");
		document.getElementById("progressbar").mode = "undetermined";
		document.getElementById("messagedeck").selectedIndex = 1;
		
		var editpost = new AtomPost();
		var subjectbox = document.getElementById("subject");
		if (subjectbox.value.trim().length > 0) {
			editpost.title = subjectbox.value;
		}
		
		
		var linkbox = document.getElementById("link");
		if (linkbox.value.trim().length > 0) {
			editpost.link = linkbox.value;
		}
		
		
		var draftpost = false;
		if (document.getElementById("draftcheck").checked) {
			editpost.draft = true;
		}
		
		editpost.post = document.getElementById("messagesource").value;
		try {
			var atom = editpost.returnAtom();
		} catch(e) {
			alert(e);
			blogEdit.saveEdit();
			return;
		}
		
		// Dear diary, today I found out that Blogger's fucking GData API is buggier than all of MySpace put together.
		//atom.date = new Date();
		//atom.date.setISO8601(blogger.entry.getElementsByTagName("published")[0].textContent);
		
		
		blogEdit.httpreq = new blogger.BloggerRequest(postlink, "PUT");
		blogEdit.httpreq.request.onreadystatechange = blogEdit.editHandler;
		blogEdit.httpreq.onload = function(){}
		blogEdit.httpreq.onerror = function() {
			alert(commonbundle.getString("ErrorConnecting"));
			blogEdit.saveEdit();
		}
		blogEdit.httpreq.send(atom);
	}
}
