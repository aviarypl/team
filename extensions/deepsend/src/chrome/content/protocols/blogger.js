blogger = new Object();
// Now using GData/Atom for Blogger. For some reason I've had an epiphany with OO code recently, so hopefully Atom will be much nicer this time around.

var commonbundle = document.getElementById("commonbundle");

blogger.startLogin = function(captcha) {
	this.username = dsAccounts.username;
	this.password = dsAccounts.password;
	this.posturl = dsAccounts.posturl;
	
	this.dontautoformat = !GetTag(dsAccounts.currentaccount, "accounttype").getAttribute("autoformat");
	// Can get this from the homepage, but according to the GData specs, it's always homepage + the following, so might as well define it here.
	//	I wonder what happens if they choose not to allow feeds on their page. Does this URL still exist? I bet the genuises at Blogger
	//	never thought of that.
	this.feedsURL = this.posturl + "/feeds/posts/default";
	
	this.httpreq = new blogger.BloggerRequest(this.posturl, "GET", Login);
	this.httpreq.onload = this.loginHandler;
	this.httpreq.onerror = function() {
		alert(commonbundle.getString("ErrorConnecting"));
		Login();
	}
	this.httpreq.send(null);
}

blogger.loginHandler = function() {
	if (dsAccounts.loggingin) {
		if (blogger.httpreq.request.status === 200) {
			var homepage = blogger.httpreq.request.responseText;
			// Oh my God, this is ridiculous. Clearly Atom is teh way of teh futare!!1 *rolleyes*
			// See, the idea is that the user's homepage has a <link rel="service.post"/> tag in it somewhere, so that's how you get the URL
			//	to post to. The problem is, you need to parse the homepage to find it. Which would be all good if Blogger created valid
			//	XHTML pages, but they don't, because they're idiots (using & in comments... idiots), which means it'll error if you
			//	feed everything through an XML parser. Which means we have to do it with fucking regular expressions. Morons.
			blogger.title = homepage.match(/<title[^>]?>([^<]+)/)[1];
			var findlink = new RegExp("<link*[^>]*>","g");
			var links = [];
			for(;;){
				var link = findlink.exec(homepage);
				if (link) {
					try {
						var linkdoc = new XML("<links>" + link + "</links>");
						if((linkdoc.link.@rel == "service.post") && (linkdoc.link.@type == "application/atom+xml")) {
							blogger.atomPostURL = linkdoc.link.@href;
							break;
						}
						/*if((linkdoc.link.@rel == "alternate") && (linkdoc.link.@type == "application/atom+xml")) {
							blogger.feedsURL = linkdoc.link.@href;
							break;
						}*/
					} catch(e){}
				} else {
					alert("Didn't find any Atom posting links! Can't continue!");
					Login();
					return;
				}
			}
			document.getElementById("dsPostFrame").setAttribute("src", "protocols/blogger/blogger.xul");
			FinaliseLogin(blogger);
		} else {
			alert(blogger.httpreq.request.responseText);
			Login();
		}
	}
}

blogger.loginStuff = {};

// Holy crap, I wonder if there is any chance in hell this will work.
blogger.BloggerRequest = function(url, type, cancel, captcha) {
	this.url = url;
	this.request = new XMLHttpRequest();
	var _this = this;
	this.request.onload = function() {
		_this.onload();
	};
	this.request.onerror = function() {
		_this.onerror();
	}
	this.send = function(body) {
		this.body = body;
		if (!blogger.loginStuff["Auth"]) {
			
			// Hellacious login/post Blogger function, similar to that insane one I wrote for LJ.
			var login = {
				Email: blogger.username,
				Passwd: blogger.password,
				service: "blogger",
				source: "DavidMurray-DeepestSender-" + AppVersion
			}
			
			if (captcha) {
				login.logintoken = blogger.loginStuff["CaptchaToken"];
				login.logincaptcha = blogger.loginStuff["solved"];
			}
			
			this.loginreq = new XMLHttpRequest();
			this.loginreq.onload = function() {
				//this is where the proper post (ie. non-login) code goes
				var response = {};
				var result = _this.loginreq.responseText.split("\n");
				for (var i = 0; i < result.length; i++) {
					var split = result[i].split("=");
					response[split[0]] = split[1];
				}
				blogger.loginStuff = response;
				if (response["Error"]) {
					switch (response["Error"]) {
						case "CaptchaRequired":
							window.openDialog("protocols/blogger/captcha.xul","dscaptcha","chrome,modal", blogger.loginStuff);
							if (blogger.loginStuff.solved) {
								// Redo everything with the solved captcha
								_this = new blogger.BloggerRequest(url, cancel, true);
								//blogger.startLogin(true);
							} else {
								delete blogger.loginStuff();
								if (cancel) cancel();
							}
							break;
						default:
							alert(commonbundle.getString("ErrorRequest") + " " + response["Error"]);
							if (cancel) cancel();
							break;
					}
				} else if (result.length > 0) {
					// Huzzah, we're all good.
					_this.request.setRequestHeader("Authorization", "GoogleLogin auth=" + blogger.loginStuff["Auth"]);
					switch (type) {
						case "POST":
						case "PUT":
							_this.request.setRequestHeader("Content-Type", "application/atom+xml");
						break;
					}
					_this.request.send(_this.body);
					
				} else {
					alert(commonbundle.getString("ErrorRequest") + " " + blogger.httpreq.responseText);
					delete blogger.loginStuff;
					if (cancel) cancel();
				}
				
			}
			this.loginreq.onerror = function() {
				alert(commonbundle.getString("ErrorConnecting"));
				if (cancel) cancel();
			}
			
			var params = "accountType=HOSTED_OR_GOOGLE";
			for (z in login) {
				params += "&" + z + "=" + encodeURIComponent(login[z]);
			}
			this.loginreq.open("POST", "https://www.google.com/accounts/ClientLogin", true);
			this.loginreq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			this.loginreq.send(params);
		} else {
			_this.request.setRequestHeader("Authorization", "GoogleLogin auth=" + blogger.loginStuff["Auth"]);
			switch (type) {
				case "POST":
				case "PUT":
					_this.request.setRequestHeader("Content-Type", "application/atom+xml");
				break;
			}
			_this.request.send(_this.body);
		}
	}
	this.request.open(type, url, true);
}
