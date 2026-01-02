import express from 'express';
import * as ImageController from '../controllers/ImageController.js';
import * as ProductImageController from '../controllers/ProductImageController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import uploadImageMiddleware from '../middlewares/imageUpload.js';
import uploadImageGoogleMiddleware from '../middlewares/imageGoogleUpload.js';
import InsertProductImageRequest from '../dtos/requests/product_image/InsertProductImageRequest.js';

const route = express.Router();

// ===== IMAGE UPLOAD ROUTES =====
// POST /api/images/upload
route.post(
    '/upload',
    requireRoles([UserRole.ADMIN, UserRole.USER]),
    uploadImageMiddleware.array('images', 5),
    ImageController.uploadImages
);

// POST /api/images/google/upload
route.post(
    '/google/upload',
    requireRoles([UserRole.ADMIN, UserRole.USER]),
    uploadImageGoogleMiddleware.single('image'),
    ImageController.uploadImagesToGoogleStorage
);

// DELETE /api/images/delete
route.delete('/delete', ImageController.deletedImage);

// GET /api/images/:fileName
route.get('/:fileName', asyncHandle(ImageController.viewImages));

// ===== PRODUCT IMAGE ROUTES =====
// GET /api/images/products
route.get('/products/all', asyncHandle(ProductImageController.getProductImages));

// GET /api/images/products/:id
route.get('/products/:id', asyncHandle(ProductImageController.getProductImageById));

// POST /api/images/products
route.post(
    '/products',
    requireRoles([UserRole.ADMIN]),
    validate(InsertProductImageRequest),
    asyncHandle(ProductImageController.insertProductImage)
);

// DELETE /api/images/products/:id
route.delete(
    '/products/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(ProductImageController.deleteProductImage)
);

export default route;