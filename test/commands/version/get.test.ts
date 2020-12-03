import { expect, test } from '@oclif/test'

import getAppCurrentData from '../../../src/helpers/getAppCurrentData'
import getNextVersion from '../../../src/helpers/getNextVersion'

describe('version:get', () => {
  test
    .stdout()
    .command(['version:get'])
    .it('runs version:get', async (ctx) => {
      const nextVersion = await getNextVersion()
      const version = nextVersion.name ? nextVersion.name : getAppCurrentData()
      expect(ctx.stdout).to.includes(version)
    })

  test
    .stdout()
    .command(['version:get', '-s'])
    .it('runs version:get -s', (ctx) => {
      expect(ctx.stdout).to.be.empty
    })
})
