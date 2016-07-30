use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

my $admin_user_login = $config->{admin_user_login};
my $unprivileged_user_login = $config->{unprivileged_user_login};
my $permanent_user = $config->{permanent_user};

log_in($sel, $config, 'admin');
set_parameters($sel, { "Pola błędu"              => {"useclassification-off" => undef,
                                                     "usetargetmilestone-on" => undef},
                       "Reguły administracyjne"  => {"allowbugdeletion-on"   => undef}
                     });

# Tworzenie produktu i dodanie to niego komponentów. 
# Najpierw porządki, na wypadek gdyby test padł przy poprzednim uruchomieniu

go_to_admin($sel);
$sel->click_ok("link=Produkty");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
# Nie ma możliwości, że otworzy się strona 'Wybierz kategorię'. Wyłączyliśmy możliwość kategoryzacji
$sel->title_is("Modyfikowanie produktów");

my $text = trim($sel->get_text("bugzilla-body"));
if ($text =~ /(Zabij mnie|Dobij mnie)/) {
    my $product = $1;
    my $escaped_product = url_quote($product);
    $sel->click_ok("//a[\@href='editproducts.cgi?action=del&product=$escaped_product']");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usuwanie produktu „$product”");
    $sel->click_ok("delete");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usunięto produkt");
}

$sel->click_ok("link=Dodaj produkt");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie produktu");
$sel->type_ok("product", "Zabij mnie");
$sel->type_ok("description", "Niedługo zniknę. Nie twórz błędów dla mnie");
$sel->type_ok("defaultmilestone", "0.1a");
# Od wydania 4.0 Bugzilli, system głosowania jest obsługiwany przez wtyczkę.
if ($config->{test_extensions}) {
    $sel->type_ok("votesperuser", "1");
    $sel->type_ok("maxvotesperbug", "1");
    $sel->type_ok("votestoconfirm", "10");
}
$sel->type_ok("version", "0.1a");
$sel->click_ok("//input[\@value='Dodaj']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$text = trim($sel->get_text("message"));
ok($text =~ /Należy dodać co najmniej jeden komponent, zanim ktokolwiek będzie mógł zgłaszać błędy w tym produkcie/,
   "Przypominacz o brakujących komponentach");
$sel->click_ok("link=dodać co najmniej jeden komponent");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie komponentu do produktu „Zabij mnie”");
$sel->type_ok("component", "komponent pierwszy");
$sel->type_ok("description", "komp 1");
$sel->type_ok("initialowner", $admin_user_login);
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono komponent");
$text = trim($sel->get_text("message"));
ok($text eq 'Komponent komponent pierwszy został utworzony.', "Utworzono komponent");

# Próba utworzenia kolejnego komponentu o tej samej nazwie.

$sel->click_ok("link=Dodaj nowy komponent do produktu „Zabij mnie”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie komponentu do produktu „Zabij mnie”");
$sel->type_ok("component", "komponent pierwszy");
$sel->type_ok("description", "komp 2");
$sel->type_ok("initialowner", $admin_user_login);
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Komponent już istnieje");

# Tworzenie kolejnego komponentu - tym razem o innej nazwie.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->type_ok("component", "komponent drugi");
# FIXME - Re-enter the default assignee (regression due to bug 577574)
$sel->type_ok("initialowner", $admin_user_login);
$sel->type_ok("initialcc", $permanent_user);
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono komponent");

# Dodawanie nowej wersji.

edit_product($sel, "Zabij mnie");
$sel->click_ok("//a[contains(text(),'Modyfikuj\nwersje:')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji produktu „Zabij mnie”");
$sel->click_ok("link=Dodaj wersję");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->type_ok("version", "0.1");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wersję");

# Dodawanie nowej wersji docelowej.

$sel->click_ok("link=Modyfikuj produkt „Zabij mnie”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktu „Zabij mnie”");
$sel->click_ok("link=Modyfikuj wersje docelowe:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji docelowych produktu „Zabij mnie”");
$sel->click_ok("link=Dodaj wersję docelową");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wersji docelowej do produktu „Zabij mnie”");
$sel->type_ok("milestone", "0.2");
$sel->type_ok("sortkey", "2");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wersję docelową");

# Dodawanie kolejnej wersji docelowej.

$sel->click_ok("link=Dodaj wersję docelową");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie wersji docelowej do produktu „Zabij mnie”");
$sel->type_ok("milestone", "0.1a");
# Ujemne klucze sortowania są poprawne.
$sel->type_ok("sortkey", "-2");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wersja docelowa już istnieje");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->type_ok("milestone", "pre-0.1");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono wersję docelową");

# Tworzenie błędu ze statusem NIEPOTWIERDZONY i dodawanie go do nowego produktu.

