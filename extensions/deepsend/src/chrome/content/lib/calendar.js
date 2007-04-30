// The calendar object. Lots of trickiness. I am thinking possibly this could be done with XBL?

dsCalendar = new Object();
const cb = document.getElementById("calendarbundle");

dsCalendar.months = [cb.getString("January"),cb.getString("February"),cb.getString("March"),cb.getString("April"),cb.getString("May"),
		cb.getString("June"),cb.getString("July"),cb.getString("August"),cb.getString("September"),cb.getString("October"),
		cb.getString("November"),cb.getString("December")];

dsCalendar.init = function(cobj) {
	// This sets up the calendar for use. Call when the XUL loads.
	// In: A date object to set the calendar to.
	// Out: Nothing.
	this.updateCalendar(cobj);
	this.populateMonthsPopup();
	this.changeYear(this.year);
}

dsCalendar.populateMonthsPopup = function() {
	// Should be called after updateCalendar has been run once. Fills the months menu with all the month names.
	// In: Nothing.
	// Out: Nothing.
	var monthspop = document.createElement("menupopup");
	monthspop.setAttribute("id", "monthspopup");
	for (i=0; i < this.months.length; i++) {
		monthspop.appendChild(document.createElement("menuitem"));
		monthspop.lastChild.setAttribute("label", this.months[i]);
		monthspop.lastChild.setAttribute("value", i);
		monthspop.lastChild.setAttribute("type", "radio");
		monthspop.lastChild.setAttribute("name", "monthsgroup");
		monthspop.lastChild.setAttribute("oncommand", "dsCalendar.changeDate(this.value, dsCalendar.year);");
		if (i == this.month) {
			monthspop.lastChild.setAttribute("checked", true);
		}
	}
	document.getElementById("monthbutton").appendChild(monthspop);
}

dsCalendar.updateCalendar = function(Calendar) {
	// This function draws the calendar, based on the times given in the date object passed to it.
	// In: A date object, with the times in it set to what you want the calendar to display.
	// Out: Nothing.	
	this.year = Calendar.getFullYear();
	this.month = Calendar.getMonth();
	this.today = Calendar.getDate();
	this.weekday = Calendar.getDay();
	this.todaycal = new Date();
	Calendar.setDate(1);
	Calendar.setMonth(this.month);
	
	// Set the top labels of month and year.
	document.getElementById("monthbutton").label = this.months[this.month];
	document.getElementById("yearbutton").label = this.year;
	
	var index = Calendar.getDay();

	var cbox = document.getElementById("calendarboxrows");

	// If there's anything else on the calendar, wipe it out.
	while (cbox.childNodes.length > 1) {
		cbox.removeChild(cbox.lastChild);
	}

	// Start the first row.
	cbox.appendChild(document.createElement("row"));

	// This pads out the start of the calendar until the first day of the month. For example, if the first day is a Friday, then all the boxes
	// from Sunday to Thursday have to be blank in the first row.
	for (i = 0; i < index; i++) {
		cbox.childNodes[1].appendChild(document.createElement("spacer"));
	}

	// This draws up the dates. It runs 31 times through, because you're not going to have any months longer than that.
	for (i = 0; i < 31; i++) {
		if (Calendar.getDate() > i) {
			// While there's still dates remaining in the month...
			var week_day = Calendar.getDay();
			if (week_day == 0) {
				// This finds what number the day of the week is. If it's a 0, then its Sunday, so a new row should be started.
				cbox.appendChild(document.createElement("row"));
			}
			if (week_day != 7) {
				var day = Calendar.getDate();
				// Add another button to the row, and set it up to show a number and have some stuff attached.
				cbox.lastChild.appendChild(document.createElement("toolbarbutton"));
				cbox.lastChild.childNodes[week_day].setAttribute("label", Calendar.getDate());
				cbox.lastChild.childNodes[week_day].setAttribute("oncommand", "dsCalendar.setSelected(this);");
				cbox.lastChild.childNodes[week_day].setAttribute("id", "day" + Calendar.getDate());
				if ((this.today == day) && (this.todaycal.getMonth() == this.month)) {
					// This originally would SetSelected() the day that was today, but it kept buggering up so now it sets this and SetSelected gets called after this
					// function finishes.
					this.selectedday = this.today;
				}
			}
		}
		Calendar.setDate(Calendar.getDate() +1);
	}
	// Dug this out of the guts of MailNews... This is how you locally format a short date for the user's locale, because JS doesn't actually do it itself...
	var dateformatter = Components.classes["@mozilla.org/intl/scriptabledateformat;1"].getService(Components.interfaces.nsIScriptableDateFormat);
	document.getElementById("datelabel").value = cb.getString("Today") + " " + dateformatter.FormatDate("", dateformatter.dateFormatShort, this.todaycal.getFullYear(), this.todaycal.getMonth()+1, this.todaycal.getDate());
	
}

