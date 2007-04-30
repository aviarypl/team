/*
    Performancing for Firefox Spell Check for Firefox 2.0beta1
    Author: Jed Brown (http://jedbrown.net/contact)
    
    A modified version of the JS from textbox.xml since editor's do not inherite spellchecking (why?)
    This spell checking code only works in Firefox 2.0b1 and not tested on anything later
    
    Nicked this from Performancing 1.3.5, as I gave up trying to figure it out myself. All hail the GPL! And Jed's mad skillz!
*/
var gSpelltest = null;
var gTheTabHTMLEditor;

function dsSpellCheck() {
    this.isFx2orGreater = false;
    this.prefs = null;
}

dsSpellCheck.prototype.init = function() {
	var midas = document.getElementById("message");
	gTheTabHTMLEditor = midas.getHTMLEditor(midas.contentWindow);
    var isFX2 = this.isFX2OrGreater();
    if(isFX2){
        var loader = Components.classes["@mozilla.org/moz/jssubscript-loader;1"].getService(Components.interfaces.mozIJSSubScriptLoader);
        loader.loadSubScript("chrome://global/content/inlineSpellCheckUI.js", this);
    }
}

dsSpellCheck.prototype.isFX2OrGreater = function() {
      var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                        .getService(Components.interfaces.nsIXULAppInfo);
      var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                                   .getService(Components.interfaces.nsIVersionComparator);
      if (versionChecker.compare(appInfo.version, "2.0") >= 0) {
        this.isFx2orGreater = true;
        return true;
      }else{
          this.isFx2orGreater = false;
	  if ((appInfo.ID == "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}") && ("@mozilla.org/spellchecker;1" in Components.classes)) {
		  document.getElementById("cmd_spell").removeAttribute("disabled");
	  }
      }
      return false;
}

dsSpellCheck.prototype.setupTextBoxSpellCheck = function() {
      try{
          this.init();
          if(this.isFx2orGreater){
              //Enable spellcheck for the source editor
              var theSourceInput = document.getElementById("messagesource");
              var theEditor = theSourceInput.inputField.QueryInterface(Components.interfaces.nsIDOMNSEditableElement).editor;
              this.InlineSpellCheckerUI.init(theEditor);
              
              this.InlineSpellCheckerUI.mEditor = theEditor;
              this.InlineSpellCheckerUI.mInlineSpellChecker = this.InlineSpellCheckerUI.mEditor.inlineSpellChecker;
              this.InlineSpellCheckerUI.enabled = true;
          }else{
              this._setNoSpellCheckingAllowed();
          }
      }catch(e){}
}

dsSpellCheck.prototype.setupEditorSpellCheck = function() {
    try{
          this.init();
          if(this.isFx2orGreater){
              //Enable spellcheck for the rich editor
              if( gTheTabHTMLEditor.isDocumentEditable ){
                  this.InlineSpellCheckerUI.mEditor = gTheTabHTMLEditor;
                  this.InlineSpellCheckerUI.mInlineSpellChecker = this.InlineSpellCheckerUI.mEditor.inlineSpellChecker;
                  this.InlineSpellCheckerUI.enabled = true;
              }
        }else{
            //Hide the menu stuff
            this._setNoSpellCheckingAllowed();
        }
    }catch(e){
    }
}


dsSpellCheck.prototype._delayedInitSpellCheck = function(popupNode){
    
}
    
