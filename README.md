# nxkb

node Xorg keyboard bindings

## Background
I use Fedora and [i3](https://i3wm.org/) as the window manager, but the fn keys and touchpad seems not to work, so I made this project for 2 purposes
- provide keyboard shortcuts to control volume, backlight, mouse, screenshots
- try the [Awilix](https://github.com/jeffijoe/awilix#readme) DI framework, [RxJs](https://rxjs-dev.firebaseapp.com/), [PM2](http://pm2.keymetrics.io/) and other nodejs libraries

## Code Structure


## Installation
```
npm i -g pm2
git clone https://github.com/ecpy/nxkb
chmod +x ~/nxkb/start.sh
echo 'pm2 start ~/nxkb' > ~/.xinitrc
. ~/nxkb/start.sh
```

## Pending works
```
services.permission.js - manage permissions of services on executing commands
```