/* This lot of code is half made up from Mozilla.org's Midas demo (http://www.mozilla.org/editor/midasdemo/)
   and Netscape DevEdge's demo of the control also (http://devedge.netscape.com/viewsource/2003/midas/01/).
   Bits have been changed here and there to get it to work the way I'm trying to implement it */
dsMidas = new Object();
var midasbundle = document.getElementById("midasbundle");
dsMidas.firstRun = true;

dsMidas.getStylesheetURL = function() {
	// This will return the file:// URL of the deepestsender.css file in the profile directory. Used to style the post editor.
	// If the file doesn't exist, it'll be created, then the function called again. Potential for an infinite loop if the profile directory
	//	is read-only.
	var DS = new Components.Constructor( "@mozilla.org/file/directory_service;1", "nsIProperties" );
	var myDirS = new DS( );
	var f = myDirS.get( "ProfD", Components.interfaces.nsIFile );
	f.append("deepestsender.css");
	var stylesheet = FileIO.open(f.path);
	if (stylesheet.exists()) {
		return Components.classes["@mozilla.org/network/protocol;1?name=file"].createInstance(Components.interfaces.nsIFileProtocolHandler).getURLSpecFromFile(f);
	} else {
		var cssfilecontents = "body {\n" +
				"	/* Add any styles you want here. */\n" +
				"}";
		FileIO.write(stylesheet, cssfilecontents);
		return dsMidas.getStylesheetURL();
	}
}

dsMidas.lookForBloggedPage = function() {
	var browserWindow = GetWindowByType("navigator:browser");
	if ((browserWindow) && (browserWindow.DeepestSender.addToPost) && (browserWindow.DeepestSender.addToPost.length > 0)) {
		var linkedstuff = "<a href=\"" + browserWindow.DeepestSender.addToPost[0] + "\">" + browserWindow.DeepestSender.addToPost[1] + "</a>";
		if (browserWindow.DeepestSender.addToPost[2]) {
			linkedstuff += ":<blockquote>" + browserWindow.DeepestSender.addToPost[2] + "</blockquote>";
		}
		this.syncSourceTab();
		document.getElementById("messagesource").value += linkedstuff;
		this.syncNormalTab();
		browserWindow.DeepestSender.addToPost = [];
	}
}

dsMidas.setUpMidas = function() {
	var toolbox = document.getElementById("formattingtoolbox");
	if (!isSidebar) {
		var toolkids = toolbox.childNodes.length;
		for (var i = 1; i < toolkids; i++) {
			var currentbar = toolbox.childNodes[1];
			for (var z = 0; z < currentbar.childNodes.length; z++) {
				toolbox.firstChild.appendChild(currentbar.childNodes[z].cloneNode(true));
			}
			toolbox.removeChild(currentbar);
		}
	}
	//this.dontautoformat = false;
	var midas = document.getElementById("message");
	var styleurl = this.getStylesheetURL();
	midas.contentDocument.getElementById("dspoststyle").setAttribute("href", styleurl);
	var winPreview = document.getElementById("preview-display");
	winPreview.contentDocument.getElementById("dspoststyle").setAttribute("href", styleurl);
	window.editorShell = midas.editorShell;

	this.sourceview = false;
	this.makeBlank();
	midas.makeEditable("html", false);
	this.midasEditor = midas.getHTMLEditor(midas.contentWindow);
	//setupSpellBound();
	
	this.sourceSpellCheck = new dsSpellCheck();
	this.richSpellCheck = new dsSpellCheck();
	this.sourceSpellCheck.setupTextBoxSpellCheck();
	this.richSpellCheck.setupEditorSpellCheck();
	this.theSpellcheck = this.richSpellCheck;
	
	if (!dsPrefs.getBoolPref("EnableSpellcheck")) {
		dsMidas.theSpellcheck.InlineSpellCheckerUI.mEditor.QueryInterface(Components.interfaces.nsIEditor_MOZILLA_1_8_BRANCH).setSpellcheckUserOverride(false);
	}
	
	if ((this.theSpellcheck.isFX2OrGreater()) && (this.firstRun)) {
		var toolsmenu = document.getElementById("dsmenu_tools_popup");
		toolsmenu.removeChild(toolsmenu.lastChild);
		toolsmenu.removeChild(toolsmenu.lastChild);
		var cmenu = document.getElementById("messagemenu");
		cmenu.removeChild(cmenu.lastChild);
		cmenu.removeChild(cmenu.lastChild);
		delete this.firstRun;
	}
	
	// You can't directly stick JavaScript in the blank.html file - it won't run at all. Have to create it dynamically.
	var head = winPreview.contentDocument.getElementsByTagName("HEAD")[0];
	var script = winPreview.contentWindow.document.createElement("script");
	script.setAttribute("type", "text/javascript");
	script.setAttribute("language", "JavaScript");
	var code =	"var hidecuts = \"inline\";\n" +
			"function ToggleLJCuts() {\n" +
			"	var elements = document.getElementsByTagName(\"*\");\n" +
			"	for (i = 0; i < elements.length; i++) {\n" +
			"		if (elements[i].getAttribute(\"class\") == \"ljcut\") {\n" +
			"			elements[i].style.display = hidecuts;\n" +
			"		}\n" +
			"	}\n" +
			"	if (hidecuts == \"none\") {\n" +
			"		hidecuts = \"inline\";\n" +
			"	} else {\n" +
			"		hidecuts = \"none\";\n" +
			"	}\n" +
			"}\n";
	script.innerHTML = code;
	head.appendChild(script);
	
	if (dsPrefs.getBoolPref("SourceViewDefault")) {
		this.sourceview = true;
		document.getElementById("messagetabbox").selectedIndex = 1;
		document.getElementById("messagesource").focus();
	} else {
		midas.contentWindow.focus();
	}
		
}
dsMidas.makeBlank = function() {
	// This is to blank out the iframe, for if a post has been sent succesfully or whatever.
	var midas = document.getElementById("message");
	midas.contentDocument.body.innerHTML = "<br />";
	document.getElementById("messagesource").value = "";
	if (document.getElementById("tabsource").selected) {
		document.getElementById("messagesource").focus();
	} else {
		midas.contentWindow.focus();
	}
	midas.contentDocument.designMode = "On";
	midas.contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
}

