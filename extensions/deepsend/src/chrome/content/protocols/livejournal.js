/* This is the LiveJournal flat protocol file. Whee.

	The object name has to exactly match the <accounttype> value, as it is what is called when the login button is hit. The entry function is .startLogin().
	
	This is the LiveJournal object. Upon completion of logging in, these variables will be available:
	
	.username = The username of the user. Duh.
	.password = The current password of the user. I should keep it as a hexMD5 thing, but ffs, I'm having enough trouble as it is.
	.posturl = The URL to the XML-RPC interface.
	.fullname = The full name of the user (set in their user info). Do what you want with it.
	.moods[] = An array of all the moods that LJ has.
	.moods[x].id = The mood ID. You need to send this instead of the mood name if it is available, otherwise the user won't get little happy icons
		next to their moods.
	.moods[x].mood = The text value of the mood. "Happy," "angry," "horny," "ya mum," whatever. These are cached for each individual account, as different servers
		may have different moods (ie, user might have a LiveJournal and a DeadJournal account.
	.moods[x].parentmood = The ID of the mood that the mood is based on. Make sense? Didn't to me either. This doesn't really get used anywhere,
		but I thought I should keep it just in case there's some amazingly amazing function to use in the future.
	.defaultpicurl = The URL of the default userpic for the user. Attach it to an <image> tag, and viola, pretty user pic!
	.friendgroups[] = An array of the friends groups.
	.friendgroups[x].name = The name of the security group. eg. "everyone but my girlfriend" or something.
	.friendgroups[x].id = This is a genuine crackwhore to do. Well, it was in the flat interface. Looks like you just have to add the numbers together
		to create a hash now. Anyway, this is the ID of the security group. Check the protocol docs for more info.
	.friendgroups[x]sortorder = What order the groups should appear in. Honestly, who cares?
	.friendgroups[x].ispublic = If the group is public or not. As stated before, who cares?
	.usejournals[] = An array holding strings of journals that the user can post to. Easy.
	.pickws[] = Another array, this one being picture keywords.
	.pickkws[x].pickw = The keyword of the picture to attach to the post.
	.pickws[x].url = The URL of the picture of the keyword to attach. Makes for nice little selection boxes.
	.friends[] = An array of friends, only populated if the user has previously hit OK on the Friends Editor.
	.friends[x].user = The friend's username.
	.friends[x].type = The type of friend. Either blank for a normal friend, "community" for a community, and "syndicated" for a feed. Also "new" if unknown.
	.friends[x].birthday = The birthday of the friend, in yyyy-mm-dd format.
	
	These should be all the variables you need. Well, they're all the variables there are, minus the menus, but they're utterly useless, and I'll save
		that for a rainy day. Enjoy.
	
	NOTE: If you need to read additional values from the XML file, make sure they're set up in the Account Wizard! (accwiz.js) There is a function in there
		called ExtraTags() - add what you need to the switch statement there. And don't forget to add the object to the drop-down menu in accwiz.xul.
	
	Oh, and don't forget to reference this file from deepestsender.xul. Because you'd be an idiot if you didn't.
	
	LiveJournal.LJHttpRequest() is a replacement for XMLHttpRequest() that automagically figures out a challenge to send to the server or not, then sends
		your request. The request object lives under LJHttpRequest.request, so you can get the usual responses from there. Exceptions are thrown
		when there's an error. You also don't need to specify the .open thing, nor the Content-Type, not any security in the request.
	
	And finally, you have an object to play with - status. Its just a reference to a label tag at the bottom of the login screen, and you can set
		status.value to whatever the hell you want to inform the user on how logging in is progressing, or that they suck monkey nuts, or anything!
	
	Everything in this is stored under the LiveJournal object, so I can be half-arsed and don't have to include this file over and over and over.

*/
LiveJournal = {};

const ljbundle = document.getElementById("livejournalbundle");
var commonbundle = document.getElementById("commonbundle");

