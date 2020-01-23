const { Readable } = require('stream')


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


module.exports = function(projects)
{
  const promises = Object.entries(projects).flatMap(mapProjects)

  const result = new Readable({read(){}})

  for(const promise of promises)
    promise.then(function(value)
    {
      result.push(`${JSON.stringify(value)}\n`)
    })

  Promise.all(promises).then(result.push.bind(result, null))

  return result
}
