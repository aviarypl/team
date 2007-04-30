ljDates = new Object();
ljDelete = new Object();
LiveJournal = window.arguments[0];
ljPost = window.arguments[1];

const historybundle = document.getElementById("historybundle");
var commonbundle = document.getElementById("commonbundle");

function Init() {
	// Initial function, sets up calendar.
	// In: Nothing.
	// Out: Nothing.
	document.getElementById("progressbar").mode = "undetermined";	
	dsCalendar.extraSetSelected = function(day, month, year) {
		var eventlist = document.getElementById("entrieslist");
		while (eventlist.childNodes.length > 2) {
			eventlist.removeChild(eventlist.lastChild);
		}
		eventlist.appendChild(document.createElement("listitem"));
		eventlist.lastChild.setAttribute("label", commonbundle.getString("Loading"));
		document.getElementById("progressdeck").selectedIndex = 0;
		ljEvents.getEvents();
	}
	
	dsCalendar.extraChangeYear = function(curobj) {
		curobj.setAttribute("oncommand", curobj.getAttribute("oncommand") + " ljDates.makeBoldDays(dsCalendar.year, parseInt(dsCalendar.month + 1, 10), ljDates.dates);");
	}
	
	var cal = new Date();
	dsCalendar.init(cal);
	dsCalendar.setSelected(document.getElementById("day" + dsCalendar.selectedday));
	var mpop = document.getElementById("monthspopup");
	for (i = 0; i < mpop.childNodes.length; i++) {
		mpop.childNodes[i].setAttribute("oncommand", mpop.childNodes[i].getAttribute("oncommand") + " ljDates.makeBoldDays(dsCalendar.year, parseInt(dsCalendar.month + 1, 10), ljDates.dates);");
	}
	var monthless = document.getElementById("monthless");
	var monthmore = document.getElementById("monthmore");
	monthless.setAttribute("oncommand", monthless.getAttribute("oncommand") + " ljDates.makeBoldDays(dsCalendar.year, parseInt(dsCalendar.month + 1, 10), ljDates.dates);");
	monthmore.setAttribute("oncommand", monthmore.getAttribute("oncommand") + " ljDates.makeBoldDays(dsCalendar.year, parseInt(dsCalendar.month + 1, 10), ljDates.dates);");
	//ljDates.getDates();

	// Sends a call to the server to get a list of the days that have posts on them.
	// In: The challenge issued by the server.
	// Out: Nothing.
	ljDates.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
	ljDates.httpreq.onload = ljDates.datesHandler;
	var params = new Object();

	params.user = LiveJournal.username.toLowerCase();

	
	if (LiveJournal.username != ljPost.usejournal) {
		params.usejournal = ljPost.usejournal;
	}
	
	var body = "mode=getdaycounts";
	body += LiveJournal.makeParams(params);

	ljDates.httpreq.send(body);
}

ljDates.datesHandler = function() {
	// This gets hit as the response from the server when asked for a challenge. The code should be pretty self-explanatory.
	var result = LiveJournal.responseArray(ljDates.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		ljDates.dates = result;
		var now = new Date();
		ljDates.makeBoldDays(now.getFullYear(), now.getMonth() + 1, ljDates.dates);
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + ljDates.httpreq.request.responseText);
		}
	}
}

ljDates.makeBoldDays = function(year, month) {
	// Makes the days with posts bolded.
	// In: The year to look up, the month to look up. Each day in the month is checked.
	// Out: Nothing.
	var days = document.getElementById("calendarbox").getElementsByTagName("toolbarbutton");
	for (i = 0; i < days.length; i++) {
		var dateid = days[i].getAttribute("id");
		var curday = dateid.match(/[^day]/gi).join("");
		var datestring = year + "-" + ZeroFix(month) + "-" + ZeroFix(curday);
		var postcount = parseInt(LiveJournal.getResponseData(datestring, this.dates), 10);
		if (postcount > 0) {
			days[i].setAttribute("style", "font-weight: bold");
			days[i].setAttribute("tooltiptext", historybundle.getString("PostsThisDay") + " " + postcount);
		}
	}
	window.sizeToContent();
}

function FixClock(time) {
	// This formats LiveJournal's crazy date format into something nice looking.
	// In: Crazily formatted LJ date string.
	// Out: 12-hour time string with "am" or "pm".
	var clockarray = time.split(":");
	var hour = clockarray[0];
	var minute = clockarray[1];
	var ampm = " am";
	hour = parseInt(hour.slice(hour.lastIndexOf(" ")),10);
	if (hour > 11) {
		ampm = " pm";
		hour = hour - 12;
	}
	if (hour == 0) {
		hour = 12;
	}
	return hour + ":" + minute + ampm;
}

function ViewPost(postnode) {
	// Opens the browser to the currently selected post in the history window.
	// In: The XUL node of the selected post.
	// Out: Nothing.
	if (postnode) {
		var domain = FindDomain(LiveJournal.posturl);
		var postsplit = postnode.value.split("|");
		var itemid = postsplit[0];
		var anum = postsplit[1];
		var username;
		if (LiveJournal.username != ljPost.usejournal) {
			username = ljPost.usejournal;
		} else {
			username = LiveJournal.username;
		}
		var urlstring = domain + "users/" + username + "/" + ((parseInt(itemid, 10) * 256) + parseInt(anum, 10)) + ".html";
		OpenURLInBrowser(urlstring);
	}
}


function EditPost(postnode) {
	// Loads an edit window for the selected post.
	// In: Node of the selected post.
	// Out: Nothing.
	if (postnode) {
		var itemid = parseInt(postnode.value.split("|")[0], 10);
		var windowid = "dsedit" + itemid;
		var windowwatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
		var editwindow = windowwatcher.getWindowByName(windowid, null);
		if (editwindow) {
			editwindow.focus();
		} else {
			window.openDialog("livejournal.xul",windowid,"chrome,resizable,titlebar,dialog=no", LiveJournal, itemid, ljPost.usejournal);
		}
	}
}

function DeletePost(postnode) {
	// Deletes the selected post.
	// In: Node of the selected post.
	// Nothing.
	if (postnode) {
		if (confirm(commonbundle.getString("SureToDelete"))) {
			document.getElementById("progressdeck").selectedIndex = 0;
			ljDelete.itemid = postnode.value.split("|")[0];
			ljDelete.deletePost();
		}
	}
}

ljDelete.deletePost = function() {
	// Sends request to delete post.
	// In: Challenge string issued from the server.
	// Out: Nothing.
	this.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
	this.httpreq.onload = this.deletionHandler;
	var params = new Object();
	
	params.user = LiveJournal.username.toLowerCase();

	
	if (LiveJournal.username != ljPost.usejournal) {
		params.usejournal = ljPost.usejournal;
	}

	params.subject = "";
	params.lineendings = "unix";
	params.event = "";
	params.year = 1;
	params.month = 1;
	params.day = 1;
	params.hour = 1;
	params.minute = 1;
	params.itemid = this.itemid;

	var body = "mode=editevent";
	body += LiveJournal.makeParams(params);
	
	this.httpreq.send(body);
}

ljDelete.deletionHandler = function() {
	// This gets hit as the response from the server when asked for a challenge. The code should be pretty self-explanatory.
	var result = LiveJournal.responseArray(ljDelete.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		document.getElementById("progressdeck").selectedIndex = 1;
		dsCalendar.setSelected();
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + ljDelete.httpreq.request.responseText);
		}
	}
}

