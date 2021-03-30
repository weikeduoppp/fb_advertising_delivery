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

注意: 因为自行打包了, commit 校验不通过了. 故commit 不作校验;
```bash
# eg
git commit -m '' --no-verify
```
[相关文档 && 开发文档](https://www.yuque.com/docs/share/f3c88c62-a7a7-468e-8e81-e89271f25258#)

## facebook应用注意点

其中使用是ead_net应用. 登录账号现在绑定是开发者手机号.

图谱api版本更新频繁, 需要时不时同步更新. 不然api会调用失败.

应用管理员必须每年完成一次数据使用情况检查。(2021.3.12)

对于 Facebook 以及在 Facebook 开放平台构建应用的开发者而言，保护用户的隐私是首要任务。因此我们要求每年必须进行数据使用情况检查，以便确保你的 API 访问权限和数据使用情况符合 Facebook 政策。详细了解
若要保留 API 访问权限并避免其遭到停用，你需要在2021年5月10日前执行下列操作：
1. 检查你之前获得批准或添加的权限、功能和产品。
2. 确认你的应用遵守合理使用方式。
3. 确认遵守Facebook 开放平台条款和开发者政策，以及其他所有适用条款和政策。
