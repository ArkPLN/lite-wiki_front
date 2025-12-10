

import React, { useState } from 'react';
import { Mail, MoreVertical, Shield, UserPlus, Snowflake, Trash2, ArrowRightLeft, User, X, Phone, Copy, Check, Calendar } from 'lucide-react';
import { TeamMember } from '../../../types';
import { useLanguage } from '../../../lib/i18n';
import { Button } from '../../../components/ui/Button';
import { InviteMemberModal } from '../../../components/dashboard/SharedModals';

// Mock Data with more details
const INITIAL_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Developer', email: 'alex@litewiki.com', phone: '138-1234-5678', bio: 'Full-stack developer obsessed with React and Node.js. Love building tools for productivity.', role: 'team_leader', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', joinedAt: 'Jan 2024', status: 'online' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@litewiki.com', phone: '139-8765-4321', bio: 'Product Manager turned Frontend Engineer. Focused on UX and Accessibility.', role: 'admin', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', joinedAt: 'Feb 2024', status: 'busy' },
  { id: '3', name: 'Mike Design', email: 'mike@litewiki.com', phone: '137-5555-6666', bio: 'Visual designer with a passion for clean, minimalist interfaces.', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', joinedAt: 'Mar 2024', status: 'offline' },
  { id: '4', name: 'Jessica Wu', email: 'jess@litewiki.com', phone: '150-1111-2222', bio: 'Backend wizard. Python and Go are my go-to languages.', role: 'member', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica', joinedAt: 'Mar 2024', status: 'online' },
  { id: '5', name: 'Tom Cook', email: 'tom@litewiki.com', phone: '188-9999-0000', bio: 'Documentation enthusiast. I make sure everything is legible.', role: 'viewer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tom', joinedAt: 'Apr 2024', status: 'offline' },
];

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const { t } = useLanguage();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-primary-600 transition-all relative group"
      title={t.team.directoryMenu.copy}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      {copied && (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-sm">
          {t.team.directoryMenu.copied}
        </span>
      )}
    </button>
  );
};

