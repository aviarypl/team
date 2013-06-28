<?php
    $ver="1.5.0.2";
    $lang="pl";

    $mac="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/mac/".$lang."/Firefox%20".$ver.".dmg";
    $mac_ppc="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/1.5.0.2/mac-ppc/".$lang."/Firefox%20".$ver.".dmg";

    //$lnx="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/linux-i686/".$lang."/firefox-".$ver.".installer.tar.gz";

    $lnx_noinst="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/linux-i686/".$lang."/firefox-".$ver.".tar.gz";
    $lnx=$lnx_noinst;

    $win="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/win32/".$lang."/Firefox%20Setup%20".$ver.".exe";

    $lngp_lnx="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/linux-i686/xpi/".$lang.".xpi";
    $lngp_win="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/win32/xpi/".$lang.".xpi";
    $lngp_mac="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/mac/xpi/".$lang.".xpi";
    
    $srccode="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/source/firefox-".$ver."-source.tar.bz2";
    
    $ua = $_SERVER["HTTP_USER_AGENT"];
    
    if (strpos($ua, "Linux")!== false) {
	 $fxfile=$lnx;
	 $fximg="get-lin.jpg";
	 $dla="Linuksa";
    }

    else if (strpos($ua, "Mac") !== false) {
	$fxfile=$mac;
	$fximg="get-mac.jpg";
	$dla="Mac OS X";
    }
    else {
	$fxfile=$win;
	$fximg="get-win.jpg";
	$dla="Windows";
    }

?>

