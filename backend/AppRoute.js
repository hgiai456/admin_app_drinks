// import express from 'express';
// import cors from 'cors';
// const route = express.Router();
// import * as ProductController from './controllers/ProductController.js'; // thêm .js nếu dùng ES Module
// import * as CategoryController from './controllers/CategoryController.js'; // thêm .js nếu dùng ES Module
// import * as BrandController from './controllers/BrandController.js'; // thêm .js nếu dùng ES Module
// import * as OrderController from './controllers/OrderController.js'; // thêm .js nếu dùng ES Module
// import * as OrderDetailController from './controllers/OrderDetailController.js'; // thêm .js nếu dùng ES Module
// import * as ImageController from './controllers/ImageController.js'; // thêm .js nếu dùng ES Module
// import * as SizeController from './controllers/SizeController.js'; // thêm .js nếu dùng ES Module
// import * as StoreController from './controllers/StoreController.js'; // thêm .js nếu dùng ES Module
// import * as BannerController from './controllers/BannerController.js'; // thêm .js nếu dùng ES Module
// import * as BannerDetailController from './controllers/BannerDetailController.js'; // thêm .js nếu dùng ES Module
// import * as ProductImageController from './controllers/ProductImageController.js';
// import * as ProDetailController from './controllers/ProDetailController.js';
// import * as UserController from './controllers/UserController.js'; //CartController
// import * as CartController from './controllers/CartController.js';
// import * as CartItemController from './controllers/CartItemController.js';

// import * as PaymentController from './controllers/PaymentController.js';
// import asyncHandle from './middlewares/asyncHandle.js';
// import InsertProductRequest from './dtos/requests/product/InsertProductRequest.js';
// import InsertCartItemRequest from './dtos/requests/cart_item/InserCartItemRequest.js';
// import InsertCartRequest from './dtos/requests/cart/InsertCartRequest.js';
// import InsertProductImageRequest from './dtos/requests/product_image/InsertProductImageRequest.js';
// import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest.js';
// import validate from './middlewares/validate.js';
// import InsertUserRequest from './dtos/requests/user/InsertUserRequest.js';
// import LoginUserRequest from './dtos/requests/user/LoginUserRequest.js';
// import uploadImageMiddleware from './middlewares/imageUpload.js';
// import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest.js';
// import InsertBannerDetailRequest from './dtos/requests/banner_detail/InsertBannerDetailRequest.js';
// import InsertProDetailRequest from './dtos/requests/prodetail/InsertProDetailRequest.js';
// import UpdateProDetailRequest from './dtos/requests/prodetail/UpdateProDetailRequest.js';
// import validateImageExists from './middlewares/validateImageExists.js';
// import uploadImageGoogleMiddleware from './middlewares/imageGoogleUpload.js';
// import { requireRoles } from './middlewares/jwtMiddleware.js';
// import UserRole from './constants/UserRole.js';

// export function AppRoute(app) {
//     app.use(cors());

//     route.get('/products', asyncHandle(ProductController.getProducts));
//     route.get('/products/:id', asyncHandle(ProductController.getProductsById));
//     route.get(
//         '/products-by-category',
//         asyncHandle(ProductController.getAllProductsByCategory)
//     );
//     route.get('/products-all', asyncHandle(ProductController.getAllProducts));

//     route.get(
//         '/products-customize-page',
//         asyncHandle(ProductController.getProductsCustomizeSizePage)
//     ); //here
//     route.post(
//         '/products',
//         requireRoles([UserRole.ADMIN]), //Quyền Admin thì mới có quyền thêm sản phẩm
//         validate(InsertProductRequest),
//         validateImageExists,
//         asyncHandle(ProductController.insertProducts)
//     );
//     route.put(
//         '/products/:id',
//         requireRoles([UserRole.ADMIN]),
//         validate(UpdateProductRequest),
//         validateImageExists,
//         asyncHandle(ProductController.updateProducts)
//     );
//     route.delete(
//         '/products/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(ProductController.deleteProducts)
//     );
//     //User
//     route.get('/users', asyncHandle(UserController.getUsers));
//     route.get('/users/:id', asyncHandle(UserController.getUserById));
//     route.post(
//         '/users/register',
//         validate(InsertUserRequest),
//         asyncHandle(UserController.registerUser)
//     );
//     route.post(
//         '/users/login',
//         validate(LoginUserRequest),
//         asyncHandle(UserController.login)
//     );

