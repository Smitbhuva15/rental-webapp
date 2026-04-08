#!/bin/bash
npx -y create-next-app@latest rental-book --javascript --tailwind --eslint --app --import-alias="@/*" --use-npm --src-dir=false
shopt -s dotglob
mv rental-book/* ./
rm -rf rental-book
