const projectlint = require('projectlint')


function mapProjectRootResults({reason: error, value})
{
  // This could only happen by a severe crash of the `tasksEngine` instance
  if(error) return {error}

  return value
}

function projectRootResults(results)
{
  return results.map(mapProjectRootResults)
}


module.exports = function(rules, configs, args)
{
  return Promise.allSettled(projectlint(rules, configs, args))
  .then(projectRootResults)
  .then(console.log)
}
