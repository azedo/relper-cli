import runShellCommand from '@helpers/run-shell-command'

interface NextVersionType {
  name?: string
  type?: string
}

/**
 * Get the next version from the branch name, if it exists.
 *
 * @function getNextVersion
 * @return {object} The return object
 * @return {object.name} The version name
 * @return {object.type} The version type
 */
export default async function getNextVersion(): Promise<NextVersionType> {
  return runShellCommand('git rev-parse --abbrev-ref HEAD').then((res) => {
    if (!res) {
      throw new Error('Something went wrong, check your code.')
    }

    const { stdout, stderr } = res

    if (stderr) {
      throw new Error(stderr)
    }

    const branch = {
      name: (stdout.split('/')[1] || stdout.split('/')[0]).trim(),
      type: stdout.split('/')[0],
    }

    if (branch.type.includes('release') || branch.type.includes('hotfix')) {
      return branch
    }

    return {}
  })
}
