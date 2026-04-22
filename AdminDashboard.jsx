import { useEffect, useState } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'

export default function AdminDashboard() {
  const [users, setUsers] = useState([])
  const [kycQueue, setKycQueue] = useState([])

  useEffect(() => {
    api.get('/admin/users').then(r => setUsers(r.data))
    api.get('/admin/kyc/pending').then(r => setKycQueue(r.data))
  }, [])

  const handleApprove = async (kycId) => {
    await api.put(`/admin/kyc/${kycId}/approve`)
    toast.success('KYC Approved')
    setKycQueue(kycQueue.filter(k => k._id !== kycId))
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl"><p className="text-slate-400">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        <div className="bg-slate-800 p-4 rounded-xl"><p className="text-slate-400">Pending KYC</p><p className="text-2xl font-bold">{kycQueue.length}</p></div>
      </div>
      <h2 className="text-xl font-bold mb-4">KYC Queue</h2>
      {kycQueue.map(k => (
        <div key={k._id} className="bg-slate-800 p-4 rounded-lg mb-2 flex justify-between">
          <div><p>{k.fullName}</p><p className="text-slate-400">{k.country} | {k.phone}</p></div>
          <button onClick={() => handleApprove(k._id)} className="bg-green-600 px-4 py-2 rounded-lg">Approve</button>
        </div>
      ))}
    </div>
  )
}