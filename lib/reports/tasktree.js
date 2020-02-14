const { TaskTree } = require('tasktree-cli')
const { TaskStatus } = require('tasktree-cli/lib/task')


function mapEvaluate([projectRoot, project])
{
  const {outputLevel, tree} = this

  const taskProject = tree.add(projectRoot)

  const promises = Object.entries(project)
  .map(function([name, {dependsOn, evaluated}])
  {
    const taskRule = taskProject.add(name)

    return evaluated
    .then(function(evaluated)
    {
      switch(evaluated.level)
      {
        case 0:
          return taskRule.complete()

        case 1:
        {
          const {failure} = evaluated

          if(failure)  // Failed rules configured with `warning` level
          {
            const {result} = failure

            if(!Array.isArray(result))
              taskRule.warn(failure.toString())
            else
              for(const failure of result)
                taskRule.warn(failure.toString())

            return taskRule.complete(null, null, TaskStatus.Warning)
          }
        }

                         // `evaluate()` failures promoted to errors
        case undefined:  // Uncaught `fetch()` errors
        case 2:          // Failed rules configured with `error` level
        {
          const error = evaluated.error || evaluated.failure
          const {result} = error

          if(!Array.isArray(result))
            taskRule.error(error.toString())
          else
            for(const error of result)
              taskRule.warn(error.toString())

          return taskRule.complete(null, null, TaskStatus.Failed)
        }
      }
    })
  })

  return promises
}

function mapFixes([projectRoot, rules])
{
  let taskProject

  return [projectRoot, Object.entries(rules)
  .reduce((acum, [name, func]) =>
  {
    if(!taskProject) taskProject = this.add(projectRoot)

    acum[name] = {func, task: taskProject.add(name)}

    return acum
  }, {})]
}


module.exports = function(stdout)
{
  return {
    evaluates(projects, outputLevel)
    {
      const tree = TaskTree.tree(null, stdout)

      // start task tree log update in terminal
      tree.start()

      const promises = Object.entries(projects)
      .flatMap(mapEvaluate, {outputLevel, tree})

      // stop task tree log update
      return Promise.allSettled(promises).then(tree.stop.bind(tree))
    },

    async fixes(projects)
    {
      const tree = TaskTree.tree(null, stdout)

      // start task tree log update in terminal
      tree.start()

      // Run fix functions
      for(const project of projects.map(mapFixes, tree))
        for(const {func, task} of Object.values(project))
        {
          const result = await func()

          if(result) task.info(result.toString())

          task.complete()
        }

      // stop task tree log update
      tree.stop()
    }
  }
}
