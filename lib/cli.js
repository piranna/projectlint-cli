const {join} = require('path')

const projectlint = require('projectlint')


module.exports = function(
  rules,
  configs,
  format,
  {outputLevel = 0, stdout = process.stdout, ...options} = {}
) {
  format = require(join(__dirname, 'reports', format))

  const projects = projectlint(rules, configs, options)

  format(projects, outputLevel, stdout)
}
