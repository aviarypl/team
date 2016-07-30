use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

#####################################################
# Drugi test dotyczący flag. Ten koncentruje się na #
# sprawdzeniu zachowania przy przenoszeniu błedu z  #
# jednego produktu/komponentudo drugiego            #
#####################################################

# Do tego testu wymagane będzie dodawanie plików znajdujących się na dysku komputera.
# Do tego potrzebne są przywileje chrome.
my ($sel, $config) = get_selenium(CHROME_MODE);

# Start by creating a flag type for bugs.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Flagi");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zarządzanie flagami");
$sel->click_ok("link=Utwórz flagę dla błędów");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->type_ok("name", "selenium");
$sel->type_ok("description", "Flaga dla produktu TestProduct i Another Product/c1");
$sel->add_selection_ok("inclusion_to_remove", "label=__Any__:__Any__");
$sel->click_ok("categoryAction-removeInclusion");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->select_ok("product", "label=TestProduct");
$sel->selected_label_is("component", "__Any__");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->select_ok("product", "label=Another Product");
$sel->select_ok("component", "label=c1");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");

# This flag type must have a higher sortkey than the one we will create later.
# The reason is that link=selenium will catch the first link with this name in
# the UI, so when the second flag type with this name is created, we have to
# catch it, not this one (which will be unique for now, so no worry to find it).

$sel->type_ok("sortkey", 100);
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->click_ok("is_multiplicable");
$sel->value_is("is_multiplicable", "off");
$sel->select_ok("grant_group", "label=editbugs");
$sel->select_ok("request_group", "label=canconfirm");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „selenium” została utworzona");
$sel->is_text_present_ok("Flaga selenium została utworzona.");

# Zapamiętanie ID flagi.

$sel->click_ok("link=selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
my $flag_url = $sel->get_location();
$flag_url =~ /id=(\d+)/;
my $flagtype1_id = $1;

# Now create a flag type for attachments in 'Another Product'.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->click_ok("link=Utwórz flagę dla załączników");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->type_ok("name", "selenium_review");
$sel->type_ok("description", "Flaga review na potrzeby Selenium");
$sel->add_selection_ok("inclusion_to_remove", "label=__Any__:__Any__");
$sel->click_ok("categoryAction-removeInclusion");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->select_ok("product", "label=Another Product");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->type_ok("sortkey", 100);
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->click_ok("is_multiplicable");
$sel->value_is("is_multiplicable", "off");
$sel->selected_label_is("grant_group", "(brak grupy)");
$sel->selected_label_is("request_group", "(brak grupy)");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „selenium_review” została utworzona");
$sel->is_text_present_ok("Flaga selenium_review została utworzona");

# Zapamiętanie ID flagi.

$sel->click_ok("link=selenium_review");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$flag_url = $sel->get_location();
$flag_url =~ /id=(\d+)/;
my $aflagtype1_id = $1;

# Create a 2nd flag type for attachments, with the same name
# as the 1st one, but now *excluded* from 'Another Product'.

$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->click_ok("link=Utwórz flagę dla załączników");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->type_ok("name", "selenium_review");
$sel->type_ok("description", "Kolejna flaga review na potrzeby Selenium");
$sel->select_ok("product", "label=Another Product");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla załączników");
$sel->type_ok("sortkey", 50);
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->value_is("is_multiplicable", "on");
$sel->select_ok("grant_group", "label=editbugs");
$sel->select_ok("request_group", "label=canconfirm");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „selenium_review” została utworzona");

# Zapamiętanie ID flagi.

$sel->click_ok("link=selenium_review");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$flag_url = $sel->get_location();
$flag_url =~ /id=(\d+)/;
my $aflagtype2_id = $1;

# We are done with the admin tasks. Now play with flags in bugs.

file_bug_in_product($sel, 'TestProduct');
$sel->select_ok("flag_type-$flagtype1_id", "label=+");
my $bug_summary = "The selenium flag should be kept on product change";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "pom");
$sel->click_ok('//input[@value="Dodaj załącznik"]');
$sel->type_ok("data", "/var/www/selenium/latka.diff");
$sel->type_ok("description", "mała łatka");
$sel->click_ok("ispatch");
$sel->value_is("ispatch", "on");
ok(!$sel->is_element_present("flag_type-$aflagtype1_id"), "Flaga $aflagtype1_id niedostępna w produkcie TestProduct");
$sel->select_ok("flag_type-$aflagtype2_id", "label=-");
my $bug1_id = create_bug($sel, $bug_summary);

$sel->is_text_present_ok("$config->{admin_user_username}: selenium");
my $flag1_id = $sel->get_attribute('//select[@title="Flaga dla produktu TestProduct i Another Product/c1"]@id');
$flag1_id =~ s/flag-//;
$sel->selected_label_is("flag-$flag1_id", "+");
$sel->is_text_present_ok("$config->{admin_user_username}: selenium_review-");

# Now move the bug into the 'Another Product' product.
# Both the bug and attachment flags should survive.

$sel->select_ok("product", "label=Another Product");
$sel->type_ok("comment", "Przenoszę do Another Product / c1. Flaga powinna zostać zachowana.");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Weryfikacja danych o nowym produkcie…");
$sel->select_ok("component", "label=c1");
edit_bug_and_return($sel, $bug1_id, $bug_summary, {id => "change_product"});
$sel->selected_label_is("flag-$flag1_id", "+");
$sel->is_text_present_ok("$config->{admin_user_username}: selenium_review-");

