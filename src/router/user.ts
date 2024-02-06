import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { signin, signup } from '../controllers/user';

const router = express.Router();

router.post('/signup', expressAsyncHandler(signup));

router.post('/signin', expressAsyncHandler(signin));

export default router;
