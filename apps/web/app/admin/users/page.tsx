'use client';

import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Key,
  Trash2,
  Edit2,
  Check,
  X,
  RefreshCw,
  Globe,
  AlertCircle
} from 'lucide-react';
import { useAdminAuth, UserRole } from '@/lib/adminAuthContext';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: 'active' | 'suspended';
  allowedModules: string[];
  createdAt: string;
  hasPassword?: boolean;
}

export default function AdminUsersPage() {
  const { user: currentUser, isSuperAdmin, switchRoleQuick } = useAdminAuth();

  const [users, setUsers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Modal / Form state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<TeamMember | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'MANAGER' as UserRole,
    password: ''
  });

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      } else {
        setErrorMsg(data.error || 'Failed to load team users');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error connecting to users database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSuperAdmin) {
      loadUsers();
    }
  }, [isSuperAdmin]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(`Created ID for ${formData.name} (${formData.role})`);
        setIsAddModalOpen(false);
        setFormData({ name: '', email: '', role: 'MANAGER', password: '' });
        loadUsers();
      } else {
        setErrorMsg(data.error || 'Failed to create user');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: formData.name,
          role: formData.role,
          password: formData.password || undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        showSuccess(`Updated ${formData.name}`);
        setEditingUser(null);
        setFormData({ name: '', email: '', role: 'MANAGER', password: '' });
        loadUsers();
      } else {
        setErrorMsg(data.error || 'Update failed');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  const handleDeleteUser = async (u: TeamMember) => {
    if (u.id === 'usr_admin_01') {
      alert('Cannot delete primary root administrator.');
      return;
    }
    if (!confirm(`Are you sure you want to permanently delete user "${u.name}" (${u.email})?`)) return;

    try {
      const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showSuccess(`Deleted user ${u.name}`);
        loadUsers();
      } else {
        alert(data.error || 'Delete failed');
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="max-w-2xl mx-auto bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-xl font-black text-amber-950">Super Admin Access Required</h2>
        <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
          User &amp; Role ID management is restricted to Super Administrators. Your current role is <strong>{currentUser?.role}</strong>.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => switchRoleQuick('SUPER_ADMIN')}
            className="px-4 py-2 bg-[#102b4c] text-white rounded-xl text-xs font-bold hover:bg-[#f36b21] transition-colors cursor-pointer"
          >
            Switch to Super Admin Preview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#102b4c] tracking-tight">
              Team, Roles &amp; Subdomain IDs
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-xs font-extrabold">
              RBAC Security
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage credentials, permissions, and roles for <strong>admin.hastinamotorparts.in</strong>, <strong>manager.hastinamotorparts.in</strong> &amp; <strong>editor.hastinamotorparts.in</strong>.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', role: 'MANAGER', password: '' });
            setIsAddModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-[#f36b21] hover:bg-[#db5b12] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add New Team Member</span>
        </button>
      </div>

      {/* Hostinger Subdomain Verification Card */}
      <div className="bg-gradient-to-r from-[#102b4c] to-[#183c63] text-white rounded-2xl p-5 shadow-sm border border-[#1f4b7a]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Hostinger DNS Subdomains Active
              </span>
            </div>
            <p className="text-xs text-slate-200">
              The following subdomains are live on Hostinger DNS and routed to this secure RBAC portal:
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-mono font-bold border border-white/20">
              admin.hastinamotorparts.in
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-mono font-bold border border-white/20">
              manager.hastinamotorparts.in
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/10 text-white text-xs font-mono font-bold border border-white/20">
              editor.hastinamotorparts.in
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#102b4c]" />
            <h3 className="font-bold text-sm text-[#102b4c]">Authorized Team Users</h3>
            <span className="text-xs text-slate-400 font-medium">({users.length} members)</span>
          </div>
          <button
            type="button"
            onClick={loadUsers}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
            title="Refresh Users"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#102b4c] text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">User &amp; Email</th>
                <th className="py-3 px-4">Role &amp; Privileges</th>
                <th className="py-3 px-4">Allowed Modules</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const roleBadgeColor =
                  u.role === 'SUPER_ADMIN'
                    ? 'bg-purple-100 text-purple-950 border-purple-200'
                    : u.role === 'MANAGER'
                    ? 'bg-amber-100 text-amber-950 border-amber-200'
                    : 'bg-emerald-100 text-emerald-950 border-emerald-200';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#102b4c]">{u.name}</div>
                      <div className="font-mono text-xs text-slate-500">{u.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-extrabold border ${roleBadgeColor}`}>
                        {u.role === 'SUPER_ADMIN' && '👑 '}
                        {u.role === 'MANAGER' && '💼 '}
                        {u.role === 'EDITOR' && '✍️ '}
                        {u.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {u.allowedModules.map((m) => (
                          <span key={m} className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-medium">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Active</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingUser(u);
                            setFormData({
                              name: u.name,
                              email: u.email,
                              role: u.role,
                              password: ''
                            });
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-[#102b4c] cursor-pointer"
                          title="Edit User Role / Reset Password"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        {u.id !== 'usr_admin_01' && (
                          <button
                            type="button"
                            onClick={() => handleDeleteUser(u)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Breakdown Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <h3 className="font-black text-sm text-[#102b4c] uppercase tracking-wider">
          Role-Based Access Control (RBAC) Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Super Admin */}
          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">👑</span>
              <strong className="text-purple-950 font-bold">SUPER_ADMIN (Executive)</strong>
            </div>
            <p className="text-purple-900 leading-relaxed text-[11px]">
              Full administrative privileges. Controls database, adds/removes team accounts, updates company settings, manages all RFQs, and publishes parts.
            </p>
          </div>

          {/* Manager */}
          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">💼</span>
              <strong className="text-amber-950 font-bold">MANAGER (Operations &amp; Sales)</strong>
            </div>
            <p className="text-amber-900 leading-relaxed text-[11px]">
              Oversees catalogue parts and customer inquiries. Can update stock/MOQ, view &amp; reply to RFQs, and export CSVs. Cannot delete users or change system settings.
            </p>
          </div>

          {/* Editor */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-base">✍️</span>
              <strong className="text-emerald-950 font-bold">EDITOR (Catalogue &amp; Content)</strong>
            </div>
            <p className="text-emerald-900 leading-relaxed text-[11px]">
              Focuses exclusively on parts, technical diagrams, categories, and descriptions. Cannot view customer RFQs, inquiries, system logs, or user credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {(isAddModalOpen || editingUser) && (
        <div className="fixed inset-0 z-50 bg-[#041120]/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
            <div className="bg-[#102b4c] text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base">
                {editingUser ? `Edit User: ${editingUser.name}` : 'Add New Team Member'}
              </h3>
              <button
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                className="text-slate-300 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  disabled={!!editingUser}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. rahul@hastinamotorparts.in"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21] disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assigned Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
                >
                  <option value="SUPER_ADMIN">👑 SUPER_ADMIN (Full Access)</option>
                  <option value="MANAGER">💼 MANAGER (Catalogue + Customer RFQs)</option>
                  <option value="EDITOR">✍️ EDITOR (Catalogue Only)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {editingUser ? 'New Password (Leave blank to keep existing)' : 'Set Password'}
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#f36b21]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingUser(null); }}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#f36b21] hover:bg-[#db5b12] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  {editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
