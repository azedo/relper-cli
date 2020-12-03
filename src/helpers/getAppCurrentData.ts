import * as fs from 'fs'

import rootDir from './root'

interface ReturnType {
  name: string
  version: string
}

/**
 * Get the current version from the package.json file
 *
 * @function getAppCurrentData
 * @return {ReturnType | undefined} The current app version or undefined if not found
 */
export default function getAppCurrentData(folderPath = rootDir): ReturnType | undefined {
  const fileName = 'package.json'

  try {
    const readFile = fs.readFileSync(`${folderPath}/${fileName}`, { encoding: 'utf-8' })
    const { name, version } = JSON.parse(readFile)

    const appData = {
      name,
      version,
    }

    return appData
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`There's no file ${fileName} in the folder ${folderPath}`)
    }
  }
}
