use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Włączanie kategorii

log_in($sel, $config, 'admin');
set_parameters($sel, { "Pola błędu" => {"useclassification-on" => undef} });

# Dodawanie nowej kategorii

go_to_admin($sel);
$sel->click_ok("link=Kategorie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór kategorii");

# Jeśli test wykonał się wcześniej niepoprawnie, poniżej usuwa stare kategorie
# Wykonanie polecenie action=delete powinno 1 wywołać stronę bezpieczeństwa,
# 2) automatycznie usunąć wszystkie produkty z usuwanych kategorii
if ($sel->is_text_present("kat_pierwsza")) {
    $sel->open_ok("/$config->{bugzilla_installation}/editclassifications.cgi?action=delete&amp;classification=kat_pierwsza");
    $sel->title_is("Podejrzana czynność");
    $sel->click_ok("confirm");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usunięto kategorię");
}
if ($sel->is_text_present("kat_druga")) {
    $sel->open_ok("/$config->{bugzilla_installation}/editclassifications.cgi?action=delete&amp;classification=kat_druga");
    $sel->title_is("Podejrzana czynność");
    $sel->click_ok("confirm");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usunięto kategorię");
}

$sel->click_ok("link=Dodaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie kategorii");
$sel->type_ok("classification", "kat_pierwsza");
$sel->type_ok("description", "Kategoria numer 1");
$sel->click_ok('//input[@type="submit" and @value="Dodaj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową kategorię");

# Dodawanie produktu TestProduct do nowej kategorii.
# To powinien być jedyny produkt dodany do tej kategorii.

$sel->select_ok("prodlist", "value=TestProduct");
$sel->click_ok("add_products");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana kategorii produktów");
my @products = $sel->get_select_options("myprodlist");
ok(scalar @products == 1 && $products[0] eq 'TestProduct', "TestProduct został dodany do kategorii 'kat_pierwsza'");


# Tworzenie nowego błędu w tej parze kategorii/produktu.

file_bug_in_product($sel, 'TestProduct', 'kat_pierwsza');
my $bug_summary = "Błąd w kategorii pierwszej";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Utworzony przez test Selenium w czasie wykonywania testu sprawdzającego kategorie");
create_bug($sel, $bug_summary);

# Próba zmiany nazwy z 'kat_pierwsza' na 'Unclassified'. Czynność powinna być odrzucona,
# bo taka kategoria już istnieje. Następnie próba zmiany nazwy na 'kat_druga', która 
# jeszcze nie istnieje. Druga próba zmiany powinna być udana, nawet jeśli w kategorii
# są jakieś produkty.

go_to_admin($sel);
$sel->click_ok("link=Kategorie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór kategorii");
$sel->click_ok("link=kat_pierwsza");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikacja kategorii");
$sel->type_ok("classification", "Unclassified");
$sel->click_ok("//input[\@value='Aktualizuj']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Kategoria już istnieje");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikacja kategorii");
$sel->type_ok("classification", "kat_druga");
$sel->click_ok("//input[\@value='Aktualizuj']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zaktualizowano kategorię");

# Próba usunięcia kategorii kat_druga. Nie powinna się udać, ponieważ
# w kategorii są produkty.

go_to_admin($sel);
$sel->click_ok("link=Kategorie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór kategorii");
$sel->click_ok('//a[@href="editclassifications.cgi?action=del&classification=kat_druga"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Błąd");
my $error = trim($sel->get_text("error_msg"));
ok($error =~ /W tej kategorii nadal istnieją produkty/, "Odmowa usunięcia kategorii");

# Zmiana kategorii produktu przed usunięciem kategorii.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór kategorii");
$sel->click_ok('//a[@href="editclassifications.cgi?action=reclassify&classification=kat_druga"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana kategorii produktów");
$sel->add_selection_ok("myprodlist", "label=TestProduct");
$sel->click_ok("remove_products");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana kategorii produktów");
$sel->click_ok("link=Modyfikuj kategorie");

$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór kategorii");
$sel->click_ok('//a[@href="editclassifications.cgi?action=del&classification=kat_druga"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie kategorii");
$sel->is_text_present_ok("Czy na pewno chcesz usunąć tę kategorię?");
$sel->click_ok("//input[\@value='Tak']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto kategorię");

# Wyłączanie tworzenia i edycji kategorii

set_parameters($sel, { "Pola błędu" => {"useclassification-off" => undef} });
$sel->open_ok("/$config->{bugzilla_installation}/editclassifications.cgi");
$sel->title_is("Kategorie nie zostały włączone");
logout($sel);
