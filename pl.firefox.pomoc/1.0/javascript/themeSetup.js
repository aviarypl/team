// Functions needed for an XPI install
// Simplified version of Chris Cooks' install script

function doneFn(name,result) {}

function isValidUa() {
  // Returns true if script is run in the Firefox browser
  var ua = navigator.userAgent.toLowerCase();
  return ((ua.indexOf('firebird')!=-1 || ua.indexOf('firefox') !=-1) && ua.indexOf('gecko')!=-1);
} 
  
function doXPIInstall(file,name) {
  if(!isValidUa()) {
  	alert('Ten schemat nie jest obsługiwany przez Twoją przeglądarkę.');
  	return false;
  }
  var xpi = new Object();
  xpi[name] = file;
  InstallTrigger.install(xpi,doneFn);
}


// Functions needed for JAR install
// Author: Alan Starr 20021210
function installTheme(where) {
  var file = '';
  if (where == 'local') {
    file = 'file:///' + escape(document.getElementById('filename').value.replace(/\\/g,'/'));
  } else {
    file = document.getElementById('url').value;
  }
    InstallTrigger.installChrome(InstallTrigger.SKIN, file, getName(file));
}

// Finds the name of the theme from the filename
function getName(raw) {
  var grabFileStart = raw.lastIndexOf('/');
  var grabFileEnd = raw.lastIndexOf('.');
  if (grabFileStart >= grabFileEnd) {
    return 'Nieprawidłowa nazwa pliku';
  } else {
    return raw.substring(grabFileStart + 1,grabFileEnd);
  }
}

function installThemeNow(file) {
// used in the hrefs 
  var extStart = file.lastIndexOf('.');
  var fileType = file.substring(extStart, file.length).toLowerCase();
  if (fileType == 'xpi') {
    doXPIInstall(file, getName(file));
  } else {
    InstallTrigger.installChrome(InstallTrigger.SKIN, file, getName(file));
  }
  return true;
}

function theme(themeName) {
  this.name = themeName;
  this.author = new Array();
  this.authorEmail = new Array();
  this.description = '';
  this.preview = ''; 
  this.homepage = '';
  this.version = '';
  this.updated = '';
  this.size = '';
  this.installFile = '';
}
var themeArray = new Array();



function getThemeVersion() { 
  // get the theme version of gecko... only list compatible themes
  var FBver = navigator.vendorSub.split(' ')[0];
  var FBbuild =
navigator.userAgent.split('Gecko/')[1].substring(0,8);
  if ( (FBver == '0.6.1+') || 
       (FBver == '0.7')    || 
       ((FBver == '0.7+') && ( FBbuild < '20031120'))
) {  
    return '1.5';
  } else if ( (FBver == '0.7+'  ) || 
              (FBver == '0.8'   ) ||
              (FBver == '0.8.0' ) ||
              (FBver == '0.8.0+') ||
              (FBver == '0.8+'  )    ) {
    return '1.6';
  } else {
    return '0.0';  // Anything else will be fully incompat
  }
}
 

function getThemeCount() {
  var themeVer = getThemeVersion();
  if (themeVer == '1.2' ) {
    document.write(counter12);
  } else if (themeVer == '1.5' ) {
    document.write(counter15);
  } else if (themeVer == '1.6' ) {
    document.write(counter16);
  } else {
    document.write(0);
  }
  return true;
}





