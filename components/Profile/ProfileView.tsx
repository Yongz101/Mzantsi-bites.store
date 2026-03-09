
import React from 'react';
import { User, Mail, Phone, MapPin, History, Edit, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../../services/AuthContext';

const ProfileView: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-10">
        <div className="relative mb-4">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
            <img 
              src="https://picsum.photos/seed/car/400/400" 
              alt="Profile" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-1">{user.name || 'Aphelele'}</h2>
        <p className="text-white/40 text-sm font-medium">{user.email || 'aphelemsitshana4@gmail.com'}</p>
      </div>

      <div className="space-y-8">
        <div className="h-px bg-white/5 w-full mb-8" />
        <section>
          <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <User className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Full Name</p>
                </div>
              </div>
              <p className="text-sm font-medium text-white/60">{user.name || 'Aphelele'}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <Mail className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-[10px] text-white/30 truncate max-w-[150px]">{user.email || 'aphelemsitshana4@gmail.com'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-green-500/10 text-green-500 px-3 py-1.5 rounded-full border border-green-500/20">
                <CheckCircle className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <Phone className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Phone Number</p>
                  <p className="text-[10px] text-white/30">Not provided</p>
                </div>
              </div>
              <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                Add Number
              </button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2.5 bg-white/5 rounded-xl">
                  <MapPin className="w-5 h-5 text-white/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Address</p>
                </div>
              </div>
              <p className="text-xs font-medium text-white/60 text-right max-w-[180px]">
                3 Lindiwe Dlamini Rd, Umlazi F, ...
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-4 pt-6">
          <button className="w-full flex items-center justify-center gap-3 py-4 bg-transparent border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-colors">
            <History className="w-5 h-5" />
            <span>My Orders</span>
          </button>

          <button className="w-full flex items-center justify-center gap-3 py-4 bg-transparent border border-white/10 rounded-2xl text-white font-bold hover:bg-white/5 transition-colors">
            <Edit className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-3 py-4 bg-red-600/20 border border-red-600/30 rounded-2xl text-red-500 font-bold hover:bg-red-600/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
