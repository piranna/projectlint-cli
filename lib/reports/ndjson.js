function mapProjects([projectRoot, project])
{
  return Object.entries(project).map(function([name, {dependsOn, evaluated}])
  {
    return evaluated
    .then(function(evaluated)
    {
      return {dependsOn, name, projectRoot, ...evaluated}
    })
  })
}


module.exports = function(stdout)
{
  return {
    evaluates(projects, outputLevel)
    {
      const promises = Object.entries(projects).flatMap(mapProjects)

      for(const promise of promises)
        promise.then(function(value)
        {
          const {level} = value

          if(level == null || outputLevel <= level)
            stdout.write(`${JSON.stringify(value)}\n`)
        })

      return Promise.allSettled(promises)
    },

    async fixes(projects)
    {
      // Run fix functions
      for(const [projectRoot, project] of projects)
        for(const [name, func] of Object.entries(project))
        {
          const result = await func()

          stdout.write(`${JSON.stringify({name, projectRoot, result})}\n`)
        }
    }
  }
}
