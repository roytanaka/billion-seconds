#!/usr/bin/env sh

# abort on errors
set -e

# build
npm run build

# navigate into the build output directory
cd dist
# copy index.html to handle gh-pages 404
cp index.html 404.html

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:roytanaka/billion-seconds.git master:gh-pages

cd -