export const Directory: React.FC = () => {
  const { t } = useLanguage();
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleInvite = () => {
    setIsInviteOpen(true);
  };

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdownId(activeDropdownId === id ? null : id);
  };

  // Close dropdown when clicking outside
  const closeDropdown = () => setActiveDropdownId(null);

  const handleAction = (action: string, memberId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    closeDropdown();

    if (action === 'freeze') {
        setMembers(prev => prev.map(m => m.id === memberId ? { 
            ...m, 
            status: m.status === 'frozen' ? 'offline' : 'frozen' 
        } : m));
    } else if (action === 'remove') {
        if(window.confirm('Are you sure you want to remove this member?')) {
            setMembers(prev => prev.filter(m => m.id !== memberId));
        }
    } else if (action === 'migrate') {
        alert(`Migration dialog for member ${memberId} would appear.`);
    } else if (action === 'view') {
        const member = members.find(m => m.id === memberId);
        if (member) setSelectedMember(member);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto animate-fade-in relative" onClick={closeDropdown}>
      <div className="flex justify-between items-center mb-8">
        <div>
           <h2 className="text-xl font-bold text-slate-900">{t.team.membersTitle}</h2>
           <p className="text-gray-500 text-sm">{t.team.activeMembersSubtitle}</p>
        </div>
        <div className="flex gap-3">
             <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
               {t.team.exportList}
            </button>
            <Button onClick={handleInvite} className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                {t.team.inviteMember}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div 
            key={member.id} 
            onClick={() => setSelectedMember(member)}
            className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative group transition-all cursor-pointer ${member.status === 'frozen' ? 'opacity-75 bg-gray-50' : 'hover:border-primary-300 hover:shadow-md'}`}
          >
            <button 
                onClick={(e) => toggleDropdown(member.id, e)}
                className={`absolute top-4 right-4 p-1 rounded-md transition-colors z-10 ${activeDropdownId === member.id ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown Menu */}
            {activeDropdownId === member.id && (
                <div className="absolute top-12 right-4 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden animate-fade-in">
                    <div className="py-1">
                        <button 
                            onClick={(e) => handleAction('freeze', member.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <Snowflake className="h-4 w-4 text-blue-500" />
                            {member.status === 'frozen' ? t.team.directoryMenu.unfreezeAccount : t.team.directoryMenu.freezeAccount}
                        </button>
                        <button 
                            onClick={(e) => handleAction('migrate', member.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <ArrowRightLeft className="h-4 w-4 text-orange-500" />
                            {t.team.directoryMenu.migrateMember}
                        </button>
                        <button 
                            onClick={(e) => handleAction('view', member.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <User className="h-4 w-4 text-gray-500" />
                            {t.team.directoryMenu.viewDetails}
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button 
                            onClick={(e) => handleAction('remove', member.id, e)}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                            <Trash2 className="h-4 w-4" />
                            {t.team.directoryMenu.removeMember}
                        </button>
                    </div>
                </div>
            )}
            
            <div className="flex items-center gap-4 mb-4">
              <div className="relative group/avatar">
                <img src={member.avatar} alt={member.name} className={`h-16 w-16 rounded-full bg-gray-100 ${member.status === 'frozen' ? 'grayscale' : ''}`} />
                {/* Status Dot with Tooltip */}
                <div 
                   title={member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                   className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white cursor-help ${
                    member.status === 'online' ? 'bg-green-500' : 
                    member.status === 'busy' ? 'bg-red-500' : 
                    member.status === 'frozen' ? 'bg-blue-300' :
                    'bg-gray-300'
                }`} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <div className="flex items-center gap-1 mt-1">
                  {member.role === 'team_leader' && <Shield className="h-3 w-3 text-amber-500" />}
                  <span className={`text-xs font-medium uppercase tracking-wide ${
                    member.role === 'team_leader' ? 'text-amber-600' :
                    member.role === 'admin' ? 'text-purple-600' :
                    'text-gray-500'
                  }`}>
                    {member.role.replace('_', ' ')}
                  </span>
                </div>
                {member.status === 'frozen' && (
                    <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">
                        Frozen
                    </span>
                )}
              </div>
            </div>

            <div className="space-y-2 mt-4 pt-4 border-t border-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-2">
                   <Mail className="h-4 w-4 text-gray-400" />
                   <span className="truncate max-w-[150px]">{member.email}</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400 mt-2">
                <span>{t.team.joined} {member.joinedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setSelectedMember(null)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            {/* Header Background */}
            <div className="h-24 bg-gradient-to-r from-primary-500 to-indigo-600 relative">
               <button 
                 onClick={() => setSelectedMember(null)}
                 className="absolute top-4 right-4 p-1.5 bg-black/20 text-white hover:bg-black/30 rounded-full transition-colors"
               >
                 <X className="h-4 w-4" />
               </button>
            </div>
            
            <div className="px-8 pb-8">
               {/* Avatar & Basic Info */}
               <div className="relative -mt-12 mb-6 flex flex-col items-center text-center">
                  <div className="relative">
                    <img src={selectedMember.avatar} alt={selectedMember.name} className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md mb-3" />
                    <div 
                        title={selectedMember.status.charAt(0).toUpperCase() + selectedMember.status.slice(1)}
                        className={`absolute bottom-3 right-1 h-5 w-5 rounded-full border-2 border-white ${
                            selectedMember.status === 'online' ? 'bg-green-500' : 
                            selectedMember.status === 'busy' ? 'bg-red-500' : 
                            selectedMember.status === 'frozen' ? 'bg-blue-300' :
                            'bg-gray-300'
                        }`} 
                    />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedMember.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    {selectedMember.role === 'team_leader' && <Shield className="h-3.5 w-3.5 text-amber-500" />}
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        {selectedMember.role.replace('_', ' ')}
                    </span>
                  </div>
               </div>

               {/* Profile Details List */}
               <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-primary-600 shadow-sm">
                           <Mail className="h-4 w-4" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase">{t.common.email}</p>
                           <p className="text-sm font-semibold text-gray-900">{selectedMember.email}</p>
                        </div>
                     </div>
                     <CopyButton text={selectedMember.email} />
                  </div>

                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg text-green-600 shadow-sm">
                           <Phone className="h-4 w-4" />
                        </div>
                        <div>
                           <p className="text-xs text-gray-400 font-medium uppercase">{t.profile.telephone}</p>
                           <p className="text-sm font-semibold text-gray-900">{selectedMember.phone || 'N/A'}</p>
                        </div>
                     </div>
                     {selectedMember.phone && <CopyButton text={selectedMember.phone} />}
                  </div>

                  {selectedMember.bio && (
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-400 font-medium uppercase mb-2">{t.profile.bio}</p>
                          <p className="text-sm text-gray-700 leading-relaxed italic">"{selectedMember.bio}"</p>
                      </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2">
                     <Calendar className="h-3 w-3" />
                     {t.team.joined}: {selectedMember.joinedAt}
                  </div>
               </div>

               <div className="mt-8">
                  <Button fullWidth onClick={() => alert('Start chat feature coming soon!')}>
                     Start Conversation
                  </Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
    </div>
  );
};