use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Create a new bug. As the reporter, some forms are editable to you.
# But as you don't have editbugs privs, you cannot edit everything.

log_in($sel, $config, 'unprivileged');
file_bug_in_product($sel, 'TestProduct');
ok(!$sel->is_editable("assigned_to"), "Pole 'przypisany do' nie jest edytowalne");
my $bug_summary = "Pozdro od użytkownika bez uprawnień";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Błąd z pustą listą obserwatorów");
my $bug1_id = create_bug($sel, $bug_summary);
logout($sel);

# Some checks while being logged out.

go_to_bug($sel, $bug1_id);
ok(!$sel->is_element_present("commit"), "Brak przycisku 'Zapisz zmiany'");
my $text = trim($sel->get_text("//fieldset"));
ok($text =~ /Musisz zalogować się, by móc komentować lub dokonywać zmian w tym błędzie./,
   "Okno komentarzy jest niewidoczne");


# Don't call log_in() here. We explicitly want to use the "log in" link
# in the addl. comment box.

$sel->click_ok("link=zalogować się");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Logowanie do Bugzilli");
$sel->is_text_present_ok("Do zalogowania wymagana jest poprawna nazwa użytkownika (login) i hasło.");
$sel->type_ok("Bugzilla_login", $config->{unprivileged_user_login}, "Login");
$sel->type_ok("Bugzilla_password", $config->{unprivileged_user_passwd}, "Hasło");
$sel->click_ok("log_in", undef, "Logowanie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/, "Wyświetla błąd $bug1_id");

# Neither the (edit) link nor the hidden form must exist, at all.
# But the 'Commit' button does exist.

ok(!$sel->is_element_present("bz_assignee_edit_action"), "Pole 'przypisany do' nie ma linku (zmień)");
ok(!$sel->is_element_present("assigned_to"), "Pole 'przypisany do' nie jest ukryte");
$sel->is_element_present_ok("commit");
logout($sel);
