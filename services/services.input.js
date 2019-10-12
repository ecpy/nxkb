const ioHook = require('iohook')
const robot = require('robotjs')
const exec = require('exec')
const DEBUG_MODE = false

class InputService {
  constructor({ log_service }) {
    this.is_started = false

    this.log_service = log_service

    this.key_event_listeners = []

    this.keyboard = {
      press_key(keycode) {},

      next_layout() {},

      set_layout(layout) {},

      // TODO: depreciated
      get_layouts() {
        return new Promise((resolve, reject) => {
          exec('gsettings get org.gnome.desktop.input-sources sources', (err, stdout, stderr) => {
            if (err) {
              reject(stderr)
            } else {
              let result = stdout
              result = JSON.parse(result)

              resolve(result)
            }
          })
        })
      },
    }

    const pointer = {
      POS_LEFT_DOWN: Symbol(),
      POS_LEFT: Symbol(),
      POS_LEFT_UP: Symbol(),
      POS_DOWN: Symbol(),
      POS_UP: Symbol(),
      POS_RIGHT_UP: Symbol(),
      POS_RIGHT: Symbol(),
      POS_RIGHT_DOWN: Symbol(),

      CONSTANT_FRICTION: 0.75,

      state: {
        // acceleration: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
      },

      click({ button, double_click }) {
        robot.mouseClick(button, double_click)
      },

      set_location({ x, y }) {
        robot.moveMouse(x, y)
      },

      get_location() {
        return robot.getMousePos()
      },

      apply_friction() {
        let pointer_velocity = Math.sqrt(
          Math.pow(pointer.state.velocity.x, 2) + Math.pow(pointer.state.velocity.y, 2),
        )

        pointer_velocity = pointer_velocity === 0 ? 1 : pointer_velocity

        const pointer_friction =					pointer.CONSTANT_FRICTION > pointer_velocity
					  ? pointer_velocity
					  : pointer.CONSTANT_FRICTION

        pointer.state.velocity.x -= (pointer_friction * pointer.state.velocity.x) / pointer_velocity
        pointer.state.velocity.y -= (pointer_friction * pointer.state.velocity.y) / pointer_velocity
      },

      // set_next_velocity() {
      //   pointer.state.velocity.x += pointer.state.acceleration.x
      //   pointer.state.velocity.y += pointer.state.acceleration.y
      // },

      set_next_displacement() {
        let { x, y } = pointer.get_location()
        x += pointer.state.velocity.x
        y += pointer.state.velocity.y
        pointer.set_location({ x, y })
      },

      move_to_next_location() {
        pointer.apply_friction()
        // pointer.set_next_velocity()
        pointer.set_next_displacement()
      },

      invalidate() {
        pointer.move_to_next_location()
      },

      accelerate({ direction, value = 3 }) {
        const diagonal_ratio = 1 / Math.sqrt(2)
        const current_velocity = Math.sqrt(
          Math.pow(pointer.state.velocity.x, 2) + Math.pow(pointer.state.velocity.y, 2),
        )
        if (current_velocity > 15) return

        switch (direction) {
          case pointer.POS_LEFT_DOWN:
            pointer.state.velocity.x -= value * diagonal_ratio
            pointer.state.velocity.y += value * diagonal_ratio
            break
          case pointer.POS_LEFT:
            pointer.state.velocity.x -= value
            break
          case pointer.POS_LEFT_UP:
            pointer.state.velocity.x -= value * diagonal_ratio
            pointer.state.velocity.y -= value * diagonal_ratio
            break
          case pointer.POS_DOWN:
            pointer.state.velocity.y += value
            break
          case pointer.POS_UP:
            pointer.state.velocity.y -= value
            break
          case pointer.POS_RIGHT_UP:
            pointer.state.velocity.x += value * diagonal_ratio
            pointer.state.velocity.y -= value * diagonal_ratio
            break
          case pointer.POS_RIGHT:
            pointer.state.velocity.x += value
            break
          case pointer.POS_RIGHT_DOWN:
            pointer.state.velocity.x += value * diagonal_ratio
            pointer.state.velocity.y += value * diagonal_ratio
            break
          default:
            break
        }
      },
    }
    this.pointer = pointer
  }

  set_event_listener(listener) {
    if (listener.on_key_event) {
      this.key_event_listeners.push(listener)
    }
  }

  start() {
    if (this.is_started) return
    this.is_started = true

    const INVALIDATION_TIME = 5
    this.timer_id = setInterval(this.pointer.invalidate, INVALIDATION_TIME)

    ioHook.on('keydown', (event) => {
      if (DEBUG_MODE) this.log_service.log({ message: event })
      this.key_event_listeners.forEach(
        listener => listener.on_key_event && listener.on_key_event(event),
      )
    })

    ioHook.on('keyup', (event) => {
      if (DEBUG_MODE) this.log_service.log({ message: event })
      this.key_event_listeners.forEach(
        listener => listener.on_key_event && listener.on_key_event(event),
      )
    })

    // Register and start hook
    ioHook.start()
  }

  // eslint-disable-next-line no-unused-vars
  stop() {
    this.is_started = false
    clearInterval(this.timer_id)
    ioHook.stop()
    // ioHook.unload()
  }
}

module.exports = InputService
