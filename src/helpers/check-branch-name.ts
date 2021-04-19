import runShellCommand from '../helpers/run-shell-command'
import getAppCurrentData from '../helpers/get-app-current-data'

/**
 * Check if the current branch is main or release/hotfix
 *
 * @returns {boolean} True or False in case the current branch is not the main
 */
export default async function checkBranchName(): Promise<{ main: () => boolean; release: () => boolean }> {
  let branchName: string
  const mainBranch = getAppCurrentData()?.relper.branches.main || 'main'
  const releaseBranch = getAppCurrentData()?.relper.branches.release || 'release'
  const hotfixBranch = getAppCurrentData()?.relper.branches.hotfix || 'hotfix'

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
    if (branchName === mainBranch) {
      return true
    }

    return false
  }

  const release = () => {
    if (branchName.includes(releaseBranch) || branchName.includes(hotfixBranch)) {
      return true
    }

    return false
  }

  return {
    main,
    release,
  }
}
