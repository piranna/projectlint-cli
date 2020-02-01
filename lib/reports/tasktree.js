const { TaskTree } = require('tasktree-cli')
const { TaskStatus } = require('tasktree-cli/lib/task')


function mapProjects([projectRoot, project])
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


module.exports = function(projects, outputLevel, stdout)
{
  const tree = TaskTree.tree(null, stdout)

  // start task tree log update in terminal
  tree.start()

  const promises = Object.entries(projects)
  .flatMap(mapProjects, {outputLevel, tree})

  // stop task tree log update
  Promise.all(promises).then(tree.stop.bind(tree))
}
