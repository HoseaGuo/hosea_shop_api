import Router from "@koa/router";
import articleController from "../controller/article";
import userController from "../controller/user";
import menuController from "../controller/menu";
import roleController from "../controller/role";

const router = new Router({
  prefix: "/v1", // 版本1
});

/* 文章 */
router.get("/article", articleController.search);
router.post("/article", articleController.create);
router.put("/article", articleController.edit);
router.delete("/article", articleController.remove);

/* 用户 */
router.get('/user', userController.search);
router.post('/user', userController.create);
router.put('/user', userController.edit);
router.delete('/user', userController.remove);
router.post('/user/login', userController.login);
router.post('/user/check-login', userController.checkLogin);

/* 目录 */
router.get('/menu', menuController.search);
router.post('/menu', menuController.create);
router.put('/menu', menuController.edit);
router.delete('/menu', menuController.remove);

/* 角色 */
router.get('/role', roleController.search);
router.post('/role', roleController.create);
router.put('/role', roleController.edit);
router.delete('/role', roleController.remove);

export default router;
