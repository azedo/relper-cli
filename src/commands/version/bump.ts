import { Command, flags } from '@oclif/command'
import fs = require('fs')
import rootDir from '../../helpers/root'
import { cli } from 'cli-ux'

export default class VersionBump extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(VersionBump)

    const packageJsonFile = `${rootDir}/package.json`

    if (!fs.existsSync(packageJsonFile)) {
      return `Error, package.json file doesn't exists`
    }

    try {
      cli.action.start('Fetching version', 'initializing', { stdout: true })

      const currentVersion = fs.readFile(packageJsonFile, 'utf8', async function (err, data: string) {
        if (err) {
          // TODO Make better error handling!
          return console.log('ERROR => ', err)
        }

        const fileContents = await JSON.parse(data)

        console.log(fileContents.version)
        cli.action.stop()
      })

      return `The current version is => ${currentVersion}`
    } catch (error) {
      console.log(`ERROR! => ${error}`)
    }
  }
}
