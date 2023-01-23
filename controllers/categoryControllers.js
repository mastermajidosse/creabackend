import asyncHandler from 'express-async-handler'
import Category from '../models/Category.js'


// @desc    Fetch all categories
// @route   GET /api/categories?name=name
// @access  Public
const getCategories = asyncHandler(async(req,res) => {
    const name = req.query.name
    ? {
        name: {
          $regex: req.query.name,
          $options: 'i',
        },
      }
    : {}
    const categories = await Category.find({...name})
    res.status(200).json(categories)
})
// @desc    Add a category
// @route   POST /api/categories
// @access  Public
const addCategory = asyncHandler(async(req,res) => {
    const {name,keywords,color} = req.body
    const category = new Category()
    category.name.en = name
    category.keywords = keywords
    category.color = color
    const createdCat = await category.save();
    res.status(201).json(createdCat)
})
// @desc    get the keywords of a category
// @route   POST /api/categories/keywords
// @access  Public
const getKeywords = asyncHandler(async(req,res) => {
    const {keyword} = req.body
    const category = await Category.findOne({'name':keyword})

    res.status(200).json(category.keywords)
})
// @desc    translate a category
// @route   POST /api/categories/:id/translate
// @access  Private
const translateCategory = asyncHandler(async (req, res) => {
    const cat = await Category.findById(req.params.id)
    const { name } = req.body
    if (cat) {
        cat.name.ar = name
        const translated = await cat.save()
        res.status(200).json(translated)
    } else {
        res.status(404).json({ message: "Category not found" })
    }
})




export {
    getCategories,
    addCategory,
    getKeywords,
    translateCategory
}