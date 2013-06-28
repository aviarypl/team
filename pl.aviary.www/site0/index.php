<?php
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Strona główna - AviaryPL</title>
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
			<h1>Witamy na stronach AviaryPL!</h1>
			<p>Zespół AviaryPL to grupa programistów i tłumaczy pracujących nad
			 polskimi wersjami produktów <a href="http://www.mozillafoundation.org/">Fundacji Mozilla</a>,
			która swą działalność formalnie rozpoczęła w marcu 2004 r. Celem zespołu
			AviaryPL jest przygotowywanie spolonizowanych wydań
			przeglądarki internetowej Mozilla&reg; Firefox&trade; oraz
			programu do obsługi poczty e-mail i grup dyskusyjnych, Mozilla&reg;
			Thunderbird&trade; oraz innych aplikacji będących produktami bądź
			projektami Fundacji Mozilla, a także ich promocja w Polsce.
			</p>

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
			<li><a href="proj-sunbird.php">Mozilla Sunbird</a></li>
			<li><a href="proj-bugzilla.php">Bugzilla</a></li>
		</ul>

		<h2>TODO</h2>
		<ul>
			<li>content</li>
			<li>content</li>
			<li>i jeszcze raz content</li>
			<li>lepsza dostępność (WAI)</li>
			<li>testy w IE (nie było <strong>w ogóle</strong> sprawdzane w IE)</li>
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
