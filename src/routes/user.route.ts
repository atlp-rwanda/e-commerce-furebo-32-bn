import express from 'express';
<<<<<<< HEAD
import { userSignup,userLogout  } from '../controllers/user.controller';

=======
import { userSignup,updateRole,userLogout  } from '../controllers/user.controller';
import { protectRoute, restrictTo } from '../middlewares/auth.middleware';
>>>>>>> d6b034ee33d42d1e12f841b6768cac4ee612b3ef
import userLogin from '../controllers/user.controller';
import { validateUser,validateUserLogin } from '../validations/user.validate';
import { checkBlacklist } from '../middleware/checkBlacklist';

const userRoutes = express.Router();

userRoutes.post('/signup',validateUser,userSignup);


userRoutes.post('/login', validateUserLogin, userLogin);
userRoutes.post('/logout', checkBlacklist, userLogout);

export default userRoutes;