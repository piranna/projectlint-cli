#!/usr/bin/env node

const {cli, parseArgs} = require('.')

const params = require('./package.json')


const {configs, format, rules, ...options} = parseArgs({params})

cli(rules, configs, format, options).pipe(process.stdout)
