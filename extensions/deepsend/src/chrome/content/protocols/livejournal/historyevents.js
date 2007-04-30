ljEvents = new Object();
var commonbundle = document.getElementById("commonbundle");

ljEvents.getEvents = function() {
	// Gets sends requst to get events from server.
	// In: Challenge string.
	// Out: Nothing.
	if (this.httpreq) this.httpreq.request.abort();
	this.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
	this.httpreq.onload = this.eventsHandler;
	var params = new Object();
	
	params.user = LiveJournal.username.toLowerCase();

	
	if (LiveJournal.username != ljPost.usejournal) {
		params.usejournal = ljPost.usejournal;
	}

	params.truncate = 40;
	params.prefersubject = true;
	params.noprops = true;
	params.selecttype = "day";
	params.year = dsCalendar.year;
	params.month = dsCalendar.month + 1;
	params.day = dsCalendar.selectedday;
	params.lineendings = "space";

	var body = "mode=getevents";
	body += LiveJournal.makeParams(params);
	
	this.httpreq.send(body);
}

ljEvents.eventsHandler = function() {
	// This gets hit as the response from the server when asked for a challenge. The code should be pretty self-explanatory.
	var result = LiveJournal.responseArray(ljEvents.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		var eventlist = document.getElementById("entrieslist");
		while (eventlist.childNodes.length > 2) {
			eventlist.removeChild(eventlist.lastChild);
		}
		for (i = 1; i <= parseInt(LiveJournal.getResponseData("events_count", result), 10); i++) {
			var eventtime = LiveJournal.getResponseData("events_" + i + "_eventtime", result);
			var event = LiveJournal.getResponseData("events_" + i + "_event", result, true);
			var eventid = LiveJournal.getResponseData("events_" + i + "_itemid", result);
			eventid += "|";
			eventid += LiveJournal.getResponseData("events_" + i + "_anum", result);
			eventlist.appendChild(document.createElement("listitem"));
			eventlist.lastChild.setAttribute("value", eventid);
			eventlist.lastChild.setAttribute("ondblclick", "EditPost(this);");
			eventlist.lastChild.setAttribute("label", FixClock(eventtime));
			eventlist.lastChild.appendChild(document.createElement("listcell"));
			eventlist.lastChild.lastChild.setAttribute("label", event);
		}
		document.getElementById("progressdeck").selectedIndex = 1;
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + ljEvents.httpreq.request.responseText);
		}
	}
}

