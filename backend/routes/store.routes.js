import express from 'express';
import * as StoreController from '../controllers/StoreController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import validateImageExists from '../middlewares/validateImageExists.js';

const route = express.Router();

// GET /api/stores
route.get('/', asyncHandle(StoreController.getStores));

// GET /api/stores/:id
route.get('/:id', asyncHandle(StoreController.getStoreById));

// POST /api/stores
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    validateImageExists,
    asyncHandle(StoreController.insertStore)
);

// PUT /api/stores/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    validateImageExists,
    asyncHandle(StoreController.updateStore)
);

// DELETE /api/stores/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(StoreController.deleteStore)
);

export default route;