import express from 'express'
import { getCategories, addCategory, getKeywords, translateCategory } from '../controllers/categoryControllers.js'
import { admin, protect } from '../middlewares/authMiddleware.js'


const router = express.Router()

router
    .route('/')
    .post(protect, admin, addCategory)
    .get(getCategories)

router
    .route('/:id/translate')
    .post(protect, admin, translateCategory)


router
    .route('/keyword')
    .post(getKeywords)

export default router