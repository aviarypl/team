<?php
    // NIE DOTYKAJ NICZEGO W KODZIE PHP, O ILE NIE WIESZ, CO ROBISZ!
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Strona glowna</title>
<?php
    // zamkniecie head, poczatek body - wersja dla jednej kolumny
    include("_includes/col1_aftertitle.inc");

    // menu glowne i top strony
    include("_includes/common_menu.inc");
    
    // ponizej wlasciwy content w _odpowiednich_ divach
    // nalezy pamietac o id=col1of2 i id=col2of2 dla danych kolumn
?>

		<div id="col1of1">
			<h1>Naglowek</h1>
			<p>Lorem ipsum dolor sit amet consectetur adipiscint elit.</p>
			<h2>Naglowek 2 rzedu</h2>
			<p>Lorem ipsum costam costam.</p>
		</div>

<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    // include("_includes/col1_beforefooter.inc");

    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
