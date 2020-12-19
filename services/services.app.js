const exec = require('exec')
// eslint-disable-next-line import/newline-after-import
const udev = require('udev')
const monitor = udev.monitor('input')

class AppService {
  constructor({
    input_service, audio_service, backlight_service, log_service,
  }) {
    this.input_service = input_service
    this.audio_service = audio_service
    this.backlight_service = backlight_service
    this.log_service = log_service

    this.start = this.start.bind(this)
  }

  start() {
    this.input_service.start()

    // binding_key_event_actions
    {
      const { input_service } = this

      const { audio_service } = this

      const { backlight_service } = this

      const key_event$ = require('rxjs').fromEventPattern(on_key_event => input_service.set_event_listener({
        on_key_event,
      }))


      const { empty } = require('rxjs')

      const { filter, switchMap, tap } = require('rxjs/operators')
      // debug
      // key_event$.subscribe(e => {
      //   // console.log(e)
      // })

      // 65515
      // 65282
      // 65283

      const KEYCODE_FN = 56 // for ubuntu
      const KEYCODE_DEC_BACKLIGHT_ACTION = 65283
      const KEYCODE_INC_BACKLIGHT_ACTION = 65282

      const KEYCODE_MUTE_VOL_ACTION = 59
      const KEYCODE_DEC_VOLUME_ACTION = 60
      const KEYCODE_INC_VOLUME_ACTION = 61
      const KEYCODE_MUTE_MIC_ACTION = 62
      const KEYCODE_PRTSC = 3639
      const KEYCODES_VIR_NUMPAD = [24, 23, 22, 39, 38, 37, 36, 35, 52, 51, 50]

      const fn_keys_filter = filter(e => e.keycode === KEYCODE_FN)
      //const fn_keys_down_only_switchMap = switchMap(e => (e.type == 'keydown'))
      const action_key_streams_switch = switchMap(e => (e.type === 'keydown' ? key_event$ : empty()))

      // decrease backlight: mod + F5
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.rawcode === KEYCODE_DEC_BACKLIGHT_ACTION && e.type === 'keydown'))
        .subscribe(backlight_service.dec_brightness)

      // increase backlight: mod + F6
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.rawcode === KEYCODE_INC_BACKLIGHT_ACTION && e.type === 'keydown'))
        .subscribe(backlight_service.inc_brightness)

      // increase volume: mod + F3
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.keycode === KEYCODE_INC_VOLUME_ACTION && e.type === 'keydown'))
        .subscribe(audio_service.inc_volume)

      // decrease volume: mod + F2
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.keycode === KEYCODE_DEC_VOLUME_ACTION && e.type === 'keydown'))
        .subscribe(audio_service.dec_volume)

      // mute volume: mod + F1
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.keycode === KEYCODE_MUTE_VOL_ACTION && e.type === 'keydown'))
        .subscribe(audio_service.mute_volume)

      // mute mic: mod + F4
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.keycode === KEYCODE_MUTE_MIC_ACTION && e.type === 'keydown'))
        .subscribe(audio_service.mute_mic)

      // print screen: mod + ctrl_r
      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && e.keycode === KEYCODE_PRTSC && e.type === 'keydown'))
        .subscribe(() => {
          exec('gnome-screenshot', () => {})
        })

      // move mouse pointer
      const keycode_to_pointer_direction_map = {
        // 24: input_service.pointer.POS_RIGHT_UP,
        23: input_service.pointer.POS_UP,
        // 22: input_service.pointer.POS_LEFT_UP,
        38: input_service.pointer.POS_RIGHT,
        36: input_service.pointer.POS_LEFT,
        // 52: input_service.pointer.POS_RIGHT_DOWN,
        // 51: input_service.pointer.POS_DOWN,
        37: input_service.pointer.POS_DOWN,
        // 50: input_service.pointer.POS_LEFT_DOWN,
      }

      key_event$
        .pipe(fn_keys_filter)
        .pipe(action_key_streams_switch)
        .pipe(filter(e => e && KEYCODES_VIR_NUMPAD.includes(e.keycode) && e.type === 'keydown' && e.shiftKey === false))
        .subscribe((e) => {
          if (e.keycode === 22) {
            input_service.pointer.click({ button: 'left' })
            return
          }
          if (e.keycode === 24) {
            input_service.pointer.click({ button: 'right' })
            return
          }
          if (e.keycode === 51) {
            input_service.pointer.click({ button: 'middle' })
            return
          }
          input_service.pointer.accelerate({
            direction: keycode_to_pointer_direction_map[e.keycode],
          })
        })

	
    }

    // restart_keymap_on_keyboard_plugging_events
    {
      const self = this

      // eslint-disable-next-line no-inner-declarations
      function exec_Xmodmap() {
        if (exec_Xmodmap.is_running) return
        exec_Xmodmap.is_running = true

        // xmodmap .Xmodmap
        const command = '/home/edward/.xinitrc.keymap'
        exec(command, (err, stdout, stderr) => {
          if (err) {
            self.log_service.log({
              level: 'error',
              message: `restart_keymap_on_keyboard_plugging_events: error: ${JSON.stringify(err)}`,
            })
            self.log_service.log({
              level: 'info',
              message: 'restart_keymap_on_keyboard_plugging_events: retrying',
            })
            setTimeout(() => {
              exec_Xmodmap.is_running = false
              exec_Xmodmap()
            }, 3000)
            exec_Xmodmap.is_running = true
          } else {
            self.log_service.log({
              level: 'info',
              message: 'restart_keymap_on_keyboard_plugging_events: restart keymap successfully',
            })
            exec('notify-send "reload keymap"', () => {})
            exec_Xmodmap.is_running = false
          }
        })
      }
      //exec_Xmodmap()

      //monitor.on('add', (device) => {
      //  if (device['.INPUT_CLASS'] === 'kbd') {
      //    setTimeout(exec_Xmodmap, 50)
      //  }
      //})
    }
  }

  stop() {
    this.input_service.stop()
  }
}

module.exports = AppService
