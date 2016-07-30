use strict;
use warnings;
use lib qw(lib);

use Test::More "no_plan";

use QA::Util;
use utf8;

my ($sel, $config) = get_selenium();

log_in($sel, $config, 'admin');

 set_parameters($sel, { "Pola błędu" => {"usestatuswhiteboard-on" => undef} });

# Clear the saved search, in case this test didn't complete previously.
if ($sel->is_text_present("Moje błędy - QA Selenium")) {
    $sel->click_ok("link=Moje błędy - QA Selenium");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Lista błędów: Moje błędy - QA Selenium");
    $sel->click_ok("link=Usuń wyszukiwanie „Moje błędy - QA Selenium”");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usuwanie wyszukiwania");
    $sel->is_text_present_ok("Wyszukiwanie Moje błędy - QA Selenium zostało usunięte");
}

# Just in case the test failed before completion previously, reset the CANEDIT bit.
go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Master");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Master");
my $group_url = $sel->get_location();
$group_url =~ /group=(\d+)$/;
my $master_gid = $1;

clear_canedit_on_testproduct($sel, $master_gid);
logout($sel);

# Tworzenie błędu

log_in($sel, $config, 'QA_Selenium_TEST');
file_bug_in_product($sel, 'TestProduct');
my $bug_summary = "Test - edycja błędu";
$sel->select_ok("bug_severity", "label=Krytyczny");
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "sialala");
my $bug1_id = create_bug($sel, $bug_summary);

# Edycja właśnie zgłoszonego błędu

$sel->select_ok("rep_platform", "label=Inna");
$sel->select_ok("op_sys", "label=Inny");
$sel->select_ok("priority", "label=Najwyższy");
$sel->select_ok("bug_severity", "label=Blokujący");
$sel->type_ok("bug_file_loc", "foo.cgi?action=bar");
$sel->type_ok("status_whiteboard", "[Tu byłem - Selenium]");
$sel->type_ok("comment", "nowy komentarz :)");
$sel->select_ok("bug_status", "label=ROZWIĄZANY");
edit_bug($sel, $bug1_id, $bug_summary);

# Przenoszenie błędu do innego produktu, which has a mandatory group.

$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->select_ok("product", "label=QA-Selenium-TEST");
$sel->type_ok("comment", "przenoszę do QA-Selenium-TEST");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Weryfikacja danych o nowym produkcie…");
$sel->select_ok("component", "label=QA-Selenium-TEST");
$sel->is_element_present_ok('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]');
ok(!$sel->is_editable('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]'), "Grupa QA-Selenium-TEST jest nieedytowalna");
$sel->is_checked_ok('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]');
edit_bug_and_return($sel, $bug1_id, $bug_summary, {id => "change_product"});
$sel->select_ok("bug_severity", "label=Normalny");
$sel->select_ok("priority", "label=Wysoki");
$sel->select_ok("rep_platform", "label=Wszystkie");
$sel->select_ok("op_sys", "label=Wszystkie");
$sel->click_ok("cc_edit_area_showhide");
$sel->type_ok("newcc", $config->{admin_user_login});
$sel->type_ok("comment", "Odznaczam checkbox reporter_accessible");
# This checkbox is checked by default.
$sel->click_ok("reporter_accessible");
$sel->select_ok("bug_status", "label=ZWERYFIKOWANY");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->type_ok("comment", "Błąd był zgłoszony przeze mnie, ale mogę go zobaczyć, ponieważ należę do grupy z dostępem");
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# Admin nie należy do obowiązkowej grupy, ale ma CC
# więc ma dostęp do błędu i może go edytować
# The admin is not in the mandatory group, but he has been CC'ed,
# so he can view and edit the bug (as he has editbugs privs by inheritance).

