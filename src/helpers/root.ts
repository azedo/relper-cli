const path = require('path')

function RootPath() {
  const getBinPath = path.dirname(require.main?.filename || process.mainModule?.filename)

  return path.join(getBinPath, '..')
}

export default RootPath()
