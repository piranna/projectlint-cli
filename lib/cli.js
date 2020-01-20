const projectlint = require('projectlint')


function genErrorObject(error)
{
  return {error}
}

function genResultObject(result)
{
  return {result}
}

function mapProjects([projectRoot, project])
{
  return Object.entries(project).map(function([name, {promise, ...rule}])
  {
    return promise
    .then(genResultObject, genErrorObject)
    .then(function({error, result})
    {
      return {...rule, error, name, projectRoot, result}
    })
  })
}


module.exports = function(rules, configs, args)
{
  const projects = projectlint(rules, configs, args)

  const promises = Object.entries(projects).flatMap(mapProjects)

  return Promise.allSettled(promises)
  .then(function(results)
  {
    console.log(JSON.stringify(results, null, 2))
  })
}
