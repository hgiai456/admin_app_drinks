import express from 'express';
import * as SizeController from '../controllers/SizeController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';

const route = express.Router();

// GET /api/sizes
route.get('/', asyncHandle(SizeController.getSizes));

// GET /api/sizes/:id
route.get('/:id', asyncHandle(SizeController.getSizeById));

// POST /api/sizes
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(SizeController.insertSize)
);

// PUT /api/sizes/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(SizeController.updateSize)
);

// DELETE /api/sizes/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(SizeController.deleteSize)
);

export default route;