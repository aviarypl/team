## Zakładanie kont

* gapps i dodać (ręcznie) do grupy team
* http://wiki.aviary.pl/Specjalna:Zaloguj/signup
* http://bugs.aviary.pl/createaccount.cgi lub sugestia zmiany adresu na aviarowy na bap
* https://aviarypl.etherpad.mozilla.org/ep/admin/account-manager/new

## Aktualizowanie oprogramowania

* pakiety systemowe aktualizowane są codziennie rano
* reszta odbywa się przez repozytorium, oprogramowanie i generalnie wszystko poza danymi i konfiguracją staramy się trzymać w zewnętrznych repozytoriach
* przed aktualizacją warto sprawdzić informacje o wydaniu
  * http://www.bugzilla.org/releases/
  * https://www.mediawiki.org/wiki/Release_notes
  * https://codex.wordpress.org/Changelog
  * https://uwsgi-docs.readthedocs.org/en/latest/#release-notes (nie znajduje się w repozytoriach)
  * dodatkowo
    * https://www.mediawiki.org/wiki/Compatibility http://wiki.aviary.pl/Specjalna:Wersja
    * http://codex.wordpress.org/Upgrading_WordPress_Extended
  * `cd MODULE; git fetch origin [+branch|tag TAG]; git checkout [SHA1|TAG|-B branch; git pull]; cd ..; git commit -m "Update STH to TAG on DOMAIN" MODULE`
    * gdzie TAG to numer wersji lub dla Bugzilli to release-5.0, MODULE to ścieżka do modułu, STH to nazwa oprogramowania, SHA1 to konkretna rewizja
    * listę modułów (zewnętrznych repozytoriów) i ich położenie można sprawdzić w pliku .gitmodules
  * `git pull --rebase; git push`
  * po aktualizacji warto
    * sprawdzić na http://www.aviary.pl/wp-admin/upgrade.php czy nie trzeba uaktualnić bazy danych
    * sprawdzić czy aktualizacja się powiodła odwiedzając: http://wiki.aviary.pl/Specjalna:Wersja, http://bugs.aviary.pl i http://www.aviary.pl