dsMidas.doRichEditCommand = function(aName, aArg) {
	var midas = document.getElementById("message");
	midas.contentDocument.execCommand(aName,false, aArg);
	midas.contentWindow.focus()
} 
dsMidas.addLink = function(){
	var midas = document.getElementById("message");
	var myUrl = prompt(midasbundle.getString("EnterURL"), "http://");
	if (myUrl != null && myUrl != "http://") {
		midas.contentDocument.execCommand("createLink", false, myUrl);
	}
}
dsMidas.addImage = function(alreadyimage) {
	var imagetag = [];
	
	if (alreadyimage) {
		imagetag[0] = alreadyimage.getAttribute("src");
		imagetag[1] = alreadyimage.getAttribute("width");
		imagetag[2] = alreadyimage.getAttribute("height");
		imagetag[3] = alreadyimage.getAttribute("alt");
		imagetag[4] = alreadyimage.getAttribute("border");
		imagetag[5] = alreadyimage.style.verticalAlign;;
		imagetag[6] = alreadyimage.style.float;
	}
	
	window.openDialog("chrome://deepestsender/content/lib/insertimage.xul","insertimage","chrome,modal",imagetag);
	if (imagetag[0]) {
		var midas = document.getElementById("message");
		var img = midas.contentWindow.document.createElement("img");
		if (imagetag[6]) {
			if (img.getAttribute("style")) {
				img.setAttribute("style", img.getAttribute("style") + " float: " + imagetag[6] + ";");
			} else {
				img.setAttribute("style", "float: " + imagetag[6] + ";");
			}
		}
		if (imagetag[5]) {
			if (img.getAttribute("style")) {
				img.setAttribute("style", img.getAttribute("style") + " vertical-align: " + imagetag[5] + ";");
			} else {
				img.setAttribute("style", "vertical-align: " + imagetag[5] + ";");
			}
		}
		if (imagetag[4]) {
			img.setAttribute("border",imagetag[4]);
		}
		if (imagetag[3]) {
			img.setAttribute("alt",imagetag[3]);
		} else {
			img.setAttribute("alt","");
		}
		if (imagetag[2]) {
			img.setAttribute("height",imagetag[2]);
		}
		if (imagetag[1]) {
			img.setAttribute("width",imagetag[1]);
		}
		img.setAttribute("ondblclick","parent.dsMidas.addImage(this);");
		img.setAttribute("src",imagetag[0]);
		this.insertNodeAtSelection(midas.contentWindow, img);
		this.placeCaret(midas, img.nextSibling);
	}
}

