LiveJournal = window.arguments[0];
dsPosts = window.arguments[1];
mainWindow = window.arguments[2];
mainDocument = mainWindow.document;
dsPrefs = window.arguments[3];
ljPost = window.arguments[4];
dsAccounts = window.arguments[5];
var psbundle;
function Init() {
	// No idea why, but if this is defined outside, then it won't load...
	psbundle = document.getElementById("postoptionsbundle");
	// A bit messy, but convenient. Copies all the values from the main window. Why are these options here when
	//	they're already on the post window? Because they're invisble when you load DS in the sidebar, which is
	//	why this is necessary.
	// In: Nothing.
	if (!dsAccounts) {
		document.getElementById("defaults").collapsed = true;
	}
	if (dsPrefs.getIntPref("DetectMethod") == 0) {
		document.getElementById("detectmusic").collapsed = true;
	}
	document.getElementById("security").appendChild(mainDocument.getElementById("security").firstChild.cloneNode(true));
	mainWindow.boxesGetFocus();
	if (!LiveJournal.usetags) {
		document.getElementById("taghbox").collapsed = true;
		document.getElementById("locationhbox").collapsed = true;
	}
	document.getElementById("security").selectedIndex = mainDocument.getElementById("security").selectedIndex;
	document.getElementById("moods").appendChild(mainDocument.getElementById("moods").firstChild.cloneNode(true));
	document.getElementById("moods").lastChild.firstChild.setAttribute("label", " ");
	document.getElementById("moods").selectedIndex = mainDocument.getElementById("moods").selectedIndex;
	document.getElementById("moodtext").value = mainDocument.getElementById("moodtext").value;
	document.getElementById("picture").appendChild(mainDocument.getElementById("picture").firstChild.cloneNode(true));
	
	document.getElementById("picture").selectedIndex = mainDocument.getElementById("picture").selectedIndex;
	document.getElementById("music").value = mainDocument.getElementById("music").value;
	document.getElementById("location").value = mainDocument.getElementById("location").value;
	document.getElementById("taglist").value = mainDocument.getElementById("taglist").value;
	
	document.getElementById("dontautoformat").setAttribute("checked", ljPost.dontautoformat);
	
	document.getElementById("removecomments").setAttribute("checked", ljPost.removecomments);
	document.getElementById("backdate").setAttribute("checked", ljPost.backdate);
	
	dsCalendar.extraSetSelected = function(day, month, year) {
		var days = document.getElementById("calendarbox").getElementsByTagName("toolbarbutton");
		for (i = 0; i < days.length; i++) {
			days[i].removeAttribute("style");
		}
		document.getElementById("day" + dsCalendar.selectedday).setAttribute("style", "font-weight: bold;");
	}
	
	if (ljPost.postDate) {
		document.getElementById("settime").checked = true;
		document.getElementById("manualtime").removeAttribute("disabled");
		document.getElementById("hour").value = ZeroFix(ljPost.postDate.getHours());
		document.getElementById("minute").value = ZeroFix(ljPost.postDate.getMinutes());
		var cal = new Date();
		cal.setFullYear(ljPost.postDate.getYear() + 1900, ljPost.postDate.getMonth(), ljPost.postDate.getDate());
		dsCalendar.init(cal);
		dsCalendar.setSelected(document.getElementById("day" + dsCalendar.selectedday));
	} else {
		var now = new Date();
		dsCalendar.init(now);
		document.getElementById("hour").value = ZeroFix(now.getHours());
		document.getElementById("minute").value = ZeroFix(now.getMinutes());
		dsCalendar.setSelected(document.getElementById("day" + dsCalendar.selectedday));
		dsCalendar.disableCalendar(document.getElementById("calvbox"), true);
	}
	sizeToContent();
}
function OkClicked() {
	// Copies values back to the post window, and also sets defaults if 'set as defaults' is checked.
	// In: Nothing.
	// Out: Nothing.
	mainDocument.getElementById("security").selectedIndex = document.getElementById("security").selectedIndex;
	dsPosts.changeSecurity(mainDocument.getElementById("security").selectedIndex, true);
	mainDocument.getElementById("picture").selectedIndex = document.getElementById("picture").selectedIndex;
	dsPosts.changePicture(mainDocument.getElementById("picture"));
	mainDocument.getElementById("music").value = document.getElementById("music").value;
	mainDocument.getElementById("location").value = document.getElementById("location").value;
	mainDocument.getElementById("taglist").value = document.getElementById("taglist").value;
	mainDocument.getElementById("moods").selectedIndex = document.getElementById("moods").selectedIndex;
	mainDocument.getElementById("moodtext").value = document.getElementById("moodtext").value;
	
	ljPost.dontautoformat = document.getElementById("dontautoformat").checked;
	mainWindow.dsMidas.dontautoformat = ljPost.dontautoformat;
	ljPost.removecomments = document.getElementById("removecomments").checked;
	ljPost.backdate = document.getElementById("backdate").checked;
	
	if (document.getElementById("settime").checked) {
		ljPost.postDate = new Date();
		ljPost.postDate.setFullYear(dsCalendar.year, dsCalendar.month, dsCalendar.selectedday);
		ljPost.postDate.setHours(parseInt(document.getElementById("hour").value, 10), parseInt(document.getElementById("minute").value, 10));
	} else {
		delete ljPost.postDate;
	}
	
	if (document.getElementById("defaults").checked) {
		var defsectag = GetTag(dsAccounts.currentaccount, "security");
		defsectag.setAttribute("level", document.getElementById("security").selectedIndex); 
		defsectag.setAttribute("groups", ljPost.allowmask);
		var defaultoptions = GetTag(dsAccounts.currentaccount, "options");
		if (ljPost.backdate) {
			defaultoptions.setAttribute("backdate", ljPost.backdate);
		} else {
			defaultoptions.removeAttribute("backdate");
		}
		if (ljPost.dontautoformat) {
			defaultoptions.setAttribute("dontautoformat", ljPost.dontautoformat);
		} else {
			defaultoptions.removeAttribute("dontautoformat");
		}
		if (ljPost.removecomments) {
			defaultoptions.setAttribute("removecomments", ljPost.removecomments);
		} else {
			defaultoptions.removeAttribute("removecomments");
		}
		dsAccounts.saveSettings();
	}
	mainWindow.boxesLoseFocus();
}
function EnableManualTime(yesno) {
	if (yesno) {
		document.getElementById("manualtime").removeAttribute("disabled");
		dsCalendar.disableCalendar(document.getElementById("calvbox"), false);
	} else {
		document.getElementById("manualtime").setAttribute("disabled", true);
		dsCalendar.disableCalendar(document.getElementById("calvbox"), true);
	}
}
function VerifyIsNumber(textbox) {
	if (isNaN(textbox.value)) {
		var sound = Components.classes["@mozilla.org/sound;1"].getService(Components.interfaces.nsISound);
		sound.beep();
		var newtext = "";
		for (i = 0; i < textbox.value.length; i++) {
			if (!isNaN(textbox.value.charAt(i))) {
				newtext += textbox.value.charAt(i);
			}
		}
		textbox.value = newtext;
	}
}
function ViewTags() {
	var tagbox = document.getElementById("taglist");
	passon = tagbox.value;
	window.openDialog("tags.xul","tags","chrome,modal",ljPost,LiveJournal,passon);
	if (LiveJournal.posttags) {
		tagbox.value = LiveJournal.posttags;
		delete LiveJournal.posttags;
	}
}
