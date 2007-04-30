result = window.arguments[0];
LiveJournal = window.arguments[1];

function Init() {
	var ljuser = document.getElementById("ljusername").lastChild;
	for (var i = 0; i < LiveJournal.friends.length; i++) {
		var item = document.createElement("menuitem");
		item.setAttribute("label",LiveJournal.friends[i].user);
		ljuser.appendChild(item);
	}
}

function CloseMe() {
	result[0] = document.getElementById("ljusername").value;
	result[1] = document.getElementById("usercomm").selectedItem;
	return result;
}
