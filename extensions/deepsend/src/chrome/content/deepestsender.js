// These are the functions for the main DS window (the one that you login on).
// If you're wondering what the setTimeout("somefunction();",1) things are for, it's because it gets around problems on OS X.


dsAccounts = new Object();
var isSidebar = window._content;
var accountwindow = true;
var status;
const dsbundle = document.getElementById("dsbundle");
var commonbundle = document.getElementById("commonbundle");
var dsPrefs = new PrefsWrapper1("extensions.deepestSender.");

dsAccounts.dsFile = function() {
	// This finds the location of the deepestsender.xml file, which stores most of DS's settings and account details.
	// In: Nothing.
	// Out: A directory service object that points to the location of deepestsender.xml.
	var DS = new Components.Constructor( "@mozilla.org/file/directory_service;1", "nsIProperties" );
	var myDirS = new DS( );
	var f = myDirS.get( "ProfD", Components.interfaces.nsIFile );
	//f.append("extensions");
	//f.append("{B9DAB69C-460E-4085-AE6C-F95B0D858581}");
	f.append("deepestsender.xml");
	return f;
}

dsAccounts.setUpBox = function() {
	// This sets up the accounts menu, for choosing what account to use.
	// In: Nothing.
	// Out: Nothing.
	var accbox = document.getElementById("accounts");
	var accs = this.accounts.getElementsByTagName("account");
	var oldlength = accbox.firstChild.childNodes.length;
	for (i = 0; i < oldlength - 1; i++) {
		accbox.removeItemAt(0);
	}
	//var defaultacc = evaluateXPath(this.dsXML, "//accounts/account/savepassword[@isdefault=\"true\"]");

	for (i = accs.length -1; i >= 0; i--) {
		var curracc = accs[i];
		var newitem = accbox.insertItemAt(0, GetTag(curracc, "accountname").textContent, i);
		var icon = undefined;
		switch (GetTag(curracc, "accounttype").textContent) {
			case "LiveJournal":
				icon = "ljicon";
				break;
			case "blogger":
				icon = "bloggericon";
				break;
			case "WordPress":
				icon = "wordpressicon";
				break;
			case "MSN":
				icon = "msnspaces";
				break;
			default:
				break;
		}
		newitem.setAttribute("class", "menuitem-iconic icons");
		if (icon) {
			newitem.setAttribute("src", "chrome://deepestsender/skin/images/" + icon + ".png");
		}
	}
	var defacc = GetTag(this.dsXML, "accounts").getAttribute("defaultaccount");
	dsAccounts.defaultaccount = defacc;
	accbox.selectedIndex = defacc;
	ChangedAccount(accbox);
}

dsAccounts.saveSettings = function() {
	// This writes the accounts/settings XML (dsAccounts.dsXML) to disk.
	// In: Nothing.
	// Out: Nothing, although you'll have a freshly saved deepestsender.xml. I should really create some return values.
	var serializer = new XMLSerializer();
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	var file = this.dsFile();
	// foStream, foShizzle
	foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);   // write, create, truncate
	serializer.serializeToStream(this.dsXML, foStream, "utf-8");
	foStream.close();
}

