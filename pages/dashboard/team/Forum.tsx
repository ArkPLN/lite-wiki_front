


import React, { useState, useRef } from 'react';
import { MessageCircle, ThumbsUp, Paperclip, Plus, Search, Filter, ArrowLeft, Download, Send, User, X, Check, UploadCloud, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { TeamPost, Comment } from '../../../types';
import { useLanguage } from '../../../lib/i18n';
import { MOCK_USER } from '../../../constants';
import { Input } from '../../../components/ui/Input';

const MOCK_POSTS: TeamPost[] = [
  {
    id: '1',
    title: 'Architecture Review for Q2',
    content: 'Hi everyone, I have uploaded the draft for the new microservices architecture. Please review the attached diagrams and leave your feedback by Friday. We are focusing on scalability and reducing latency in the notification service.',
    author: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'Team Leader' },
    tags: ['Announcement', 'Architecture'],
    likes: 12,
    isLiked: false,
    comments: 2,
    createdAt: '2 hours ago',
    attachments: ['diagram-v2.pdf', 'requirements.docx'],
    commentsList: [
        { id: 'c1', author: 'Mike Design', content: 'Looks great! I will add the frontend perspective.', timestamp: '1 hour ago' },
        { id: 'c2', author: 'Alex Developer', content: 'Can we schedule a quick sync call tomorrow?', timestamp: '30 mins ago' }
    ]
  },
  {
    id: '2',
    title: 'Authentication Bug in Staging',
    content: 'Is anyone else experiencing 401 errors when hitting the /api/user endpoint on staging? I checked the tokens and they seem valid. I suspect it might be related to the recent Redis update.',
    author: { name: 'Mike Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', role: 'Developer' },
    tags: ['Bug', 'Help Wanted'],
    likes: 3,
    isLiked: true,
    comments: 1,
    createdAt: '5 hours ago',
    commentsList: [
        { id: 'c3', author: 'Jessica Wu', content: 'Checking the logs now.', timestamp: '4 hours ago' }
    ]
  },
  {
    id: '3',
    title: 'Resource: New React Patterns 2024',
    content: 'Found this great article on the new React compiler and hook optimizations. Worth a read for our next sprint planning.',
    author: { name: MOCK_USER.name, avatar: MOCK_USER.avatar, role: MOCK_USER.role.replace('_', ' ') },
    tags: ['Resource', 'Learning'],
    likes: 18,
    isLiked: false,
    comments: 0,
    createdAt: '1 day ago',
    commentsList: []
  }
];

const AVAILABLE_TAGS = [
    { label: 'Announcement', color: 'bg-red-50 text-red-600 border-red-200' },
    { label: 'Bug', color: 'bg-orange-50 text-orange-600 border-orange-200' },
    { label: 'Question', color: 'bg-blue-50 text-blue-600 border-blue-200' },
    { label: 'Resource', color: 'bg-green-50 text-green-600 border-green-200' },
    { label: 'General', color: 'bg-gray-50 text-gray-600 border-gray-200' },
];

