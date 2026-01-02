import express from 'express';
import * as BrandController from '../controllers/BrandController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';

const route = express.Router();

// GET /api/brands
route.get('/', asyncHandle(BrandController.getBrands));

// GET /api/brands/:id
route.get('/:id', asyncHandle(BrandController.getBrandById));

// POST /api/brands
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BrandController.insertBrand)
);

// PUT /api/brands/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BrandController.updateBrand)
);

// DELETE /api/brands/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BrandController.deleteBrand)
);

export default route;