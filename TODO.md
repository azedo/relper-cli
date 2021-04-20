# List of future things to have (or ideas)

- [x] `getAppVersion`

  - [x] get current app version from the release/hotfix branch name

- [x] `bumpVersion`

  - [x] check if the sent version is higher than the actual version (show warning, but allow)
  - [x] set the app version based on semver
  - [x] set the version based on the current version

- [ ] `updatePackageFiles`

  - [x] check if files exist first (package.json and package-lock.json)
  - [x] update package.json file with the current version
  - [x] run `npm i` to install all dependencies and recreate package-lock.json file
  - [ ] pin dependencies in `package.json` - as an optional command
  - [ ] create `relper` config in `package.json` - as an optional command

- [ ] `updateReadme`

  - [ ] check if file exist first (README.md)
  - [ ] update the badge version number (if exists also!) - this is possible to get from github repo!

- [ ] `updateChangelog`

  - [x] check if file exist first (CHANGELOG.md)
    - [ ] if it doesn't exists, offer to create one
  - [x] check for block with version
    - [x] if it doesn't exist create one with the text from the `UNRELEASED` block
    - [ ] if it exists, it's not empty and there's text in the `UNRELEASED` block, as if it should be updated (not replaced, but added to the existing text)
  - [x] create link for the new version block
  - [x] update the comparison link to check against the new version

- [ ] show log for everything that is being done

- [ ] add tests

  - [ ] command version:bump
  - [ ] command version:get
  - [ ] hook check-for-configs

- [x] publish `RELPER` to NPM

- [ ] Add a general help command?

  - [ ] Add/share links for git branching strategy and why you should/shouldn't adopt one

- [x] `create:changelog`
- [x] `create:config`
