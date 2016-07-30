use strict;
use warnings;
use lib qw(lib);
use utf8;

use Test::More "no_plan";

use QA::Util;

my ($sel, $config) = get_selenium();

# Bardzo prosty test sprawdzający czy tworzenie nowego błędu
# z minimalną ilością danych zadziała dla użytkowników z różnymi
# uprawnieniami
#
# Bardziej skomplikowany test znajduje się w innym pliku.
# Co nie oznacza, że tego nie można ulepszyć.

my $bug_summary = "Błąd stworzony przez Selenium";
foreach my $user (qw(admin unprivileged canconfirm)) {
    log_in($sel, $config, $user);
    file_bug_in_product($sel, "TestProduct");
    $sel->type_ok("short_desc", $bug_summary, "Krótki opis błędu");
    $sel->type_ok("comment", "--- Błąd stworzony przes Selenium ---", "Dłuższy opis błędu");
    create_bug($sel, $bug_summary);
    logout($sel);
}
