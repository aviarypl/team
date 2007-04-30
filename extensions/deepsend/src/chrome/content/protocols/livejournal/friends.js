var LiveJournal = window.arguments[0];
var dsAccounts = window.arguments[1];
ljFriends  = new Object();
const commonbundle = document.getElementById("commonbundle");
const friendsbundle = document.getElementById("friendsbundle");

function Init() {
	// Make a copy of the array - better than doing it directly on the LJ array otherwise you have to undo all changes made if the user hits cancel.
	ljFriends.friendgroups = LiveJournal.friendgroups.filter(function() {return true});
	makeGroupBoxes();
	
	ljFriends.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
	ljFriends.httpreq.onload = ljFriends.initialLoadHandler;

	var params = new Object();
	params.user = LiveJournal.username.toLowerCase();
	
	params.includefriendof = 1;
	params.includebdays = 1;
	var body = "mode=getfriends";
	body += LiveJournal.makeParams(params);
	ljFriends.httpreq.send(body);
}

ljFriends.initialLoadHandler = function() {
	document.getElementById("progressinfo").value = friendsbundle.getString("SortingData");
	var result = LiveJournal.responseArray(ljFriends.httpreq.request.responseText);
	ljFriends.loadResult = result;
	if (LiveJournal.getResponseData("success", result) == "OK") {
		ljFriends.friends = [];
		ljFriends.friendskey = [];
		ljFriends.deleteFriends = [];
		for (var i = 1; i <= parseInt(LiveJournal.getResponseData("friend_count", result), 10); i++) {
			ljFriends.friends[i-1] = new Object(); 
			var curfriend = ljFriends.friends[i-1];
			curfriend.user = LiveJournal.getResponseData("friend_" + i + "_user", result);
			ljFriends.friendskey.push(LiveJournal.getResponseData("friend_" + i + "_user", result));
			curfriend.name = LiveJournal.getResponseData("friend_" + i + "_name", result);
			curfriend.birthday = LiveJournal.getResponseData("friend_" + i + "_birthday", result);
			curfriend.background = LiveJournal.getResponseData("friend_" + i + "_bg", result);
			curfriend.foreground = LiveJournal.getResponseData("friend_" + i + "_fg", result);
			curfriend.groupmask = LiveJournal.getResponseData("friend_" + i + "_groupmask", result);
			curfriend.type = LiveJournal.getResponseData("friend_" + i + "_type", result);
			curfriend.status = LiveJournal.getResponseData("friend_" + i + "_status", result);
			addCSS(curfriend);
		}
		ljFriends.filteredfriends = ljFriends.friends;
		document.getElementById("friendstree").view = new friendsTree();
		document.getElementById("friendstree").view.selection.select(0);
		switch (document.getElementById("tabs").selectedIndex) {
			case 1:
				DoGroups();
				break;
			case 2:
				DoDrama();
				makeDrama();
				break;
		}
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("friendsprogress").style.visibility = "hidden";
		document.getElementById("progressinfo").style.visibility = "hidden";
	} else {
		var errmsg = LiveJournal.getResponseData("errmsg", result);
		if (errmsg) {
			alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
		} else {
			alert(commonbundle.getString("ErrorRequest") + " " + ljFriends.httpreq.request.responseText);
		}
		window.close();
	}
}

function DoFilter() {
	ljFriends.filteredfriends = FilterFriends(document.getElementById("friendsfilter").selectedIndex);
	document.getElementById("friendstree").view = new friendsTree();
}

function FilterFriends(friendtype) {
	var friendsarray = [];
	ljFriends.filteredkey = [];
	switch (friendtype) {
		case 0:
			return ljFriends.friends.filter(filterArrayBySearch);
			break;
		case 1:
			for (var i = 0; i < ljFriends.friends.length; i++) {
				if ((!ljFriends.friends[i].type) || (ljFriends.friends[i].type == "new")) {
					friendsarray.push(ljFriends.friends[i]);
				}
			}
			return friendsarray.filter(filterArrayBySearch);
			break;
		case 2:
			var lookfor = "community";
			break;
		case 3:
			var lookfor = "syndicated";
			break;	
		default:
			var curgroup = document.getElementById("friendsfilter").selectedItem;
			for (var i = 0; i < ljFriends.friends.length; i++) {
				var ingroup = BreakMask(ljFriends.friends[i].groupmask, curgroup.value);
				if (ingroup) friendsarray.push(ljFriends.friends[i]);
			}
			return friendsarray.filter(filterArrayBySearch); 
			break;
	}
	for (var i = 0; i < ljFriends.friends.length; i++) {	
		if ((ljFriends.friends[i].type == lookfor) || (ljFriends.friends[i].type == "new")) {
			friendsarray.push(ljFriends.friends[i]);
		}
	}
	return friendsarray.filter(filterArrayBySearch);
}

