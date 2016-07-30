use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();
log_in($sel, $config, 'admin');

# Jeśli test został przerwany i nie zakończony, to dodane pola nie są usuwane
# Tak mnie wkurzyło ich usuwanie ręcznie, że dodałam usuwanie i tutaj
delete_unused_values($sel);

# Tworzenie błędów do testowania pól dodatkowych

file_bug_in_product($sel, 'TestProduct');
my $bug_summary = "Jaki jest mój numer?";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Numer tego błędu zostanie użyty do stworzenia pola dodatkowego o unikalnej nazwie");
$sel->type_ok("bug_severity", "label=Normalny");
my $bug1_id = create_bug($sel, $bug_summary);

# Tworzenie pól dodatkowych

go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");
$sel->click_ok("link=Nowe pole dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie dodatkowego pola");
$sel->type_ok("name", "cf_qa_poletekstowe_$bug1_id");
$sel->type_ok("desc", "PoleTekstowe$bug1_id");
$sel->select_ok("type", "label=Pole tekstowe");
$sel->type_ok("sortkey", $bug1_id);
# Te opcje są domyślnie wyłączane
$sel->value_is("enter_bug", "off");
$sel->value_is("obsolete", "off");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono pole dodatkowe");
$sel->is_text_present_ok("Nowe pole dodatkowe „cf_qa_poletekstowe_$bug1_id” zostało utworzone.");

$sel->click_ok("link=Nowe pole dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie dodatkowego pola");
$sel->type_ok("name", "cf_qa_list_$bug1_id");
$sel->type_ok("desc", "List$bug1_id");
$sel->select_ok("type", "label=Lista rozwijana");
$sel->type_ok("sortkey", $bug1_id);
$sel->click_ok("enter_bug");
$sel->value_is("enter_bug", "on");
$sel->click_ok("new_bugmail");
$sel->value_is("new_bugmail", "on");
$sel->value_is("obsolete", "off");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono pole dodatkowe");
$sel->is_text_present_ok("Nowe pole dodatkowe „cf_qa_list_$bug1_id” zostało utworzone.");

$sel->click_ok("link=Nowe pole dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie dodatkowego pola");
$sel->type_ok("name", "cf_qa_blad_nr_$bug1_id");
$sel->type_ok("desc", "Reference$bug1_id");
$sel->select_ok("type", "label=Identyfikator błędu");
$sel->type_ok("sortkey", $bug1_id);
$sel->type_ok("reverse_desc", "IsRef$bug1_id");
$sel->click_ok("enter_bug");
$sel->value_is("enter_bug", "on");
$sel->value_is("obsolete", "off");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono pole dodatkowe");
$sel->is_text_present_ok("Nowe pole dodatkowe „cf_qa_blad_nr_$bug1_id” zostało utworzone.");

# Dodawanie wartości do pola dodatkowego.

$sel->click_ok("link=cf_qa_list_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_list_$bug1_id” (List$bug1_id)");
$sel->click_ok("link=Modyfikowanie dozwolonych wartości dla tego pola");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");

$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->type_ok("value", "zabawimy się?");
$sel->type_ok("sortkey", "805");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");
$sel->is_text_present_ok("Wartość zabawimy się? została dodana jako prawidłowy wybór dla pola List$bug1_id (cf_qa_list_$bug1_id).");

$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->type_ok("value", "przechowywanie");
$sel->type_ok("sortkey", "49");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");
$sel->is_text_present_ok("Wartość przechowywanie została dodana jako prawidłowy wybór dla pola List$bug1_id (cf_qa_list_$bug1_id).");

# Dodawanie nowego statusu i rozwiązania błędu

go_to_admin($sel);
$sel->click_ok("link=Wartości pól");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór pola");
$sel->click_ok("link=Rozwiązanie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „Resolution” (resolution)");
$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „Resolution” (resolution)");
$sel->type_ok("value", "PRZEKAZANY_DALEJ");
$sel->type_ok("sortkey", 450);
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");

go_to_admin($sel);
$sel->click_ok("link=Wartości pól");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór pola");
$sel->click_ok("link=Status");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „Status” (bug_status)");
$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „Status” (bug_status)");
$sel->type_ok("value", "ZAWIESZONY");
$sel->type_ok("sortkey", 250);
$sel->click_ok("open_status");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");

$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „Status” (bug_status)");
$sel->type_ok("value", "W_QA");
$sel->type_ok("sortkey", 550);
$sel->click_ok("closed_status");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");

