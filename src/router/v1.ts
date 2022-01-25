import Router from "@koa/router";
import articleController from "../controller/article";
import userController from "../controller/user";

const router = new Router({
  prefix: "/v1",
});

// 搜索
router.get("/article", articleController.search);

// 新增
router.post("/article", articleController.create);

// 修改
router.put("/article", articleController.edit);

// 删除
router.delete("/article", articleController.remove);

/* 用户 */
router.get('/user', userController.search);
router.post('/user', userController.create);
// router.put('/user', userController.edit);
router.delete('/user', userController.remove);
router.post('/user/login', userController.login);
router.post('/user/check-login', userController.checkLogin);

/* router.get("/search", async (ctx: any) => {
  ctx.body = "xxx";
}); */

export default router;
