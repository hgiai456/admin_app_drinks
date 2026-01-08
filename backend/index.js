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
  res.send("Listening port ${port}");
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
