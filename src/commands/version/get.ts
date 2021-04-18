import { Command, flags } from '@oclif/command'
import chalk from 'chalk'

import log from '@helpers/log-messages'
import getAppCurrentData from '@helpers/get-app-current-data'
import getNextVersion from '@helpers/get-next-version'

export default class VersionGet extends Command {
  static description = 'show the current version of the app'

  static flags = {
    help: flags.help({ char: 'h' }),
    silent: flags.boolean({ char: 's', description: 'return silent' }),
    folderPath: flags.string({ char: 'p', description: "the project's main folder" }),
  }

  async run(): Promise<string | undefined> {
    const { flags: flag } = this.parse(VersionGet)
    const nextVersion = await getNextVersion()
    const currentVersion = getAppCurrentData(flag.folderPath)
    let returnText = `The current version is ${chalk.inverse(' ' + currentVersion?.version + ' ')}`

    if (Object.keys(nextVersion).includes('name')) {
      returnText = `You are in a ${chalk.underline(nextVersion.type)} branch with a version number ${chalk.underline(
        nextVersion.name
      )}. ${returnText}`
    }

    if (!flag.silent) {
      log(returnText, 'info')
    }

    return returnText
  }
}
