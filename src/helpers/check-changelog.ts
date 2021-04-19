import { exec } from 'child_process'
import { existsSync } from 'fs'

import log from '@helpers/log-messages'
import rootDir from '@helpers/root-dir'
import { ErrorEnums } from '../types/error-enums'

/**
 * Check if the CHANGELOG was updated.
 * This will only check if there were changes in the CHANGELOG file.
 * But it can't know (yet) what was changed.
 *
 * @returns {void} Since this is a logging function for the terminal, it doesn't return anything
 */
export default function checkChangelog(): void {
  // TODO Check if I can/should return anything here
  exec('git rev-parse --abbrev-ref HEAD', (error, stdout, stderr) => {
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
      // TODO: Command still doesn't exists! Uncomment when it's introduced!
      // log("If you'd like to use the RELPER CLI to add a CHANGELOG, type `relper create:changelog`", 'info')

      return ErrorEnums.ERROR_NO_CHANGELOG_FILE
    }

    // This will check if the branch is not your main branch (or develop, if you work with both)
    // TODO: Add a config where the user could define the main and develop branches names (or even the lack of a develop branch!)
    // TODO: Ask the user if the codebase uses gitflow strategy, or something similar (github, gitlab, oneflow -> https://medium.com/@patrickporto/4-branching-workflows-for-git-30d0aaee7bf)
    if (typeof stdout === 'string' && branchName !== 'develop' && branchName !== 'main') {
      // Run git command to check if CHANGELOG.md file had any changes
      exec(
        `{ git ls-files --others --exclude-standard ; git diff-index --name-only --diff-filter=d HEAD ; } | grep --regexp='[.]md$'`,
        (error2, stdout2, stderr2) => {
          if (error2) {
            // handle errors
            log('There was an error', 'error')
            log(error2, 'error')
            log(stderr2, 'error')
          }

          if (typeof stdout2 === 'string' && !stdout2.includes('CHANGELOG.md')) {
            log(
              'There were no changes found in the CHANGELOG file. You might want to add your changes there before merging it back...',
              'warning'
            )

            return ErrorEnums.ERROR_NO_CHANGELOG_UPDATES
          }
        }
      )
    }

    return true
  })
}