function Init() {
	// This runs when deepestsender.xul is loaded. Sets everything up.
	// In: Nothing.
	// Out: Nothing.
	if (dsPrefs.getBoolPref("FirstRun")) {
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
		if (appInfo.ID == "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}") {
			window.openDialog("locale.xul", "dslocales", "chrome,modal");
			dsPrefs.setBoolPref("FirstRun", false);
			window.close();
		}
	}
	if (isSidebar) {
		document.getElementById("logingroup").orient = "vertical";
	}
	//document.getElementById("loginkey").setAttribute("keycode", "VK_RETURN");
	status = document.getElementById("status");
	var settingspath = dsAccounts.dsFile().path;
	var settingsfile = FileIO.open(settingspath);
	if (settingsfile.exists()) {
		var filecontents = FileIO.read(settingsfile, "utf-8");
		var domParser = new DOMParser();
		dsAccounts.dsXML = domParser.parseFromString(filecontents, "text/xml");
	} else {
		dsAccounts.dsXML = document.implementation.createDocument("", "deepestsender", null);
		dsAccounts.dsXML.insertBefore(dsAccounts.dsXML.createProcessingInstruction("xml", "version=\"1.0\" encoding=\"utf-8\""), dsAccounts.dsXML.documentElement);
		var roottag = GetTag(dsAccounts.dsXML, "deepestsender"); 
		roottag.setAttribute("version", 6);
		var accounts = dsAccounts.dsXML.documentElement.appendChild(dsAccounts.dsXML.createElement("accounts"));
		accounts.setAttribute("defaultaccount", 0);
	}
	RemoveWhiteSpace(dsAccounts.dsXML.documentElement);
	if (GetTag(dsAccounts.dsXML, "deepestsender").getAttribute("version") != 6) {
		alert(dsbundle.getString("NewAccountFile"));
		settingsfile.remove(false);
		Init();
		return;
	}
	dsAccounts.accounts = GetTag(dsAccounts.dsXML, "accounts");
	setTimeout("dsAccounts.setUpBox();", 1);
}

function ChangedAccount(node) {
	// Runs every time a different account is selected on the menu. Updates everything.
	// In: Integer value of which account node in the XML to use (when the menu is set up, the values of the menu items are
	// 	set to the number of node that corresponds to the account name.
	// Out: Nothing, although variables inside the dsAccounts object will be changed, and the window updated.
	if ((!isNaN(node.value)) && (node.value != "")) {
		ToggleEnabledStuff(false);
		// Goddamn this stupid thing. I was ready to smash the screen then.
		document.getElementById("deletebutton").disabled = false;
		dsAccounts.currentaccount = dsAccounts.accounts.childNodes[node.value];
		dsAccounts.username = GetTag(dsAccounts.currentaccount, "username").textContent;
		document.getElementById("username").value = dsAccounts.username
		dsAccounts.posturl = GetTag(dsAccounts.currentaccount, "posturl").textContent;
		dsAccounts.accounttype = GetTag(dsAccounts.currentaccount, "accounttype").textContent;
		dsAccounts.currentnode = node.value;
		dsAccounts.savepassword = GetTag(dsAccounts.currentaccount, "savepassword").getAttribute("saved");
		dsAccounts.autologin = GetTag(dsAccounts.currentaccount, "savepassword").getAttribute("autologin");
		if (dsAccounts.savepassword == "true") {
			dsAccounts.password = dsPasswords.getPassword(dsAccounts.posturl, dsAccounts.username);
		} else {
			dsAccounts.password = "";
		}
		document.getElementById("password").value = dsAccounts.password;
		document.getElementById("rememberpassword").setAttribute("checked", dsAccounts.savepassword);
		ToggleAutoLogin(dsAccounts.savepassword);
		document.getElementById("autologin").setAttribute("checked", dsAccounts.autologin);
		if(dsAccounts.autologin == "true") {
			Login();
		}
	} else {
		ToggleEnabledStuff(true);
		window.openDialog("accwiz.xul", "newaccountwizard", "chrome,modal",dsAccounts);
	}
}

function ToggleAutoLogin(off) {
	// Enables or disables the "automatically log in" part, based on whether or not the save password option is enabled.
	// In: Boolean value. True to enable it, false to disable it.
	// Out: Nothing.
	var autologin = document.getElementById("autologin"); 
	autologin.disabled = !off;
}

