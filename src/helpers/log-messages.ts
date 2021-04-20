import chalk from 'chalk'

export type LogStatus = 'info' | 'success' | 'error' | 'warning'

/**
 * Log messages function. Standardize the log messages in the terminal.
 *
 * @param {string} message The message to be logged
 * @param {Status} [status='info'] the type/status of the message
 * @returns {void} Since it's a logging function for the terminal, it doesn't return anything
 */
export default function log(message: unknown, status: LogStatus = 'info'): void {
  let logger = chalk.blue

  switch (status) {
    case 'success':
      logger = chalk.green
      break

    case 'error':
      logger = chalk.red
      break

    case 'warning':
      logger = chalk.keyword('orange')
      break
  }
  const string = logger(`[RELPER | ${chalk.inverse(' ' + status.toUpperCase() + ' ')}] ${message}`)

  console.log(string)
}
