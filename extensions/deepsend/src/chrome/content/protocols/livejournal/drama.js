function DoDrama() {
	ljFriends.friendof = [];
	ljFriends.friendofkey = [];
	var result = ljFriends.loadResult;
	for (var i = 1; i <= parseInt(LiveJournal.getResponseData("friendof_count", result), 10); i++) {
		var newfriendof = new Object();
		newfriendof.user = LiveJournal.getResponseData("friendof_" + i +"_user", result);
		ljFriends.friendofkey.push(LiveJournal.getResponseData("friendof_" + i +"_user", result));
		newfriendof.name = LiveJournal.getResponseData("friendof_" + i + "_name", result);
		newfriendof.background = LiveJournal.getResponseData("friendof_" + i + "_bg", result);
		newfriendof.foreground = LiveJournal.getResponseData("friendof_" + i + "_fg", result);
		newfriendof.type = LiveJournal.getResponseData("friendof_" + i + "_type", result);
		newfriendof.status = LiveJournal.getResponseData("friendof_" + i + "_status", result);
		ljFriends.friendof.push(newfriendof);
	}
}

function makeDrama() {
	ljFriends.nydrama = [];
	function createNYDramaArray(auser) {
		if (ljFriends.friendskey.indexOf(auser.user) < 0) ljFriends.nydrama.push(auser); 
	}
	ljFriends.friendof.forEach(createNYDramaArray);
	document.getElementById("notyours").view = new notYours();
	
	ljFriends.ntdrama = [];
	function createNTDramaArray(auser) {
		if (auser.type != "syndicated") {
			if (ljFriends.friendofkey.indexOf(auser.user) < 0) ljFriends.ntdrama.push(auser);
		}
	}
	ljFriends.friends.forEach(createNTDramaArray);
	document.getElementById("nottheirs").view = new notTheirs();
}

function notYours() {
  	this.rowCount = ljFriends.nydrama.length;
	this.getCellText = function(row,col) {
		if (col.id == "notyourscol") return ljFriends.nydrama[row].user;
		return null;
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){
		if (col.id == "nyicon") {
			switch (ljFriends.nydrama[row].type) {
				case "community":
					return "chrome://deepestsender/skin/images/ljcomm.png";
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
	this.getRowProperties = function(row, props) {}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
}

function notTheirs() {
  	this.rowCount = ljFriends.ntdrama.length;
	this.getCellText = function(row,col) {
		if (col.id == "nottheirscol") return ljFriends.ntdrama[row].user;
		return null;
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){
		if (col.id == "nticon") {
			switch (ljFriends.ntdrama[row].type) {
				case "community":
					return "chrome://deepestsender/skin/images/ljcomm.png";
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
	this.getRowProperties = function(row, props) {}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
}

function AddFromDrama() {
	var index = document.getElementById("notyours").currentIndex;
	if (index >= 0) {
		document.getElementById("tabs").selectedIndex = 0;
		InsertFriend(ljFriends.nydrama[index].user);
	}
}

function DeleteFromDrama() {
	var index = document.getElementById("nottheirs").currentIndex;
	if (index >= 0) {
		DeleteUser(ljFriends.ntdrama[index].user);
		makeDrama();
	}
}
