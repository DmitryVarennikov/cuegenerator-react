#!/bin/bash

npm run build
rm -rf public-prod/*
mv build public-prod
npm run deploy