use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();
log_in($sel, $config, 'admin');

# Tworzy pola dodatkowe, oznacza je jako niepotrzebne, 
# a potem natychmiast usuwa

go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");

my @types = ("Identyfikator błędu", "Duże pole tekstowe", "Pole tekstowe", "Pole wielokrotnego wyboru",
             "Lista rozwijana", "Data/Czas");
my $counter = int(rand(10000));

foreach my $type (@types) {
    my $fname = "cf_pole" . ++$counter;
    my $fdesc = "Pole" . $counter;

    $sel->click_ok("link=Nowe pole dodatkowe");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Dodawanie dodatkowego pola");
    $sel->type_ok("name", $fname);
    $sel->type_ok("desc", $fdesc);
    $sel->select_ok("type", "label=$type");
    $sel->click_ok("obsolete");
    $sel->click_ok("create");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Utworzono pole dodatkowe");
    $sel->click_ok("//a[\@href='editfields.cgi?action=del&name=$fname']");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usuwanie pola dodatkowego „$fname” ($fdesc)");
    $sel->click_ok("link=Usuń pole „$fdesc”");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usunięto pole dodatkowe");
}

logout($sel);
