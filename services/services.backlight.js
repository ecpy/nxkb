const exec = require('exec')

class BacklightService {
  constructor({ audio_service_config, log_service }) {
    this.log_service = log_service
    const { system_backlight_path } = audio_service_config
    this.current_brightness_path = `${system_backlight_path}/brightness`
    this.max_brightness_path = `${system_backlight_path}/max_brightness`

    this.get_brightness = this.get_brightness.bind(this)
    this.set_brightness = this.set_brightness.bind(this)
    this.get_max_brightness = this.get_max_brightness.bind(this)
    this.inc_brightness = this.inc_brightness.bind(this)
    this.dec_brightness = this.dec_brightness.bind(this)
  }

  get_brightness() {
    return new Promise((resolve, reject) => {
      const command = `cat ${this.current_brightness_path}`
      exec(command, (err, stdout, stderr) => {
        if (err) {
          this.log_service.log({
            level: 'error',
            message: stderr,
          })
          reject(stderr)
        } else {
          let value = stdout
          value = parseInt(value, 10)
          this.log_service.log({
            level: 'info',
            message: `get_brightness: ${value}`,
          })
          resolve(value)
        }
      })
    })
  }

  set_brightness(value) {
    return new Promise(async (resolve, reject) => {
      // const command = `echo ${user_pwd} | sudo -S bash -c 'echo ${value} > ${current_brightness_path}'`
      const command = `bash -c 'echo ${value} > ${this.current_brightness_path}'`
      exec(command, (err, stdout, stderr) => {
        if (err) {
          this.log_service.log({
            level: 'error',
            message: stderr,
          })
          reject(stderr)
        } else {
          this.log_service.log({
            level: 'info',
            message: `set_brightness: ${value}`,
          })
          resolve(stdout)
        }
      })
    })
  }

  get_max_brightness() {
    return new Promise((resolve, reject) => {
      const command = `cat ${this.max_brightness_path}`
      exec(command, (err, stdout, stderr) => {
        if (err) {
          reject(stderr)
        } else {
          const value = stdout
          resolve(value)
        }
      })
    })
  }

  dec_brightness(percentage) {
    // eslint-disable-next-line no-param-reassign
    percentage = percentage > 0 && percentage < 1 ? percentage : 0.05
    return new Promise(async (resolve, reject) => {
      try {
        const max_brightness = parseInt(await this.get_max_brightness(), 10)
        const current_brightness = parseInt(await this.get_brightness(), 10)
        const decrement = max_brightness * percentage
        let new_brightness = current_brightness - decrement
        new_brightness = new_brightness < 0 ? 0 : new_brightness
        const result = await this.set_brightness(new_brightness)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }

  inc_brightness(percentage) {
    // eslint-disable-next-line no-param-reassign
    percentage = percentage > 0 && percentage < 1 ? percentage : 0.05
    return new Promise(async (resolve, reject) => {
      try {
        const max_brightness = parseInt(await this.get_max_brightness(), 10)
        const current_brightness = parseInt(await this.get_brightness(), 10)
        const increment = max_brightness * percentage
        let new_brightness = current_brightness + increment
        new_brightness = new_brightness > max_brightness ? max_brightness : new_brightness
        const result = await this.set_brightness(new_brightness)
        resolve(result)
      } catch (err) {
        reject(err)
      }
    })
  }
}

module.exports = BacklightService
