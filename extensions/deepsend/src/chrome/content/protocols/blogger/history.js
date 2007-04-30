// You can really tell that this was made from a massively hacked up version of the old Atom stuff, hey? It barely makes sense.

var dateformatter = Components.classes["@mozilla.org/intl/scriptabledateformat;1"].getService(Components.interfaces.nsIScriptableDateFormat);
blogger = window.arguments[0];
metaWeblog = window.arguments[1];
var usemeta = window.arguments[2];

const historybundle = document.getElementById("historybundle");
var commonbundle = document.getElementById("commonbundle");

function LoadPostHistory(reload) {
	document.getElementById("historydeck").selectedIndex = 0;
	document.getElementById("hdprogress").value = historybundle.getString("WaitingForData");
	document.getElementById("loadingmeter").mode = "undetermined";
	document.getElementById("reload").disabled = true;
	document.getElementById("edit").disabled = true;
	var params = [];
	if (usemeta) {
		params.push(metaWeblog.blogs[0][0]["blogid"]);
		params.push(metaWeblog.username);
		params.push(metaWeblog.password);
		params.push(15);
		var posthistoryreq = makeXMLRpcCall("metaWeblog.getRecentPosts", params);
		metaWeblog.dumpXml(posthistoryreq);
		metaWeblog.posthistory = new Object();
		metaWeblog.posthistory.httpreq = new XMLHttpRequest();
		metaWeblog.posthistory.httpreq.onreadystatechange = historyHandler;
		metaWeblog.posthistory.httpreq.onerror = function() {
			alert(commonbundle.getString("ErrorConnecting"));
			window.close();
		}
		metaWeblog.posthistory.httpreq.open("POST", metaWeblog.posturl, true);
		metaWeblog.posthistory.httpreq.setRequestHeader("Content-Type", "text/xml");
		metaWeblog.posthistory.httpreq.send(posthistoryreq);
	} else {
		blogger.posthistory = new Object();
		blogger.posthistory.httpreq = new blogger.BloggerRequest(blogger.feedsURL, "GET");
		blogger.posthistory.httpreq.onerror = function() {
			alert(commonbundle.getString("ErrorConnecting"));
			window.close();
		}
		blogger.posthistory.httpreq.onload = function(){}
		blogger.posthistory.httpreq.request.onreadystatechange = historyHandler;
		blogger.posthistory.httpreq.send(null);
	}
}

function historyHandler() {
	switch (getBlogHistory().readyState) {
		case 4:
			if (getBlogHistory().status == 200) {
				if (usemeta) {
					try {
						getBlogHistory().response = parseXMLRpcResponse(getBlogHistory().responseXML);
						metaWeblog.dumpXml(getBlogHistory().responseXML);
						if ((getBlogHistory().response["faultCode"]) || (getBlogHistory().response["faultString"])) {
							alert(historybundle.getString("ErrorGettingHistory") + " " + getBlogHistory().response["faultString"]);
						} else {
							// success!
							document.getElementById("entriestree").view = new treeView();
							document.getElementById("reload").disabled = false;
							document.getElementById("edit").disabled = false;
							document.getElementById("historydeck").selectedIndex = 1;
						}
					} catch (e) {
						alert(e);
					}
				} else {
					try {
						blogger.feedsXML = getBlogHistory().responseXML;
						dump("\n\n"+getBlogHistory().responseText);
						blogger.entries = blogger.feedsXML.documentElement.getElementsByTagNameNS("http://www.w3.org/2005/Atom", "entry");
						document.getElementById("entriestree").view = new treeView();
						document.getElementById("reload").disabled = false;
						document.getElementById("edit").disabled = false;
						document.getElementById("historydeck").selectedIndex = 1;
					} catch (e) {
						alert(historybundle.getString("ErrorGettingHistory") + " " + e);
					}
				}
			} else {
				alert(historybundle.getString("ErrorGettingHistory") + " " + getBlogHistory().responseText);
			}
			break;
		case 3:
			var downloaded = Math.floor(getBlogHistory().responseText.length / 1024);
			document.getElementById("hdprogress").value = downloaded + " " + historybundle.getString("KBDownloaded");
			break;
	}
}

function getBlogHistory() {
	if (usemeta) {
		return metaWeblog.posthistory.httpreq;
	} else {
		return blogger.posthistory.httpreq.request;
	}
}

function treeView() {
  	this.rowCount = usemeta ? getBlogHistory().response[0].length : blogger.entries.length;;
	this.getCellText = function(row,col) {
		switch (col.id) {
			case "datecol":
				if (usemeta) {
					var thedate = getBlogHistory().response[0][row]["dateCreated"];
					var postdate = dateformatter.FormatDateTime("", dateformatter.dateFormatShort, dateformatter.timeFormatNoSeconds, thedate.getFullYear(), thedate.getMonth() + 1, thedate.getDate(), thedate.getHours(), thedate.getMinutes(), thedate.getSeconds());
					return postdate;
				} else {
					var bloggerdate = new Date();
					bloggerdate.setISO8601(blogger.entries[row].getElementsByTagName("updated")[0].textContent);
					var postdate = dateformatter.FormatDateTime("", dateformatter.dateFormatShort, dateformatter.timeFormatNoSeconds, bloggerdate.getFullYear(), bloggerdate.getMonth() + 1, bloggerdate.getDate(), bloggerdate.getHours(), bloggerdate.getMinutes(), bloggerdate.getSeconds());
					return postdate;
				}
				break;
			case "titlecol":
				if (usemeta) {
					return metaWeblog.posthistory.httpreq.response[0][row]["title"] ? metaWeblog.posthistory.httpreq.response[0][row]["title"] : metaWeblog.posthistory.httpreq.response[0][row]["description"];
				} else {
					return blogger.entries[row].getElementsByTagName("title")[0].textContent;
					break;
				}
				break;
		}
 	}
	this.setTree = function(treebox){ this.treebox = treebox; }
	this.isContainer = function(row){ return false; }
	this.isSeparator = function(row){ return false; }
	this.isSorted = function(row){ return false; }
	this.getLevel = function(row){ return 0; }
	this.getImageSrc = function(row,col){ return null;}
	this.getRowProperties = function(row, props) {
		if (!usemeta) {
			var draft = blogger.entries[row].getElementsByTagNameNS("http://purl.org/atom/app#", "draft")[0];
			if ((draft) && (draft.textContent == "yes")) {
				var aserv = Components.classes["@mozilla.org/atom-service;1"].getService(Components.interfaces.nsIAtomService);
				props.AppendElement(aserv.getAtom("greyedout"));
			}
		}
	}
	this.getCellProperties = function(row,col,props){}
	this.getColumnProperties = function(colid,col,props) {}
}

function showEntry(tree) {
	if (tree.currentIndex >= 0) {
		var windowid = "dsedit" + tree.currentIndex;
		var postindex = tree.currentIndex; 
		var windowwatcher = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
		var editwindow = windowwatcher.getWindowByName(windowid, null);
		if (editwindow) {
			editwindow.focus();
		} else {
			if (usemeta) {
				metaWeblog.useme = true;
			}
			window.openDialog("blogger.xul",windowid,"chrome,resizable,titlebar,dialog=no", blogger, metaWeblog, postindex);
		}
	}
}
