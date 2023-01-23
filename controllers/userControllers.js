import asyncHandler from 'express-async-handler'
import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'



// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({})
  res.json(users)
})

// @desc    login
// @route   GET /api/users/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    if (!user.blocked) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        country: user.country,
        token: generateToken(user._id),
        savedPosts: user.savedPosts,
        blocked: user.blocked,
        reports: user.reports
      })
    } else {
      res.status(401).json({ message: 'You account is blocked' })
    }
  } else {
    res.status(401).json({ message: 'Invalid email or password' })
  }
})
// @desc    register
// @route   GET /api/users/register
// @access  Public
const register = asyncHandler(async (req, res) => {
  const { name, email, password, country } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400).json({ message: 'User already exists' })
  }

  const user = await User.create({
    name,
    email,
    password,
    country
  })

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      country: user.country,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    res.json({ message: 'Invalid user data' })
  }
})

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      country: user.country
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.country = req.body.country || user.country
    user.phone = req.body.phone || user.phone
    user.image = req.body.image || user.image
    if (req.body.password) {
      user.password = req.body.password
    }

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      country: updatedUser.country,
      isAdmin: updatedUser.isAdmin,
      image: updatedUser.image,
      phone: updatedUser.phone,
      token: generateToken(updatedUser._id),
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})
// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    user.isAdmin = req.body.isAdmin
    user.country = req.body.country || user.country

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      country: updatedUser.country,
      isAdmin: updatedUser.isAdmin,
    })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})


// @desc    Block user
// @route   PUT /api/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.blocked = true
    await user.save()
    res.status(201).json({ message: "User blocked" })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc    Unblock a user
// @route   PUT /api/users/:id/unblock
// @access  Private/Admin
const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.blocked = false
    user.reports = 0
    await user.save()
    res.status(201).json({ message: "User unblocked" })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})

// @desc    Verify a user
// @route   PUT /api/users/:id/verify
// @access  Private/Admin

// @desc    Make a user as an admin
// @route   PUT /api/users/:id/admin
// @access  Private/Admin

const makeUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    user.isAdmin = true
    await user.save()
    res.status(201).json({ message: "This user is an admin now" })
  } else {
    res.status(404).json({ message: 'User not found' })
  }
})


export {
  login,
  register,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
  blockUser,
  unblockUser,
  makeUserAdmin
}