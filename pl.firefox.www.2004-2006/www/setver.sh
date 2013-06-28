#!/bin/bash

files=( js/suggest.js .htaccess currentver.txt )

for i in ${files[@]}; do
    sed s/@FXVER/$1/g ${i}_in > $i
done 