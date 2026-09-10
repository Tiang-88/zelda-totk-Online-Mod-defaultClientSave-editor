#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const root = __dirname;
const sourcePath = path.join(root, 'Server', 'Resources', 'SaveServer', 'defaultClientSave.ktml');
const outputPath = path.join(root, 'defaultClientSave-data.js');
const source = fs.readFileSync(sourcePath, 'utf8');

fs.writeFileSync(outputPath, `/* Generated from Server/Resources/SaveServer/defaultClientSave.ktml. */\nwindow.DEFAULT_KTML = ${JSON.stringify(source)};\n`);
console.log(`Generated defaultClientSave-data.js (${source.length} characters).`);
