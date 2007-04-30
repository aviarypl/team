function ljUser() {
	// Inserts a LJ user tag.
	// In: Nothing.
	// Out: Nothing.
	var usertag = [];
	window.openDialog("chrome://deepestsender/content/protocols/livejournal/insertljuser.xul","insertljuser","chrome,modal",usertag,LiveJournal);
	if (usertag[0] != null) {
		var ljuser = "<span class=\"" + usertag[1].value + "\">" + usertag[0] + "</span>&nbsp;";
		document.getElementById("message").contentDocument.execCommand("insertHTML", false, ljuser);
	}
}

function ljCut() {
	// Inserts a LiveJournal cut.
	// In: Nothing.
	// Out: Nothing.
	
	var cut = prompt(document.getElementById("ljbundle").getString("EnterTextToCut"), "");
	if (typeof(cut) == "string") {
		var win = document.getElementById("message");
		var ljstart, ljend;
		ljend = "</lj-cut>";
		if (cut.length > 0) {
			ljstart = "<lj-cut text=\"" + cut + "\">";
		} else {
			ljstart = "<lj-cut>";
		}
		var selection = win.contentWindow.getSelection();
		var rangeCount = selection.rangeCount;
		if(rangeCount >= 0) {
			var rangeAt = selection.getRangeAt(0);
			var rangeTwo = document.createRange();
			rangeTwo.setStart(rangeAt.endContainer,rangeAt.endOffset);
			rangeTwo.insertNode(document.createTextNode(ljend));
			rangeAt.insertNode(document.createTextNode(ljstart));
		}
	}
}

