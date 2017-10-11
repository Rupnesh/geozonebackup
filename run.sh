#!/usr/bin/env bash
cd client/
rm -rf node_modules/
npm install
npm run build
cd ..
cd server/
rm -rf node_modules/
npm install
npm run sprod
