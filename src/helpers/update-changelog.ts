import { readFileSync, writeFileSync } from 'fs'
// import { exec } from 'child_process'
// import ora from 'ora'

import getCurrentDate from '../helpers/get-current-date'
import getAppCurrentData from '../helpers/get-app-current-data'
// import log from '../helpers/log-messages'
// import rootDir from '../helpers/root-dir'

interface ContentType {
  add: string[]
  change: string[]
  remove: string[]
  fix: string[]
}

/**
 * Create a new version block based on the data from the UNRELEASED block (if any)
 *
 * @param {ContentType} content The content of the new block
 * @param {string} version The new version that is being created
 * @returns {string[]} The new block in array format
 */
function createNewVersionBlock(content: ContentType, version: string): string[] {
  const block = []

  // Add block title with current date
  block.push(`## [${version}] - ${getCurrentDate()}`, '')
  // Add `Added` block
  if (content.add.length > 0) {
    block.push('### Added', '', ...content.add, '')
  }
  // Add `Changed` block
  if (content.change.length > 0) {
    block.push('### Changed', '', ...content.change, '')
  }
  // Add `Removed` block
  if (content.remove.length > 0) {
    block.push('### Removed', '', ...content.remove, '')
  }
  // Add `Fixed` block
  if (content.fix.length > 0) {
    block.push('### Fixed', '', ...content.fix, '')
  }

  return block
}

/**
 * Get the data from the UNRELEASED block
 *
 * @param {string[]} file The contents of the CHANGELOG
 * @return {[ContentType, number, number]} The new object containing the add, change, remove and fix keys (with their content in string[] format)
 */
