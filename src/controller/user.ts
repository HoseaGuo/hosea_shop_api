import { Context, Next } from "koa";
import UserModel from "../database/models/user";
import { sign, verify } from '../utils/jwt';
import crypto from 'crypto';   // 加密用的
import rand from "csprng";  // 生成随机数用的
import userModel from "../database/models/user";
import { verifyToken } from '../middleware/auth'

const NAME = "用户";

/* 新增 */
export async function create(ctx: Context, next: Next) {
  let { username, password } = ctx.request.body;

  if (!username || !password) return ctx.fail(`用户名或者密码不能为空`);

  // 随机生成盐
  const salt = rand(36, 36);

  password = encryptPasswordWithSalt(password, salt);

  const user = new UserModel({
    username,
    password,
    salt
  });

  try {
    let doc = await user.save();
    if (doc) {
      ctx.success(doc, `${NAME}创建成功`);
    } else {
      ctx.fail(`${NAME}创建失败`);
    }
  } catch (err) {
    // console.log(err);
    ctx.fail(`${NAME}创建失败`);
  }
}

/* 查询 */
export async function search(ctx: Context, next: Next) {
  let { _id } = ctx.request.query;

  let docs;

  let res = verifyToken(ctx);

  let query: any;

  if (_id) {
    query = UserModel.findById(_id);
    // docs = await UserModel.findById(_id).where("username").nin(["admin"]);
  } else {
    query = UserModel.find();
  }

  // 如果不是超级管理员[admin]，则不能查询到admin
  if (res.data?.username !== 'admin') {
    query.where("username").nin(["admin"]);
  }
  docs = await query.exec();

  if (docs) {
    ctx.success(docs, `${NAME}查询成功`);
  } else {
    ctx.fail(`${NAME}查询失败`);
  }
}

/* 修改 */
export async function edit(ctx: Context, next: Next) {
  let { _id, content, title } = ctx.request.body;

  let res = await UserModel.updateOne({
    _id,
    title,
    content,
  });

  if (res.matchedCount) {
    ctx.success(null, `${NAME}修改成功`);
  } else {
    ctx.fail(`${NAME}修改失败`);
  }
}

/* 删除 */
export async function remove(ctx: Context, next: Next) {
  let { _id } = ctx.request.body;

  let res = await UserModel.deleteOne({
    _id,
  });

  if (res.deletedCount === 1) {
    ctx.success(res, `${NAME}删除成功`);
  } else {
    ctx.fail(`${NAME}修改失败`);
  }
}

/* 用户登录 */
export async function login(ctx: Context, next: Next) {
  let { username, password } = ctx.request.body;

  let doc = await UserModel.findOne({
    username
  });

  if (doc) {
    let { salt, password: passwordFromDB, ...rest } = doc._doc;

    // “用户输入的密码进行加密” 和 “数据库查询的密码” 进行比对
    if (passwordFromDB === encryptPasswordWithSalt(password, salt)) {

      // 将token保存到header返回给前端。
      const token = sign({
        _id: rest._id,
        username: rest.username
      })

      // 设置token到响应头中
      ctx.response.set("token", token);

      ctx.success(rest, `${NAME}登录成功`);
    } else {
      ctx.fail(`密码错误`);
    }
  } else {
    ctx.fail(`没有该用户`);
  }
}

/* 判断用户登录 */
export async function checkLogin(ctx: Context, next: Next) {
  let { token } = ctx.request.body;

  // console.log(token)
  // if(verify(token)){

  // }
  try {
    const res = verify(token);
    if (res) {
      const { data } = res;

      // 在token的payload.data中存储了该用户的_id，查询以下用户信息
      const { _id } = data;

      const doc = await UserModel.findById(_id);

      if (doc) {
        let { salt, password, ...rest } = doc._doc;

        // 将token保存到header返回给前端。
        const token = sign(data)

        // 设置token到响应头中
        ctx.response.set("token", token);

        ctx.success(rest, "已登录")

      } else {
        ctx.fail("没有找到token中所对应的用户")
      }
    }
  } catch (err: any) {
    // 输出错误信息
    err.message ? ctx.fail(err.message) : ctx.fail("jwt other err")
  }

}

// 使用盐加密密码
function encryptPasswordWithSalt(password: string, salt: string) {
  return crypto.createHash('sha256').update(`${password}${salt}`).digest('hex');
}

export default {
  create,
  search,
  edit,
  remove,
  login,
  checkLogin
};
