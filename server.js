#!/usr/bin/env node

const {cli, parseArgs} = require('.')

const params = require('./package.json')


const {configs, rules, ...args} = parseArgs({params})

cli(rules, configs, args)
