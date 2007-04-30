const atombundle = document.getElementById("atombundle");

function parseAtomList(atomdoc) {
	// Parses a list of Atom feeds.
	// In: Atom XML feeds document.
	// Out: An array of objects. Each object has .title, .post, and .feed.
	//	.title is the title of the blog.
	//	.post is the URL to use for posting to the blog.
	//	.feed is the URL to get data from the blog.
	if (atomdoc.documentElement.tagName != "feed") throw atombundle.getString("NotFeed");
	
	var _blogarray = [];
	var _blogs = atomdoc.documentElement.getElementsByTagName("link");
	for (i = 0; i < _blogs.length; i++) {
		if (_blogs[i].getAttribute("rel") == "service.post") {
			var _blogdetail = new Object();
			_blogdetail["title"] = _blogs[i].getAttribute("title");
			_blogdetail["post"] = _blogs[i].getAttribute("href");
			for (z = 0; z < _blogs.length; z++) {
				var _blog = _blogs[z];
				if ((_blog.getAttribute("rel") == "service.feed") && (_blog.getAttribute("title") == _blogdetail["title"])) {
					_blogdetail["feed"] = _blog.getAttribute("href");
					break;
				}
			}
			_blogarray.push(_blogdetail);
		}
	}
	return _blogarray;
}

function AtomPost() {}

	// Properties:
	//	.title = The post title.
	//	.date = Date for the post (as a date object).
	//	.post = The post, as a string.
	//	.link = Any link to be associated with the post.
	//	.draft = Boolean for whether or not it's a draft.

AtomPost.prototype.returnAtom = function() {
	var atom = document.implementation.createDocument("", "entry", null);
	//Setting the namespace via createDocument was giving me headaches. 
	atom.documentElement.setAttribute("xmlns", "http://www.w3.org/2005/Atom");
	
	atom.insertBefore(atom.createProcessingInstruction("xml", "version=\"1.0\" encoding=\"utf-8\" standalone=\"yes\""), atom.documentElement);
	
	var generator = atom.documentElement.appendChild(atom.createElement("generator"));
	generator.setAttribute("uri", "http://deepestsender.mozdev.org");
	generator.setAttribute("version", AppVersion);
	generator.appendChild(atom.createTextNode("Deepest Sender"));

	if (this.title) {
		var titlenode = atom.documentElement.appendChild(atom.createElement("title"));
		titlenode.setAttribute("mode", "escaped");
		titlenode.setAttribute("type", "text");
		titlenode.appendChild(atom.createTextNode(this.title));
	}

	
	if (this.date) {
		var issued = atom.documentElement.appendChild(atom.createElement("published"));
		var iso8601 = this.date.toISO8601String(4);
		issued.appendChild(atom.createTextNode(iso8601));
	}

	if (this.post) {
		var content = atom.documentElement.appendChild(atom.createElement("content"));
		content.setAttribute("type", "xhtml");
		
		var domparser = new DOMParser();
		// You need to create an entire XHTML document and feed the post into it, then parse it, otherwise it'll give errors about entities
		//	like nonbreaking spaces and stuff.
		
		var messagestring = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n" +
					"<html xmlns=\"http://www.w3.org/1999/xhtml\"><head><meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\" />\n" +
					"</head><body id=\"postbody\"><div xmlns=\"http://www.w3.org/1999/xhtml\">" + this.post + "</div></body></html>";
					
		var message = domparser.parseFromString(messagestring, "application/xhtml+xml");
					
		if (message.documentElement.tagName == "parsererror") throw atombundle.getString("XMLNotWellFormed");
		content.appendChild(atom.importNode(message.getElementById("postbody").firstChild, true));
	}
	
	// needs to be toggle-able
	if (this.draft) {
		appcontrol = atom.documentElement.appendChild(atom.createElement("app:control"));
		appcontrol.setAttribute("xmlns:app", "http://purl.org/atom/app#");
		var draft = atom.createElement("app:draft");
		draft.appendChild(atom.createTextNode("yes"));
		appcontrol.appendChild(draft);
	}

	if (this.link) {
		var linktag = atom.documentElement.appendChild(atom.createElement("link"));
		linktag.setAttribute("rel", "related");
		linktag.setAttribute("type", "text/html");
		if (this.title) linktag.setAttribute("title", this.title);
		linktag.setAttribute("href", this.link);
	}
	atom.normalize();
	return atom;
}
