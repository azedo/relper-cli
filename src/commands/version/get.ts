import { Command, flags } from '@oclif/command'

import getAppCurrentData from '@helpers/getAppCurrentData'
import getNextVersion from '@helpers/getNextVersion'

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
    let returnText = `The current version is ${currentVersion?.version}`

    if (Object.keys(nextVersion).includes('name')) {
      returnText = `You are in a ${nextVersion.type} branch with a version number ${nextVersion.name}. ${returnText}`
    }

    if (!flag.silent) {
      this.log(returnText)
      return returnText
    }
  }
}
