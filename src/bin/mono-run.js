#!/usr/bin/env node

const { cac } = require('cac')
const { monorepoRun } = require('../')
const consola = require('consola')
const chalk = require('chalk')
const pkg = require('../../package.json')

const cli = cac()

cli.option('--patterns <patterns>', 'Folder glob patterns (by default will take yarn workspaces)')

cli.option('--stream [throttle]', 'Stream output directly instead of waiting for the end. You can also throttle (ms) the output when streaming is enabled.', {
  default: false,
})

cli.help()
cli.version(pkg.version)

cli.command('<script>', 'Run a script in the monorepo packages')
  .action(async (script, options) => {
    if (options.stream && !isNaN(parseInt(options.stream))) {
      options.stream = parseInt(options.stream)
    }
    try {
      const time = Date.now()
      const { folders } = await monorepoRun(script, options.patterns, null, options.stream)
      consola.success(`Completed ${script} (${Math.round((Date.now() - time) / 10) / 100}s) in:`)
      consola.log(chalk.green(folders.join('\n')))
    } catch (e) {
      consola.error(e)
    }
  })

cli.parse()
