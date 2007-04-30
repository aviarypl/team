// These functions are for the clipboard. Long story short, it involves the removal of
//	all the bits that make life easy in Fx prior to 0.9. Damn you, Goodger!
// All this stuff is thanks to Robert Strong. He really made some huge advancements with DS.


function ds_cut() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.cut();
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_cut");
	}
}
function ds_paste() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.paste(1);
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_paste");
	}
}
function ds_copy() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.copy();
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_copy");
	}
}
function ds_pastenoformatting() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.pasteNoFormatting(1);
	}
}
function ds_delete() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.deleteSelection(1);
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_delete");
	}
}
function ds_undo() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.undo(1);
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_undo");
	}
}
function ds_redo() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.redo(1);
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_redo");
	}
}

function ds_selectAll() {
	if (document.getElementById("messagetabbox").selectedIndex == 0) {
		var midas = document.getElementById("message");
		var HTMLEditor = midas.getHTMLEditor(midas.contentWindow);
		HTMLEditor.selectAll();
	} else if (document.getElementById("messagetabbox").selectedIndex == 1) {
		goDoCommand("cmd_selectAll");
	}
}

