import { Command, flags } from '@oclif/command'
import { readFileSync, writeFileSync } from 'fs'
import inquirer from 'inquirer'

import ConfigType from '../../types/config-type'
import getAppCurrentData from '../../helpers/get-app-current-data'
import rootDir from '../../helpers/root-dir'
import chalk from 'chalk'
import log, { LogStatus } from '../../helpers/log-messages'

interface InteractiveAnswers {
  mainBranch: string
  developConfirm: boolean
  developBranch: string
  releaseConfirm: boolean
  releaseBranch: string
  hotfixConfirm: boolean
  hotfixBranch: string
}

export default class CreateConfig extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with no value (-r, --replace)
    replace: flags.boolean({ char: 'r', description: 'replace relper config' }),
    // flag with no value (-f, --force) that depends on '--replace'
    force: flags.boolean({ char: 'f', description: 'force replace action', dependsOn: ['replace'] }),
    // flag with no value (-s, --silent)
    silent: flags.boolean({ char: 's', description: "don't show any logs", exclusive: ['interactive'] }),
    // flag with no value (-i, --interactive)
    interactive: flags.boolean({ char: 'i', description: 'interactive config creator' }),
  }

  private logger(message: string, status: LogStatus) {
    const { flags: flag } = this.parse(CreateConfig)

    if (!flag.silent) {
      log(message, status)
    }
  }

  private basicConfig(): ConfigType {
    return {
      branches: {
        main: 'main',
        develop: 'develop',
        release: 'release',
        hotfix: 'hotfix',
      },
    }
  }

  private addConfig(content?: ConfigType) {
    const { flags: flag } = this.parse(CreateConfig)
    const filePath = `${rootDir}/package.json`
    const originalFile = readFileSync(filePath, { encoding: 'utf-8' })
    const parsedFile = JSON.parse(originalFile)

    parsedFile.relper = content || this.basicConfig()

    this.log('')
    this.log(parsedFile.relper)
    this.log('')

    if (flag.replace) this.logger('Relper configs replaced', 'success')
    if ((flag.interactive && !flag.replace) || !flag.replace) this.logger('Relper configs created', 'success')

    writeFileSync(filePath, JSON.stringify(parsedFile, null, 2), { encoding: 'utf-8' })
  }

  private interactiveQuestions() {
    const interactiveConfigQuestions = [
      {
        type: 'input',
        name: 'mainBranch',
        message: `What is your ${chalk.underline`main`} branch's name?`,
        default: 'main',
      },
      {
        type: 'confirm',
        name: 'developConfirm',
        message: `Are you going to use ${chalk.underline`develop`} branches (git branching strategy)`,
        default: true,
      },
      {
        type: 'input',
        name: 'developBranch',
        message: `What is your ${chalk.underline`develop`} branch's name?`,
        default: 'develop',
        when: function (answers: InteractiveAnswers) {
          return answers.developConfirm
        },
      },
      {
        type: 'confirm',
        name: 'releaseConfirm',
        message: `Are you going to use ${chalk.underline`release`} branches (git branching strategy)`,
        default: true,
      },
      {
        type: 'input',
        name: 'releaseBranch',
        message: `What is your ${chalk.underline`release`} branch's name?`,
        default: 'release',
        when: function (answers: InteractiveAnswers) {
          return answers.releaseConfirm
        },
      },
      {
        type: 'confirm',
        name: 'hotfixConfirm',
        message: `Are you going to use ${chalk.underline`hotfix`} branches (git branching strategy)`,
        default: true,
      },
      {
        type: 'input',
        name: 'hotfixBranch',
        message: `What is your ${chalk.underline`hotfix`} branch's name?`,
        default: 'release',
        when: function (answers: InteractiveAnswers) {
          return answers.hotfixConfirm
        },
      },
    ]

    inquirer.prompt(interactiveConfigQuestions).then((answers: InteractiveAnswers) => {
      const result: ConfigType = { branches: { main: answers.mainBranch } }

      if (answers.developConfirm) result.branches.develop = answers.developBranch
      if (answers.releaseConfirm) result.branches.release = answers.releaseBranch
      if (answers.hotfixConfirm) result.branches.hotfix = answers.hotfixBranch

      this.addConfig(result)
    })
  }

  async run(): Promise<void> {
    const { flags: flag } = this.parse(CreateConfig)
    const appData = getAppCurrentData()
    const replaceConfigQuestions = [
      {
        type: 'confirm',
        name: 'replaceConfigWarning',
        message: `${chalk.red
          .inverse` WARNING! `} You are about to replace your existing ${chalk.underline`relper configs`}. Would you like to proceed?`,
      },
    ]

    // Force replace the existing file
    if (flag.force) {
      return this.addConfig()
    }

    // If there's a config already and the user used the `-r` flag, prompt them to make sure they know what they are doing
    if (appData?.relper && flag.replace) {
      return inquirer.prompt(replaceConfigQuestions).then((answers: { replaceConfigWarning: boolean }) => {
        if (answers.replaceConfigWarning && flag.interactive) {
          return this.interactiveQuestions()
        }

        if (answers.replaceConfigWarning) {
          return this.addConfig()
        }
      })
    }

    if (appData?.relper) {
      return this.logger(
        'You already have a relper config in your package.json file! If you want to replace it, use the flag `--replace` to do so.',
        'error'
      )
    }

    if (flag.interactive) {
      return this.interactiveQuestions()
    }

    return this.addConfig()
  }
}
