class NodeService {
  constructor() {
    this.exit_callbacks = []
    this.is_exit_callbacks_running = false

    this.start = this.start.bind(this)
  }

  start() {
    // listen to exit events

    const run_exit_callbacks = () => {
      if (this.is_exit_callbacks_running) return
      this.is_exit_callbacks_running = true

      function kill() {
        process.kill(process.pid, 'SIGKILL')
      }
      this.exit_callbacks.forEach(cb => cb(kill))
    }

    process.stdin.resume()

    process.on('exit', run_exit_callbacks)

    // catches ctrl+c event
    process.on('SIGINT', run_exit_callbacks)

    process.on('SIGTERM', run_exit_callbacks)

    // catches "kill pid"
    process.on('SIGUSR1', run_exit_callbacks)
    process.on('SIGUSR2', run_exit_callbacks)

    // catches uncaught exceptions
    process.on('uncaughtException', run_exit_callbacks)

    return this
  }

  on_exit(callback) {
    this.exit_callbacks.push(callback)
  }
}

module.exports = NodeService
