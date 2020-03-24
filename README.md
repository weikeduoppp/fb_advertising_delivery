## facebook广告投放

本项目的目的是帮助顾问更高效地在facebook投放广告

基于 umi 脚手架开发, 技术栈: react + react-redux


## 功能

基本还原FB广告管理工具功能, 删去(创建/复制)等待时间, 目前新增

- 批量上传素材
- 批量修改素材内容
- 跨账户复制


## 部署

- node >= 8.0.0 (开发环境为 10.15.3)
- npm 跟随 node 版本变化
- yarn (开发环境为 1.16.0)
- git

```
# 安装依赖
yarn install

# 运行
yarn start

# 打包
yarn build
```

### 生产环境

更新svn https://corp.youdao.com/svn/ydstatic/ead/dynamic/dynamic-template/content/fb_advertising_delivery

在 http://updatecdn.iyoudao.net/ 上刷新cdn文件

在 http://corp.youdao.com/IT/updateshared/ 刷新静态服务器的资源访问

 在cms系统模板中 http://cms.corp.youdao.com/file/dashboard/template/edit/?id=1781 更新模板
 
 在cms系统资源中 http://cms.corp.youdao.com/file/dashboard/edit/?id=30383 发布新的内容
 
 访问 https://c.youdao.com/dsp/facebook/fb_advertising_delivery.html


[相关文档 && 开发文档](https://www.yuque.com/docs/share/f3c88c62-a7a7-468e-8e81-e89271f25258#)


