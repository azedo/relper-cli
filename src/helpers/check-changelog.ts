import { existsSync } from 'fs'

import log from '../helpers/log-messages'
import rootDir from '../helpers/root-dir'
import { ErrorEnums } from '../types/error-enums'
import runShellCommand from '../helpers/run-shell-command'

/**
 * Check if the CHANGELOG was updated.
 * This will only check if there were changes in the CHANGELOG file.
 * But it can't know (yet) what was changed.
 *
 * @param {boolean} blocking If this helper should return a blocking message
 * @returns {void} Since this is a logging function for the terminal, it doesn't return anything
 */
export default async function checkChangelog(blocking = false): Promise<boolean | string> {
  let result: boolean | string = ErrorEnums.ERROR_NO_CHANGELOG_UPDATES

  // TODO Check if I can/should return anything here
  await runShellCommand('git rev-parse --abbrev-ref HEAD').then(async (res) => {
    const { error, stdout, stderr } = res

    if (error) {
      // handle errors
      log('There was an error', 'error')
      log(error, 'error')
      log(stderr, 'error')
    }

    const changelogPath = `${rootDir}/CHANGELOG.md`
    const branchName = stdout.trim()

    if (!existsSync(changelogPath)) {
      log("There isn't a CHANGELOG in this repository!", 'error')
      // Tell the user how to add a one via the CLI
      log("If you'd like to use the RELPER CLI to add a CHANGELOG, type `relper create:changelog`", 'info')

      result = ErrorEnums.ERROR_NO_CHANGELOG_FILE
    }

    // This will check if the branch is not your main branch (or develop, if you work with both)
    // TODO: Add a config where the user could define the main and develop branches names (or even the lack of a develop branch!)
    // TODO: Ask the user if the codebase uses gitflow strategy, or something similar (github, gitlab, oneflow -> https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf)
    if (typeof stdout === 'string' && branchName !== 'develop' && branchName !== 'main') {
      // Run git command to check if CHANGELOG.md file had any changes
      await runShellCommand(
        `{ git ls-files --others --exclude-standard ; git diff-index --name-only --diff-filter=d HEAD ; } | grep --regexp='[.]md$'`
      ).then((res) => {
        const { error: error2, stdout: stdout2, stderr: stderr2 } = res

        if (error2) {
          // handle errors
          log('There was an error', 'error')
          log(error2, 'error')
          log(stderr2, 'error')
        }

        if (stdout2.includes('CHANGELOG.md')) {
          result = true
        }

        if (!blocking && !stdout2.includes('CHANGELOG.md')) {
          log(
            'There were no changes found in the CHANGELOG file. You might want to add your changes there before merging it back...',
            'warning'
          )
        }
      })
    }

    result = true
  })

  return result
}
