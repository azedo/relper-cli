import { exec } from 'child_process'
import * as util from 'util'

const execProm = util.promisify(exec)

interface ReturnType {
  stdout: string
  stderr: string
  error: string
}

/**
 * Get the next version from the branch name, if it exists.
 *
 * @function runShellCommand
 * @param {string} command The shell command.
 * @param {function} cb A callback function.
 * @returns {Promise} Return The promise
 */
async function runShellCommand(command: string): Promise<ReturnType> {
  let result

  try {
    result = await execProm(command)
  } catch (error) {
    result = error
  }

  return result
}

export default runShellCommand
