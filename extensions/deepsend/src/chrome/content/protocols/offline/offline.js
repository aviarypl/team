if (parent.accountwindow) {
	dsAccounts = parent.dsAccounts;
	var isSidebar = parent.isSidebar;
}
var dsPrefs = new PrefsWrapper1("extensions.deepestSender.");
dsPosts = new Object();
function Init() {
	switch (dsAccounts.accounttype) {
		case "LiveJournal":
		document.getElementById("ljbuttons").collapsed = false;
		break;
	}
	
	dsMidas.dontautoformat = false;
	dsPosts.resetPostParameters();
	
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
function WindowClosing() {
	if ((parent.accountwindow) && (!isSidebar)) {
		dsDraft.saveDraft();
	}
}
dsPosts.resetPostParameters = function() {
	dsMidas.setUpMidas();
	document.getElementById("subject").value = null;	
}
