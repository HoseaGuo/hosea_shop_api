import mongoose, { Schema } from "mongoose";
import updatePlugin from "./plugins/update";
import { initSuperAdmin } from "../controller/user";
import { initMenuConfiguration } from "../controller/menu";
import config from "../../config";

const PORT = 8888;
const DATABASE_NAME = config.databaseName;

async function connect() {
  // connection Events
  mongoose.connection.on("connected", err => {
    console.log(`mongodb数据库连接成功，端口号为：${PORT}`);

    // 初始化数据库的一些配置
    initSuperAdmin(); // 创建admin超级账号
    initMenuConfiguration(); // 创建菜单配置目录
  });

  // 配置全局中间件
  mongoose.plugin(updatePlugin);

  try {
    await mongoose.connect(`mongodb://127.0.0.1:${PORT}/${DATABASE_NAME}`, { autoIndex: false });
  } catch (error) {
    console.log(error);
    console.log("mongodb数据库连接失败，或者是由于mongodb数据库还没有启动！");
  }
}

async function initDatabase() {
  // 创建admin超级账号
  // UserModel.findOne({ username: DEFAULT_ADMIN_USERNAME }, (err: any, doc: any) => {
  //   if (!doc) {
  //   }
  // });
  // 创建菜单目录，用以给前端页面可以管理后台目录
}

export default connect;
