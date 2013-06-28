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
	    <h1>Nvu</h1>

		<div class="logofloat"><img src="icons/nvu46x46.gif" alt="" title="Logo programu Nvu" /></div>

		<p>Nvu to darmowy wizualny edytor stron internetowych (HTML, CSS) tworzony przez firmę <a href="http://www.disruptive-innovations.com">Disruptive Innovations, SARL</a> na bazie  technologii Mozilli.</p>
		
		<p>Więcej informacji o programie znajdą Państwo na stronach serwisu
<a href="http://www.aviary.pl/nvu">aviary.pl/nvu</a>.</p>

		<h2>AviaryPL a Nvu</h2>


		<p>Zespół AviaryPL przygotowuje spolszczone wydania programu Nvu dla systemów Windows i Linux.</p>

		<p>Kierownik projektu lokalizacyjnego: <a href="mailto:smalolepszy@aviary.pl">Stanisław Małolepszy</a><br />
Kontrola jakości lokalizacji: <a href="mailto:gandalf@aviary.pl">Zbigniew Braniecki</a></p>
		
		</div>
		<div id="col2of2">

		<h2>Pobierz Nvu 0.90</h2>
		<ul id="products">
			<li><a href="http://beta.aviary.pl/nvu/0.9/nvu-0.90-win32-installer-pl-PL.exe">Wersja dla Windows</a></li>
			<li><a href="http://beta.aviary.pl/nvu/0.9/nvu-0.90-linux2.6.10-pl-PL.tar.bz2">Wersja dla Linuksa</a></li>
			<li><a href="http://beta.aviary.pl/nvu/0.9/nvu-0.90-pc-fedora3-kde-pl-PL.tar.bz2">Wersja dla Fedora Linux</a></li>
		</ul>
		<h2>Zasoby</h2>
		<ul>
			<li><a href="http://www.aviary.pl/nvu" title="Polska strona Nvu">Polska strona Nvu</a></li>
			<li><a href="http://www.nvu.com">Nvu.com</a></li>
			<li><a href="http://www.mozillapl.org/forum/forum-11.html">Forum dyskusyjne</a></li>
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
