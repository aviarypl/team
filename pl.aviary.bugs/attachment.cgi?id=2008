use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

# Do tego testu wymagane będzie dodawanie plików znajdujących się na dysku komputera.
# Do tego potrzebne są przywileje chrome.
my ($sel, $config) = get_selenium(CHROME_MODE);

# Tworzenie rodzaju flagi dla błędów.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Flagi");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zarządzanie flagami");
$sel->click_ok("link=Utwórz flagę dla błędów");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->type_ok("name", "FlagaTestowa1");
$sel->type_ok("description", "flagatestowa1");
$sel->select_ok("product", "label=TestProduct");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->remove_all_selections_ok("inclusion_to_remove");
$sel->add_selection_ok("inclusion_to_remove", "label=__Any__:__Any__");
$sel->click_ok("categoryAction-removeInclusion");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->select_ok("product", "label=QA-Selenium-TEST");
$sel->click_ok("categoryAction-exclude");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->select_ok("product", "label=QA-Selenium-TEST");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
my @inclusion = $sel->get_select_options("inclusion_to_remove");
ok(scalar @inclusion == 2, "Lista dołączonych zawiera dwa elementy");
ok(grep($_ eq "QA-Selenium-TEST:__Any__", @inclusion), "QA-Selenium-TEST:__Any__ znajduje się na liście dołączonych");
ok(grep($_ eq "TestProduct:__Any__", @inclusion), "TestProduct:__Any__ znajduje się na liście dołączonych");
my @exclusion = $sel->get_select_options("exclusion_to_remove");
ok(scalar @exclusion == 1, "Lista wykluczonych zawiera jeden element");
ok($exclusion[0] eq "QA-Selenium-TEST:__Any__", "QA-Selenium-TEST:__Any__ znajduje się na liście wykluczonych");
$sel->type_ok("sortkey", "900");
$sel->value_is("cc_list", "");
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->value_is("is_requesteeble", "on");
$sel->value_is("is_multiplicable", "on");
$sel->select_ok("grant_group", "label=admin");
$sel->select_ok("request_group", "label=(brak grupy)");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaTestowa1” została utworzona");
$sel->is_text_present_ok("Flaga FlagaTestowa1 została utworzona.");
my $flagtype_url = $sel->get_attribute('link=FlagaTestowa1@href');
$flagtype_url =~ /id=(\d+)$/;
my $flagtype1_id = $1;

# Kopiowanie flagi, ale ze zmianami w polu grupy pytającej (na 'editbugs') oraz klucza sortowania na 950.

