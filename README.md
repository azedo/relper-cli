release-helper
==============

Release helper cli to help/assist with proper release flow.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/release-helper.svg)](https://npmjs.org/package/release-helper)
[![Downloads/week](https://img.shields.io/npm/dw/release-helper.svg)](https://npmjs.org/package/release-helper)
[![License](https://img.shields.io/npm/l/release-helper.svg)](https://github.com/scripts/release-helper/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g release-helper
$ relper COMMAND
running command...
$ relper (-v|--version|version)
release-helper/0.0.0 darwin-x64 node-v10.15.3
$ relper --help [COMMAND]
USAGE
  $ relper COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`relper bump-versions [FILE]`](#relper-bump-versions-file)
* [`relper hello [FILE]`](#relper-hello-file)
* [`relper help [COMMAND]`](#relper-help-command)
* [`relper version:bump [FILE]`](#relper-versionbump-file)

## `relper bump-versions [FILE]`

bump/change the app version in package.json

```
USAGE
  $ relper bump-versions [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ relper bump-version
```

_See code: [src/commands/bump-versions.ts](https://github.com/scripts/release-helper/blob/v0.0.0/src/commands/bump-versions.ts)_

## `relper hello [FILE]`

describe the command here

```
USAGE
  $ relper hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ relper hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/scripts/release-helper/blob/v0.0.0/src/commands/hello.ts)_

## `relper help [COMMAND]`

display help for relper

```
USAGE
  $ relper help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.1.0/src/commands/help.ts)_

## `relper version:bump [FILE]`

describe the command here

```
USAGE
  $ relper version:bump [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/version/bump.ts](https://github.com/scripts/release-helper/blob/v0.0.0/src/commands/version/bump.ts)_
<!-- commandsstop -->
