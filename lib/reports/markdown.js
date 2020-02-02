const {async} = require("json2md")

const {Failure} = require('@projectlint/projectlint')

const {process} = require('./json')


const levels = ['Success', 'Warning', 'Error', 'Critical']


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
      const status = (level == null &&failure instanceof Failure)
        ? 'Failure' : level2status(level)

      result.push({h2: `${status}: ${ruleName}`})

      const {message} = (error || failure || warning || {})

      if(message) result.push({ul: [message]})
    }
  }

  return result
}

function level2status(level = 2)
{
  return levels[level]
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