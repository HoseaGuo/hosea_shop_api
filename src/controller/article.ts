import {Context, Next} from 'koa';
import ArticleModel from '../database/models/article';

export async function search(ctx: Context , next: Next){
  let docs = await ArticleModel.find();
  ctx.body = docs
}

export async function create(ctx: Context , next: Next){
  // console.log(ctx.request.body)
  let article = new ArticleModel(ctx.request.body);

  let doc = await article.save();

  console.log(doc);

  ctx.body = "create"
}

export async function edit(ctx: Context , next: Next){
  ctx.body = "edit"
}

export async function remove(ctx: Context , next: Next){
  ctx.body = "remove"
}

export default {
  create,
  search,
  edit,
  remove
}