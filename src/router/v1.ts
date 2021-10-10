import Router from '@koa/router';
// import ArticleModels from '../database/models/article'; 
import articleController from '../controller/article'

const router = new Router();

// 搜索
router.get('/article', articleController.search);

// 新增
router.post('/article', articleController.create);

// 修改
router.put('/article', articleController.edit);

// 删除
router.delete('/article', articleController.remove);


router.get('/search', async (ctx: any) => {
  ctx.body = "xxx";
});

export default router;
