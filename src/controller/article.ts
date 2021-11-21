import { Context, Next } from 'koa';
import ArticleModel from '../database/models/article';

export async function search(ctx: Context, next: Next) {
  let docs = await ArticleModel.find({});
  if (docs) {
    ctx.success(docs)
  } else {
    ctx.fail("查找失败")
  }
}

export async function create(ctx: Context, next: Next) {
  // console.log(ctx.request.body)
  let { title, content } = ctx.request.body;
  let article = new ArticleModel({
    title,
    content
  });

  let doc = await article.save();

  if (doc) {
    ctx.success("文章创建成功")
  } else {
    ctx.fail("文章创建失败")
  }

  // ctx.body = "create"
}

export async function edit(ctx: Context, next: Next) {
  ctx.body = "edit"
  console.log('123')
}

export async function remove(ctx: Context, next: Next) {
  ctx.body = "remove"
}

export default {
  create,
  search,
  edit,
  remove
}