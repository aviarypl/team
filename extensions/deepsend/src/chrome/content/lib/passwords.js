// Password saving/retreiving functions, cleaned up a shitload!

// Should probably write a thing to check if Password Manager is enabled before trying to save/load passwords.

dsPasswords = new Object();

dsPasswords.getPassword = function(url, username) {
	// Returns the password, when given a URL and username to look up.
	// In: URL of site to look up in Password Manager, username of site to look up.
	// Out: Either the password that was found, or a null value if there wasn't one/something blew up.
	var pmInternal = Components.classes["@mozilla.org/passwordmanager;1"].getService().QueryInterface(Components.interfaces.nsIPasswordManagerInternal);
	if (!pmInternal) {
		return null;
	}
	// If you don't do it like this (with objects and values), it causes a crash. *shrugs*
	var hostout = {value: ''};
	var userout = {value: ''};
	var passwordout = {value: ''};
	try {
		pmInternal.findPasswordEntry(url, username, null, hostout, userout, passwordout);
		return passwordout.value;
	} catch(e) {
		dump("findPasswordEntry() failed\n");
	}	
	return null;
}

dsPasswords.savePassword = function(url, username, password) {
	// Saves (or replaces) a password in the Password Manager.
	// In: URL to attach the user/password to, the username to use (you can have different usernames for the same URL,
	// 	and the password to save.
	// Out: True if everything went well, false if it didn't.
	if (!url || !username || !password) {
		return false;
	}
	var pm = Components.classes["@mozilla.org/passwordmanager;1"].getService().QueryInterface(Components.interfaces.nsIPasswordManager);
	if (!pm) {
		return false;
	}
	dsPasswords.deletePassword(url, username);	
	try {
		pm.addUser(url, username, password);
	} catch(e) {
		dump("addUser failed\n");
		return false;
	}
	return true;
}

dsPasswords.deletePassword = function(url, username) {
	// Deletes a password from the Password Manager. Should be called if 'Save Password' is disabled, or the account
	//	is deleted.
	// In: URL that the password is attached to, username the password is attached to.
	if (!url || !username) {
		return false;
	}
	var pm = Components.classes["@mozilla.org/passwordmanager;1"].getService().QueryInterface(Components.interfaces.nsIPasswordManager);
	if (!pm) {
		return false;
	}
	try {
		pm.removeUser(url, username);
	} catch(e) {
		dump("removeUser() failed\n");
		return false;
	}
	return true;
}

