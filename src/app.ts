import Koa from 'koa';
import koaBody from 'koa-body';
import router from './router/v1';
import databaseConnect from './database/connect';


const SERVER_PORT = 9925;
function createApp() {
  const app = new Koa();

  app.use(koaBody());

  // 连接数据库1
  databaseConnect();
  
  app.use(router.routes())
    .use(router.allowedMethods());


  app.listen(SERVER_PORT);

  console.log(`服务器启动成功，端口号为：${SERVER_PORT}`)
}

createApp();