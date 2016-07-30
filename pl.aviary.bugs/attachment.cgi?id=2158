use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Używane do wysyłania testowych powiadomień
my @email_both = ($config->{admin_user_login}, $config->{editbugs_user_login});
my @email_admin = ($config->{admin_user_login});
my @email_normal = ($config->{editbugs_user_login});

# Skrypt do testowania preferencji poczty.
# Dla porównania, następujące powiadomienia i informacje o flagach powinny zostać wygenerowane.
#
# Administrator powinien dostać następujące powiadomienia (w tej kolejności):
#  1) Utworzono nowy błąd
#  2) Zwykły użytkownik dodał się do listy obserwowanych
#  3) Administrator usunął zwykłego użytkownika z listy obserwatorów
#  4) Administrator przypisał błąd do siebie
#  5) Administrator umieścił flagę dla zwykłego użytkownika
#  6) Administrator odpowiada na flagę umieszczoną przez samego siebie
#  7) Zwykły użytkownik zmienił wagę błędu na 'Normalny'
#  8) Zwykły użytkownik dodał komentarz numer 3
#  9) Zwykły użytkownik przypisał błąd do siebie
# Zwykły użytkownik powinien dostać następujące powiadomienia (w tej kolejności):
#  1) Utworzono nowy błąd
#  2) Zwykły użytkownik zmienił wagę błedu na 'Blokujący'
#  3) Administrator zmienił wagę błędu na 'Błahy'
#  4) Administrator dodał komentarz numer 2
#  5) Administrator usunął zwykłego użytkownika z listy obserwatorów
#  6) Administrator przypisał błąd do siebie
#  7) Zwykły użytkownik zmienił wagę błedu na 'Normalny'
#
# Administrator powinien dostać następujące informacje o flagach (w tej kolejności):
#  1) Zwykły użytkownik odrzucił flagę ustawioną dla niego przez administratora
# Zwykły użytkownik powinien dostać następujące informacje o flagach (w tej kolejności):
#  1) Administrator poprosił o flagę zwykłego użytkownika
#
# UWAGA: w tym teście sprawdzane jest tylko wysyłanie powiadomień, ponieważ informacje
# o wysłaniu emaila z informację o fladze nie są wyświetlane w UI.

# Zmiany preferencji poczty administratora
log_in($sel, $config, 'admin');
$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->click_ok("link=Poczta");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok("Poczta");
$sel->click_ok("//input[\@value='Wyłącz wszystko']");
$sel->click_ok("email-0-1", undef, 'Wybór opcji "Przypisano mi lub usunięto rolę" dla roli "Odpowiedzialny"');
$sel->click_ok("email-0-5", undef, 'Wybór opcji "	Nastąpiła zmiana priorytetu, statusu, wagi lub wersji" dla roli "Odpowiedzialny"');
$sel->click_ok("email-0-2", undef, 'Wybór opcji "Dodano komentarz" dla roli "Odpowiedzialny"');
$sel->click_ok("email-0-0", undef, 'Wybór opcji "Nastąpiła zmiana w polu tutaj niewyszczególnionym " dla roli "Odpowiedzialny"');
$sel->click_ok("email-3-8", undef, 'Wybór opcji "Nastąpiła zmiana na liście obserwatorów " dla roli "Obserwator"');
$sel->click_ok("email-1-10", undef, 'Wybór opcji "Został zgłoszony nowy błąd " dla roli "Specjalista QA"');
$sel->click_ok("email-100-101", undef, 'Wybór opcji "Powiadamiaj, gdy ktoś odpowiedział na umieszczoną przeze mnie flagę" w ustawieniach globalnych');
# Przywrócenie zachowania z wersji 4.2 dla opcji 'Wyłącz wszystko'.
foreach my $col (0..3) {
    foreach my $row (50..51) {
        $sel->click_ok("neg-email-$col-$row");
    }
}
$sel->value_is("email-0-1", "on");
$sel->value_is("email-0-10", "off");
$sel->value_is("email-0-6", "off");
$sel->value_is("email-0-5", "on");
$sel->value_is("email-0-2", "on");
$sel->value_is("email-0-3", "off");
$sel->value_is("email-0-4", "off");
$sel->value_is("email-0-7", "off");
$sel->value_is("email-0-8", "off");
$sel->value_is("email-0-9", "off");
$sel->value_is("email-0-0", "on");
$sel->value_is("neg-email-0-50", "off");
$sel->value_is("neg-email-0-51", "off");
$sel->value_is("email-1-1", "off");
$sel->value_is("email-1-10", "on");
$sel->value_is("email-1-6", "off");
$sel->value_is("email-1-5", "off");
$sel->value_is("email-1-2", "off");
$sel->value_is("email-1-3", "off");
$sel->value_is("email-1-4", "off");
$sel->value_is("email-1-7", "off");
$sel->value_is("email-1-8", "off");
$sel->value_is("email-1-9", "off");
$sel->value_is("email-1-0", "off");
$sel->value_is("neg-email-1-50", "off");
$sel->value_is("neg-email-1-51", "off");
ok(!$sel->is_editable("email-2-1"), 'Pole "Przypisano mi lub usunięto rolę" jest wyłączone dla roli "Zgłaszający"');
$sel->value_is("email-2-10", "off");
$sel->value_is("email-2-6", "off");
$sel->value_is("email-2-5", "off");
$sel->value_is("email-2-2", "off");
$sel->value_is("email-2-3", "off");
$sel->value_is("email-2-4", "off");
$sel->value_is("email-2-7", "off");
$sel->value_is("email-2-8", "off");
$sel->value_is("email-2-9", "off");
$sel->value_is("email-2-0", "off");
$sel->value_is("neg-email-2-50", "off");
$sel->value_is("neg-email-2-51", "off");
$sel->value_is("email-3-1", "off");
$sel->value_is("email-3-10", "off");
$sel->value_is("email-3-6", "off");
$sel->value_is("email-3-5", "off");
$sel->value_is("email-3-2", "off");
$sel->value_is("email-3-3", "off");
$sel->value_is("email-3-4", "off");
$sel->value_is("email-3-7", "off");
$sel->value_is("email-3-8", "on");
$sel->value_is("email-3-9", "off");
$sel->value_is("email-3-0", "off");
$sel->value_is("neg-email-3-50", "off");
$sel->value_is("neg-email-3-51", "off");
$sel->value_is("email-100-100", "off");
$sel->value_is("email-100-101", "on");
$sel->click_ok("update", undef, "Zapisano zmiany preferencji poczty administratora");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok("Zmiany w sekcji poczta zostały zapisane.");

