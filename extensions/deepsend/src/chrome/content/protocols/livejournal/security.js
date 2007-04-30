ljPost = window.arguments[0];
LiveJournal = window.arguments[1];

function Init() {
	// Main init function, runs when the window is opened. Reads the mask.
	// In: Nothing.
	// Out: Nothing.
	var groupbox = document.getElementById("allowmask");
	for (i = 0; i < LiveJournal.friendgroups.length; i++) {
		groupbox.appendItem(LiveJournal.friendgroups[i].name, LiveJournal.friendgroups[i].id);
		groupbox.lastChild.setAttribute("type", "checkbox");
		var ischecked = BreakMask(ljPost.allowmask, parseInt(LiveJournal.friendgroups[i].id), 10);
		groupbox.lastChild.setAttribute("checked", ischecked);
	}
	if (LiveJournal.friendgroups.length < 1) {
		document.getElementById("friendsbox").selectedIndex = 1;
	}	
}

function OkClicked() {
	// Runs when OK is clicked. Sets the mask to use.
	// In: Nothing.
	// Out: Nothing.
	ljPost.allowmask = 0;
	var groupbox = document.getElementById("allowmask");
	for (i = 0; i < groupbox.childNodes.length; i++) {
		if (groupbox.childNodes[i].checked) {
			ljPost.allowmask = MakeMask(ljPost.allowmask, parseInt(groupbox.childNodes[i].value, 10));
		}
	}
}
