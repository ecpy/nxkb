# nxkb

node Xorg keyboard bindings

## Background
I made this project for 2 purposes
- provide keyboard shortcuts to control volume, backlight, mouse, screenshots
- try the [Awilix](https://github.com/jeffijoe/awilix#readme) DI framework, [RxJs](https://rxjs-dev.firebaseapp.com/), [PM2](http://pm2.keymetrics.io/), some nodejs libraries and logging layer structure.

## Installation
```
npm i -g pm2
git clone https://github.com/ecpy/nxkb
echo 'pm2 start ~/nxkb' > ~/.xinitrc
cd ~
pm2 start nxkb
```

## Pending works
- services.permission.js - it will use node-gyp to build setuid .bin for nxkb to execute clients' command in root mode.
- make app key bindings more configurable by config.yml
