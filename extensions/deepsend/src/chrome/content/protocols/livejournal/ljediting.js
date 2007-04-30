ljEdit = new Object();
const ljeditbundle = document.getElementById("ljeditbundle"); 
var commonbundle = document.getElementById("commonbundle");

if (!parent.accountwindow) {
	LiveJournal = window.arguments[0];
	var postnum = window.arguments[1];
}

function InitEditing() {
	// Does the initial switching needed to make the post window into the edit window.
	// In: Nothing.
	// Out: Nothing.
	dsMidas.setUpMidas();
	ljPost.usejournal = window.arguments[2];
	document.getElementById("usejournal").collapsed = true;
	document.getElementById("postbutton").collapsed = true;
	document.getElementById("savebutton").collapsed = false;
	document.getElementById("deletebutton").collapsed = false;
	document.getElementById("savebutton").setAttribute("disabled", "true");
	document.getElementById("maindisabler").setAttribute("disabled", true);
	if (postnum == -1) {
		document.getElementById("cmd_lastentry").setAttribute("disabled", true);
	}
	document.getElementById("cmd_logout").setAttribute("disabled", true);
	document.getElementById("progressbar").mode = "undetermined";
	document.getElementById("statuslabel").value = commonbundle.getString("Loading");
	document.getElementById("statuswhat").value = ljeditbundle.getString("LoadingSelected");
	document.getElementById("messagedeck").selectedIndex = 1;
	document.title = ljeditbundle.getString("EditingPostIn") + " " + ljPost.usejournal;

	// Loads whatever the specified message number was.
	// In: Challenge from server.
	// Out: Nothing.
	ljEdit.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
	ljEdit.httpreq.onload = ljEdit.loadHandler;
	var params = new Object();

	params.user = LiveJournal.username.toLowerCase();

	
	if (LiveJournal.username != ljPost.usejournal) {
		params.usejournal = ljPost.usejournal;
	}

	
	params.selecttype = "one";
	params.itemid = postnum;
	params.lineendings = "unix";
	
	var body = "mode=getevents";
	body += LiveJournal.makeParams(params);
	
	ljEdit.httpreq.send(body);
}