export const Forum: React.FC = () => {
  const [posts, setPosts] = useState(MOCK_POSTS);
  const [selectedPost, setSelectedPost] = useState<TeamPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const { t } = useLanguage();

  // Create Post State
  const [newPostData, setNewPostData] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    files: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePostClick = (post: TeamPost) => {
    setSelectedPost(post);
  };

  const handleBack = () => {
    setSelectedPost(null);
    setIsCreating(false);
    setEditingPostId(null);
    setNewComment('');
    setNewPostData({ title: '', content: '', tags: [], files: [] });
  };

  const handleToggleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation(); // Prevent opening the post when clicking like in list view

    const updatePost = (post: TeamPost) => {
        const newIsLiked = !post.isLiked;
        return {
            ...post,
            isLiked: newIsLiked,
            likes: newIsLiked ? post.likes + 1 : post.likes - 1
        };
    };

    setPosts(prevPosts => prevPosts.map(p => p.id === postId ? updatePost(p) : p));
    
    if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(prev => prev ? updatePost(prev) : null);
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim() || !selectedPost) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: MOCK_USER.name,
      content: newComment,
      timestamp: 'Just now'
    };

    // Update the selected post locally
    const updatedPost = {
        ...selectedPost,
        comments: selectedPost.comments + 1,
        commentsList: [...(selectedPost.commentsList || []), comment]
    };

    setSelectedPost(updatedPost);
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setNewComment('');
  };

  // Create Post Handlers
  const handleToggleTag = (tag: string) => {
    setNewPostData(prev => {
        const tags = prev.tags.includes(tag) 
            ? prev.tags.filter(t => t !== tag)
            : [...prev.tags, tag];
        return { ...prev, tags };
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        setNewPostData(prev => ({
            ...prev,
            files: [...prev.files, fileName]
        }));
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setNewPostData(prev => ({
        ...prev,
        files: prev.files.filter(f => f !== fileName)
    }));
  };

  const handlePublishPost = () => {
    if (!newPostData.title.trim() || !newPostData.content.trim()) return;

    if (editingPostId) {
        // Update existing post
        setPosts(prev => prev.map(p => p.id === editingPostId ? {
            ...p,
            title: newPostData.title,
            content: newPostData.content,
            tags: newPostData.tags.length > 0 ? newPostData.tags : ['General'],
            attachments: newPostData.files
        } : p));
    } else {
        // Create new post
        const newPost: TeamPost = {
            id: Date.now().toString(),
            title: newPostData.title,
            content: newPostData.content,
            author: {
                name: MOCK_USER.name,
                avatar: MOCK_USER.avatar,
                role: MOCK_USER.role.replace('_', ' ')
            },
            tags: newPostData.tags.length > 0 ? newPostData.tags : ['General'],
            likes: 0,
            isLiked: false,
            comments: 0,
            commentsList: [],
            createdAt: 'Just now',
            attachments: newPostData.files
        };
        setPosts([newPost, ...posts]);
    }

    handleBack();
  };

  const handleEditPost = (e: React.MouseEvent, post: TeamPost) => {
    e.stopPropagation();
    setNewPostData({
        title: post.title,
        content: post.content,
        tags: post.tags,
        files: post.attachments || []
    });
    setEditingPostId(post.id);
    setIsCreating(true);
  };

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (window.confirm(t.common.confirmDelete)) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost && selectedPost.id === postId) {
            handleBack();
        }
    }
  };

  // --- CREATE / EDIT POST VIEW ---
  if (isCreating) {
    return (
        <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto animate-fade-in">
             <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors font-medium"
            >
                <ArrowLeft className="h-4 w-4" /> {t.team.backToForum}
            </button>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">{editingPostId ? t.team.editDiscussion : t.team.createDiscussion}</h1>
                
                <div className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.team.titleLabel}</label>
                        <Input 
                            value={newPostData.title}
                            onChange={(e) => setNewPostData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Proposal for new API structure"
                            className="text-lg"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.team.tagsLabel}</label>
                        <div className="flex flex-wrap gap-3">
                            {AVAILABLE_TAGS.map(tag => {
                                const isSelected = newPostData.tags.includes(tag.label);
                                return (
                                    <button
                                        key={tag.label}
                                        onClick={() => handleToggleTag(tag.label)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all flex items-center gap-2 ${
                                            isSelected 
                                                ? tag.color + ' ring-2 ring-offset-1 ring-primary-500' 
                                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                                        }`}
                                    >
                                        {tag.label}
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.team.contentLabel}</label>
                        <textarea 
                            value={newPostData.content}
                            onChange={(e) => setNewPostData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y"
                            placeholder={t.team.replyPlaceholder}
                        />
                    </div>

                    {/* Attachments */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{t.team.attachments}</label>
                        <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
                        >
                            <UploadCloud className="h-8 w-8 mb-2 text-gray-400" />
                            <p className="text-sm font-medium">{t.team.dropFiles}</p>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                onChange={handleFileChange}
                            />
                        </div>
                        
                        {newPostData.files.length > 0 && (
                            <div className="mt-4 space-y-2">
                                {newPostData.files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Paperclip className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{file}</span>
                                        </div>
                                        <button 
                                            onClick={() => handleRemoveFile(file)}
                                            className="text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                        <Button variant="secondary" onClick={handleBack}>
                            {t.team.cancel}
                        </Button>
                        <Button onClick={handlePublishPost} disabled={!newPostData.title || !newPostData.content}>
                            {editingPostId ? t.team.update : t.team.publish}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- DETAIL VIEW ---
  if (selectedPost) {
    const isOwner = selectedPost.author.name === MOCK_USER.name;

    return (
        <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto animate-fade-in">
            <button 
                onClick={handleBack} 
                className="flex items-center gap-2 text-gray-500 hover:text-primary-600 mb-6 transition-colors font-medium"
            >
                <ArrowLeft className="h-4 w-4" /> {t.team.backToForum}
            </button>

            {/* Post Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="h-12 w-12 rounded-full bg-gray-100" />
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg">{selectedPost.author.name}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>{selectedPost.author.role}</span>
                                <span>•</span>
                                <span>{selectedPost.createdAt}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="flex gap-2">
                            {selectedPost.tags.map(tag => (
                                <span key={tag} className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                    tag === 'Announcement' ? 'bg-red-50 text-red-600' :
                                    tag === 'Bug' ? 'bg-orange-50 text-orange-600' :
                                    'bg-blue-50 text-blue-600'
                                }`}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                        {isOwner && (
                            <div className="flex gap-2 ml-4 pl-4 border-l border-gray-200">
                                <button 
                                    onClick={(e) => handleEditPost(e, selectedPost)}
                                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                    title={t.common.edit}
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button 
                                    onClick={(e) => handleDeletePost(e, selectedPost.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title={t.common.delete}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{selectedPost.title}</h1>
                <div className="prose prose-indigo max-w-none text-gray-600 leading-relaxed mb-8">
                    {selectedPost.content}
                </div>

                {/* Attachments */}
                {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                    <div className="mb-8">
                        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                             <Paperclip className="h-4 w-4" /> {t.team.attachments}
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {selectedPost.attachments.map(file => (
                                <div key={file} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                    <div className="p-2 bg-white rounded-md border border-gray-200">
                                        <Paperclip className="h-4 w-4 text-primary-600" />
                                    </div>
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-700">{file}</p>
                                        <p className="text-xs text-gray-400">2.4 MB</p>
                                    </div>
                                    <button className="ml-2 p-1.5 text-gray-400 hover:text-primary-600 rounded-full hover:bg-white transition-colors">
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="pt-6 border-t border-gray-100 flex items-center gap-6">
                     <button 
                        onClick={(e) => handleToggleLike(e, selectedPost.id)}
                        className={`flex items-center gap-2 transition-colors font-medium px-3 py-1.5 rounded-lg ${
                            selectedPost.isLiked 
                                ? 'text-blue-600 bg-blue-50' 
                                : 'text-gray-500 hover:text-primary-600 hover:bg-gray-50'
                        }`}
                    >
                        <ThumbsUp className={`h-5 w-5 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                        {selectedPost.likes} {t.team.likes}
                    </button>
                    <div className="flex items-center gap-2 text-gray-500">
                        <MessageCircle className="h-5 w-5" />
                        {selectedPost.comments} {t.team.comments}
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-gray-500" /> {t.team.comments} ({selectedPost.commentsList?.length || 0})
                </h3>
                
                <div className="space-y-6 mb-8">
                    {selectedPost.commentsList && selectedPost.commentsList.map(comment => (
                        <div key={comment.id} className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-primary-600 font-bold shadow-sm flex-shrink-0">
                                {comment.author.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm border border-gray-200">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <span className="font-bold text-gray-900">{comment.author}</span>
                                        <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!selectedPost.commentsList || selectedPost.commentsList.length === 0) && (
                        <p className="text-gray-500 italic text-sm ml-14">No comments yet. Be the first to reply!</p>
                    )}
                </div>

                {/* New Comment Input */}
                <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
                        <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <div className="relative">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder={t.team.replyPlaceholder}
                                className="w-full p-4 pr-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] resize-y shadow-sm"
                            />
                            <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                <Button 
                                    size="sm" 
                                    onClick={handlePostComment}
                                    disabled={!newComment.trim()}
                                    className="rounded-lg shadow-md"
                                >
                                    {t.team.postComment} <Send className="h-3 w-3 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  // --- LIST VIEW ---
  return (
    <div className="p-8 max-w-5xl mx-auto h-full overflow-y-auto animate-fade-in">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex gap-4">
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={t.team.searchDiscussions}
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                    />
                </div>
                <Button size="sm" variant="primary" className="px-4 shadow-none">{t.common.search}</Button>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" /> {t.team.filter}
            </Button>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2 shadow-lg shadow-primary-500/20">
            <Plus className="h-4 w-4" /> {t.team.newDiscussion}
        </Button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => {
            const isOwner = post.author.name === MOCK_USER.name;
            return (
                <div 
                    key={post.id} 
                    onClick={() => handlePostClick(post)}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary-200"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                            <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full bg-gray-100" />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{post.author.name}</h3>
                                <p className="text-xs text-gray-500">{post.author.role} • {post.createdAt}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag} className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        tag === 'Announcement' ? 'bg-red-50 text-red-600' :
                                        tag === 'Bug' ? 'bg-orange-50 text-orange-600' :
                                        'bg-blue-50 text-blue-600'
                                    }`}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            {isOwner && (
                                <div className="flex gap-1 ml-2 pl-2 border-l border-gray-100">
                                    <button 
                                        onClick={(e) => handleEditPost(e, post)}
                                        className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                        title={t.common.edit}
                                    >
                                        <Edit2 className="h-3.5 w-3.5" />
                                    </button>
                                    <button 
                                        onClick={(e) => handleDeletePost(e, post.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title={t.common.delete}
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">{post.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
                    
                    {post.attachments && post.attachments.length > 0 && (
                        <div className="mb-4 flex gap-2">
                            {post.attachments.map(file => (
                                <div key={file} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
                                    <Paperclip className="h-3 w-3" />
                                    {file}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-50 flex items-center gap-6 text-gray-500 text-sm">
                        <button 
                            onClick={(e) => handleToggleLike(e, post.id)}
                            className={`flex items-center gap-2 transition-colors z-10 hover:bg-gray-100 px-2 py-1 rounded-md ${
                                post.isLiked 
                                    ? 'text-blue-600' 
                                    : 'group-hover:text-primary-600'
                            }`}
                        >
                            <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                            {post.likes} {t.team.likes}
                        </button>
                        <div className="flex items-center gap-2 group-hover:text-primary-600 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments} {t.team.comments}
                        </div>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
};