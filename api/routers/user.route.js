import express from 'express';
import { verifyToken } from '../utils/vetifyUser.js';
import { deleteUser, updateUser,signOut, getUsers, getUser } from '../controllers/user.controller.js';

const router=express.Router()

router.put('/updateuser/:userId',verifyToken,updateUser)
router.delete('/deleteuser/:userId',verifyToken,deleteUser)
router.get('/getusers',verifyToken,getUsers)
router.post('/signout/:userId',signOut)
router.get('/:userId',getUser)
export default router