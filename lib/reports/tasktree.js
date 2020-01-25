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
          if(evaluated.failure)  // Failed rules configured with `warning` level
            return taskRule.error(evaluated.failure)
              .complete(null, null, TaskStatus.Warning)

                         // `evaluate()` failures promoted to errors
        case undefined:  // Uncaught `fetch()` errors
        case 2:          // Failed rules configured with `error` level
          return taskRule.error(evaluated.error || evaluated.failure)
            .complete(null, null, TaskStatus.Failed)
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
