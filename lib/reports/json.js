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


function report(stdout)
{
  let evaluates

  function write(fixes)
  {
    stdout.write(JSON.stringify({evaluates, fixes}, null, 2))
  }

  return {
    evaluates(projects, outputLevel)
    {
      return process(projects, outputLevel)
      .then(function()
      {
        evaluates = projects
      })
    },

    async fixes(projects)
    {
      let result

      // Run fix functions
      for(const [projectRoot, project] of Object.entries(projects))
        for(const [name, func] of Object.entries(project))
        {
          if(!result) result = {}

          let rules = result[projectRoot]
          if(!rules) result[projectRoot] = rules = {}

          let result = await func()
          if(result === undefined) result = null

          rules[name] = result
        }

      write(result)
    }
  }
}
report.process = process


module.exports = report
