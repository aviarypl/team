<?php
    // NIE DOTYKAJ NICZEGO W KODZIE PHP, O ILE NIE WIESZ, CO ROBISZ!
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>Strona glowna</title>
<?php
    // zamkniecie head, poczatek body - wersja dla dwoch kolumn
    include("_includes/col2_aftertitle.inc");

    // menu glowne, top strony
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
			<li><a id="col2-fx" href="firefox">Mozilla Firefox</a></li>
			<li><a id="col2-tb" href="thunderbird">Mozilla Thunderbird</a></li>
			<li><a id="col2-nvu" href="nvu">Nvu</a></li>
		</ul>
		<h2>Projekty lokalizacyjne w toku</h2>
		<ul>
			<li class="sbli"><a href="sunbird">Mozilla Sunbird</a></li>
			<li class="bzli"><a href="bugzilla">Bugzilla</a></li>
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

    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>