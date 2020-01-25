function mapProjects(project)
{
  const outputLevel = this ? this.valueOf() : undefined

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


module.exports = function(projects, outputLevel, stdout)
{
  const promises = Object.values(projects).flatMap(mapProjects, outputLevel)

  Promise.all(promises).then(function()
  {
    stdout.write(JSON.stringify(projects, null, 2))
  })
}
