import { Command, flags } from '@oclif/command'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'
import chalk from 'chalk'
import pkgDir from 'pkg-dir'

import rootDir from '../../helpers/root-dir'
import log, { LogStatus } from '../../helpers/log-messages'
import getAppCurrentData from '../../helpers/get-app-current-data'

// relper create:changelog [-r, -f, -s]
export default class Changelog extends Command {
  static description = 'create a CHANGELOG file based on an initial template'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-r, --replace)
    replace: flags.boolean({ char: 'r', description: 'replace CHANGELOG' }),
    // flag with no value (-f, --force) that depends on '--replace'
    force: flags.boolean({ char: 'f', description: 'force replace action', dependsOn: ['replace'] }),
    // flag with no value (-s, --silent)
    silent: flags.boolean({ char: 's', description: "don't show any logs" }),
  }

  private logger(message: string, status: LogStatus) {
    const { flags: flag } = this.parse(Changelog)

    if (!flag.silent) {
      log(message, status)
    }
  }

  private copyFile() {
    const { flags: flag } = this.parse(Changelog)
    const userRootFolder = pkgDir.sync('./')
    const templateFile = readFileSync(`${rootDir}/src/templates/CHANGELOG.md`, { encoding: 'utf-8' })
    const repoUrl = getAppCurrentData()?.repository.replace('.git', '')
    const addLastLine = templateFile.concat(`\n[unreleased]: ${repoUrl}/compare/unreleased...main\n`)

    if (flag.replace) this.logger('CHANGELOG.md replaced!', 'success')
    if (!flag.replace) this.logger('CHANGELOG.md created!', 'success')

    return writeFileSync(`${userRootFolder}/CHANGELOG.md`, addLastLine, { encoding: 'utf-8' })
  }

  async run(): Promise<void> {
    const { flags: flag } = this.parse(Changelog)
    const userRootFolder = pkgDir.sync('./')
    const fileName = `${userRootFolder}/CHANGELOG.md`
    const replaceChangelogQuestions = [
      {
        type: 'confirm',
        name: 'replaceChangelogWarning',
        message: `RELPER ${chalk
          .keyword('orange')
          .inverse(' WARNING ')}: You are about to replace your existing ${chalk.underline(
          'CHANGELOG.md'
        )} file. Would you like to proceed?`,
      },
    ]

    // If there's no CHANGELOG, create the a new one
    if (!existsSync(fileName)) {
      return this.copyFile()
    }

    // File already exists, warn the user and show them how to bypass this
    if (!flag.replace) {
      this.logger('CHANGELOG.md already exists! Add the flags --replace [--force] to override it.', 'error')
    }

    // Force replace the existing file
    if (flag.force) {
      return this.copyFile()
    }

    // If there's a file already and the user used the `-r` flag, prompt them to make sure they know what they are doing
    if (existsSync(fileName) && flag.replace) {
      return inquirer.prompt(replaceChangelogQuestions).then((answers: { replaceChangelogWarning: boolean }) => {
        if (answers.replaceChangelogWarning) {
          return this.copyFile()
        }
      })
    }
  }
}
