const { Readable } = require('stream')

const projectlint = require('projectlint')


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


module.exports = function(rules, configs, options)
{
  const projects = projectlint(rules, configs, options)

  const promise = Promise.all(Object.entries(projects).flatMap(mapProjects))

  return new Readable({
    read()
    {
      promise.then(results =>
      {
        this.push(JSON.stringify(results, null, 2))

        return this.push(null)
      })
    }
  })
}
