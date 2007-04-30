LiveJournal = window.arguments[0];
ljConsole = {};
const commonbundle = document.getElementById("commonbundle");
const consolebundle = document.getElementById("consolebundle");

function ToggleHelp() {
	document.getElementById("helpframe").collapsed = !document.getElementById("helpframe").collapsed;
}

function ToggleOtherUser(checkbox) {
	var pwdisabler = document.getElementById("pwdisabler");
	if (!checkbox.checked) {
		pwdisabler.setAttribute("disabled",true);
	} else {
		pwdisabler.removeAttribute("disabled");
	}
}

function Init() {
	document.getElementById("helpframe").setAttribute("src","http://www.livejournal.com/admin/console/reference.bml");
	var responsebox = document.getElementById("response").contentDocument;
	responsebox.body.appendChild(responsebox.createElement("div"));
	responsebox.body.lastChild.setAttribute("class","consoleresponse");
	document.getElementById("consolecommand").focus();
}

function ExecuteCommand(consolebox) {
	if ((consolebox.value.trim().length > 0) && (!document.getElementById("execute").getAttribute("disabled"))) {
		document.getElementById("execute").setAttribute("disabled",true);
		document.getElementById("progress").mode = "undetermined";
		var params = new Object();
		if (!document.getElementById("pwdisabler").getAttribute("disabled")) {
			ljConsole.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl,null,document.getElementById("password").value.toLowerCase());
			params.user = document.getElementById("username").value;
		} else {
			ljConsole.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
			params.user = LiveJournal.username.toLowerCase();
		}
		ljConsole.httpreq.onload = ServerResponse;
		params.command = consolebox.value;
		WriteToConsole(consolebundle.getString("Command") + "<br>" + consolebox.value + "<br><br>");
		consolebox.value = "";
		
		var body = "mode=consolecommand";
		body += LiveJournal.makeParams(params);
		ljConsole.httpreq.send(body);
	}
}

function InsertLineBreaks(text) {
	return text.replace(/(\r)?\n/gi, "<br>");
}

function WriteToConsole(text,type) {
	var responsebox = document.getElementById("response");
	var responsecontent = responsebox.contentDocument.body;
	responsecontent.lastChild.innerHTML += InsertLineBreaks(text);
	responsebox.contentWindow.scrollTo(0, responsecontent.scrollHeight); 
}

function ServerResponse() {
	var result = LiveJournal.responseArray(ljConsole.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		for (var i = 1; i <= LiveJournal.getResponseData("cmd_line_count",result); i++) {
			var blurb = LiveJournal.getResponseData("cmd_line_" + i, result);
			switch (LiveJournal.getResponseData("cmd_line_" + i + "_type", result)) {
				case "error":
					blurb = "<span class=\"console_error\">" + blurb + "</span>";
					break;
				case "info":
					blurb = "<span class=\"console_info\">" + blurb + "</span>";
					break;
			}
			WriteToConsole(blurb + "<br>");
		}
		WriteToConsole("<hr>");
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			WriteToConsole(commonbundle.getString("ErrorRequest") + " " + errmsg + "<hr>");
		} else {
			WriteToConsole(commonbundle.getString("ErrorRequest") + " " + ljConsole.httpreq.request.responseText + "<hr>");
		} 
		
	}
	document.getElementById("execute").removeAttribute("disabled");
	document.getElementById("progress").mode = "determined";
}