dsMidas.insertNodeAtSelection =function(win, insertNode, type) {//type = before, after null
    // get current selection
    var sel = win.getSelection();
    //alert("sel: "+ sel + " sel.getRangeAt(0): " + sel.getRangeAt(0));

    // get the first range of the selection
    // (there's almost always only one range)
    var range = sel.getRangeAt(0);

    // deselect everything
    sel.removeAllRanges();

    // remove content of current selection from document
    //var clone = null;
    if(type == null){
        range.deleteContents();
    }

    // get location of current selection
    var container = range.startContainer;
    var pos = range.startOffset;
    if(type == "after"){
        container = range.endContainer;
        pos = range.endOffset;
    }

    // make a new range for the new selection
    range=document.createRange();

    if (container.nodeType==3 && insertNode.nodeType==3) {
        // if we insert text in a textnode, do optimized insertion
        container.insertData(pos, insertNode.nodeValue);

        // put cursor after inserted text
        range.setEnd(container, pos+insertNode.length);
        range.setStart(container, pos+insertNode.length);
    } else {
        var afterNode;
        if (container.nodeType==3) {
            // when inserting into a textnode
            // we create 2 new textnodes
            // and put the insertNode in between
            var textNode = container;
            container = textNode.parentNode;
            var text = textNode.nodeValue;

            // text before the split
            var textBefore = text.substr(0,pos);
            // text after the split
            var textAfter = text.substr(pos);

            var beforeNode = document.createTextNode(textBefore);
            var afterNode = document.createTextNode(textAfter);

            // insert the 3 new nodes before the old one
            container.insertBefore(afterNode, textNode);
            container.insertBefore(insertNode, afterNode);
            container.insertBefore(beforeNode, insertNode);

            // remove the old node
            container.removeChild(textNode);
        } else {
            // else simply insert the node
            afterNode = container.childNodes[pos];
            container.insertBefore(insertNode, afterNode);
        }
        range.setEnd(afterNode, 0);
        range.setStart(afterNode, 0);
    }

    sel.addRange(range);
}

//Places the caret inside and at the beginning of the node specified
dsMidas.placeCaret = function(win, node) {
	var sel = win.contentWindow.getSelection();
	var range = sel.getRangeAt(0);
	sel.removeAllRanges();
	range=document.createRange();
	range.setEnd(node, 0);
	range.setStart(node, 0);
	sel.addRange(range);
	win.contentWindow.focus();
}
//For generic XHTML compliance
dsMidas.getXHTML = function(text) {
	//Fix closing tags on single elements
	//text = text.replace(/<(br|hr|img|input|col|link|meta|param)(.*?)(\/?)>/gi, "<$1$2 $3>");
	//text = text.replace(/<(br|hr|img|input|col|link|meta|param)([^>]*)([^\/])>/gi, "<$1$2$3 />");
	text = text.replace(/<(br|hr|img|input|col|link|meta|param)([^>]*[^\/]|)>/gi, "<$1$2 />");
	//Remove extra space in case it was formatted as <br > - not a big deal
	text = text.replace(/<(br|hr|img|input|col|link|meta|param)(.*?)\s*?\/>/gi, "<$1$2 />");
	//Add space if it is <br style=""/> at this point
	//text = text.replace(/<(br|hr|img|input|col|link|meta|param)([^>]*)"\/>/gi, "<$1$2\" />");
	
	if (dsPrefs.getBoolPref("RemoveMozAttrs")) {
		//remove moz specific styles... this might need to be a little more specifc in checking
		text = text.replace(/[ ]*-moz-[^;]*;/gi, "");
	}
	return text.trim();
}

