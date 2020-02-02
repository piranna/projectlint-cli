const {async} = require("json2md")

const {process} = require('./json')


const statuses = ['Success', 'Failure', 'Error', 'Critical']


function convert(value)
{
  const result = []

  for(const [h1, project] of Object.entries(value))
  {
    result.push({h1})

    for(const [ruleName, rule] of Object.entries(project))
    {
      if(!rule) continue

      const {error, failure, level, warning} = rule

      result.push({h2: `${level2status(level)}: ${ruleName}`})

      const {message} = (error || failure || warning || {})

      if(message) result.push({ul: [message]})
    }
  }

  return result
}

function level2status(level = 2)
{
  return statuses[level]
}


module.exports = function(projects, outputLevel, stdout)
{
  return process(projects, outputLevel)
  .then(function()
  {
    return async(convert(projects))
  })
  .then(stdout.write.bind(stdout))
}