function DeleteAccount(nodenum) {
	// Deletes an account and any associated password.
	// In: A number representing the position of the account in the deepestsender.xml file. Can get it from the accounts box value.
	// Out: Nothing.
	var sure = confirm(commonbundle.getString("SureToDelete"));
	if (sure) {
		dsAccounts.accounts.removeChild(dsAccounts.accounts.childNodes[nodenum]);
		var defaccnum = dsAccounts.accounts.getAttribute("defaultaccount");
		dsPasswords.deletePassword(dsAccounts.posturl, dsAccounts.username);
		if (defaccnum == nodenum) {
			dsAccounts.accounts.setAttribute("defaultaccount", 0);
		} else if (defaccnum > nodenum) {
			dsAccounts.accounts.setAttribute("defaultaccount", defaccnum - 1);
		}
		dsAccounts.saveSettings();
		dsAccounts.setUpBox();
	}
}

function ToggleEnabledStuff(off) {
	// Enabled or disables everything. Mainly just for if New Account is selected, so some idiot doesn't try to log in under it.
	// In: True or false. True to disable, false to enable. Nice and backwards.
	// Out: Nothing.
	document.getElementById("username").disabled = off;
	document.getElementById("password").disabled = off;
	document.getElementById("rememberpassword").disabled = off;
	document.getElementById("autologin").disabled = off;
	document.getElementById("offline").disabled = off;
	document.getElementById("loginbutton").disabled = off;
	document.getElementById("deletebutton").disabled = off;
	document.getElementById("optionsbutton").disabled = off;
}

function Options() {
	// Pops up the options for the account.
	// In: Nothing.
	// Out: Nothing.
	window.openDialog("accoptions.xul", "accountoptions", "chrome,modal",dsAccounts);
}

function Login() {
	// This is the big one that sends control over to the code for the particular protocol. Last outpost. Make sure protocols.js is loaded, so it can pass
	//	everything on.
	// In: Nothing.
	// Out: Nothing. It's strange, I set out to code this really elegantly, but its turned into the same old hack job.
	if (!dsAccounts.loggingin) {
		ToggleEnabledStuff(true);
		document.getElementById("loginbutton").disabled = false;
		document.getElementById("loginbutton").label = commonbundle.getString("Cancel");
		document.getElementById("accounts").disabled = true;
		document.getElementById("loginprogress").mode = "undetermined";
		dsAccounts.username = document.getElementById("username").value;
		dsAccounts.password = document.getElementById("password").value;
		status.value = dsbundle.getString("LoggingIn");
		dsAccounts.loggingin = true;
		if (document.getElementById("offline").checked) {
			document.getElementById("dsPostFrame").setAttribute("src", "protocols/offline/offline.xul");
			FinaliseLogin(dsAccounts.accounttype);
		} else {
			eval(dsAccounts.accounttype + ".startLogin()");
		}
	} else {
		ToggleEnabledStuff(false)
		document.getElementById("accounts").disabled = false;
		document.getElementById("loginprogress").mode = "determined";
		dsAccounts.loggingin = false;
		document.getElementById("loginbutton").label = dsbundle.getString("Login");
		status.value = dsbundle.getString("LoginAborted");
	}
}

function FinaliseLogin() {
	// This is the final function that is called before passing control over to whatever has been loaded in the post frame.
	// In: Nothing.
	// Out: Nothing.
	GetTag(dsAccounts.currentaccount, "username").textContent = dsAccounts.username;
	if (document.getElementById("rememberpassword").checked) {
		dsPasswords.savePassword(dsAccounts.posturl, dsAccounts.username, dsAccounts.password);
		GetTag(dsAccounts.currentaccount, "savepassword").setAttribute("autologin", document.getElementById("autologin").checked);
	} else {
		dsPasswords.deletePassword(dsAccounts.posturl, dsAccounts.username);
	}
	GetTag(dsAccounts.currentaccount, "savepassword").setAttribute("saved", document.getElementById("rememberpassword").checked)
	dsAccounts.saveSettings();
	//document.getElementById("loginkey").removeAttribute("keycode");
	document.getElementById("mainwindow").selectedIndex = 1;
	Login();
	status.value = dsbundle.getString("PressF1");
}
