use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Create keywords. Do some cleanup first if necessary.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Słowa kluczowe");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Słowa kluczowe");

# If keywords already exist, delete them to not disturb the test.

my $page = $sel->get_body_text();
my @keywords = $page =~ m/(slowo-kluczowe-selenium-\w+)/gi;

foreach my $keyword (@keywords) {
    my $url = $sel->get_attribute("link=$keyword\@href");
    $url =~ s/action=edit/action=del/;
    $sel->click_ok("//a[\@href='$url']");
    $sel->wait_for_page_to_load(WAIT_TIME);
    $sel->title_is("Usuwanie słowa kluczowego");
    $sel->click_ok("delete");
    $sel->wait_for_page_to_load(WAIT_TIME);
    $sel->title_is("Usunięto słowo kluczowe");
}

# Now let's create our first keyword.

go_to_admin($sel);
$sel->click_ok("link=Słowa kluczowe");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Słowa kluczowe");
$sel->click_ok("link=Dodaj nowe słowo");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Dodawanie słowa kluczowego");
$sel->type_ok("name", "slowo-kluczowe-selenium-k1");
$sel->type_ok("description", "Przychodzi baba do lekarza");
$sel->click_ok("create");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono nowe słowo kluczowe");

# Try create the same keyword, to check validators.

$sel->click_ok("link=Dodaj nowe słowo");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Dodawanie słowa kluczowego");
$sel->type_ok("name", "slowo-kluczowe-selenium-k1");
$sel->type_ok("description", "NAPRAW MNIE!");
$sel->click_ok("create");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Słowo kluczowe już istnieje");
my $error_msg = trim($sel->get_text("error_msg"));
ok($error_msg eq 'Słowo kluczowe slowo-kluczowe-selenium-k1 już istnieje.', 'Słowo kluczowe już istnieje');
$sel->go_back_ok();
$sel->wait_for_page_to_load(WAIT_TIME);

# Create a second keyword.

$sel->type_ok("name", "slowo-kluczowe-selenium-k2");
$sel->type_ok("description", "NAPRAW MNIE!");
$sel->click_ok("create");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Utworzono nowe słowo kluczowe");

# Again test validators.

$sel->click_ok("link=slowo-kluczowe-selenium-k2");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie słowa kluczowego");
$sel->type_ok("name", "slowo-kluczowe-selenium-k1");
$sel->type_ok("description", "a rybka na to: niemożliwe!");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Słowo kluczowe już istnieje");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg eq 'Słowo kluczowe slowo-kluczowe-selenium-k1 już istnieje.', 'Słowo kluczowe już istnieje');
$sel->go_back_ok();
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie słowa kluczowego");
$sel->type_ok("name", "slowo-kluczowe-selenium-k2");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Zaktualizowano słowo kluczowe");

# Add keywords to bugs

file_bug_in_product($sel, "TestProduct");
$sel->select_ok("component", "TestComponent");
$sel->type_ok("keywords", "slowo-kluczowe-selenium-k1");
my $bug_summary = "Piękny dzień dzisiaj mamy";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Test słów kluczowych");
my $bug1_id = create_bug($sel, $bug_summary);

file_bug_in_product($sel, "TestProduct");
$sel->select_ok("component", "TestComponent");
$sel->type_ok("keywords", "slowo-kluczowe-selenium-k1, slowo-kluczowe-selenium-k2");
my $bug_summary2 = "Radio gaga";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "Kolejny test słów kluczowych, dokładnie jak w błędzie $bug1_id");
my $bug2_id = create_bug($sel, $bug_summary2);

# Now make sure these bugs correctly appear in buglists.

open_advanced_search_page($sel);
$sel->remove_all_selections("product");
$sel->remove_all_selections("bug_status");
$sel->type_ok("keywords", "slowo-kluczowe-selenium-k1");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono 2 błędy");

$sel->click_ok("link=Wyszukiwanie");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Wyszukiwanie błędów");
$sel->remove_all_selections("product");
$sel->remove_all_selections("bug_status");
# Try with a different case than the one in the DB.
$sel->type_ok("keywords", "slowo-kluczowe-selenium-k2");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono jeden błąd");

$sel->click_ok("link=Wyszukiwanie");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Wyszukiwanie błędów");
$sel->remove_all_selections("product");
$sel->remove_all_selections("bug_status");
# Substrings also work for keywords.
$sel->type_ok("keywords", "selenium");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono 2 błędy");

# Make sure describekeywords.cgi works as expected.

$sel->click_ok("link=$bug_summary");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id /);
$sel->click_ok("link=Słowa kluczowe");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Opisy słów kluczowych Bugzilli");
$sel->is_text_present_ok("slowo-kluczowe-selenium-k1");
$sel->is_text_present_ok("Przychodzi baba do lekarza");
$sel->is_text_present_ok("slowo-kluczowe-selenium-k2");
$sel->is_text_present_ok("a rybka na to: niemożliwe!");
$sel->click_ok('//a[@href="buglist.cgi?keywords=slowo-kluczowe-selenium-k1"]');
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_element_present_ok("link=$bug1_id");
$sel->is_element_present_ok("link=$bug2_id");
$sel->is_text_present_ok("Znaleziono 2 błędy");
$sel->go_back_ok();
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->click_ok('//a[@href="buglist.cgi?keywords=slowo-kluczowe-selenium-k2"]');
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_element_present_ok("link=$bug2_id");
$sel->is_text_present_ok("Znaleziono jeden błąd");
logout($sel);
