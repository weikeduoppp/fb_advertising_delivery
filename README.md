## facebook广告投放

本项目的目的是帮助顾问更高效地在facebook投放广告

基于 umi 脚手架开发, 技术栈: react + react-redux


## 功能

基本还原FB广告管理工具功能, 删去(创建/复制)等待时间, 目前新增

- 批量上传素材
- 批量修改素材内容
- 跨账户复制


## 如何部署

部署前确保安装以下环境

- node: >= 10.16.3 (开发环境为 10.16.3, 测试环境为 10.16.3)
- npm: 跟随 node 版本变化
- pm2 (全局安装 `npm install pm2@latest -g` )
- git
- mongodb
- yarn

部署端口号配置位于 `ecosystem.config.js`, 修改 `PORT` 为指定端口. 目前是3001

mongodb - port 目前默认27017 

需要开启gzip

开始部署, 执行:

```bash
# 拉取项目代码
git clone git@gitlab.corp.youdao.com:yewq/fb_advertising_delivery.git

# 安装依赖
yarn

# 启动项目 指定HOME 位置(zj231)
PM2_HOME='/disk1/eadop/.fb_advertising_delivery' pm2 startOrRestart ecosystem.config.js --env production
```

由于umi某原因. 打包的代码是直接git上./dist.

注意: 因为添了servers, commit 校验不通过了. 故commit 不作校验;
```bash
# eg
git commit -m '' --no-verify
```
[相关文档 && 开发文档](https://www.yuque.com/docs/share/f3c88c62-a7a7-468e-8e81-e89271f25258#)
