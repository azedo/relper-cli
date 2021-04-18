# Relper CLI

Command-line interface to help/assist with the release process.

(\*_with some opinions_)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/relper-cli.svg)](https://npmjs.org/package/relper-cli)
[![Downloads/week](https://img.shields.io/npm/dw/relper-cli.svg)](https://npmjs.org/package/relper-cli)
[![License](https://img.shields.io/npm/l/relper-cli.svg)](https://github.com/azedo/relper-cli/blob/master/package.json)

<!-- toc -->

- [Relper CLI](#relper-cli)
  - [Usage](#usage)
  - [Commands](#commands)
    - [`relper help [COMMAND]`](#relper-help-command)
    - [`relper version:bump`](#relper-versionbump)
    - [`relper version:get`](#relper-versionget)
    <!-- tocstop -->

## Usage

<!-- usage -->

```sh-session
$ npm install -g relper
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

## Commands

<!-- commands -->

- [`relper help [COMMAND]`](#relper-help-command)
- [`relper version:bump`](#relper-versionbump)
- [`relper version:get`](#relper-versionget)

### `relper help [COMMAND]`

display help for relper

```bash
USAGE
  $ relper help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

### `relper version:bump`

bump the app version to the next major, minor or patch

```bash
USAGE
  $ relper version:bump

OPTIONS
  -h, --help             show CLI help
  -v, --version=version  new version
```

### `relper version:get`

show the current version of the app

```bash
USAGE
  $ relper version:get

OPTIONS
  -h, --help                   show CLI help
  -p, --folderPath=folderPath  the project's main folder
  -s, --silent                 return silent
```

<!-- commandsstop -->
