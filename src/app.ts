import Koa from "koa";
import koaBody from "koa-body";
import cors from 'koa2-cors';
import router from "./router/v1";
import databaseConnect from "./database/connect";
import responseMiddleware from "./middleware/response";
import authMiddleware from "./middleware/auth";

const SERVER_PORT = 9925;

function createApp() {
  const app = new Koa();

  // 解决跨域问题
  app.use(cors({
    credentials: true,
    origin: function (ctx) {
      let res: any = false;
      let { origin } = ctx.request.header;
      if (origin?.includes('hosea.shop')) {
        res = '*';
      }
      return res;
    }
  }));

  app.use(
    koaBody({
      strict: false, // 可以解释delete请求的参数
    })
  );

  // 连接数据库
  databaseConnect();

  // 添加响应方法中间件
  app.use(responseMiddleware);
  app.use(authMiddleware);

  app.use(router.routes()).use(router.allowedMethods());
  // app.use((ctx, next) => {
  //   ctx.body = "1232";
  //   next();
  // });

  app.listen(SERVER_PORT);

  console.log(`服务器启动成功，端口号为：${SERVER_PORT}`);
}

createApp();