$sel->click_ok("//a[\@href='editflagtypes.cgi?action=copy&id=$flagtype1_id']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
# Do poprawki po naprawieniu krowy 4251
$sel->title_is("Tworzenie flagi dla błędów na podstawie flagi „FlagaTestowa1”");
$sel->type_ok("name", "FlagaTestowa2");
$sel->type_ok("description", "flagatestowa2");
@inclusion = $sel->get_select_options("inclusion_to_remove");
ok(scalar @inclusion == 2, "Lista dołączonych zawiera dwa elementy");
ok(grep($_ eq "QA-Selenium-TEST:__Any__", @inclusion), "QA-Selenium-TEST:__Any__ znajduje się na liście dołączonych");
ok(grep($_ eq "TestProduct:__Any__", @inclusion), "TestProduct:__Any__ znajduje się na liście dołączonych");
@exclusion = $sel->get_select_options("exclusion_to_remove");
ok(scalar @exclusion == 1, "Lista wykluczonych zawiera jeden element");
ok($exclusion[0] eq "QA-Selenium-TEST:__Any__", "QA-Selenium-TEST:__Any__ znajduje się na liście wykluczonych");
$sel->type_ok("sortkey", "950");
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->value_is("is_requesteeble", "on");
$sel->value_is("is_multiplicable", "on");
$sel->type_ok("cc_list", $config->{canconfirm_user_login});
$sel->selected_label_is("grant_group", "admin");
$sel->select_ok("request_group", "label=editbugs");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaTestowa2” została utworzona");
$sel->is_text_present_ok("Flaga FlagaTestowa2 została utworzona.");
$flagtype_url = $sel->get_attribute('link=FlagaTestowa2@href');
$flagtype_url =~ /id=(\d+)$/;
my $flagtype2_id = $1;

# Kopiowanie pierwszej flagi ponownie, ale z innymi atrybutami.

$sel->click_ok("//a[\@href='editflagtypes.cgi?action=copy&id=$flagtype1_id']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów na podstawie flagi „FlagaTestowa1”");
$sel->type_ok("name", "FlagaTestowa3");
$sel->type_ok("description", "flagatestowa3");
$sel->type_ok("sortkey", "980");
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->uncheck_ok("is_requesteeble");
$sel->uncheck_ok("is_multiplicable");
$sel->value_is("cc_list", "");
$sel->select_ok("grant_group", "label=(brak grupy)");
$sel->selected_label_is("request_group", "(brak grupy)");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaTestowa3” została utworzona");
$sel->is_text_present_ok("Flaga FlagaTestowa3 została utworzona.");
$flagtype_url = $sel->get_attribute('link=FlagaTestowa3@href');
$flagtype_url =~ /id=(\d+)$/;
my $flagtype3_id = $1;

# Tworzenie flagi dla załączników.

$sel->click_ok("link=Utwórz flagę dla załączników");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->type_ok("name", "FlagaDlaZalacznikow1");
$sel->type_ok("description", "flagadlazalacznikow1");
$sel->select_ok("product", "label=TestProduct");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->remove_all_selections_ok("inclusion_to_remove");
$sel->add_selection_ok("inclusion_to_remove", "label=__Any__:__Any__");
$sel->click_ok("categoryAction-removeInclusion");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
@inclusion = $sel->get_select_options("inclusion_to_remove");
ok(scalar @inclusion == 1, "Lista dołączonych zawiera jeden element");
ok($inclusion[0] eq "TestProduct:__Any__", "TestProduct:__Any__ znajduje się na liście dołączonych");
$sel->type_ok("sortkey", "700");
$sel->value_is("cc_list", "");
$sel->select_ok("grant_group", "label=editbugs");
$sel->select_ok("request_group", "label=canconfirm");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaDlaZalacznikow1” została utworzona");
$sel->is_text_present_ok("Flaga FlagaDlaZalacznikow1 została utworzona.");
$flagtype_url = $sel->get_attribute('link=FlagaDlaZalacznikow1@href');
$flagtype_url =~ /id=(\d+)$/;
my $aflagtype1_id = $1;

# Kopiowanie flagi.

$sel->click_ok("//a[\@href='editflagtypes.cgi?action=copy&id=$aflagtype1_id']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
# Do poprawki po naprawieniu krowy 4251
$sel->title_is("Tworzenie flagi dla załączników na podstawie flagi „FlagaDlaZalacznikow1”");
$sel->type_ok("name", "FlagaDlaZalacznikow2");
$sel->type_ok("description", "flagadlazalacznikow2");
@inclusion = $sel->get_select_options("inclusion_to_remove");
ok(scalar @inclusion == 1, "Lista dołączonych zawiera jeden element");
ok($inclusion[0] eq "TestProduct:__Any__", "TestProduct:__Any__ znajduje się na liście dołączonych");
$sel->type_ok("sortkey", "750");
$sel->type_ok("cc_list", $config->{admin_user_login});
$sel->uncheck_ok("is_multiplicable");
$sel->select_ok("grant_group", "label=(brak grupy)");
$sel->select_ok("request_group", "label=(brak grupy)");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaDlaZalacznikow2” została utworzona");
$sel->is_text_present_ok("Flaga FlagaDlaZalacznikow2 została utworzona.");
$flagtype_url = $sel->get_attribute('link=FlagaDlaZalacznikow2@href');
$flagtype_url =~ /id=(\d+)$/;
my $aflagtype2_id = $1;

# Kopiowanie flagi po raz kolejny i deaktywowanie jej.

$sel->click_ok("//a[\@href='editflagtypes.cgi?action=copy&id=$aflagtype1_id']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników na podstawie flagi „FlagaDlaZalacznikow1”");
$sel->type_ok("name", "FlagaDlaZalacznikow3");
$sel->type_ok("description", "flagadlazalacznikow3");
$sel->type_ok("sortkey", "800");
$sel->uncheck_ok("is_active");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „FlagaDlaZalacznikow3” została utworzona");
$sel->is_text_present_ok("Flaga FlagaDlaZalacznikow3 została utworzona.");
$flagtype_url = $sel->get_attribute('link=FlagaDlaZalacznikow3@href');
$flagtype_url =~ /id=(\d+)$/;
my $aflagtype3_id = $1;

# Utworzono wszystkie rodzaje flag. Teraz można testować.

file_bug_in_product($sel, 'TestProduct');
my $bug_summary = "testowanie flag";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "to jest błąd stworzony do testowania flag");
# Błąd należy ograniczyć dla użytkowników w grupie Master. To będzie ważne w późniejszych testach!
$sel->check_ok('//input[@name="groups" and @value="Master"]');
my $bug1_id = create_bug($sel, $bug_summary);

# Wszystkie 3 flagi testowe muszą być dostępne; korzystamy z produktu TestProduct.

$sel->is_text_present_ok("FlagaTestowa1");
# Dla pewności wybieramy //select lub //input. Nie jest to konieczne.
$sel->is_element_present_ok("//select[\@id='flag_type-$flagtype1_id']");
$sel->is_element_present_ok("//input[\@id='requestee_type-$flagtype1_id']");
# Jeśli powyższe pola są poprawne, zakładamy, że poniższe również.
$sel->is_text_present_ok("FlagaTestowa2");
$sel->is_element_present_ok("flag_type-$flagtype2_id");
$sel->is_element_present_ok("requestee_type-$flagtype2_id");
$sel->is_text_present_ok("FlagaTestowa3");
$sel->is_element_present_ok("flag_type-$flagtype3_id");
ok(!$sel->is_element_present("requestee_type-$flagtype3_id"), "FlagaTestowa3 nie ma pola prośby");

# To jest celowe do wygenerowania emaila z informacją o prośbie. Niektóre flagi
# mają przypisaną do nich listę obserwatorów, niektóre nie. 
# Poniższy fragment napisany jest do wykrywania błędów podczas MTA.

$sel->select_ok("flag_type-$flagtype1_id", "label=?");
$sel->select_ok("flag_type-$flagtype2_id", "label=?");
$sel->select_ok("flag_type-$flagtype3_id", "label=?");
$sel->type_ok("comment", "Ustawianie wszystkich trzech flag na ?");
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Zapisywanie id flag.

$sel->is_text_present_ok("$config->{admin_user_username}: FlagaTestowa1");
my $flag1_1_id = $sel->get_attribute('//select[@title="flagatestowa1"]@id');
$flag1_1_id =~ s/flag-//;
$sel->is_text_present_ok("$config->{admin_user_username}: FlagaTestowa2");
my $flag2_1_id = $sel->get_attribute('//select[@title="flagatestowa2"]@id');
$flag2_1_id =~ s/flag-//;
$sel->is_text_present_ok("$config->{admin_user_username}: FlagaTestowa3");
my $flag3_1_id = $sel->get_attribute('//select[@title="flagatestowa3"]@id');
$flag3_1_id =~ s/flag-//;
$sel->is_text_present_ok("Dodaj FlagaTestowa1");
$sel->is_text_present_ok("Dodaj FlagaTestowa2");
ok(!$sel->is_text_present("Dodaj FlagaTestowa3"), "FlagaTestowa3 nie jest flagą wielokrotną");
$sel->select_ok("flag_type-$flagtype1_id", "label=+");
$sel->select_ok("flag_type-$flagtype2_id", "label=-");
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Testy dotyczące grupy pytające. FlagaTestowa2 wymaga od pytającego
# przynależności do grupy editbugs.

$sel->select_ok("flag_type-$flagtype1_id", "label=?");
$sel->type_ok("requestee_type-$flagtype1_id", $config->{admin_user_login});
$sel->select_ok("flag_type-$flagtype2_id", "label=?");
$sel->type_ok("requestee_type-$flagtype2_id", $config->{unprivileged_user_login});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Prośba o zweryfikowanie flagi do osoby bez uprawnień");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->type_ok("requestee_type-$flagtype2_id", $config->{admin_user_login});
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Ostatni test dla flag testowych.

$sel->select_ok("flag-$flag1_1_id", "value=X");
$sel->select_ok("flag-$flag2_1_id", "label=+");
$sel->select_ok("flag-$flag3_1_id", "label=-");
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Teraz testy dla flag dla załączników.

$sel->click_ok("link=Dodaj załącznik");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie załącznika do błędu #$bug1_id");
# Musisz mieć w tym miejscu pli załącznika!
$sel->type_ok("data", "/var/www/selenium/latka.diff");
$sel->type_ok("description", "łatka, v1");
$sel->check_ok("ispatch");
$sel->is_text_present_ok("FlagaDlaZalacznikow1");
$sel->is_text_present_ok("FlagaDlaZalacznikow2");
ok(!$sel->is_text_present("FlagaDlaZalacznikow3"), "Nieaktywna FlagaDlaZalacznikow3 nie jest wyświetlona");

# Wygenerujmy maile z prośbą o flagę, najpierw bez pytającego.

$sel->select_ok("flag_type-$aflagtype1_id", "label=?");
$sel->select_ok("flag_type-$aflagtype2_id", "label=?");
$sel->type_ok("comment", "łatka wyłącznie dla celów testowych");
edit_bug($sel, $bug1_id, $bug_summary, {id => "create"});

# Zapisanie ID flagi.

my $alink = $sel->get_attribute('//a[@title="łatka, v1"]@href');
$alink =~ /id=(\d+)/;
my $attachment1_id = $1;

# Dodawanie kolejnego załacznika, i ustawianie pytającego.

$sel->click_ok("//a[contains(text(),'Utwórz\n kolejny załącznik do błędu $bug1_id')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie załącznika do błędu #$bug1_id");
$sel->type_ok("data", "/var/www/selenium/latka.diff");
$sel->type_ok("description", "łatka, v2");
$sel->check_ok("ispatch");
# Zaznaczanie poprzedniego załącznika jako zdezaktualizowanego.
$sel->check_ok($attachment1_id);
$sel->select_ok("flag_type-$aflagtype1_id", "label=?");
$sel->type_ok("requestee_type-$aflagtype1_id", $config->{admin_user_login});
$sel->select_ok("flag_type-$aflagtype2_id", "label=?");
# Proszący nie należy do grupy Master, w związku z czym nie ma dostępu do błędu.
# Musi być po cichu pominięty w tym polu.
$sel->type_ok("requestee_type-$aflagtype2_id", $config->{unprivileged_user_login});
$sel->type_ok("comment", "druga łatka, z prośbą");
edit_bug($sel, $bug1_id, $bug_summary, {id => "create"});
$alink = $sel->get_attribute('//a[@title="łatka, v2"]@href');
$alink =~ /id=(\d+)/;
my $attachment2_id = $1;

# Dodawanie trzeciego załącznika. Tym razem typ zawartości wybieramy ręcznie.

$sel->click_ok("//a[contains(text(),'Utwórz\n kolejny załącznik do błędu $bug1_id')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie załącznika do błędu #$bug1_id");
$sel->type_ok("data", "/var/www/selenium/latka.diff");
$sel->type_ok("description", "łatka, v3");
$sel->click_ok("list");
$sel->select_ok("contenttypeselection", "label=dokument tekstowy (text/plain)");
$sel->select_ok("flag_type-$aflagtype1_id", "label=+");
$sel->type_ok("comment", "jeden +, drugi pusty");
edit_bug($sel, $bug1_id, $bug_summary, {id => "create"});
$alink = $sel->get_attribute('//a[@title="łatka, v3"]@href');
$alink =~ /id=(\d+)/;
my $attachment3_id = $1;

# Wyświetlanie błędu i sprawdzanie, czy flagi są poprawnie ustawione.

$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->is_text_present_ok("$config->{admin_user_username}: FlagaDlaZalacznikow1? ($config->{admin_user_username})");
$sel->is_text_present_ok("$config->{admin_user_username}: FlagaDlaZalacznikow2?");
$sel->is_text_present_ok("$config->{admin_user_username}: FlagaDlaZalacznikow1+");
# Pierwszy załącznik został zaznaczony jako zdezaktualizowany, więc nie powinien mieć przypisanej flagi.
$sel->is_text_present_ok("brak flag");

# Zmiana błędu na publiczny i wylogowanie.

$sel->uncheck_ok('//input[@name="groups" and @value="Master"]');
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);

