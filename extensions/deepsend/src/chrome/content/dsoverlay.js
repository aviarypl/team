var DeepestSender = new Object();
DeepestSender.prefs = new PrefsWrapper1("extensions.deepestSender.");

DeepestSender.addToPost = [];

DeepestSender.runDeepestSender = function(buttonclicked) {
	if (buttonclicked) {
		if (this.prefs.getBoolPref("OpenInSidebar")) {
			toggleSidebar("viewDeepestSenderSidebar");
			return;
		}
	}
	toOpenWindowByType("deepestsender:login","chrome://deepestsender/content/");
}


// This bit is a bit 'ehhhh.' Had a more elegant method, but it didn't work when DS was in the sidebar. Oh well.
DeepestSender.sendToDeepestSender = function() {
	this.addToPost = [];
	var selected = window.content.document;
	this.addToPost.push(selected.location.href);
	this.addToPost.push(selected.title);
	this.addToPost.push(window.content.getSelection());
	var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	var dsWindow = wm.getMostRecentWindow("deepestsender:login");
	if ((dsWindow) && (dsWindow.document.getElementById("dsPostFrame").src != "lib/blank.xul")) {
		dsWindow.document.getElementById("dsPostFrame").contentWindow.dsMidas.lookForBloggedPage();
	} else {
		this.runDeepestSender(true);
	}
}