log_in($sel, $config, 'admin');
go_to_bug($sel, $bug1_id);
$sel->select_ok("bug_severity", "label=Blokujący");
$sel->select_ok("priority", "label=Najwyższy");
$sel->type_ok("status_whiteboard", "[Tu byłem - Selenium][ja też - admin]");
$sel->select_ok("bug_status", "label=POTWIERDZONY");
$sel->click_ok("bz_assignee_edit_action");
$sel->type_ok("assigned_to", $config->{admin_user_login});
$sel->type_ok("comment", "Mogę edytować błędy. Biorę!");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->click_ok("cc_edit_area_showhide");
$sel->type_ok("newcc", $config->{unprivileged_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# Użytkownik bez uprawnień może zobaczyć błąd, jest do niego dodany (CC).
# The powerless user can see the restricted bug, as he has been CC'ed.

log_in($sel, $config, 'unprivileged');
go_to_bug($sel, $bug1_id);
$sel->is_text_present_ok("Mogę edytować błędy. Biorę!");
logout($sel);

# Now turn off cclist_accessible, which will prevent
# the powerless user to see the bug again.

log_in($sel, $config, 'admin');
go_to_bug($sel, $bug1_id);
$sel->click_ok("cclist_accessible");
$sel->type_ok("comment", "Mogę wyłączyć cclist_accessible nawet jeśli nie należę do grupy");
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# The powerless user cannot see the restricted bug anymore.

log_in($sel, $config, 'unprivileged');
$sel->type_ok("quicksearch_top", $bug1_id);
$sel->click_ok("find_top");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu");
$sel->is_text_present_ok("Nie masz uprawnień dostępu do błędu #$bug1_id");
logout($sel);

# Move the bug back to TestProduct, which has no group restrictions.

log_in($sel, $config, 'admin');
go_to_bug($sel, $bug1_id);
$sel->select_ok("product", "label=TestProduct");
# When selecting a new product, Bugzilla tries to reassign the bug by default,
# so we have to uncheck it.
$sel->click_ok("set_default_assignee");
$sel->uncheck_ok("set_default_assignee");
$sel->type_ok("comment", "-> Przenoszę z powrotem do Testproduct.");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Weryfikacja danych o nowym produkcie…");
$sel->select_ok("component", "label=TestComponent");
$sel->is_text_present_ok("Następujące grupy nie są prawidłowe dla produktu TestProduct lub nie masz uprawnień do ograniczenia błędów do tych grup.");
$sel->is_element_present_ok('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]');
ok(!$sel->is_editable('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]'), "Grupa QA-Selenium-TEST jest nieedytowalna");
ok(!$sel->is_checked('//input[@type="checkbox" and @name="groups" and @value="QA-Selenium-TEST"]'), "Grupa QA-Selenium-TEST nie jest zaznaczona");
$sel->is_element_present_ok('//input[@type="checkbox" and @name="groups" and @value="Master"]');
$sel->is_editable_ok('//input[@type="checkbox" and @name="groups" and @value="Master"]');
ok(!$sel->is_checked('//input[@type="checkbox" and @name="groups" and @value="Master"]'), "Grupa Master nie jest domyślnie zaznaczona");
edit_bug($sel, $bug1_id, $bug_summary, {id => "change_product"});
logout($sel);

# The unprivileged user can view the bug again, but cannot
# edit it, except adding comments.

log_in($sel, $config, 'unprivileged');
go_to_bug($sel, $bug1_id);
$sel->type_ok("comment", "Ja nic nie mogę. Prawie. Komentować mogę (i usuwać obserwatorów");
ok(!$sel->is_element_present('//select[@name="product"]'), "Nie można edytować produktu");
ok(!$sel->is_element_present('//select[@name="bug_severity"]'), "Nie można edytować wagi błędu");
ok(!$sel->is_element_present('//select[@name="priority"]'), "Nie można edytować priorytetu błędu");
ok(!$sel->is_element_present('//select[@name="op_sys"]'), "Nie można edytować systemu operacyjnego błędu");
ok(!$sel->is_element_present('//select[@name="rep_platform"]'), "Nie można edytować platformy błędu");
$sel->click_ok("cc_edit_area_showhide");
$sel->add_selection_ok("cc", "label=" . $config->{admin_user_login});
$sel->click_ok("removecc");
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# Now let's test the CANEDIT bit.

log_in($sel, $config, 'admin');
edit_product($sel, "TestProduct");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „TestProduct”");
$sel->check_ok("canedit_$master_gid");
$sel->click_ok("submit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja grupy dla produktu „TestProduct”");

# The user is in the master group, so he can comment.

go_to_bug($sel, $bug1_id);
$sel->type_ok("comment", "Ja tylko dodaję komentarz");
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# This user is not in the master group, so he cannot comment.

log_in($sel, $config, 'QA_Selenium_TEST');
go_to_bug($sel, $bug1_id);
$sel->type_ok("comment", "To tylko komentarz");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu do modyfikowania produktu");
$sel->is_text_present_ok("Nie masz uprawnień do modyfikowania błędu dla produktu TestProduct.");
logout($sel);

# Test searches and "format for printing".

log_in($sel, $config, 'admin');
open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections_ok("bug_status");
$sel->remove_all_selections_ok("resolution");
$sel->check_ok("emailassigned_to1");

$sel->select_ok("emailtype1", "label=jest");
$sel->type_ok("email1", $config->{admin_user_login});
$sel->check_ok("emailassigned_to2");
$sel->check_ok("emailqa_contact2");
$sel->check_ok("emailcc2");
$sel->select_ok("emailtype2", "label=jest");
$sel->type_ok("email2", $config->{QA_Selenium_TEST_user_login});
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono");
$sel->type_ok("save_newqueryname", "Moje błędy - QA Selenium");
$sel->click_ok("remember");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wyszukiwanie");
$sel->is_text_present_ok("Masz nowe wyszukiwanie o nazwie Moje błędy - QA Selenium.");
$sel->click_ok("link=Moje błędy - QA Selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje błędy - QA Selenium");
$sel->click_ok("long_format");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pełny format listy błędów");
$sel->is_text_present_ok("Błąd nr $bug1_id");
$sel->is_text_present_ok("Status: POTWIERDZONY");
$sel->is_text_present_ok("Zgłaszający: QA-Selenium-TEST <$config->{QA_Selenium_TEST_user_login}>");
$sel->is_text_present_ok("Przypisany do: admin <$config->{admin_user_login}>");
$sel->is_text_present_ok("Waga błędu: Blokujący");
$sel->is_text_present_ok("Priorytet: Najwyższy");
$sel->is_text_present_ok("Ja nic nie mogę. Prawie. Komentować mogę");
logout($sel);

# Let's create a 2nd bug by this user so that we can test mass-change
# using the saved search the admin just created.

log_in($sel, $config, 'QA_Selenium_TEST');
file_bug_in_product($sel, 'TestProduct');
my $bug_summary2 = "Mój nowy błąd";
$sel->select_ok("bug_severity", "label=Blokujący");
$sel->type_ok("short_desc", $bug_summary2);
# We turned on the CANEDIT bit for TestProduct.
$sel->type_ok("comment", "Mogę utworzyć nowy błąd, ale nie mogę go edytować, tak?");
my $bug2_id = create_bug($sel, $bug_summary2);

# Clicking the "Back" button and resubmitting the form again should trigger a warning.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zgłaszanie błędu: TestProduct");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Podejrzana czynność");
$sel->is_text_present_ok("Brak ważnego tokena dla czynności create_bug podczas przetwarzania skryptu „post_bug.cgi”");
$sel->click_ok("confirm");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/Błąd \d+ \S $bug_summary2/, "Błąd zgłoszony");
$sel->type_ok("comment", "Żadnych nowych komentarzy");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Brak dostępu do modyfikowania produktu");
$sel->is_text_present_ok("Nie masz uprawnień do modyfikowania błędu dla produktu TestProduct.");
logout($sel);

# Reassign the newly created bug to the admin.

log_in($sel, $config, 'admin');
go_to_bug($sel, $bug2_id);
$sel->click_ok("bz_assignee_edit_action");
$sel->type_ok("assigned_to", $config->{admin_user_login});
$sel->type_ok("comment", "Biorę!");
edit_bug($sel, $bug2_id, $bug_summary2);
# Test mass-change.

$sel->click_ok("link=Moje błędy - QA Selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje błędy - QA Selenium");
$sel->is_text_present_ok("Znaleziono");
$sel->click_ok("link=Zmień wiele błędów jednocześnie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->click_ok("check_all");
$sel->type_ok("comment", 'Edycja masowa');
$sel->select_ok("bug_status", "label=ROZWIĄZANY");
$sel->select_ok("resolution", "label=U MNIE DZIAŁA");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Błędy zostały przetworzone");

$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/Błąd $bug1_id /);
$sel->selected_label_is("resolution", "U MNIE DZIAŁA");
$sel->select_ok("resolution", "label=NIEPRAWIDŁOWY");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->selected_label_is("resolution", "NIEPRAWIDŁOWY");

$sel->click_ok("link=historia");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiany w zgłoszeniu błędu $bug1_id");
$sel->is_text_present_ok("URL foo.cgi?action=bar");
$sel->is_text_present_ok("Waga błędu Krytyczny Blokujący");
$sel->is_text_present_ok("Tablica statusu [Tu byłem - Selenium] [Tu byłem - Selenium][ja też - admin]");
$sel->is_text_present_ok("Produkt QA-Selenium-TEST TestProduct");
$sel->is_text_present_ok("Status POTWIERDZONY ROZWIĄZANY");

# Last step: move bugs to another DB, if the extension is enabled.

if ($config->{test_extensions}) {
    set_parameters($sel, { "Bug Moving" => {"move-to-url"     => {type => "text", value => 'http://www.foo.com/'},
                                            "move-to-address" => {type => "text", value => 'import@foo.com'},
                                            "movers"          => {type => "text", value => $config->{admin_user_login}}
                                           }
                         });

    # Mass-move has been removed, see 581690.
    # Restore these tests once this bug is fixed.
    # $sel->click_ok("link=Moje błędy - QA Selenium");
    # $sel->wait_for_page_to_load_ok(WAIT_TIME);
    # $sel->title_is("Lista błędów: Moje błędy - QA Selenium");
    # $sel->is_text_present_ok("2 bugs found");
    # $sel->click_ok("link=Zmień wiele błędów jednocześnie");
    # $sel->wait_for_page_to_load_ok(WAIT_TIME);
    # $sel->title_is("Lista błędów");
    # $sel->click_ok("check_all");
    # $sel->type_ok("comment", "-> moved");
    # $sel->click_ok('oldbugmove');
    # $sel->wait_for_page_to_load_ok(WAIT_TIME);
    # $sel->title_is("Błędy zostały przetworzone");
    # $sel->is_text_present_ok("Bug $bug1_id has been moved to another database");
    # $sel->is_text_present_ok("Bug $bug2_id has been moved to another database");
    # $sel->click_ok("link=błąd $bug2_id");
    # $sel->wait_for_page_to_load_ok(WAIT_TIME);
    # $sel->title_like(qr/^Bug $bug2_id/);
    # $sel->selected_label_is("resolution", "MOVED");

    go_to_bug($sel, $bug2_id);
    edit_bug_and_return($sel, $bug2_id, $bug_summary2, {id => "oldbugmove"});
    $sel->selected_label_is("resolution", "MOVED");
    $sel->is_text_present_ok("Bug moved to http://www.foo.com/.");

    # Disable bug moving again.
    set_parameters($sel, { "Bug Moving" => {"movers" => {type => "text", value => ""}} });
}

# Make sure token checks are working correctly for single bug editing and mass change,
# first with no token, then with an invalid token.

foreach my $params (["no_token_single_bug", ""], ["invalid_token_single_bug", "&token=1"]) {
    my ($comment, $token) = @$params;
    $sel->open_ok("/$config->{bugzilla_installation}/process_bug.cgi?id=$bug1_id&comment=$comment$token",
                  undef, "Edytowanie błędu z " . ($token ? "nieprawidłowym" : "usuniętym") . " tokenem");
    $sel->title_is("Podejrzane działania");
    $sel->is_text_present_ok($token ? "z nieprawidłowym tokenem" : "bezpośrednio do paska adresu przeglądarki");
    edit_bug_and_return($sel, $bug1_id, $bug_summary, {id => "confirm"});
    $sel->is_text_present_ok($comment);

}

foreach my $params (["no_token_mass_change", ""], ["invalid_token_mass_change", "&token=1"]) {
    my ($comment, $token) = @$params;
    $sel->open_ok("/$config->{bugzilla_installation}/process_bug.cgi?id_$bug1_id=1&id_$bug2_id=1&comment=$comment$token",
                  undef, "Masowa edycja z " . ($token ? "nieprawidłowym" : "usuniętym") . " tokenem");
    $sel->title_is("Podejrzana czynność");
    $sel->is_text_present_ok("Brak ważnego tokena dla czynności buglist_mass_change");
    $sel->click_ok("confirm");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Błędy zostały przetworzone");
    foreach my $bug_id ($bug1_id, $bug2_id) {
        $sel->click_ok("link=błędu $bug_id");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_like(qr/^Błąd $bug_id /);
        $sel->is_text_present_ok($comment);
        next if $bug_id == $bug2_id;
        $sel->go_back_ok();
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Błędy zostały przetworzone");

    }
}

# Usuwanie błędów z widoku.

$sel->click_ok("link=Moje błędy - QA Selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje błędy - QA Selenium");
$sel->is_text_present_ok("Znaleziono");
$sel->click_ok("link=Zmień wiele błędów jednocześnie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->click_ok("check_all");
$sel->type_ok("comment", "Reassigning to the reporter");
$sel->type_ok("assigned_to", $config->{QA_Selenium_TEST_user_login});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Błędy zostały przetworzone");


# Usuwanie zapisanego wcześniej wyszukiwania.

$sel->click_ok("link=Moje błędy - QA Selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów: Moje błędy - QA Selenium");
$sel->click_ok("link=Usuń wyszukiwanie „Moje błędy - QA Selenium”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wyszukiwania");
$sel->is_text_present_ok("Wyszukiwanie Moje błędy - QA Selenium zostało usunięte");

# Reset the CANEDIT bit. We want it to be turned off by default.
clear_canedit_on_testproduct($sel, $master_gid);
logout($sel);

sub clear_canedit_on_testproduct {
    my ($sel, $master_gid) = @_;

    edit_product($sel, "TestProduct");
    $sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „TestProduct”");
    $sel->uncheck_ok("canedit_$master_gid");
    $sel->click_ok("submit");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Aktualizacja grupy dla produktu „TestProduct”");
}
