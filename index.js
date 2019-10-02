const awilix = require('awilix')
const decamelize = require('decamelize')

const container = awilix.createContainer()

// DI
container.loadModules(['./services/services.**.js', './utils/utils.**.js'], {
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
  app_config: awilix.asValue({
    system_backlight_path: '/sys/class/backlight/intel_backlight',
  }),
})

const app_service = container.resolve('app_service')

const node_service = container.resolve('node_service')

app_service.start()

// cleanup
node_service.on_exit((kill) => {
  app_service.stop()
  kill()
})