LiveJournal.startLogin = function() {
	// All blog objects need to have this function. It is what is called when the login button is hit.
	// In: Nothing.
	// Out: Nothing.
	this.username = dsAccounts.username;
	this.password = dsAccounts.password;
	this.posturl = dsAccounts.posturl;

	delete this.tags;
	var nsiio = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
	
	// Seriously having second thoughts that XML-RPC would be easier to use than just the flat interface. Anyway, this generates a login request to
	//	the server. All sorts of goodies in here. Also loads up cached moods, makes a response from the challenge, blah blah.
	// In: The challenge string.
	// Out: Nothing, but it'll launch off another request that calls .loginHandler() when it completes.
	this.httpreq = new LiveJournal.LJHttpRequest(this.posturl, Login);
	this.httpreq.onload = LiveJournal.loginHandler;
	var params = new Object();
	// Goddamn mood list stuff. Bane of my existence, other than lj-cut tags.
	this.moods = [];
	var moodnodes = GetTag(dsAccounts.currentaccount, "moods");
	this.highestmood = parseInt(moodnodes.getAttribute("highestmood"), 10);
	var moodnodeslength = moodnodes.childNodes.length;
	for (i = 0; i < moodnodeslength; i++) {
		var curmood = {};
		curmood.mood = moodnodes.childNodes[i].getAttribute("name");
		curmood.id = moodnodes.childNodes[i].getAttribute("moodid");
		//curmood.parentmood = moodnodes.childNodes[i].getAttribute("parent");
		LiveJournal.moods.push(curmood);
	}
	params.getmoods = this.highestmood;
	var defsectag = GetTag(dsAccounts.currentaccount, "security");
	this.defaultsecurity = defsectag.getAttribute("level");
	this.defaultgroups = defsectag.getAttribute("groups");
	var defaultoptions = GetTag(dsAccounts.currentaccount, "options");
	this.defaultbackdate = defaultoptions.getAttribute("backdate");
	this.defaultdontautoformat = defaultoptions.getAttribute("dontautoformat");
	this.defaultremovecomments = defaultoptions.getAttribute("removecomments");
	params.user = this.username.toLowerCase();

	
	params.clientversion = AppName;
	params.getpickws = 1;
	params.getpickwurls = 1;
	params.getmenus = 1;
	
	var body = "mode=login";
	body += this.makeParams(params);
	status.value = ljbundle.getString("SendingLoginRequest");
	this.httpreq.send(body);
}

