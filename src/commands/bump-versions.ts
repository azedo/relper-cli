import { Command, flags } from '@oclif/command'
import rootDir from '../helpers/root'
import inquirer = require('inquirer')
import chalk = require('chalk')
import fs = require('fs')

export default class BumpVersion extends Command {
  static description = 'bump/change the app version in package.json'

  static examples = [`$ relper bump-version`]

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    const { args, flags } = this.parse(BumpVersion)

    // const name = flags.name ?? 'world'
    // this.log(`hello ${name} from ./src/commands/hello.ts`)
    // if (args.file && flags.force) {
    //   this.log(`you input --force and --file: ${args.file}`)
    // }

    // this.log(rootDir)

    const packageLocation = `${rootDir}/package.json`

    const questions = [
      {
        type: 'input',
        name: 'package_json_file',
        message: 'Is this your main package.json file?',
        default: function () {
          return packageLocation
        },
        validate: function (value: any) {
          if (fs.existsSync(value)) {
            return true
          }

          return 'Please enter a valid path for the main package.json file!'
        },
      },
    ]

    await inquirer
      .prompt(questions)
      .then(async (answers: any) => {
        const versionNumber = await fs.readFile(answers.package_json_file, 'utf8', async function (err, data: string) {
          if (err) {
            // TODO Make better error handling!
            return console.log('ERROR => ', err)
          }

          const fileContents = await JSON.parse(data)

          return fileContents.version
        })

        await inquirer.prompt({
          type: 'input',
          name: 'version_number',
          message: 'What should be the new version?',
          default: async function () {
            console.log(versionNumber)
            return versionNumber
          },
          // validate: function (value: any) {
          //   if (fs.existsSync(value)) {
          //     return true
          //   }

          //   return 'Please enter a valid path for the main package.json file!'
          // },
        })

        // this.log(chalk`{green [SUCCESS] The config options have been saved!}`)
        // this.log(answers)
        // config.set('colorVariables_file', answers.colorVariables_file)
        // config.set('destination_folder', answers.destination_folder)
      })
      .catch((error) => {
        if (error.isTtyError) {
          // Prompt couldn't be rendered in the current environment
          this.log(`Prompt couldn't be rendered in the current environment.`)
        } else {
          // Something else when wrong
          this.log(`Something went wrong... :/`)
        }
      })
  }
}
