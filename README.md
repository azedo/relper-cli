# Release helper script

Release helper cli to help/assist with proper release flow.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/release-helper.svg)](https://npmjs.org/package/release-helper)
[![Downloads/week](https://img.shields.io/npm/dw/release-helper.svg)](https://npmjs.org/package/release-helper)
[![License](https://img.shields.io/npm/l/release-helper.svg)](https://github.com/scripts/release-helper/blob/master/package.json)

<!-- toc -->
* [Release helper script](#release-helper-script)
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
release-helper/0.0.0 darwin-x64 node-v10.20.1
$ relper --help [COMMAND]
USAGE
  $ relper COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`relper help [COMMAND]`](#relper-help-command)
* [`relper version:bump`](#relper-versionbump)
* [`relper version:get`](#relper-versionget)

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `relper version:bump`

bump the app version to the next major, minor or patch

```
USAGE
  $ relper version:bump

OPTIONS
  -h, --help             show CLI help
  -v, --version=version  new version
```

## `relper version:get`

show the current version of the app

```
USAGE
  $ relper version:get

OPTIONS
  -h, --help                   show CLI help
  -p, --folderPath=folderPath  the project's main folder
  -s, --silent                 return silent
```
<!-- commandsstop -->