ljEdit.loadHandler = function() {
	// In: Nothing.
	// Out: Nothing.

	var result = LiveJournal.responseArray(ljEdit.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		// Only 1 event is returned for this, but it's still in an array.
		// I just *know* this'll be the most frustrating part out of this entire program.
		
		var eventtime = LiveJournal.getResponseData("events_1_eventtime", result);
		postnum = LiveJournal.getResponseData("events_1_itemid", result);

		var security = LiveJournal.getResponseData("events_1_security", result);
		var subject = LiveJournal.getResponseData("events_1_subject", result);
		var event = LiveJournal.getResponseData("events_1_event", result, true);
		
		var proparray = [];
		for (i = 1; i <= LiveJournal.getResponseData("prop_count", result); i++) {
			proparray.push(encodeURIComponent(LiveJournal.getResponseData("prop_" + i + "_name", result)));
			proparray.push(encodeURIComponent(LiveJournal.getResponseData("prop_" + i + "_value", result)));
		}
		
		var mood = LiveJournal.getResponseData("current_mood", proparray);
		var moodid = LiveJournal.getResponseData("current_moodid", proparray);
		var taglist = LiveJournal.getResponseData("taglist", proparray);
		var location = LiveJournal.getResponseData("current_location", proparray);
		var music = LiveJournal.getResponseData("current_music", proparray);
		var dontautoformat = LiveJournal.getResponseData("opt_preformatted", proparray);
		var removecomments = LiveJournal.getResponseData("opt_nocomments", proparray);
		var backdate = LiveJournal.getResponseData("opt_backdated", proparray);
		var pickw = LiveJournal.getResponseData("picture_keyword", proparray);

		var etarray = eventtime.split(" ");
		var datearray = etarray[0].split("-");
		var timearray = etarray[1].split(":");

		ljPost.postDate = new Date();
		ljPost.postDate.setFullYear(parseInt(datearray[0], 10), parseInt(datearray[1], 10) - 1, parseInt(datearray[2], 10)); 
		ljPost.postDate.setHours(parseInt(timearray[0], 10), parseInt(timearray[1], 10), parseInt(timearray[2], 10));

		var secnode = document.getElementById("security");
		if (security) {
			switch (security) {
				case "private":
					secnode.selectedIndex = 1;
					dsPosts.changeSecurity(1, true);
					break;
				case "usemask":
					var allowmask = parseInt(LiveJournal.getResponseData("events_1_allowmask", result), 10);
					if (allowmask == 1) {
						secnode.selectedIndex = 2;
						dsPosts.changeSecurity(2, true);
					} else {
						secnode.selectedIndex = 3;
						ljPost.allowmask = allowmask;
						dsPosts.changeSecurity(3, true);
					}
					break;
			}
		} else {
			secnode.selectedIndex = 0;
			dsPosts.changeSecurity(0, true);
		}
		if (subject) {
			document.getElementById("subject").value = subject;
		}
		document.getElementById("messagesource").value = event;
		dsMidas.syncNormalTab();
		// Otherwise you can't backspace until you enter some text. Hooray for workarounds!
		document.getElementById("message").contentDocument.designMode = "On";
		document.getElementById("message").contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
		
		boxesGetFocus();
		
		if (moodid) {
			for (i = 0; i < LiveJournal.moods.length; i++) {
				if (LiveJournal.moods[i].id == moodid) {
					document.getElementById("moods").selectedIndex = i + 1;
					break;
				}
			}
		}
		if (mood) {
			document.getElementById("moodtext").value = mood;
		}
		if (music) {
			document.getElementById("music").value = music;
		}
		if (taglist) {
			document.getElementById("taglist").value = taglist;
		}
		if (location) {
			document.getElementById("location").value = location;
		}
		if (dontautoformat) {
			ljPost.dontautoformat = true;
			dsMidas.dontautoformat = true;
		}
		if (removecomments) {
			ljPost.removecomments = true;
		}
		if (backdate) {
			ljPost.backdate = true;
		}
		if (pickw) {
			var picmenu = document.getElementById("picture");
			for (i = 0; i < LiveJournal.pickws.length; i++) {
				if (LiveJournal.pickws[i].pickw == pickw) {
					picmenu.selectedIndex = i + 1;
					dsPosts.changePicture(picmenu);
					break;
				}
			}
		}
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("savebutton").removeAttribute("disabled");
		boxesLoseFocus();
		document.getElementById("messagedeck").selectedIndex = 0;
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + ljEdit.httpreq.request.responseText);
		}
	}
}

ljEdit.saveEdit = function(skipspellcheck) {
	// Saves the edited post to the server.
	// In: Boolean on whether or not to skip the spellchecker or not (no point checking spelling if you're deleting a post).
	// Out: Nothing.
	if (this.posting) {
		this.posting = false;
		this.httpreq.request.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("savebutton").label = commonbundle.getString("Save");
	} else {
		if ((dsPrefs.getBoolPref("SpellCheckOnPost")) && (!skipspellcheck)) {
			// goDoCommand won't work for some reason.
			eval(document.getElementById("cmd_spell").getAttribute("oncommand"));
		}

		document.getElementById("savebutton").label = commonbundle.getString("Cancel");
		document.getElementById("maindisabler").setAttribute("disabled", true);
		document.getElementById("statuslabel").value = ljeditbundle.getString("Editing");
		document.getElementById("statuswhat").value = ljeditbundle.getString("Saving");
		document.getElementById("progressbar").mode = "undetermined";
		document.getElementById("messagedeck").selectedIndex = 1;
		this.posting = true;
		ljEdit.saveEditedPost();
	}
}

