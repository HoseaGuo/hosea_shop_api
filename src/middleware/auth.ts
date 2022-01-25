import { Next, Context } from "koa";


export default function (ctx: Context, next: Next) {
  // 查看是否登录了
  const { url, method } = ctx.request;
  console.log(url)
  console.log(method)

  if (1 > 2) {
    return ctx.fail({
      status: 403,
      msg: "没有权限访问接口"
    })
    /* 
      return ctx.fail({
        status: 401,
        msg: "没有登录"
      })
    */
  } else {
    // 
    ctx.check = function () {
      // console.log()
    }

    return next();
  }


}


/* 

目录控权
  按钮控权[请求url、请求method、前端用的actionCode]


*/