# Now moving the bug into the c2 component. The bug flag
# won't survive, but the attachment flag should.

$sel->type_ok("comment", "Przenoszę do c2. Flaga selenium zostanie usunięta.");
$sel->select_ok("component", "label=c2");
edit_bug_and_return($sel, $bug1_id, $bug_summary);
ok(!$sel->is_element_present("flag-$flag1_id"), "Flaga selenium dla błędów nie przetrwałae");
ok(!$sel->is_element_present("flag_type-$flagtype1_id"), "Flaga selenium nie istnieje");
$sel->is_text_present_ok("$config->{admin_user_username}: selenium_review-");

# File a bug in 'Another Product / c2' and assign it
# to a powerless user, so that he can move it later.

file_bug_in_product($sel, 'Another Product');
$sel->select_ok("component", "label=c2");
$sel->type_ok("assigned_to", $config->{unprivileged_user_login});
ok(!$sel->is_editable("flag_type-$flagtype1_id"), "Flaga selenium dla błędów jest widoczna, ale nie można jej wybrać");
$sel->select_ok("component", "label=c1");
$sel->is_editable_ok("flag_type-$flagtype1_id", "Flaga selenium dla błędów niemożliwa do wybrania");
$sel->select_ok("flag_type-$flagtype1_id", "label=?");
my $bug_summary2 = "Nowa flaga selenium dla c2";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", ".");
my $bug2_id = create_bug($sel, $bug_summary2);

$sel->is_text_present_ok("$config->{admin_user_username}: selenium");
my $flag2_id = $sel->get_attribute('//select[@title="Flaga dla produktu TestProduct i Another Product/c1"]@id');
$flag2_id =~ s/flag-//;
$sel->selected_label_is("flag-$flag2_id", '?');

# Create a 2nd bug flag type, again named 'selenium', but now
# for the 'Another Product / c2' component only.

go_to_admin($sel);
$sel->click_ok("link=Flagi");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zarządzanie flagami");
$sel->click_ok("link=Utwórz flagę dla błędów");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->type_ok("name", "selenium");
$sel->type_ok("description", "Kolejna flaga o nazwie selenium");
$sel->add_selection_ok("inclusion_to_remove", "label=__Any__:__Any__");
$sel->click_ok("categoryAction-removeInclusion");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->select_ok("product", "label=Another Product");
$sel->select_ok("component", "label=c2");
$sel->click_ok("categoryAction-include");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Tworzenie flagi dla błędów");
$sel->type_ok("sortkey", 50);
$sel->value_is("is_active", "on");
$sel->value_is("is_requestable", "on");
$sel->value_is("is_multiplicable", "on");
$sel->selected_label_is("grant_group", "(brak grupy)");
$sel->selected_label_is("request_group", "(brak grupy)");
$sel->click_ok("save");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Flaga „selenium” została utworzona");

# Store the flag type ID.

$sel->click_ok("link=selenium");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$flag_url = $sel->get_location();
$flag_url =~ /id=(\d+)/;
my $flagtype2_id = $1;

# Now move the bug from c1 into c2. The bug flag should survive.

go_to_bug($sel, $bug2_id);
$sel->select_ok("component", "label=c2");
$sel->click_ok("set_default_assignee");
$sel->type_ok("comment", "Flaga selenium powinna przetrwać.");
edit_bug_and_return($sel, $bug2_id, $bug_summary2);
$sel->selected_label_is("flag-$flag2_id", '?');
ok(!$sel->is_element_present("flag_type-$flagtype1_id"), "Typ flagi niedostępny w c2");
$sel->is_element_present_ok("flag_type-$flagtype2_id");
logout($sel);

# Powerless users can edit the 'selenium' flag being in c2.

log_in($sel, $config, 'unprivileged');
go_to_bug($sel, $bug2_id);
$sel->select_ok("flag-$flag2_id", "label=+");
edit_bug_and_return($sel, $bug2_id, $bug_summary2);
$sel->selected_label_is("flag-$flag2_id", "+");

# But moving the bug into TestProduct will delete the flag
# as the flag setter is not in the editbugs group.

$sel->select_ok("product", "label=TestProduct");
$sel->type_ok("comment", "Flaga selenium nie przetrwa. Nie mam przywilejów do editbugs.");
$sel->click_ok("commit");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Weryfikacja danych o nowym produkcie…");
edit_bug_and_return($sel, $bug2_id, $bug_summary2, {id => "change_product"});
ok(!$sel->is_element_present("flag-$flag2_id"), "Flag $flag2_id deleted");
ok(!$sel->is_editable("flag_type-$flagtype1_id"), "Flaga 'selenium' nie może być edytowana przez użytkowników bez uprawnień");
ok(!$sel->is_element_present("flag_type-$flagtype2_id"), "Typ flagi niedostępny w c1");
logout($sel);

# Time to delete created flag types.

log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Flagi");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zarządzanie flagami");

foreach my $flagtype ([$flagtype1_id, "selenium"], [$flagtype2_id, "selenium"],
                      [$aflagtype1_id, "selenium_review"], [$aflagtype2_id, "selenium_review"])
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
