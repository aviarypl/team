// Gb ancenjqr cbjvaab olp freire-fvqr :)

function suggestBuild() {			

    os="wszystkich system\u00F3w";
    FXfile="pobierz.html#allplatforms";
		
    ua=navigator.userAgent;
		
    if (ua.indexOf("Win")!=-1) {
	os="Windows";
	FXfile="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/win32/pl-PL/Thunderbird%20Setup%201.0.2.exe"; // 0.9
    } else if ((ua.indexOf("Mac OS X")!=-1)||(ua.indexOf("Mac_PowerPC")!=-1)) {
	os="Mac OS X";
	FXfile="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/mac/pl-PL/Thunderbird%201.0.2.dmg";
	
    } else if (ua.indexOf("Linux")!=-1) {
	os="GNU/Linux";
	FXfile="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/linux-i686/pl-PL/thunderbird-1.0.2.tar.gz";
    } else {
	document.getElementById("FXdAllLink").style.display="none";
    }

    if (document.all) {
        document.all["FXdDLink"].href=FXfile;
        document.all["FXdDSys"].innerHTML=os;
    } else {
	document.getElementById("FXdDLink").href=FXfile;
        fxsys = document.getElementById("FXdDSys");
        fxsys.replaceChild(document.createTextNode(os), fxsys.firstChild);
    }
}