# Próba edycji flag przez użytkownika bez uprawnień.

log_in($sel, $config, 'unprivileged');
go_to_bug($sel, $bug1_id);
# Do zmiany tej flagi nie są potrzebne żadne uprawnienia.
$sel->select_ok("flag-$flag3_1_id", "value=X");
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Do zmiany poniższej flagi wymagana jest przynależność do grupy editbugs,
# więc poza już ustawioną wartością "+" dla flagi, żadna inna nie powinna być wyświetlana.

my @flag_states = $sel->get_select_options("flag-$flag2_1_id");
ok(scalar(@flag_states) == 1 && $flag_states[0] eq '+', "Tylko jedna wartość dla tej flagi jest wyświetlana - '+'");

# Użytkownicy bez uprawnień nie mogą zmianić wartości flagi na +, ale mogą je zmienić na ?.

@flag_states = $sel->get_select_options("flag_type-$flagtype1_id");
ok(scalar @flag_states == 2, "Dostępne są dwie wartości flagi");
ok(grep($_ eq '?', @flag_states), "Dostępna jest wartość '?'");

# Użytkownik bez uprawnień nie może zmieniać flag dla załączników ustawionych przez kogoś innego.

$sel->click_ok("//a[\@href='attachment.cgi?id=$attachment2_id&action=edit']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Szczegóły załącznika $attachment2_id do błędu $bug1_id");
ok(!$sel->is_element_present('//select[@title="flagadlazalacznikow2"]'),
   "Użytkownik bez uprawnień nie może edytować flag dla załączników");

