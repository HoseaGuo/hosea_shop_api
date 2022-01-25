import { Context, Next } from "koa";
import ArticleModel from "../database/models/article";

export async function search(ctx: Context, next: Next) {

  let { _id } = ctx.request.query;

  let docs;

  if (_id) {
    docs = await ArticleModel.findById(_id);
  } else {
    docs = await ArticleModel.find();
  }

  if (docs) {
    ctx.success(docs);
  } else {
    ctx.fail("搜索失败");
  }
}

export async function create(ctx: Context, next: Next) {
  // console.log(ctx.request.body);
  let article = new ArticleModel(ctx.request.body);

  try {
    let doc = await article.save();
    if (doc) {
      ctx.success(doc, "文章创建成功");
    } else {
      ctx.fail("文章创建失败");
    }
  } catch (err) {
    // console.log(err);
    ctx.fail("文章创建失败");
  }
}

export async function edit(ctx: Context, next: Next) {
  let { _id, content, title } = ctx.request.body;

  // console.log(_id);
  let res = await ArticleModel.updateOne({
    _id,
    title,
    content,
  });

  if (res.matchedCount) {
    ctx.success(null, "文章修改成功");
  } else {
    ctx.fail("文章修改失败");
  }
}

export async function remove(ctx: Context, next: Next) {
  let { _id } = ctx.request.body;

  let res = await ArticleModel.deleteOne({
    _id,
  });

  if (res.deletedCount === 1) {
    ctx.success(res, "删除成功");
  } else {
    ctx.fail("删除失败");
  }
}

export default {
  create,
  search,
  edit,
  remove,
};