//     route.put('/users/:id', asyncHandle(UserController.updateUser));
//     route.delete('/users/:id', asyncHandle(UserController.deleteUser));

//     ///Category
//     route.get('/categories', asyncHandle(CategoryController.getCategories));
//     route.get(
//         '/categories-all',
//         asyncHandle(CategoryController.getAllCategories)
//     );
//     route.get(
//         '/categories/:id',
//         asyncHandle(CategoryController.getCategoryById)
//     );
//     route.post(
//         '/categories',
//         requireRoles([UserRole.ADMIN]),
//         validateImageExists,
//         asyncHandle(CategoryController.insertCategory)
//     );
//     route.delete(
//         '/categories/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(CategoryController.deleteCategory)
//     );
//     route.put(
//         '/categories/:id',
//         requireRoles([UserRole.ADMIN]),
//         validateImageExists,
//         asyncHandle(CategoryController.updateCategory)
//     );
//     //
//     route.get(
//         '/orders/user/:user_id',
//         asyncHandle(OrderController.getOrdersByUserId)
//     );
//     route.get('/orders', asyncHandle(OrderController.getOrders));
//     route.get('/orders/:id', asyncHandle(OrderController.getOrderById));
//     // router.post(
//     //     '/orders',
//     //     validate(InsertOrderRequest),
//     //     asyncHandle(OrderController.insertOrder)
//     // );
//     route.delete(
//         '/orders/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(OrderController.deleteOrder)
//     );
//     route.put(
//         '/orders/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(OrderController.updateOrder)
//     );

//     route.get('/brands', asyncHandle(BrandController.getBrands));
//     route.get('/brands/:id', asyncHandle(BrandController.getBrandById));
//     route.post('/brands', asyncHandle(BrandController.insertBrand));
//     route.delete('/brands/:id', asyncHandle(BrandController.deleteBrand));
//     route.put('/brands/:id', asyncHandle(BrandController.updateBrand));

//     route.get(
//         '/orderDetails',
//         asyncHandle(OrderDetailController.getOrderDetails)
//     );
//     route.get(
//         '/orderDetails/:id',
//         asyncHandle(OrderDetailController.getOrderDetailById)
//     );
//     route.post(
//         '/orderDetails',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(OrderDetailController.insertOrderDetail)
//     );
//     route.delete(
//         '/orderDetails/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(OrderDetailController.deleteOrderDetail)
//     );
//     route.put(
//         '/orderDetails/:id',
//         asyncHandle(OrderDetailController.updateOrderDetail)
//     );

//     // Routes for StoreController
//     route.get('/stores', asyncHandle(StoreController.getStores)); // Lấy danh sách cửa hàng
//     route.get('/stores/:id', asyncHandle(StoreController.getStoreById)); // Lấy thông tin cửa hàng theo ID
//     route.post(
//         '/stores',
//         validateImageExists,
//         asyncHandle(StoreController.insertStore)
//     ); // Thêm mới cửa hàng
//     route.delete('/stores/:id', asyncHandle(StoreController.deleteStore)); // Xóa cửa hàng theo ID
//     route.put(
//         '/stores/:id',
//         validateImageExists,
//         asyncHandle(StoreController.updateStore)
//     ); // Cập nhật thông tin cửa hàng theo ID

