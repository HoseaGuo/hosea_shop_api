import { Next, Context } from "koa";

interface IResponse {
  /** 响应状态 */
  status?: number;
  /** 业务自定义状态码 */
  code?: number;
  /** 返回得数据 */
  data?: any;
  /** 返回的信息 */
  msg?: any;
}

export default function (ctx: Context, next: Next) {
  ctx.success = function (data?: any, msg?: string) {
    let body: IResponse = {
      code: 0,
      data,
      msg: msg || "请求成功",
    };
    ctx.body = body;
    ctx.status = 200;
  };

  ctx.fail = function (error: IResponse | string) {
    if (typeof error === "string") {
      ctx.body = {
        code: 1,
        msg: error,
      };
      ctx.status = 400;
    } else {
      let { status, ...rest } = error;
      if (status === 200 || !status) {
        status = 400;
      }
      if (typeof rest.msg !== "string") {
        rest.msg = "请求出错";
      }
      ctx.body = rest;
      ctx.status = status;
    }
  };

  return next();
}
