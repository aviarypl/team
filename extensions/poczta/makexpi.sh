#!/bin/bash

rm -rf build
mkdir build

mkdir build/xpifile
mkdir build/xpifile/chrome

mkdir build/jarfile
cp -R src/chrome/gzl-poczta/* build/jarfile/

pushd build/jarfile >/dev/null

find . -name "*~" -exec rm {} \;

echo "Creating gzl-poczta.jar"
zip -r ../xpifile/chrome/gzl-poczta.jar content/ locale/

popd >/dev/null

cp src/chrome.manifest build/xpifile
cp src/install.rdf build/xpifile

pushd build/xpifile >/dev/null

echo "Creating gazella-poczta.xpi"
zip -r ../gazella-poczta.xpi chrome/ chrome.manifest install.rdf

popd >/dev/null

echo "gazella-poczta.xpi is ready in the build/ directory"

