use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Adresy e-mail dla nowych kont w bugzilli będą w domenie @bugzilla.test

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"createemailregexp" => {type => "text", value => '[^@]+@bugzilla\.test'}} });
logout($sel);

# Zakładanie konta. Dane użyte do adresu e-mail będą przypadkowe, 
# ponieważ wniosek o założenie konta wygasa po trzech dniach,
# a test może być uruchamiany wiele razy w ciągu jednego dnia
my $valid_account = 'selenium-' . random_string(10) . '@bugzilla.test';

$sel->click_ok("link=Główna");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Bugzilla – Strona główna");
$sel->is_text_present_ok("Nowe konto");
$sel->click_ok("link=Nowe konto");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie nowego konta w Bugzilli");
$sel->type_ok("login", $valid_account);
$sel->click_ok("send");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Prośba o utworzenie nowego konta „$valid_account” została dostarczona");
$sel->is_text_present_ok("Wiadomość zawierająca odnośnik do kontynuacji tworzenia konta została wysłana.");

# Próba założenia konta po raz drugi, z tym samym adresem.
$sel->click_ok("link=Główna");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Bugzilla – Strona główna");
$sel->is_text_present_ok("Nowe konto");
$sel->click_ok("link=Nowe konto");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie nowego konta w Bugzilli");
$sel->type_ok("login", $valid_account);
$sel->click_ok("send");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zbyt krótki okres pomiędzy prośbami o nowy token");
my $error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /Proszę odczekać chwilę i spróbować ponownie/, "Za wcześnie na zakładanie tego samego konta po raz drugi");

# Konta z niewłaściwą domeną w adresie
my @accounts = ('test@yahoo.com', 'test@bugzilla.net', 'test@bugzilla..test');
foreach my $account (@accounts) {
    $sel->click_ok("link=Nowe konto");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Tworzenie nowego konta w Bugzilli");
    $sel->type_ok("login", $account);
    $sel->click_ok("send");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Tworzenie kont jest ograniczone");
    $sel->is_text_present_ok("Tworzenie kont zostało ograniczone.");
}

# Nieprawidłowe adresy email
@accounts = ('test\bugzilla@bugzilla.test', 'test@bugzilla.org@bugzilla.test');
foreach my $account (@accounts) {
    $sel->click_ok("link=Nowe konto");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Tworzenie nowego konta w Bugzilli");
    $sel->type_ok("login", $account);
    $sel->click_ok("send");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Nieprawidłowy adres e-mail");
    my $error_msg = trim($sel->get_text("error_msg"));
    ok($error_msg =~ /^Podany adres e-mail (\S+) nie spełnia warunków poprawności adresu e-mail/, "Wykryto użycie nieprawidłowego adresu e-mail");
}

# Użycie adresu e-mail dla konta już istniejącego
$sel->click_ok("link=Nowe konto");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie nowego konta w Bugzilli");
$sel->type_ok("login", $config->{admin_user_login});
$sel->click_ok("send");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Konto już istnieje");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg eq "Już istnieje konto o identyfikatorze $config->{admin_user_login}.", "Wykryto istniejące konto");

# Wyłączenie możliwości zakładania nowych kont
log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"createemailregexp" => {type => "text", value => ''}} });
logout($sel);

# Sprawdzanie, czy wszystkie odnośniki do strony createaccount.cgi są ukryte
ok(!$sel->is_text_present("Nowe konto"), "Brak odnośnika do strony 'Nowe konto'");
$sel->click_ok("link=Główna");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Bugzilla – Strona główna");
ok(!$sel->is_text_present("Nowe konto"), "Brak odnośnika do strony 'Nowe konto'");
$sel->open_ok("/$config->{bugzilla_installation}/createaccount.cgi");
$sel->title_is("Tworzenie kont jest wyłączone");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /^Tworzenie kont zostało wyłączone lub ograniczone. Nowe konta może tworzyć tylko administrator/,
   "Tworzenie kont jest wyłączone");

# Włączanie możliwości zakładania kont

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"createemailregexp" => {type => "text", value => '.*'}} });

# Make sure selenium-<random_string>@bugzilla.test has not be added to the DB yet.
go_to_admin($sel);
$sel->click_ok("link=Użytkownicy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wyszukiwanie użytkowników");
$sel->type_ok("matchstr", $valid_account);
$sel->click_ok("search");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista użytkowników");
$sel->is_text_present_ok("Znaleziono 0 użytkowników");
logout($sel);
