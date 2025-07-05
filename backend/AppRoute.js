import express from 'express';
const router = express.Router();
import * as ProductController from './controllers/ProductController.js'; // thêm .js nếu dùng ES Module
import * as CategoryController from './controllers/CategoryController.js'; // thêm .js nếu dùng ES Module
import * as BrandController from './controllers/BrandController.js'; // thêm .js nếu dùng ES Module
import * as OrderController from './controllers/OrderController.js'; // thêm .js nếu dùng ES Module
import * as OrderDetailController from './controllers/OrderDetailController.js'; // thêm .js nếu dùng ES Module
import * as ImageController from './controllers/ImageController.js'; // thêm .js nếu dùng ES Module
import * as SizeController from './controllers/SizeController.js'; // thêm .js nếu dùng ES Module
import * as StoreController from './controllers/StoreController.js'; // thêm .js nếu dùng ES Module
import * as BannerController from './controllers/BannerController.js'; // thêm .js nếu dùng ES Module
import * as BannerDetailController from './controllers/BannerDetailController.js'; // thêm .js nếu dùng ES Module
import * as ProductImageController from './controllers/ProductImageController.js';
import * as ProDetailController from './controllers/ProDetailController.js';
import * as UserController from './controllers/UserController.js'; //CartController
import * as CartController from './controllers/CartController.js';
import * as CartItemController from './controllers/CartItemController.js';

