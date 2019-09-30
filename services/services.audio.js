const exec = require('exec')

class AudioService {
  // eslint-disable-next-line class-methods-use-this
  inc_volume(percentage) {
    // const command_inc_volume = `amixer set 'Master' 5%+`
    const command_inc_volume = `
    amixer -c 0 -- set PCM 5%+; amixer -c 0 -- set Master 2.5%+; amixer -c 0 -- set Speaker 2.5%+;
    amixer -c 1 -- set PCM 5%+; amixer -c 1 -- set Master 2.5%+; amixer -c 1 -- set Speaker 2.5%+;
    `
    exec(command_inc_volume, () => {})
  }

  // eslint-disable-next-line class-methods-use-this
  dec_volume(percentage) {
    // const command_dec_volume = 'amixer set \'Master\' 5%-'
    const command_dec_volume = `
    amixer -c 0 -- set PCM 5%-; amixer -c 0 -- set Master 2.5%-; amixer -c 0 -- set Speaker 2.5%-;
    amixer -c 1 -- set PCM 5%-; amixer -c 1 -- set Master 2.5%-; amixer -c 1 -- set Speaker 2.5%-;
    `
    exec(command_dec_volume, () => {})
  }

  // eslint-disable-next-line class-methods-use-this
  mute_volume() {
    // const command_mute_volume = "amixer set 'Master' toggle"
    const command_mute_volume = `
    amixer -c 0 -- set PCM toggle;amixer -c 0 -- set Master toggle;amixer -c 0 -- set Headphone toggle; amixer -c 0 -- set Speaker toggle;
    amixer -c 1 -- set PCM toggle;amixer -c 1 -- set Master toggle;amixer -c 1 -- set Headphone toggle; amixer -c 1 -- set Speaker toggle;
    `
    exec(command_mute_volume, () => {})
  }

  // eslint-disable-next-line class-methods-use-this
  mute_mic() {
    const command_mute_mic = 'amixer set Capture toggle'
    exec(command_mute_mic, () => {})
  }
}

module.exports = AudioService
