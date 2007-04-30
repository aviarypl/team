ljPost = new Object();
var commonbundle = document.getElementById("commonbundle");

// START ljPost SECTION...

ljPost.postToServer = function() {
	// Sends the post to the server. Hurrah!
	// In: Nothing.
	// Out: Nothing.
	this.httpreq = new LiveJournal.LJHttpRequest(LiveJournal.posturl, dsPosts.sendPost);
	this.httpreq.onload = this.postHandler;
	var params = new Object();
	
	params.user = LiveJournal.username.toLowerCase();

	
	params.clientversion = AppName;
	// Always use \n as the line ending... Makes life much easier, especially across platforms.
	params.lineendings = "unix";
	var subjectbox = document.getElementById("subject");
	if (subjectbox.value.trim().length > 0) {
		params.subject = subjectbox.value;
	}
	dsMidas.updateSourceTab();
	params.event = document.getElementById("messagesource").value;
	switch (this.security) {
		case 0:
			params.security = "public";
			break;
		case 1:
			params.security = "private";
			break;
		case 2:
		case 3:
			params.security = "usemask";
			params.allowmask = this.allowmask;
			break;
	}
	if (!this.postDate) {
		this.postDate = new Date();
	}
	params.year = this.postDate.getYear() + 1900;
	params.mon = this.postDate.getMonth() + 1;
	params.day = this.postDate.getDate();
	params.hour = this.postDate.getHours();
	params.min = this.postDate.getMinutes();
	
	if (this.usejournal != LiveJournal.username) {
		params.usejournal = this.usejournal;
	}

	var moodbox = document.getElementById("moods");
	var moodtext = document.getElementById("moodtext");
	if (moodbox.selectedIndex > 0) {
		params.prop_current_moodid = moodbox.value;
	}
	if (moodtext.value.trim().length > 0) {
		params.prop_current_mood = moodtext.value;
	}
	var musicbox = document.getElementById("music");
	if (!musicbox.getAttribute("empty")) {
		params.prop_current_music = musicbox.value.trim();
	}

	var tagbox = document.getElementById("taglist");
	if (!tagbox.getAttribute("empty")) {
		params.prop_taglist = tagbox.value.trim();
	}

	var locationbox = document.getElementById("location");
	if (!locationbox.getAttribute("empty")) {
		params.prop_current_location = locationbox.value.trim();
	}
	
	if (this.dontautoformat) {
		params.prop_opt_preformatted = 1;
	}
	
	if (this.removecomments) {
		params.prop_opt_nocomments = 1;
	}
	
	if (this.backdate) {
		params.prop_opt_backdated = 1;
	}
	
	var pickwbox = document.getElementById("picture");
	if (pickwbox.selectedIndex > 0) {
		params.prop_picture_keyword = this.pickw;
	}
	
	var body = "mode=postevent";
	body += LiveJournal.makeParams(params);

	document.getElementById("statuswhat").value = commonbundle.getString("PostingTo") + " " + this.usejournal;
	this.httpreq.send(body);
}

ljPost.postHandler = function() {
	// Handle my post, dammit. Runs when the server has returned a response from the actual post.
	// In: Nothing.
	// Out: Nothing.
	if (dsPosts.posting) {
		var result = LiveJournal.responseArray(ljPost.httpreq.request.responseText);
		if (LiveJournal.getResponseData("success", result) == "OK") {
			// Posted!
			dsPosts.resetPostParameters();
			dsPosts.sendPost();
		} else {
			var errmsg = LiveJournal.getResponseData("errmsg", result);
			if (errmsg) {
				alert(commonbundle.getString("ErrorRequest") + " " + errmsg);
			} else {
				alert(commonbundle.getString("ErrorRequest") + " " + ljPost.httpreq.request.responseText);
			}
			dsPosts.sendPost();
		}
	}
}
