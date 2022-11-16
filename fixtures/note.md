```shell
npm i -g kivibot --registry=https://registry.npmmirror.com
kivi init
```

prompt：

- qq 账号
- 登录模式（扫码、密码）
- 设备锁验证模式（扫码、短信）
- 登录协议（Android、aPad、iPad、Watch、Mac）
- 机器人管理（多个使用空格分隔）

generate `config.json`

```json
{
  "account": 123456789,
  "login_mode": "password", // qrcode or password
  "device_mode": "qrcode", // qrcode or sms
  "password": "xxxxxxxxxxx", // base64
  "admins": [123456],
  "plugins": [],
  "oicq_config": {
    "platform": 5,
    "log_lever": "debug"
  }
}
```

generate:

- `main.js` (`require('@kivibot/core').start()`)

install deps automatically...(ora...) :

- `@kivibot/core`
- `pm2`

run: `npm install @kivibot/core pm2`

```shell
kivi start
```

run: `node main.js`

extra:

```shell
kivi deploy # deploy with pm2
kivi stop # stop with pm2
kivi add xxx xxx --enable # install plugin
kivi remove/rm xxx xxx
```