dsCalendar.setSelected = function(daybutton) {
	// This function puts a pretty little box around the last button that was clicked.
	// In: The button of what to apply the border to.
	// Out: Nothing.
	var cbox = document.getElementById("calendarboxrows");
	for (i = 1; i < cbox.childNodes.length; i++) {
		for (j = 0; j < cbox.childNodes[i].childNodes.length; j++) {
			cbox.childNodes[i].childNodes[j].removeAttribute("class");
		}
	}
	if (!daybutton) {
		daybutton = document.getElementById("day" + this.selectedday);
	}
	daybutton.setAttribute("class", "SelectedBox");
	this.selectedday = daybutton.label;
	if (this.extraSetSelected) this.extraSetSelected(this.selectedday, this.month + 1, this.year);
}


dsCalendar.changeDate = function(month, year) {
	// This goes forward or backward a month (for the little < and > buttons).
	// In: The amount to increment or decrement by (pass a negative number to go back).
	// Out: Nothing.
	var cal = new Date();
	cal.setFullYear(year);
	cal.setFullYear(cal.getFullYear(), month, 1);
	this.updateCalendar(cal);
	var mpop = document.getElementById("monthspopup");
	for (z = 0; z < mpop.childNodes.length; z++) {
		if (z == month) {
			mpop.childNodes[z].setAttribute("checked", true);
		} else {
			mpop.childNodes[z].removeAttribute("checked");
		}
	}
	var ypop = document.getElementById("yearpopup");
	for (z = 0; z < ypop.childNodes.length; z++) {
		if (ypop.childNodes[z].getAttribute("label") == year) {
			ypop.childNodes[z].setAttribute("checked", true);
		} else {
			ypop.childNodes[z].removeAttribute("checked");
		}
	}
	this.changeYear(this.year);
}

dsCalendar.changeYear = function(newyear) {
	// Sets the new year for the calendar, and also updates the popup to show +/- 3 years beyond the selected year.
	//	Called when the date is changed.
	// In: A string/int of what year the calendar should be set to.
	// Out: Nothing.
	var yearpop = document.getElementById("yearpopup");
	for (i = 0; i < yearpop.childNodes.length; i++) {
		var yearlabel = parseInt(newyear, 10) + (i - 3);
		yearpop.childNodes[i].setAttribute("label", yearlabel);
		yearpop.childNodes[i].setAttribute("type", "radio");
		yearpop.childNodes[i].setAttribute("name", "yeargroup");
		yearpop.childNodes[i].setAttribute("oncommand", "dsCalendar.changeDate(dsCalendar.month, this.label);");
		if (this.extraChangeYear) this.extraChangeYear(yearpop.childNodes[i]);
		if (newyear == yearlabel) {
			yearpop.childNodes[i].setAttribute("checked", true);
		}
	}
}


dsCalendar.disableCalendar = function(node, disable) {
	for (var x = 0; x < node.childNodes.length; x++) {
		var childNode = node.childNodes[x];
		if (disable) {
			childNode.setAttribute("disabled", disable);
		} else {
			childNode.removeAttribute("disabled");
		}
		if (childNode.hasChildNodes()) {
			this.disableCalendar(childNode, disable);
		}
	}
}