# Zmiany domyślnego zachowania po zmianie błędu na wyświetlanie uaktualnionego błędu
# To upraszcza późniejsze zmiany błędów
go_to_admin($sel);
$sel->click_ok("link=Ustawienia domyślne");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
$sel->select_ok("post_bug_submit_action", "label=pokaż uaktualniony błąd");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");

# Zmiana preferencji poczty zwykłego użytkownika
logout($sel);
log_in($sel, $config, 'editbugs');
$sel->click_ok("link=Preferencje");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->click_ok("link=Poczta");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Preferencje użytkownika");
$sel->is_text_present_ok("Poczta");
$sel->click_ok("//input[\@value='Włącz wszystko']");
$sel->click_ok("email-3-1", undef, 'Usunięcie opcji "Przypisano mi lub usunięto rolę" dla roli "Obserwator"');
$sel->click_ok("email-3-5", undef, 'Usunięcie opcji "The priority, status, severity, or milestone changes" dla roli "Obserwator"');
$sel->click_ok("email-2-2", undef, 'Usunięcie opcji "New comments are added" dla roli "Zgłaszający"');
$sel->click_ok("email-3-2", undef, 'Usunięcie opcji "New comments are added" dla roli "Obserwator"');
$sel->click_ok("email-2-8", undef, 'Usunięcie opcji "Nastąpiła zmiana na liście obserwatorów " dla roli "Zgłaszający"');
$sel->click_ok("email-3-8", undef, 'Usunięcie opcji "Nastąpiła zmiana na liście obserwatorów " dla roli "Obserwator"');
$sel->click_ok("email-2-0", undef, 'Usunięcie opcji "Nastąpiła zmiana w polu tutaj niewyszczególnionym " dla roli "Zgłaszający"');
$sel->click_ok("email-3-0", undef, 'Usunięcie opcji "Nastąpiła zmiana w polu tutaj niewyszczególnionym " dla roli "Obserwator"');
$sel->click_ok("neg-email-0-51", undef, 'Wybór opcji "Zmiana została wykonana przeze mnie" dla roli "Odpowiedzialny"');
$sel->click_ok("email-100-101", undef, 'Usunięcie opcji "Powiadamiaj, gdy ktoś odpowiedział na umieszczoną przeze mnie flagę" w ustawieniach globalnych');
$sel->value_is("email-0-1", "on");
$sel->value_is("email-0-10", "on");
$sel->value_is("email-0-6", "on");
$sel->value_is("email-0-5", "on");
$sel->value_is("email-0-2", "on");
$sel->value_is("email-0-3", "on");
$sel->value_is("email-0-4", "on");
$sel->value_is("email-0-7", "on");
$sel->value_is("email-0-8", "on");
$sel->value_is("email-0-9", "on");
$sel->value_is("email-0-0", "on");
$sel->value_is("neg-email-0-50", "off");
$sel->value_is("neg-email-0-51", "on");
$sel->value_is("email-1-1", "on");
$sel->value_is("email-1-10", "on");
$sel->value_is("email-1-6", "on");
$sel->value_is("email-1-5", "on");
$sel->value_is("email-1-2", "on");
$sel->value_is("email-1-3", "on");
$sel->value_is("email-1-4", "on");
$sel->value_is("email-1-7", "on");
$sel->value_is("email-1-8", "on");
$sel->value_is("email-1-9", "on");
$sel->value_is("email-1-0", "on");
$sel->value_is("neg-email-1-50", "off");
$sel->value_is("neg-email-1-51", "off");
ok(!$sel->is_editable("email-2-1"), 'Pole "Przypisano mi lub usunięto rolę" jest wyłączone dla roli "Zgłaszający"');
$sel->value_is("email-2-10", "on");
$sel->value_is("email-2-6", "on");
$sel->value_is("email-2-5", "on");
$sel->value_is("email-2-2", "off");
$sel->value_is("email-2-3", "on");
$sel->value_is("email-2-4", "on");
$sel->value_is("email-2-7", "on");
$sel->value_is("email-2-8", "off");
$sel->value_is("email-2-9", "on");
$sel->value_is("email-2-0", "off");
$sel->value_is("neg-email-2-50", "off");
$sel->value_is("neg-email-2-51", "off");
$sel->value_is("email-3-1", "off");
$sel->value_is("email-3-10", "on");
$sel->value_is("email-3-6", "on");
$sel->value_is("email-3-5", "off");
$sel->value_is("email-3-2", "off");
$sel->value_is("email-3-3", "on");
$sel->value_is("email-3-4", "on");
$sel->value_is("email-3-7", "on");
$sel->value_is("email-3-8", "off");
$sel->value_is("email-3-9", "on");
$sel->value_is("email-3-0", "off");
$sel->value_is("neg-email-3-50", "off");
$sel->value_is("neg-email-3-51", "off");
$sel->value_is("email-100-100", "on");
$sel->value_is("email-100-101", "off");
$sel->click_ok("update", undef, "Zapisano zmiany preferencji poczty zwykłego użytkownika");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->is_text_present_ok("Zmiany w sekcji poczta zostały zapisane.");

