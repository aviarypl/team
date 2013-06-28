    var prog = {
	'ver':	"1.5.0.7",
	'lang': "pl",
	'relPfx': "http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/",
	'getMac': function() { return this.relPfx + this.ver + "/mac/" + this.lang + "/Firefox%20" + this.ver + ".dmg"; },
	'getMacPPC': function() { return this.relPfx + this.ver + "/mac-ppc/" + this.lang + "/Firefox%20" + this.ver + ".dmg"; },
	'getWin': function() { return this.relPfx + this.ver + "/win32/" + this.lang + "/Firefox%20Setup%20" + this.ver + ".exe"},
	'getLin': function() { return this.relPfx + this.ver + "/linux-i686/" + this.lang + "/firefox-" + this.ver + ".tar.gz"},	
	'getLinLP': function() { return this.relPfx + this.ver + "/linux-i686/xpi/" + this.lang + ".xpi" },
	'getWinLP': function() { return this.relPfx + this.ver + "/win32/xpi/" + this.lang + ".xpi" },
	'getMacLP': function() { return this.relPfx + this.ver + "/mac/xpi/" + this.lang + ".xpi" },
	'getSrc' : function () { return this.relPfx + this.ver + "/source/firefox-" + this.ver + "-source.tar.bz2" },
	'getDetected' : function () {
	    var u = navigator.userAgent;
	    if (u.indexOf("Linux")>=0) {
		return this.getLin();
	    } else if (u.indexOf("Mac")>=0) {
		return this.getMac();
	    } else {
		return this.getWin();
	    }
	},
	'getDetectedLP': function () {
	    var u = navigator.userAgent;
	    if (u.indexOf("Linux")>=0) {
		return this.getLinLP();
	    } else if (u.indexOf("Mac")>=0) {
		return this.getMacLP();
	    } else {
		return this.getWinLP();
	    }
	},
	'getDnImg': function () {
	    var u = navigator.userAgent;
	    if (u.indexOf("Linux")>=0) {
		return "get-lin.jpg";
	    } else if (u.indexOf("Mac")>=0) {
		return "get-mac.jpg";
	    } else {
		return "get-win.jpg";
	    }
	}
    }

    function udb() {
	document.getElementById("dnA").href=prog.getDetected();
	document.getElementById("dnI").src="/img/"+prog.getDnImg();

	try { document.getElementById("vernum").innerHTML = prog.ver; } catch(e) {};
	try { document.getElementById("ad-w").href=prog.getWin(); } catch(e) {};
	try { document.getElementById("ad-l").href=prog.getLin(); } catch(e) {};
	try { document.getElementById("ad-mu").href=prog.getMac(); } catch(e) {};
	// try { document.getElementById("ad-mp").href=prog.getMacPPC(); } catch(e) {};
	
    }

    if (window.addEventListener) {
	window.addEventListener("load", udb, false);
    } else if (window.attachEvent) {
	window.attachEvent("onload", udb);
    }
