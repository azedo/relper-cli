import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'

import rootDir from './root'
import runShellCommand from '@helpers/run-shell-command'

/**
 * Update the version in the package.json file.
 *
 * @function updatePackageFile
 * @param {string} version - The version to be updated.
 * @return {void} Returns silent
 */
export default function updatePackageFile(version: string): void {
  const packageJsonFile = readFileSync(`${rootDir}/package.json`, { encoding: 'utf-8' })
  const replaceJLFData = packageJsonFile.replace(/"version": "\d+.\d+.\d+",/, `"version": "${version}",`)

  try {
    writeFileSync('./package.json', replaceJLFData)
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

  if (existsSync(file)) {
    try {
      unlinkSync(file)
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
  runShellCommand('npm i').then((res) => {
    if (!res) {
      throw new Error('Something went wrong, check your code.')
    }

    const { stderr } = res

    if (stderr) {
      throw new Error(stderr)
    }
  })
}
