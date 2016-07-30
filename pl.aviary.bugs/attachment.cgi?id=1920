use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

log_in($sel, $config, 'admin');
set_parameters($sel, { "Zasady modyfikowania błędów" => {"letsubmitterchoosepriority-off" => undef} });
file_bug_in_product($sel, "TestProduct");
ok(!$sel->is_text_present("Priorytet"), "Nie można określić priorytetu błędu");
ok(!$sel->is_element_present("//select[\@name='priority']"), "Nie ma menu priorytetu błędu");
set_parameters($sel, { "Zasady modyfikowania błędów" => {"letsubmitterchoosepriority-on" => undef} });
file_bug_in_product($sel, "TestProduct");
$sel->is_text_present_ok("Priorytet");
$sel->is_element_present_ok("//select[\@name='priority']");
logout($sel);
