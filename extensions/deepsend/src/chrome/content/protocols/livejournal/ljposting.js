// DS's posting and editing functions for LiveJournal.
const ljpostingbundle = document.getElementById("ljbundle");
if (parent.accountwindow) {
	LiveJournal = parent.LiveJournal;
	dsAccounts = parent.dsAccounts;
	var isSidebar = parent.isSidebar;
}
dsPosts = new Object();
var dsPrefs = new PrefsWrapper1("extensions.deepestSender.");
function Init() {
	// Main init function for the post/edit window.
	// In: Nothing.
	// Out: Nothing.
	document.getElementById("ljbuttons").collapsed = false;
	if (isSidebar) {
		document.getElementById("mainbox").orient = "vertical";
		document.getElementById("postoptions").collapsed = true;
	}
	if (dsPrefs.getIntPref("DetectMethod") == 0) {
		document.getElementById("detectmusic").collapsed = true;
	}
	var picalign = ["start", "center", "end"]
	document.getElementById("userpicbox").setAttribute("pack", picalign[dsPrefs.getIntPref("PicAlign")]);
	
	
	ljPost.usejournal = LiveJournal.username;
	
	var pickwlist = document.getElementById("picture");
	pickwlist.appendChild(document.createElement("menupopup"));
	pickwlist.appendItem(ljpostingbundle.getString("DefaultPic"), LiveJournal.defaultpicurl);
	for (i = 0; i < LiveJournal.pickws.length; i++) {
		pickwlist.appendItem(LiveJournal.pickws[i].pickw, LiveJournal.pickws[i].url);
	}
	pickwlist.selectedIndex = 0;
	var moodlist = document.getElementById("moods");
	moodlist.appendItem(ljpostingbundle.getString("CurrentMood"), "nomood");
	moodlist.lastChild.lastChild.setAttribute("class", moodlist.lastChild.lastChild.getAttribute("class") + " empty");
	for (i = 0; i < LiveJournal.moods.length; i++) {
		moodlist.appendItem(LiveJournal.moods[i].mood, LiveJournal.moods[i].id);
	}
	dsPosts.makeMenus(document.getElementById("web_menu"), LiveJournal.menus);
	// Get around weird Fx bug where the newly created web menu won't display, so I have an already defined one in XUL, then wipe it out when
	//	the menus have been created, which gets around it.
	document.getElementById("web_menu").removeChild(document.getElementById("web_menu").firstChild);
	document.getElementById("usernametitle").value = LiveJournal.username;
	
	dsPosts.resetPostParameters();
	
	boxesLoseFocus();
	
	
	if (!LiveJournal.usetags) {
		document.getElementById("entrytags").collapsed = true;
		// If it can't support tags, odds are it can't support location either.
		document.getElementById("location").collapsed = true;
		
	}
	
	if (parent.accountwindow) {
		InitPosting();
	} else {
		InitEditing();
	}
	
}
function InitPosting() {
	// Sets up what is needed for posting.
	// In: Nothing.
	// Out: Nothing.
	var journallist = document.getElementById("usejournal");
	journallist.appendItem(LiveJournal.username);
	for (i = 0; i < LiveJournal.usejournals.length; i++) {
		journallist.appendItem(LiveJournal.usejournals[i]);
	}
	journallist.selectedIndex = 0;
	var birthdays = [];
	function birthdayHunt(friend) {
		var now = new Date();
		var bday = friend.birthday.split("-");
		if ((!friend.type) && (parseInt(bday[1],10) == now.getMonth() + 1) && (parseInt(bday[2],10) == now.getDate())) {
			birthdays.push(friend);
		}
	}
	LiveJournal.friends.forEach(birthdayHunt);
	if (birthdays.length > 0) {
		var birthdaybox = document.getElementById("birthdaybox");
		var domain = FindDomain(LiveJournal.posturl);
		for (var i =0; i < birthdays.length; i++) {
			var hbox = document.createElement("hbox");
			hbox.setAttribute("align","center");
			var img = document.createElement("image");
			img.setAttribute("class","bdayicon");
			var bnode = document.createElement("label");
			bnode.setAttribute("value",birthdays[i].user);
			bnode.setAttribute("class","plain bdayuser");
			bnode.setAttribute("onclick", "OpenURLInBrowser(\"" + domain + "users/" + birthdays[i].user + "\");");
			var text = " " + ljpostingbundle.getString("IsHavingABirthday");
			var tnode = document.createElement("label");
			tnode.setAttribute("class","plain");
			tnode.setAttribute("value",text);
			hbox.appendChild(img);
			hbox.appendChild(bnode);
			hbox.appendChild(tnode);
			birthdaybox.appendChild(hbox);
		}
		birthdaybox.collapsed = false;
		dsPosts.birthdayfade = setInterval("BirthdayFade();",100);
	}
	
	var savesecs = dsPrefs.getIntPref("SaveDraftEvery") * 1000;
	if (!isSidebar) {
		dsDraft.loadDraft();
		setInterval("dsDraft.saveDraft();", savesecs);
	}
	dsMidas.lookForBloggedPage();
	// Have to do this so backspace works if there's a previous post + it doesn't always force CSS.
	var midas = document.getElementById("message");
	midas.contentDocument.designMode = "On";
	midas.contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
}
function BirthdayFade() {
	var bbox = document.getElementById("birthdaybox");
	var opacity = parseFloat(bbox.style.opacity);
	bbox.style.opacity = opacity + 0.05;
	if (bbox.style.opacity >= 1) {
		clearInterval(dsPosts.birthdayfade);
	}
}

