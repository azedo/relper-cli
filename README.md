# Relper CLI

Command-line interface to help/assist with the release process.

(\*_with some opinions_)

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/relper-cli.svg)](https://npmjs.org/package/relper-cli)
[![Downloads/week](https://img.shields.io/npm/dw/relper-cli.svg)](https://npmjs.org/package/relper-cli)
[![License](https://img.shields.io/npm/l/relper-cli.svg)](https://github.com/azedo/relper-cli/blob/master/package.json)

<!-- toc -->
* [Relper CLI](#relper-cli)
<!-- tocstop -->

## Usage

<!-- usage -->
```sh-session
$ npm install -g relper-cli
$ relper COMMAND
running command...
$ relper (-v|--version|version)
relper-cli/0.1.0 darwin-x64 node-v12.18.3
$ relper --help [COMMAND]
USAGE
  $ relper COMMAND
...
```
<!-- usagestop -->

## Commands

<!-- commands -->
* [`relper create:changelog`](#relper-createchangelog)
* [`relper create:config`](#relper-createconfig)
* [`relper help [COMMAND]`](#relper-help-command)
* [`relper version:bump`](#relper-versionbump)
* [`relper version:get`](#relper-versionget)

## `relper create:changelog`

```
USAGE
  $ relper create:changelog

OPTIONS
  -f, --force    force replace action
  -h, --help     show CLI help
  -r, --replace  replace CHANGELOG
  -s, --silent   don't show any logs
```

_See code: [src/commands/create/changelog.ts](https://github.com/azedo/relper-cli/blob/v0.1.0/src/commands/create/changelog.ts)_

## `relper create:config`

```
USAGE
  $ relper create:config

OPTIONS
  -f, --force        force replace action
  -h, --help         show CLI help
  -i, --interactive  interactive config creator
  -r, --replace      replace relper config
  -s, --silent       don't show any logs
```

_See code: [src/commands/create/config.ts](https://github.com/azedo/relper-cli/blob/v0.1.0/src/commands/create/config.ts)_

## `relper help [COMMAND]`

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

```
USAGE
  $ relper version:bump

OPTIONS
  -h, --help             show CLI help
  -v, --version=version  new version
```

_See code: [src/commands/version/bump.ts](https://github.com/azedo/relper-cli/blob/v0.1.0/src/commands/version/bump.ts)_

## `relper version:get`

```
USAGE
  $ relper version:get

OPTIONS
  -h, --help                   show CLI help
  -p, --folderPath=folderPath  the project's main folder
  -s, --silent                 return silent
```

_See code: [src/commands/version/get.ts](https://github.com/azedo/relper-cli/blob/v0.1.0/src/commands/version/get.ts)_
<!-- commandsstop -->
