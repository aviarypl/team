use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

unless ($config->{test_extensions}) {
    ok(1, "Testowanie rozszerzeń jest wyłączone. Test zatrzymany.");
    exit;
}

log_in($sel, $config, 'admin');
set_parameters($sel, { "Pola błędu"              => {"useclassification-off" => undef},
                       "Reguły administracyjne"  => {"allowbugdeletion-on"   => undef}
                     });

# Create a new product, so that we can safely play with vote settings.

add_product($sel);
$sel->type_ok("product", "Eureka");
$sel->type_ok("description", "Nowy lepszy produkt");
$sel->type_ok("votesperuser", 10);
$sel->type_ok("maxvotesperbug", 5);
$sel->type_ok("votestoconfirm", 3);
$sel->click_ok('//input[@type="submit" and @value="Dodaj"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono produkt");
$sel->click_ok("link=dodać co najmniej jeden komponent");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Dodawanie komponentu do produktu „Eureka”");
$sel->type_ok("component", "Pegaz");
$sel->type_ok("description", "Duży i wyraźny gwiazdozbiór leżący na północnej półkuli nieba.");
$sel->type_ok("initialowner", $config->{permanent_user}, "Ustawianie domyślnego odpowiedzialnego");
$sel->click_ok("create");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Utworzono komponent");
my $text = trim($sel->get_text("message"));
ok($text =~ qr/Komponent Pegaz został utworzony/, "Utworzono komponent 'Pegaz'");

# Create a new bug with the POTWIERDZONY status.

file_bug_in_product($sel, 'Eureka');
# POTWIERDZONY must be the default bug status for users with editbugs privs.
$sel->selected_label_is("bug_status", "POTWIERDZONY");
my $bug_summary = "Baran";
$sel->type_ok("short_desc", $bug_summary);
$sel->type_ok("comment", "pierwszy gwiazdozbiór");
my $bug1_id = create_bug($sel, $bug_summary);

# Now vote for this bug.

$sel->click_ok("link=głosuj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");
# No comment :-/
my $full_text = trim($sel->get_body_text());
# OK, this is not the most robust regexp, but that's better than nothing.
ok($full_text =~ /5 to maksymalna liczba głosów, jaką można w tym produkcie oddać na jeden błąd/,
   "Wyświetlona informacja na temat ilości możliwych głosów na błąd");
$sel->type_ok("bug_$bug1_id", 4);
$sel->click_ok("change");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");
$full_text = trim($sel->get_body_text());
# OK, we may get a false positive if another product has the exact same numbers,
# but I have no better idea to check this information.
ok($full_text =~ /Zużyto 4 głosy z 10 dostępnych/, "Wyświetlona informacja na temat głosów zużytych");

# File a new bug, now as NIEPOTWIERDZONY. We will confirm it by popular votes.

file_bug_in_product($sel, 'Eureka');
$sel->select_ok("bug_status", "NIEPOTWIERDZONY");
my $bug_summary2 = "Byk";
$sel->type_ok("short_desc", $bug_summary2);
$sel->type_ok("comment", "drugi gwiazdozbiór");
my $bug2_id = create_bug($sel, $bug_summary2);

# Put enough votes on this bug to confirm it by popular votes.

$sel->click_ok("link=głosuj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");
$sel->type_ok("bug_$bug2_id", 5);
$sel->click_ok("change");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana głosów");
$sel->is_text_present_ok("Błąd $bug2_id został potwierdzony przez liczbę głosów");

# File a third bug, again as NIEPOTWIERDZONY. We will confirm it
# by decreasing the number required to confirm bugs by popular votes.

file_bug_in_product($sel, 'Eureka');
$sel->select_ok("bug_status", "NIEPOTWIERDZONY");
my $bug_summary3 = "Bliźnięta";
$sel->type_ok("short_desc", $bug_summary3);
$sel->type_ok("comment", "trzeci gwiazdozbiór");
my $bug3_id = create_bug($sel, $bug_summary3);

# Vote for this bug, but remain below the threshold required
# to confirm the bug by popular votes.
# We also change votes set on other bugs for testing purposes.

$sel->click_ok("link=głosuj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");
$sel->type_ok("bug_$bug1_id", 2);
$sel->type_ok("bug_$bug3_id", 2);
$sel->click_ok("change");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");
# Illegal change: max is 5 votes per bug!
$sel->type_ok("bug_$bug2_id", 15);
$sel->click_ok("change");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nieprawidłowe głosowanie");
$text = trim($sel->get_text("error_msg"));
ok($text =~ /Można oddać najwyżej 5 głosów na pojedynczy błąd w produkcie Eureka, a próbowano oddać 15 głosów/,
   "Za dużo głosów w błędzie");

# XXX - We cannot use go_back_ok() here, because Firefox complains about
# POST data not being stored in its cache. As a workaround, we go to
# the bug we just visited and click the 'vote' link again.

go_to_bug($sel, $bug3_id);
$sel->click_ok("link=głosuj");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Zmiana liczby głosów");

# Illegal change: max is 10 votes for this product!
$sel->type_ok("bug_$bug2_id", 5);
$sel->type_ok("bug_$bug1_id", 5);
$sel->click_ok("change");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Nieprawidłowe głosowanie");
$text = trim($sel->get_text("error_msg"));
ok($text =~ /Próbowano oddać 12 głosów w produkcie Eureka. Dopuszczalna liczba głosów dla tego produktu to: 10/,
   "Za dużo głosów w produkcie");

# Decrease the confirmation threshold so that $bug3 becomes POTWIERDZONY.

edit_product($sel, 'Eureka');
$sel->type_ok("votestoconfirm", 2);
$sel->click_ok("update-product");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja produktu „Eureka”");
$full_text = trim($sel->get_body_text());
ok($full_text =~ /Zaktualizowano liczbę głosów wymaganą do potwierdzenia błędu z 3 na 2/,
   "Zmieniona liczba głosów wymagana do potwierdzenia błędów");
$sel->is_text_present_ok("Błąd $bug3_id został potwierdzony przez liczbę głosów");

# Decrease the number of votes per bug so that $bug2 is updated.

$sel->click_ok("link=Modyfikuj produkt „Eureka”");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktu „Eureka”");
$sel->type_ok("maxvotesperbug", 4);
$sel->click_ok("update-product");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja produktu „Eureka”");
$full_text = trim($sel->get_body_text());
ok($full_text =~ /Zaktualizowano maksymalną liczbę głosów na błąd z 5 na 4/, "Zmieniona maksymalna liczba głosów na błąd");
$sel->is_text_present_ok("usunięto głosy oddane na błąd $bug2_id przez " . $config->{admin_user_login}, undef,
                         "Usunięto głosy oddane przez administratora");

# Go check that $bug2 has been correctly updated.

$sel->click_ok("link=$bug2_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/Błąd $bug2_id /);
$text = trim($sel->get_text("votes_container"));
ok($text =~ /4 głosami/, "W błędzie zostały 4 głosy");

# Decrease the number per user. Bugs should keep at least one vote,
# i.e. not all votes are removed (which was the old behavior).

edit_product($sel, "Eureka");
$sel->type_ok("votesperuser", 5);
$sel->click_ok("update-product");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja produktu „Eureka”");
$full_text = trim($sel->get_body_text());
ok($full_text =~ /Zaktualizowano liczbę głosów użytkownika z 10 na 5/, "Zmieniona maksymalna ilość głosów użytkownika");
$sel->is_text_present_ok("usunięto głosy oddane na błąd");

# Go check that $bug3 has been correctly updated.

$sel->click_ok("link=$bug3_id");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_like(qr/Błąd $bug3_id /);
$text = trim($sel->get_text("votes_container"));
ok($text =~ /2 głosami/, "W błędzie zostały 2 głosy");

# Wyłączenie statusu NIEPOTWIERDZONY w produkcie.

edit_product($sel, "Eureka");
$sel->click_ok("allows_unconfirmed");
$sel->click_ok("update-product");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Aktualizacja produktu „Eureka”");
$full_text = trim($sel->get_body_text());
ok($full_text =~ /Produkt obecnie nie zezwala na status NIEPOTWIERDZONY/, "Status NIEPOTWIERDZONY wyłączony");

# File a new bug. NIEPOTWIERDZONY must not be listed as a valid bug status.

file_bug_in_product($sel, "Eureka");
ok(!scalar(grep {$_ eq "NIEPOTWIERDZONY"} $sel->get_select_options("bug_status")), "Status NIEPOTWIERDZONY jest niedostępny");
my $bug_summary4 = "Rak";
$sel->type_ok("short_desc", $bug_summary4);
$sel->type_ok("comment", "czwarty gwiazdozbiór");
my $bug4_id = create_bug($sel, $bug_summary4);

# Now delete the 'Eureka' product.

go_to_admin($sel);
$sel->click_ok("link=Produkty");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Modyfikowanie produktów");
$sel->click_ok('//a[@href="editproducts.cgi?action=del&product=Eureka"]');
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usuwanie produktu „Eureka”");
$full_text = trim($sel->get_body_text());
ok($full_text =~ /Nadal istnieją otwarte błędy dla tego produktu: 4/, "Ostrzeżenie o błędach nadal otwartych w usuwanym produkcie");
ok($full_text =~ /Pegaz: Duży i wyraźny gwiazdozbiór leżący na północnej półkuli nieba/, "Wyświetlony");
$sel->click_ok("delete");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Usunięto produkt");
logout($sel);
