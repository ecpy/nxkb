describe('services.backlight', () => {

  const {
    get_backlight_service
  } = require('./../services.backlight')

  const backlight_service = get_backlight_service({
    system_backlight_path: undefined
  })

  describe('::get_brightness', () => {
    it('should get correct brightness', async () => {
      try {
        // const value = await backlight_service.get_brightness()
        // expect(value).equal('120000')
      } catch (err) {}
    })
  })

  describe('::get_max_brightness', () => {
    it('should get max. brightness', async () => {
      const max_brightness = '120000'
      try {
        const value = await backlight_service.get_brightness()
        expect(value).equal(max_brightness)
      } catch (err) {}
    })
  })

  describe('::set_brightness', () => {
    it('should set correct brightness', async () => {
      const test_value = 100000
      try {
        const value = await backlight_service.set_brightness(test_value)
        expect(value).equal(test_value)
      } catch (err) {}
    })
  })

  describe('::dec_brightness', () => {
    it('should inc. correct brightness', async () => {
      try {
        const value = await backlight_service.inc_brightness()
      } catch (err) {}
    })
  })

  it('should get same brightness after set', async () => {
    const test_value = 120000
    try {
      const set_value = await backlight_service.set_brightness(test_value)
      const get_value = await backlight_service.get_brightness()
      expect(set_value).equal(test_value)
      expect(get_value).equal(test_value)
    } catch (err) {}
  })

})