class LogUtility {
  constructor() {
    this.init_logging_constants = this.init_logging_constants.bind(this)
    this.config = this.config.bind(this)
  }

  config({ trace_level = 2, full_trace }) {
    this.config = { trace_level, full_trace }
    this.init_logging_constants()
  }

  init_logging_constants() {
    const self = this
    Object.defineProperty(global, '__stack', {
      get() {
        const orig = Error.prepareStackTrace
        Error.prepareStackTrace = function (_, _stack) {
          return _stack
        }
        const err = new Error()

        try {
          Error.captureStackTrace(err, arguments.callee)
        } catch (_err) {}

        const { stack } = err
        Error.prepareStackTrace = orig
        return stack
      },
    })

    Object.defineProperty(global, '__line', {
      get() {
        return __stack[self.config.trace_level].getLineNumber()
      },
    })

    Object.defineProperty(global, '__function', {
      get() {
        return __stack[self.config.trace_level].getFunctionName()
      },
    })

    Object.defineProperty(global, '__file', {
      get() {
        return __stack[self.config.trace_level].getFileName() || 'anonymous'
      },
    })


    Object.defineProperty(self, 'stack_calls', {
      get() {
        const calls = []
        if (self.config.full_trace) {
          __stack.forEach(call => calls.push({ line: call.getLineNumber(), func: call.getFunctionName(), file: call.getFileName() }))
        } else {
          const call = __stack[self.config.trace_level]
          calls.push({ line: call.getLineNumber(), func: call.getFunctionName(), file: call.getFileName() })
        }
        return calls
      },
    })
  }
}

module.exports = LogUtility
