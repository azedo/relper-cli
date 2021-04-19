import { Hook } from '@oclif/config'

import log from '@helpers/log-messages'

const hook: Hook<'init'> = async function (opts) {
  const hasConfig = opts.config.pjson.relper

  if (!hasConfig) {
    log("There's no relper config object in package.json! You need to add one before using the relper-cli.", 'error')
    this.exit()
  }
}

export default hook
