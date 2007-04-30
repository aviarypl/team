/* Say hi to the metaWeblog protocol, a hack-filled mishmash of the Blogger protocol, and other shit. */

metaWeblog = new Object();
WordPress = new Object();
MSN = new Object();

const metabundle = document.getElementById("metabundle");
var commonbundle = document.getElementById("commonbundle");

WordPress.startLogin = function() {
	metaWeblog.startLogin();
}

MSN.startLogin = function() {
	metaWeblog.startLogin();
}

metaWeblog.dumpXml = function(doc)
{
	var serializer = new XMLSerializer();
	var foStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
				   .createInstance(Components.interfaces.nsIFileOutputStream);
	var file = Components.classes["@mozilla.org/file/directory_service;1"]
			   .getService(Components.interfaces.nsIProperties)
			   .get("ProfD", Components.interfaces.nsIFile); // get profile folder
	file.append("extensions");   // extensions sub-directory
	file.append("{B9DAB69C-460E-4085-AE6C-F95B0D858581}");   // GUID of your extension
	var currentTime = new Date();
	var stamp = currentTime.getTime();
	file.append("myXMLFile" + stamp + ".xml");   // filename
	foStream.init(file, 0x02 | 0x08 | 0x20, 0664, 0);   // write, create, truncate
	serializer.serializeToStream(doc, foStream, "");   // rememeber, doc is the DOM tree
	foStream.close();
}

metaWeblog.startLogin = function() {
	this.username = dsAccounts.username;
	this.password = dsAccounts.password;
	this.posturl = dsAccounts.posturl;
	
	this.dontautoformat = !GetTag(dsAccounts.currentaccount, "accounttype").getAttribute("dontautoformat");
	this.enablecategories = GetTag(dsAccounts.currentaccount, "accounttype").getAttribute("categories");
	
	var params = [];
	params.push("0123456789ABCDEF");
	params.push(this.username);
	params.push(this.password);
	
	var getbloginfo = makeXMLRpcCall("blogger.getUsersBlogs", params);
	metaWeblog.dumpXml(getbloginfo);
	this.httpreq = new XMLHttpRequest();
	this.httpreq.onload = this.loginHandler;
	this.httpreq.onerror = function() {
		alert(commonbundle.getString("ErrorConnecting"));
		Login();
	}
	this.httpreq.open("POST", this.posturl, true);
	this.httpreq.setRequestHeader("Content-Type", "text/xml");
	this.httpreq.send(getbloginfo);
}

metaWeblog.loginHandler = function() {
	if (dsAccounts.loggingin) {
		try {
			var response = parseXMLRpcResponse(metaWeblog.httpreq.responseXML);
			metaWeblog.dumpXml(metaWeblog.httpreq.responseXML);
			if ((response["faultCode"]) || (response["faultString"])) {
				alert(commonbundle.getString("ErrorRequest") + " " + response["faultString"]);
				Login();
			} else {
				metaWeblog.useme = true;
				metaWeblog.blogs = response;
				if (metaWeblog.enablecategories) {
					metaWeblog.getCategories();
				} else {			
					metaWeblog.finishLogin();
				}
			}
		} catch (e) {
			alert(e);
			Login();
		}
	}
}

metaWeblog.getCategories = function() {
	var params = [];
	params.push(this.blogs[0][0]["blogid"]);
	params.push(this.username);
	params.push(this.password);
	var getcats = makeXMLRpcCall("metaWeblog.getCategories", params);
	metaWeblog.dumpXml(getcats);
	this.httpreq = new XMLHttpRequest();
	this.httpreq.onload = this.successLogin;
	this.httpreq.onerror = function() {
		alert(commonbundle.getString("ErrorConnecting"));
		Login();
	}
	this.httpreq.open("POST", this.posturl, true);
	this.httpreq.setRequestHeader("Content-Type", "text/xml");
	this.httpreq.send(getcats);
}

metaWeblog.successLogin = function() {
	if (dsAccounts.loggingin) {
		try {
			var response = parseXMLRpcResponse(metaWeblog.httpreq.responseXML);
			metaWeblog.dumpXml(metaWeblog.httpreq.responseXML);
			if ((response["faultCode"]) || (response["faultString"])) {
				alert(commonbundle.getString("ErrorRequest") + " " + response["faultString"]);
				Login();
			} else {
				metaWeblog.categories = response;
				metaWeblog.finishLogin();				
			}
		} catch (e) {
			alert(e);
			Login();
		}
		
	}
}

metaWeblog.finishLogin = function() {
	document.getElementById("dsPostFrame").setAttribute("src", "protocols/blogger/blogger.xul");
	FinaliseLogin(metaWeblog);
}

