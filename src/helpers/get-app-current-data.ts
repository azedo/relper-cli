import { readFileSync } from 'fs'
import rootDir from './root'

interface ReturnType {
  name: string
  version: string
  repository: string
}

/**
 * Get the current version from the package.json file
 *
 * @param {string} folderPath The root dir of the codebase
 * @return {ReturnType | undefined} The current app version or undefined if not found
 */
export default function getAppCurrentData(folderPath: string = rootDir): ReturnType | undefined {
  const fileName = 'package.json'

  try {
    const readFile = readFileSync(`${folderPath}/${fileName}`, { encoding: 'utf-8' })
    const { name, version, repository } = JSON.parse(readFile)

    return {
      name,
      version,
      repository,
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`There's no file ${fileName} in the folder ${folderPath}`)
    }
  }
}
