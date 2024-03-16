import express from 'express';
import { addUser, findUserByDetails, getallUser, updateUser } from './CheckUser.Controller.js';

const router = express.Router();


router.get('/checkuser', getallUser);
router.post('/findUserByDetails', findUserByDetails);
router.post('/checkuser', addUser);
router.put('/checkuser/:_id', updateUser); 

export default router;
