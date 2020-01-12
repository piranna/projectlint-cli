#!/usr/bin/env node

const projectlint = require('projectlint')

const cli = require('.')

const params = require('./package.json')


const {configs, rules, ...args} = cli({params})

projectlint(rules, configs, args)
.then(console.log)
