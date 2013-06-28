<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Projekty: Nvu - AviaryPL</title>
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
	    <h1>Bugzilla</h1>

		<div class="logofloat"><img src="icons/bz52x68.gif" alt="" title="Logo programu Bugzilla" /></div>

		<p>Bugzilla jest systemem zarządzania błędami. Napisana w Perlu Bugzilla jest uznawana za de-facto standard w dziedzinie tego rodzaju systemów. Obecnie Bugzilla jest używana w szeregu firm do pomocy przy rozwoju ich własnych aplikacji.</p>
		
		<p>Więcej informacji o programie znajdą Państwo na stronach serwisu
<a href="http://www.bugzilla.org">bugzilla.org</a>.</p>

		<h2>AviaryPL a Bugzilla</h2>

		<p>W chwili obecnej zespół AviaryPL przygotowuje polską lokalizację Bugzilli. Zostanie ona udostępniona wkrótce.</p>

		<p>Kierownik projektu lokalizacyjnego: <a href="mailto:prefiks@aviary.pl">Paweł Chmielowski</a><br />
<!-- ??? Kontrola jakości lokalizacji: <a href="mailto:gandalf@aviary.pl">Zbigniew Braniecki</a> --></p>
		
		</div>
		<div id="col2of2">

		<h2>Zasoby</h2>
		<ul>
			<li><a href="http://www.bugzilla.org/" title="Strona projektu Bugzilla">Bugzilla.org</a></li>
			<li><a href="http://www.mozilla-europe.org/pl/products/bugzilla">Mozilla-Europe: Bugzilla</a></li>
		</ul>

		<h2>Bugzilla w działaniu</h2>
		<ul>
			<li><a href="http://bugs.aviary.pl/">bugs.aviary.pl</a> &ndash; nasz system obsługi błędów działa w oparciu o aktualnie przez nas tłumaczoną wersję Bugzilli.</li>
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
