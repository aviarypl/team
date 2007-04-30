metaWeblog = window.arguments[0];
moreitem = window.arguments[1];

function Init() {
	var postcat = document.getElementById("categories");
	var morearray = moreitem.getAttribute("value").split("/|-");
	
	for (i = 0; i < metaWeblog.categories[0].length; i++) {
		postcat.appendItem(metaWeblog.categories[0][i]["description"]);
		postcat.lastChild.setAttribute("type", "checkbox");
		if (morearray.indexOf(metaWeblog.categories[0][i]["description"]) >= 0) {
			postcat.lastChild.setAttribute("checked", true);
		}
	}
}

function OkClicked() {
	var morearray = [];
	var postcat = document.getElementById("categories");
	for (i = 0; i < postcat.childNodes.length; i++) {
		if (postcat.childNodes[i].getAttribute("checked")) {
			morearray.push(postcat.childNodes[i].getAttribute("label"));
		}
	}
	moreitem.setAttribute("value", morearray.join("/|-"));
}
