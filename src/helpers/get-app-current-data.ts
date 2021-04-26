import { readFileSync } from 'fs'
import pkgDir from 'pkg-dir'

interface ReturnType {
  name: string
  version: string
  repository: string
  relper: {
    branches: {
      main: string
      develop?: string
      release?: string
      hotfix?: string
    }
  }
}

/**
 * Get the current version from the package.json file
 *
 * @param {string} folderPath The root dir of this codebase
 * @return {ReturnType | undefined} The current app version or undefined if not found
 */
export default function getAppCurrentData(folderPath = './'): ReturnType | undefined {
  const fileName = 'package.json'

  try {
    const rootDir = pkgDir.sync(folderPath)
    const fileContents = readFileSync(`${rootDir}/${fileName}`, { encoding: 'utf-8' })
    const { name, version, repository, relper } = JSON.parse(fileContents)

    return {
      name,
      version,
      repository,
      relper,
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`There's no file ${fileName} in the folder ${folderPath}`)
    }
  }
}
