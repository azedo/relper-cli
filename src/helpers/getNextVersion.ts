import { exec } from 'child_process'
import * as util from 'util'

const execProm = util.promisify(exec)

/**
 * Get the next version from the branch name, if it exists.
 *
 * @function runShellCommand
 * @param {string} command - The shell command.
 * @param {function} cb - A callback function.
 */
async function runShellCommand(command: string) {
  let result

  try {
    result = await execProm(command)
  } catch (ex) {
    result = ex
  }

  return result
}

/**
 * Get the next version from the branch name, if it exists.
 *
 * @function getNextVersion
 * @return {object} The return object
 * @return {object.name} The version name
 * @return {object.type} The version type
 */
export default async function getNextVersion(): Promise<{ name?: string; type?: string }> {
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
    } else {
      return {}
    }
  })
}