import asyncHandle from './middlewares/asyncHandle.js';
import InsertProductRequest from './dtos/requests/product/InsertProductRequest.js';
import InsertCartItemRequest from './dtos/requests/cart_item/InserCartItemRequest.js';
import InsertCartRequest from './dtos/requests/cart/InsertCartRequest.js';
import InsertProductImageRequest from './dtos/requests/product_image/InsertProductImageRequest.js';
import UpdateProductRequest from './dtos/requests/product/UpdateProductRequest.js';
import validate from './middlewares/validate.js';
import InsertOrderRequest from './dtos/requests/order/InsertOrderRequest.js';
import InsertUserRequest from './dtos/requests/user/InsertUserRequest.js';
import uploadImageMiddleware from './middlewares/imageUpload.js';
import InsertBannerRequest from './dtos/requests/banner/InsertBannerRequest.js';
import InsertBannerDetailRequest from './dtos/requests/banner_detail/InsertBannerDetailRequest.js';
import InsertProDetailRequest from './dtos/requests/prodetail/InsertProDetailRequest.js';
import UpdateProDetailRequest from './dtos/requests/prodetail/UpdateProDetailRequest.js';
import validateImageExists from './middlewares/validateImageExists.js';
import uploadImageGoogleMiddleware from './middlewares/imageGoogleUpload.js';
export function AppRoute(app) {
    //Product
    // http://localhost:3000/products
    router.get('/products', asyncHandle(ProductController.getProducts));
    router.get('/products/:id', asyncHandle(ProductController.getProductsById));
    router.post(
        '/products',
        validate(InsertProductRequest),
        validateImageExists,
        asyncHandle(ProductController.insertProducts)
    );
    router.put(
        '/products/:id',
        validate(UpdateProductRequest),
        validateImageExists,
        asyncHandle(ProductController.updateProducts)
    );
    router.delete(
        '/products/:id',
        asyncHandle(ProductController.deleteProducts)
    );
    //User
    router.get('/users', asyncHandle(UserController.getUsers));
    router.get('/users/:id', asyncHandle(UserController.getUserById));
    router.post(
        '/users',
        validate(InsertUserRequest),
        asyncHandle(UserController.insertUser)
    );
    router.put('/users/:id', asyncHandle(UserController.updateUser));
    router.delete('/users/:id', asyncHandle(UserController.deleteUser));

    ///Category
    router.get('/categories', asyncHandle(CategoryController.getCategories));
    router.get(
        '/categories/:id',
        asyncHandle(CategoryController.getCategoryById)
    );
    router.post(
        '/categories',
        validateImageExists,
        asyncHandle(CategoryController.insertCategory)
    );
    router.delete(
        '/categories/:id',

        asyncHandle(CategoryController.deleteCategory)
    );
    router.put(
        '/categories/:id',
        validateImageExists,
        asyncHandle(CategoryController.updateCategory)
    );

    router.get('/orders', asyncHandle(OrderController.getOrders));
    router.get('/orders/:id', asyncHandle(OrderController.getOrderById));
    router.post(
        '/orders',
        validate(InsertOrderRequest),
        asyncHandle(OrderController.insertOrder)
    );
    router.delete('/orders/:id', asyncHandle(OrderController.deleteOrder));
    router.put('/orders/:id', asyncHandle(OrderController.updateOrder));

    router.get('/brands', asyncHandle(BrandController.getBrands));
    router.get('/brands/:id', asyncHandle(BrandController.getBrandById));
    router.post('/brands', asyncHandle(BrandController.insertBrand));
    router.delete('/brands/:id', asyncHandle(BrandController.deleteBrand));
    router.put('/brands/:id', asyncHandle(BrandController.updateBrand));

    router.get(
        '/orderDetails',
        asyncHandle(OrderDetailController.getOrderDetails)
    );
    router.get(
        '/orderDetails/:id',
        asyncHandle(OrderDetailController.getOrderDetailById)
    );
    router.post(
        '/orderDetails',
        asyncHandle(OrderDetailController.insertOrderDetail)
    );
    router.delete(
        '/orderDetails/:id',
        asyncHandle(OrderDetailController.deleteOrderDetail)
    );
    router.put(
        '/orderDetails/:id',
        asyncHandle(OrderDetailController.updateOrderDetail)
    );

    // Routes for StoreController
    router.get('/stores', asyncHandle(StoreController.getStores)); // Lấy danh sách cửa hàng
    router.get('/stores/:id', asyncHandle(StoreController.getStoreById)); // Lấy thông tin cửa hàng theo ID
    router.post(
        '/stores',
        validateImageExists,
        asyncHandle(StoreController.insertStore)
    ); // Thêm mới cửa hàng
    router.delete('/stores/:id', asyncHandle(StoreController.deleteStore)); // Xóa cửa hàng theo ID
    router.put(
        '/stores/:id',
        validateImageExists,
        asyncHandle(StoreController.updateStore)
    ); // Cập nhật thông tin cửa hàng theo ID

    // Routes for SizeController
    router.get('/sizes', asyncHandle(SizeController.getSizes)); // Lấy danh sách kích thước
    router.get('/sizes/:id', asyncHandle(SizeController.getSizeById)); // Lấy thông tin kích thước theo ID
    router.post('/sizes', asyncHandle(SizeController.insertSize)); // Thêm mới kích thước
    router.delete('/sizes/:id', asyncHandle(SizeController.deleteSize)); // Xóa kích thước theo ID
    router.put('/sizes/:id', asyncHandle(SizeController.updateSize)); // Cập nhật kích thước theo ID
    //Routes for BannerController
    router.get('/banners', asyncHandle(BannerController.getBanners)); // Lấy danh sách banner
    router.get('/banners/:id', asyncHandle(BannerController.getBannerById)); // Lấy banner theo ID
    router.post(
        '/banners',
        validate(InsertBannerRequest),
        validateImageExists,
        asyncHandle(BannerController.insertBanner)
    ); // Thêm mới banner
    router.put(
        '/banners/:id',
        validateImageExists,
        asyncHandle(BannerController.updateBanner)
    ); // Cập nhật banner theo ID
    router.delete('/banners/:id', asyncHandle(BannerController.deleteBanner)); // Xóa banner theo ID

    //Routes for BannerDetailController
    router.get(
        '/banner-details',
        asyncHandle(BannerDetailController.getBannerDetails)
    );
    router.get(
        '/banner-details/:id',
        asyncHandle(BannerDetailController.getBannerDetailById)
    );
    router.post(
        '/banner-details',
        validate(InsertBannerDetailRequest),
        asyncHandle(BannerDetailController.insertBannerDetail)
    );
    router.put(
        '/banner-details/:id',
        asyncHandle(BannerDetailController.updateBannerDetail)
    );
    router.delete(
        '/banner-details/:id',
        asyncHandle(BannerDetailController.deleteBannerDetail)
    );

    // Routes for ProductImage
    router.get(
        '/product-images',
        asyncHandle(ProductImageController.getProductImages)
    );

    router.get(
        '/product-images/:id',
        asyncHandle(ProductImageController.getProductImageById)
    );

    router.post(
        '/product-images',
        validate(InsertProductImageRequest),
        asyncHandle(ProductImageController.insertProductImage)
    );

    router.delete(
        '/product-images/:id',
        asyncHandle(ProductImageController.deleteProductImage)
    );

    // // router.put(
    // //     '/product-images/:id',
    // //     asyncHandle(ProductImageController.updateProductImage)
    // // );

    //Routes for CartController
    router.get('/carts', asyncHandle(CartController.getCarts)); // Lấy danh sách giỏ hàng
    router.get('/carts/:id', asyncHandle(CartController.getCartById)); // Lấy giỏ hàng theo ID
    router.post(
        '/carts',
        validate(InsertCartRequest),
        asyncHandle(CartController.insertCart)
    ); // Thêm mới giỏ hàng
    router.post('/carts/checkout', asyncHandle(CartController.checkoutCart)); //Checkout
    router.delete('/carts/:id', asyncHandle(CartController.deleteCart)); // Xoá giỏ hàng theo ID

    //Routes for CartItemController
    router.get('/cart-items', asyncHandle(CartItemController.getCartItems)); // Lấy danh sách item theo cart_id
    router.get(
        '/cart-items/:id',
        asyncHandle(CartItemController.getCartItemById)
    ); // Lấy item theo ID
    router.get(
        '/cart-items/carts/:cart_id',
        asyncHandle(CartItemController.getCartItemByCartId)
    );
    router.post(
        '/cart-items',
        validate(InsertCartItemRequest),
        asyncHandle(CartItemController.insertCartItem)
    ); // Thêm item vào giỏ
    router.put(
        '/cart-items/:id',
        asyncHandle(CartItemController.updateCartItem)
    ); // Cập nhật số lượng item
    router.delete(
        '/cart-items/:id',
        asyncHandle(CartItemController.deleteCartItem)
    ); // Xoá item khỏi giỏ

    // Routes for ProDetailController
    router.get('/prodetails', asyncHandle(ProDetailController.getProDetails)); // Lấy danh sách chi tiết sản phẩm
    router.get(
        '/prodetails/:id',
        asyncHandle(ProDetailController.getProDetailById)
    ); // Lấy thông tin chi tiết sản phẩm theo ID
    router.post(
        '/prodetails',
        validate(InsertProDetailRequest),
        validateImageExists,
        asyncHandle(ProDetailController.insertProDetail)
    ); // Thêm mới chi tiết sản phẩm
    router.put(
        '/prodetails/:id',
        validate(UpdateProDetailRequest),
        validateImageExists,
        asyncHandle(ProDetailController.updateProDetail)
    ); // Cập nhật chi tiết sản phẩm theo ID
    router.delete(
        '/prodetails/:id',
        asyncHandle(ProDetailController.deleteProDetail)
    ); // Xóa chi tiết sản phẩm theo ID

    //ImageController
    router.post(
        '/images/upload',
        uploadImageMiddleware.array('images', 5), //upload images
        ImageController.uploadImages
    );

    router.post(
        '/images/google/upload',
        uploadImageGoogleMiddleware.single('image'), //upload a image
        ImageController.uploadImagesToGoogleStorage
    );
    router.delete('/images/delete', ImageController.deletedImage);

    router.get('/images/:fileName', asyncHandle(ImageController.viewImages));

    app.use('/api/', router);
}
