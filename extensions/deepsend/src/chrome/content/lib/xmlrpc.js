// Some easier XML-RPC methods for Mozilla.
// 12/7/2005, 26/12/2005, 6/1/2006 David Murray.
// http://deepestsender.mozdev.org/
// v0.4


// Usage:
// makeXMLRpcCall(String methodname, Object rpcobj):
// Returns an XML document, ideally for sending through XMLHttpRequest().
//	Firstly, bunch up all the objects you want to send via XML-RPC into an array. Then use the makeXMLRpcCall() function to create
//	an XML document with everything. The first parameter to pass is the method name, the second parameter is the array you want to send.
//	XML document is returned, which you can send off via the usual XMLHttpRequest() method.

// parseXMLRpcResponse(Document obj):
// Returns an array (or object if faults are found), where each item corresponds to the item found in the response document.
//	Upon receiving a response from XMLHttpRequest(), run the .responseXML through the parseXMLRpcResponse() function. If no params tag is found, an
//	exception is thrown. Otherwise, an array/object will be the return value. If .faultCode or .faultString exist, then there was an error on the server side.
//	If not, the array returned will be full of all the objects returned from the response, in their proper JavaScript forms too.

// Strings are sent as <string>.
// Integers are sent as <i4> (and recognised if they're <i4> or <int>).
// Numbers with decimal notation are sent as <double>.
// Arrays are sent as <array>.
// Objects are sent as <struct>.
// Dates are sent as <dateTime.iso8601>.
// Booleans are sent as <boolean>.
// Implementation was made according to the spec at http://www.xmlrpc.com/spec

// Note: The idea was to base64 encode anything that wasn't recognised. This hasn't been written yet, so base64 isn't supported. I think there should also be a way
//	to override the type of object sent (ie. if you wanted to send a string as base64 or whatever). Other limitation is you can't send null values - it causes
//	the convertor to crap out.

// The aim of these two functions is to simplify XML-RPC in Mozilla to the point where it is trivial. The current implementation requires creating XPCOM objects
//	all over the place, won't automatically recognise object types, throws exceptions every 2 seconds, does a lot of other stuff that results in hair loss,
//	and in general just plain sucks horribly (well, I think it does anyway). I don't think anyone has actually ever tested it to see it works.

function makeXMLRpcCall(methodname, rpcarray) {
	this.xml = document.implementation.createDocument("", "methodCall", null);
	
	xml.insertBefore(xml.createProcessingInstruction("xml", "version=\"1.0\" encoding=\"utf-8\""), xml.documentElement);
	
	xml.documentElement.appendChild(xml.createElement("methodName"));
	xml.documentElement.firstChild.appendChild(xml.createTextNode(methodname));
	var params = xml.documentElement.appendChild(xml.createElement("params"));
    
	for (z = 0; z < rpcarray.length; z++) {
		var param = params.appendChild(xml.createElement("param"));
		var value = param.appendChild(xml.createElement("value"));
		value.appendChild(convertToXML(rpcarray[z]));
	}
	
	return xml;
}

function convertToXML(obj) {
	var xml = document.implementation.createDocument("", "tempdoc", null);
	var findtype = new RegExp("function (.*?)\\(\\) \\{.*");
	switch (findtype.exec(obj.constructor.toString())[1]) {
		case "Number":
			// Numbers can only be sent as integers or doubles.
			if (Math.floor(obj) != obj) {
				var numtype = xml.createElement("double");
			} else {
				var numtype = xml.createElement("i4");
			}
			var number = xml.documentElement.appendChild(numtype);
			number.appendChild(xml.createTextNode(obj));
			break;
		case "String":
			var string = xml.documentElement.appendChild(xml.createElement("string"));
			string.appendChild(xml.createTextNode(obj));
			break;
		case "Boolean":
			var bool = xml.documentElement.appendChild(xml.createElement("boolean"));
			bool.appendChild(xml.createTextNode(obj * 1));
			break;
		case "Object":
			var struct = xml.documentElement.appendChild(xml.createElement("struct"));
			for (var w in obj) {
				var member = struct.appendChild(xml.createElement("member"));
				var membername = member.appendChild(xml.createElement("name"));
				membername.appendChild(xml.createTextNode(w));
				var value = member.appendChild(xml.createElement("value"));
				value.appendChild(convertToXML(obj[w]));
			}
			break;
		case "Date":
			var date = xml.documentElement.appendChild(xml.createElement("dateTime.iso8601"));
			var datetext = obj.toISO8601String(4);
			date.appendChild(xml.createTextNode(datetext));
			break;
		case "Array":
			var array = xml.documentElement.appendChild(xml.createElement("array"));
			var data = array.appendChild(xml.createElement("data"));
			for (var y in obj) {
				var value = data.appendChild(xml.createElement("value"));
				value.appendChild(convertToXML(obj[y]));
			}
			break;
		default:
			dump("\n" + obj + " - wtf is this data type you're spewing forth? It's been sent as a base64.");
			// Hellishly awful binary encoding shit goes here.
			break;
	}
	return xml.documentElement.firstChild;
}

function padNumber(num) {
	if (num < 10) {
		num = "0" + num;
	}
	return num;
}

