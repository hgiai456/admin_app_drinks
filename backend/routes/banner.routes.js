import express from 'express';
import * as BannerController from '../controllers/BannerController.js';
import * as BannerDetailController from '../controllers/BannerDetailController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import { requireRoles } from '../middlewares/jwtMiddleware.js';
import UserRole from '../constants/UserRole.js';
import InsertBannerRequest from '../dtos/requests/banner/InsertBannerRequest.js';
import InsertBannerDetailRequest from '../dtos/requests/banner_detail/InsertBannerDetailRequest.js';
import validateImageExists from '../middlewares/validateImageExists.js';

const route = express.Router();

// ===== BANNER ROUTES =====
// GET /api/banners
route.get('/', asyncHandle(BannerController.getBanners));

// GET /api/banners/:id
route.get('/:id', asyncHandle(BannerController.getBannerById));

// POST /api/banners
route.post(
    '/',
    requireRoles([UserRole.ADMIN]),
    validate(InsertBannerRequest),
    validateImageExists,
    asyncHandle(BannerController.insertBanner)
);

// PUT /api/banners/:id
route.put(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    validateImageExists,
    asyncHandle(BannerController.updateBanner)
);

// DELETE /api/banners/:id
route.delete(
    '/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BannerController.deleteBanner)
);

// ===== BANNER DETAIL ROUTES =====
// GET /api/banners/details
route.get('/details/all', asyncHandle(BannerDetailController.getBannerDetails));

// GET /api/banners/details/:id
route.get('/details/:id', asyncHandle(BannerDetailController.getBannerDetailById));

// POST /api/banners/details
route.post(
    '/details',
    requireRoles([UserRole.ADMIN]),
    validate(InsertBannerDetailRequest),
    asyncHandle(BannerDetailController.insertBannerDetail)
);

// PUT /api/banners/details/:id
route.put(
    '/details/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BannerDetailController.updateBannerDetail)
);

// DELETE /api/banners/details/:id
route.delete(
    '/details/:id',
    requireRoles([UserRole.ADMIN]),
    asyncHandle(BannerDetailController.deleteBannerDetail)
);

export default route;