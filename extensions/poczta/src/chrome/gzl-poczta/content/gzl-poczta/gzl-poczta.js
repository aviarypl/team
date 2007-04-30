var GzlPoczta = {};

GzlPoczta.interval = 60000;
GzlPoczta.username="";
GzlPoczta.password="";

GzlPoczta.goToMailHome = function() {

  var webmailUrl = "http://poczta.gazeta.pl/";
  var myTab = getBrowser().addTab(webmailUrl, null, null);
  
  getBrowser().selectedTab = myTab;
  
}

GzlPoczta.retrieveMailCount = function() {

  var gBundle = Components.classes["@mozilla.org/intl/stringbundle;1"]
    .getService(Components.interfaces.nsIStringBundleService);

  var strings = gBundle.createBundle("chrome://gzl-poczta/locale/gzl-poczta.properties");

  var newMsgLabel = strings.GetStringFromName("newMessagesLabel");

  var serviceURL = "http://poczta.gazeta.pl/poczta/AviaryPL?username=" 
    + GzlPoczta.username + "&password=" + GzlPoczta.password;

  var req = new XMLHttpRequest();

  req.onreadystatechange = function() { 
    var sb = document.getElementById("gzlPocztaSB");
	
    if (req.readyState == 4 && req.status == 200) {
      var mailCount = req.responseXML
        .getElementsByTagName("nowe_maile")[0].firstChild.nodeValue;
      sb.setAttribute("label", newMsgLabel + " " + mailCount); 
    } 
	
  };

  req.overrideMimeType("text/xml");
  req.open("GET", serviceURL, true);
  req.send("");
	
}

GzlPoczta.runNotifier = function() { 

  var mailCount = 0;
	
  var p = new GzlPocztaPrefs();
  GzlPoczta.interval = p.getIntPref(p.PREF_INTERVAL);
  GzlPoczta.password = p.getCharPref(p.PREF_PASSWORD);
  GzlPoczta.username = p.getCharPref(p.PREF_USERNAME);

  if (GzlPoczta.username==null) {
    p.initPrefs();
  } 

  GzlPoczta.retrieveMailCount(); // pierwsze od razu

  setInterval(GzlPoczta.retrieveMailCount, GzlPoczta.interval); // reszta po delayu

}
