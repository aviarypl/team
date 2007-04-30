// Aloha, go bananas. This is the account wizard bit. Obviously.

dsAccounts = window.arguments[0];
accountdetails = new Object();

function EnableDisableSavedPassword(obj) {
	// Enables or disables the password textbox, this function is used by the checkbox under it.
	// In: A boolean value, if it's true, the password box is enabled, if false, then disabled.
	// Out: Nothing.
	document.getElementById("password").disabled = !obj;
}

function AddNewAccount() {
	// Adds a new account, for when the "finish" button is checked.
	// In: Nothing.
	// Out: A boolean value. If it's false, then the account wizard won't close.
	accountdetails = new Object();
	accountdetails.accountname = document.getElementById("accountname").value;
	accountdetails.posturl = document.getElementById("posturl").value;
	accountdetails.username = document.getElementById("username").value;
	accountdetails.accounttype = document.getElementById("accounttype").value;
	var password = document.getElementById("password").value;
	var savepassword = document.getElementById("savepassword").checked;
	var makedefault = document.getElementById("makedefault").checked;
	var dsdoc = dsAccounts.dsXML;
	var newfrag = dsdoc.createDocumentFragment();
	var account  = newfrag.appendChild(dsdoc.createElement("account"));
	for (z in accountdetails) {
		account.appendChild(dsdoc.createElement(z));
		account.lastChild.appendChild(dsdoc.createTextNode(accountdetails[z]));
	}
	account.appendChild(dsdoc.createElement("savepassword"));
	account.lastChild.setAttribute("saved", savepassword);
	account.lastChild.setAttribute("autologin", false);
	if (savepassword) {
		dsPasswords.savePassword(accountdetails.posturl, accountdetails.username, password);
	}
	ExtraTags(dsdoc, account, accountdetails.accounttype);
	dsAccounts.accounts.appendChild(account);
	if (makedefault) {
		var setdef = dsAccounts.accounts.childNodes.length - 1;
		GetTag(dsdoc, "accounts").setAttribute("defaultaccount", setdef);
	}
	dsAccounts.setUpBox();
	dsAccounts.saveSettings();
	return true;
}

function SetDefaultURL() {
	var accounttype = document.getElementById("accounttype");
	var posturl = document.getElementById("posturl");
	switch (accounttype.selectedIndex) {
		case 0:
			posturl.value = "http://www.blox.pl/xmlrpc";
			break;
		case 1:
			posturl.value = "http://www.livejournal.com/interface/flat";
			break;
		case 2:
			posturl.value = "http://omgzblognamegoeshere.blogspot.com";
			break;
		case 3:
			posturl.value = "http://yoursite/xmlrpc.php";
			break;
		case 4:
			posturl.value = "https://storage.msn.com/storageservice/MetaWeblog.rpc";
			break;
		case 5:
			posturl.value = "http://yoursite/xmlrpc.php";
			break;
	}
	return true;
}

function ValidateFields(page) {
	// This checks that no text fields have been left empty on the current wizard page, before allowing the user to
	//	continue. Password fields are ignored. If a field is found to be empty, after a message is displayed,
	//	the first field on the page will be focussed. Or focused? I can't remember.
	// In: The <wizardpage> object. As in the root element.
	// Out: True if all fields have been validated, false if one is found to be empty (and the first field found will
	//	be focus...... oh bugger it. Note that false will also stop the wizard from advancing to the next page.
	var pagenum = page.pageStep - 1;
	if (pagenum < 0) {
		pagenum = 0;
	}
	var accwizbundle = document.getElementById("accwizbundle");
	var textboxes = page.getElementsByTagName("wizardpage")[pagenum].getElementsByTagName("textbox"); 
	for (z = 0; z < textboxes.length; z++) {
		if ((textboxes[z].getAttribute("type") != "password") && (textboxes[z].value.trim().length < 1)) {
			alert(accwizbundle.getString("FillInAllFields"));
			textboxes[z].focus();
			return false;
		}
	}
	return true;
}

function ExtraTags(obj, acc, acctype) {
	// This is if any additional tags need to be set up for the selected account.
	// In: The XML to write to, the account node, and the type of account.
	// Out: Nothing.
	switch (acctype) {
		case "LiveJournal" :
			var acctype = GetTag(acc, "accounttype");	
			acctype.setAttribute("usetags", true);
			acctype.setAttribute("challenge", true);
			acc.appendChild(obj.createElement("moods"));
			acc.lastChild.setAttribute("highestmood", "0");
			acc.appendChild(obj.createElement("friends"));
			acc.appendChild(obj.createElement("defaults"));
			acc.lastChild.appendChild(obj.createElement("security"));
			acc.lastChild.lastChild.setAttribute("level", "0");
			acc.lastChild.lastChild.setAttribute("groups", "0");
			acc.lastChild.appendChild(obj.createElement("options"));
			break;
		case "MSN":
		case "metaWeblog":
		case "WordPress":
			var acctype = GetTag(acc, "accounttype");
			acctype.setAttribute("categories", true);
		case "blogger":
			var acctype = GetTag(acc, "accounttype");
			acctype.setAttribute("autoformat", true);
			break;
	}
}

