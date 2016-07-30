use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Włączenie parametru makeproductgroup. 
# Utworzenie nowego produktu i sprawdzenie, czy automatycznie została utworzona
# grupa o takiej samej nazwie

log_in($sel, $config, 'admin');
set_parameters($sel, { "Grupy zabezpieczeń" => {"makeproductgroups-on" => undef} });
add_product($sel);
$sel->type_ok("product", "gotowy_na_smierc");
$sel->type_ok("description", "marnie zginiemy");
$sel->click_ok('//input[@value="Dodaj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono produkt");
go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=gotowy_na_smierc");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: gotowy_na_smierc");
my $group_url = $sel->get_location();
$group_url =~ /group=(\d+)/;
my $group1_id = $1;
$sel->value_is("desc", "Dostęp do błędów produktu gotowy_na_smierc");
my @groups = $sel->get_select_options("members_remove");
ok((grep { $_ eq 'admin' } @groups), "członkowie grupy 'admin' są członkami tej grupy");
@groups = $sel->get_select_options("bless_from_remove");
ok((grep { $_ eq 'admin' } @groups), "członkowie grupy 'admin' mogą nadawać członkostwo w tej grupie");
$sel->is_checked_ok("isactive");

# Sprawdzanie, grupa automatycznie utworzona dla tego projektu ma opcję 'Uprawnienia członków'
# ustawioną na 'Domyślny' a opcję 'Dodatkowe uprawnienia' na 'Niedostępny'

edit_product($sel, "gotowy_na_smierc");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „gotowy_na_smierc”");
$sel->value_is("entry_$group1_id", "off");
$sel->value_is("canedit_$group1_id", "off");
$sel->selected_label_is("membercontrol_$group1_id", "Domyślna");
$sel->selected_label_is("othercontrol_$group1_id", "Niedostępna");

edit_product($sel, "gotowy_na_smierc");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->click_ok('//a[@href="editproducts.cgi?action=del&product=gotowy_na_smierc"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie produktu „gotowy_na_smierc”");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto produkt");

# Produkt został usunięty, ale grupa musi pozostać
go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->is_text_present_ok("Dostęp do błędów produktu gotowy_na_smierc");

# Tworzenie nowego produktu. Ponieważ już istnieje grupa "gotowy_na_smierc
# nowa nazwa będzie brzmieć "gotowy_na_smierc_"

add_product($sel);
$sel->type_ok("product", "gotowy_na_smierc_");
$sel->type_ok("description", "marnie zginiemy");
$sel->click_ok('//input[@value="Dodaj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono produkt");

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("link=gotowy_na_smierc_");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grupy: gotowy_na_smierc_");
$group_url = $sel->get_location();
$group_url =~ /group=(\d+)/;
my $group2_id = $1;
$sel->value_is("desc", "Dostęp do błędów produktu gotowy_na_smierc_");
@groups = $sel->get_select_options("members_remove");
ok((grep { $_ eq 'admin' } @groups), "członkowie grupy 'admin' są członkami tej grupy");
@groups = $sel->get_select_options("bless_from_remove");
ok((grep { $_ eq 'admin' } @groups), "członkowie grupy 'admin' mogą nadawać członkostwo w tej grupie");
$sel->value_is("isactive", "on");

# Sprawdzanie ustawień grupy. Pomimo identycznej nazwy grupa 'gotowy_na_smierc' nie powinna
# mieć żadnych związków z nowym produktem
edit_product($sel, "gotowy_na_smierc_");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „gotowy_na_smierc_”");
$sel->value_is("entry_$group1_id", "off");
$sel->value_is("entry_$group2_id", "off");
$sel->value_is("canedit_$group1_id", "off");
$sel->value_is("canedit_$group2_id", "off");
$sel->selected_label_is("membercontrol_$group1_id", "Niedostępna");
$sel->selected_label_is("othercontrol_$group1_id", "Niedostępna");
$sel->selected_label_is("membercontrol_$group2_id", "Domyślna");
$sel->selected_label_is("othercontrol_$group2_id", "Niedostępna");

# Usuwanie grupy gotowy_na_smierc_. Ponieważ jest powiązana z produktem gotowy_na_smierc_, 
# to na jej usunięcie wymagana jest zgoda administratora. 

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
$sel->click_ok("//a[contains(\@href, 'editgroups.cgi?action=del&group=$group2_id')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie grupy");
$sel->is_text_present_ok("Ta grupa powiązana jest z następującymi produktami");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nie można usunąć grupy");
my $text = trim($sel->get_text("error_msg"));
ok($text =~ qr/Przed usunięciem grupy należy usunąć wszystkie odniesienia do niej/,
   "Grupa gotowy_na_smierc_ nie może zostać usunięta, ponieważ jest powiązana z produktem");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie grupy");
$sel->click_ok("unbind");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto grupę");
$text = trim($sel->get_text("message"));
ok($text =~ qr/Grupa gotowy_na_smierc_ została usunięta/, "Grupa gotowy_na_smierc_ została usunięta");

edit_product($sel, "gotowy_na_smierc_");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->click_ok('//a[@href="editproducts.cgi?action=del&product=gotowy_na_smierc_"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie produktu „gotowy_na_smierc_”");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto produkt");

# Zresetowanie parametru makeproductgroup. Teraz przy tworzeniu nowego
# produktu nie trzeba tworzyć nowej grupy, lub wiązać go z istniejącą grupą

set_parameters($sel, { "Grupy zabezpieczeń" => {"makeproductgroups-off" => undef} });
add_product($sel);
$sel->type_ok("product", "gotowy_na_smierc");
$sel->type_ok("description", "marnie zginiemy");
$sel->click_ok('//input[@value="Dodaj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono produkt");

# Sprawdzanie, czy wszystkich uprawnień w produkcie wybrana jest opcja 'Niedostępna'

edit_product($sel, "gotowy_na_smierc");
$sel->title_is("Modyfikowanie produktu „gotowy_na_smierc”");
$sel->click_ok("link=Modyfikuj relacje grupa/produkt:");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie relacji grupa/produkt dla produktu „gotowy_na_smierc”");
$sel->value_is("entry_$group1_id", "off");
$sel->value_is("canedit_$group1_id", "off");
$sel->selected_label_is("membercontrol_$group1_id", "Niedostępna");
$sel->selected_label_is("othercontrol_$group1_id", "Niedostępna");

# Usuwanie utworzonych grup i produktów

go_to_admin($sel);
$sel->click_ok("link=Grupy");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie grup");
ok(!$sel->is_text_present('gotowy_na_smierc__'), 'Grupa gotowy_na_smierc__ nie istnieje');
$sel->click_ok("//a[contains(\@href, 'editgroups.cgi?action=del&group=$group1_id')]");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie grupy");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto grupę");
$text = trim($sel->get_text("message"));
ok($text =~ /Grupa gotowy_na_smierc została usunięta/, "Usunięto grupę gotowy_na_smierc");

edit_product($sel, "gotowy_na_smierc");
$sel->go_back_ok();
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->click_ok('//a[@href="editproducts.cgi?action=del&product=gotowy_na_smierc"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie produktu „gotowy_na_smierc”");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto produkt");
logout($sel);