function filterArrayBySearch(auser) {
	var searchfriends = document.getElementById("search").value;
	// I'm not sure which of these two methods is faster.
	//var fsearch = new RegExp(searchfriends, "i");
	//if (fsearch.test(auser.user)) {
	if (auser.user.indexOf(searchfriends) >= 0) {
		ljFriends.filteredkey.push(auser.user);
		return true;
	}
}

function addCSS(curfriend) {
	var css = document.styleSheets[document.styleSheets.length -1];
	css.insertRule("treechildren::-moz-tree-row(style_" + curfriend.user + ") { background-color: " + curfriend.background + "; }", css.cssRules.length);
	var strike = "";
	if (curfriend.status) {
		strike = "text-decoration: line-through;";
	}
	css.insertRule("treechildren::-moz-tree-cell-text(style_" + curfriend.user + ") { color: " + curfriend.foreground + "; " + strike + " }", css.cssRules.length);
}

function friendsTree() {
  	this.rowCount = ljFriends.filteredfriends.length;
	this.getCellText = function(row,col) {
		if (col.id == "friendcol") return ljFriends.filteredfriends[row].user;
		return null;
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){
		if (col.id == "iconcol") {
			switch (ljFriends.filteredfriends[row].type) {
				case "community":
					return "chrome://deepestsender/skin/images/ljcomm.png";
					break;
				case "syndicated":
					return "chrome://deepestsender/skin/images/ljsyn.png";
					break;
				case "new":
					return null;
					break;
				default:
					return "chrome://deepestsender/skin/images/ljuser.png";
					break;
			}
		}
		return null;
	
	}
	this.getRowProperties = function(row, props) {
		var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
		var userstyle = "style_" + ljFriends.filteredfriends[row].user;
		props.AppendElement(aserv.getAtom(userstyle));

	}
	this.getCellProperties = function(row,col,props){
		var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
		var userstyle = "style_" + ljFriends.filteredfriends[row].user;
		props.AppendElement(aserv.getAtom(userstyle));	
	}
	this.getColumnProperties = function(colid,col,props) {}
}

function SortFriends(a, b){
	if(a.user < b.user) return -1;
	if(a.user > b.user) return 1;
	return 0;
}

function SelectUser(tree) {
	if (ljFriends.currentfriend) {
		RedrawTree();
	}
	if (tree.currentIndex >= 0) {
		var curfriend = ljFriends.filteredfriends[tree.currentIndex];
	} else {
		var curfriend = ljFriends.currentfriend;
	}
	ljFriends.currentfriend = curfriend;
	document.getElementById("username").value = curfriend.user;
	document.getElementById("fgcolor").value = curfriend.foreground;
	document.getElementById("fgpicker").color = curfriend.foreground;
	document.getElementById("bgcolor").value = curfriend.background;
	document.getElementById("bgpicker").color = curfriend.background;
	curfriend.name ? document.getElementById("realname").value = friendsbundle.getString("RealName") + " " + curfriend.name : document.getElementById("realname").value = "";
	if (curfriend.birthday) {
		var dateformatter = Components.classes["@mozilla.org/intl/scriptabledateformat;1"].getService(Components.interfaces.nsIScriptableDateFormat);
		var bdayarray = curfriend.birthday.split("-");
		var bday = dateformatter.FormatDate("", dateformatter.dateFormatShort, bdayarray[0], bdayarray[1], bdayarray[2]);
		document.getElementById("birthday").value = friendsbundle.getString("Birthday") + " " + bday;
	} else {
		document.getElementById("birthday").value = "";
	}
	var groupbox = document.getElementById("allowmask");
	for (var i = 0; i < ljFriends.friendgroups.length; i++) {
		var ischecked = BreakMask(curfriend.groupmask, parseInt(ljFriends.friendgroups[i].id), 10);
		groupbox.childNodes[i].setAttribute("checked", ischecked);
	}
	UpdatePreview();
}