# Zgłaszanie testowego błędu (email powinien zostać wysłany zarówno dla zwykłego użytkownika, jak i administratora"
file_bug_in_product($sel, "Another Product");
$sel->select_ok("component", "label=c1");
my $bug_summary = "Błąd testowy sprawdzający preferencje poczty";
$sel->type_ok("short_desc", $bug_summary, "Krótki opis błędu");
$sel->type_ok("comment", "Zgłoszony przez Selenium do testowania preferencji poczty", "Opis błędu");
$sel->type_ok("assigned_to", $config->{editbugs_user_login});
$sel->type_ok("qa_contact", $config->{admin_user_login});
$sel->type_ok("cc", $config->{admin_user_login});
my $bug1_id = create_bug($sel, $bug_summary);
my @email_sentto = get_email_sentto($sel);
is_deeply(\@email_both, \@email_sentto, "Administrator i zwykły użytkownik otrzymali powiadomienie");
my @email_excluded = get_email_excluded($sel);
ok($email_excluded[0] eq "nikogo", "Nikt nie został wykluczony");

# Zwykły użytkownik dokonuje zmian (po raz pierwszy)
#
go_to_bug($sel, $bug1_id);
# Zmiana wagi błedu (email powinien zostać wysłany do zwykłego użytkownika, ale nie do administratora)
$sel->select_ok("bug_severity", "label=Blokujący");
$sel->selected_label_is("bug_severity", "Blokujący");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_normal, \@email_sentto, "Zwykły użytkownik otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_admin, \@email_excluded, "Administrator nie otrzymał powiadomienia");
# Dodawanie komentarza (nikt nie powinien dostać powiadomienia)
$sel->type_ok("comment", "To jest pierwszy z dwóch komentarzy zwykłego użytkownika. (Nikt nie powinien dostać powiadomienia)");
$sel->value_is("comment", "To jest pierwszy z dwóch komentarzy zwykłego użytkownika. (Nikt nie powinien dostać powiadomienia)");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
ok($email_sentto[0] eq "nikogo", "Powiadomienie nie zostało wysłane");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_both, \@email_excluded, "Ani administrator, ani zwykły użytkownik nie otrzymali powiadomienia");
# Dodawanie zwykłego użytkownika do listy obserwatorów (administrator powinien dostać powiadomienie, ale nie zwykły użytkownik)
$sel->type_ok("newcc", $config->{editbugs_user_login});
$sel->value_is("newcc", $config->{editbugs_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_admin, \@email_sentto, "Administrator otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_normal, \@email_excluded, "Zwykły użytkownik nie otrzymał powiadomienia");
# Prośba o flagę dla administratora (żadne powiadomienie nie powinno zostać wysłane; informacja o fladze również nie powinna zostać wysłana)
$sel->select_ok("flag_type-1", "label=?");
$sel->type_ok("requestee_type-1", $config->{admin_user_login});
$sel->value_is("requestee_type-1", $config->{admin_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
ok($email_sentto[0] eq "nikogo", "Powiadomienie nie zostało wysłane");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_both, \@email_excluded, "Ani administrator, ani zwykły użytkownik nie otrzymali powiadomienia");

# Administrator dokonuje zmian
#
logout($sel);
log_in($sel, $config, 'admin');
go_to_bug($sel, $bug1_id);
# Zmiana wagi błędu (zwykły użytkownik powinien dostać powiadomienie, administrator nie)
$sel->select_ok("bug_severity", "label=Błahy");
$sel->selected_label_is("bug_severity", "Błahy");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_normal, \@email_sentto, "Zwykły użytkownik otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_admin, \@email_excluded, "Administrator nie otrzymał powiadomienia");
# Dodawanie komentarza (zwykły użytkownik powinien dostać powiadomienie, administrator nie)
$sel->type_ok("comment", "To jest komentarz administratora. (Tylko zwykły użytkownik powinien dostać powiadomienie.)");
$sel->value_is("comment", "To jest komentarz administratora. (Tylko zwykły użytkownik powinien dostać powiadomienie.)");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_normal, \@email_sentto, "Zwykły użytkownik otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_admin, \@email_excluded, "Administrator nie otrzymał powiadomienia");
# Usuwanie zwykłego użytkownika z listy obserwatorów (zarówno użytkownik jak i administrator powinni dostać powiadomienie)
$sel->click_ok("removecc");
$sel->add_selection_ok("cc", "label=$config->{editbugs_user_login}");
$sel->value_is("removecc", "on");
$sel->selected_label_is("cc", $config->{editbugs_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_both, \@email_sentto, "Zarówno administrator jak i zwykły użytkownik otrzymali powiadomienie");
@email_excluded = get_email_excluded($sel);
ok($email_excluded[0] eq "nikogo", "Nikt nie został wykluczony");
# Przypisanie błędu do administratora (zarówno użytkownik jak i administrator powinni dostać powiadomienie)
$sel->type_ok("assigned_to", $config->{admin_user_login});
$sel->value_is("assigned_to", $config->{admin_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_both, \@email_sentto, "Zarówno administrator jak i zwykły użytkownik otrzymali powiadomienie");
@email_excluded = get_email_excluded($sel);
ok($email_excluded[0] eq "nikogo", "Nikt nie został wykluczony");
# Prośba o flagę dla zwykłego użytkownika (administrator powinien dostać powiadomienie, ale nie zwykły użytkownik. Administrator powinien dostać informację o fladze.)
$sel->select_ok("flag_type-1", "label=?");
$sel->type_ok("requestee_type-1", $config->{editbugs_user_login});
$sel->value_is("requestee_type-1", $config->{editbugs_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_admin, \@email_sentto, "Administrator otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_normal, \@email_excluded, "Zwykły użytkownik nie otrzymał powiadomienia");
# Odpowiedź na flagę umieszczoną przez zwykłego użytkownika (administrator powinien dostać powiadomienie, ale nie zwykły użytkownik. Nikt nie powinien otrzymać odpowiedzi na flagę.)
my $flag1_id = set_flag($sel, $config->{admin_user_login}, "?", "+");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_admin, \@email_sentto, "Administrator otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_normal, \@email_excluded, "Zwykły użytkownik nie otrzymał powiadomienia");

# Zwykły użytkownik dokonuje zmian (po raz drugi)
#
logout($sel);
log_in($sel, $config, 'editbugs');
go_to_bug($sel, $bug1_id);
# Zmiana wagi błędu (zarówno użytkownik jak i administrator powinni dostać powiadomienie)
$sel->select_ok("bug_severity", "label=Normalny");
$sel->selected_label_is("bug_severity", "Normalny");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_both, \@email_sentto, "Zarówno administrator jak i zwykły użytkownik otrzymali powiadomienie");
@email_excluded = get_email_excluded($sel);
ok($email_excluded[0] eq "nikogo", "Nikt nie został wykluczony");
# Dodanie komentarza (administrator powinien dostać powiadomienie, ale nie zwykły użytkownik)
$sel->type_ok("comment", "To jest ostatni z dwóch komentarzy zwykłego użytkownika. (Nikt nie powinien dostać powiadomienia)");
$sel->value_is("comment", "To jest ostatni z dwóch komentarzy zwykłego użytkownika. (Nikt nie powinien dostać powiadomienia)");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_admin, \@email_sentto, "Administrator otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_normal, \@email_excluded, "Zwykły użytkownik nie otrzymał powiadomienia");
# Przypisanie błędu zwykłemu użytkownikowi (administrator powinien dostać powiadomienie, ale nie zwykły użytkownik)
$sel->type_ok("assigned_to", $config->{editbugs_user_login});
$sel->value_is("assigned_to", $config->{editbugs_user_login});
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
is_deeply(\@email_admin, \@email_sentto, "Administrator otrzymał powiadomienie");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_normal, \@email_excluded, "Zwykły użytkownik nie otrzymał powiadomienia");
# Odmówienie flagi umieszczonej przez administratora (nikt nie powinien dostać powiadomienia. Administrator powinien otrzymać odpowiedź na flagę)
my $flag2_id = set_flag($sel, $config->{editbugs_user_login}, "?", "-");
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
ok($email_sentto[0] eq "nikogo", "Powiadomienie nie zostało wysłane");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_both, \@email_excluded, "Ani administrator, ani zwykły użytkownik nie otrzymali powiadomienia");
# Usuwanie obu flag (nikt nie powinien dostać odpowiedzi)
set_flag($sel, undef, "+", "X", $flag1_id);
set_flag($sel, undef, "-", "X", $flag2_id);
edit_bug($sel, $bug1_id, $bug_summary);
@email_sentto = get_email_sentto($sel);
ok($email_sentto[0] eq "nikogo", "Powiadomienie nie zostało wysłane");
@email_excluded = get_email_excluded($sel);
is_deeply(\@email_both, \@email_excluded, "Ani administrator, ani zwykły użytkownik nie otrzymali powiadomienia");
logout($sel);

# Zmiany domyślnego zachowania po zmianie błędu na wyświetlanie uaktualnionego błędu.
# Powrót do opcji 'nie rób nic'.
log_in($sel, $config, 'admin');
go_to_admin($sel);
$sel->click_ok("link=Ustawienia domyślne");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
$sel->select_ok("post_bug_submit_action", "label=nie rób nic");
$sel->click_ok("update");
$sel->wait_for_page_to_load(WAIT_TIME);
$sel->title_is("Ustawienia domyślne");
logout($sel);

# Funkcje pomocnicze
sub get_email_sentto {
    my ($sel) = @_;
    return sort split(/, /, $sel->get_text("//dt[text()='Powiadomienie wysłano do:']/following-sibling::dd"));
}

sub get_email_excluded {
    my ($sel) = @_;
    return sort split(/, /, $sel->get_text("//dt[text()='Z wyłączeniem:']/following-sibling::dd"));
}

sub set_flag {
    my ($sel, $login, $curval, $newval, $prev_id) = @_;

    # Zapisywanie id umieszczanej flagi
    my $flag_id = $prev_id;
    if (defined $login) {
        my $flag_name = $sel->get_attribute("//table[\@id='flags']//input[\@value='$login']\@name");
        $flag_name =~ /^requestee-(\d+)$/;
        $flag_id = $1;
    }

    # Zmiana flagi (wraz z weryfikacją aktualnie wybranej wartości flagi)
    $sel->select_ok("//select[\@id=\"flag-$flag_id\"]/option[\@value=\"$curval\" and \@selected]/..", "value=$newval", "Zmiana flagi $flag_id na $newval z $curval");

   return $flag_id;
}
