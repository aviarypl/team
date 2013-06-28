<?php
    // lamerskie redirecty ;-)
    
    switch ($_SERVER["SERVER_NAME"]) {
	case "wiki.aviary.pl":
	    header("Location: http://wiki.aviary.pl/wiki/");
	    exit(0);
	    break;
	case "tinderbox.aviary.pl";
	    header("Location: tinderbox.html");
	    exit(0);
	    break;
	default:
    }

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html lang="pl">
    <head>
	<title>others.aviary.pl: witryna robocza</title>
        <meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-2" >
	<link rel="stylesheet" type="text/css" href="oap.css">
    </head>
    <body>
	
	<div id="top">
	    <div id="tr"></div>
	    <h1><a href="http://www.aviary.pl">aviary.pl</a></h1>
	    <div id="br"></div>
	</div>
	
	<div class="sect">
	    <h2>others.aviary.pl - robocza witryna zespołu AviaryPL</h2>
	    <ul>
		<li><a href="http://wiki.aviary.pl/wiki/">AviaryPL Wiki</a> - wewnętrzne wiki polskiego projektu lokalizacyjnego</li>
		<li><a href="http://others.aviary.pl/tinderbox.html">Polish Tinderbox Status</a> - status tinderboks&oacute;w polskiej lokalizacji</li>
		<li><a href="http://others.aviary.pl/tinderboxintl.html">Other L10ns Tinderbox Status</a> - tinderboxen status for other l10ns (view source for detailed 
usage instructions)<li>
		<li><a href="attic/">AviaryPL Attic</a> - strych ze starociami ;-)</li>
		<li><a href="restricted/">Restricted</a> - materiały do użytku wewnętrznego, wymaga logowania</li>
	    </ul>
	    
	</div>
	
	<div class="sect sm cn"><a href="http://www.aviary.pl">aviary.pl</a> | <a href="http://www.firefox.pl/">firefox.pl</a> 
	| <a href="http://www.thunderbird.pl">thunderbird.pl</a> | <a href="http://www.sunbird.pl">sunbird.pl</a> |
	<a href="http://www.camino.org.pl">camino.org.pl</a> | <a href="http://www.nvu.pl/">nvu.pl</a> | <a href="http://www.seamonkey.pl">seamonkey.pl</a></div>

    </body>
</html>
