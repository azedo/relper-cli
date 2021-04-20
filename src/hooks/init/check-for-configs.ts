import { Hook } from '@oclif/config'

import log from '../../helpers/log-messages'

const hook: Hook<'init'> = async function (opts) {
  const hasConfig = opts.config.pjson.relper

  if (!hasConfig && opts.id !== 'create:config') {
    log(
      "There's no relper config object in package.json! You need to add one before start using the relper-cli.",
      'error'
    )
    log('You can run the command `relper create:config` to set up one or check out the docs.', 'info')
    this.exit()
  }
}

export default hook