//Simple function used when Post Options or Post is clicked - keeps the logic out of SyncSourceTab where it would complicate things a little
dsMidas.updateSourceTab = function() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		this.syncSourceTab();
	}
}
// Source -> Normal (note: DOM is NOT compliant at this point)
// 1) The value of the Source tab's textbox is stored in a variable and modified using RegExp's to make it DOM compliant and any other formating that should be done at this time.
// 2) The innerHTML of the Preview tab's frame is replaced with the value from the variable.
// 3) Any DOM modifications that are needed for the Normal tab are made to the Preview tab's frame.
// 4) The innerHTML of the Normal tab's editor is replaced with the innerHTML from the Preview tab's frame.
// (note: Preview handles adding the subject and just about everything else is taken from the Normal tab
dsMidas.syncNormalTab = function() {
	//***Begin RegExp phase***
	var text = document.getElementById("messagesource").value;
	if (!this.dontautoformat) {
		//When leaving source view we only use the DS specific classes for br's when "Don't auto-format" is NOT checked.
		text = text.replace(/(\r)?\n/gi, "<br class=\"DS_newline\" />");
		text = text.replace(/<br( \/)?>/gi, "<br class=\"DS_br\" />");
	}

	//For generic XHTML compliance whether the user wants them or not?
	text = this.getXHTML(text);
	if (!document.getElementById("ljbuttons").collapsed) {
		text = this.fixLJTags(text, true);
	}
	text = text.replace(/<strong>(.*?)<\/strong>/gi, "<b>$1</b>");
	text = text.replace(/<em>(.*?)<\/em>/gi, "<i>$1</i>");
	text = text.replace(/<img /gi, "<img ondblclick=\"parent.dsMidas.addImage(this);\" ");
	//text = text.replace(/<span style="text-decoration: underline;">(.*?)<\/span>/gi, "<u>$1</span>");
	
	//***End RegExp phase***
	try{
		//***Begin DOM phase***
		var winNormal = document.getElementById("message");
	
		//while (winNormal.contentDocument.body.childNodes.length > 0) winNormal.contentDocument.body.removeChild(winNormal.contentDocument.body.lastChild);
		
	//***End DOM phase***
		if (text.length < 1) text = "<br />";
		winNormal.contentWindow.document.body.innerHTML = text;
		winNormal.contentDocument.makeEditable("html", false);
		winNormal.contentDocument.designMode = "On";
		winNormal.contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
		winNormal.contentWindow.focus();
	}catch(e){
		//Foo
   	}
	
}
// Normal -> Source (note: DOM is compliant at this point)
// 1) The innerHTML in the Preview tab's frame is replaced with the innerHTML from the Normal tab's editor.
// 2) Any DOM modifications that are needed for the Source tab are made to the Preview tab's frame.
// 3) The innerHTML of the Preview tab's frame is then stored in a variable and further modified using RegExp's.
// 4) The value of the Source tab's textbox is then replaced with the contents of the variable.
dsMidas.syncSourceTab = function() {
	//***Begin DOM phase***
	var winNormal = document.getElementById("message");
	var winPreview = document.getElementById("preview-display");
	winPreview.contentDocument.body.innerHTML = winNormal.contentDocument.body.innerHTML;
	//this.cleanup();
	var text = winPreview.contentDocument.body.innerHTML;
	//***End DOM phase***
	//***Begin RegExp phase***
	//replace 0 or 1 newline followed by a br followed by 0 or 1 newline with a formatted br
	text = text.replace(/<br([^>]*)>[\r\f]?\n/gi, "<br$1 />");
	text = text.replace(/[\r\f]\n? ?/gi, " ");
	text = text.replace(/\n ?/gi, " ");
	//remove all br's at the end of the string. The editor usually adds at least one.
	text = text.replace(/<br( \/)?>$/gi, "");
	if (!this.dontautoformat) {
		//Replace any new br's entered in the message tab with newlines
		text = text.replace(/<br( \/)?>/gi,"\n");
		//DS_newline's will get cleaned up as appropriate when "Don't auto-format" is check or unchecked.
		text = text.replace(/<br class="DS_newline"( \/)?>/gi, "\n");
		//DS_br's are manually entered br's in the source textbox
		text = text.replace(/<br class="DS_br"( \/)?>/gi, "<br />");
	} else {
		text = text.replace(/<br( class="DS_(newline|br)")?( \/)?>/gi, "<br />\n");
	}
	if (!document.getElementById("ljbuttons").collapsed) {
		text = this.fixLJTags(text, false);
	}

	//For generic XHTML compliance whether the user wants them or not?
	text = this.getXHTML(text);
	text = text.replace(/<b>(.*?)<\/b>/gi, "<strong>$1</strong>");
	text = text.replace(/<i>(.*?)<\/i>/gi, "<em>$1</em>");
	text = text.replace(/ ondblclick="parent.dsMidas.addImage\(this\);"/gi, "");
	// The underling one needs more work. What if the <u> tag had a style added? Then it'd create two style attributes. Or what if an underlined span
	// was created with some other attributes, then U was clicked on in the Normal view? Boom!
	// Ugh. I give up.
	//text = text.replace(/<u>(.*?)<\/u>/gi, "<span style=\"text-decoration: underline;\">$1</span>");
	
	//***End RegExp phase***
	document.getElementById("messagesource").value = text;
}
dsMidas.viewTab = function(tabname) {
	// To move between textbox and iframe. The 'this.sourceview' thing is to stop it blanking the post if you click
	// the same tab that you're already on. (ie. if you're in source view and click the 'source' tab)
	var tabbox = document.getElementById("messagetabbox"); 

	if (tabbox.selectedIndex == 0 && this.sourceview) {
		this.syncNormalTab();
		this.theSpellcheck = this.richSpellCheck;
//This is still buggy
//		placeCaret(document.getElementById("message"), document.getElementById("message").contentWindow.document.body.lastChild);
		document.getElementById("message").contentWindow.focus();
		this.sourceview = false;
	} else if (tabbox.selectedIndex == 1 && !this.sourceview) {
		this.syncSourceTab();
		this.theSpellcheck = this.sourceSpellCheck;
		document.getElementById("messagesource").setSelectionRange(document.getElementById("messagesource").textLength, document.getElementById("messagesource").textLength);
		document.getElementById("messagesource").focus();
		this.sourceview = true;
	} else if (tabbox.selectedIndex == 2) {
		if (this.sourceview == true) {
			this.syncNormalTab();
		} else {
			this.syncSourceTab();
		}
		this.previewPost();
	}
}

