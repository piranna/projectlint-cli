const {resolve, sep} = require('path')

const {ArgumentParser} = require('argparse')


const choices = ['info', 'warning', 'error', 'critical']
const name = require('../package.json').name.split('/')[0].replace(/^@/, '')


function parseOutputLevel(value)
{
  let result = choices.indexOf(value)
  if(result >= 0) return result

  result = parseInt(value)
  if(!(result < choices.length))
    throw new SyntaxError(`Unknown output level value '${value}'`)

  return result
}

function resolvePackage(packageName, kind, paths)
{
  function resolve(packageName)
  {
    return require.resolve(packageName, {paths})
  }

  try
  {
    return resolve(packageName)
  }
  catch(error)
  {
    if(error.code && error.code !== 'MODULE_NOT_FOUND') throw error
  }

  // Split package name components
  const path = packageName.split(sep)
  const lastIndex = path.length-1
  const pathLast = path[lastIndex]

  // Prefixed require
  path[lastIndex] = `${name}-${kind}-${pathLast}`
  packageName = path.join(sep)

  try
  {
    return resolve(packageName)
  }
  catch(error)
  {
    if(error.code && error.code !== 'MODULE_NOT_FOUND') throw error
  }

  // Scoped require
  path[lastIndex] = `@${name}/${kind}-${pathLast}`
  packageName = path.join(sep)

  return resolve(packageName)
}


module.exports = function({argv, extraArguments = [], namespace, params, paths} = {})
{
  const loaded = []


  function loadConfig(config)
  {
    if(config[0] === '.') config = resolve(config)

    loaded.push({config})  // TODO: package name
  }

  function loadRule(rule)
  {
    loaded.push({rule})  // TODO: package name
  }

  function loadPlugin(plugin)
  {
    if(plugin[0] !== '.') return plugin

    return resolve(plugin)
  }


  const parser = new ArgumentParser(params)

  // Positional arguments
  parser.addArgument('projectRoot', {nargs: '*', type: resolve})

  // Optional arguments
  parser.addArgument(`--no-${name}rc`,
    {action: 'storeFalse', dest: 'use_projectlintrc'})

  let group = parser.addArgumentGroup()
  group.addArgument('--plugin', {
    action: 'append',
    dest: 'plugins',
    type: loadPlugin
  })
  group.addArgument(['-c', '--config'], {action: 'append', type: loadConfig})
  group.addArgument('--rule'          , {action: 'append', type: loadRule})

  if(extraArguments && extraArguments.length)
  {
    const group = parser.addArgumentGroup()

    for(const argument of extraArguments) group.addArgument(...argument)
  }

  group = parser.addArgumentGroup()
  group.addArgument('--fix'           , {action: 'storeTrue'})
  // group.addArgument('--fix-dry-run', {action: 'storeTrue'})

  group = parser.addArgumentGroup()
  group.addArgument('--outputLevel', {
    choices,
    defaultValue: 1,
    dest: 'outputLevel',
    type: parseOutputLevel
  })
  group.addArgument('--quiet', {
    action: 'storeConst',
    constant: 2,
    dest: 'outputLevel'
  })
  group.addArgument('--verbose', {
    action: 'storeConst',
    constant: 0,
    dest: 'outputLevel'
  })

  group = parser.addArgumentGroup()
  // parser.addArgument('--max-warnings', {})
  group.addArgument(['-f', '--format'], {defaultValue: 'tasktree'})

  const {config, plugins, rule, ...args} = parser.parseArgs(argv, namespace)

  const pluginsConfigs = {}
  const rules = {}

  if(plugins)
    for(let packageName of plugins)
    {
      packageName = resolvePackage(packageName, 'plugin', paths)

      const {config, rules: pluginRules} = require(packageName)

      // TODO: package name
      if(config) pluginsConfigs[packageName] = config
      if(pluginRules) rules[packageName] = pluginRules
    }

  let configs = []

  for(let {config, rule} of loaded)
    if(rule) configs.push(rule)

    else
    {
      let [packageName, ...configName] = config.split(':')
      configName = configName.join(':')

      try
      {
        config = pluginsConfigs[resolvePackage(packageName, 'plugin', paths)]
      }
      catch(error)
      {
        if(error.code && error.code !== 'MODULE_NOT_FOUND') throw error

        config = null
      }

      if(!config) config = require(resolvePackage(packageName, 'config', paths))

      // Packages with multiple configs
      if(configName)
      {
        config = config[configName]
        if(!config) throw new SyntaxError
      }

      // TODO: object
      if(config.constructor.name === 'Object') config = Object.entries(config)

      configs = configs.concat(config)
    }

  // configs = configs.reduce(function(acum, config)
  // {
  //   const [rule, configName = 'default'] = config.split(':')

  //   const packageName = resolvePackage(rule)

  //   const entries = Object.entries(configs[packageName][configName])

  //   for(const [rule, config] of entries)
  //     acum[`${packageName}:${rule}`] = Array.isArray(config) ? config : [config]

  //   return acum
  // }, {})

  return {configs, rules, ...args}
}
