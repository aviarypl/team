use strict;
use warnings;
use lib qw(lib);

use Test::More "no_plan";

use QA::Util;
use utf8;

my ($sel, $config) = get_selenium();

# Turn on 'requirelogin'.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"requirelogin-on" => undef} });
logout($sel);

# We try to access each page. None of the ones listed below should
# let you view it without being logged in.

my @pages = qw(admin attachment buglist chart colchange describecomponents
               describekeywords duplicates editclassifications editcomponents
               editfields editflagtypes editgroups editkeywords editmilestones
               editparams editproducts editsettings editusers editvalues
               editversions editwhines editworkflow enter_bug page post_bug
               process_bug query quips report reports request sanitycheck
               search_plugin show_activity show_bug showdependencygraph
               showdependencytree summarize_time userprefs votes);

foreach my $page (@pages) {
    $sel->open_ok("/$config->{bugzilla_installation}/${page}.cgi");
    if ($page ne 'votes' || $config->{test_extensions}) {
        $sel->title_is("Logowanie do Bugzilli");
    }
    else {
        $sel->title_is("Rozszerzenie jest wyłączone");
    }
}

# Those have parameters passed to the page, so we put them here separately.

@pages = ("query.cgi?format=report-table", "query.cgi?format=report-graph",
          "votes.cgi?action=show_user", "votes.cgi?action=show_bug");

foreach my $page (@pages) {
    $sel->open_ok("/$config->{bugzilla_installation}/$page");
    if ($page !~ /^votes/ || $config->{test_extensions}) {
        $sel->title_is("Logowanie do Bugzilli");
    }
    else {
        $sel->title_is("Rozszerzenie jest wyłączone");
    }
}

# These pages should still be accessible.

@pages = ("config.cgi", "createaccount.cgi", "index.cgi", "relogin.cgi",
          "token.cgi?a=reqpw&loginname=" . $config->{unprivileged_user_login});

foreach my $page (@pages) {
    $sel->open_ok("/$config->{bugzilla_installation}/$page");
    $sel->title_isnt("Logowanie do Bugzilli");
}

# Turn off 'requirelogin'.

log_in($sel, $config, 'admin');
set_parameters($sel, { "Uwierzytelnianie użytkowników" => {"requirelogin-off" => undef} });
logout($sel);

# Make sure we can access random pages again.
$sel->click_ok("link=Wyszukiwanie");
$sel->wait_for_page_to_load_ok(WAIT_TIME);
$sel->title_isnt("Logowanie do Bugzilli");
