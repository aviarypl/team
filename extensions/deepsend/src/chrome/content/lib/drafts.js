dsDraft = new Object();
const nsIFilePicker = Components.interfaces.nsIFilePicker;
const draftbundle = document.getElementById("draftbundle");

dsDraft.autoSaveLocation = function() {
	var DS = new Components.Constructor( "@mozilla.org/file/directory_service;1", "nsIProperties" );
	var myDirS = new DS( );
	var f = myDirS.get( "ProfD", Components.interfaces.nsIFile );
	f.append("deepestsender-autosave.xml");
	return f;
}

dsDraft.loadDraftFrom = function() {
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, draftbundle.getString("SelectDraft"), nsIFilePicker.modeOpen);
	fp.appendFilters(nsIFilePicker.filterXML);
	fp.defaultExtension = "xml";
	var result = fp.show();
	if ((result == nsIFilePicker.returnOK) || (result == nsIFilePicker.returnReplace)) {
		this.draftfile = fp.file;
		dsDraft.loadDraft(this.draftfile);
	} else {
		return;
	}
}

dsDraft.loadDraft = function(draftobj) {
	if (!draftobj) {
		var draftobj = dsDraft.autoSaveLocation();
	}
	var draftfile = FileIO.open(draftobj.path);
	if (draftfile.exists()) {
		var filecontents = FileIO.read(draftfile, "utf-8");
		var domParser = new DOMParser();
		var xml = domParser.parseFromString(filecontents, "text/xml");
		RemoveWhiteSpace(xml.documentElement);
		xml.normalize();
		var message = GetTag(xml, "event").textContent;
		message = message.replace(/<br class="DS_draftnewline" \/>/gi, "\n");
		document.getElementById("messagesource").value = message;
		document.getElementById("subject").value = GetTag(xml, "subject").textContent;
		dsMidas.syncNormalTab();
	}
}

dsDraft.saveDraftTo = function() {
	if (!this.draftfile) {
		this.saveDraftAs();
	} else {
		this.saveDraft(this.draftfile);
	}
}

dsDraft.saveDraftAs = function() {
	var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
	fp.init(window, draftbundle.getString("SelectDraft"), nsIFilePicker.modeSave);
	fp.appendFilters(nsIFilePicker.filterXML);
	fp.defaultExtension = "xml";
	var result = fp.show();
	if ((result == nsIFilePicker.returnOK) || (result == nsIFilePicker.returnReplace)) {
		this.draftfile = fp.file;
		dsDraft.saveDraft(this.draftfile);
	} else {
		return;
	}
}

dsDraft.saveDraft = function(draftobj) {
	if (!draftobj) {
		var draftobj = dsDraft.autoSaveLocation();
	}
	var xml = document.implementation.createDocument("", "entry", null);
	xml.insertBefore(xml.createProcessingInstruction("xml", "version=\"1.0\" encoding=\"utf-8\""), xml.documentElement);
	xml.documentElement.appendChild(xml.createElement("subject"));
	xml.documentElement.appendChild(xml.createElement("event"));
	var tabindex = document.getElementById("messagetabbox").selectedIndex;
	dsMidas.updateSourceTab();
	var message = document.getElementById("messagesource").value;
	var subject = document.getElementById("subject").value;
	message = message.replace(/\n/gi, "<br class=\"DS_draftnewline\" />");
	message = message.replace(/]]>/gi, "]]&gt;");
	subject = subject.replace(/]]>/gi, "]]&gt;");
	GetTag(xml, "subject").appendChild(xml.createCDATASection(subject));
	GetTag(xml, "event").appendChild(xml.createCDATASection(message));

	xml.normalize();
	
	var serializer = new XMLSerializer();
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
	foStream.init(draftobj, 0x02 | 0x08 | 0x20, 0664, 0);   // write, create, truncate
	serializer.serializeToStream(xml, foStream, "utf-8");
	foStream.close();
	
}

