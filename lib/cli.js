const projectlint = require('projectlint')


module.exports = function(rules, configs, args)
{
  projectlint(rules, configs, args)
  .then(console.log)
}
