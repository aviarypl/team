// Just the account options (when you press "Options" on the login screen). This needs to be made more extendible. Or extendable? Hmm.

dsAccounts = window.arguments[0];

function Init() {
	// Initialises the dialog window. This page is really half arsed coding, but eh, it's small, and nothing outside of itself depends on it.
	// In: Nothing.
	// Out: Nothing.
	document.getElementById("posturl").value = dsAccounts.posturl;
	if (dsAccounts.defaultaccount == dsAccounts.currentnode) {
		document.getElementById("defaultaccount").checked = true;
		document.getElementById("defaultaccount").disabled = true;
	}
	var acctype = GetTag(dsAccounts.currentaccount, "accounttype");
	switch (dsAccounts.accounttype) {
		case "LiveJournal" :
			document.getElementById(dsAccounts.accounttype).collapsed = false;
			var usetags = acctype.getAttribute("usetags");
			var challenge = acctype.getAttribute("challenge");
			if (usetags) {
				document.getElementById("usetags").checked = true;
			}
			if (challenge) {
				document.getElementById("challenge").checked = true;
			}
			break;
		case "blogger":
			document.getElementById(dsAccounts.accounttype).collapsed = false;
			var dontautoformat = acctype.getAttribute("autoformat");
			if (dontautoformat) {
				document.getElementById("blogger_autoformat").checked = true;
			}
			break;
		case "metaWeblog":
		case "WordPress":
		case "MSN":
			document.getElementById("metaweblog").collapsed = false;
			var dontautoformat = acctype.getAttribute("autoformat");
			if (dontautoformat) {
				document.getElementById("metaweblog_autoformat").checked = true;
			}
			var categories = acctype.getAttribute("categories");
			if (categories) {
				document.getElementById("metaweblog_categories").checked = true;
			}
			break;
	}
}

function SaveOptions() {
	// Saves options. Duh.
	// In: Nothing.
	// Out: Nothing.
	dsAccounts.posturl = document.getElementById("posturl").value;
	var account = dsAccounts.accounts.getElementsByTagName("account");
	account[dsAccounts.currentnode].getElementsByTagName("posturl")[0].textContent = dsAccounts.posturl;
	if (document.getElementById("defaultaccount").checked) {
		dsAccounts.accounts.setAttribute("defaultaccount", dsAccounts.currentnode);
		dsAccounts.defaultaccount = dsAccounts.currentnode;
	}
	var acctype = GetTag(dsAccounts.currentaccount, "accounttype");
	switch (dsAccounts.accounttype) {
		case "LiveJournal" :
			if (document.getElementById("usetags").checked) {
				acctype.setAttribute("usetags", true);
			} else {
				acctype.removeAttribute("usetags");
			}
			if (document.getElementById("challenge").checked) {
				acctype.setAttribute("challenge", true);
			} else {
				acctype.removeAttribute("challenge");
			}
			break;
		case "blogger":
			if (document.getElementById("blogger_autoformat").checked) {
				acctype.setAttribute("autoformat", true);
			} else {
				acctype.removeAttribute("autoformat");
			}
			break;
		case "metaWeblog":
		case "WordPress":
		case "MSN":
			if (document.getElementById("metaweblog_autoformat").checked) {
				acctype.setAttribute("autoformat", true);
			} else {
				acctype.removeAttribute("autoformat");
			}
			if (document.getElementById("metaweblog_categories").checked) {
				acctype.setAttribute("categories", true);
			} else {
				acctype.removeAttribute("categories");
			}
			break;
	}
	dsAccounts.saveSettings();
}
