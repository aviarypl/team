use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

log_in($sel, $config, 'admin');
set_parameters($sel, { "Reguły administracyjne" => {"allowuserdeletion-on" => undef} });

# First delete test users, if not deleted correctly during a previous run.

cleanup_users($sel);

# The Master group inherits privs of the Slave group.

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

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=Dodaj nową grupę");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie grupy");
$sel->type_ok("name", "Slave");
$sel->type_ok("desc", "Użytkownicy w grupie Master są również członkami tej grupy");
$sel->uncheck_ok("isactive");
ok(!$sel->is_checked("insertnew"), "Grupa nie będzie domyślnie dodawana do produktów");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono nową grupę");
my $slave_gid = $sel->get_value("group_id");
$sel->add_selection_ok("members_add", "label=Master");
$sel->click_ok('//input[@value="Aktualizuj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Slave");

# Create users.

go_to_admin($sel);
$sel->click_ok("link=Użytkownicy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->click_ok('link=Dodaj nowego użytkownika');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Dodawanie użytkownika');
$sel->type_ok('login', 'master@selenium.bugzilla.org');
$sel->type_ok('name', 'master-user');
$sel->type_ok('password', 'selenium', 'Hasło');
$sel->type_ok('disabledtext', 'Nie do użytku');
$sel->click_ok('add');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Edytowanie użytkownika master-user <master@selenium.bugzilla.org>');
$sel->check_ok("//input[\@name='group_$master_gid']");
$sel->click_ok('update');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Zaktualizowano konto master@selenium.bugzilla.org');
$sel->is_text_present_ok('Konto zostało dodane do grupy Master');

$sel->click_ok('link=Dodaj nowego użytkownika');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Dodawanie użytkownika');
$sel->type_ok('login', 'slave@selenium.bugzilla.org');
$sel->type_ok('name', 'slave-user');
$sel->type_ok('password', 'selenium', 'Hasło');
$sel->type_ok('disabledtext', 'Nie do użytku');
$sel->click_ok('add');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Edytowanie użytkownika slave-user <slave@selenium.bugzilla.org>');
$sel->check_ok("//input[\@name='group_$slave_gid']");
$sel->click_ok('update');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Zaktualizowano konto slave@selenium.bugzilla.org');
$sel->is_text_present_ok('Konto zostało dodane do grupy Slave');

$sel->click_ok('link=Dodaj nowego użytkownika');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Dodawanie użytkownika');
$sel->type_ok('login', 'reg@selenium.bugzilla.org');
$sel->type_ok('name', 'reg-user');
$sel->type_ok('password', 'selenium', 'Enter password');
$sel->type_ok('disabledtext', 'Nie do użytku');
$sel->click_ok('add');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Edytowanie użytkownika reg-user <reg@selenium.bugzilla.org>');

# Disabled accounts are not listed by default.

$sel->click_ok('link=Poszukaj innych użytkowników');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->is_checked_ok('enabled_only');
$sel->click_ok('search');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
ok(!$sel->is_text_present('master@selenium.bugzilla.org'), 'Inactive user account master-user not listed by default');
ok(!$sel->is_text_present('slave@selenium.bugzilla.org'), 'Inactive user account slave-user not listed by default');
ok(!$sel->is_text_present('reg@selenium.bugzilla.org'), 'Inactive user account reg-user not displayed by default');

# Now make sure group inheritance works correctly.

$sel->click_ok('link=poszukać innych użytkowników');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->check_ok('grouprestrict');
$sel->select_ok('groupid', 'label=Master');
$sel->select_ok('matchtype', 'value=substr');
$sel->uncheck_ok('enabled_only');
$sel->click_ok('search');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok('master@selenium.bugzilla.org', 'master-user należy do grupy Master');
ok(!$sel->is_text_present('slave@selenium.bugzilla.org'), 'slave-user nie należy do grupy Master');
ok(!$sel->is_text_present('reg@selenium.bugzilla.org'), 'reg-user nie należy do grupy Master');

$sel->click_ok('link=poszukać innych użytkowników');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->check_ok('grouprestrict');
$sel->select_ok('groupid', 'label=Slave');
$sel->select_ok('matchtype', 'value=substr');
$sel->uncheck_ok('enabled_only');
$sel->click_ok('search');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok('master@selenium.bugzilla.org', 'master-user należy do grupy Slave');
$sel->is_text_present_ok('slave@selenium.bugzilla.org', 'slave-user należy do grupy Slave');
ok(!$sel->is_text_present('reg@selenium.bugzilla.org'), 'reg-user nie należy do grupy Slave');

# Add a regular expression to the Slave group.

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok('link=Slave');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Modyfikowanie grupy: Slave');
$sel->type_ok('regexp', '^reg\@.*$');
$sel->click_ok('//input[@value="Aktualizuj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: Slave");

# Test group inheritance again.

go_to_admin($sel);
$sel->click_ok("link=Użytkownicy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->check_ok('grouprestrict');
$sel->select_ok('groupid', 'label=Master');
$sel->select_ok('matchtype', 'value=substr');
$sel->uncheck_ok('enabled_only');
$sel->click_ok('search');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok('master@selenium.bugzilla.org', 'master-user należy do grupy Master');
ok(!$sel->is_text_present('slave@selenium.bugzilla.org'), 'slave-user nie należy do grupy Master');
ok(!$sel->is_text_present('reg@selenium.bugzilla.org'), 'reg-user nie należy do grupy Master');

$sel->click_ok('link=poszukać innych użytkowników');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is('Wyszukiwanie użytkowników');
$sel->check_ok('grouprestrict');
$sel->select_ok('groupid', 'label=Slave');
$sel->select_ok('matchtype', 'value=substr');
$sel->uncheck_ok('enabled_only');
$sel->click_ok('search');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok('master@selenium.bugzilla.org', 'master-user należy do grupy Slave');
$sel->is_text_present_ok('slave@selenium.bugzilla.org', 'slave-user należy do grupy Slave');
$sel->is_text_present_ok('reg@selenium.bugzilla.org', 'reg-user należy do grupy Slave');

# Remove created users and groups.

cleanup_users($sel);
cleanup_groups($sel, $slave_gid);
logout($sel);

sub cleanup_users {
    my $sel = shift;

    go_to_admin($sel);
    $sel->click_ok("link=Użytkownicy");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Wyszukiwanie użytkowników");
    $sel->type_ok('matchstr', '(master|slave|reg)@selenium.bugzilla.org');
    $sel->select_ok('matchtype', 'value=regexp');
	$sel->uncheck_ok('enabled_only');
    $sel->click_ok("search");
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Lista użytkowników");

    foreach my $user ('master', 'slave', 'reg') {
        my $login = $user . '@selenium.bugzilla.org';
        next unless $sel->is_text_present($login);

        $sel->click_ok("link=$login");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Edytowanie użytkownika ${user}-user <$login>");
        $sel->click_ok("delete");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Potwierdzenie usunięcia użytkownika $login");
        ok(!$sel->is_text_present('Nie można usunąć użytkownika'), 'Użytkownik może zostać usunięty');
        $sel->click_ok("delete");
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is("Konto $login zostało usunięte");
        $sel->click_ok('link=Wyświetl listę użytkowników');
        $sel->wait_for_page_to_load_ok(WAIT_TIME);
        $sel->title_is('Lista użytkowników');
    }
}

sub cleanup_groups {
    my ($sel, $slave_gid) = @_;

    go_to_admin($sel);
    $sel->click_ok("link=Grupy");
    $sel->wait_for_page_to_load(WAIT_TIME);
    $sel->title_is("Modyfikowanie grup");
    $sel->click_ok("//a[\@href='editgroups.cgi?action=del&group=$slave_gid']");
    $sel->wait_for_page_to_load(WAIT_TIME);
    $sel->title_is("Usuwanie grupy");
    $sel->is_text_present_ok("Czy na pewno chcesz usunąć tę grupę?");
    ok(!$sel->is_element_present("removeusers"), 'Brak użytkowników w grupie');
    $sel->click_ok("delete");
    $sel->wait_for_page_to_load(WAIT_TIME);
    $sel->title_is("Usunięto grupę");
    $sel->is_text_present_ok("Grupa Slave została usunięta");
}
