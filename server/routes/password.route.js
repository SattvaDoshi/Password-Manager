import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { 
  createPassword, 
  getAllPasswords, 
  updatePassword, 
  deletePassword 
} from '../controllers/password.controller.js';

const router = express.Router();

router.post('/passwords', verifyToken, createPassword);
router.get('/passwords', verifyToken, getAllPasswords);
router.put('/passwords/:id', verifyToken, updatePassword);
router.delete('/passwords/:id', verifyToken, deletePassword);

export default router;