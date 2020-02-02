function mapProjects(project)
{
  const {outputLevel} = this

  return Object.entries(project).map(function([name, {dependsOn, evaluated}])
  {
    return evaluated
    .then(function(evaluated)
    {
      const {level} = evaluated

      project[name] = (level == null || outputLevel <= level)
        ? {dependsOn, ...evaluated}
        : undefined
    })
  })
}

function process(projects, outputLevel)
{
  return Promise.all(Object.values(projects).flatMap(mapProjects, {outputLevel}))
}

function report(projects, outputLevel, stdout)
{
  return process(projects, outputLevel)
  .then(function()
  {
    stdout.write(JSON.stringify(projects, null, 2))
  })
}
report.process = process


module.exports = report
