import fs from 'fs'
import { exec } from 'child_process'
import * as util from 'util'

import rootDir from './root'

const execProm = util.promisify(exec)

/**
 * Update the version in the package.json file.
 *
 * @function updatePackageFile
 * @param {string} version - The version to be updated.
 * @return {void} Returns silent
 */
export default function updatePackageFile(version: string): void {
  const packageJsonFile = fs.readFileSync(`${rootDir}/package.json`, { encoding: 'utf-8' })
  const replaceJLFData = packageJsonFile.replace(/"version": "\d+.\d+.\d+",/, `"version": "${version}",`)

  try {
    fs.writeFileSync('./package.json', replaceJLFData)
  } catch (error) {
    console.error(error)
  }
}

/**
 * Remove package-lock.json file, if present.
 *
 * @function cleanUp
 * @return {void} Returns silent unless there's an error
 */
export function cleanUp(): void {
  const file = `${rootDir}/package-lock.json`

  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file)
    } catch (error) {
      console.error(error)
    }
  }
}

/**
 * Install npm dependencies in the package.json file.
 *
 * @function installDependencies
 * @return {void} Returns silent unless there's an error
 */
export async function installDependencies(): Promise<void> {
  try {
    await execProm('npm i')
  } catch (error) {
    console.error(error)
  }
}