function ValidateColour(form) {
	var ishex = new RegExp("[a-f0-9]","i");
	
	var colour = form.value;
	if (colour.charAt(0) != "#") colour = "#" + colour;
	var newcolour = "#";
	var hasbeeped = false;
	for (var i = 1; i < 7; i++) {
		if (ishex.test(colour.charAt(i))) {
			newcolour += colour.charAt(i);
		} else {
			if (!hasbeeped && colour.charAt(i)) {
				hasbeeped = true;
				var sound = Components.classes["@mozilla.org/sound;1"].getService(Components.interfaces.nsISound);
				sound.beep();
			}
		}
	}
	form.value = newcolour;
}

function UpdatePreview() {
	var preview = document.getElementById("preview");
	preview.value = document.getElementById("username").value;
	preview.style.color = document.getElementById("fgcolor").value;
	document.getAnonymousElementByAttribute(preview, "anonid", "input").style.backgroundColor = document.getElementById("bgcolor").value;
}

function UpdateColourField(fieldname,newvalue) {
	var cfield = document.getElementById(fieldname);
	cfield.value = newvalue;
}

function UpdatePicker(picker,newvalue) {
	var picker = document.getElementById(picker);
	picker.color = newvalue;
}

function NewFriend() {
	var newfriend = prompt(friendsbundle.getString("EnterName"));
	if (newfriend) {
		InsertFriend(newfriend);
	}
}

function InsertFriend(username) {
	var newfriend = new Object();
	newfriend.user = username;
	newfriend.foreground = "#000000";
	newfriend.background = "#FFFFFF";
	newfriend.groupmask = 0;
	newfriend.type = "new";
	newfriend.ischanged = true;
	ljFriends.friends.push(newfriend);
	ljFriends.friendskey.push(username);
	ljFriends.friends.sort(SortFriends);
	ljFriends.friendskey.sort();
	addCSS(newfriend);
	ljFriends.changed = true;
	ljFriends.filteredfriends = FilterFriends(document.getElementById("friendsfilter").selectedIndex);
	ljFriends.filteredfgroups = GroupsFriendsFilter(document.getElementById("groupfilter").selectedIndex);
	document.getElementById("groupsftree").view = new friendsGroupsTree();
	var friendstree = document.getElementById("friendstree"); 
	friendstree.view = new friendsTree();
	var i = ljFriends.filteredkey.indexOf(username);
	friendstree.view.selection.select(i);
	friendstree.boxObject.ensureRowIsVisible(i);
}

function UpdateUserInfo() {
	cuser = ljFriends.currentfriend;
	cuser.foreground = PadColour(document.getElementById("fgcolor").value);
	cuser.background = PadColour(document.getElementById("bgcolor").value);
	cuser.ischanged = true;
	cuser.needsupdate = true;
	ljFriends.changed = true;
}

function PadColour(colour) {
	for (var i = colour.length; i < 7; i++) colour += "0";
	return colour;
}

function UpdateGroupInfo(groupcheck) {
	cuser = ljFriends.currentfriend;
	var onoroff = groupcheck.checked;
	cuser.groupmask ^= (1 << groupcheck.value);
	cuser.groupchanged = true;
	ljFriends.groupschanged = true;
}

function RedrawTree() {
	var friendstree = document.getElementById("friendstree");
	var currentindex = friendstree.currentIndex;
	if (ljFriends.currentfriend.needsupdate) {
		addCSS(ljFriends.currentfriend);
		delete ljFriends.currentfriend.needsupdate;
		//var css = document.styleSheets[document.styleSheets.length-1];
		//while (css.cssRules.length > 0) css.deleteRule(css.cssRules.length-1);
		//ljFriends.friends.forEach(addCSS);
		// Don't need the above due to the cascade, but might need it later. 
	
		// The tree renders all insane if you keep using it after changing CSS attributes. Calling invalidate doesn't seem to work,
		//	so I destroy the treechildren then recreate them, forcing a redraw.
		friendstree.removeChild(friendstree.lastChild);
		friendstree.appendChild(document.createElement("treechildren"));
		friendstree.view = new friendsTree();
		friendstree.view.selection.select(currentindex);
		friendstree.focus();
	}
}

