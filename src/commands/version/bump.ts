import { Command, flags } from '@oclif/command'
import * as inquirer from 'inquirer'
import chalk from 'chalk'
import Listr from 'listr'

import getAppCurrentData from '../../helpers/get-app-current-data'
import updatePackageFile, { cleanUp, installDependencies } from '../../helpers/update-package-file'
import updateChangelog from '../../helpers/update-changelog'
import updateReadme from '../../helpers/update-readme'
import checkChangelog from '../../helpers/check-changelog'
import log from '../../helpers/log-messages'
import { ErrorEnums } from '../../types/error-enums'

type Semver = 'major' | 'minor' | 'patch'

interface CheckVersionsAnswers {
  currentVersionWarning: boolean
  otherVersion: string
}

interface OtherVersionQuestion {
  type: string
  name: string
  message: string
  validate: (value: string) => true | string
}

export default class VersionBump extends Command {
  static description = 'bump the app version to the next major, minor or patch'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-v, --version)
    version: flags.string({ char: 'v', description: 'new version' }),
  }

  private startLog = (appName?: string, version?: string): void => {
    if (appName && version) {
      this.log('')
      this.log(`Bumping the version of the app ${chalk.magenta(`${appName} (${version})`)}`)
      this.log('')
    }
  }

  private doneLog = (version: string): void => {
    this.log('')
    log(`Done! New version is ${chalk.magenta(version)}`, 'success')
  }

  private sameVersionLog = (version: string): void =>
    log(
      `Nothing to do here! Try setting a different version - ${chalk.magenta('current version ' + version)}`,
      'warning'
    )

  private actions = async (version: string): Promise<void> => {
    const tasks = new Listr([
      {
        title: 'Update package version',
        task: () => updatePackageFile(version),
      },
      {
        title: 'Cleanup',
        task: () => cleanUp(),
      },
      {
        title: 'Install dependencies',
        task: () => installDependencies(),
      },
      {
        title: 'Update CHANGELOG',
        task: () => {
          updateChangelog(version)
        },
      },
      {
        title: 'Update README',
        task: () => {
          updateReadme(version)
        },
      },
    ])

    tasks
      .run()
      .then(() => this.doneLog(version))
      .catch((error: Error) => {
        console.error(error)
      })
  }

  private showVersionBumped = (version: Semver): string | undefined => {
    const appData = getAppCurrentData()
    const tempVer = appData?.version?.split('.') || ''

    switch (version) {
      case 'major':
        return `${Number(tempVer[0]) + 1}.${tempVer[1]}.${tempVer[2]}`

      case 'minor':
        return `${tempVer[0]}.${Number(tempVer[1]) + 1}.${tempVer[2]}`

      case 'patch':
        return `${tempVer[0]}.${tempVer[1]}.${Number(tempVer[2]) + 1}`

      default:
        break
    }
  }

  private confirmLowerVersion = (version: string, otherVersionQuestion: OtherVersionQuestion): void => {
    const appData = getAppCurrentData()

    const checkVersionQuestions = [
      {
        type: 'confirm',
        name: 'currentVersionWarning',
        message: chalk`The version you are trying to set is lower than the current {blue [${appData?.version}]}. Would you like to proceed?`,
      },
      {
        ...otherVersionQuestion,
        when: (answers: CheckVersionsAnswers) => !answers.currentVersionWarning,
      },
    ]

    inquirer.prompt(checkVersionQuestions).then((answers) => {
      if (
        !answers.currentVersionWarning &&
        answers.otherVersion &&
        typeof appData?.version !== 'undefined' &&
        answers.otherVersion < appData?.version
      ) {
        this.confirmLowerVersion(answers.otherVersion, otherVersionQuestion)
      } else if (
        !answers.currentVersionWarning &&
        answers.otherVersion &&
        typeof appData?.version !== 'undefined' &&
        answers.otherVersion > appData?.version
      ) {
        this.actions(answers.otherVersion)
      } else {
        this.actions(version)
      }
    })
  }

  // TODO: Improve cognitive complexity score!
  async run(): Promise<string | boolean | void> {
    const { flags: flag } = this.parse(VersionBump)
    const appData = getAppCurrentData()
    const checkForUpdates = await checkChangelog(true)

    if (!checkForUpdates || checkForUpdates === ErrorEnums.ERROR_NO_CHANGELOG_UPDATES) {
      return log('There are no changes in the CHANGELOG! You need to update it before using this command.', 'error')
    }

    const otherVersionQuestion = {
      type: 'input',
      name: 'otherVersion',
      message: `Enter a version number ${chalk.blue('x.x.x')} =>`,
      validate: function (value: string) {
        const pass = value.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+)?$/i)
        if (pass) {
          return true
        }

        return 'Please enter a valid semver version'
      },
    }

    // Start program
    if (flag.version && typeof appData?.version !== 'undefined' && flag.version === appData.version) {
      this.sameVersionLog(flag.version)
    } else {
      this.startLog(appData?.name, appData?.version)
    }

    // Check version from flag
    if (flag.version && typeof appData?.version !== 'undefined' && flag.version < appData.version) {
      this.confirmLowerVersion(flag.version, otherVersionQuestion)
    } else if (flag.version && typeof appData?.version !== 'undefined' && flag.version > appData.version) {
      this.actions(flag.version)
    }

    if (!flag.version) {
      const questions = [
        {
          type: 'list',
          name: 'nextVersion',
          message: `Select next version, or specify one.`,
          choices: [
            {
              name: `major ${chalk.gray(this.showVersionBumped('major'))}`,
              value: this.showVersionBumped('major'),
            },
            {
              name: `minor ${chalk.gray(this.showVersionBumped('minor'))}`,
              value: this.showVersionBumped('minor'),
            },
            {
              name: `patch ${chalk.gray(this.showVersionBumped('patch'))}`,
              value: this.showVersionBumped('patch'),
            },
            new inquirer.Separator(),
            {
              name: `Other ${chalk.gray('Specify one')}`,
              value: 'other',
            },
          ],
        },
      ]

      inquirer.prompt(questions).then((listAnswers): void => {
        if (listAnswers.nextVersion === 'other') {
          inquirer.prompt([otherVersionQuestion]).then((finalAnswer): void => {
            if (
              finalAnswer.otherVersion &&
              typeof appData?.version !== 'undefined' &&
              finalAnswer.otherVersion < appData.version
            ) {
              this.confirmLowerVersion(finalAnswer.otherVersion, otherVersionQuestion)
            } else if (
              finalAnswer.otherVersion &&
              typeof appData?.version !== 'undefined' &&
              finalAnswer.otherVersion > appData.version
            ) {
              updatePackageFile(finalAnswer.otherVersion)
              this.doneLog(finalAnswer.otherVersion)
            }
          })
        } else {
          this.actions(listAnswers.nextVersion)
        }
      })
    }
  }
}
