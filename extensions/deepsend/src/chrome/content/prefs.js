function SetBroadcaster(broad, val) {
	// Enables or disables the MP3 textbox options. That is all.
	// In: ID of the broadcaster, and a boolean of whether to disable (true) or enable (false) it.
	// Out: Nothing.
	if (val) {
		document.getElementById("bc_textfile").setAttribute("disabled", val);
	} else {
		document.getElementById("bc_textfile").removeAttribute("disabled");
	}
}

function SetMP3InfoFile(pathobj) {
	const prefbundle = document.getElementById("prefbundle");
	var mp3file = FilePicker(prefbundle.getString("ChooseMP3File"),0);
	if (mp3file) pathobj.value = mp3file;
	try {
		document.getElementById("musicoptions").userChangedValue(pathobj);
	} catch (e) {
	}
}

function ShowMP3Options() {
	if (navigator.platform == "Win32") document.getElementById("registry").disabled = false;
	var browser = GetWindowByType("navigator:browser");
	if (browser.document.getElementById("foxytunes-statusbar-panel")) document.getElementById("foxytunes").disabled = false;
	if (document.getElementById("mp3optionsgroup").selectedIndex == 3) SetBroadcaster("bc_textfile");
}

// Spews forth a file object for the stylesheet.
function GetStylesheet() {
	var DS = new Components.Constructor( "@mozilla.org/file/directory_service;1", "nsIProperties" );
	var myDirS = new DS( );
	var f = myDirS.get( "ProfD", Components.interfaces.nsIFile );
	f.append("deepestsender.css");
	return f;
}

// Loads the stylesheet.
function ShowFormatting() {
	var filecontents = "";
	var stylesheet = FileIO.open(GetStylesheet().path);
	if (stylesheet.exists()) {
		filecontents = FileIO.read(stylesheet);
	}
	document.getElementById("editorstyle").value = filecontents;
}

// Saves the stylesheet.
function SaveStylesheet() {
	var stylesheet = FileIO.open(GetStylesheet().path);
	FileIO.write(stylesheet, document.getElementById("editorstyle").value);
}

// Only Windows boxes will take ondialogaccept for prefwindows, so this catches it on Mac and Linux.
function CheckNotWin() {
	if (navigator.platform.indexOf("Win") < 0) {
		SaveStylesheet();
	}
}
var dsPrefs, prefbundle;

function InitNotFx() {
	dsPrefs = new PrefsWrapper1("extensions.deepestSender.");
	prefbundle = document.getElementById("prefbundle");
	document.getElementById("picalign").selectedIndex = dsPrefs.getIntPref("PicAlign"); 
	document.getElementById("usecss").checked = dsPrefs.getBoolPref("UseCSS");
	document.getElementById("removemozattrs").checked = dsPrefs.getBoolPref("RemoveMozAttrs");
	document.getElementById("autodetectmusic").checked = dsPrefs.getBoolPref("AutoDetectMusic");
	document.getElementById("sourceview").checked = dsPrefs.getBoolPref("SourceViewDefault");
	document.getElementById("mp3options").selectedIndex = dsPrefs.getIntPref("DetectMethod");
	document.getElementById("mp3path").value = dsPrefs.getCharPref("MP3InfoFile");
	document.getElementById("mp3display").value = dsPrefs.getCharPref("MP3Display");

	if ("@mozilla.org/spellchecker;1" in Components.classes) {
		document.getElementById("spellcheckonpost").disabled = false;
		document.getElementById("spellcheckonpost").checked = dsPrefs.getBoolPref("SpellCheckOnPost");
	}
	if (navigator.platform == "Win32") {
		document.getElementById("registry").disabled = false;
	}
	var browser = GetWindowByType("navigator:browser");
	if (browser.document.getElementById("foxytunes-statusbar-panel")) {
		document.getElementById("foxytunes").disabled = false;
	}
	if (document.getElementById("mp3options").selectedIndex == 3) {
		SetBroadcaster("bc_textfile", false);
	}
	ShowFormatting();
}

function OkClicked() {
	dsPrefs.setIntPref("PicAlign", document.getElementById("picalign").value);
	dsPrefs.setBoolPref("UseCSS", document.getElementById("usecss").checked);
	dsPrefs.setBoolPref("RemoveMozAttrs", document.getElementById("removemozattrs").checked);
	dsPrefs.setBoolPref("AutoDetectMusic", document.getElementById("autodetectmusic").checked);
	dsPrefs.setBoolPref("SpellCheckOnPost", document.getElementById("spellcheckonpost").checked);
	dsPrefs.setBoolPref("SourceViewDefault", document.getElementById("sourceview").checked);
	dsPrefs.setIntPref("DetectMethod", document.getElementById("mp3options").value);
	dsPrefs.setCharPref("MP3InfoFile", document.getElementById("mp3path").value);
	dsPrefs.setCharPref("MP3Display", document.getElementById("mp3display").value);
	SaveStylesheet();
}