ljEdit.saveEditedPost = function() {
	// Puts together the values to send off as an edited post.
	// In: Challenge string.
	// Out: Nothing.
	this.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl, this.saveEdit);
	this.httpreq.onload = this.editHandler;
	var params = new Object();
	
	params.user = LiveJournal.username.toLowerCase();

	
	params.lineendings = "unix";
	params.itemid = postnum;
	var subjectbox = document.getElementById("subject");
	if (subjectbox.value.trim().length > 0) {
		params.subject = subjectbox.value;
	}
	dsMidas.updateSourceTab();
	params.event = document.getElementById("messagesource").value;
	switch (ljPost.security) {
		case 0:
			params.security = "public";
			break;
		case 1:
			params.security = "private";
			break;
		case 2:
		case 3:
			params.security = "usemask";
			params.allowmask = ljPost.allowmask;
			break;
	}
	params.year = ljPost.postDate.getYear() + 1900;
	params.mon = ljPost.postDate.getMonth() + 1;
	params.day = ljPost.postDate.getDate();
	params.hour = ljPost.postDate.getHours();
	params.min = ljPost.postDate.getMinutes();
	
	if (LiveJournal.username != ljPost.usejournal) {
		params.usejournal = ljPost.usejournal;
	}

	// Ugh. Props will suck.
	var moodbox = document.getElementById("moods");
	var moodtext = document.getElementById("moodtext");
	if (moodbox.selectedIndex > 0) {
		params.prop_current_moodid = moodbox.value;
	} else {
		params.prop_current_moodid = 0;
	}
	if (moodtext.value.trim().length > 0) {
		params.prop_current_mood = moodtext.value;
	} else {
		params.prop_current_mood = 0;
	}
	
	var musicbox = document.getElementById("music");
	if (!musicbox.getAttribute("empty")) {
		params.prop_current_music = musicbox.value.trim();
	} else {
		params.prop_current_music = 0;
	}

	var tagbox = document.getElementById("taglist");
	var locationbox = document.getElementById("location");
	if (LiveJournal.usetags) {
		if (!tagbox.getAttribute("empty")) {
			params.prop_taglist = tagbox.value.trim();
		} else {
			params.prop_taglist = 0;
		}
		if (!locationbox.getAttribute("empty")) {
			params.prop_current_location = locationbox.value.trim();
		} else {
			params.prop_current_location = 0;
		}
	}

	if (ljPost.dontautoformat) {
		params.prop_opt_preformatted = 1;
	} else {
		params.prop_opt_preformatted = 0;
	}
	
	if (ljPost.removecomments) {
		params.prop_opt_nocomments = 1;
	} else {
		params.prop_opt_nocomments = 0;
	}
	
	if (ljPost.backdate) {
		params.prop_opt_backdated = 1;
	} else {
		params.prop_opt_backdated = 0;
	}
	
	var pickwbox = document.getElementById("picture");
	if (pickwbox.selectedIndex > 0) {
		params.prop_picture_keyword = ljPost.pickw;
	} else {
		params.prop_picture_keyword = 0;
	}

	
	
	var body = "mode=editevent";
	body += LiveJournal.makeParams(params);
	
	document.getElementById("statuswhat").value = ljeditbundle.getString("EditingPostIn") + " " + ljPost.usejournal;
	
	this.httpreq.send(body);
}

ljEdit.editHandler = function() {
	// In: Nothing.
	// Out: Nothing.
	var result = LiveJournal.responseArray(ljEdit.httpreq.request.responseText);
	if (ljEdit.posting) {
		if (LiveJournal.getResponseData("success", result) == "OK") {
			// Workaround for weird bug where window won't close.
			var history = GetWindowByType("deepestsender:history");
			if (history) {
				history.setTimeout("dsCalendar.setSelected();", 1);
			}
			setTimeout("window.close();", 1);
		} else {
			var errmsg = LiveJournal.getResponseData("errmsg", result);
			if (errmsg) {
				alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
			} else {
				alert(commonbundle.getString("ErrorRequest") + " " + ljEdit.httpreq.request.responseText);
			}
			ljEdit.saveEdit();
		}
	}
}

ljEdit.deletePost = function() {
	if (confirm(commonbundle.getString("SureToDelete"))) {
		document.getElementById("message").contentDocument.body.innerHTML = "";
		document.getElementById("messagesource").value = "";
		this.saveEdit(true);
	}
}

