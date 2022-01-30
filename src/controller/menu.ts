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

async function deleteTreeById(id: string) {
  // 找到所有子目录
  let docs = await MenuModel.find({ parentId: id });

  // 递归删除所有子目录
  await Promise.allSettled(docs.map((doc: any) => deleteTreeById(doc._id)));

  // 删除本身
  await MenuModel.findByIdAndDelete(id);
}

/* 删除 */
export async function remove(ctx: Context, next: Next) {
  let { _id } = ctx.request.body;

  try {
    let doc = await MenuModel.findById(_id);

    if (doc) {
      await deleteTreeById(doc._id);
      ctx.success(null, `${NAME}删除成功`);
    } else {
      ctx.fail(`没有找到该${NAME}`);
    }
  } catch (err) {
    console.log(err);
    ctx.fail(`${NAME}删除失败`);
  }
}

const MENU_CONFIG_PATH = "/backend/system/menu";
/* 创建后台菜单配置目录，用以给后台可以进行进一步的操作 */
export function initMenuConfiguration() {
  MenuModel.findOne({ path: MENU_CONFIG_PATH }, (err: any, doc: any) => {
    if (!doc) {
      const menu = new MenuModel({
        name: "菜单配置",
        path: "/backend/system/menu",
      });
      menu.save();
    }
  });
}

export default {
  create,
  search,
  edit,
  remove,
  initMenuConfiguration,
};
