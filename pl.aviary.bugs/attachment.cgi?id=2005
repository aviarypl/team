use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Set the timetracking group to "editbugs", which is the default value for this parameter.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Grupy zabezpieczeń" => {"timetrackinggroup" => {type => "select", value => "editbugs"}} });

# Add some Hours Worked to a bug so that we are sure at least one bug
# will be present in our buglist below.

file_bug_in_product($sel, "TestProduct");
$sel->select_ok("component", "TestComponent");
my $bug_summary = "Fizyka kwantowa";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "Czas ucieka");
my $bug1_id = create_bug($sel, $bug_summary);

$sel->type_ok("work_time", 2.6);
$sel->type_ok("comment", "Coś tam się zrobiło");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->is_text_present_ok("Coś tam się zrobiło");
$sel->is_text_present_ok("Godziny przepracowane dodatkowo: 2.6");

# Let's call summarize_time.cgi directly, with no parameters.

$sel->open_ok("/$config->{bugzilla_installation}/summarize_time.cgi");
$sel->title_is("Nie wybrano żadnych błędów");
my $error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /Nie wybrano żadnych błędów do przeglądania/, "Nic się nie wyśwetliło");

# Search for bugs which have some value in the Hours Worked field.

open_advanced_search_page($sel);
$sel->remove_all_selections("bug_status");
$sel->select_ok("f1", "label=Godziny przepracowane");
$sel->select_ok("o1", "label=jest większy niż");
$sel->type_ok("v1", "0");
$sel->click_ok("Szukaj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Lista błędów");
$sel->is_text_present_ok("Znaleziono");

# Test dates passed to summarize_time.cgi.

$sel->click_ok("timesummary");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Podsumowanie czasu \(wybrane błędy: \d+\)/);
$sel->check_ok("monthly");
$sel->check_ok("detailed");
$sel->type_ok("start_date", "2009-01-01");
$sel->type_ok("end_date", "2009-04-30");
$sel->click_ok("summarize");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/^Podsumowanie czasu \(wybrane błędy: \d+\)/);
$sel->is_text_present_ok('regexp:Suma godzin przepracowanych: \d+\.\d+');
$sel->is_text_present_ok("Od 2009-01-01 do 2009-01-31");
$sel->is_text_present_ok("Od 2009-02-01 do 2009-02-28");
$sel->is_text_present_ok("Od 2009-04-01 do 2009-04-30");

$sel->type_ok("end_date", "2009-04-as");
$sel->click_ok("summarize");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nieprawidłowa data");
$error_msg = trim($sel->get_text("error_msg"));
ok($error_msg =~ /„2009-04-as” nie jest poprawną datą/, "Nieprawidłowa data");

# Now display one bug only. We cannot do careful checks, because
# the page sums up contributions made by the same user during the same
# month, and so running this script several times per month would
# break checks we may want to do (e.g. by making sure that the contribution
# above has been taken into account). So we are just making sure that
# the page is displayed and throws no error.

go_to_bug($sel, $bug1_id);
$sel->click_ok("//a[contains(text(),'Podsumowanie czasu')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
# Do poprawienie po naprawieniu krowy 4274
$sel->title_is("Podsumowanie czasu dla Błąd nr $bug1_id");
$sel->check_ok("inactive");
$sel->check_ok("owner");
$sel->click_ok("summarize");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
# Do poprawienie po naprawieniu krowy 4274
$sel->title_is("Podsumowanie czasu dla Błąd nr $bug1_id");
logout($sel);
