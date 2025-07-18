// npx sequelize-cli model:generate --name User --attributes email:string,password:string,name:string,role:integer,avatar:string,phone:integer,address:text

// npx sequelize-cli model:generate --name Category --attributes name:string,image:text x

// npx sequelize-cli model:generate --name Brand --attributes name:string,image:text x

// npx sequelize-cli model:generate --name Product --attributes name:string,description:text,image:text,brand_id:integer,category_id:integer,create_at:date,update_at:date

// npx sequelize-cli model:generate --name Size --attributes name:string x

// npx sequelize-cli model:generate --name ProDetail --attributes prouduct_id:integer,size_id:integer,buyturn:integer,specification:text,price:integer,oldprice:integer,quantity:integer,img1:text,img2:text,img3:text

// npx sequelize-cli model:generate --name Order --attributes user_id:integer,status:integer,note:text,total:integer,address:text,phone:integer

// npx sequelize-cli model:generate --name OrderDetail --attributes order_id:integer,product_id:integer,price:integer,quantity:integer

// npx sequelize-cli model:generate --name New --attributes title:string,image:text,content:text

// npx sequelize-cli model:generate --name NewDetail --attributes product_id:integer,news_id:integer

// npx sequelize-cli model:generate --name Banner --attributes name:string,image:text,status:integer

// npx sequelize-cli model:generate --name BannerDetail --attributes product_id:integer,banner_id:integer

// npx sequelize-cli model:generate --name FeedBack --attributes product_id:integer,user_id:integer,content:text,star:integer

import express from "express";
import dotenv from "dotenv";
import { AppRoute } from "./AppRoute.js";
dotenv.config();
import db from "./models";
const os = require("os");
import cors from "cors";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  //http://localhost:3000/
  res.send("I am a project manager,My salary is 100 million. ");
  res.send(process.env.DB_NAME);
});

const port = process?.env?.PORT ?? 3003;

// Healthcheck API toàn diện
app.get("/api/healthcheck", async (req, res) => {
  try {
    // ✅ Kiểm tra kết nối cơ sở dữ liệu
    await db.sequelize.authenticate();

    // ✅ Lấy thông tin tải CPU
    const cpuLoad = os.loadavg(); // [1m, 5m, 15m]
    const cpus = os.cpus();
    const cpuPercentage = (cpuLoad[0] / cpus.length) * 100;

    // ✅ Lấy thông tin sử dụng bộ nhớ và chuyển đổi sang megabytes
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: (memoryUsage.rss / 1024 / 1024).toFixed(2) + " MB", // Resident Set Size
      heapTotal: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2) + " MB",
      heapUsed: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2) + " MB",
      external: (memoryUsage.external / 1024 / 1024).toFixed(2) + " MB",
    };

    // ✅ Trả về kết quả
    res.status(200).json({
      status: "OK",
      database: "Connected",
      cpuLoad: {
        "1min": cpuLoad[0].toFixed(2),
        "5min": cpuLoad[1].toFixed(2),
        "15min": cpuLoad[2].toFixed(2),
        cpuPercentage: cpuPercentage.toFixed(2) + "%",
      },
      memory: memoryUsageMB,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      message: "Unable to connect to the database or system error",
      error: error.message,
    });
  }
});

AppRoute(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log("DB_PORT:", process.env.DB_PORT);
});
