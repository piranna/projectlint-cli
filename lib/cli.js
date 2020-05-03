const {join} = require('path')

const projectlint = require('@projectlint/projectlint')


module.exports = function(
  rules,
  configs,
  format,
  {
    fix,
    outputLevel = 0,
    stderr = process.stderr,
    stdout = process.stdout,
    ...options
  } = {}
) {
  const path = join(__dirname, 'reports', format)

  const {evaluates, fixes} = require(path)(stdout, stderr)

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
