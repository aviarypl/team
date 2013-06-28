<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Projekty - AviaryPL</title>
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
	    <h1>Projekty</h1>

		<p>Tlumaczymy i dostosowujemy do polskich warunków następujące programy <a href="http://www.mozilla.org/foundation">Mozilla Foundation</a> i <a href="http://www.disruptive-innovations.com">Disruptive Innovations</a>:</p>

		<h2><img alt="" src="icons/fx36x36.gif" class="inlineimg" /><a href="proj-firefox.php">Mozilla Firefox</a></h2>

		<p>Firefox to darmowa przeglądarka www, stanowiąca wolne oprogramowanie, dostępna dla systemów Windows, GNU/Linux i Mac OS X. Jest mała i szybka, a jednocześnie oferuje szerokie możliwości. Firefox pozwoli Ci przeglądać strony www szybciej, bezpieczniej i wygodniej niż inne przeglądarki internetowe.</p>

		<h2><img alt="" src="icons/tb36x36.gif" class="inlineimg" /><a href="proj-thunderbird.php">Mozilla Thunderbird</a></h2>

		<p>Thunderbird to darmowy klient poczty i grup dyskusyjnych dostępny dla systemów Windows, GNU/Linux i Mac OS X (a także innych). Posiada wbudowany filtr antyspamowy
oraz czytnik kanałów RSS i Atom.</p>

		<h2><img alt="" src="icons/nvu36x36.gif" class="inlineimg" /> <a href="proj-nvu.php">Nvu</a></h2>

		<p>Nvu to darmowy wizualny edytor HTML i CSS, oparty na technologiach Mozilli. Pozwala na wygodne tworzenie zgodnych ze standardami stron internetowych. Dostępny dla Windows, GNU/Linux i Mac OS X.</p>

		<h2>Prace w toku</h2>

		<h3><img alt="" src="icons/bz36x47.gif" class="inlineimg" /> <a href="proj-bugzilla.php">Bugzilla</a></h3>

		<p>Zaawansowany system obsługi błędów, niezbędny dla każdego zespołu programistycznego.</p>

		<h3><img alt="" src="icons/sb36x36.gif" class="inlineimg" /> <a href="proj-sunbird.php">Mozilla Sunbird</a></h3>

		<p>Program kalendarzowy oparty na technologiach Mozilli.</p>

		</div>
		<div id="col2of2">
		<h2>Zlokalizowane produkty</h2>
		<ul id="products">
			<li><a href="proj-firefox.php">Mozilla Firefox</a></li>
			<li><a href="proj-thunderbird.php">Mozilla Thunderbird</a></li>
			<li><a href="proj-nvu.php">Nvu</a></li>
		</ul>
		<h2>Projekty lokalizacyjne w toku</h2>
		<ul>
			<li class="sbli"><a href="proj-sunbird.php">Mozilla Sunbird</a></li>
			<li><a href="proj-bugzilla.php">Bugzilla</a></li>
		</ul>

		<!--<h2>Wdrożenia</h2>
		<ul>
			<li><a href="">FooShmoo International</a></li>
			<li><a href="">BarBaz (Poland) Sp. z o.o.</a></li>
			<li><a href="">Towarzystwo Przyjaźni Polsko-Birmańskiej</a></li>
		</ul>-->
		</div>




<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    include("_includes/col2_beforefooter.inc");
?>
<?php
    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