$sel->click_ok("link=stronę zmian statusów błędów");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie zmian statusu");
$sel->click_ok('//td[@title="Z NIEPOTWIERDZONY na ZAWIESZONY"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z POTWIERDZONY na ZAWIESZONY"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z ZAWIESZONY na POTWIERDZONY"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z ZAWIESZONY na W REALIZACJI"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z ROZWIĄZANY na W_QA"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z W_QA na ZWERYFIKOWANY"]//input[@type="checkbox"]');
$sel->click_ok('//td[@title="Z W_QA na POTWIERDZONY"]//input[@type="checkbox"]');
$sel->click_ok('//input[@value="Zapisz zmiany"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie zmian statusu");

# Testowanie pól dodatkowych przy tworzeniu nowego błędu

file_bug_in_product($sel, 'TestProduct');
$sel->is_text_present_ok("List$bug1_id:");
$sel->is_element_present_ok("cf_qa_list_$bug1_id");
$sel->is_text_present_ok("Reference$bug1_id:");
$sel->is_element_present_ok("cf_qa_blad_nr_$bug1_id");
ok(!$sel->is_text_present("Freetext$bug1_id:"), "Freetext$bug1_id się nie wyświetla");
ok(!$sel->is_element_present("cf_qa_freetext_$bug1_id"), "cf_qa_freetext_$bug1_id jest niedostępny");
my $bug_summary2 = "Jedyny i niepowtarzalny";
$sel->type_ok("short_desc", $bug_summary2);
$sel->select_ok("bug_severity", "Krytyczny");
$sel->type_ok("cf_qa_blad_nr_$bug1_id", $bug1_id);
my $bug2_id = create_bug($sel, $bug_summary2);

# Sprawdzanie, czy oba pola są edytowalne

$sel->type_ok("cf_qa_poletekstowe_$bug1_id", "bonsai");
$sel->selected_label_is("cf_qa_list_$bug1_id", "---");
$sel->select_ok("bug_status", "label=ZAWIESZONY");
edit_bug($sel, $bug2_id, $bug_summary2);

go_to_bug($sel, $bug1_id);
$sel->type_ok("cf_qa_poletekstowe_$bug1_id", "dumbo");
$sel->select_ok("cf_qa_list_$bug1_id", "label=przechowywanie");
$sel->select_ok("bug_status", "ROZWIĄZANY");
$sel->select_ok("resolution", "PRZEKAZANY_DALEJ");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->select_ok("bug_status", "W_QA");
edit_bug_and_return($sel, $bug1_id, $bug_summary);

$sel->click_ok("link=Format wydruku");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pełny format listy błędów");
$sel->is_text_present_ok("PoleTekstowe$bug1_id: dumbo");
$sel->is_text_present_ok("List$bug1_id: przechowywanie");
$sel->is_text_present_ok("Status: W_QA PRZEKAZANY_DALEJ");
go_to_bug($sel, $bug2_id);
$sel->select_ok("cf_qa_list_$bug1_id", "label=przechowywanie");
edit_bug($sel, $bug2_id, $bug_summary2);

# Wyszukiwanie błędów z wykorzystaniem pól dodatkowych

open_advanced_search_page($sel);
$sel->remove_all_selections_ok("product");
$sel->add_selection_ok("product", "TestProduct");
$sel->remove_all_selections("bug_status");
$sel->remove_all_selections("resolution");
$sel->select_ok("f1", "label=List$bug1_id");
$sel->select_ok("o1", "label=jest taki, jak");
$sel->type_ok("v1", "przechowywanie");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono");
$sel->is_text_present_ok("Jaki jest mój numer?");
$sel->is_text_present_ok("Jedyny i niepowtarzalny");

# Test edycji pól dodatkowych podczas zmian grupowych

$sel->click_ok("link=Zmień wiele błędów jednocześnie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->click_ok("check_all");
$sel->select_ok("cf_qa_list_$bug1_id", "label=---");
$sel->type_ok("cf_qa_poletekstowe_$bug1_id", "dzięki");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Błędy zostały przetworzone");
$sel->click_ok("link=błędu $bug2_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug2_id/);
$sel->value_is("cf_qa_poletekstowe_$bug1_id", "dzięki");
$sel->selected_label_is("cf_qa_list_$bug1_id", "---");
$sel->select_ok("cf_qa_list_$bug1_id", "label=przechowywanie");
edit_bug($sel, $bug2_id, $bug_summary2);

# Sprawdzanie widoczności pól dodatkowych

go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");
$sel->click_ok("link=cf_qa_list_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_list_$bug1_id” (List$bug1_id)");
$sel->select_ok("visibility_field_id", "label=Waga błędu (bug_severity)");
$sel->add_selection_ok("visibility_values", "label=Blokujący");
$sel->add_selection_ok("visibility_values", "label=Krytyczny");
$sel->click_ok("edit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zaktualizowano pole dodatkowe");
go_to_bug($sel, $bug1_id);
$sel->is_element_present_ok("cf_qa_list_$bug1_id", "List$bug1_id jest obecny w DOM");
ok(!$sel->is_visible("cf_qa_list_$bug1_id"), "... ale nie jest wyświetlany dla błędów z wagą = 'Normalny'");
$sel->select_ok("bug_severity", "Poważny");
ok(!$sel->is_visible("cf_qa_list_$bug1_id"), "... lub z wagą = 'Poważny'");
$sel->select_ok("bug_severity", "Krytyczny");
$sel->is_visible_ok("cf_qa_list_$bug1_id", "... ale jest widoczny dla błedów z wagą = 'Krytyczny'");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->is_visible_ok("cf_qa_list_$bug1_id");

go_to_bug($sel, $bug2_id);
$sel->is_visible_ok("cf_qa_list_$bug1_id");
$sel->select_ok("bug_severity", "Drobny");
ok(!$sel->is_visible("cf_qa_list_$bug1_id"), "List$bug1_id nie jest wyświetlany dla błędów z wagą = 'Drobny'");
edit_bug_and_return($sel, $bug2_id, $bug_summary2);
ok(!$sel->is_visible("cf_qa_list_$bug1_id"), "List$bug1_id nie jest wyświetlany dla błędów z wagą = 'Drobny'");

# Dodawanie nowej wartości, wyświetlanej tylko pod pewnym warunkiem

go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");
$sel->click_ok("link=cf_qa_list_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_list_$bug1_id” (List$bug1_id)");
$sel->select_ok("value_field_id", "label=Rozwiązanie (resolution)");
$sel->click_ok("edit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zaktualizowano pole dodatkowe");
$sel->click_ok("link=cf_qa_list_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_list_$bug1_id” (List$bug1_id)");
$sel->click_ok("link=Modyfikowanie dozwolonych wartości dla tego pola");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->click_ok("link=Dodaj wartość");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->type_ok("value", "duch");
$sel->type_ok("sortkey", "500");
# to trzeba poprawić po naprawieniu błędu 4232
$sel->select_ok("visibility_value_id", "label=FIXED");
$sel->click_ok("id=create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową wartość pola");

go_to_bug($sel, $bug1_id);
my @labels = $sel->get_select_options("cf_qa_list_$bug1_id");
ok(grep(/^duch$/, @labels), "duch jest obecny w DOM strony...");
my $disabled = $sel->get_attribute("v4_cf_qa_list_$bug1_id\@disabled");
ok($disabled, "... ale nie jest standardowo dostępny");
$sel->select_ok("bug_status", "label=ROZWIĄZANY");
$sel->select_ok("resolution", "label=NAPRAWIONY");
$sel->select_ok("cf_qa_list_$bug1_id", "label=duch");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->selected_label_is("cf_qa_list_$bug1_id", "duch");

# Usuwanie nieużywanej wartości pola

go_to_admin($sel);
$sel->click_ok("link=Wartości pól");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór pola");
$sel->click_ok("link=List$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->click_ok("//a[contains(\@href, 'editvalues.cgi?action=del&field=cf_qa_list_$bug1_id&value=zabawimy%20si%C4%99%3F')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wartości „zabawimy się?” z pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->is_text_present_ok("Czy na pewno chcesz usunąć tę wartość?");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto wartość pola");

# Usuwanie używanej wartości pola

$sel->click_ok("//a[contains(\@href, 'editvalues.cgi?action=del&field=cf_qa_list_$bug1_id&value=przechowywanie')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wartości „przechowywanie” z pola „List$bug1_id” (cf_qa_list_$bug1_id)");
$sel->is_text_present_ok("Występuje 1 błąd z tą wartością");

# Oznaczanie <select> jako pola niaktualnego. Przez to powinien być niedostępny w formularzu zgłaszania błędu

go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");
$sel->click_ok("link=cf_qa_list_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_list_$bug1_id” (List$bug1_id)");
$sel->click_ok("obsolete");
$sel->value_is("obsolete", "on");
$sel->click_ok("edit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zaktualizowano pole dodatkowe");
go_to_bug($sel, $bug1_id);
$sel->value_is("cf_qa_poletekstowe_$bug1_id", "dzięki");
ok(!$sel->is_element_present("cf_qa_list_$bug1_id"), "Pole dodatkowe jest niewidoczne");

# Pola dodatkowe powinny być widoczne także dla niezalogowanych użytkowników

logout($sel);
go_to_bug($sel, $bug1_id);
$sel->is_text_present_ok("PoleTekstowe$bug1_id: dzięki");

# Użytkownicy bez praw powinni móc dodać siebie do listy
# obserwatorów, kiedy pola dodatkowe sa użyte

log_in($sel, $config, 'unprivileged');
go_to_bug($sel, $bug1_id);
$sel->is_text_present_ok("PoleTekstowe$bug1_id: dzięki");
$sel->click_ok("cc_edit_area_showhide");
$sel->type_ok("newcc", $config->{unprivileged_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# Wyłączanie pozostałych pól tekstowych

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Pola dodatkowe");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Pola dodatkowe");
$sel->click_ok("link=cf_qa_poletekstowe_$bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie pola dodatkowego „cf_qa_poletekstowe_$bug1_id” (PoleTekstowe$bug1_id)");
$sel->click_ok("obsolete");
$sel->value_is("obsolete", "on");
$sel->click_ok("edit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zaktualizowano pole dodatkowe");

# Próba usunięcia statusu błędu, które jest w użyciu - niedozwolone

go_to_admin($sel);
$sel->click_ok("link=Wartości pól");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wybór pola");
$sel->click_ok("link=Status");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wartości dla pola „Status” (bug_status)");
$sel->click_ok('//a[@href="editvalues.cgi?action=del&field=bug_status&value=ZAWIESZONY"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wartości „ZAWIESZONY” z pola „Status” (bug_status)");
$sel->is_text_present_ok("Wartość „ZAWIESZONY” nie może zostać usunięta");

go_to_bug($sel, $bug2_id);
$sel->select_ok("bug_status", "POTWIERDZONY");
edit_bug($sel, $bug2_id, $bug_summary2);

go_to_bug($sel, $bug1_id);
$sel->select_ok("bug_status", "ZWERYFIKOWANY");
$sel->select_ok("resolution", "NIEPRAWIDŁOWY");
edit_bug($sel, $bug1_id, $bug_summary);

# Usuwanie nieużywanych wartości
delete_unused_values($sel);
logout($sel);

sub delete_unused_values {
    go_to_admin($sel);
    $sel->click_ok("link=Wartości pól");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Wybór pola");
    $sel->click_ok("link=Status");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Modyfikowanie wartości dla pola „Status” (bug_status)");
    #usuwanie wartości z pola Status
    if ($sel->is_text_present("ZAWIESZONY")) {
        $sel->click_ok('//a[@href="editvalues.cgi?action=del&field=bug_status&value=ZAWIESZONY"]');
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usuwanie wartości „ZAWIESZONY” z pola „Status” (bug_status)");
        $sel->click_ok("delete");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usunięto wartość pola");
        $sel->is_text_present_ok("Wartość ZAWIESZONY pola Status (bug_status) została usunięta");
        };

    if ($sel->is_text_present("W_QA")) {
        $sel->click_ok('//a[@href="editvalues.cgi?action=del&field=bug_status&value=W_QA"]');
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usuwanie wartości „W_QA” z pola „Status” (bug_status)");
        $sel->click_ok("delete");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usunięto wartość pola");
        $sel->is_text_present_ok("Wartość W_QA pola Status (bug_status) została usunięta");
        };

    # Usuwanie wartości z pola Rozwiązanie
    go_to_admin($sel);
    $sel->click_ok("link=Wartości pól");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Wybór pola");
    $sel->click_ok("link=Rozwiązanie");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Modyfikowanie wartości dla pola „Resolution” (resolution)");
    if ($sel->is_text_present("PRZEKAZANY_DALEJ")) {
        $sel->click_ok('//a[@href="editvalues.cgi?action=del&field=resolution&value=PRZEKAZANY_DALEJ"]');
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usuwanie wartości „PRZEKAZANY_DALEJ” z pola „Resolution” (resolution)");
        $sel->click_ok("delete");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Usunięto wartość pola");
        $sel->is_text_present_ok("Wartość PRZEKAZANY_DALEJ pola Resolution (resolution) została usunięta");
        };
}
