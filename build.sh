#!/bin/bash

cd $(dirname $0)

if [[ ! -d dist ]]
then
    mkdir dist
fi

dataOption="--data-urlencode"
options="-fsSL -o dist/neko.min.js \
    ${dataOption} compilation_level=ADVANCED_OPTIMIZATIONS \
    ${dataOption} output_info=compiled_code \
    ${dataOption} language_out=ECMASCRIPT_2016"

for file in js/*
do
    name=$(basename $file)
    options="${options} ${dataOption} js_code:${name}@${file}"
done

curl $options "https://closure-compiler.appspot.com/compile"
