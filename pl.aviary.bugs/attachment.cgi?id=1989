use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Add the new Selenium-test group.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Dodaj nową grupę");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Dodawanie grupy");
$sel->type_ok("name", "Selenium-test");
$sel->type_ok("desc", "Grupa testowa dla Selenium");
$sel->check_ok("isactive");
$sel->uncheck_ok("insertnew");
$sel->click_ok("create");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono nową grupę");
my $group_id = $sel->get_value("group_id");

# Mark the Selenium-test group as Widoczna/Obligatoryjna for TestProduct.

edit_product($sel, "TestProduct");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „TestProduct”");
$sel->is_text_present_ok("Selenium-test");
$sel->select_ok("membercontrol_${group_id}", "label=Widoczna");
$sel->select_ok("othercontrol_${group_id}", "label=Obligatoryjna");
$sel->click_ok("submit");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Aktualizacja grupy dla produktu „TestProduct”");

# File a new bug in the TestProduct product, and restrict it to the bug group.

file_bug_in_product($sel, "TestProduct");
$sel->is_text_present_ok("Grupa testowa dla Selenium");
$sel->value_is("group_${group_id}", "off"); # Must be OFF (else that's a bug)
$sel->check_ok("group_${group_id}");
my $bug_summary = "błąd tylko dla grupy Selenium";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "powinien być niewidoczny");
$sel->selected_label_is("component", "TestComponent");
my $bug1_id = create_bug($sel, $bug_summary);
$sel->is_text_present_ok("Grupa testowa dla Selenium");
$sel->value_is("group_${group_id}", "on"); # Must be ON

# Look for this new bug and add it to the new "Błędy Selenium" saved search.

open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections("bug_status");
$sel->add_selection_ok("bug_status", "NIEPOTWIERDZONY");
$sel->add_selection_ok("bug_status", "POTWIERDZONY");
$sel->select_ok("f1", "Grupa");
$sel->select_ok("o1", "jest taki, jak");
$sel->type_ok("v1", "Selenium-test");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->is_text_present_ok("błąd tylko dla grupy Selenium");
$sel->type_ok("save_newqueryname", "Błędy Selenium");
$sel->click_ok("remember");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->is_text_present_ok("Masz nowe wyszukiwanie o nazwie Błędy Selenium");
$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony tylko dla grupy, dla której został zgłoszony");

# No longer use Selenium-test as a bug group.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Selenium-test");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->value_is("isactive", "on");
$sel->click_ok("isactive");
$sel->click_ok('//input[@value="Aktualizuj"]');
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->is_text_present_ok("Grupa nie będzie już używana do zgłaszania błędów");

# File another new bug, now visible as the bug group is disabled.

file_bug_in_product($sel, "TestProduct");
$sel->selected_label_is("component", "TestComponent");
my $bug_summary2 = "błąd tylko dla grupy Selenium";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "po utworzeniu błąd powinien być *widoczny* (grupa nie jest już używana do zgłaszania błędów)");
ok(!$sel->is_text_present("Grupa testowa dla Selenium"), "Grupa Selenium-test jest niedostępna");
ok(!$sel->is_element_present("group_${group_id}"), "Checkbox dla grupy Selenium-test niewidoczny");
my $bug2_id = create_bug($sel, $bug_summary2);

# Make sure the new bug doesn't appear in the "Błędy Selenium" saved search.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
ok(!$sel->is_element_present("b$bug2_id"), "Błąd $bug2_id NIE JEST zastrzeżony dla grupy");

# Re-enable the Selenium-test group as bug group. This doesn't affect
# already filed bugs as this group is not mandatory.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Selenium-test");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->value_is("isactive", "off");
$sel->click_ok("isactive");
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->click_ok('//input[@value="Aktualizuj"]');
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->is_text_present_ok("Grupa będzie teraz używana do zgłaszania błędów");

# Make sure the second filed bug has not been added to the bug group.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_text_present_ok("Znaleziono jeden błąd");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
ok(!$sel->is_element_present("b$bug2_id"), "Błąd $bug2_id NIE JEST zastrzeżony dla grupy");

# Make the Grupa Selenium-test jest obligatoryjna for TestProduct.

edit_product($sel, "TestProduct");
$sel->is_text_present_ok("Selenium-test: Widoczna/Obligatoryjna");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->select_ok("membercontrol_${group_id}", "Obligatoryjna");
$sel->click_ok("submit");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Potwierdzenie zmiany relacji grupa/produkt dla „TestProduct”");
# to trzeba zmienić po naprawieniu błędu 4272
$sel->is_text_present_ok("jest ponownie obligatoryjna i zostanie dodana");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Aktualizacja grupy dla produktu „TestProduct”");
# to też do zmiany po 4272
$sel->is_text_present_ok('Dodawanie błędów do grupy „Selenium-test”, która jest ponownie obligatoryjna dla tego produktu');

# All bugs being in TestProduct must now be restricted to the bug group.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug2_id", undef, "Błąd $bug2_id zastrzeżony dla grupy");

# File a new bug, which must automatically be restricted to the bug group.

