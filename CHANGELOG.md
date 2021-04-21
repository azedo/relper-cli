# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### To Add

- Sonar cloud integration to the project

### To Change

- Improve sonar cloud code smells score

### To Remove

### To Fix

## [0.2.0] - 2021-04-20

### Added

- Add create:changelog command
- Add create:config command
- Add initial unreleased link with the repository's name in CHANGELOG.md file

### Changed

- Refactor a couple of files
- Add a check for changelog not updated (no changes/additions/etc were added)
- Update `check-changelog` to throw the correct errors when no changes were found and refactor it to use the `runShellCommand` async helper

### Fixed

- Fix the `update-changelog` function to not add version blocks when there are none

## [0.1.0] - 2021-04-19

### Added

- Create helper functions for running shell commands and logging
- Add a CHANGELOG.md file

### Changed

- Update README, TODO and other configs
- Update the `version:get` command
- Update `get-next-version` and `get-app-current-data` helpers

## [0.0.1] - 2021-04-16

### Added

- Very basic starter code for the CLI. (Not functional yet!)

[unreleased]: https://github.com/azedo/relper-cli/compare/v0.2.0...main
[0.2.0]: https://github.com/azedo/relper-cli/releases/tag/v0.2.0
[0.1.0]: https://github.com/azedo/relper-cli/releases/tag/v0.1.0
[0.0.1]: https://github.com/azedo/relper-cli/releases/tag/v0.0.1