function makeThemeGrid(letterStart, letterTo) {
	if (letterStart == letterTo) {
		letterStart = ' '; letterTo = 'Ý';
	}
	var skinVer = getThemeVersion();

  if (themeArray.length == 0) {
    document.write('<p><strong>Albo nastąpił techniczny problem z serwerem <a href="http://mozdev.org/">mozdev.org</a>, albo nastąpił inny <a href="javascript:">błąd JavaScriptu</a>.</strong></p>');
  }

  for (var i = 0; i < themeArray.length; i++) {
    if (themeArray[i].name.substring(0,1).toUpperCase() >= letterStart && themeArray[i].name.substring(0,1).toUpperCase() <= letterTo) {
	    if (themeArray[i].skinVer == skinVer) {
		    document.write('<div');
		    if (checkDateWindow(themeArray[i].updated)) { 
		    	document.write(' class="updated"');
		    }
		    document.write('>\n<a href="#' + escape(themeArray[i].name) + '">');
		    // make sure the grid doesn't break because of name length...
		    if (themeArray[i].name.length > 20) {
		    	document.write(themeArray[i].name.substring(0,17) + '...');
		    }
		    else {
		    	document.write(themeArray[i].name);
		    }
		    document.write('<br /><img src="' + themeArray[i].preview + '" alt="" title="Podgląd schametu ' + themeArray[i].name);
		    if (checkDateWindow(themeArray[i].updated)) { 
		    	document.write('(Schemat niedawno zaktualizowany!)');
		    }
		    	document.write('" /></a></div>');
			}
		}
	}
}

function listThemes(letterStart, letterTo) {
	/* */
	if (letterStart == letterTo) {
		letterStart = ' '; letterTo = 'Ý';
	}
	var skinVer = getThemeVersion();

  for (var i = 0; i < themeArray.length; i++) { 
    if (themeArray[i].name.substring(0,1).toUpperCase() >= letterStart && themeArray[i].name.substring(0,1).toUpperCase() <= letterTo) {
	    if (themeArray[i].skinVer == skinVer) {
		
		    document.write('<a name="' + themeArray[i].name + '"></a><div class="theme">\n<img class="screenshot" src="' + themeArray[i].preview
		    + '" alt="" title="Zrzut ekranu schematu ' + themeArray[i].name + '" /><p class="info"><strong>' + themeArray[i].name + '</strong>, autor: ');
		    for (var j=0; j < themeArray[i].author.length; j++) {
		      if (j > 0 && themeArray[i].author.length > 1 ) {
		        document.write(', ');
		      }
		      if (themeArray[i].authorEmail[j] != '') {
		        document.write('<a href="mailto:' + themeArray[i].authorEmail[j] + '">');
		      }
		      document.write(themeArray[i].author[j]);
		      if (themeArray[i].authorEmail[j] != '') {
		        document.write('</a>');
		      }
		    }
		    
		    document.write('<br />Wersja ' + themeArray[i].version + ', ');
		    if (checkDateWindow(themeArray[i].updated)) {
		    	document.write('<span class="updated">');
		    }
		    document.write('aktualizowany ' + themeArray[i].updated);
		    if (checkDateWindow(themeArray[i].updated)) {
		    	document.write('</span>');
		    }
		    document.write('<br /><a class="install" href="' + themeArray[i].installFile + '" onclick="installThemeNow(\'' + themeArray[i].installFile
		     + '\'); return false;" title="Kliknij lewym przyciskiem by zainstalować albo prawym by pobrać schemat">Zainstaluj</a> (' + themeArray[i].size + ' KB)<br />');
		    if (themeArray[i].homepage != '') {
		      document.write('<a class="homepage" href="' + themeArray[i].homepage + '" title="Odwiedź stronę domową">Strona domowa</a>');
		    }
		    else {
		      document.write('Strona domowa schematu niedostepna.');
		    }
		    document.write('</p><p class="desc">' + themeArray[i].description + '</p></div><p class="toplink"><a href="#">Skocz na górę</a></p>\n\n');
		}
	  }
	}
}

function checkDateWindow(dateString) { // Input string of yyyy-mm-dd
  var newDaysWindow = 7 * (1000 * 60 * 60 * 24); // Only new for 7 days
  var dateArray = dateString.split('-');
  var newDate = (new Date( dateArray[0], dateArray[1] - 1, dateArray[2])).valueOf() + newDaysWindow;
  return ( newDate > (new Date()).valueOf() );
}






