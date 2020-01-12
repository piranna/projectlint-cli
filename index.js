const {resolve, sep} = require('path')

const {ArgumentParser} = require('argparse')


const name = require('./package.json').name.split('/')[0].replace(/^@/, '')


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


module.exports = function({argv, namespace, params, paths} = {})
{
  const loaded = []


  function loadConfig(config)
  {
    loaded.push({config})  // TODO: package name
  }

  function loadRule(rule)
  {
    loaded.push({rule})  // TODO: package name
  }


  const parser = new ArgumentParser(params)

  // Positional arguments
  parser.addArgument('projectRoot', {nargs: '*', type: resolve})

  // Optional arguments
  // parser.addArgument(`--no-${name}rc`, {action: 'storeFalse'})
  parser.addArgument('--plugin'        , {action: 'append', dest: 'plugins'})
  parser.addArgument(['-c', '--config'], {action: 'append', type: loadConfig})
  parser.addArgument('--rule'          , {action: 'append', type: loadRule})
  parser.addArgument('--fix'           , {action: 'storeTrue'})
  // parser.addArgument('--fix-dry-run', {action: 'storeTrue'})

  // parser.addArgument('--quiet', {action: 'storeTrue'})
  // parser.addArgument('--max-warnings', {})
  // parser.addArgument('--format')

  const {config, plugins, rule, ...args} = parser.parseArgs(argv, namespace)

  const pluginsConfigs = {}
  const rules = {}

  if(plugins)
    for(const plugin of plugins)
    {
      const packageName = resolvePackage(plugin, 'plugin', paths)

      const {config, rules: pluginRules} = require(packageName)

      // TODO: package name
      if(config) pluginsConfigs[packageName] = config
      if(pluginRules) rules[packageName] = pluginRules
    }

  let configs = []

  for(const {config, rule} of loaded)
    if(rule) configs.push(rule)

    else
    {
      let plugin, configName
      [plugin, ...configName] = config.split(':')
      configName = configName.join(':')

      const packageName = resolvePackage(plugin, 'config', paths)

      plugin = require(packageName)
      if(!plugin) throw new SyntaxError

      // TODO: packages with multiple configs
      if(configName)
      {
        plugin = plugin[configName]
        if(!plugin) throw new SyntaxError
      }

      // TODO: object
      if(plugin.constructor.name === 'Object') plugin = Object.entries(plugin)

      configs = configs.concat(plugin)
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
