import { Next, Context } from "koa";

interface IResponseBody {
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
  ctx.success = function (data: any , msg: string) {
    let body: IResponseBody = {
      code: 0,
      status: 200,
      data,
      msg: msg || "请求成功"
    }
    ctx.body = body;
    ctx.status = body.status as number;
  }

  ctx.fail = function (body: IResponseBody) {
    if (!body.code) {
      body.code = 1;
    }

    if (body.status === 200 || !body.status) {
      body.status = 400;
    }

    if (typeof body.msg !== 'string') {
      body.msg = "请求出错"
    }
    ctx.body = body;
    ctx.status = body.status as number;
  }

  next();
}