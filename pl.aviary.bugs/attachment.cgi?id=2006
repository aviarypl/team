use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

log_in($sel, $config, 'admin');
set_parameters($sel, { "Pola błędu" => {"usetargetmilestone-on" => undef} });

# Create a new milestone to the 'TestProduct' product.

edit_product($sel, "TestProduct");
$sel->click_ok("link=Modyfikuj wersje docelowe:");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji docelowych produktu „TestProduct”");
$sel->click_ok("link=Dodaj wersję docelową");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Dodawanie wersji docelowej do produktu „TestProduct”");
$sel->type_ok("milestone", "TM1");
$sel->type_ok("sortkey", "10");
$sel->click_ok("create");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono wersję docelową");

# Edit the milestone of bugs.

file_bug_in_product($sel, "TestProduct");
$sel->select_ok("component", "TestComponent");
my $bug_summary = "papier, nożyczki";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "To jest błąd do testowania wersji docelowych");
my $bug1_id = create_bug($sel, $bug_summary);
$sel->is_text_present_ok("Wersja docelowa:");
$sel->select_ok("target_milestone", "label=TM1");
edit_bug($sel, $bug1_id, $bug_summary);

# Query for bugs with the TM1 milestone.

open_advanced_search_page($sel);
$sel->is_text_present_ok("Wersja docelowa:");
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "label=TestProduct");
$sel->add_selection_ok("target_milestone", "label=TM1");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->type_ok("save_newqueryname", "selenium_m0");
$sel->click_ok("remember");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wyszukiwanie");
my $text = trim($sel->get_text("message"));
ok($text =~ /Masz nowe wyszukiwanie o nazwie selenium_m0./, "Utworzono wyszukiwanie o nazwie selenium_m0");

# Turn off milestones and check that the milestone field no longer appears in bugs.

set_parameters($sel, { "Pola błędu" => {"usetargetmilestone-off" => undef} });

$sel->click_ok("link=Wyszukiwanie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wyszukiwanie błędów");
ok(!$sel->is_text_present("Wersja docelowa:"), "Wersja docelowa nie jest wyświetlana w formularzu wyszukiwania");

go_to_bug($sel, $bug1_id);
ok(!$sel->is_text_present("Wersja docelowa:"), "Wersja docelowa nie jest wyświetlana na stronie błędu");

# The existing query must still work despite milestones are off now.

$sel->click_ok("link=selenium_m0");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: selenium_m0");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->click_ok("link=Usuń wyszukiwanie „selenium_m0”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wyszukiwania");
$text = trim($sel->get_text("message"));
ok($text =~ /Wyszukiwanie selenium_m0 zostało usunięte./, "Wyszukiwanie selenium_m0 zostało usunięte");

# Re-enable the usetargetmilestone parameter and delete the created
# milestone from the Testproduct product.

set_parameters($sel, { "Pola błędu" => {"usetargetmilestone-on" => undef} });

edit_product($sel, "TestProduct");
$sel->click_ok("link=Modyfikuj wersje docelowe:");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji docelowych produktu „TestProduct”");
$sel->click_ok('//a[@href="editmilestones.cgi?action=del&product=TestProduct&milestone=TM1"]',
               undef, "Usuwanie wersji docelowej TM1");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wersji docelowej produktu „TestProduct”");
$text = trim($sel->get_body_text());
ok($text =~ /Istnieje 1 otwarty błąd dla tej wersji docelowej/, "Ostrzeżenie na temat błędu przypisanego do usuwanej wersji docelowej");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto wersję docelową");
logout($sel);
