function MakeMask(mainmask, addbit) {
	// Creates the mask number to use.
	// In: The actual mask number as it is now, and the bit number to turn on.
	// Out: The mask, with the bit turned on.
	var z = 1 << addbit;
	var newmask = mainmask | z;
	return newmask;
}

function BreakMask(mainmask, addbit) {
	// Returns true if specified bit number is on, false if it isn't.
	// In: The mask to use to compare, the bit number to check if it is turned on.
	// Out: True if the bit is on, false if it isn't.
	var z = 1 << addbit;
	var testmask = mainmask & z;
	if (testmask == z) {
		return true;
	} else {
		return false;
	}
}