function boxesLoseFocus() {
	// Sets up the pretty little helper boxes.
	dsPosts.fieldLoseFocus(document.getElementById("taglist"), ljpostingbundle.getString("Tags"));
	dsPosts.fieldLoseFocus(document.getElementById("music"), ljpostingbundle.getString("CurrentMusic"));
	dsPosts.fieldLoseFocus(document.getElementById("location"), ljpostingbundle.getString("CurrentLocation"));
}
function boxesGetFocus() {
	dsPosts.fieldGotFocus(document.getElementById("taglist"));
	dsPosts.fieldGotFocus(document.getElementById("music"));
	dsPosts.fieldGotFocus(document.getElementById("location"));
}

dsPosts.makeMenus = function(menu, menuarray) {
	var popup = menu.appendChild(document.createElement("menupopup"));
	for (var z = 0; z < menuarray.length; z++) {
		if (menuarray[z].menutext != "-") {
			if (!menuarray[z].submenu) {
				var curitem = popup.appendChild(document.createElement("menuitem"));
				curitem.setAttribute("label", menuarray[z].menutext);
				curitem.setAttribute("oncommand", "OpenURLInBrowser('" + menuarray[z].url + "')");
			} else {
				var curitem = popup.appendChild(document.createElement("menu"));
				curitem.setAttribute("label", menuarray[z].menutext);
				
				dsPosts.makeMenus(curitem, menuarray[z].submenu);
			}
		} else {
			popup.appendChild(document.createElement("menuseparator"));
		}
		
	}
}

dsPosts.fieldLoseFocus = function(obj, defaulttext) {
	if (obj.value.trim().length < 1) {
		obj.setAttribute("empty", true);
		obj.value = defaulttext;
	}
}
dsPosts.fieldGotFocus = function (obj) {
	if (obj.getAttribute("empty")) {
		obj.value = null;
		obj.removeAttribute("empty");
	}
}
dsPosts.changeJournal = function(obj) {
	// Sets the ljPost object's usejournal to the currently selected journal.
	// In: The usejournal menu node.
	// Out: Nothing.
	ljPost.usejournal = obj.label;
	delete LiveJournal.tags;
}
dsPosts.changePicture = function(obj) {
	// Changes the selected pic keyword (and the picture shown in the userpic box).
	// In: The picture menu object.
	// Out: Nothing.
	ljPost.pickw = obj.label;
	document.getElementById("userpic").src = obj.value;	
}
dsPosts.changeSecurity = function(selindex, skipdialog) {
	// Sets the current security, and opens a dialog to choose the filters if skipdialog is false and 'custom'
	//	is selected.
	// In: A number. Taken from the security node. 0 = public, 1 = private, 2 = friends, 3 = custom.
	// Out: Nothing.
	ljPost.security = selindex;
	switch (selindex) {
		case 2:
			ljPost.allowmask = 1;
			break;
		case 3:
			if (!skipdialog) {
				window.openDialog("security.xul","security","chrome,modal",ljPost,LiveJournal);
				if (ljPost.allowmask < 2) {
					document.getElementById("security").selectedIndex = 1;
					ljPost.security = 1;
				}
			}
			break;
	}
}
dsPosts.visitJournal = function(mouse) {
	// Opens the currently selected journal in the most recent browser window (or in a new tab if middle-clicked).
	// I should probably put all the WM code in one function somewhere; it's been used quite a few times throughout DS.
	// In: Event (mouseclick).
	// Out: Nothing.
	var domain = FindDomain(LiveJournal.posturl);
	var ljpage = domain + "users/" + ljPost.usejournal;
	switch (mouse.which) {
		case 2:
			var browserWindow = GetWindowByType("navigator:browser");
			if (browserWindow) {
				browserWindow.delayedOpenTab(ljpage);
				break;
			}
		case 1:
			OpenURLInBrowser(ljpage);
			break;
	}
			
}

dsPosts.viewTags = function() {
	var tagbox = document.getElementById("taglist");
	var passon = "";
	if (!tagbox.getAttribute("empty")) {
		passon = tagbox.value;
	}
	window.openDialog("tags.xul","tags","chrome,modal,resizable",ljPost,LiveJournal,passon);
	if (LiveJournal.tagsokclicked) {
		delete LiveJournal.tagsokclicked;
		dsPosts.fieldGotFocus(tagbox);
		tagbox.value = LiveJournal.posttags;
		dsPosts.fieldLoseFocus(tagbox, ljpostingbundle.getString('Tags'));
		delete LiveJournal.posttags;
	}
}

