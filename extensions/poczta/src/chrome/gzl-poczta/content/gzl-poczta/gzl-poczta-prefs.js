function GzlPocztaPrefs(){
  this.prefBranch = null;

  // pref values
  this.PREF_USERNAME     = "gzl.poczta.username";
  this.PREF_PASSWORD	 = "gzl.poczta.password";
  this.PREF_INTERVAL	 = "gzl.poczta.interval";

}

GzlPocztaPrefs.prototype.getPrefBranch = function(){
  if (!this.prefBranch){ 
    this.prefBranch = Components.classes['@mozilla.org/preferences-service;1'].getService();
    this.prefBranch = this.prefBranch.QueryInterface(Components.interfaces.nsIPrefBranch);
  }

  return this.prefBranch;
}

GzlPocztaPrefs.prototype.setBoolPref = function(aName, aValue){
  this.getPrefBranch().setBoolPref(aName, aValue);
}

GzlPocztaPrefs.prototype.getBoolPref = function(aName){
  var rv = null;

  try{
    rv = this.getPrefBranch().getBoolPref(aName);
  } catch (e) {}

  return rv;
}

GzlPocztaPrefs.prototype.setIntPref = function(aName, aValue){
  this.getPrefBranch().setIntPref(aName, aValue);
}

GzlPocztaPrefs.prototype.getIntPref = function(aName){
  var rv = null;

  try{
    rv = this.getPrefBranch().getIntPref(aName);
  } catch (e){
  }

  return rv;
}

GzlPocztaPrefs.prototype.setCharPref = function(aName, aValue) {
  this.getPrefBranch().setCharPref(aName, aValue);
}

GzlPocztaPrefs.prototype.getCharPref = function(aName) {
  var rv = null;

  try{
    rv = this.getPrefBranch().getCharPref(aName);
  } catch (e){

  }

  return rv;
}

GzlPocztaPrefs.prototype.addObserver = function(aDomain, aFunction) {
  var myPrefs = this.getPrefBranch();
  var prefBranchInternal = myPrefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);

  if (prefBranchInternal)
    prefBranchInternal.addObserver(aDomain, aFunction, false);
}

GzlPocztaPrefs.prototype.removeObserver = function(aDomain, aFunction) {
  var myPrefs = this.getPrefBranch();
  var prefBranchInternal = myPrefs.QueryInterface(Components.interfaces.nsIPrefBranchInternal);

  if (prefBranchInternal)
    prefBranchInternal.removeObserver(aDomain, aFunction);
}

GzlPocztaPrefs.prototype.initPrefs = function() {
    var gPrompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
    	.getService(Components.interfaces.nsIPromptService);
    var gBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
        .getService(Components.interfaces.nsIStringBundleService);

    var strings = gBundle.createBundle("chrome://gzl-poczta/locale/gzl-poczta.properties");

    var username = {value: ""};
    var password = {value: ""};
    var ignored = {value: null};

    var promptTitle = strings.GetStringFromName("passwordPromptTitle");
    var promptText = strings.GetStringFromName("passwordPromptText");

    var result = false;

    while (!result)
        result = gPrompts.promptUsernameAndPassword(null, promptTitle, 
            promptText, username, password, null, ignored);

    this.initPref(this.PREF_USERNAME, "char", username.value);
    this.initPref(this.PREF_PASSWORD, "char", password.value);
    this.initPref(this.PREF_INTERVAL, "int", 60000);
}

GzlPocztaPrefs.prototype.initPref = function(aPrefName, aPrefType, aDefaultValue) {
  switch (aPrefType) {
    case "bool" :
      var prefExists = this.getBoolPref(aPrefName);
      if (prefExists == null)
        this.setBoolPref(aPrefName, aDefaultValue);
      break;

    case "int" :
      var prefExists = this.getIntPref(aPrefName);
      if (prefExists == null)
        this.setIntPref(aPrefName, aDefaultValue);
      break;

    case "char" :
      var prefExists = this.getCharPref(aPrefName);
      if (prefExists == null)
        this.setCharPref(aPrefName, aDefaultValue);
      break;
  }
}

