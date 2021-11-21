import mongoose, { Schema } from 'mongoose';
import updatePlugin from './plugins/update';


const PORT = 8888;
const DATABASE_NAME = 'hair';

async function connect() {
  // connection Events
  mongoose.connection.on('connected', err => {
    console.log(`mongodb数据库连接成功，端口号为：${PORT}`)
  });

  // 配置全局中间件 
  mongoose.plugin(updatePlugin);

  try {
    await mongoose.connect(`mongodb://localhost:${PORT}/${DATABASE_NAME}`, { autoIndex: false });
  } catch (error) {
    console.log('mongodb数据库连接失败，或者是由于mongodb数据库还没有启动！');
  }


}

export default connect;