//     // Routes for SizeController
//     route.get('/sizes', asyncHandle(SizeController.getSizes)); // Lấy danh sách kích thước
//     route.get('/sizes/:id', asyncHandle(SizeController.getSizeById)); // Lấy thông tin kích thước theo ID
//     route.post('/sizes', asyncHandle(SizeController.insertSize)); // Thêm mới kích thước
//     route.delete('/sizes/:id', asyncHandle(SizeController.deleteSize)); // Xóa kích thước theo ID
//     route.put('/sizes/:id', asyncHandle(SizeController.updateSize)); // Cập nhật kích thước theo ID
//     //Routes for BannerController
//     route.get('/banners', asyncHandle(BannerController.getBanners)); // Lấy danh sách banner
//     route.get('/banners/:id', asyncHandle(BannerController.getBannerById)); // Lấy banner theo ID
//     route.post(
//         '/banners',
//         requireRoles([UserRole.ADMIN]),
//         validate(InsertBannerRequest),
//         validateImageExists,
//         asyncHandle(BannerController.insertBanner)
//     ); // Thêm mới banner
//     route.put(
//         '/banners/:id',
//         requireRoles([UserRole.ADMIN]),
//         validateImageExists,
//         asyncHandle(BannerController.updateBanner)
//     ); // Cập nhật banner theo ID
//     route.delete(
//         '/banners/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(BannerController.deleteBanner)
//     ); // Xóa banner theo ID

//     //Routes for BannerDetailController
//     route.get(
//         '/banner-details',
//         asyncHandle(BannerDetailController.getBannerDetails)
//     );
//     route.get(
//         '/banner-details/:id',
//         asyncHandle(BannerDetailController.getBannerDetailById)
//     );
//     route.post(
//         '/banner-details',
//         validate(InsertBannerDetailRequest),
//         asyncHandle(BannerDetailController.insertBannerDetail)
//     );
//     route.put(
//         '/banner-details/:id',
//         asyncHandle(BannerDetailController.updateBannerDetail)
//     );
//     route.delete(
//         '/banner-details/:id',
//         asyncHandle(BannerDetailController.deleteBannerDetail)
//     );

//     // Routes for ProductImage
//     route.get(
//         '/product-images',
//         asyncHandle(ProductImageController.getProductImages)
//     );

//     route.get(
//         '/product-images/:id',
//         asyncHandle(ProductImageController.getProductImageById)
//     );

//     route.post(
//         '/product-images',
//         requireRoles([UserRole.ADMIN]),
//         validate(InsertProductImageRequest),
//         asyncHandle(ProductImageController.insertProductImage)
//     );

//     route.delete(
//         '/product-images/:id',
//         requireRoles([UserRole.ADMIN]),
//         asyncHandle(ProductImageController.deleteProductImage)
//     );

//     // // router.put(
//     // //     '/product-images/:id',
//     // //     asyncHandle(ProductImageController.updateProductImage)
//     // // );

//     //Routes for CartController
//     route.get('/carts', asyncHandle(CartController.getCarts)); // Lấy danh sách giỏ hàng
//     route.get('/carts/:id', asyncHandle(CartController.getCartById)); // Lấy giỏ hàng theo ID
//     route.get(
//         '/carts/user/:user_id',
//         asyncHandle(CartController.getCartByUserId)
//     );
//     route.get(
//         '/carts-by-session',
//         asyncHandle(CartController.getCartBySessionId)
//     );
//     route.post(
//         '/carts',
//         validate(InsertCartRequest),
//         asyncHandle(CartController.insertCart)
//     ); // Thêm mới giỏ hàng
//     route.post('/carts/checkout', asyncHandle(CartController.checkoutCart)); //Checkout
//     route.delete('/carts/:id', asyncHandle(CartController.deleteCart)); // Xoá giỏ hàng theo ID
//     route.delete('/carts/:id/clear', asyncHandle(CartController.clearCart)); // Xoá giỏ hàng theo ID

