<?php
    // NIE DOTYKAJ NICZEGO W KODZIE PHP, O ILE NIE WIESZ, CO ROBISZ!
    // Naglowki - doctype, poczatek head, style, skrypty js
    include("_includes/common_header.inc");
?>
    <title>O nas - AviaryPL</title>
<?php
    // zamkniecie head, poczatek body - wersja dla jednej kolumny
    include("_includes/col1_aftertitle.inc");

    // menu glowne i top strony
    include("_includes/common_menu.inc");
    
    // ponizej wlasciwy content w _odpowiednich_ divach
    // nalezy pamietac o id=col1of2 i id=col2of2 dla danych kolumn
?>

		<div id="col1of1">
  <h1>Zespół AviaryPL</h1>

	<dl>
		  <dt>Zbigniew Braniecki (<a href="mailto:gandalf@aviary.pl">gandalf@aviary.pl</a>)</dt> 
		   <dd>Głowa zespołu, odpowiada za kontakty z naszymi zwierzchnikami oraz dba o to, by wewnątrz zespołu wszystko pracowało jak w zegarku.
		   </dd>

		  <dt>Marek Stępień (<a href="mailto:marcoos@aviary.pl">marcoos@aviary.pl</a>)</dt>

		   <dd>Kierownik lokalizacji przeglądarki Firefox oraz osoba odpowiedzialna za działanie i wygląd naszych stron internetowych.</dd>

		  <dt>Piotr Komoda (<a href="mailto:pitreck@aviary.pl">pitreck@aviary.pl</a>)</dt>
		   <dd>Kierownik lokalizacji klienta poczty i grup dyskusyjnych Thunderbird, a 
		   także osoba odpowiedzialna za kontakty z prasą.</dd>

		  <dt>Piotr Pielach (<a href="mailto:cleriic@aviary.pl">cleriic@aviary.pl</a>)</dt>
		   <dd>Osoba odpowiedzialna za testy i kontrolę jakości wydań AviaryPL, w 
		   szczególności Thunderbirda. Korektor tłumaczeń programów oraz tekstów publikowanych przez AviaryPL.</dd>

		  <dt>Wadim Dziedzic (<a href="mailto:nikdo@aviary.pl">nikdo@aviary.pl</a>)</dt>
		   <dd>Językoznawca i tłumacz. Pełni rolę korektora tłumaczeń programów oraz tekstów 
		   publikowanych przez AviaryPL. Tłumaczy to, czego nikt inny nie był w stanie się podjąć.</dd>
		  <dt>Stanisław Małolepszy (<a href="mailto:smalolepszy@aviary.pl">smalolepszy@aviary.pl</a>)</dt>
		   <dd>Językoznawca i tłumacz. Osoba odpowiedzialna za testy i kontrolę jakości 
		   wydań AviaryPL, w szczególności Firefoksa. Pełni też rolę korektora tłumaczeń publikowanych przez AviaryPL. 
		   Tłumaczy to, czego nikt inny nie był w stanie się podjąć.</dd>

          <dt>Irek Chmielowiec</dt>

           <dd>Osoba stanowiąca pomost pomiędzy użytkownikami końcowymi a zespołem AviaryPL.
           Odpowiada za pomoc techniczną, zbiera informacje o błędach które nie zostały zgłoszone do bugzilli oraz 
           nakierowuje użytkowników na gotowe rozwiązania znanych problemów. </dd>

          <dt>Paweł Chmielowski (<a href="mailto:prefiks@aviary.pl">prefiks@aviary.pl</a>)</dt>
           <dd>Osoba odpowiedzialna za lokalizację systemu raportowania i śledzenia 
           błędów <a href="http://www.bugzilla.org">Bugzilla</a>.</dd> 
		</dl>
		
		<h2>Osoby współpracujące z zespołem:</h2>

		
		<dl>
		 <dt>Wojciech Kapusta</dt>
		  <dd>Pseudonim: <q>Wojciech</q>. Korekta tłumaczeń programów oraz tekstów publikowanych przez 
		  AviaryPL.</dd> 
		 <dt>Grzegorz Podgórski</dt>
		  <dd>Pseudonim: <q>Grzegorz_P</q>. Główny betatester wydań AviaryPL.</dd>

		 <dt>Michał Błaszczyk</dt>
		  <dd>Pseudonim: <q>Mibla</q>. Grafik, osoba odpowiedzialna za szatę graficzną strony 
<a href="http://www.firefox.pl">Firefox.pl</a>.</dd>
		</dl>

		</div>

<?php
    // zamkniecie glownego kontenera - wersja dla dwoch kolumn
    // include("_includes/col1_beforefooter.inc");

    // koniec strony - stopka, koniec html
    include("_includes/common_footer.inc");
?>
