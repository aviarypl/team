use strict;
use warnings;
use lib qw(lib);

use Test::More "no_plan";

use QA::Util;
use utf8;

my ($sel, $config) = get_selenium();

# Sprawdzanie, czy wyszukiwanie 'Moje wyszukiwanie - QA' zostało usunięte.

log_in($sel, $config, 'admin');
if ($sel->is_text_present("Moje wyszukiwanie - QA")) {
    $sel->click_ok("link=Moje wyszukiwanie - QA");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Lista błędów: Moje wyszukiwanie - QA");
    $sel->click_ok("link=Usuń wyszukiwanie „Moje wyszukiwanie - QA”");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usuwanie wyszukiwania");
    $sel->is_text_present_ok("Wyszukiwanie Moje wyszukiwanie - QA zostało usunięte.");
}

# Enable the QA contact field and file a new bug restricted to the 'Master' group
# with a powerless user as the QA contact. He should only be able to access the
# bug if the QA contact field is enabled, else he looses this privilege.

set_parameters($sel, { "Pola błędu" => {"useqacontact-on" => undef} });
file_bug_in_product($sel, 'TestProduct');
$sel->type_ok("qa_contact", $config->{unprivileged_user_login}, "Ustawianie użytkownika bez uprawnień jako specjalisty QA");
my $bug_summary = "Test specjalisty QA";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Test dla sprawdzenia uprawnień Specjalisty QA.");
$sel->check_ok('//input[@name="groups" and @value="Master"]');
my $bug1_id = create_bug($sel, $bug_summary);

# Create a saved search querying for all bugs with the powerless user
# as QA contact.

open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections("bug_status");
$sel->select_ok("f1", "label=Specjalista QA");
$sel->select_ok("o1", "label=jest taki, jak");
$sel->type_ok("v1", $config->{unprivileged_user_login}, "Użytkownik bez uprawnień jako specjalista QA");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id znajduje się na liście");
$sel->is_text_present_ok("Test specjalisty QA");
$sel->type_ok("save_newqueryname", "Moje wyszukiwanie - QA");
$sel->click_ok("remember");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wyszukiwanie");
my $text = trim($sel->get_text("message"));
ok($text =~ /Masz nowe wyszukiwanie o nazwie Moje wyszukiwanie - QA/, "Zapisano 'Moje wyszukiwanie - QA'");
$sel->click_ok("link=Moje wyszukiwanie - QA");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje wyszukiwanie - QA");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id znajduje się na liście");
$sel->is_text_present_ok("Test specjalisty QA");

# The saved search should still work, even with the QA contact field disabled.
# ("work" doesn't mean you should still see all bugs, depending on your role
# and privs!)

set_parameters($sel, { "Pola błędu" => {"useqacontact-off" => undef} });
$sel->click_ok("link=Moje wyszukiwanie - QA");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje wyszukiwanie - QA");
$sel->is_text_present_ok("Znaleziono");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id znajduje się na liście");
$sel->click_ok("link=$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
# The 'QA Contact' label must not be displayed.
ok(!$sel->is_text_present("Specjalista QA"), "Pole Specjalista QA jest niewidoczne");
logout($sel);

# You cannot access the bug when being logged out, as it's restricted
# to the Master group.

$sel->type_ok("quicksearch_top", $bug1_id);
$sel->click_ok("find_top");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu");
$sel->is_text_present_ok("Nie masz uprawnień dostępu do błędu");

# You are still not allowed to access the bug when logged in as the
# powerless user, as the QA contact field is disabled.
# Don't use it log_in() as we want to follow this specific link.

$sel->click_ok("//a[contains(text(),'zalogować się\n    na konto')]", undef, "Log in");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Logowanie do Bugzilli");
$sel->is_text_present_ok("Do zalogowania wymagana jest poprawna nazwa użytkownika (login) i hasło.");
$sel->type_ok("Bugzilla_login", $config->{unprivileged_user_login}, "Login");
$sel->type_ok("Bugzilla_password", $config->{unprivileged_user_passwd}, "Hasło");
$sel->click_ok("log_in", undef, "Logowanie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu");
$sel->is_text_present_ok("Nie masz uprawnień dostępu do błędu");
logout($sel);

# Re-enable the QA contact field.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Pola błędu" => {"useqacontact-on" => undef} });
logout($sel);

# Log in as the powerless user. As the QA contact field is enabled again,
# you can now access the restricted bug.

log_in($sel, $config, 'unprivileged');
$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->select_ok("state_addselfcc", "value=never");
$sel->click_ok("update");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");

open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections_ok("bug_status");
$sel->select_ok("f1", "label=Specjalista QA");
$sel->select_ok("o1", "label=jest taki, jak");
$sel->type_ok("v1", $config->{unprivileged_user_login}, "Użytkownik bez uprawnień jako specjalista QA");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono");
$sel->is_element_present_ok("b$bug1_id", undef, "Błąd $bug1_id znajduje się na liście");
$sel->is_text_present_ok("Test specjalisty QA");
$sel->click_ok("link=$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/Błąd $bug1_id /);
$sel->click_ok("bz_qa_contact_edit_action");
$sel->value_is("qa_contact", $config->{unprivileged_user_login}, "Użytkownik bez uprawnień jest specjalistą QA");
$sel->check_ok("set_default_qa_contact");
edit_bug($sel, $bug1_id, $bug_summary);

# The user is no longer the QA contact, and he has no other role
# with the bug. He can no longer see it.

$sel->is_text_present_ok("(lista adresów e-mail jest niedostępna)");
$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu");
logout($sel);
