import { readFileSync, writeFileSync } from 'fs'

import rootDir from './root-dir'

/**
 * Update the README
 *
 * This method considers that the README file is always present. If it's not, we don't try to update it,
 * but every repository should always have a README as good practice!
 *
 * We might help the user to create one in a future version, but for now we don't do anything else
 * if the README file doesn't exists.
 *
 * @param {string} version The version that the codebase will be updated to (new version)
 * @return {void} Returns void
 */
export default function updateReadme(version: string): void {
  const fileName = 'README.md'
  const filePath = `${rootDir}/${fileName}`

  // TODO Ideas for future implementations:
  // 1. If README doesn't exists, should we create one with very simple defaults? Name of project, brief description and the app version badge
  // 2. If badge link/image doesn't exist, should we add one?
  // 2.1. If we are going to add one, should we add it with defaults? Name (text in badge), color and repo releases link.
  //
  // NOTE: All these defaults that I mentioned before could come from the package.json file
  //       If the user doesn't want to user `https://badgen.net/` or `https://shields.io/`, or uses a private repo, they might need to include a static badge for the `app version` (also, this name should be customizable - how?)

  try {
    const readFile = readFileSync(filePath, { encoding: 'utf-8' })

    if (!readFile.includes(`img.shields.io/badge/App%20version-v${version}`)) {
      const replaceData = readFile.replace(
        /img.shields.io\/badge\/App%20version-v\d+.\d+.\d+/,
        `img.shields.io/badge/App%20version-v${version}`
      )

      writeFileSync(filePath, replaceData)
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`There's no file ${fileName} in the folder ${rootDir}`)
    }
  }
}