# Dodawanie załącznika i ustawianie dla niego flagi.

$sel->click_ok("link=błędu $bug1_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("link=Dodaj załącznik");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie załącznika do błędu #$bug1_id");
$sel->type_ok("data", "/var/www/selenium/latka.diff");
$sel->type_ok("description", "łatka, v4");
$sel->value_is("ispatch", "off");
$sel->value_is("autodetect", "on");

# do edycji tego błędu wymagana jest przynależność do jednej z grup: canconfirm/editbugs.

ok(!$sel->is_editable("flag_type-$aflagtype1_id"), "Użytkownik bez uprawnień nie może edytować flagi");

# Do zmiany tej flagi nie są potrzebne żadne uprawnienia.

$sel->select_ok("flag_type-$aflagtype2_id", "label=+");
$sel->type_ok("comment", "odpowiadam po raz kolejny");
edit_bug_and_return($sel, $bug1_id, $bug_summary, {id => "create"});
$sel->is_text_present_ok("$config->{unprivileged_user_username}: FlagaDlaZalacznikow2+");
logout($sel);

# Ostatni test dla administratora. Ma uprawnienia do edycji błędów, więc może
# edytować łatki innych użytkowników.

log_in($sel, $config, 'admin');
go_to_bug($sel, $bug1_id);
$sel->click_ok("//a[\@href='attachment.cgi?id=${attachment3_id}&action=edit']");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Szczegóły załącznika $attachment3_id do błędu $bug1_id");
$sel->select_ok('//select[@title="flagadlazalacznikow1"]', "label=+");
edit_bug($sel, $bug1_id, $bug_summary, {id => "update"});

# Usuwanie wszystkich utworzonych flag.

go_to_admin($sel);
$sel->click_ok("link=Flagi");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zarządzanie flagami");

foreach my $flagtype ([$flagtype1_id, "FlagaTestowa1"], [$flagtype2_id, "FlagaTestowa2"],
                      [$flagtype3_id, "FlagaTestowa3"], [$aflagtype1_id, "FlagaDlaZalacznikow1"],
                      [$aflagtype2_id, "FlagaDlaZalacznikow2"], [$aflagtype3_id, "FlagaDlaZalacznikow3"])
{
    my $flag_id = $flagtype->[0];
    my $flag_name = $flagtype->[1];
    $sel->click_ok("//a[\@href='editflagtypes.cgi?action=confirmdelete&id=$flag_id']");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Potwierdzenie usunięcia flagi „$flag_name”");
    $sel->click_ok("link=Tak");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Usunięto flagę „$flag_name”");
    my $msg = trim($sel->get_text("message"));
    ok($msg eq "Flaga $flag_name została usunięta.", "Flaga $flag_name została usunięta");
}
logout($sel);
