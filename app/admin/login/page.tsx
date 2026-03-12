import LoginForm from '@/components/admin/LoginForm'

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-serif text-2xl font-bold text-white mb-1">
            Studio<span className="text-accent">·</span>Craft
          </div>
          <p className="text-white/40 text-sm">Admin Panel</p>
        </div>
        <div className="bg-[#141414] border border-white/7 rounded-2xl p-8">
          <h1 className="font-serif text-xl font-bold text-white mb-1">Sign In</h1>
          <p className="text-white/40 text-sm mb-6">Enter your admin credentials to continue.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