//     // clearCart
//     //Routes for CartItemController
//     route.get('/cart-items', asyncHandle(CartItemController.getCartItems)); // Lấy danh sách item theo cart_id
//     route.get(
//         '/cart-items/:id',
//         asyncHandle(CartItemController.getCartItemByCartId)
//     ); // Lấy item theo ID
//     route.get(
//         '/cart-items/carts/:cart_id',
//         asyncHandle(CartItemController.getCartItemByCartId)
//     );
//     route.post(
//         '/cart-items',
//         validate(InsertCartItemRequest),
//         asyncHandle(CartItemController.insertCartItem)
//     ); // Thêm item vào giỏ
//     route.put(
//         '/cart-items/:id',
//         asyncHandle(CartItemController.updateCartItem)
//     ); // Cập nhật số lượng item
//     route.delete(
//         '/cart-items/:id',
//         asyncHandle(CartItemController.deleteCartItem)
//     ); // Xoá item khỏi giỏ

//     //findProDetailByProductAndSize
//     // Routes for ProDetailController
//     route.get('/prodetails', asyncHandle(ProDetailController.getProDetails)); // Lấy danh sách chi tiết sản phẩm
//     route.get(
//         '/prodetails/:id',
//         asyncHandle(ProDetailController.getProDetailById)
//     ); // Lấy thông tin chi tiết sản phẩm theo ID
//     route.get(
//         '/prodetails-by-product',
//         asyncHandle(ProDetailController.getProDetailByProductId)
//     );
//     //getProDetailByProductId
//     route.get(
//         '/prodetail',
//         asyncHandle(ProDetailController.findProDetailByProductAndSize)
//     );
//     route.post(
//         '/prodetails',
//         validate(InsertProDetailRequest),
//         validateImageExists,
//         asyncHandle(ProDetailController.insertProDetail)
//     ); // Thêm mới chi tiết sản phẩm
//     route.put(
//         '/prodetails/:id',
//         validate(UpdateProDetailRequest),
//         validateImageExists,
//         asyncHandle(ProDetailController.updateProDetail)
//     ); // Cập nhật chi tiết sản phẩm theo ID
//     route.delete(
//         '/prodetails/:id',
//         asyncHandle(ProDetailController.deleteProDetail)
//     ); // Xóa chi tiết sản phẩm theo ID

//     //ImageController
//     route.post(
//         '/images/upload',
//         requireRoles([UserRole.ADMIN, UserRole.USER]),
//         uploadImageMiddleware.array('images', 5), //upload images
//         ImageController.uploadImages
//     );

//     route.post(
//         '/images/google/upload',
//         requireRoles([UserRole.ADMIN, UserRole.USER]),
//         uploadImageGoogleMiddleware.single('image'), //upload a image
//         ImageController.uploadImagesToGoogleStorage
//     );
//     route.delete('/images/delete', ImageController.deletedImage);

//     route.get('/images/:fileName', asyncHandle(ImageController.viewImages));

//     //Payment routes
//     route.post('/payments/create', asyncHandle(PaymentController.createPayment));

//     // PayOS webhook
//     route.post('/payments/payos/webhook', PaymentController.paymentWebhook);

//     // VNPAY IPN
//     route.get('/payments/vnpay/ipn', PaymentController.vnpayIPN);
//     route.get('/payments/vnpay/return', PaymentController.vnpayReturn);

    
//     route.get('/payments/verify', asyncHandle(PaymentController.verifyPayment));
//     route.get('/payments/status/:orderId', asyncHandle(PaymentController.getPaymentStatus));
//     //Lam toi buoc 8, chua test duoc
//     app.use('/api/', route);
// }

import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';

export function AppRoute(app) {
    
    app.use(cors());

    app.use(express.json());
   
    app.use('/api', routes);
    
    app.get('/health', (req, res) => {
        res.status(200).json({ 
            status: 'OK', 
            timestamp: new Date().toISOString() 
        });
    });
}