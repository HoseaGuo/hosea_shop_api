import Koa from "koa";
import koaBody from "koa-body";
import router from "./router/v1";
import databaseConnect from "./database/connect";
import responseMiddleware from "./middleware/response";

const SERVER_PORT = 9925;

function createApp() {
  const app = new Koa();

  app.use(
    koaBody({
      strict: false, // 可以解释delete请求的参数
    })
  );

  // 连接数据库1
  databaseConnect();

  // 添加响应方法中间件
  app.use(responseMiddleware);

  app.use(router.routes()).use(router.allowedMethods());
  // app.use((ctx, next) => {
  //   ctx.body = "1232";
  //   next();
  // });

  app.listen(SERVER_PORT);

  console.log(`服务器启动成功，端口号为：${SERVER_PORT}`);
}

createApp();
