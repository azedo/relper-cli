# List of commands/functions for the Relper CLI

## Things to have:
- show log for everything that is being done

- [x] `getAppVersion`
  - [x] get current app version from the release/hotfix branch name

- [x] `bumpVersion`
  - [x] check if the sent version is higher than the actual version (show warning, but allow)
  - [x] set the app version based on semver
  - [x] set the version based on the current version

- [x] `updatePackageFiles`
  - [x] check if files exist first (package.json and package-lock.json)
  - [x] update package.json file with the current version
  - [x] run `npm i` to install all dependencies and recreate package-lock.json file

- [ ] `updateReadme`
  - [ ] check if file exist first (README.md)
  - [ ] update the badge version number (if exists also!)

- [ ] `updateChangelog`
  - [ ] check if file exist first (CHANGELOG.md)
  - [ ] check for block with version
    - [ ] if it doesn't exist create one with some placeholder text
    - [ ] if it exists, but it's empty or has the placeholder text, throw an error
  - [ ] create link for the new version block
  - [ ] update the comparison link to check against the new version

- [ ] `getMasterFile`
  - [ ] get summary file in the cloud server
  - [ ] if there's none, return false

- [ ] `updateCoverage`
  - [ ] update cloud server with new/updated coverage summary file if it has increased from current one

- [ ] `getCoverageReport`
  - [ ] compare coverage values

- [ ] `checkCoverage`
  - [ ] check coverage -> main file
