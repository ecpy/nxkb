function deepclone(obj) {
  return JSON.parse(JSON.stringify(obj))
    }

describe('pointer', () => {
  // restore mocks
  let input_service_pointer_state

  const input_service = require('../services.input').get_input_service()
  // let input_service
  beforeEach(() => {
    // mock state
    input_service_pointer_state = input_service.pointer.state
    input_service.pointer.state = deepclone(input_service_pointer_state)
  })

  afterEach(() => {
    // restore mocks
    input_service.pointer.state = input_service_pointer_state
    input_service.stop()
  })

  describe('::apply_decelerating_friction', () => {
    jest.spyOn(input_service.pointer, 'invalidate')

    it('it applies decelerating friction', () => {
      input_service.pointer.accelerate({ direction: input_service.pointer.POS_UP, value: 10 })
      expect(input_service.pointer.state).toEqual({
        acceleration: { x: 0, y: -10 },
        velocity: { x: 0, y: 0 },
      })
      input_service.pointer.move_to_next_location()
      // expect(input_service.state)
      // invalid_paths.forEach(p => expect(repository_fetcher_service.is_path_valid({ path: p })).toBeFalsy())
      // valid_paths.forEach(p => expect(repository_fetcher_service.is_path_valid({ path: p })).toBeTruthy())
    })
  })
})
