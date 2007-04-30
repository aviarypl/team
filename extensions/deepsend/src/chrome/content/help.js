const DS = "http://deepestsender.mozdev.org/DS-rdf#";
const RDF = Components.classes["@mozilla.org/rdf/rdf-service;1"].getService(Components.interfaces.nsIRDFService);
const DS_LINK = RDF.GetResource(DS + "link");

function onselect_loadURI(tree) {
	try {
		var resource = tree.view.getResourceAtIndex(tree.currentIndex);
		var link = tree.database.GetTarget(resource, DS_LINK, true);
		if (link) {
		    link = link.QueryInterface(Components.interfaces.nsIRDFLiteral);
		    var helpbrowser = document.getElementById("helpbrowser");
		    helpbrowser.loadURI(link.Value);
		}
	} catch (e) {}
}

function Init() {
	var helpbrowser = document.getElementById("helpbrowser");
	helpbrowser.goHome();
}

