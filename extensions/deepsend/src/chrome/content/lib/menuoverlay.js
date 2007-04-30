/*
 * The contents of this file are subject to the Netscape Public
 * License Version 1.1 (the "License"); you may not use this file
 * except in compliance with the License. You may obtain a copy of
 * the License at http://www.mozilla.org/NPL/
 *
 * Software distributed under the License is distributed on an "AS
 * IS" basis, WITHOUT WARRANTY OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * rights and limitations under the License.
 *
 * The Original Code is Mozilla Communicator client code,
 * released March 31, 1998.
 *
 * The Initial Developer of the Original Code is Netscape Communications
 * Corporation.  Portions created by Netscape are
 * Copyright (C) 2000 Netscape Communications Corporation. All
 * Rights Reserved.
 */
// update menu items that rely on focus
function goUpdateGlobalEditMenuItems() {
	goUpdateCommand('cmd_undo');
	goUpdateCommand('cmd_redo');
	goUpdateCommand('cmd_cut');
	goUpdateCommand('cmd_copy');
	goUpdateCommand('cmd_paste');
	goUpdateCommand('cmd_pasteNoFormatting');
	goUpdateCommand('cmd_selectAll');
	goUpdateCommand('cmd_delete');
}

// update menu items that rely on the current selection
function goUpdateSelectEditMenuItems() {
	goUpdateCommand('cmd_cut');
	goUpdateCommand('cmd_copy');
	goUpdateCommand('cmd_delete');
	goUpdateCommand('cmd_selectAll');
}

// update menu items that relate to undo/redo
function goUpdateUndoEditMenuItems() {
	goUpdateCommand('cmd_undo');
	goUpdateCommand('cmd_redo');
}

// update menu items that depend on clipboard contents
function goUpdatePasteMenuItems() {
	goUpdateCommand('cmd_paste');
	goUpdateCommand('cmd_pasteNoFormatting');
}

function IsItemOrCommandEnabled(item) {
	var command = item.getAttribute("command");
	if (command) {
	// If possible, query the command controller directly
		var controller = document.commandDispatcher.getControllerForCommand(command);
		if (controller)
		return controller.isCommandEnabled(command);
	}

	// Fall back on the inefficient observed disabled attribute
	return item.getAttribute("disabled") != "true";
}

function Logout() {
	//parent.document.getElementById("loginkey").setAttribute("keycode", "VK_RETURN");
	parent.document.getElementById("mainwindow").selectedIndex = 0;
	parent.document.getElementById("dsPostFrame").setAttribute("src", "lib/blank.xul");
}

function ShowOptions() {
	const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
	var appInfo = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULAppInfo);
	if (appInfo.ID == FIREFOX_ID) {
		window.openDialog("chrome://deepestsender/content/prefdialog.xul","dsprefs","chrome,titlebar,toolbar,centerscreen,modal,dialog=no");
	} else {
		window.openDialog("chrome://deepestsender/content/prefsmoz.xul","dsprefs","chrome,modal");
	}
}

