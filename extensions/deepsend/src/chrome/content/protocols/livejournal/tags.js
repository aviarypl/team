var ljPost = window.arguments[0];
var LiveJournal = window.arguments[1];
var taglist = window.arguments[2];
var tagsreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
var tagsloaded, commonbundle;
function Init() {
	commonbundle = document.getElementById("commonbundle");
	document.getElementById("loading").removeAttribute("type");
	if (!LiveJournal.tags) {
		tagsreq.onload = TagsLoaded;
		var params = new Object();
		params.user = LiveJournal.username.toLowerCase();
		
		if (ljPost.usejournal != LiveJournal.username) {
			params.usejournal = ljPost.usejournal;
		}
		var body = "mode=getusertags";
		body += LiveJournal.makeParams(params);
		tagsreq.send(body);
	} else {
		ShowTags();
	}
}

function TagsLoaded() {
	var result = LiveJournal.responseArray(tagsreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		// Loaded!
		LiveJournal.tags = [];
		for (i = 1; i <= parseInt(LiveJournal.getResponseData("tag_count", result), 10); i++) {
			LiveJournal.tags.push(LiveJournal.getResponseData("tag_" + i + "_name", result));
		}
		LiveJournal.tags.sort();
		ShowTags();
		//sizeToContent();
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + result);
		}
	}
}

function ShowTags() {
	var tagarray = taglist.split(",");
	for (i = 0; i < tagarray.length; i++) {
		tagarray[i] = tagarray[i].trim();
	}
	var tagsbox = document.getElementById("tags");
	tagsbox.removeChild(tagsbox.lastChild);
	for (i = 0; i < LiveJournal.tags.length; i++) {
		tagsbox.appendItem(LiveJournal.tags[i]);
		tagsbox.lastChild.setAttribute("type", "checkbox");
		if (tagarray.indexOf(LiveJournal.tags[i]) >= 0) {
			tagsbox.lastChild.setAttribute("checked", true);
		}
	}
	if (taglist != "") {
		for (i = 0; i < tagarray.length; i++) {
			if (LiveJournal.tags.indexOf(tagarray[i]) < 0) {
				tagsbox.appendItem(tagarray[i]);
				tagsbox.lastChild.setAttribute("type", "checkbox");
				tagsbox.lastChild.setAttribute("checked", true);
			}
		}
	}
	tagsloaded = true;
}

function OkClicked() {
	if (tagsloaded) {
		var tagsbox = document.getElementById("tags");
		var newtags = [];
		for (i =0; i < tagsbox.childNodes.length; i++) {
			if (tagsbox.childNodes[i].getAttribute("checked")) {
				newtags.push(tagsbox.childNodes[i].label);
			}
		}
		LiveJournal.posttags = newtags.join(", ");
		LiveJournal.tagsokclicked = true;
	}
}