function removeWhiteSpace(node) {
	var notWhitespace = /\S/
	for (var x = 0; x < node.childNodes.length; x++) {
		var childNode = node.childNodes[x];
		if ((childNode.nodeType == 3)&&(!notWhitespace.test(childNode.textContent))) {
			// that is, if it's a whitespace text node
			node.removeChild(node.childNodes[x]);
			x--;
		}
		if (childNode.nodeType == 1) {
			// elements can have text child nodes of their own
			removeWhiteSpace(childNode);
		}
	}
}

function parseXMLRpcResponse(xml) {
	removeWhiteSpace(xml);
	var methodresponse = xml.documentElement;
	var rpcresponse = new Array();
	if (methodresponse.tagName != "methodResponse") {
		throw "No methodResponse found!";
	} else {
		var params = methodresponse.firstChild;
		if (params.tagName == "fault") {
			var faultstruct = params.firstChild.firstChild;
			return convertFromXML(faultstruct);
		} else {
			for (r = 0; r < params.childNodes.length; r++) {
				var value = params.childNodes[r].firstChild.firstChild;
				rpcresponse.push(convertFromXML(value));
			}
		}
	}
	return rpcresponse;
}

function convertFromXML(obj) {
	var data;
	switch (obj.tagName) {
		case "double":
		case "i4":
		case "int":
			var number = obj.textContent;
			data = number * 1;
			break;
		case "boolean":
			var bool = obj.textContent;
			if ((bool == "true") || (bool == "1")) {
				data = true;
			} else {
				data = false;
			}
			break;
		case "dateTime.iso8601":
			var date = obj.textContent;
			data = new Date();
			// Dear Diary, how come WordPress thinks ISO8601 formatted time is some insane mangled string?
			data.setFullYear(date.substring(0,4), date.substring(4,6) - 1, date.substring(6,8));
			data.setHours(date.substring(9,11), date.substring(12,14), date.substring(15,17));
			break;
		case "array":
			data = [];
			var datatag = obj.firstChild;
			for (var k = 0; k < datatag.childNodes.length; k++) {
				var value = datatag.childNodes[k];
				data.push(convertFromXML(value.firstChild));
			}
			break;
		case "struct":
			data = new Object();
			for (var j = 0; j < obj.childNodes.length; j++) {
				var membername = obj.childNodes[j].getElementsByTagName("name")[0].textContent;
				var membervalue = obj.childNodes[j].getElementsByTagName("value")[0].firstChild;
				if (membervalue) {
					data[membername] = convertFromXML(membervalue);
				} else {
					data[membername] = null;
				}
			}
			break;
		case "string":
		default:
			data = obj.textContent;
			break;
	}
	return data;
}


// ISO formatting stolen from http://delete.me.uk/2005/03/iso8601.html
Date.prototype.setISO8601 = function (string) {
	var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
		"(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
		"(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
	var d = string.match(new RegExp(regexp));

	var offset = 0;
	var date = new Date(d[1], 0, 1);

	if (d[3]) { date.setMonth(d[3] - 1); }
	if (d[5]) { date.setDate(d[5]); }
	if (d[7]) { date.setHours(d[7]); }
	if (d[8]) { date.setMinutes(d[8]); }
	if (d[10]) { date.setSeconds(d[10]); }
	if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
	if (d[14]) {
		offset = (Number(d[16]) * 60) + Number(d[17]);
		offset *= ((d[15] == '-') ? 1 : -1);
	}

	offset -= date.getTimezoneOffset();
	time = (Number(date) + (offset * 60 * 1000));
	this.setTime(Number(time));
}

Date.prototype.toISO8601String = function (format, offset) {
	/* accepted values for the format [1-6]:
	1 Year:
	YYYY (eg 1997)
	2 Year and month:
	YYYY-MM (eg 1997-07)
	3 Complete date:
	YYYY-MM-DD (eg 1997-07-16)
	4 Complete date plus hours and minutes:
       YYYY-MM-DDThh:mmTZD (eg 1997-07-16T19:20+01:00)
	5 Complete date plus hours, minutes and seconds:
	YYYY-MM-DDThh:mm:ssTZD (eg 1997-07-16T19:20:30+01:00)
	6 Complete date plus hours, minutes, seconds and a decimal
	fraction of a second
	YYYY-MM-DDThh:mm:ss.sTZD (eg 1997-07-16T19:20:30.45+01:00)
	*/
	if (!format) { var format = 6; }
	if (!offset) {
		var offset = 'Z';
		var date = this;
	} else {
		var d = offset.match(/([-+])([0-9]{2}):([0-9]{2})/);
		var offsetnum = (Number(d[2]) * 60) + Number(d[3]);
		offsetnum *= ((d[1] == '-') ? -1 : 1);
		var date = new Date(Number(Number(this) + (offsetnum * 60000)));
	}

	var zeropad = function (num) { return ((num < 10) ? '0' : '') + num; }

	var str = "";
	str += date.getUTCFullYear();
	if (format > 1) { str += "-" + zeropad(date.getUTCMonth() + 1); }
	if (format > 2) { str += "-" + zeropad(date.getUTCDate()); }
	if (format > 3) {
		str += "T" + zeropad(date.getUTCHours()) +
		":" + zeropad(date.getUTCMinutes());
	}
	if (format > 5) {
		var secs = Number(date.getUTCSeconds() + "." +
			((date.getUTCMilliseconds() < 100) ? '0' : '') +
			zeropad(date.getUTCMilliseconds()));
		str += ":" + zeropad(secs);
	} else if (format > 4) { str += ":" + zeropad(date.getUTCSeconds()); }

	if (format > 3) { str += offset; }
	return str;
}
