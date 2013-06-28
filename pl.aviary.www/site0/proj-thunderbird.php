<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Projekty: Thunderbird - AviaryPL</title>
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
	    <h1>Mozilla Thunderbird</h1>

		<div class="logofloat"><img src="icons/tb52x52.gif" alt="" title="Logo programu Mozilla Thunderbird" /></div>

		<p>Thunderbird to darmowy klient poczty i grup dyskusyjnych, stanowiący wolne oprogramowanie, dostępny dla systemów Windows, GNU/Linux i Mac OS X (a także innych). Obsługuje standardowe protokoły POP3, SMTP, IMAP i NNTP, posiada także agregator wiadomości RSS/Atom. Jedną z najbardziej lubianych przez użytkowników opcji jest wbudowany filtr niepożądanej poczty (&bdquo;spamu&rdquo;). </p>
		
		<p>Więcej informacji o programie znajdą Państwo na stronach serwisu
<a href="http://www.thunderbird.pl">Thunderbird.pl</a>.</p>

		<h2>AviaryPL a Thunderbird</h2>


		<p>Od początku 2004 roku AviaryPL wydaje spolszczone wydania Mozilli Thunderbird dla systemów Windows, Mac OS X i Linux.</p>

		<p>Kierownik projektu lokalizacyjnego: <a href="mailto:pitreck@aviary.pl">Piotr Komoda</a><br />
Kontrola jakości lokalizacji: <a href="mailto:cleriic@aviary.pl">Piotr Pielach</a></p>
		
		</div>
		<div id="col2of2">

		<h2>Pobierz Thunderbirda 1.0.2</h2>
		<ul id="products">
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/win32/pl-PL/Thunderbird%20Setup%201.0.2.exe">Wersja dla Windows</a></li>
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/linux-i686/pl-PL/thunderbird-1.0.2.tar.gz">Wersja dla Linuksa</a></li>
			<li><a href="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/1.0.2/mac/pl-PL/Thunderbird%201.0.2.dmg">Wersja dla Mac OS X</a></li>
		</ul>
		<h2>Zasoby</h2>
		<ul>
			<li><a href="http://www.thunderbird.pl/" title="Polska strona Mozilli Thunderbird">Thunderbird.pl</a></li>
			<li><a href="http://www.mozilla-europe.org/pl/products/thunderbird">Mozille Europe: Thunderbird</a></li>
			<li><a href="http://www.mozillapl.org/forum/index.php?c=7">Forum dyskusyjne</a></li>
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
