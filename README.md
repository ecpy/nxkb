# i3-extras

## Background
I use Fedora and [i3wm](https://i3wm.org/) as the window manager, but the fn keys and touchpad seems not to work, so I made this project for 2 purposes
- provide keyboard shortcuts to control volume, backlight, mouse, screenshots
- try the awilix DI framework and other nodejs libraries

## Installation
```
npm i -g pm2
git clone https://github.com/ecpy/i3-extras
```

- create /etc/systemd/system/i3-extras.service
```
Description=i3-extras.service

[Service]
Type=simple
ExecStart=/bin/zsh -c "pm2 start /home/${USER}/i3-extras"
Restart=on-failure
RestartSec=2
KillMode=process

[Install]
WantedBy=multi-user.target
```
- auto start: ``` systemctl enable i3-extras.service ```


