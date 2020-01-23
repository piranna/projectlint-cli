const {resolve, sep} = require('path')

const {ArgumentParser} = require('argparse')


const name = require('../package.json').name.split('/')[0].replace(/^@/, '')


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
  // parser.addArgument(`--no-${name}rc`, {action: 'storeFalse'})
  parser.addArgument('--plugin', {action: 'append', dest: 'plugins', type: loadPlugin})
  parser.addArgument(['-c', '--config'], {action: 'append', type: loadConfig})
  parser.addArgument('--rule'          , {action: 'append', type: loadRule})
  parser.addArgument('--fix'           , {action: 'storeTrue'})
  // parser.addArgument('--fix-dry-run', {action: 'storeTrue'})

  for(const argument of extraArguments) parser.addArgument(...argument)

  // parser.addArgument('--quiet', {action: 'storeTrue'})
  // parser.addArgument('--max-warnings', {})
  parser.addArgument(['-f', '--format'], {defaultValue: 'ndjson'})

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
