<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Projekty: Firefox - AviaryPL</title>
<?php
    // zamkniecie head, poczatek body - wersja dla dwoch kolumn
    include("_includes/col2_aftertitle.inc");
?>
<?php
    include("_includes/common_menu.inc");
    
    // ponizej wlasciwy content w _odpowiednich_ divach
    // nalezy pamietac o id=col1of2 i id=col2of2 dla danych kolumn
?>

		<div id="col1of2">
	    <h1>Mozilla Firefox</h1>

		<div class="logofloat"><img src="icons/fx52x52.gif" alt="" title="Logo przeglądarki Mozilla Firefox" /></div>

		<p>Mozilla Firefox jest przeglądarką www nowej generacji, używaną obecnie przez dziesiątki milionów użytkowników na całym świecie. Cechuje się wygodą i łatwością obsługi, dużymi możliwościami i modularną budową, dzięki której można ją rozbudować praktycznie w nieskończoność.</p>
		
		<p>Więcej informacji o programie znajdą Państwo na stronach serwisu
<a href="http://www.firefox.pl">Firefox.pl</a>.</p>

		<h2>AviaryPL a Firefox</h2>


		<p>Od listopada 2003 roku zespół AviaryPL prowadzi polską lokalizację przeglądarki internetowej Mozilla Firefox. Przeglądarka ta była pierwszym produktem, którego
pełną polską lokalizację przygotował nasz zespół.
		</p>
		<p>Kierownik projektu lokalizacyjnego: <a href="mailto:marcoos@aviary.pl">Marek Stępień</a><br />
Kontrola jakości lokalizacji: <a href="mailto:smalolepszy@aviary.pl">Stanisław Małolepszy</a></p>
		
		</div>
		<div id="col2of2">

		<h2>Pobierz Firefoksa 1.0.2</h2>
		<ul id="products">
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/1.0.2/win32/pl-PL/Firefox%20Setup%201.0.2.exe">Wersja dla Windows</a></li>
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/1.0.2/linux-i686/pl-PL/firefox-1.0.2.installer.tar.gz">Wersja dla Linuksa</a></li>
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/1.0.2/mac/pl-PL/Firefox%201.0.2.dmg">Wersja dla Mac OS X</a></li>
		</ul>
		<h2>Zasoby</h2>
		<ul>
			<li><a href="http://www.firefox.pl/" title="Polska strona Mozilli Firefox">Firefox.pl</a></li>
			<li><a href="http://www.mozilla-europe.org/pl/products/firefox">Mozille Europe: Firefox</a></li>
			<li><a href="http://www.mozillapl.org/forum/index.php?c=6">Forum dyskusyjne</a></li>
		</ul>

		</div>




<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    include("_includes/col2_beforefooter.inc");
?>
<?php
    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
