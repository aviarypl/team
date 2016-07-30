use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Tworzenie błędu publicznego i prywatnego

log_in($sel, $config, 'admin');
file_bug_in_product($sel, "TestProduct");
my $bug_summary = "Sprawdzanie zależności";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "To jest błąd publiczny");
my $bug1_id = create_bug($sel, $bug_summary);

file_bug_in_product($sel, "TestProduct");
$sel->type_ok("alias", "secret_qa_bug_$bug1_id+1");
my $bug_summary2 = "Big Ben";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "To jest błąd prywatny");
$sel->type_ok("dependson", $bug1_id);
$sel->check_ok('//input[@name="groups" and @value="Master"]');
my $bug2_id = create_bug($sel, $bug_summary2);

go_to_bug($sel, $bug1_id);
$sel->click_ok("link=Oznacz jako duplikat");
$sel->type_ok("dup_id", $bug2_id);
edit_bug_and_return($sel, $bug1_id, $bug_summary);
$sel->is_text_present_ok("secret_qa_bug_$bug1_id+1");
logout($sel);

# Użytkownik z uprawnieniami do edycji błędów, 
# który nie może zobaczyć niektórych błędów na liście błędów zależnych, 
# lub błąd, którego jest on duplikatem, powinien nadal móc go edytować

log_in($sel, $config, 'editbugs');
go_to_bug($sel, $bug1_id);
ok(!$sel->is_text_present("secret_qa_bug_$bug1_id+1"), "Alias tego prywatnego błędy jest niewidoczny");
$sel->select_ok("priority", "label=Wysoki");
$sel->select_ok("bug_status", "ZWERYFIKOWANY");
$sel->type_ok("comment", "Czy ja tu mogę edytować?");
edit_bug($sel, $bug1_id, $bug_summary);
logout($sel);
