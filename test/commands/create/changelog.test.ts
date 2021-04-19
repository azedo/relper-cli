import { expect, test } from '@oclif/test'

describe('create:changelog', () => {
  test
    .stdout()
    .command(['create:changelog'])
    .it('runs hello', (ctx) => {
      expect(ctx.stdout).to.contain('hello world')
    })

  test
    .stdout()
    .command(['create:changelog', '--name', 'jeff'])
    .it('runs hello --name jeff', (ctx) => {
      expect(ctx.stdout).to.contain('hello jeff')
    })
})