function getUnreleasedBlock(file: string[]): [ContentType, number, number] {
  let isUnreleasedGroup = false
  let isAddedGroup = false
  let isChangedGroup = false
  let isRemovedGroup = false
  let isFixedGroup = false
  let unreleasedGroupLastIndex = 0 // TODO Check if this works!
  let unreleasedGroupStartIndex = 0 // TODO Check if this works!
  const groups: ContentType = { add: [], change: [], remove: [], fix: [] }

  const updateGroup = (key: keyof ContentType, isEndOfGroup: boolean, line: string) => {
    if (isEndOfGroup) {
      switch (key) {
        case 'add':
          isAddedGroup = false
          break

        case 'change':
          isChangedGroup = false
          break

        case 'remove':
          isRemovedGroup = false
          break

        case 'fix':
          isFixedGroup = false
          break
      }
    } else if (line !== '') {
      groups[key].push(line.trim())
    }
  }

  file.forEach((line, i) => {
    if (isUnreleasedGroup && line.startsWith('## ')) {
      isUnreleasedGroup = false
      unreleasedGroupLastIndex = i
    } else if (isUnreleasedGroup && isAddedGroup) {
      updateGroup('add', line.startsWith('### '), line)
    } else if (isUnreleasedGroup && isChangedGroup) {
      updateGroup('change', line.startsWith('### '), line)
    } else if (isUnreleasedGroup && isRemovedGroup) {
      updateGroup('remove', line.startsWith('### '), line)
    } else if (isUnreleasedGroup && isFixedGroup) {
      updateGroup('fix', line.startsWith('### '), line)
    }

    if (line.match(/^## \[Unreleased\]/)) {
      unreleasedGroupStartIndex = i
      isUnreleasedGroup = true
    } else if (line.startsWith('### To Add')) {
      isAddedGroup = true
    } else if (line.startsWith('### To Change')) {
      isChangedGroup = true
    } else if (line.startsWith('### To Remove')) {
      isRemovedGroup = true
    } else if (line.startsWith('### To Fix')) {
      isFixedGroup = true
    }
  })

  return [groups, unreleasedGroupLastIndex, unreleasedGroupStartIndex]
}

/**
 * Update the CHANGELOG
 *
 * @param {string} version The version that the codebase will be updated to (new version)
 * @returns {boolean | string} Returns void because we are updating a markdown file
 */
// TODO Add error codes to return type
export default function updateChangelog(version: string): boolean | string {
  // Check if current version in package.json exists in CHANGELOG
  // const spinner = ora('Checking CHANGELOG...').start()
  const appData = getAppCurrentData()
  const repositoryUrl = appData?.repository.replace('.git', '')
  const changelogFile = readFileSync('./CHANGELOG.md', { encoding: 'utf-8' })
  const changelogArray = changelogFile.split('\n')
  // let updatedText = 'CHANGELOG checked'
  let newCLFile = changelogFile

  if (!changelogFile.includes(`## [${version}]`)) {
    // spinner.text = "Adding latest version's block..."

    const unreleasedBlock = getUnreleasedBlock(changelogArray)

    // now we need to create the new block and add it to the file
    const newChanges = createNewVersionBlock(unreleasedBlock[0], version)
    const withBlankUnreleased = [
      '## [Unreleased]',
      '',
      '### To Add',
      '',
      '### To Change',
      '',
      '### To Remove',
      '',
      '### To Fix',
      '',
      ...newChanges,
    ]

    // TODO I changed the type for the index (was optional and now is mandatory!), check if this still works as expected!!
    changelogArray.splice(unreleasedBlock[1], 0, ...withBlankUnreleased)

    // TODO I changed the type for the index (was optional and now is mandatory!), check if this still works as expected!!
    // replace unreleased block with empty one
    changelogArray.splice(unreleasedBlock[2], unreleasedBlock[1] - unreleasedBlock[2])

    // console.log(unreleasedBlock[2], unreleasedBlock[1] - unreleasedBlock[2])

    newCLFile = changelogArray.join('\n')

    // spinner.text = "Latest version's block added!"
  }

  if (!changelogFile.includes(`[${version}]: https://`)) {
    // spinner.text = "Adding latest version's link..."

    // TODO For now, we are assuming that the repository where the codebase (that we are updating) is in github.
    //      We will add a configuration (or maybe a check on the repository url from package.json?) in the future
    //      Also, we need to make sure the url is formatted correctly and
    //      make sure that the version tags are formatted in the correct way (starting with a `v` - or not)
    //      One last thing that we need to consider is the main branch name! For now is set to `main`, but we should make this configurable

    const unreleasedLinkIndex = changelogArray.findIndex((el) => el.includes('[unreleased]: https://'))

    changelogArray.splice(unreleasedLinkIndex + 1, 0, `[${version}]: ${repositoryUrl}/releases/tag/v${version}`)

    newCLFile = changelogArray
      .join('\n')
      .replace(/\[unreleased\]: https:\/\/.*/, `[unreleased]: ${repositoryUrl}/compare/v${version}...main`)

    // spinner.text = "Latest version's link added!"
  }

  if (!changelogFile.includes(`## [${version}]`) || !changelogFile.includes(`[${version}]: https://`)) {
    writeFileSync('./CHANGELOG.md', newCLFile)
    // updatedText = 'CHANGELOG updated!'
  }

  if (!changelogFile.includes(`## [${version}]`) && !newCLFile.includes(`## [${version}] - `)) {
    // spinner.fail('You need to add your changes in the CHANGELOG file!')
    // process.exit(1)
    return 'ERROR_CHANGELOG_MISSING_CHANGES'
  }

  // spinner.succeed(updatedText)
  return true
}

// TODO Figure out where to put this code
// exec('git rev-parse --abbrev-ref HEAD', async (error, stdout, stderr) => {
//   if (error) {
//     // handle your error
//     console.log('There was an error', error, stderr)
//   }

//   if (typeof stdout === 'string' && (stdout.includes('release') || stdout.includes('hotfix'))) {
//     // Check if branch is named correctly! If not, throw an error and kill process
//     const branchRegex = /(release|hotfix)+\/(\d+\.\d+\.\d+)/
//     if (!stdout.match(branchRegex)) {
//       log(
//         `
//         Error: Your branch name is not following the correct pattern!
//                The name should be a version number e.g.: hotfix/0.0.0 or release/0.0.0
//                Please rename this branch or create a new one...`,
//         'error'
//       )

//       return 'ERROR_BRANCH_WRONG_NAMING_PATTERN'
//     }

//     // Initial log
//     log('This is a release/hotfix branch, starting house keeping tasks...', 'info')

//     // Get version number and update package.json file if needed
//     const releaseVersion = stdout.split('/')[1]
//     const appVersion = await getAppVersion(releaseVersion.trim())

//     // Update package-lock
//     await updatePackageLock(appVersion)

//     // Update README
//     await updateReadme(appVersion)

//     // Update CHANGELOG (we'll break the execution in this function if needed!)
//     await updateChangelog(appVersion)

//     // Check if any file was changed and stop the process
//     if (saveCount > 0) {
//       log('You need to commit the new changes before pushing again.', 'error')
//       // process.exit(1)
//       return 'ERROR_MUST_COMMIT_NEW_CHANGES'
//     }

//     // Log end
//     log('All done! ;)', 'success')
//     // process.exit(0)
//   }
// })
