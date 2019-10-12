const winston = require('winston');

const { format } = winston;

let logger
class LogService {
  constructor({ log_utility }) {
    this.log = this.log.bind(this)

    this.log_utility = log_utility
    this.log_utility.config({
      trace_level: 3, full_trace: false
    })
    if (!logger) logger = this.create_logger()
  }

  create_logger() {
    return winston.createLogger({
      format: format.combine(format.label({ label: 'nxkb' }), format.timestamp(), winston.format.json()),
      defaultMeta: { service: 'nxkb' },
      transports: [ new winston.transports.Console() ]
    })
  }

  config({ level, transports }) {
    logger.config({ level, transports });
  }

  log({ level = 'info', message }) {
    logger.log({
      level,
      trace: this.log_utility.stack_calls,
      message
    })
  }
}


module.exports = LogService;
