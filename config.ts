type Config = {
  /* api服务端口号 */
  serverPort: number;
  /* 数据库名称 */
  databaseName: string;
  /* 打包后页面存放到服务上的绝对路径 */
  webDir: string;
};

type ConfigObj = {
  [key: string]: Config;
};

const key = process.env.KEY || "www";

const configObj: ConfigObj = {
  www: {
    serverPort: 9925,
    databaseName: "hosea",
    webDir: "/data/www/hosea",
  },
  test: {
    serverPort: 2255,
    databaseName: "hoseaTest",
    webDir: "/data/www/test.hosea",
  },
};

const config: Config = configObj[key];

export default config;