file_bug_in_product($sel, "Zabij mnie");
$sel->select_ok("version", "label=0.1a");
$sel->select_ok("component", "label=komponent pierwszy");
# Status NIEPOTWIERDZONY musi być widoczny
$sel->select_ok("bug_status", "label=NIEPOTWIERDZONY");
$sel->type_ok("cc", $unprivileged_user_login);
$sel->type_ok("bug_file_loc", "http://www.test.com");
my $bug_summary = "sprawdzanie dodawania/edycji właściwości produktu";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "ten błąd wkrótce zniknie");
my $bug1_id = create_bug($sel, $bug_summary);
my @cc_list = $sel->get_select_options("cc");
ok(grep($_ eq $unprivileged_user_login, @cc_list), "Użytkownik $unprivileged_user_login został dodany do listy obserwatorów");
ok(!grep($_ eq $permanent_user, @cc_list), "Użytkownik $permanent_user nie znajduje się domyślnie na liście obserwatorów komponentu pierwszego");

# Tworzenie kolejnego błędu i sprawdzania, czy domyślni obserwatorzy są dodawani
file_bug_in_product($sel, "Zabij mnie");
$sel->select_ok("version", "label=0.1a");
$sel->select_ok("component", "label=komponent drugi");
my $bug_summary2 = "sprawdzanie dodawania domyślnych obserwatorów";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "czy lista obserwatorów jest poprawnie dodawana?");
create_bug($sel, $bug_summary2);
@cc_list = $sel->get_select_options("cc");
ok(grep($_ eq $permanent_user, @cc_list), "Użytkownik $permanent_user znajduje się domyślnie na liście obserwatorów komponentu drugiego");

# Edycja właściwości produktu i ustawianie automatycznego potwierdzenia błędów na 0.
# W rezultacie automatyczne potwierdzanie błędów przez głosowanie zostanie wyłączone.
# To jest nowe zachowanie, odmienne od tego w wersjach Bugzilli 3.4 i starszych

edit_product($sel, "Zabij mnie");
$sel->type_ok("product", "Dobij mnie");
$sel->type_ok("description", "Niedługo zniknę. Nie twórz błędów dla mnie (chyba, że do testów).");
$sel->select_ok("defaultmilestone", "label=0.2");
if ($config->{test_extensions}) {
    $sel->type_ok("votesperuser", "2");
    $sel->type_ok("maxvotesperbug", 5);
    $sel->type_ok("votestoconfirm", "0");
}
$sel->click_ok("update-product");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja produktu „Dobij mnie”");
$sel->is_text_present_ok("Zaktualizowano nazwę produktu z „Zabij mnie” na „Dobij mnie”");
$sel->is_text_present_ok("Zmieniono opis");
$sel->is_text_present_ok("Zaktualizowano domyślną wersję docelową produktu");
if ($config->{test_extensions}) {
    $sel->is_text_present_ok("Zaktualizowano liczbę głosów użytkownika");
    $sel->is_text_present_ok("Zaktualizowano maksymalną liczbę głosów na błąd");
    $sel->is_text_present_ok("Zaktualizowano liczbę głosów wymaganą do potwierdzenia błędu");
    $text = trim($sel->get_text("bugzilla-body"));
    # Używamy .{1} zamiast symbolu strzałki w prawo, w przeciwnym wypadku test pada.
    ok($text =~ /Wyszukiwanie niepotwierdzonych błędów w tym produkcie w poszukiwaniu tych, które po zmianach ustawień głosowania mają wystarczającą liczbę głosów do potwierdzenia\.{3} .{1}nie znaleziono/,
       "Nie znaleziono żadnych błędów potwierdzonych głosowaniem (ustawienie votestoconfirm = 0 wyłącza opcję automatycznego potwierdzania błędów)");

    # Zmiana ilości głosów potrzebnych do automatycznego potwierdzenia błędów na 2
    # Głosowanie na błąd i kolejna zmiana ilości głosów na 1
    # Chodzi o wywołanie automatycznego potwierdzenia błędu    

    $sel->click_ok("link=Dobij mnie");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Modyfikowanie produktu „Dobij mnie”", "Wyświetlanie właściwości produktu 'Dobij mnie'");
    $sel->type_ok("votestoconfirm", 2);
    $sel->click_ok("update-product");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Aktualizacja produktu „Dobij mnie”");
    $sel->is_text_present_ok("Zaktualizowano liczbę głosów wymaganą do potwierdzenia błędu");

    go_to_bug($sel, $bug1_id);
    $sel->click_ok("link=głosuj");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Zmiana liczby głosów");
    $sel->type_ok("bug_$bug1_id", 1);
    $sel->click_ok("change");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Zmiana liczby głosów");
    $sel->is_text_present_ok("Zmiana głosów została zapisana");

    edit_product($sel, "Dobij mnie");
    $sel->type_ok("votestoconfirm", 1);
    $sel->click_ok("update-product");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Aktualizacja produktu „Dobij mnie”");
    $sel->is_text_present_ok("Zaktualizowano liczbę głosów wymaganą do potwierdzenia błędu");
    $text = trim($sel->get_text("bugzilla-body"));
    ok($text =~ /Błąd $bug1_id został potwierdzony przez liczbę głosów/, "Błąd $bug1_id został potwierdzony liczbą głosów");
}

