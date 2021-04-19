import runShellCommand from '@helpers/run-shell-command'
import getAppCurrentData from '@helpers/get-app-current-data'

/**
 * Check if the current branch is main or release/hotfix
 *
 * @returns {boolean} True or False in case the current branch is not the main
 */
export default async function checkBranchName(): Promise<{ main: () => boolean; release: () => boolean }> {
  let branchName: string
  const mainBranch = getAppCurrentData()?.relper.branches.main || 'main'

  await runShellCommand('git rev-parse --abbrev-ref HEAD').then((res) => {
    if (!res) {
      throw new Error('Something went wrong, check your code.')
    }

    const { stdout, stderr } = res

    if (stderr) {
      throw new Error(stderr)
    }

    // This trim() is here because the stdout comes with a trailing \n
    branchName = stdout.trim()
  })

  const main = () => {
    // TODO Get the main branch name from config, default to `main`
    if (branchName === mainBranch) {
      return true
    }

    return false
  }

  const release = () => {
    // TODO Get the release/hotfix branch names from config, default to `release` and `hotfix`
    if (branchName.includes('release') || branchName.includes('hotfix')) {
      return true
    }

    return false
  }

  return {
    main,
    release,
  }
}
