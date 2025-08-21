import {Router} from "express"
import { translateController } from '../controller/api.controller.js';
import { EmailVerification } from '../controller/user.controller.js';

const router = Router();

router.post('/translate', translateController);

router.post('/user', EmailVerification);
export {router}