# Edycja błędu.

go_to_bug($sel, $bug1_id);
$sel->selected_label_is("product", "Dobij mnie");
$sel->selected_label_is("bug_status", "POTWIERDZONY") if $config->{test_extensions};
$sel->select_ok("target_milestone", "label=pre-0.1");
$sel->select_ok("component", "label=komponent drugi");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
@cc_list = $sel->get_select_options("cc");
ok(grep($_ eq $permanent_user, @cc_list), "Użytkownik $permanent_user jest automatycznie dodawany do listy obserwatorów");

# Usuwanie wersji docelowej, do której błąd jest przypisany.
# Błąd powinien zostać automatycznie przeniesiony do domyślnej wersji docelowej.

edit_product($sel, "Dobij mnie");
$sel->click_ok("link=Modyfikuj wersje docelowe:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji docelowych produktu „Dobij mnie”");
$sel->click_ok('//a[@href="editmilestones.cgi?action=del&product=Dobij%20mnie&milestone=pre-0.1"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wersji docelowej produktu „Dobij mnie”");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /Istnieje 1 otwarty błąd dla tej wersji docelowej/, "Wyświetlenie ostrzeżenia");
ok($text =~ /Czy na pewno chcesz usunąć tę wersję docelową\?/, "Wymaganie potwierdzenia");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto wersję docelową");
$text = trim($sel->get_text("message"));
ok($text =~ /Błędy przypisane do tej wersji docelowej zostały przypisane do domyślnej wersji docelowej/, "Błędy zostały przeniesione");

# Próba usunięcia wersji, do której błąd jest przypisany. Usunięcie nie powinno być możliwe.

$sel->click_ok("link=Modyfikuj produkt „Dobij mnie”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktu „Dobij mnie”");
$sel->click_ok("//a[contains(text(),'Modyfikuj\nwersje:')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie wersji produktu „Dobij mnie”");
$sel->click_ok("//a[contains(\@href, 'editversions.cgi?action=del&product=Dobij%20mnie&version=0.1a')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wersji produktu „Dobij mnie”");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /W tej wersji nadal znajdują się błędy: 2/, "Odmowa usunięcia wersji");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);

# Próba usunięcia wersji bez przypisanych błędów. Nie powinno być problemów.

$sel->click_ok('//a[@href="editversions.cgi?action=del&product=Dobij%20mnie&version=0.1"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie wersji produktu „Dobij mnie”");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /Czy na pewno chcesz usunąć tę wersję\?/, "Wymaganie potwierdzenia");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto wersję");

# Usuwanie komponentu, do którego przypisany jest błąd. Nie powinno być problemów.

$sel->click_ok("link=Modyfikuj produkt „Dobij mnie”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktu „Dobij mnie”");
$sel->click_ok("link=Modyfikuj komponenty:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie komponentów produktu „Dobij mnie”");
$sel->click_ok("//a[contains(\@href, 'editcomponents.cgi?action=del&product=Dobij%20mnie&component=komponent%20drugi')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie komponentu „komponent drugi” z produktu „Dobij mnie”");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /W tym komponencie są otwarte błędy: 2/, "Wyświetlenie ostrzeżenia");
ok($text =~ /Czy na pewno chcesz usunąć ten komponent\?/, "Wymaganie potwierdzenia");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto komponent");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /Komponent komponent drugi został usunięty/, "Potwierdzenie usunięcia komponentu");
ok($text =~ /Wszystkie błędy znajdujące się w tym komponencie i wszystkie odniesienia do niego zostały także usunięte/,
   "Potwierdzenie usunięcia błędów");

# W tej chwili pozostał tylko jeden komponent, wersja oraz wersja docelowa w tym produkcie.
# Przy tworzeniu nowego błędu powinny być domyślnie wybierane.

file_bug_in_product($sel, "Dobij mnie");
$bug_summary2 = "żegnajcie wszyscy!";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "Umarłem :(");
create_bug($sel, $bug_summary2);

# Usuwanie produktu

go_to_admin($sel);
$sel->click_ok("link=Produkty");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktów");
$sel->click_ok("//a[\@href='editproducts.cgi?action=del&product=Dobij%20mnie']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie produktu „Dobij mnie”");
$text = trim($sel->get_text("bugzilla-body"));
ok($text =~ /Nadal istnieje 1 otwarty błąd dla tego produktu/, "Wyświetlenie ostrzeżenia");
ok($text =~ /Czy na pewno chcesz usunąć ten produkt\?/, "Wymaganie potwierdzenia");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto produkt");
logout($sel);
