import { Command, flags } from '@oclif/command'
import { existsSync, copyFileSync } from 'fs'
import inquirer from 'inquirer'

import rootDir from '../../helpers/root-dir'
import log, { LogStatus } from '@helpers/log-messages'
import chalk from 'chalk'

export default class CreateChangelog extends Command {
  static description = 'create a CHANGELOG file based on an initial template'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-r, --replace)
    replace: flags.boolean({ char: 'r', description: 'replace CHANGELOG' }),
    force: flags.boolean({ char: 'f', description: 'force replace action', dependsOn: ['replace'] }),
    silent: flags.boolean({ char: 's', description: "don't show any logs" }),
  }

  private action() {
    return copyFileSync(`${rootDir}/src/templates/CHANGELOG.md`, './CHANGELOG.md')
  }

  private logger(message: string, status: LogStatus) {
    const { flags: flag } = this.parse(CreateChangelog)

    if (!flag.silent) {
      log(message, status)
    }
  }

  async run(): Promise<void> {
    const { flags: flag } = this.parse(CreateChangelog)
    const fileName = `${rootDir}/CHANGELOG.md`
    const replaceChangelogQuestions = [
      {
        type: 'confirm',
        name: 'replaceChangelogWarning',
        message: `${chalk.red
          .inverse` WARNING! `} You are about to replace your existing ${chalk.underline`CHANGELOG.md`} file. Would you like to proceed?`,
      },
    ]

    // File already exists, warn the user and show them how to bypass this
    if (!flag.replace) {
      this.logger('CHANGELOG.md already exists! Add the flags --replace [--force] to override it.', 'error')
    }

    // Force replace the existing file
    if (flag.force) {
      this.logger('CHANGELOG.md replaced', 'success')
      return this.action()
    }

    // If there's no CHANGELOG, create the a new one
    if (!existsSync(fileName)) {
      this.logger('CHANGELOG.md created!', 'success')
      return this.action()
    }

    // If there's a file already and the user used the `-r` flag, prompt them to make sure they know what they are doing
    if (existsSync(fileName) && flag.replace) {
      return inquirer.prompt(replaceChangelogQuestions).then((answers: { replaceChangelogWarning: boolean }) => {
        if (answers.replaceChangelogWarning) {
          this.logger('CHANGELOG.md replaced', 'success')
          return this.action()
        }
      })
    }
  }
}
