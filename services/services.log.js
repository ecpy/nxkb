const winston = require('winston')

const { format } = winston

let logger
class LogService {
  constructor() {
    if (!logger) logger = this.create_logger()
    this.logger = logger
  }

  create_logger() {
    return winston.createLogger({
      format: format.combine(
        format.label({ label: 'i3-services' }),
        format.timestamp(),
        winston.format.json(),
      ),
      defaultMeta: { service: 'i3' },
      transports: [new winston.transports.Console()],
    })
  }

  config({ level, transports }) {
    const { logger } = this
    logger.config({ level, transports })
  }

  log({ level = 'info', message }) {
    const { logger } = this
    logger.log({
      level,
      message,
    })
  }
}

module.exports = LogService
