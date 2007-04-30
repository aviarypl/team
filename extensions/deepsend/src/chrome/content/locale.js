function OkClicked() {
	var DS = new Components.Constructor( "@mozilla.org/file/directory_service;1", "nsIProperties" );
	var myDirS = new DS( );
	var f = myDirS.get( "ProfD", Components.interfaces.nsIFile );
	f.append("chrome");
	f.append("chrome.rdf");
	var chromerdf =  FileIO.open(f.path);
	if (chromerdf.exists()) {
		var filecontents = FileIO.read(chromerdf, "utf-8");
		var domParser = new DOMParser();
		var chromedoc = domParser.parseFromString(filecontents, "text/xml");
		var dsnode = chromedoc.getElementsByTagName("Description");
		for (var i = 0; i < dsnode.length; i++) {
			if (dsnode[i].getAttribute("RDF:about") == "urn:mozilla:package:deepestsender") {
				var dsnum = i;
				break;
			}
		}
		if (typeof(dsnum) == "number") {
			try {
				var localenode = GetTag(dsnode[dsnum], "selectedLocale");
				localenode.setAttribute("RDF:resource", "urn:mozilla:locale:" + document.getElementById("locale").value + ":deepestsender");
				var serializer = new XMLSerializer();
				var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
				foStream.init(f, 0x02 | 0x08 | 0x20, 0664, 0);
				serializer.serializeToStream(chromedoc, foStream, "utf-8");
				foStream.close();
				alert("The locale for Deepest Sender has successfully changed. Please restart SeaMonkey for it to take effect.");
			} catch (e) {
				alert("There was an error writing to chrome.rdf.");
			}
		} else {
			alert("Deepest Sender selectedLocale line was not found in chrome.rdf!");
		}
	} else {
		alert("Error finding the chrome.rdf file!");
	}
}
