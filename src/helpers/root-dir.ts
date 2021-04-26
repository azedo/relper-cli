import * as path from 'path'

/**
 * Get the absolute path of this project's folder.
 *
 * @function rootPath
 * @return {string} The absolute path to this project folder
 */
function rootPath(): string {
  const getBinPath = path.dirname(require.main?.filename || process.mainModule?.filename || '')

  return path.join(getBinPath, '..')
}

export default rootPath()
