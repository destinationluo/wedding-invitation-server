# 创意婚礼请柬后端

婚礼请柬的后端程序，前端仓库地址：https://github.com/destinationluo/wedding-invitation-client.git
点这里预览下:[这里](http://lamolilaguanfang.com:1314)

## 技术栈

- Node
- Mysql

## 开发配置

1. 修改routes/bless.js中的数据库信息
2. 创建数据库
3. 分别创建来宾表（用于后端统计）和祝福表（用于祝福收集及微信端展示），表结构已导出sql文件到sql/wedding.sql
4. 执行`npm install`
5. 执行`npm start`
6. 打开请柬微信端，发送祝福

## 生产坏境打包

1. 服务器安装Node环境以及pm2（用于管理Node进程）
2. 拷贝工程根目录到服务器
3. 进入服务器上的工程跟目录
4. 执行`npm install`
4. 执行`pm2 start bin/www`