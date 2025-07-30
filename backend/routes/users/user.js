import express from 'express';
import { login, logout, signup } from '../../controller/user/user.js';

const routes = express.Router();
import { protect, authorizeRoles } from '../../models/middleware/Auth.js';
routes.post('/signup', signup);
routes.post('/login', login);
routes.delete('/logout',protect,logout);

export default routes;