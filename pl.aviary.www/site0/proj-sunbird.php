<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Projekty: Sunbird - AviaryPL</title>
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
	    <h1>Mozilla Sunbird</h1>

		<div class="logofloat"><img src="icons/sb52x52.gif" alt="" title="Logo programu Mozilla Sunbird" /></div>

		<p>Mozilla Sunbird to projekt Mozilla.org mający na celu zbudowanie aplikacji kalendarzowej, mającej stanowić uzupełnienie <a href="proj-thunderbird.php">Mozilli Thunderbird</a>. Obecnie znajduje się on we wczesnej fazie rozwoju.</p>
		
		<p>Więcej informacji o programie znajdą Państwo na anglojęzycznych stronach projektu 
<a href="http://www.mozilla.org/projects/sunbird">mozilla.org/projects/sunbird</a>.</p>

		<h2>AviaryPL a Sunbird</h2>


		<p>Zespół AviaryPL przygotowuje obecnie lokalizację Mozilli Sunbird.</p>

		<!-- <p>Kierownik projektu lokalizacyjnego: <a href="mailto:smalolepszy@aviary.pl">Stanisław Małolepszy</a><br />
Kontrola jakości lokalizacji: <a href="mailto:gandalf@aviary.pl">Zbigniew Braniecki</a></p>
		-->

		</div>
		<div id="col2of2">

		<!-- <h2>Pobierz Mozillę Sunbird 0.x</h2>
		<ul id="products">
			<li><a href=".exe">Wersja dla Windows</a></li>
			<li><a href=".tar.gz">Wersja dla Linuksa</a></li>
			<li><a href=".dmg.gz">Wersja dla Mac OS X</a></li>
		</ul>-->
		<h2>Zasoby</h2>
		<ul>
			<li><a href="http://www.mozilla.org/projects/sunbird" title="Strona projektu Sunbird">Strona projektu</a></li>
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
