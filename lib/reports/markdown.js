const {async} = require("json2md")

const {process} = require('./json')


function convert(value)
{
  const result = []

  for(const [h1, project] of Object.entries(value))
  {
    result.push({h1})

    for(const [h2, ul] of Object.entries(project))
    {
      result.push({h2})

      result.push({ul})
    }
  }

  return result
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