dsSpellCheck.prototype._doPopupItemEnabling = function(popupNode){
    if(this.isFx2orGreater){
    // -- spell checking --

            // try to find the outer textbox for this box, don't search
            // up too far.
            gSpelltest = popupNode;
            /*
            var textboxElt = popupNode;
            for (var i = 0; i < 5; i ++) {
              if (textboxElt.localName == "editor")
                break;
              textboxElt = textboxElt.parentNode;
            }
            if (textboxElt.tagName != "editor") {
              // can't find it, give up
              this._setNoSpellCheckingAllowed();
              return;
            }
            */
            //var spellui = textboxElt.spellCheckerUI;
            var spellui = this.InlineSpellCheckerUI;
            this.spellui = spellui;

            if (! spellui.canSpellCheck)
            {
              this._setNoSpellCheckingAllowed();
              return;
            }
            
            spellui.initFromEvent(document.popupRangeParent, document.popupRangeOffset);

            var enabled = spellui.enabled;
            document.getElementById("spell-check-enabled").setAttribute("checked", enabled);

            var overMisspelling = spellui.overMisspelling;
            this._setMenuItemVisibility("spell-add-to-dictionary", overMisspelling);
            this._setMenuItemVisibility("spell-suggestions-separator", overMisspelling);

            // suggestion list
            var spellSeparator = document.getElementById("spell-suggestions-separator");
            var numsug = spellui.addSuggestionsToMenu(popupNode, spellSeparator, 5);
            this._setMenuItemVisibility("spell-no-suggestions", overMisspelling && numsug == 0);

            // dictionary list
            var dictmenu = document.getElementById("spell-dictionaries-menu");
            //var dictmenu = document.getElementById("spell-dictionaries");
            var numdicts = spellui.addDictionaryListToMenu(dictmenu, null);
            this._setMenuItemVisibility("spell-dictionaries", enabled && numdicts > 1);
    }
}

dsSpellCheck.prototype._doPopupItemDisabling = function(popupNode){
    if (this.isFx2orGreater && this.spellui) {
            this.spellui.clearSuggestionsFromMenu();
            this.spellui.clearDictionaryListFromMenu();
    }
}


dsSpellCheck.prototype._setMenuItemVisibility = function(anonid, visible){
    try{
        document.getElementById(anonid).hidden = !visible;
    }catch(e){}
}

dsSpellCheck.prototype._setNoSpellCheckingAllowed = function(){
    this._setMenuItemVisibility("spell-no-suggestions", false);
    this._setMenuItemVisibility("spell-check-enabled", false);
    this._setMenuItemVisibility("spell-check-separator", false);
    this._setMenuItemVisibility("spell-add-to-dictionary", false);
    this._setMenuItemVisibility("spell-suggestions-separator", false);
    this._setMenuItemVisibility("spell-dictionaries", false);
}

dsSpellCheck.prototype.addToDictionary = function(){
    try{
        this.spellui.addToDictionary();
    }catch(e){}
}

dsSpellCheck.prototype.toggleEnabled = function(ischecked){
    try{
        this.spellui.toggleEnabled();
	if (ischecked) {
		dsPrefs.setBoolPref("EnableSpellcheck", true);
	} else {
		dsPrefs.setBoolPref("EnableSpellcheck", false);
	}
    }catch(e){}
}

dsSpellCheck.prototype.spellCheckNow = function(){
    this.spellui.mInlineSpellChecker.enableRealTimeSpell = true;
}
dsSpellCheck.prototype.addDictionaries = function(){
    if(!this.prefs){
        this.prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    }
    
    var formatter = Components.classes["@mozilla.org/toolkit/URLFormatterService;1"].getService(Components.interfaces.nsIURLFormatter);
    var uri = formatter.formatURLPref("browser.dictionaries.download.url");
    
    var locale = "-";
    try {
      locale = this.prefs.getComplexValue("intl.accept_languages",
                             Components.interfaces.nsIPrefLocalizedString).data;
    }
    catch (e) { }
    
    var version = "-";
    try {
      version = Components.classes["@mozilla.org/xre/app-info;1"]
                         .getService(Components.interfaces.nsIXULAppInfo)
                         .version;
    }
    catch (e) { }
    
    uri = uri.replace(/%LOCALE%/, escape(locale));
    uri = uri.replace(/%VERSION%/, version);
    
    var newWindowPref = this.prefs.getIntPref("browser.link.open_newwindow");
    var where = newWindowPref == 3 ? "tab" : "window";
    
    openUILinkIn(uri, where);
}

dsSpellCheck.prototype.dummy = function(){
    //foo
}

function suiteSpellCheck() {
	// Quick hack-job so it'll work in SM with a minimal amount of code changing through the proggie.
	 var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
	 if ((appInfo.ID == "{92650c4d-4b8e-4d2a-b7eb-24ecf4f6b63a}") && ("@mozilla.org/spellchecker;1" in Components.classes))
	window.openDialog("chrome://editor/content/EdSpellCheck.xul", "_blank","chrome,close,titlebar,modal", false, false, true);
}
