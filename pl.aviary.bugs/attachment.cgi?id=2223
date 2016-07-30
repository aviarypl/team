use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Update default user preferences.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Ustawienia domyślne");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
$sel->uncheck_ok("skin-enabled");
$sel->value_is("skin-enabled", "off");
$sel->check_ok("state_addselfcc-enabled");
$sel->select_ok("state_addselfcc", "label=nigdy");
$sel->check_ok("post_bug_submit_action-enabled");
$sel->select_ok("post_bug_submit_action", "label=pokaż uaktualniony błąd");
$sel->uncheck_ok("zoom_textareas-enabled");
$sel->select_ok("zoom_textareas", "label=wyłączone");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");

# Update own user preferences. Some of them are not editable.

$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
ok(!$sel->is_editable("skin"), "Nie można zmienić wyglądu Bugzilli");
$sel->select_ok("state_addselfcc", "label=wartość domyślna (nigdy)");
$sel->select_ok("post_bug_submit_action", "label=wartość domyślna (pokaż uaktualniony błąd)");
ok(!$sel->is_editable("zoom_textareas"), "Nie można zmienić opcji powiększania aktywnego pola tekstowego");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");

# File a bug in the 'TestProduct' product. The form fields must follow user prefs.

file_bug_in_product($sel, 'TestProduct');
$sel->value_is("cc", "");
my $bug_summary = "Mój pierwszy błąd";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Nie ma mnie na liście obserwatorów.");
my $bug1_id = create_bug($sel, $bug_summary);

$sel->value_is("addselfcc", "off");
$sel->type_ok("tag", "sel-tmp");
$sel->select_ok("bug_status", "label=W REALIZACJI");
edit_bug($sel, $bug1_id, $bug_summary);
$sel->click_ok("editme_action");
$sel->value_is("short_desc", $bug_summary);
$sel->value_is("addselfcc", "off");

# Tag the bug and add it to a saved search.

$sel->type_ok("quicksearch_top", "tag:sel-tmp");
$sel->click_ok("find_top");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->type_ok("save_newqueryname", "sel-tmp");
$sel->click_ok("remember");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono wyszukiwanie");
$sel->is_text_present_ok("Masz nowe wyszukiwanie o nazwie sel-tmp");

# Leave this page to avoid clicking on the wrong 'sel-tmp' link.
go_to_home($sel, $config);
$sel->click_ok("link=sel-tmp");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: sel-tmp");
$sel->is_text_present_ok("Znaleziono jeden błąd");

# File another bug in the 'TestProduct' product.

file_bug_in_product($sel, 'TestProduct');
$sel->value_is("cc", "");
my $bug_summary2 = "Mój drugi błąd";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "Nadal mnie nie ma na liście obserwatorów");
my $bug2_id = create_bug($sel, $bug_summary2);
$sel->value_is("addselfcc", "off");
$sel->type_ok("tag", "sel-tmp");
edit_bug($sel, $bug2_id, $bug_summary2);

$sel->click_ok("link=sel-tmp");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: sel-tmp");
$sel->is_text_present_ok("Znaleziono 2 błędy");
$sel->click_ok("link=$bug1_id");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->type_ok("comment", "To powinien być następny błąd jaki zobaczę.");
edit_bug($sel, $bug1_id, $bug_summary);
$sel->click_ok("editme_action");
$sel->value_is("short_desc", "Mój pierwszy błąd");
$sel->is_text_present_ok("To powinien być następny błąd jaki zobaczę.");

# Remove the saved search. The tag itself still exists.

$sel->click_ok("link=sel-tmp");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: sel-tmp");
$sel->click_ok("link=Usuń wyszukiwanie „sel-tmp”");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Usuwanie wyszukiwania");
$sel->is_text_present_ok("Wyszukiwanie sel-tmp zostało usunięte");

# Remove the tag from bugs.

$sel->type_ok("quicksearch_top", "tag:sel-tmp");
$sel->click_ok("find_top");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono 2 błędy");
# We cannot remove tags from several bugs at once (bug 791584).
go_to_bug($sel, $bug1_id);
$sel->type_ok("tag", "");
edit_bug($sel, $bug1_id, $bug_summary);

go_to_bug($sel, $bug2_id);
$sel->type_ok("tag", "");
edit_bug($sel, $bug2_id, $bug_summary2);

$sel->type_ok("quicksearch_top", "tag:sel-tmp");
$sel->click_ok("find_top");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Nie znaleziono żadnych");
logout($sel);

# Edit own user preferences, now as an unprivileged user.

log_in($sel, $config, 'unprivileged');
$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
ok(!$sel->is_editable("skin"), "Nie można zmienić wyglądu Bugzilli");
$sel->select_ok("state_addselfcc", "label=zawsze");
$sel->select_ok("post_bug_submit_action", "label=pokaż następny błąd na liście");
ok(!$sel->is_editable("zoom_textareas"), "Nie można zmienić opcji powiększania aktywnego pola tekstowego");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");

# Create a new search named 'moja_lista'.

open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections_ok("bug_status");
$sel->select_ok("bug_id_type", "label=znaleźć się na liście");
$sel->type_ok("bug_id", "$bug1_id , $bug2_id");
$sel->select_ok("order", "label=wg numeru błędu");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono 2 błędy");
$sel->type_ok("save_newqueryname", "moja_lista");
$sel->click_ok("remember");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono wyszukiwanie");
$sel->is_text_present_ok("Masz nowe wyszukiwanie o nazwie moja_lista");

# Editing bugs should follow user preferences.

$sel->click_ok("link=moja_lista");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: moja_lista");
$sel->click_ok("link=$bug1_id");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->value_is("addselfcc", "on");
$sel->type_ok("comment", "Dodaję się do listy obserwatorów, w potem powinien się wyświetlić kolejny błąd.");
edit_bug($sel, $bug2_id, $bug_summary2);
$sel->is_text_present_ok("Następny błąd na liście to błąd $bug2_id");
ok(!$sel->is_text_present("powinien się wyświetlić kolejny błąd"), "Zaktualizowany przed chwilą błąd nie wyświetlił się");
# The user has no privs, so the short_desc field is not present.
$sel->is_text_present("short_desc", "Mój drugi błąd");
$sel->value_is("addselfcc", "on");
$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->is_text_present("1 użytkownik łącznie z tobą");

# Delete the saved search and log out.

$sel->click_ok("link=moja_lista");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów: moja_lista");
$sel->click_ok("link=Usuń wyszukiwanie „moja_lista”");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Usuwanie wyszukiwania");
$sel->is_text_present_ok("Wyszukiwanie moja_lista zostało usunięte");
logout($sel);

# Restore default user preferences.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Ustawienia domyślne");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
$sel->check_ok("skin-enabled");
$sel->uncheck_ok("post_bug_submit_action-enabled");
$sel->select_ok("post_bug_submit_action", "label=nie rób nic");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
logout($sel);
