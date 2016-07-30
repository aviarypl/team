use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Wyłączenie 'requirelogin' i wylogowanie z Bugzilli.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"requirelogin-on" => undef} });
logout($sel);

# Otwarcie config.cgi. Żadne ważne dane nie powinny zostać ujawnione

$sel->open_ok("/$config->{bugzilla_installation}/config.cgi", undef, "Utwiera config.cgi (JS format)");
$sel->is_text_present_ok("var status = [ ];");
$sel->is_text_present_ok("var status_open = [ ];");
$sel->is_text_present_ok("var status_closed = [ ];");
$sel->is_text_present_ok("var resolution = [ ];");
$sel->is_text_present_ok("var keyword = [ ];");
$sel->is_text_present_ok("var platform = [ ];");
$sel->is_text_present_ok("var severity = [ ];");
$sel->is_text_present_ok("var field = [\n];");

ok(!$sel->is_text_present("cf_"), "Pola dodatkowe ukryte");
ok(!$sel->is_text_present("component["), "Komponenty ukryte");
ok(!$sel->is_text_present("version["), "Numer wersji ukryty");
ok(!$sel->is_text_present("target_milestone["), "Wersje docelowe ukryte");

# Włączenie z powrotem 'requirelogin' i wylogowanie.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"requirelogin-off" => undef} });
logout($sel);
