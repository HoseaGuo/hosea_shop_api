import { Context, Next } from "koa";
import RoleModel from "../database/models/role";
import { pagingQuery } from "../utils";

const NAME = "角色";

/* 新增 */
export async function create(ctx: Context, next: Next) {
  let menu = new RoleModel(ctx.request.body);
  try {
    let doc = await menu.save();
    if (doc) {
      ctx.success(doc, `${NAME}创建成功`);
    } else {
      ctx.fail(`${NAME}创建失败`);
    }
  } catch (err) {
    console.log(err);
    ctx.fail(`${NAME}创建失败`);
  }
}

/* 查询 */
export async function search(ctx: Context, next: Next) {
  let { _id } = ctx.request.query;

  let searchRes;

  if (_id) {
    searchRes = await RoleModel.findById(_id);
  } else {
    // query = RoleModel.find();
    searchRes = await pagingQuery(RoleModel, ctx.request.query);
    //
  }

  if (searchRes) {
    ctx.success(searchRes, `${NAME}查询成功`);
  } else {
    ctx.fail(`${NAME}查询失败`);
  }
}

/* 修改 */
export async function edit(ctx: Context, next: Next) {
  let { _id, ...rest } = ctx.request.body;
  try {
    let res = await RoleModel.findByIdAndUpdate(_id, rest);
    if (res) {
      ctx.success(null, `${NAME}修改成功`);
    } else {
      ctx.fail(`${NAME}修改失败`);
    }
  } catch (e) {
    ctx.fail(`${NAME}修改失败`);
  }
}

/* 删除 */
export async function remove(ctx: Context, next: Next) {
  let { _id } = ctx.request.body;
  console.log(_id);
  try {
    let doc = await RoleModel.findByIdAndDelete(_id);
    if (doc) {
      ctx.success(null, `${NAME}删除成功`);
    } else {
      ctx.fail(`没有找到该${NAME}`);
    }
  } catch (err) {
    console.log(err);
    ctx.fail(`${NAME}删除失败`);
  }
}

export default {
  create,
  search,
  edit,
  remove,
};
