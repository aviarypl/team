// These are the preference functions. And it also sets the AppName thing, but I might move that.
// Sets the string trim function and some other miscellaneous stuff too.

var AppVersion = "0.8.0";
var AppName = "Mozilla-DeepestSender/" + AppVersion;
var notWhitespace = /\S/
function RemoveWhiteSpace(node) {
	// Example code stolen from http://www.codingforums.com/archive/index.php/t-7028
	//	Mozilla treats linebreaks and some whitespace as nodes in XML. This wreaks havoc when playing
	//	with thing.childNodes and stuff like that. This code runs through the document and deletes any
	//	whitespace nodes found.
	// In: A node to start working from.
	// Out: Nothing, but the node you passed to the function will now be free from whitespace. This means that
	//	code looks very ugly when serialised and saved, but people shouldn't be manually editing that anyway.
	for (var x = 0; x < node.childNodes.length; x++) {
		var childNode = node.childNodes[x];
		if ((childNode.nodeType == 3)&&(!notWhitespace.test(childNode.textContent))) {
			// that is, if it's a whitespace text node
			node.removeChild(node.childNodes[x]);
			x--;
		}
		if (childNode.nodeType == 1) {
			// elements can have text child nodes of their own
			RemoveWhiteSpace(childNode);
		}
	}
}
// Evaluate an XPath expression aExpression against a given DOM node
// or Document object (aNode), returning the results as an array
// thanks wanderingstan at morethanwarm dot mail dot com for the
// initial work.
function evaluateXPath(aNode, aExpr) {
	var xpe = new XPathEvaluator();
	var nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ?
	aNode.documentElement : aNode.ownerDocument.documentElement);
	var result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);
	var found = [];
	while (res = result.iterateNext())
		found.push(res);
	return found;
}
function GetTag(xml, tagname) {
	// This is me at my laziest, and not bothering to look for a more efficient way to find tags by name.
	//	Only use this when you're sure there'll be one result.
	// In: An XML document or a node (it'll start searching down from whatever is passed), the name of the tag to find.
	// Out: A node with the tag specified.
	return xml.getElementsByTagName(tagname)[0];
}
function ZeroFix(number) {
	// To pad out numbers so they're always 2 digits long.
	// In: A number less than or equal to 10.
	// Out: The number, with a zero added at the front if it is 9 or less.
	numberint = parseInt(number, 10);
	if (numberint < 10) {
		numberint = "0" + numberint;
	}
	return numberint;
}
String.prototype.trim = function() {
	// Grabbed this off the net. It's just to get rid of any whitespace at the start and end of strings, to stop people
	//	from just pressing space a few times then hitting post to send a blank entry off to LJ (why? I don't know,
	//	but people are idiots).
	// In: Nothing. This is attached to string objects, and is accessed by somestring.trim().
	// Out: A version of the string, but with all the start and end whitespace gone.
	return this.replace(/^\s+/,'').replace(/\s+$/,'');
}

function GetWindowByType(wintype) {
	var windowmanager = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
	return windowmanager.getMostRecentWindow(wintype);
}

function OpenURLInBrowser(url) {
	var browser = GetWindowByType("navigator:browser");
	if (browser) {
		browser.focus();
		browser.loadURI(url);
	} else {
		var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
		if (appInfo.ID) {
			window.open(url, "_blank");
		} else {
			var ioservice = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var uriToOpen = ioservice.newURI(url, null, null);
			var extps = Components.classes["@mozilla.org/uriloader/external-protocol-service;1"].getService(Components.interfaces.nsIExternalProtocolService);
			extps.loadURI(url, null);
		}
	}
}

function FindMusic() {
	// Returns the artist/track for the current song. Settings are found on the options screen. Make sure a preferences
	//	object is connected first.
	// In: Nothing.
	// Out: String of the current song playing.
	var detection = dsPrefs.getIntPref("DetectMethod");
	switch (detection) {
		case 1:
			var browser = GetWindowByType("navigator:browser");
			try {
				return browser.foxytunesGetCurrentTrackTitle();
			} catch (e) {
			}
			return "";
			break;
		case 2:
			const HKEY_CURRENT_USER = 0x80000001;
			var regkey = Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);
			try {
				var keytoinfo = regkey.open(HKEY_CURRENT_USER, "Software\\Microsoft\\MediaPlayer\\CurrentMetadata", Components.interfaces.nsIWindowsRegKey.ACCESS_READ);
				if (regkey.valueCount) {
					var currentsong = regkey.readStringValue("Author");
					currentsong += " - ";
					currentsong += regkey.readStringValue("Title");
					if (currentsong.length < 3) {
						currentsong = "";
					}
					return currentsong;
				}
			} catch(e) {
			}
			return "";
			break;
		case 3:
			var fileloc = dsPrefs.getCharPref("MP3InfoFile");
			var filedisplay = dsPrefs.getCharPref("MP3Display");
			var musicfile = FileIO.open(fileloc);
			if (musicfile.exists()) {
				var searcher, musicstring;
				var musicstring = FileIO.read(musicfile, "UTF-8");
				musicstring = musicstring.replace(/\r\n/gi, "\n");
				musicstring = musicstring.replace(/\r/gi, "\n");
				var musicarray = [];
				musicarray = musicstring.split("\n")
				for (i = 0; i < musicarray.length; i++) {
					searcher = new RegExp("\%" + (i + 1) + "\%","gi");
					filedisplay = filedisplay.replace(searcher,musicarray[i]);
				}
				filedisplay = filedisplay.trim();
				if (filedisplay.length > 3) {
					return filedisplay;
				} else {
					return "";
				}
			} else {
				alert("The specified MP3 info file does not exist!");
				return "";
			}
			break;
		default:
			return "";
			break;
	}
}

function FilePicker(aTitle, aSave) {
	// txtFilePicker
	//
	// Parameters:
	//  aTitle: title to go on file picker window
	//  aSave: 1 if picking file to save/overwrite, 0 if picking file to load
	//  aStart: directory to start from
	//    This must be an nsILocalFile.  new Dir("foo") in jslib/io/dir.js will
	//    do the trick, but you have to do it yourself.
	// Returns:
	//  Name of file picked, in URL format, or null if cancelled
	// Original taken and modified from Tagzilla.mozdev.org!
	var retVal = null;
	try {
		const nsIFilePicker = Components.interfaces.nsIFilePicker;
		var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
		fp.init(window, aTitle, (aSave ? nsIFilePicker.modeSave : nsIFilePicker.modeOpen));
		fp.appendFilters(nsIFilePicker.filterText);
		fp.appendFilters(nsIFilePicker.filterAll);
		var result=fp.show();
		if (result == nsIFilePicker.returnOK || result == nsIFilePicker.returnReplace) {
			retVal=fp.file.path;
		}
	}
	catch (ex) {
	}
	return retVal;
}
function FindDomain(urlstring) {
	// Gets the text before the first slash in a URL.
	// In: A URL.
	// Out: The domain of the URL.
	var findserver = new RegExp("http:\/\/.*?\/", "gi");
	var domainstring = findserver.exec(urlstring);
	return domainstring;
}
