var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService().QueryInterface(Components.interfaces.nsIDragService);
var nsIDragService = Components.interfaces.nsIDragService;
const nsITreeView = Components.interfaces.nsITreeView;

function DoGroups() {
	ljFriends.deleteGroups = [];
	var groupstree = document.getElementById("groupstree");
	var groupsflist = document.getElementById("groupsftree");
	groupstree.view = new groupsTree();
	ljFriends.filteredfgroups = GroupsFriendsFilter(0);
	groupsflist.view = new friendsGroupsTree();
	if (groupstree.view.rowCount > 0) {
		document.getElementById("groupsdisabler").removeAttribute("disabled");
		groupstree.view.selection.select(0);
	}
}

function groupsTree() {
  	this.rowCount = ljFriends.friendgroups.length;
	this.getCellText = function(row,col) {
		return ljFriends.friendgroups[row].name;
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){ }
	this.getRowProperties = function(row, props) {	}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
	this.getParentIndex = function(row) { return -1; }
	this.canDrop = function(row, orientation) {
		var session = dragService.getCurrentSession();
		var boxobject = document.getElementById("groupstree").boxObject;
		if (!session || session.sourceNode != boxobject.treeBody || orientation == this.DROP_ON) return false;
		return true;
	}
	this.drop = function(row, orientation) {
		var session = dragService.getCurrentSession();
		var groupstree = document.getElementById("groupstree");
		if (!session || session.sourceNode != groupstree.boxObject.treeBody || orientation == this.DROP_ON) return;
		var group = ljFriends.friendgroups.splice(ljFriends.dragData,1);
		ljFriends.friendgroups.splice(row,0,group[0]);
		groupstree.view.selection.clearSelection();
		groupstree.boxObject.invalidate();
		groupstree.view.selection.select(row);
		ljFriends.groupschanged = true;
		for (var i = 0; i < ljFriends.friendgroups.length; i++) {
			ljFriends.friendgroups[i].sortorder = i + 1;
			ljFriends.friendgroups[i].ischanged = true;
		}
	}
	this.DROP_ON = nsITreeView.DROP_ON;
	this.DROP_BEFORE = nsITreeView.DROP_BEFORE;
	this.DROP_AFTER = nsITreeView.DROP_AFTER;
}

