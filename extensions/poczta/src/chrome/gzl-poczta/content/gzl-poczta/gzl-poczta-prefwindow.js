function GzlPoczta_setupPrefWindow() {
  var p = new GzlPocztaPrefs();
  // var interval = p.getIntPref(p.PREF_INTERVAL);
  var password = p.getCharPref(p.PREF_PASSWORD);
  var username = p.getCharPref(p.PREF_USERNAME);

  document.getElementById("gzlUsername").setAttribute("value", username);
  document.getElementById("gzlPass").setAttribute("value", password);

}

function GzlPoczta_acceptPrefWindow() {
  var password = document.getElementById("gzlPass").value;
  var username = document.getElementById("gzlUsername").value;

  var p = new GzlPocztaPrefs();

  p.setCharPref(p.PREF_PASSWORD, password);
  p.setCharPref(p.PREF_USERNAME, username);

}