LiveJournal.loginHandler = function() {
	// This is stupid. There has to be a way I can re-use all this stuff. This function processes the response from the server for logging in.
	// In: Nothing.
	// Out: Nothing. It will call FinaliseLogin() (in deepestsender.js), which is the last function that runs before handing control over to
	//	the blog window. Make sure you add this line.
	if (dsAccounts.loggingin) {
		var result = LiveJournal.responseArray(LiveJournal.httpreq.request.responseText);
		if (LiveJournal.getResponseData("success", result) == "OK") {
			status.value = ljbundle.getString("ProcessingLoginResult");
			LiveJournal.fullname = LiveJournal.getResponseData("fullname", result);
			LiveJournal.defaultpicurl = LiveJournal.getResponseData("defaultpicurl", result);
			LiveJournal.fastserver = parseInt(LiveJournal.getResponseData("fastserver", result), 10);
			var message = LiveJournal.getResponseData("message", result);
			var nsiio = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);
			var ljuri = nsiio.newURI(LiveJournal.posturl, null, null);
			LiveJournal.friendgroups = [];
			var maxfriends = parseInt(LiveJournal.getResponseData("frgrp_maxnum", result), 10);
			for (i = 1; i <= maxfriends; i++) {
				var fgroup = LiveJournal.getResponseData("frgrp_" + i+ "_name", result);
				if (fgroup) {
					var curgroup = {};
					curgroup.name = fgroup;
					curgroup.id = i;
					curgroup.sortorder = parseInt(LiveJournal.getResponseData("frgrp_" + i + "_sortorder", result), 10);
					curgroup.ispublic = LiveJournal.getResponseData("frgrp_" + i + "_public", result);
					LiveJournal.friendgroups.push(curgroup);
				}
			}
			// Sorting nicked from atrustheotaku.
			function groupsCmp(a, b){
				if(a.sortorder < b.sortorder) return -1;
				if(a.sortorder > b.sortorder) return 1;
				return 0;
			}
			LiveJournal.friendgroups.sort(groupsCmp);
			LiveJournal.usejournals = [];
			var accesscount = parseInt(LiveJournal.getResponseData("access_count", result), 10);
			for (i = 1; i <= accesscount; i++) {
				LiveJournal.usejournals.push(LiveJournal.getResponseData("access_" + i, result));
			}
			LiveJournal.usejournals.sort();
			// Bah. More moods crap.

			//var moodsxmlnode = moodsxml.appendChild(GetTag(dsAccounts.currentaccount, "moods").cloneNode(true));
			var j = LiveJournal.moods.length;
			var moodcount = parseInt(LiveJournal.getResponseData("mood_count", result), 10);
			for (i = 1; i <= moodcount; i++) {
				//dump("loop " + i + ", adding to " + j + "\n\n");
				var curmood = {}
				curmood.mood = LiveJournal.getResponseData("mood_" + i + "_name", result);
				curmood.id = LiveJournal.getResponseData("mood_" + i + "_id", result);
				LiveJournal.moods.push(curmood);
				if (parseInt(LiveJournal.highestmood) < parseInt(curmood.id)) {
					LiveJournal.highestmood = curmood.id;
				}
			}
						
			if (moodcount > 0) {
				function moodSort(a, b){
					if(a.mood.toString() < b.mood.toString()) return -1;
					if(a.mood.toString() > b.mood.toString()) return 1;
					return 0;
				}
				LiveJournal.moods.sort(moodSort);
				var moodsxml = dsAccounts.dsXML.createDocumentFragment();
				var moodsxmlnode = moodsxml.appendChild(dsAccounts.dsXML.createElement("moods"));
				for (var i = 0; i < LiveJournal.moods.length; i++) {
					var curnode = dsAccounts.dsXML.createElement("mood");
					curnode.setAttribute("name", LiveJournal.moods[i].mood);
					curnode.setAttribute("moodid", LiveJournal.moods[i].id);
					moodsxmlnode.appendChild(curnode);
				}
				moodsxmlnode.setAttribute("highestmood", LiveJournal.highestmood);
				
				var oldmood = GetTag(dsAccounts.currentaccount, "moods");
				dsAccounts.currentaccount.replaceChild(moodsxmlnode, oldmood);
			}
			
			dsAccounts.saveSettings();
			status.value = ljbundle.getString("SortingKeywords");
			LiveJournal.pickws = [];
			var kwcount = parseInt(LiveJournal.getResponseData("pickw_count", result), 10);
			for (i = 1; i <= kwcount; i++) {
				var pickw = {};
				pickw.pickw = LiveJournal.getResponseData("pickw_" + i, result);
				pickw.url = LiveJournal.getResponseData("pickwurl_" + i, result);
				LiveJournal.pickws.push(pickw);
			}
			
			// Do menus.
			LiveJournal.menus = LiveJournal.sortMenus(0, result);
			LiveJournal.friends = [];
			var friends = GetTag(dsAccounts.currentaccount, "friends");
			var friendslength = friends.childNodes.length;
			for (var i = 0; i < friendslength; i++) {
				var friend = {};
				friend.user = friends.childNodes[i].getAttribute("username");
				friend.birthday = friends.childNodes[i].getAttribute("birthday");
				friend.type = friends.childNodes[i].getAttribute("type");
				LiveJournal.friends.push(friend);
			}
			
			if (message) {
				status.value = ljbundle.getString("DisplayingServerMessages");
				alert(message);
			}
			status.value = ljbundle.getString("LoggedIn");
			
			if (GetTag(dsAccounts.currentaccount, "accounttype").getAttribute("usetags") == "true") {
				LiveJournal.usetags = true;
			}
			document.getElementById("dsPostFrame").setAttribute("src", "protocols/livejournal/livejournal.xul");
			FinaliseLogin(LiveJournal);
		} else {
			var errmsg = LiveJournal.getResponseData("errmsg", result);
			if (errmsg) {
				alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
			} else {
				alert(commonbundle.getString("ErrorRequest") + " " + LiveJournal.httpreq.request.responseText);
			}
			Login();
		}
	}
}

LiveJournal.makeParams = function(paramobj) {
	// Sticks all the variables in an object into a long string that looks like: &variablename=variablevalue&variablename2=variablevalue2, and so on,
	//	for posting to LJ as flat. URIencodes them too for unicode.
	// In: An object.
	// Out: A string that looks like what I just wrote before.
	var body = "";
	for (i in paramobj) {
		var paramstring = "&" + encodeURIComponent(i) + "=" + encodeURIComponent(paramobj[i]);
		body += paramstring;
	}
	return body;
}

