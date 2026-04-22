import express from 'express'
import User from '../models/User.js'
import KYC from '../models/KYC.js'
import adminAuth from '../middleware/adminAuth.js'
const router = express.Router()

router.get('/users', adminAuth, async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password')
  res.json(users)
})

router.get('/kyc/pending', adminAuth, async (req, res) => {
  const pending = await KYC.find({ status: 'Pending' }).populate('userId', 'email')
  res.json(pending)
})

router.put('/kyc/:id/approve', adminAuth, async (req, res) => {
  const kyc = await KYC.findByIdAndUpdate(req.params.id, { status: 'Approved' }, { new: true })
  await User.findByIdAndUpdate(kyc.userId, { kycStatus: 'Approved' })
  res.json({ message: 'Approved', kyc })
})

export default router