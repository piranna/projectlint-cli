const { Readable } = require('stream')


function mapProjects(project)
{
  return Object.entries(project).map(function([name, {dependsOn, evaluated}])
  {
    return evaluated
    .then(function(evaluated)
    {
      project[name] = {dependsOn, ...evaluated}
    })
  })
}


module.exports = function(projects)
{
  const promise = Promise.all(Object.values(projects).flatMap(mapProjects))

  return new Readable({
    read()
    {
      promise.then(() =>
      {
        this.push(JSON.stringify(projects, null, 2))
        this.push(null)
      })
    }
  })
}
