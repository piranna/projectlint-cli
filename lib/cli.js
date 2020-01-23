const {join} = require('path')

const projectlint = require('projectlint')


module.exports = function(rules, configs, format, options)
{
  format = require(join(__dirname, 'reports', format))

  return format(projectlint(rules, configs, options))
}
