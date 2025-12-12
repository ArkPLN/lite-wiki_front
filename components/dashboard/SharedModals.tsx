

import React, { useState } from 'react';
import { Folder, FileText, ChevronRight, ChevronDown, X, Plus, Link as LinkIcon, Mail, Phone, Copy, Check, Send, Shield, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useLanguage } from '../../lib/i18n';
import { FileNode, FileType, DashboardItem } from '../../types';



// --- FILE PICKER MODAL ---
interface FilePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (node: FileNode, path: string) => void;
  fileNodes: FileNode[];
}

export const FilePickerModal: React.FC<FilePickerModalProps> = ({ isOpen, onClose, onSelect, fileNodes }) => {
  const { t } = useLanguage();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<FileNode | null>(null);
  const [selectedPath, setSelectedPath] = useState<string>('');

  if (!isOpen) return null;

  const toggle = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSelect = (node: FileNode, path: string) => {
    setSelectedId(node.id);
    setSelectedNode(node);
    setSelectedPath(path);
  };

  const handleConfirm = () => {
    if (selectedNode) {
      // 调用onSelect但不立即关闭模态框
      // 让调用方决定何时关闭模态框
      onSelect(selectedNode, selectedPath);
    }
  };

  const renderTree = (nodes: FileNode[], pathPrefix: string = '') => {
    return nodes.map(node => {
      const isFolder = node.type === 'folder';
      const isOpen = expanded.has(node.id);
      const currentPath = `${pathPrefix}/${node.name}`;
      const isSelected = selectedId === node.id;

      return (
        <div key={node.id} className="pl-4">
          <div 
            className={`flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors text-sm ${isSelected ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100 text-gray-700'}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(node, currentPath);
              if (isFolder) toggle(node.id);
            }}
          >
            <span className="text-gray-400 w-4 flex justify-center">
              {isFolder && (isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />)}
            </span>
            <span className={isFolder ? 'text-blue-500' : 'text-gray-500'}>
              {isFolder ? <Folder className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            </span>
            <span className="truncate">{node.name}</span>
          </div>
          {isFolder && isOpen && node.children && (
            <div className="border-l border-gray-100 ml-3">
              {renderTree(node.children, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md flex flex-col max-h-[80vh] animate-fade-in-up">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-lg text-gray-900">{t.modals.filePickerTitle}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-4 bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
           {t.modals.selectFileDesc}
        </div>
        <div className="flex-1 overflow-y-auto p-2">
           {renderTree(fileNodes)}
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end gap-2 bg-gray-50 rounded-b-xl">
           <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
           <Button 
             disabled={!selectedId} 
             onClick={handleConfirm}
           >
             {t.common.select}
           </Button>
        </div>
      </div>
    </div>
  );
};

// --- EDIT ITEM MODAL ---
interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: DashboardItem;
  onSave: (id: string, newName: string, newTags: string[]) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, item, onSave }) => {
  const { t } = useLanguage();
  const [name, setName] = useState(item.name);
  const [tags, setTags] = useState<string[]>(item.tags || []);
  const [tagInput, setTagInput] = useState('');

  if (!isOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleSave = () => {
    onSave(item.id, name, tags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm animate-fade-in-up">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">{t.modals.editItemTitle}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          
          <div className="space-y-4">
            <Input 
              label={t.modals.aliasLabel}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t.modals.tagsLabel}</label>
              <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-200 rounded-lg min-h-[40px] bg-gray-50">
                 {tags.map(tag => (
                   <span key={tag} className="bg-white border border-gray-200 px-2 py-1 rounded-md text-xs font-medium text-gray-700 flex items-center gap-1 shadow-sm">
                     {tag}
                     <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                   </span>
                 ))}
                 {tags.length === 0 && <span className="text-gray-400 text-xs py-1 italic">{t.modals.noTags}</span>}
              </div>
              <div className="relative">
                 <input 
                   type="text"
                   value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   onKeyDown={handleAddTag}
                   placeholder={t.modals.addTagPlaceholder}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                 />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none">Enter ↵</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
             <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
             <Button onClick={handleSave}>{t.common.save}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- INVITE MEMBER MODAL ---
interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'link' | 'email' | 'phone'>('link');
  const [copied, setCopied] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Generated Link Mock
  const inviteLink = "https://litewiki.app/join/team-alpha-8x92ks";

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    // Simulate API call
    setInviteSent(true);
    setTimeout(() => {
        setInviteSent(false);
        onClose();
        setEmail('');
        setPhone('');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{t.modals.inviteMemberTitle}</h3>
              <p className="text-sm text-gray-500">{t.modals.inviteMemberDesc}</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-400"><X className="h-5 w-5" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
            <button
                onClick={() => setActiveTab('link')}
                className={`pb-3 pt-4 text-sm font-medium mr-6 transition-colors relative ${activeTab === 'link' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    {t.modals.tabLink}
                </div>
                {activeTab === 'link' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
            </button>
            <button
                onClick={() => setActiveTab('email')}
                className={`pb-3 pt-4 text-sm font-medium mr-6 transition-colors relative ${activeTab === 'email' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t.modals.tabEmail}
                </div>
                {activeTab === 'email' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
            </button>
            <button
                onClick={() => setActiveTab('phone')}
                className={`pb-3 pt-4 text-sm font-medium transition-colors relative ${activeTab === 'phone' ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t.modals.tabPhone}
                </div>
                {activeTab === 'phone' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></div>}
            </button>
        </div>

        {/* Content */}
        <div className="p-6">
            {activeTab === 'link' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="relative">
                        <input 
                            type="text" 
                            readOnly 
                            value={inviteLink}
                            className="w-full pl-3 pr-24 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none"
                        />
                        <button 
                            onClick={handleCopy}
                            className={`absolute right-1 top-1 bottom-1 px-3 rounded-md text-xs font-medium transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                        >
                            {copied ? (
                                <span className="flex items-center gap-1"><Check className="h-3 w-3" /> {t.modals.linkCopied}</span>
                            ) : (
                                <span className="flex items-center gap-1"><Copy className="h-3 w-3" /> {t.modals.copyLink}</span>
                            )}
                        </button>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100">
                        Anyone with this link can join as a Member. You can manage roles later.
                    </div>
                </div>
            )}

            {activeTab === 'email' && (
                <div className="space-y-4 animate-fade-in">
                    <Input 
                        label={t.modals.emailLabel}
                        placeholder={t.modals.emailPlaceholder}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        icon={<Mail className="h-4 w-4 text-gray-400" />}
                    />
                    <div className="flex justify-end">
                        <Button onClick={handleSendInvite} disabled={!email || inviteSent}>
                            {inviteSent ? t.modals.inviteSent : t.modals.sendInvite} <Send className="h-3 w-3 ml-2" />
                        </Button>
                    </div>
                </div>
            )}

             {activeTab === 'phone' && (
                <div className="space-y-4 animate-fade-in">
                    <Input 
                        label={t.modals.phoneLabel}
                        placeholder={t.modals.phonePlaceholder}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        icon={<Phone className="h-4 w-4 text-gray-400" />}
                    />
                    <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-500 mb-2">
                        <p className="font-semibold mb-1">Quick Contacts:</p>
                        <div className="flex gap-2">
                            <button onClick={() => setPhone('13800138000')} className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50">Alice</button>
                            <button onClick={() => setPhone('13900139000')} className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50">Bob</button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSendInvite} disabled={!phone || inviteSent}>
                             {inviteSent ? t.modals.inviteSent : t.modals.sendInvite} <Send className="h-3 w-3 ml-2" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- EDIT MEMBER ROLE MODAL ---
interface EditMemberRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: { id: string; name: string; role: string; email: string };
  onSave: (id: string, newRole: string) => void;
}

export const EditMemberRoleModal: React.FC<EditMemberRoleModalProps> = ({ isOpen, onClose, member, onSave }) => {
  const { t } = useLanguage();
  const [role, setRole] = useState(member.role);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(member.id, role);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm animate-fade-in-up">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-lg text-gray-900">{t.modals.editRoleTitle}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          
          <div className="space-y-4">
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">{t.common.fullName}</label>
               <div className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  {member.name}
               </div>
            </div>

            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">{t.modals.newRoleLabel}</label>
               <div className="relative">
                 <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm appearance-none cursor-pointer"
                 >
                    <option value="Team Leader">Team Leader</option>
                    <option value="Admin">Admin</option>
                    <option value="Member">Member</option>
                    <option value="Viewer">Viewer</option>
                 </select>
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                 </div>
               </div>
            </div>

            {/* Role description info */}
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 items-start">
               <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
               <p className="text-xs text-blue-700 leading-relaxed">
                  {role === 'Team Leader' ? 'Full control over team settings, billing, and member management.' :
                   role === 'Admin' ? 'Can manage content and invite members, but cannot delete the team.' :
                   role === 'Member' ? 'Can create and edit content, but cannot manage team settings.' :
                   'Read-only access to all team content.'}
               </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
             <Button variant="secondary" onClick={onClose}>{t.common.cancel}</Button>
             <Button onClick={handleSave}>{t.modals.updateRole}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};