#!/bin/bash

set -e
git checkout master
git pull origin master
rm -rf dist
npm run i
npm run build
git checkout gh-pages
cp -r dist/* .
git add .
git commit -m "Deploy"
git push origin gh-pages
git checkout master
