#!/bin/bash

echo -n "Preparing tree... "
rm -Rf ./tmp
mkdir ./tmp
cp -Rf ./src/* ./tmp
#~ find ./tmp -name ".svn" -exec rm -Rf {} \; 
for i in $(find ./tmp -name ".svn"); do rm -Rf $i; done;
echo "OK"

echo -n "Creating deepsend-g.xpi... "
rm deepsend-g.xpi
cd tmp
zip -qq -r ../deepsend-g.xpi *
cd ..
rm -Rf ./tmp
echo "OK"