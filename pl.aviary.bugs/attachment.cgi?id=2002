use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

log_in($sel, $config, 'tweakparams');
set_parameters($sel, { "Dopasowywanie nazw użytkowników"  => {"usemenuforusers-off" => undef,
                                                              "maxusermatches"      => {type => 'text', value => '0'},
                                                              "confirmuniqueusermatch-on" => undef},
                       "Grupy zabezpieczeń"               => {"usevisibilitygroups-off" => undef}
                     });

file_bug_in_product($sel, "TestProduct");
$sel->select_ok("component", "TestComponent");
my $bug_summary = "Wtorek dzisiaj mamy";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Poker Face");
my $bug1_id = create_bug($sel, $bug_summary);

# We enter an incomplete email address. process_bug.cgi must ask
# for confirmation as confirmuniqueusermatch is turned on.

$sel->click_ok("cc_edit_area_showhide");
$sel->type_ok("newcc", $config->{unprivileged_user_login_truncated});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Potwierdzenie dopasowania");
$sel->is_text_present_ok("$config->{unprivileged_user_login_truncated} pasuje do");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("cc_edit_area_showhide");

# We now enter a complete and valid email address, so it must be accepted.
# confirmuniqueusermatch = 1 must not trigger the confirmation page as we
# type the complete email address.

$sel->type_ok("newcc", $config->{unprivileged_user_login});
edit_bug_and_return($sel, $bug1_id, $bug_summary);

# Now test wildcards ("*"). Due to confirmuniqueusermatch being turned on,
# a confirmation page must be displayed.

$sel->click_ok("cc_edit_area_showhide");
$sel->type_ok("newcc", "$config->{unprivileged_user_login_truncated}*");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Potwierdzenie dopasowania");
$sel->is_text_present_ok("<$config->{unprivileged_user_login}>");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("cc_edit_area_showhide");

# This will return more than one account.

$sel->type_ok("newcc", "*$config->{common_email}");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Potwierdzenie dopasowania");
$sel->is_text_present_ok("*$config->{common_email} pasuje do:");

# Now restrict 'maxusermatches'.

set_parameters($sel, { "Dopasowywanie nazw użytkowników" => {"maxusermatches" => {type => 'text', value => '1'}} });

go_to_bug($sel, $bug1_id);
$sel->click_ok("cc_edit_area_showhide");

# Several user accounts match this partial email address. Due to
# maxusermatches = 1, no email address is suggested.

$sel->type_ok("newcc", "*$config->{common_email}");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dane nie są identyczne");
$sel->is_text_present_ok("pasuje do wielu użytkowników");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("cc_edit_area_showhide");

# We now type a complete and valid email address, so no confirmation
# page should be displayed.

$sel->type_ok("newcc", $config->{unprivileged_user_login});
edit_bug($sel, $bug1_id, $bug_summary);

# Now turn on group visibility. It involves important security checks.

set_parameters($sel, { "Dopasowywanie nazw użytkowników"  => {"maxusermatches" => {type => 'text', value => '2'}},
                       "Grupy zabezpieczeń"               => {"usevisibilitygroups-on" => undef}
                     });

# By default, groups are not visible to themselves, so we have to enable this.
# The tweakparams user has not enough privs to do it himself.

logout($sel);
log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=tweakparams");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: tweakparams");

my @groups = $sel->get_select_options("visible_from_add");
if (grep {$_ eq 'tweakparams'} @groups) {
    $sel->add_selection_ok("visible_from_add", "label=tweakparams");
    $sel->click_ok('//input[@value="Aktualizuj"]');
    $sel->wait_for_page_to_load_ok(WAIT_TIME);
    $sel->title_is("Modyfikowanie grupy: tweakparams");
}
logout($sel);
log_in($sel, $config, 'tweakparams');

go_to_bug($sel, $bug1_id);
$sel->click_ok("cc_edit_area_showhide");

# We are not in the same groups as the unprivileged user, so we cannot see him.

$sel->type_ok("newcc", $config->{unprivileged_user_login_truncated});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dane nie są identyczne");
$sel->is_text_present_ok("$config->{unprivileged_user_login_truncated} nie pasuje do niczego");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("cc_edit_area_showhide");

# This will return too many users (there are at least always three:
# you, the admin and the permanent user (who has admin privs too)).

$sel->type_ok("newcc", $config->{common_email});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Potwierdzenie dopasowania");
$sel->is_text_present_ok("$config->{common_email} pasuje do większej liczby niż maksymalna dopuszczalna liczba 2 użytkowników");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Błąd $bug1_id/);
$sel->click_ok("cc_edit_area_showhide");

# We can always see ourselves.

$sel->type_ok("newcc", $config->{tweakparams_user_login_truncated});
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Potwierdzenie dopasowania");
$sel->is_text_present_ok("<$config->{tweakparams_user_login}>");

# Now test user menus. It must NOT display users we are not allowed to see.

set_parameters($sel, { "Dopasowywanie nazw użytkowników" => {"usemenuforusers-on" => undef} });

go_to_bug($sel, $bug1_id);
$sel->click_ok("cc_edit_area_showhide");
my @cc = $sel->get_select_options("newcc");
ok(!grep($_ =~ /$config->{unprivileged_user_login}/, @cc), "$config->{unprivileged_user_login} jest niewidoczny");
ok(!grep($_ =~ /$config->{canconfirm_user_login}/, @cc), "$config->{canconfirm_user_login} jest niewidoczny");
ok(grep($_ =~ /$config->{admin_user_login}/, @cc), "$config->{admin_user_login} jest widoczny");
ok(grep($_ =~ /$config->{tweakparams_user_login}/, @cc), "$config->{tweakparams_user_login} jest widoczny");

# Reset paramters.

set_parameters($sel, { "Dopasowywanie nazw użytkowników"  => {"usemenuforusers-off"        => undef,
                                                              "maxusermatches"             => {type => 'text', value => '0'},
                                                              "confirmuniqueusermatch-off" => undef},
                       "Grupy zabezpieczeń"               => {"usevisibilitygroups-off"    => undef}
                     });
logout($sel);
