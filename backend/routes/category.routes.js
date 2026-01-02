import express from 'express';
import * as CategoryController from '../controllers/CategoryController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import validateImageExists from '../middlewares/validateImageExists.js';

const route = express.Router();

// GET /api/categories
route.get('/', asyncHandle(CategoryController.getCategories));

// GET /api/categories/all
route.get('/all', asyncHandle(CategoryController.getAllCategories));

// GET /api/categories/:id
route.get('/:id', asyncHandle(CategoryController.getCategoryById));

// POST /api/categories
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    validateImageExists,
    asyncHandle(CategoryController.insertCategory)
);

// PUT /api/categories/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    validateImageExists,
    asyncHandle(CategoryController.updateCategory)
);

// DELETE /api/categories/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(CategoryController.deleteCategory)
);

export default route;