import express from 'express';
import * as ProDetailController from '../controllers/ProDetailController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import InsertProDetailRequest from '../dtos/requests/prodetail/InsertProDetailRequest.js';
import UpdateProDetailRequest from '../dtos/requests/prodetail/UpdateProDetailRequest.js';
import validateImageExists from '../middlewares/validateImageExists.js';

const route = express.Router();

// GET /api/prodetails
route.get('/', asyncHandle(ProDetailController.getProDetails));

// GET /api/prodetails/by-product
route.get('/by-product', asyncHandle(ProDetailController.getProDetailByProductId));

// GET /api/prodetails/find
route.get('/find', asyncHandle(ProDetailController.findProDetailByProductAndSize));

// GET /api/prodetails/:id
route.get('/:id', asyncHandle(ProDetailController.getProDetailById));

// POST /api/prodetails
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    validate(InsertProDetailRequest),
    validateImageExists,
    asyncHandle(ProDetailController.insertProDetail)
);

// PUT /api/prodetails/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    validate(UpdateProDetailRequest),
    validateImageExists,
    asyncHandle(ProDetailController.updateProDetail)
);

// DELETE /api/prodetails/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(ProDetailController.deleteProDetail)
);

export default route;