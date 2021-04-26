import { Hook } from '@oclif/config'
import { existsSync } from 'fs'
import pkgDir from 'pkg-dir'

import log from '../../helpers/log-messages'

const hook: Hook<'init'> = async function (opts) {
  const hasConfig = opts.config.pjson.relper

  // Check if there's a config key in `package.json` before any command that would require it.
  if (!hasConfig && opts.id !== 'create:config') {
    log(
      "There's no relper config object in package.json! You need to add one before start using the relper-cli.",
      'error'
    )
    log('You can run the command `relper create:config` to set up one or check out the docs.', 'info')
    this.exit()
  }

  // Check if there's a `CHANGELOG.md` file before running commands that alter said file.
  if (!existsSync(`${pkgDir.sync('./')}/CHANGELOG.md`) && opts.id === 'version:bump') {
    log("There's no CHANGELOG file in this repo! You need to add one before start using the bump command.", 'error')
    log('You can run the command `relper create:changelog` to set up one or check out the docs.', 'info')
    this.exit()
  }
}

export default hook
