<?php
    $ver="1.0.7";
    $lang="pl-PL";

    $win="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/".$ver."/win32/".$lang."/Thunderbird%20Setup%20".$ver.".exe";
    $lnx="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/".$ver."/linux-i686/".$lang."/thunderbird-".$ver.".tar.gz";
    $mac="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/".$ver."/mac/".$lang."/Thunderbird%20".$ver.".dmg";
    $contrib="http://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/".$ver."/contrib/";

    //$lnx_noinst="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/linux-i686/".$lang."/firefox-".$ver.".tar.gz";
    //$lngp_lnx="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/linux-i686/xpi/".$lang.".xpi";
    //$lngp_win="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/win32/xpi/".$lang.".xpi";
    //$lngp_mac="http://ftp.mozilla.org/pub/mozilla.org/firefox/releases/".$ver."/mac/xpi/".$lang.".xpi";
    
    $srccode="ftp://ftp.mozilla.org/pub/mozilla.org/thunderbird/releases/".$ver."/source/thunderbird-".$ver."-source.tar.bz2";
    
    $ua = $_SERVER["HTTP_USER_AGENT"];
    
    if (strpos($ua, "Linux")!== false) {
	 $tbfile=$lnx;
	 $dla="Linuksa";
    }

    else if (strpos($ua, "Mac") !== false) {
	$tbfile=$mac;
	$dla="Mac OS X";
    }
    else {
	$tbfile=$win;
	$dla="Windows";
    }

?>

