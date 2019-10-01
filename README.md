# nxkb

node Xorg keyboard bindings

## Background
I use Fedora and [i3](https://i3wm.org/) as the window manager, but the fn keys and touchpad seems not to work, so I made this project for 2 purposes
- provide keyboard shortcuts to control volume, backlight, mouse, screenshots
- try the [Awilix](https://github.com/jeffijoe/awilix#readme) DI framework, [RxJs](https://rxjs-dev.firebaseapp.com/), [PM2](http://pm2.keymetrics.io/) and other nodejs libraries

## Installation
```
npm i -g pm2
git clone https://github.com/ecpy/nxkb
```

- create /etc/systemd/system/nxkb.service
```
Description=nxkb.service

[Service]
Type=simple
ExecStart=/bin/sh -c "pm2 start /home/${USER}/nxkb"
Restart=on-failure
RestartSec=2
KillMode=process

[Install]
WantedBy=multi-user.target
```
- auto. start now and on startup: 
``` 
systemctl enable nxkb.service
systemctl start nxkb.service

```


