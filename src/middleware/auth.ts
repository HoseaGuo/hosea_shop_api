import { Next, Context } from "koa";
import { verify } from '../utils/jwt'

export default function (ctx: Context, next: Next) {
  // 查看是否登录了
  let { url, method } = ctx.request;

  url = url.replace(/\/v[0-9]*/, ""); // 移除url的版本

  // 权限校验接口白名单。
  const whiteList = ['/user/check-login', '/user/login']

  console.log(`${method}:${url}`)

  // 如果是get请求直接通过。
  if (method === 'GET' || whiteList.includes(url)) {
    return next();
  } else {

    let res = verifyToken(ctx);

    if (res.errMsg) {
      // 没有登录
      return ctx.fail({
        status: 401,
        msg: res.errMsg
      })
    } else {
      if (res.data.username === 'admin') {
        return next();
      } else {
        // 查看操作权限。
        /* 
        return ctx.fail({
          status: 403,
          msg: "没有权限访问接口"
        })
        
        */
        return next();
      }
    }

    let { authorization } = ctx.request.headers;
    let token = "";
    // 从authorization中获取token
    if (authorization) {
      token = authorization!.replace("Bearer ", "");
    }
    try {
      const res = verify(token);
      const { data } = res;
      console.log(data);

      // 超级管理员不校验权限。
      if (data.username === 'admin') {
        return next();
      } else {
        // 查看操作权限。
        /* 
        return ctx.fail({
          status: 403,
          msg: "没有权限访问接口"
        })
        
        */
      }

      return next();
    } catch (err: any) {
      // 输出错误信息  还没有登录
      return ctx.fail({
        status: 401,
        msg: err.message || "jwt other err"
      })
    }
  }



  return next();

  // 超级管理员可以不用校验权限

  /* if (1 > 2) {
    return ctx.fail({
      status: 403,
      msg: "没有权限访问接口"
    })
  } else {
    // 
    ctx.check = function () {
      // console.log()
    }

    return next();
  } */


}

type VerifyTokenResponse = {
  data?: any,
  errMsg?: string
}

export function verifyToken(ctx: Context): VerifyTokenResponse {
  let { authorization } = ctx.request.headers;
  let token = "";
  // 从authorization中获取token
  if (authorization) {
    token = authorization!.replace("Bearer ", "");
  }
  try {
    const res = verify(token);
    const { data } = res;
    return {
      data
    }
  } catch (err: any) {
    return {
      errMsg: err.message || "jwt other err"
    }
  }
}


/* 

目录控权
  按钮控权[请求url、请求method、前端用的actionCode]


*/