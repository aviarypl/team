<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Dla prasy - AviaryPL</title>
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
	       <h1>Informacje dla prasy</h1>

		<p>W tej części serwisu przedstawiamy informacje dla dziennikarzy zainteresowanych działalnością AviaryPL</p>

		</div>
		<div id="col2of2">
		<h2>Informacje prasowe</h2>
		<ul id="products">
			<li><a href="prasa-20050423-firefox102.php">Wydaliśmy Firefoksa 1.0.2</a></li>
			<li><a href="prasa-20050423-aviarypl.php">Start www.aviary.pl</a></li>
			<li>(UWAGA: martwe linki)</li>
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
