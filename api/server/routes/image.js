import { Router } from 'express';
import imageController from '../controllers/image';
import imageSchema from '../schemas/image';
import validation from '../middleware/validation';
const imageRouter = Router();

imageRouter.put('/image/update', validation(imageSchema.put, 'body'), imageController.put);
imageRouter.get('/image/process', imageController.process);

export default imageRouter;
