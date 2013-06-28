<?php
    // NIE DOTYKAJ NICZEGO W KODZIE PHP, O ILE NIE WIESZ, CO ROBISZ!
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Kontakt - AviaryPL</title>
<?php
    // zamkniecie head, poczatek body - wersja dla jednej kolumny
    include("_includes/col1_aftertitle.inc");

    // menu glowne i top strony
    include("_includes/common_menu.inc");
    
    // ponizej wlasciwy content w _odpowiednich_ divach
    // nalezy pamietac o id=col1of2 
?>

		<div id="col1of1">
				    <h1>Kontakt z nami</h1>

		<p>Wszelkie pytania do naszego zespołu prosimy kierować na adres e-mail: <a href="mailto:team@aviary.pl">team@aviary.pl</a>.</p>

		<p>Adresy e-mail poszczególnych członków zespołu znajdą Państwo na stronie &bdquo;<a 
href="zespol.php">Zespół</a>&rdquo;</p>
		</div>

<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    // include("_includes/col1_beforefooter.inc");

    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
