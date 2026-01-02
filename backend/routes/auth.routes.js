import express from 'express';
import * as UserController from '../controllers/UserController.js';
import asyncHandle from '../middlewares/asyncHandle.js';
import validate from '../middlewares/validate.js';
import InsertUserRequest from '../dtos/requests/user/InsertUserRequest.js';
import LoginUserRequest from '../dtos/requests/user/LoginUserRequest.js';

const router = express.Router();

// POST /api/auth/register
router.post(
    '/register',
    validate(InsertUserRequest),
    asyncHandle(UserController.registerUser)
);

// POST /api/auth/login
router.post(
    '/login',
    validate(LoginUserRequest),
    asyncHandle(UserController.login)
);

export default router;