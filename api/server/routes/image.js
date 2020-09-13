import { Router } from 'express';
import imageController from '../controllers/image';
import imageSchema from '../schemas/image';
import validation from '../middleware/validation';
const imageRouter = Router();

imageRouter.put('/image/update', validation(imageSchema.put, 'params'), imageController.put);

export default imageRouter;
