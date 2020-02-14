const {join} = require('path')

const projectlint = require('@projectlint/projectlint')


module.exports = function(
  rules,
  configs,
  format,
  {fix, outputLevel = 0, stdout = process.stdout, ...options} = {}
) {
  const {evaluates, fixes} = require(join(__dirname, 'reports', format))(stdout)

  const projects = projectlint(rules, configs, options)

  return evaluates(projects, outputLevel)
  .then(function()
  {
    if(!fix) return Promise.resolve([])

    const dry = fix === 'dry-run'

    // Get list of tasks
    return Object.entries(projects)
    .map(function([projectRoot, project])
    {
      return [projectRoot, Object.entries(project)
      .reduce(function(acum, [name, {fix, fixDry}])
      {
        const func = dry ? fixDry : fix

        if(func) acum[name] = {func}

        return acum
      }, {})]
    })
  })
  .then(fixes)
}