function DeleteUser(username) {
	var friendstree = document.getElementById("friendstree");
	var index = friendstree.currentIndex;
	var userindex = ljFriends.friendskey.indexOf(username);
	ljFriends.deleteFriends.push(ljFriends.friends.splice(userindex,1));
	ljFriends.friendskey.splice(userindex,1);
	ljFriends.changed = true;
	ljFriends.filteredfriends = FilterFriends(document.getElementById("friendsfilter").selectedIndex); 
	friendstree.view = new friendsTree();
	document.getElementById("groupsftree").view = new friendsGroupsTree();
	if (index > 0) {
		friendstree.view.selection.select(index - 1);
	} else {
		friendstree.view.selection.select(index);
	}
}

function SaveChanges() {
	SaveFriendInfo();
	if (ljFriends.changed) {
		document.getElementById("progressinfo").value = friendsbundle.getString("SavingFriends");
		var params = new Object();
		function deleteNames(duser) {
			params["editfriend_delete_" + duser[0].user] = 1; //no idea why the [0] is needed, seriously I'm tearing my hair out over it.
		}
		ljFriends.deleteFriends.forEach(deleteNames);
		var i = 1;
		function addNames(auser) {
			if (auser.ischanged) {
				params["editfriend_add_" + i + "_user"] = auser.user;
				params["editfriend_add_" + i + "_fg"] = auser.foreground;
				params["editfriend_add_" + i + "_bg"] = auser.background;
				if (auser.groupmask) params["editfriend_add_" + i + "_groupmask"] = auser.groupmask;
				i++;
			}
		}
		ljFriends.friends.forEach(addNames);
		
		ljFriends.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
		ljFriends.httpreq.onload = SaveHandler;
		params.user = LiveJournal.username.toLowerCase();
		var body = "mode=editfriends";
		body += LiveJournal.makeParams(params);
		ljFriends.httpreq.send(body);
	} else {
		setTimeout("window.close();",1);
	}
}

function SaveHandler() {
	var result = LiveJournal.responseArray(ljFriends.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
			setTimeout("window.close();",1);
		} else {
			var errmsg = LiveJournal.getResponseData("errmsg", result);
			if (errmsg) {
				alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
			} else {
				alert(commonbundle.getString("ErrorRequest") + " " + ljFriends.httpreq.request.responseText);
			}
			document.getElementById("maindisabler").removeAttribute("disabled");
			if (ljFriends.friendgroups.length > 0) document.getElementById("groupsdisabler").removeAttribute("disabled"); 
			document.getElementById("friendsprogress").style.visibility = "hidden";
			document.getElementById("progressinfo").style.visibility = "hidden";
	}
}

function SaveFriendInfo() {
	var GetTag = opener.GetTag;
	var friendsxml = dsAccounts.dsXML.createDocumentFragment();
	var friendnode = friendsxml.appendChild(dsAccounts.dsXML.createElement("friends"));
	for (var i = 0; i < ljFriends.friends.length; i++) {
		friendnode.appendChild(dsAccounts.dsXML.createElement("friend"));
		friendnode.lastChild.setAttribute("username", ljFriends.friends[i].user);
		friendnode.lastChild.setAttribute("birthday", ljFriends.friends[i].birthday);
		friendnode.lastChild.setAttribute("type", ljFriends.friends[i].type);
	}
	var oldfriends = GetTag(dsAccounts.currentaccount, "friends");
	dsAccounts.currentaccount.replaceChild(friendnode, oldfriends);
	dsAccounts.saveSettings();		
}

function changedTab(box) {
	if (!document.getElementById("maindisabler").getAttribute("disabled")) {
		switch (box) {
			case 0:
				makeGroupBoxes();
				SelectUser(document.getElementById("friendstree"));
				break;
			case 1:
				if (!ljFriends.deleteGroups) DoGroups();
				break;
			case 2:
				if (!ljFriends.friendof) DoDrama();
				makeDrama();
				break;
		}
	}
}
