// IE jest glupie i nie umie :hover, wiec mu je zaemulujemy :)

var linki = document.getElementById("moznet").getElementsByTagName("a");
var spany = document.getElementById("moznet").getElementsByTagName("span");

try {
	if (linki.length!=spany.length) throw "Liczba linkow nie zgadza sie z liczba spanow";
	
	for (i=0; i<linki.length; i++) {
		spany[i].id="IEFIX_spn"+i;
		// Microsoft to idioci. Wg standardu ta metoda powinna się nazywać
		// addEventListener, a nie attachEvent. Ale co M$ obchodzą standardy, nie? :) 
		linki[i].attachEvent("onmouseover", new Function("document.getElementById('IEFIX_spn"+i+"').style.display='inline'"));
		linki[i].attachEvent("onmouseout", new Function("document.getElementById('IEFIX_spn"+i+"').style.display='none'"));
	}
	
} catch (e) {
	// alert("Blad: " + e + ". Skontaktuj sie z administratorem serwisu.");
}