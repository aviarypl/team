// Functions needed for an XPI install
// Simplified version of Chris Cooks' install script

function doneFn(name,result) {}

function isValidUa() {
  // Returns true if script is run in the Firefox browser
  var ua=navigator.userAgent.toLowerCase();
  return (ua.indexOf('firebird')!=-1 || ua.indexOf('phoenix')!=-1) &&
          ua.indexOf('gecko')!=-1;
} 

function doXPIInstall(file,name) {
  if(!isValidUa()) {
  	alert('This extension is not supported by your browser. Your user agent string is:\n\n' + navigator.userAgent);
  	return false;
  }
  var xpi = new Object();
  xpi[name] = file;
  InstallTrigger.install(xpi,doneFn);
}

function checkDateWindow(dateString) { // Input string of yyyy-mm-dd
  var newDaysWindow = 7 * (1000 * 60 * 60 * 24); // Only new for 7 days
  var dateArray = dateString.split('-');
  var newDate = (new Date( dateArray[0], dateArray[1] - 1, dateArray[2])).valueOf() + newDaysWindow;
  return ( newDate > (new Date()).valueOf() );
}

function checkDateWindow(dateString) { // Input string of yyyy-mm-dd
  var newDaysWindow = 7 * (1000 * 60 * 60 * 24); // Only new for 7 days
  var dateArray = dateString.split('-');
  var newDate = (new Date( dateArray[0], dateArray[1] - 1, dateArray[2])).valueOf() + newDaysWindow;
  return ( newDate > (new Date()).valueOf() );
}

function Extension(extensionName, author, email, shortdesc, longdesc, homepage, version, updated, size, install) {
  this.name = extensionName;
  this.author = new Array();
  this.author = author;
  this.authorEmail = new Array();
  this.authorEmail = email;
  this.shortdesc = shortdesc;
  this.description = longdesc;
  this.homepage = homepage;
  this.updated = updated;
  this.size = size;
  this.installFile = install;
}
var extensionArray = new Array();

function makeExtensionGrid() {
  if (extensionArray.length == 0) {
    document.write('<p><strong>Either <a href="http://mozdev.org/">mozdev.org</a> is down or a <a href="javascript:">JavaScript Error</a> has occurred.</strong></p>');
  }
  document.write('<div class="grid"><p>There are currently ' + extensionArray.length + ' extensions available here. <span class="updated">Highlighted extensions</span> have been recently updated.</p>');
  for (var i = 0; i < extensionArray.length; i++) {
    document.write('<div');
    if (checkDateWindow(extensionArray[i].updated))
        // extension has been updated within the last 7 days
        document.write(' class="updated"');
    document.write('><a href="#' + escape(extensionArray[i].name) + '" title="' + extensionArray[i].shortdesc + '">'
     + extensionArray[i].name + '</a></div>');
  }
  document.write('</div>');
}

function listExtensions() {
  for (var i = 0; i < extensionArray.length; i++) {

    document.write('<div class="extension"><h3><a name="' + escape(extensionArray[i].name) + '"></a><a href="#' + escape(extensionArray[i].name) +  '">' + extensionArray[i].name + '</a></h3>');
	document.write('<div class="author">by ');
    for (var j=0; j < extensionArray[i].author.length; j++) {
      if (j > 0 && extensionArray[i].author.length > 1 ) {
        document.write(', ');
      }
      if (extensionArray[i].authorEmail[j] != '') {
        document.write('<a href="mailto:' + extensionArray[i].authorEmail[j] + '">');
      }
      document.write(extensionArray[i].author[j]);
      if (extensionArray[i].authorEmail[j] != '') {
        document.write('</a>');
      }
    }
	
	
	
	document.write('</div><div class="info">Version: ' + extensionArray[i].version + '<br />File Size: ' + extensionArray[i].size + ' KB<br />')
	if (checkDateWindow(extensionArray[i].updated))
		document.write('<span class="updated">Updated: ' + extensionArray[i].updated + '</span></div>');
	else
		document.write('Updated: ' + extensionArray[i].updated + '</div>');
	
	document.write('<div class="desc">' + extensionArray[i].description + '</div><div class="links">');
	if (extensionArray[i].installFile != '') {
	    document.write('<a class="install" href="' + extensionArray[i].installFile + '" onclick="doXPIInstall(\'' + extensionArray[i].installFile + '\', \'' + extensionArray[i].name +  '\'); return false;">Install</a>');
	}
	else {
		document.write('This extension isn\'t installable');
	}


    document.write(' | ');
    if (extensionArray[i].homepage != '') {
      document.write('<a class="homepage" href="' + extensionArray[i].homepage + '">Visit Homepage</a>');
    }
    else {
      document.write('Homepage not available');
    }
    document.write('</div></div><p class="toplink"><a href="#">Back to Top</a></p>\n\n');
  }
}







