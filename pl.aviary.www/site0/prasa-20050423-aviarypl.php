<?php
    // NIE DOTYKAJ NICZEGO W KODZIE PHP, O ILE NIE WIESZ, CO ROBISZ!
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Informacja prasowa - AviaryPL</title>
<?php
    // zamkniecie head, poczatek body - wersja dla jednej kolumny
    include("_includes/col1_aftertitle.inc");

    // menu glowne i top strony
    include("_includes/common_menu.inc");
    
    // ponizej wlasciwy content w _odpowiednich_ divach
    // nalezy pamietac o id=col1of2 i id=col2of2 dla danych kolumn
?>

		<div id="col1of1">
			<h1>Start serwisu AviaryPL</h1>
			<p>W dniu XX marca 2005 zespół AviaryPL uruchomił oficjalnie
			swoją stronę internetową.</p>
			<p>
		</div>

<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    // include("_includes/col1_beforefooter.inc");

    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