//Simple function for updating the subject in the Preview tab
dsMidas.updatePreview = function() {
	if (document.getElementById("messagetabbox").selectedIndex == 2) {
		this.previewPost();
	}
}
// Say welcome back to the Preview function, originally written by Jed Brown ( http://extensionroom.mozdev.org/members/Jed/ ); and is a rather excellent addition. Thanks Jed!
dsMidas.previewPost = function() {
	var winNormal = document.getElementById("message");
	var winPreview = document.getElementById("preview-display");
	//Always use Normal tab for this since it is almost completely formatted for this already... yes, it is read twice when coming from the source tab
	var copiedToPreview = winNormal.contentWindow.document.body.innerHTML + "\n"; //to avoid removing the last line which might not end in a newline?
	var subjectPreview = document.getElementById("subject").value;
	
	if (!document.getElementById("ljbuttons").collapsed) {
		var domain = FindDomain(LiveJournal.posturl);
		var ljusers = domain + "users/";
		var ljcomms = domain + "community/";
		copiedToPreview = copiedToPreview.replace(/<span class="ljuser">([^<]*?)<\/span>/gi, "<a href=\"" + ljusers + "$1\" target=\"_blank\"><span class=\"ljuser\">$1</span></a>");
		copiedToPreview = copiedToPreview.replace(/<span class="ljcomm">([^<]*?)<\/span>/gi, "<a href=\"" + ljcomms + "$1\" target=\"_blank\"><span class=\"ljcomm\">$1</span></a>");
		copiedToPreview = copiedToPreview.replace(/&lt;lj-cut&gt;(.*?)&lt;\/lj-cut&gt;/gi, "<b>( <a href=\"javascript:ToggleLJCuts();\">Read more...</a> )</b> <span class=\"ljcut\" style=\"display: none\">$1</span>");
		copiedToPreview = copiedToPreview.replace(/&lt;lj-cut *?text="([^"]*?)"&gt;(.*?)&lt;\/lj-cut&gt;/gi, "<b>( <a href=\"javascript:ToggleLJCuts();\">$1</a> )</b> <span class=\"ljcut\" style=\"display: none\">$2</span>");
		
	}
	if (subjectPreview) {
		copiedToPreview = "<strong>"+ subjectPreview + ":</strong><br><br>" + copiedToPreview;
	}
	winPreview.contentDocument.body.innerHTML = copiedToPreview;
}
dsMidas.printWindow = function() {
	messagebox = document.getElementById("message");
	// Bad idea, creates reliance on subject box!!
	this.syncNormalTab();
	messagebox.contentDocument.title = document.getElementById("subject").value;
	messagebox.contentWindow.print();
}
dsMidas.fixLJTags = function(ljtext, toents) {
	// still needs other LJ-Tag support but it is a start
	// in source view.
	if (toents) {
		ljtext = ljtext.replace(/<lj *?user="([^"]*?)">/gi, "<span class=\"ljuser\">$1</span>");
		ljtext = ljtext.replace(/<lj *?comm="([^"]*?)">/gi, "<span class=\"ljcomm\">$1</span>");
		ljtext = ljtext.replace(/<(\/?lj[^>]*?)>/gi, "&lt;$1&gt;");
	} else {
		ljtext = ljtext.replace(/<span class="ljuser">([^<]*?)<\/span>/gi, "<lj user\=\"$1\">");
		ljtext = ljtext.replace(/<span class="ljcomm">([^<]*?)<\/span>/gi, "<lj comm\=\"$1\">");
		ljtext = ljtext.replace(/&lt;(\/?lj[^>]*?)&gt;/gi, "<$1>");
	}
	return ljtext;
}
