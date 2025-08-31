import { Router } from 'express';
import { orderController } from '../controller/payment.controller';
const route = Router()

// order route
route.post('/order',orderController)


export {route}
