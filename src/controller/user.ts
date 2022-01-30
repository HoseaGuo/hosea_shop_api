import { Context, Next } from "koa";
import UserModel from "../database/models/user";
import MenuModel from "../database/models/menu";
import { sign, verify } from "../utils/jwt";
import { isSuperAdmin } from "../utils";
import crypto from "crypto"; // 加密用的
import rand from "csprng"; // 生成随机数用的
import { verifyToken } from "../middleware/auth";
import { pagingQuery } from "../utils";

const NAME = "用户";

/* 新增 */
export async function create(ctx: Context, next: Next) {
  let { username, password, roles } = ctx.request.body;

  if (!username || !password) return ctx.fail(`用户名或者密码不能为空`);

  // 随机生成盐
  const salt = rand(36, 36);

  password = encryptPasswordWithSalt(password, salt);

  const user = new UserModel({
    username,
    password,
    roles,
    salt,
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

  let searchRes;

  // let res = verifyToken(ctx);

  // let query: any;

  if (_id) {
    searchRes = await UserModel.findById(_id);
  } else {
    searchRes = await pagingQuery(UserModel, {
      // $where: function () {
      //   return this.username !== "admin";
      // },
      ...ctx.request.query,
    });
  }

  // 如果不是超级管理员[admin]，则不能查询到admin
  // if (res.data?.username !== "admin") {
  //   query.where("username").nin(["admin"]);
  // }
  // docs = await query.exec();

  if (searchRes) {
    ctx.success(searchRes, `${NAME}查询成功`);
  } else {
    ctx.fail(`${NAME}查询失败`);
  }
}

/* 修改 */
export async function edit(ctx: Context, next: Next) {
  let { _id, password, username, roles } = ctx.request.body;

  const updateObj: any = {
    username,
    roles,
  };

  // 新的密码
  if (password) {
    // 随机生成盐
    const salt = rand(36, 36);

    updateObj.password = encryptPasswordWithSalt(password, salt);

    updateObj.salt = salt;
  }

  let res = await UserModel.findByIdAndUpdate(_id, updateObj);

  if (res) {
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
    username,
  })
    .select("username password salt _id roles")
    .populate({
      path: "roles",
      select: "menus",
      populate: {
        path: "menus",
        select: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    });

  if (doc) {
    let { salt, password: passwordFromDB, roles, ...userInfo } = doc._doc;

    // “用户输入的密码进行加密” 和 “数据库查询的密码” 进行比对
    if (passwordFromDB === encryptPasswordWithSalt(password, salt)) {
      // 判断是否是超级管理员admin
      if (isSuperAdmin(username)) {
        // 查询所有目录
        const menus = await MenuModel.find().select({
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        });
        userInfo.menus = menus;
      } else {
        // 根据roles生成menus
        userInfo.menus = getMenusFromRoles(roles);
      }

      // 将token保存到header返回给前端。
      const token = sign({
        _id: userInfo._id,
        username: userInfo.username,
      });

      // 设置token到响应头中
      ctx.response.set("token", token);

      ctx.success(userInfo, `${NAME}登录成功`);
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

  try {
    const res = verify(token);
    if (res) {
      const { data } = res;

      // 在token的payload.data中存储了该用户的_id，查询以下用户信息
      const { _id } = data;

      const doc = await UserModel.findById(_id)
        .select("username password salt _id roles")
        .populate({
          path: "roles",
          select: "menus",
          populate: {
            path: "menus",
            select: {
              createdAt: 0,
              updatedAt: 0,
              __v: 0,
            },
          },
        });

      if (doc) {
        let { salt, password, roles, ...userInfo } = doc._doc;

        // 判断是否是超级管理员admin
        if (isSuperAdmin(userInfo.username)) {
          // 查询所有目录
          const menus = await MenuModel.find().select({
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          });
          userInfo.menus = menus;
        } else {
          // 根据roles生成menus
          userInfo.menus = getMenusFromRoles(roles);
        }

        // 将token保存到header返回给前端。
        const token = sign(data);

        // 设置token到响应头中
        ctx.response.set("token", token);

        ctx.success(userInfo, "已登录");
      } else {
        ctx.fail("没有找到token中所对应的用户");
      }
    }
  } catch (err: any) {
    // 输出错误信息
    err.message ? ctx.fail(err.message) : ctx.fail("jwt other err");
  }
}

// 使用盐加密密码
function encryptPasswordWithSalt(password: string, salt: string) {
  return crypto.createHash("sha256").update(`${password}${salt}`).digest("hex");
}

// 根据用户登录后的角色role数组，拼接成该用户有权访问的menu数组
function getMenusFromRoles(
  roles: {
    menus: any[];
  }[] = []
) {
  const menuSet = new Set();
  roles.forEach(role => {
    role.menus.forEach(menu => {
      menuSet.add(menu);
    });
  });
  return [...menuSet];
}

const DEFAULT_ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "123456";

export function initSuperAdmin() {
  UserModel.findOne({ username: DEFAULT_ADMIN_USERNAME }, (err: any, doc: any) => {
    if (!doc) {
      // 随机生成盐
      const salt = rand(36, 36);

      const user = new UserModel({
        username: DEFAULT_ADMIN_USERNAME,
        password: encryptPasswordWithSalt(DEFAULT_ADMIN_PASSWORD, salt),
        salt,
      });

      user.save();
    }
  });
}

export default {
  create,
  search,
  edit,
  remove,
  login,
  checkLogin,
};
