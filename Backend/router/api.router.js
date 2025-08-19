import {Router} from "express"
import { translateController } from '../controller/api.controller.js';

const router = Router();

router.post('/translate', translateController);

export {router}
