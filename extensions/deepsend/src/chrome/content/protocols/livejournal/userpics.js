LiveJournal = window.arguments[0];
dsMain = window.arguments[1];
var kwarray;


function Init() {
	document.getElementById("picstree").view = new treeView();
	document.getElementById("picstree").view.selection.select(dsMain.document.getElementById("picture").selectedIndex);
	document.getElementById("picsearch").focus();
}

function searchArray(searchfor) {
	var results = [[]];
	results[0].pickw = dsMain.ljpostingbundle.getString("DefaultPic");
	results[0].url = LiveJournal.defaultpicurl;
	results[0].number = 0;
	for (var i = 0; i < LiveJournal.pickws.length; i++) {
		var kwsearch = new RegExp(searchfor, "i");
		if (kwsearch.test(LiveJournal.pickws[i].pickw)) {
			results.push(LiveJournal.pickws[i]);
			results[results.length - 1].number = i + 1;
		}
	}
	return results;
}

function treeView() {
	kwarray = searchArray(document.getElementById("picsearch").value);
  	this.rowCount = kwarray.length;
	this.getCellText = function(row,col) {
		switch (col.id) {
			case "textcol":
				return kwarray[row].pickw;
				break;
			default:
				return null;
				break;
		}
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){
		switch (col.id) {
			case "userpiccol":
				return kwarray[row].url;
				break;
			default:
				return null;
				break;
		}
	}
	this.getRowProperties = function(row, props) {}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
}

function changePic(tree) {
	var picbox = dsMain.document.getElementById("picture");
	picbox.selectedIndex = kwarray[tree.currentIndex].number;
	dsMain.dsPosts.changePicture(picbox);
}

function WipeTree() {
	/* This prevents Firefox from crashing when the window is closed before images have loaded. */
	var tree = document.getElementById("picstree");
	tree.removeChild(tree.lastChild);
}
