use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Turn on the usevisibilitygroups param so that some users are invisible.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Grupy zabezpieczeń" => {"usevisibilitygroups-on" => undef} });

# You can see all users from editusers.cgi, but once you leave this page,
# usual group visibility restrictions apply and the "powerless" user cannot
# be sudo'ed as he is in no group.

go_to_admin($sel);
$sel->click_ok("link=Użytkownicy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wyszukiwanie użytkowników");
$sel->type_ok("matchstr", $config->{unprivileged_user_login});
$sel->select_ok("matchtype", "label=dokładnie tego użytkownika");
$sel->click_ok("search");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Edytowanie użytkownika no-privs <$config->{unprivileged_user_login}>");
$sel->value_is("login", $config->{unprivileged_user_login});
$sel->click_ok("link=Przejmij tożsamość tego użytkownika");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Sesja sudo");
$sel->value_is("target_login", $config->{unprivileged_user_login});
$sel->type_ok("reason", "Test Selenium dotyczący sesji sudo");
$sel->type_ok("Bugzilla_password", $config->{admin_user_passwd}, "Hasło administratora");
$sel->click_ok('//input[@value="Rozpocznij sesję"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nic nie znaleziono");
my $error_msg = trim($sel->get_text("error_msg"));
ok($error_msg eq "Nie ma użytkownika o nazwie $config->{unprivileged_user_login} lub nie masz uprawnień do oglądania jego danych.",
   "Nie można przejąć tożsamości użytkownika, którego danych nie można oglądać");

# Turn off the usevisibilitygroups param so that all users are visible again.

set_parameters($sel, { "Grupy zabezpieczeń" => {"usevisibilitygroups-off" => undef} });

# The "powerless" user can now be sudo'ed.

go_to_admin($sel);
$sel->click_ok("link=Użytkownicy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Wyszukiwanie użytkowników");
$sel->type_ok("matchstr", $config->{unprivileged_user_login});
$sel->select_ok("matchtype", "label=dokładnie tego użytkownika");
$sel->click_ok("search");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Edytowanie użytkownika no-privs <$config->{unprivileged_user_login}>");
$sel->value_is("login", $config->{unprivileged_user_login});
$sel->click_ok("link=Przejmij tożsamość tego użytkownika");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Sesja sudo");
$sel->value_is("target_login", $config->{unprivileged_user_login});
$sel->type_ok("Bugzilla_password", $config->{admin_user_passwd}, "Enter admin password");
$sel->click_ok('//input[@value="Rozpocznij sesję"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Rozpoczęto sesję sudo");
my $text = trim($sel->get_text("message"));
ok($text =~ /Rozpoczęto sesję sudo/, "Rozpoczęto sesję sudo");

# Make sure this user is not an admin and has no privs at all, and that
# he cannot access editusers.cgi (despite the sudoer can).

$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->click_ok("link=Uprawnienia");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->is_text_present_ok("Nie ma ustawionych uprawnień dla tego konta.");
# We access the page directly as there is no link pointing to it.
$sel->open_ok("/$config->{bugzilla_installation}/editusers.cgi");
$sel->title_is("Wymagana autoryzacja");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /^Nie jesteś członkiem grupy „editusers”/, "Użytkownik nie należy do grupy editusers");
$sel->click_ok("link=zakończ sesję");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zakończono sesję sudo");
$sel->is_text_present_ok("Zakończono sesję sudo");

# Try to access the sudo page directly, with no credentials.

$sel->open_ok("/$config->{bugzilla_installation}/relogin.cgi?action=begin-sudo");
$sel->title_is("Wymagane hasło");

# Now try to start a sudo session directly, with all required credentials.

$sel->open_ok("/$config->{bugzilla_installation}/relogin.cgi?action=begin-sudo&Bugzilla_login=$config->{admin_user_login}&Bugzilla_password=$config->{admin_user_passwd}&target_login=$config->{admin_user_login}", undef, "Impersonate a user directly by providing all required data");
$sel->title_is("Wymagane przygotowanie");

# The link should populate the target_login field correctly.
# Note that we are trying to sudo an admin, which is not allowed.

$sel->click_ok("link=rozpocząć sesję w normalny sposób");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Sesja sudo");
$sel->value_is("target_login", $config->{admin_user_login});
$sel->type_ok("reason", "Hakujemy Selenium");
$sel->type_ok("Bugzilla_password", $config->{admin_user_passwd}, "Hasło administratora");
$sel->click_ok('//input[@value="Rozpocznij sesję"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Chroniony użytkownik");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /^Podczas sesji sudo nie można użyć tożsamości użytkownika $config->{admin_user_login}/, "Nie można przejąć tożsamości administratora");

# Now try to sudo a non-existing user account, with no password.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Sesja sudo");
$sel->type_ok("target_login", 'foo@bar.com');
$sel->click_ok('//input[@value="Rozpocznij sesję"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nieprawidłowa nazwa użytkownika lub hasło");

# Same as above, but with your password.

$sel->open_ok("/$config->{bugzilla_installation}/relogin.cgi?action=prepare-sudo&target_login=foo\@bar.com");
$sel->title_is("Sesja sudo");
$sel->value_is("target_login", 'foo@bar.com');
$sel->type_ok("Bugzilla_password", $config->{admin_user_passwd}, "Hasło administratora");
$sel->click_ok('//input[@value="Rozpocznij sesję"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nic nie znaleziono");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg eq 'Nie ma użytkownika o nazwie foo@bar.com lub nie masz uprawnień do oglądania jego danych.', "Nie można przejąć tożsamości nieistniejącego użytkownika");
logout($sel);
