import express from 'express';

import { googleRedirect } from '../controllers/user.controller';
import { LoginViaGoogle } from '../controllers/user.controller';
import { googleAuthenticate } from '../controllers/user.controller';
import { googleAuthFailed } from '../controllers/user.controller';

import '../services/Login-By-Google.services'

const router = express.Router();

router.get('/google/auth',googleAuthenticate())

router.get('/google/callback',googleRedirect())

router.get('/google/token',LoginViaGoogle)

router.get('/google/failure',googleAuthFailed)

export default router;