function friendsGroupsTree() {
	this.canDrop = function() {return false;}
  	this.rowCount = ljFriends.filteredfgroups.length;
	this.getCellText = function(row,col) {
		if (col.id == "groupsflist") {
			return ljFriends.filteredfgroups[row].user;
		}
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){
		if (col.id == "groupiconcol") {
			switch (ljFriends.filteredfgroups[row].type) {
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
	}
	this.getRowProperties = function(row, props) {}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
	this.isEditable = function(row,col) {
		if (col.id == "friendcheck") {
			return true;
		}
	}
	this.getCellValue = function(row,col) {
		if (col.id == "friendcheck") {
			if (document.getElementById("groupsdisabler").getAttribute("disabled")) return false;
			return BreakMask(ljFriends.filteredfgroups[row].groupmask, ljFriends.currentgroup.id);
		}
	}
	this.setCellValue = function(row,col) {
		if ((col.id == "friendcheck") && (!document.getElementById("groupsdisabler").getAttribute("disabled"))) {
			var friend = ljFriends.friends[ljFriends.friendskey.indexOf(ljFriends.filteredfgroups[row].user)]; 
			friend.groupmask ^= (1 << ljFriends.currentgroup.id);
			friend.groupchanged = true;
			ljFriends.groupschanged = true;
			var groupfilter = document.getElementById("groupfilter");
			/*if (groupfilter.selectedIndex > 4) {
				ljFriends.filteredfgroups = GroupsFriendsFilter(groupfilter);
				document.getElementById("groupsftree").view = new friendsGroupsTree();
			} else {*/
				var friendstree = document.getElementById("groupsftree"); 
				friendstree.boxObject.invalidateCell(row,col);
			//}
		}
	}
}

function GroupsFriendsFilter(filter) {
	var groupsfriendsarray = [];
	switch (filter.selectedIndex) {
		case 1:
			for (var i = 0; i < ljFriends.friends.length; i++) {
				if (!ljFriends.friends[i].type) {
					groupsfriendsarray.push(ljFriends.friends[i]);
				}
			}
			return groupsfriendsarray;
			break;
		case 2:
			var lookfor = "community";
			break;
		case 3:
			var lookfor = "syndicated";
			break;
		default:
			if (filter.selectedIndex > 4) {
				for (var i = 0; i < ljFriends.friends.length; i++) {
					var ingroup = BreakMask(ljFriends.friends[i].groupmask, filter.selectedItem.value);
					if (ingroup) groupsfriendsarray.push(ljFriends.friends[i]);
				}
				return groupsfriendsarray;
			}
		case 0:
			return ljFriends.friends;
			break;
	}
	for (var i = 0; i < ljFriends.friends.length; i++) {	
		if ((ljFriends.friends[i].type == lookfor) || (ljFriends.friends[i].type == "new")) {
			groupsfriendsarray.push(ljFriends.friends[i]);
		}
	}
	return groupsfriendsarray;
}

function SelectGroup(grouptree) {
	ljFriends.currentgroup = ljFriends.friendgroups[grouptree.currentIndex];
	if (ljFriends.currentgroup) {
		var publicgroup = document.getElementById("publicgroup");
		if (ljFriends.currentgroup.ispublic) {
			publicgroup.checked = true;
		} else {
			publicgroup.checked = false;
		}
		var friendstree = document.getElementById("groupsftree"); 
		friendstree.boxObject.invalidateColumn(friendstree.boxObject.columns.getFirstColumn());
	}
}

function CheckAll(onoroff) {
	for (var i = 0; i < ljFriends.filteredfgroups.length; i++) {
		var index = ljFriends.friendskey.indexOf(ljFriends.filteredfgroups[i].user);
		var newmask = ljFriends.friends[index].groupmask ^ (1 << ljFriends.currentgroup.id);
		onoroff ? ljFriends.friends[index].groupmask = Math.max(newmask, ljFriends.friends[index].groupmask) : ljFriends.friends[index].groupmask = Math.min(newmask, ljFriends.friends[index].groupmask);
		ljFriends.friends[index].groupchanged = true;
	}
	ljFriends.groupschanged = true;
	var friendstree = document.getElementById("groupsftree"); 
	friendstree.boxObject.invalidateColumn(friendstree.boxObject.columns.getFirstColumn());
}

function InsertGroup(grouptree) {
	var newgroup = prompt(friendsbundle.getString("NewGroup"));
	if (newgroup) {
		var group = new Object();
		group.name = newgroup;
		group.ispublic = false;
		group.ischanged = true;
		group.id = 1;
		// Find the lowest group number that hasn't already been used.
		var sortid = [];
		function sortedIDArray(item) {
			sortid[item.id] = true;	
		}
		ljFriends.friendgroups.forEach(sortedIDArray);
		sortid.push(false);
		for (var i = 1; i < sortid.length; i++) {
			if (!sortid[i]) {
				group.id = i;
				break;
			}
		}
		group.sortorder = ljFriends.friendgroups.length + 1; 
		ljFriends.friendgroups.push(group);
		ljFriends.groupschanged = true;
		grouptree.view = new groupsTree();
		grouptree.view.selection.select(ljFriends.friendgroups.length-1);
		document.getElementById("groupsdisabler").removeAttribute("disabled");
		if (ljFriends.friendgroups.length > 30) {
			document.getElementById("newgroup").setAttribute("disabled",true);
		}
	}
}

function DeleteGroup(grouptree) {
	var index = grouptree.currentIndex;
	var deletegroup = ljFriends.friendgroups.splice(index,1);
	ljFriends.deleteGroups.push(deletegroup);
	CheckAll(false);
	grouptree.view = new groupsTree();
	if (ljFriends.friendgroups.length >= 1) {
		index > 0 ? grouptree.view.selection.select(index - 1) : grouptree.view.selection.select(index);
	}
	document.getElementById("newgroup").removeAttribute("disabled");
	if (ljFriends.friendgroups.length < 1) {
		delete ljFriends.currentgroup;
		document.getElementById("groupsdisabler").setAttribute("disabled",true);
	}
	ljFriends.groupschanged = true;
}

function TogglePublic(onoff) {
	onoff ? ljFriends.currentgroup.ispublic = 1 : delete ljFriends.currentgroup.ispublic;
	ljFriends.currentgroup.ischanged = true;
}

function RenameGroup(grouptree) {
	if (grouptree.currentIndex >= 0) {
		var newname = prompt(friendsbundle.getString("RenameGroup"),ljFriends.currentgroup.name);
		if ((newname) && (newname != ljFriends.currentgroup.name)) {
			ljFriends.currentgroup.name = newname;
			ljFriends.currentgroup.ischanged = true;
			grouptree.boxObject.invalidateRow(grouptree.currentIndex);
			ljFriends.groupschanged = true;
		}
	}
}

function makeGroupBoxes() {
	var groups = ljFriends.friendgroups;
	var filter = document.getElementById("friendsfilter").lastChild;
	var groupfilter = document.getElementById("groupfilter").lastChild;
	var boxes = document.getElementById("allowmask");
	while (filter.childNodes.length > 4) filter.removeChild(filter.lastChild);
	while (boxes.childNodes.length > 0) boxes.removeChild(boxes.lastChild);
	while (groupfilter.childNodes.length > 4) groupfilter.removeChild(groupfilter.lastChild);
	if (groups.length > 0) {
		filter.appendChild(document.createElement("menuseparator"));
		groupfilter.appendChild(document.createElement("menuseparator"));
		for (i = 0; i < groups.length; i++) {
			boxes.appendItem(groups[i].name, groups[i].id);
			boxes.lastChild.setAttribute("type", "checkbox");
			boxes.lastChild.setAttribute("onclick", "UpdateGroupInfo(this);");
			filter.appendChild(document.createElement("menuitem"));
			filter.lastChild.setAttribute("label",groups[i].name);
			filter.lastChild.setAttribute("value",groups[i].id);
			groupfilter.appendChild(document.createElement("menuitem"));
			groupfilter.lastChild.setAttribute("label",groups[i].name);
			groupfilter.lastChild.setAttribute("value",groups[i].id);
		}
		
	}
}

function doGroupDrag(e) {
	var groupstree = document.getElementById("groupstree");
	var row = groupstree.boxObject.getRowAt(e.clientX, e.clientY);
	var array = Components.classes["@mozilla.org/supports-array;1"].createInstance(Components.interfaces.nsISupportsArray);
	var transferable = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
	var data = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
	data.data = row;
	transferable.setTransferData("text/unicode", data, data.data.length * 2);
	array.AppendElement(transferable);
	var region = Components.classes["@mozilla.org/gfx/region;1"].createInstance(Components.interfaces.nsIScriptableRegion);
	region.init();
	var x = {};
	var y = {};
	var width = {};
	var height = {};
	var col = groupstree.boxObject.columns.getFirstColumn();
	groupstree.boxObject.getCoordsForCellItem(row, col, "text", x, y, width, height);
	region.setToRect(x.value, y.value, width.value, height.value);
	ljFriends.dragData = row;
	try {
		dragService.invokeDragSession(groupstree.boxObject.treeBody, array, region, dragService.DRAGDROP_ACTION_MOVE);
	} catch(e) {}
}

function SaveGroups() {
	document.getElementById("maindisabler").setAttribute("disabled", true);
	document.getElementById("groupsdisabler").setAttribute("disabled", true);
	document.getElementById("friendsprogress").style.visibility = "visible";
	document.getElementById("progressinfo").style.visibility = "visible";
	document.getElementById("progressinfo").value = friendsbundle.getString("SavingGroups");
	if (ljFriends.groupschanged) {
		// Insert thousands of (for i) loops!
		var params = new Object();
		function anyMatches(group) {
			for (var i = 0; i < ljFriends.friendgroups.length; i++) {
				if (group[0].id == ljFriends.friendgroups[i].id) return true;
			}
			return false;
		}
		for (var i = 0; i < ljFriends.deleteGroups.length; i++) {
			var magicnumber = (1 << ljFriends.deleteGroups[i][0].id) ^ ~(1 << 31);
			LiveJournal.defaultgroups &= magicnumber;
			opener.ljPost.allowmask &= magicnumber;
			if (!anyMatches(ljFriends.deleteGroups[i])) {
				params["efg_delete_" + ljFriends.deleteGroups[i][0].id] = 1;
			}
		}
		
		function makeGroupParams(group) {
			if (group.ischanged) {
				params["efg_set_" + group.id + "_name"] = group.name;
				params["efg_set_" + group.id + "_sort"] = group.sortorder;
				if (group.ispublic) {
					params["efg_set_" + group.id + "_public"] = 1;
				} else {
					params["efg_set_" + group.id + "_public"] = 0;
				}
			}
		}
		ljFriends.friendgroups.forEach(makeGroupParams);
		function groupMasks(curfriend) {
			if (curfriend.groupchanged && !curfriend.ischanged) {
				params["editfriend_groupmask_" + curfriend.user] = curfriend.groupmask;
			}
		}
		ljFriends.friends.forEach(groupMasks);
		ljFriends.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl);
		ljFriends.httpreq.onload = SaveGroupsHandler;
		params.user = LiveJournal.username.toLowerCase();
		var body = "mode=editfriendgroups";
		body += LiveJournal.makeParams(params);
		ljFriends.httpreq.send(body);
	} else {
		SaveChanges();
	}
}

function SaveGroupsHandler() {
	var result = LiveJournal.responseArray(ljFriends.httpreq.request.responseText);
	if (LiveJournal.getResponseData("success", result) == "OK") {
		LiveJournal.friendgroups = ljFriends.friendgroups;
		
		if (ljFriends.deleteGroups.length > 0) {
			if (LiveJournal.defaultsecurity > 2) {
				var defsectag = opener.GetTag(dsAccounts.currentaccount, "security");
				defsectag.setAttribute("groups", LiveJournal.defaultgroups);
				if (LiveJournal.defaultgroups < 2) {
					LiveJournal.defaultsecurity = 1;
					defsectag.setAttribute("level", 1);
				}
			}
			if ((opener.ljPost.security > 2) && (opener.ljPost.allowmask < 2)) {
				opener.document.getElementById("security").selectedIndex = 1;
				opener.ljPost.security = 1;
			}
		}
		setTimeout("SaveChanges();",1);
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
	}
}