dsPosts.viewUserPics = function() {
	var windowwatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
	var picwindow = windowwatcher.getWindowByName("userpics" + window.name, null);
	if (picwindow) {
		picwindow.focus();
	} else {
		window.openDialog("userpics.xul","userpics" + window.name,"chrome,dependent,resizable",LiveJournal,window);
	}
}

dsPosts.resetPostParameters = function() {
	// Resets all the post values to their defaults, and clears out the subject/message boxes. Use when loading, and
	//	upon completion of a successful post.
	// In: Nothing.
	// Out: Nothing.
	dsMidas.setUpMidas();
	document.getElementById("subject").value = null;
	document.getElementById("security").selectedIndex = parseInt(LiveJournal.defaultsecurity, 10);
	ljPost.allowmask = LiveJournal.defaultgroups;
	this.changeSecurity(document.getElementById("security").selectedIndex, true);
	ljPost.backdate = LiveJournal.defaultbackdate;
	ljPost.removecomments = LiveJournal.defaultremovecomments;
	ljPost.dontautoformat = LiveJournal.defaultdontautoformat;
	delete ljPost.postDate;
	LiveJournal.posttags = null;
	dsMidas.dontautoformat = LiveJournal.defaultdontautoformat;
	document.getElementById("picture").selectedIndex = 0;
	document.getElementById("userpic").src = LiveJournal.defaultpicurl;
	document.getElementById("moods").selectedIndex = 0;
	document.getElementById("moodtext").value = null;
	document.getElementById("music").value = null;
	document.getElementById("taglist").value = null;
	document.getElementById("location").value = null;
	boxesLoseFocus();
}
dsPosts.sendPost = function() {
	// Disables everything (well, not everything - menus still work and userpic is still clickable) and starts posting.
	//	Oh, and if this function is called again before the other has completed, it cancels everything.
	// In: Nothing.
	// Out: Nothing.
	if (this.posting) {
		this.posting = false;
		ljPost.httpreq.request.abort();
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("postbutton").label = commonbundle.getString("Post");
	} else {
		if (dsPrefs.getBoolPref("SpellCheckOnPost")) {
			// goDoCommand won't work for some reason.
			eval(document.getElementById("cmd_spell").getAttribute("oncommand"));
		}
		var musicbox = document.getElementById("music");
		if ((dsPrefs.getBoolPref("AutoDetectMusic")) && (musicbox.getAttribute("empty"))) {
			var detectedmusic = FindMusic();
			if (detectedmusic.length > 0) {
				dsPosts.fieldGotFocus(musicbox);
				musicbox.value = detectedmusic;
				dsPosts.fieldLoseFocus(musicbox, ljpostingbundle.getString("CurrentMusic"));
			}
		}
		document.getElementById("postbutton").label = commonbundle.getString("Cancel");
		document.getElementById("maindisabler").setAttribute("disabled", true);
		document.getElementById("statuslabel").value = commonbundle.getString("Posting");
		document.getElementById("progressbar").mode = "undetermined";
		document.getElementById("messagedeck").selectedIndex = 1;
		this.posting = true;
		ljPost.postToServer();
	}
}
function OpenHistoryWindow() {
	// Opens the post history window, if it isn't already opened. Otherwise it just gives it focus.
	// In: Nothing.
	// Out: Nothing.
	var history = GetWindowByType("deepestsender:history"); 
	if (history) {
		history.focus();
	} else {
		window.openDialog("history.xul","dshistory","chrome,dependent,resizable", LiveJournal, ljPost);
	}
}
function EditLastEntry() {
	// Opens the edit window, with the most recent entry open.
	// In: Nothing.
	// Out: Nothing.
	var windowwatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
	var editwindow = windowwatcher.getWindowByName("dslastentry", null);
	if (editwindow) {
		editwindow.focus();
	} else {
		window.openDialog("livejournal.xul","dslastentry","chrome,resizable,titlebar,dialog=no", LiveJournal, -1, ljPost.usejournal);
	}
}
function OpenPostOptions() {
	// Opens the post options window. If dsAccounts doesn't exist, it doesn't pass it on (defaults can't be saved).
	// In: Nothing.
	// Out: Nothing.
	if (typeof(dsAccounts) != "undefined") {
		window.openDialog("postoptions.xul","dspostoptions","chrome,modal",LiveJournal,dsPosts,window,dsPrefs,ljPost,dsAccounts);
	} else {
		window.openDialog("postoptions.xul","dspostoptions","chrome,modal",LiveJournal,dsPosts,window,dsPrefs,ljPost);
	}
}

function EditFriends() {
	window.openDialog("friends.xul","dseditfriends","chrome,modal,resizable", LiveJournal, dsAccounts);
}

function WindowClosing() {
	if ((parent.accountwindow) && (!isSidebar)) {
		dsDraft.saveDraft();
	}
}
