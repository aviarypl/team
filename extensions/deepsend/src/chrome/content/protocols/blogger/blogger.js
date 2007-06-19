if (parent.accountwindow) {
	blogger = parent.blogger;
	metaWeblog = parent.metaWeblog;
	dsAccounts = parent.dsAccounts;
	var isSidebar = parent.isSidebar;
} else {
	blogger = window.arguments[0];
	metaWeblog = window.arguments[1];
	var itemid = window.arguments[2];
}

var dsPrefs = new PrefsWrapper1("extensions.deepestSender.");
dsPosts = new Object();
var usemeta;

var commonbundle = document.getElementById("commonbundle");

function Init() {
	if (isSidebar) {
		var titlebox = document.getElementById("titleblogbox");
		titlebox.orient = "vertical";
		titlebox.lastChild.lastChild.setAttribute("flex", 1);
		document.getElementById("formattingbar").orient = "vertical";
	}

	if (metaWeblog.useme) {
		usemeta = true;
		delete metaWeblog.useme;
		doMetaWeblogStuff();
	}

	if (parent.accountwindow) {
		InitPosting();
	} else {
		InitEditing();
	}
}

function InitPosting() {
	if (!usemeta) {
		dsMidas.dontautoformat = blogger.dontautoformat;
	} else {
		dsMidas.dontautoformat = metaWeblog.dontautoformat;
	}
	
	
	
	dsPosts.resetPostParameters();
	
	var savesecs = dsPrefs.getIntPref("SaveDraftEvery") * 1000;
	if (!isSidebar) {
		dsDraft.loadDraft();
		blogger.saveinterval = setInterval("dsDraft.saveDraft();", savesecs);
	}
	dsMidas.lookForBloggedPage();
	// Have to do this so backspace works if there's a previous post + it doesn't always force CSS.
	var midas = document.getElementById("message");
	midas.contentDocument.designMode = "On";
	midas.contentDocument.execCommand("styleWithCSS", false, dsPrefs.getBoolPref("UseCSS"));
}

function WindowClosing() {
	if ((parent.accountwindow) && (!isSidebar) && (!blogger.editmode)) {
		dsDraft.saveDraft();
	}
}

dsPosts.sendPost = function() {
	if (this.posting) {
		this.posting = false;
		if (usemeta) {
			metaWeblog.httpreq.abort();
		} else {
			blogger.httpreq.request.abort();
		}
		document.getElementById("maindisabler").removeAttribute("disabled");
		document.getElementById("messagedeck").selectedIndex = 0;
		document.getElementById("postbutton").label = commonbundle.getString("Post");
	} else {
		if (dsPrefs.getBoolPref("SpellCheckOnPost")) {
			// goDoCommand won't work for some reason.
			eval(document.getElementById("cmd_spell").getAttribute("oncommand"));
		}
		document.getElementById("postbutton").label = commonbundle.getString("Cancel");
		document.getElementById("maindisabler").setAttribute("disabled", true);
		document.getElementById("statuslabel").value = commonbundle.getString("Posting");
		document.getElementById("progressbar").mode = "undetermined";
		document.getElementById("messagedeck").selectedIndex = 1;
		this.posting = true;
		if (usemeta) {
			dsPosts.metaPostToServer();
		} else {
			dsPosts.bloggerPostToServer();
		}
	}
}

dsPosts.resetPostParameters = function() {
	dsMidas.setUpMidas();
	document.getElementById("subject").value = null;
	document.getElementById("link").value = null;
	document.getElementById("draftcheck").checked = false;	
	document.getElementById("categories").selectedIndex = 0;
}

// Start Blogger-specific stuff.

dsPosts.bloggerPostToServer = function() {
	dsMidas.updateSourceTab();
	var post = new AtomPost();
	var subjectbox = document.getElementById("subject");
	if (subjectbox.value.trim().length > 0) {
		post.title = subjectbox.value;
	}

	var linkbox = document.getElementById("link");
	if (linkbox.value.trim().length > 0) {
		post.link = linkbox.value;
	}
	
	post.date = new Date();	
		
	var draftpost = false;
	if (document.getElementById("draftcheck").checked) {
		post.draft = true;
	}
	
	post.post = document.getElementById("messagesource").value;

	try {
		var body = post.returnAtom();
	} catch (e) {
		alert(e);
		dsPosts.sendPost();
		return;
	}
	blogger.httpreq = new blogger.BloggerRequest(blogger.atomPostURL, "POST", dsPosts.sendPost);
	blogger.httpreq.onload = dsPosts.bloggerPostHandler;
	blogger.httpreq.onerror = function() {
		alert(commonbundle.getString("ErrorConnecting"));
		alert(blogger.httpreq.request.responseText);
		dsPosts.sendPost();
	}
	
	document.getElementById("statuswhat").value = commonbundle.getString("PostingTo") + " " + blogger.title;
	blogger.httpreq.send(body);

}

dsPosts.bloggerPostHandler = function() {
	if (dsPosts.posting) {
		if ((blogger.httpreq.request.status == 200) || (blogger.httpreq.request.status == 201)) {
			dsPosts.resetPostParameters();
		} else {
			alert(commonbundle.getString("ErrorPosting") + " " + blogger.httpreq.request.responseText);
		}
		dsPosts.sendPost();
	}	
}

function OpenHistory() {
	var history = GetWindowByType("deepestsender:history"); 
	if (history) {
		history.focus();
	} else {
		window.openDialog("history.xul","dshistory","chrome,dependent,resizable", blogger, metaWeblog, usemeta);
	}
}

//wd
function OpenBlog() {
    //dump(metaWeblog.blogs[0][0]["url"]);
    var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIWebNavigation)
                   .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                   .rootTreeItem
                   .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                   .getInterface(Components.interfaces.nsIDOMWindow);

    mainWindow.getBrowser().loadOneTab(metaWeblog.blogs[0][0]["url"], null, null, null, false );
    
}