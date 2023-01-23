import express from 'express'
import { blockUser, deleteUser, getUserById, getUserProfile, getUsers, login, makeUserAdmin, register, unblockUser, updateUser, updateUserProfile } from '../controllers/userControllers.js'
import { admin, protect } from '../middlewares/authMiddleware.js'


const router = express.Router()

router.route('/').get(protect,admin,getUsers)
router.route('/login').post(login)
router.route('/register').post(register)
router
  .route('/profile')
  .get(protect,getUserProfile)
  .put(protect,updateUserProfile)

router
  .route('/:id')
  .delete(protect, admin,deleteUser)
  .get(protect,getUserById)
  .put(protect, admin,updateUser)

router
    .route('/:id/block')
    .post(protect,admin,blockUser)

router
    .route('/:id/unblock')
    .post(protect,admin,unblockUser)

router
    .route('/:id/admin')
    .post(protect,admin,makeUserAdmin)

export default router