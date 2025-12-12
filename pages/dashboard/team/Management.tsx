import React, { useState } from 'react';
import { ShieldAlert, Users, HardDrive, BarChart3, UserPlus, Settings, Trash2, Edit2, Building } from 'lucide-react';
import { MOCK_USER } from '../../../constants';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { useLanguage } from '../../../lib/i18n';
import { InviteMemberModal, EditMemberRoleModal } from '../../../components/dashboard/SharedModals';

const INITIAL_MANAGEMENT_MEMBERS = [
    { id: '1', name: 'Sarah Chen', role: 'Admin', email: 'sarah@litewiki.com' },
    { id: '2', name: 'Mike Design', role: 'Member', email: 'mike@litewiki.com' },
    { id: '3', name: 'Jessica Wu', role: 'Member', email: 'jess@litewiki.com' },
    { id: '4', name: 'Tom Cook', role: 'Viewer', email: 'tom@litewiki.com' }
];

export const Management: React.FC = () => {
  const canAccess = MOCK_USER.role === 'team_leader' || MOCK_USER.role === 'admin';
  const { t } = useLanguage();
  const [members, setMembers] = useState(INITIAL_MANAGEMENT_MEMBERS);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // Role Editing State
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<{ id: string; name: string; role: string; email: string } | null>(null);

  // Team Profile State
  const [teamProfile, setTeamProfile] = useState({
    name: 'Engineering Team Alpha',
    description: 'Collaborative workspace for the core engineering group.'
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  if (!canAccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.team.accessDenied}</h2>
        <p className="text-gray-600 max-w-md">
          {t.team.accessDeniedDesc}
        </p>
      </div>
    );
  }

  const handleEditRole = (member: typeof INITIAL_MANAGEMENT_MEMBERS[0]) => {
      setMemberToEdit(member);
      setIsEditRoleOpen(true);
  };

  const handleUpdateRole = (id: string, newRole: string) => {
      setMembers(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
  };

  const handleDeleteMember = (id: string) => {
      if(window.confirm(t.common.confirmDelete)) {
          setMembers(prev => prev.filter(m => m.id !== id));
      }
  };

  const handleSaveProfile = () => {
      setIsSavingProfile(true);
      // Simulate API call
      setTimeout(() => {
          setIsSavingProfile(false);
          alert(t.team.profileUpdated);
      }, 800);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto h-full overflow-y-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">{t.team.managementTitle}</h2>
           <p className="text-gray-500">{t.team.managementDesc}</p>
        </div>
        <Button className="flex items-center gap-2" onClick={() => setIsInviteOpen(true)}>
           <UserPlus className="h-4 w-4" /> {t.team.inviteMember}
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg"><Users className="h-6 w-6" /></div>
            <div>
                <p className="text-sm text-gray-500">{t.team.totalMembers}</p>
                <h3 className="text-2xl font-bold text-gray-900">{members.length} / 20</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg"><HardDrive className="h-6 w-6" /></div>
            <div>
                <p className="text-sm text-gray-500">{t.dashboard.storageUsed}</p>
                <h3 className="text-2xl font-bold text-gray-900">4.2 GB</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg"><BarChart3 className="h-6 w-6" /></div>
            <div>
                <p className="text-sm text-gray-500">{t.team.weeklyActivity}</p>
                <h3 className="text-2xl font-bold text-gray-900">+124 {t.team.actions}</h3>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Members List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold text-gray-900">{t.team.memberPermissions}</h3>
                <span className="text-xs text-gray-500">{t.team.showingActive}</span>
            </div>
            <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                    <tr>
                        <th className="px-6 py-3 text-left">{t.team.membersTitle}</th>
                        <th className="px-6 py-3 text-left">{t.profile.role}</th>
                        <th className="px-6 py-3 text-right">{t.team.actions}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {members.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 group">
                            <td className="px-6 py-4">
                                <div>
                                    <div className="font-medium text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    user.role === 'Admin' || user.role === 'Team Leader' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => handleEditRole(user)}
                                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title={t.common.edit}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteMember(user.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title={t.common.delete}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {members.length === 0 && (
                        <tr>
                            <td colSpan={3} className="px-6 py-8 text-center text-gray-500 text-sm">
                                No members found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        {/* Settings Column */}
        <div className="space-y-6">
            
            {/* Team Profile Settings */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                 <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Building className="h-4 w-4" /> {t.team.teamProfileSettings}
                </h3>
                <div className="space-y-4">
                    <Input
                        label={t.team.teamName}
                        value={teamProfile.name}
                        onChange={(e) => setTeamProfile({...teamProfile, name: e.target.value})}
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t.team.teamDescription}
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors h-24 resize-none text-sm"
                            value={teamProfile.description}
                            onChange={(e) => setTeamProfile({...teamProfile, description: e.target.value})}
                        />
                    </div>
                    <Button fullWidth onClick={handleSaveProfile} disabled={isSavingProfile}>
                        {isSavingProfile ? t.common.processing : t.team.updateProfile}
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Settings className="h-4 w-4" /> {t.team.globalSettings}
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t.team.publicTeamProfile}</span>
                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t.team.allowInvites}</span>
                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">{t.team.require2FA}</span>
                        <input type="checkbox" className="h-4 w-4 text-primary-600 rounded" defaultChecked />
                    </div>
                </div>
            </div>

            <div className="bg-red-50 rounded-xl border border-red-100 p-6">
                <h3 className="font-bold text-red-700 mb-2">{t.team.dangerZone}</h3>
                <p className="text-xs text-red-600 mb-4">{t.team.deleteTeamDesc}</p>
                <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300">
                    {t.team.deleteTeam}
                </Button>
            </div>
        </div>
      </div>
      
      {/* Modals */}
      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
      
      {memberToEdit && (
          <EditMemberRoleModal 
            isOpen={isEditRoleOpen} 
            onClose={() => setIsEditRoleOpen(false)}
            member={memberToEdit}
            onSave={handleUpdateRole}
          />
      )}
    </div>
  );
};