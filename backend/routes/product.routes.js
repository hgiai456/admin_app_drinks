import express from 'express';
import * as ProductController from '../controllers/ProductController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import InsertProductRequest from '../dtos/requests/product/InsertProductRequest.js';
import UpdateProductRequest from '../dtos/requests/product/UpdateProductRequest.js';
import validateImageExists from '../middlewares/validateImageExists.js';

const router = express.Router();

// GET /api/products
router.get('/', asyncHandle(ProductController.getProducts));

// GET /api/products/all
router.get('/all', asyncHandle(ProductController.getAllProducts));

// GET /api/products/by-category
router.get('/by-category', asyncHandle(ProductController.getAllProductsByCategory));

// GET /api/products/customize-page
router.get('/customize-page', asyncHandle(ProductController.getProductsCustomizeSizePage));

// GET /api/products/:id
router.get('/:id', asyncHandle(ProductController.getProductsById));

// POST /api/products
router.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    validate(InsertProductRequest),
    validateImageExists,
    asyncHandle(ProductController.insertProducts)
);

// PUT /api/products/:id
router.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    validate(UpdateProductRequest),
    validateImageExists,
    asyncHandle(ProductController.updateProducts)
);

// DELETE /api/products/:id
router.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(ProductController.deleteProducts)
);

export default router;