file_bug_in_product($sel, "TestProduct");
$sel->selected_label_is("component", "TestComponent");
my $bug_summary3 = "Grupa Selenium-test jest obligatoryjna";
$sel->type_ok("short_desc", $bug_summary3);
$sel->type_ok("comment", "grupa włączona");
ok(!$sel->is_text_present("Grupa testowa dla Selenium"), "Grupa Selenium-test jest niedostępna");
ok(!$sel->is_element_present("group_${group_id}"), "Checkbox dla grupy Selenium-test niewidoczny (grupa obligatoryjna)");
my $bug3_id = create_bug($sel, $bug_summary3);

# Make sure all three bugs are listed as being restricted to the bug group.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug2_id", undef, "Bug $bug2_id restricted to the bug group");
$sel->is_element_present_ok("b$bug3_id", undef, "Bug $bug3_id restricted to the bug group");

# Turn off the Selenium-test group again.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Selenium-test");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->value_is("isactive", "on");
$sel->click_ok("isactive");
$sel->click_ok("//input[\@value='Aktualizuj']");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->is_text_present_ok("Grupa nie będzie już używana do zgłaszania błędów");

# File a bug again. It should not be added to the bug group as this one is disabled.

file_bug_in_product($sel, "TestProduct");
$sel->selected_label_is("component", "TestComponent");
my $bug_summary4 = "Błąd widoczny tylko dla członków grupy Selenium-test";
$sel->type_ok("short_desc", $bug_summary4);
$sel->type_ok("comment", "grupa nie jest używana do zgłaszania błędów");
ok(!$sel->is_text_present("Grupa testowa dla Selenium"), "Grupa Selenium-test jest niedostępna");
ok(!$sel->is_element_present("group_${group_id}"), "Checkbox dla grupy Selenium-test niewidoczny");
my $bug4_id = create_bug($sel, $bug_summary4);

# The last bug must not be in the list.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug2_id", undef, "Błąd $bug2_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug3_id", undef, "Błąd $bug3_id zastrzeżony dla grupy");
ok(!$sel->is_element_present("b$bug4_id"), "Błąd $bug4_id NIE JEST zastrzeżony dla grupy");

# Re-enable the mandatory group. All bugs should be restricted to this bug group automatically.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Selenium-test");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->value_is("isactive", "off");
$sel->click_ok("isactive");
$sel->click_ok("//input[\@value='Aktualizuj']");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Selenium-test");
$sel->is_text_present_ok("Grupa będzie teraz używana do zgłaszania błędów");

# Make sure all bugs are restricted to the bug group.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug2_id", undef, "Błąd $bug2_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug3_id", undef, "Błąd $bug3_id zastrzeżony dla grupy");
$sel->is_element_present_ok("b$bug4_id", undef, "Błąd $bug4_id zastrzeżony dla grupy");

# Try to remove the Selenium-test group from TestProduct, but DON'T do it!
# We just want to make sure a warning is displayed about this removal.

edit_product($sel, "TestProduct");
$sel->is_text_present_ok("Selenium-test: Obligatoryjna/Obligatoryjna");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „TestProduct”");
$sel->is_text_present_ok("Selenium-test");
$sel->select_ok("membercontrol_${group_id}", "Niedostępna");
$sel->select_ok("othercontrol_${group_id}", "Niedostępna");
$sel->click_ok("submit");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Potwierdzenie zmiany relacji grupa/produkt dla „TestProduct”");
$sel->is_text_present_ok("nie ma już zastosowania i zostanie usunięta");

# Usuwanie grupy Selenium-test.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("//a[\@href='editgroups.cgi?action=del&group=${group_id}']");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Usuwanie grupy");
$sel->is_text_present_ok("Czy na pewno chcesz usunąć tę grupę?");
$sel->is_element_present_ok("removebugs");
$sel->value_is("removebugs", "off");
$sel->is_text_present_ok("Usuń wszystkie błędy z tej grupy");
$sel->is_element_present_ok("unbind");
$sel->value_is("unbind", "off");
$sel->is_text_present_ok("i relacje grupa/produkt");
$sel->click_ok("delete");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Nie można usunąć grupy");
my $error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /^Grupa Selenium-test nie może być usunięta/, "Grupy nie można usunąć - jest używana");
$sel->go_back_ok();
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->check("removebugs");
$sel->check("unbind");
$sel->click_ok("delete");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Usunięto grupę");
$sel->is_text_present_ok("Grupa Selenium-test została usunięta.");

# No more bugs listed in the saved search as the bug group is gone.

$sel->click_ok("link=Błędy Selenium");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: Błędy Selenium");
$sel->is_text_present_ok("Nie znaleziono żadnych błędów");
$sel->click_ok("link=Usuń wyszukiwanie „Błędy Selenium”");
$sel->wait_for_page_to_load(WAIT_TIME);
# do poprawienia po zamknięciu błędu 4273
$sel->title_is("Usuwanie wyszukiwania");
$sel->is_text_present_ok("Wyszukiwanie Błędy Selenium zostało usunięte.");
logout($sel);
