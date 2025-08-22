import {Router} from "express"
import { translateController } from '../controller/api.controller.js';
import { EmailVerification,Verifyotp,Singin } from '../controller/user.controller.js';

const router = Router();

router.post('/translate', translateController);

router.post('/user', EmailVerification);

// route for the verified user
router.post('/verify', Verifyotp);

// route for the Singin
router.post('/signin', Singin);

export {router}
