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

import express from 'express';
import dotenv from 'dotenv';
import { AppRoute } from './AppRoute.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //http://localhost:3000/
    res.send('I am a project manager,My salary is 100 million. ');
});

const port = process?.env?.PORT ?? 3000;
AppRoute(app);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