LiveJournal.getResponseData = function(heading, responseData, removeplussigns) {
	// Runs through the response sent by the flat interface and finds the value corresponding to what was requested.
	// Changed as of 0.8 to use indexOf instead of looping through and searching line by line, as it is much, much faster.
	// In: The variable to look up, the text to search through for it.
	// Out: The value of the variable, or null if it isn't found.
	var i = 0;
	var data = null;

	var foundindex = responseData.indexOf(heading);
	if (foundindex >= 0) {
		data = responseData[foundindex + 1];
		if (removeplussigns) {
			data = data.replace(/\+/gi, "%20");
		}
		try {
			data = decodeURIComponent(data);
		} catch(e) {
			dump("\nmessed up decoding line, returning original text...");
		}
		return data;
	}
	return null;
}

LiveJournal.responseArray = function(responseText) {
	try {
		var result = responseText.split("\n");
	} catch (e) {
		var result = [];
	}
	return result;
}

LiveJournal.LJHttpRequest = function(url, cancel, temppass) {
	// I am honestly unsure how I got this working. I typed it up, expecting it to crash horribly, but everything worked first
	//	go. So I am very suspicious of it. Basically it handles all the challenge/response shit, leaving it out of the rest
	//	of the program. Built off the XMLHttpRequest object, so it takes the same sort of methods.
	// In: URL to be posted to, function to run on an error.
	// Out: Same as XMLHttpRequest. Runs whatever function was defined in onload before the request was sent. 
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
		if (GetTag(dsAccounts.currentaccount, "accounttype").getAttribute("challenge") == "true") {
			this.challengereq = new XMLHttpRequest();
			this.challengereq.onload = function() {
				var response;
				var result = LiveJournal.responseArray(_this.challengereq.responseText);
				if (LiveJournal.getResponseData("success", result) == "OK") {
					response = LiveJournal.getResponseData("challenge", result);
					var params = new Object();
					params.ver = 1;
					params.auth_method = "challenge";
					params.auth_challenge = response;
					temppass ? params.auth_response = hexMD5(response + hexMD5(temppass)) : params.auth_response = hexMD5(response + hexMD5(LiveJournal.password)); 
					_this.request.send(_this.body + LiveJournal.makeParams(params));
				} else { 
					var errmsg = LiveJournal.getResponseData("errmsg", result);
					if (errmsg) {
						response = errmsg;
					} else {
						response = _this.challengereq.responseText;
					}
					alert(commonbundle.getString("ErrorRequest") + " " + response);
					if (cancel) cancel();
				}
			};
			this.challengereq.onerror = function() {
				alert(commonbundle.getString("ErrorConnecting"));
				if (cancel) cancel();
			};
			this.challengereq.open("POST", _this.url, true);
			if (LiveJournal.fastserver) {
				this.challengereq.setRequestHeader("Cookie", "ljfastserver=1");
			}
			this.challengereq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			this.challengereq.send("mode=getchallenge");
		} else {
			var params = new Object();
			params.ver = 1;
			params.auth_method = "clear";
			params.hpassword = hexMD5(LiveJournal.password);
			_this.request.send(_this.body + LiveJournal.makeParams(params));
		}
	}
	this.request.open("POST", this.url, true);
	if (LiveJournal.fastserver) {
		this.request.setRequestHeader("Cookie", "ljfastserver=1");
	}
	this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
}

LiveJournal.sortMenus = function(menunum, result) {
	var menuarray = [];
	var menulength = parseInt(LiveJournal.getResponseData("menu_" + menunum + "_count", result), 10);
	for (var i = 1; i <= menulength; i++) {
		var curmenu = {};
		curmenu.menutext = LiveJournal.getResponseData("menu_" + menunum + "_" + i + "_text", result);
		var url = LiveJournal.getResponseData("menu_" + menunum + "_" + i + "_url", result);
		if (url) {
			curmenu.url = url;
		} else {
			var submenu = parseInt(LiveJournal.getResponseData("menu_" + menunum + "_" + i + "_sub", result), 10);
			curmenu.submenu = LiveJournal.sortMenus(submenu, result);
		}
		menuarray.push(curmenu);
	}
	return menuarray;
}
