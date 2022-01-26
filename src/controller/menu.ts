import { Context, Next } from "koa";
import MenuModel from "../database/models/menu";

const NAME = "目录";

/* 新增 */
export async function create(ctx: Context, next: Next) {
  let menu = new MenuModel(ctx.request.body);
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

  let docs;

  let query: any;

  if (_id) {
    query = MenuModel.findById(_id);
  } else {
    query = MenuModel.find();
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
  let { _id, ...rest } = ctx.request.body;
  try {
    let res = await MenuModel.findByIdAndUpdate(_id, rest);
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

  let res = await MenuModel.deleteOne({
    _id,
  });

  if (res.deletedCount === 1) {
    ctx.success(res, `${NAME}删除成功`);
  } else {
    ctx.fail(`${NAME}修改失败`);
  }
}

export default {
  create,
  search,
  edit,
  remove,
};
