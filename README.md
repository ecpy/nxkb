# nxkb

node Xorg keyboard bindings

## Background
I made this project for 2 purposes
- provide keyboard shortcuts to control volume, backlight, mouse, screenshots
- try the [Awilix](https://github.com/jeffijoe/awilix#readme) DI framework, [RxJs](https://rxjs-dev.firebaseapp.com/), [PM2](http://pm2.keymetrics.io/) and other nodejs libraries

## Installation
```
npm i -g pm2
git clone https://github.com/ecpy/nxkb
chmod +x ~/nxkb/start.sh
echo 'pm2 start ~/nxkb' > ~/.xinitrc
cd ~
pm2 start nxkb
```

## Pending works
- services.permission.js - manage permissions of services on executing commands