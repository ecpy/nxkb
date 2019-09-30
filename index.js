const awilix = require('awilix')
const decamelize = require('decamelize')

const container = awilix.createContainer()

container.loadModules(['./services/services.**.js'], {
  cwd: __dirname,
  formatName: (_, descriptor) => decamelize(descriptor.value.name),
  resolverOptions: {
    lifetime: 'SINGLETON',
    injectionMode: 'PROXY',
    register: awilix.asClass,
  },
})

// config
container.register({
  backlight_service_config: awilix.asValue({
    system_backlight_path: '/sys/class/backlight/intel_backlight',
  }),
})

const i3_service = container.resolve('i3_service')

i3_service.start()
