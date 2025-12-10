
import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  ArrowRight, 
  ThumbsUp, 
  MessageCircle, 
  Plus,
  Bot,
  Hash,
  Crown,
  ArrowLeft,
  Star,
  Flag,
  Image as ImageIcon,
  Smile,
  Link as LinkIcon,
  Share2,
  MoreHorizontal,
  Send,
  X,
  Paperclip,
  FileText,
  Folder,
  Search,
  Edit2,
  Trash2,
  UserPlus,
  UserCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { CommunityPost, CommunityTopic, CommunityTrendMember, Comment } from '@/types';
import { MOCK_USER } from '@/constants';

// Mock Data
const MOCK_TOPICS: CommunityTopic[] = [
  { id: '1', title: 'React 19 Release', description: 'Discussing the new features in the latest React version.', participants: 1240, hotIndex: 98, tags: ['React', 'Frontend'] },
  { id: '2', title: 'AI Integration', description: 'Best practices for integrating LLMs into web apps.', participants: 850, hotIndex: 92, tags: ['AI', 'LLM'] },
  { id: '3', title: 'System Design', description: 'Architectural patterns for scalable systems.', participants: 600, hotIndex: 85, tags: ['Backend', 'Architecture'] },
];

const MOCK_TRENDS: CommunityTrendMember[] = [
  { id: '1', name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', contributionScore: 1250, rank: 1, trend: 'up' },
  { id: '2', name: 'Alex Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', contributionScore: 1100, rank: 2, trend: 'stable' },
  { id: '3', name: 'Mike Design', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', contributionScore: 980, rank: 3, trend: 'up' },
];

const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: '1',
    title: 'How to optimize vector search performance?',
    content: 'I am running into latency issues when querying my vector database with 1M+ embeddings. Has anyone tried HNSW indexing vs IVF? What are the trade-offs?',
    author: { name: 'David Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', role: 'Data Scientist' },
    tags: ['Vector DB', 'Performance', 'AI', 'LLM'],
    likes: 45,
    isLiked: false,
    comments: 12,
    createdAt: '2 hours ago',
    aiSummary: 'User is experiencing latency with 1M+ embeddings. Discussion revolves around comparing HNSW and IVF indexing strategies for optimization.',
    views: 340,
    hotIndex: 95,
    commentsList: [
       { id: 'c1', author: 'Sarah Chen', content: 'HNSW is generally faster for recall but uses more memory. IVF is more memory efficient but can be slower.', timestamp: '1 hour ago' },
       { id: 'c2', author: 'Mike Design', content: 'Have you checked your dimensionality? Sometimes reducing dimensions via PCA helps a lot.', timestamp: '45 mins ago' },
       { id: 'c3', author: 'David Kim', content: 'Thanks Sarah! Memory is not an issue right now, so I will try HNSW.', timestamp: '30 mins ago' },
       { id: 'c4', author: 'System Bot', content: 'Don\'t forget to warm up the cache before benchmarking.', timestamp: '10 mins ago' },
    ]
  },
  {
    id: '2',
    title: 'The future of WebAssembly',
    content: 'With the rise of Rust and diverse browser capabilities, do you think WASM will replace JS for heavy lifting apps entirely? I found some interesting benchmarks.',
    author: { name: 'Emily White', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily', role: 'Engineer' },
    tags: ['WASM', 'Rust', 'Frontend'],
    likes: 32,
    isLiked: true,
    comments: 8,
    createdAt: '5 hours ago',
    aiSummary: 'Thread discusses the potential of WebAssembly replacing JS for performance-critical tasks, citing Rust adoption and browser support.',
    views: 210,
    hotIndex: 88,
    commentsList: [
       { id: 'c5', author: 'Alex Dev', content: 'It won\'t replace JS for DOM manipulation anytime soon, but for computation, absolutely.', timestamp: '4 hours ago' },
       { id: 'c6', author: 'Emily White', content: 'Agreed. The overhead of crossing the boundary is still real.', timestamp: '3 hours ago' },
    ]
  },
  {
    id: '3',
    title: 'React 19 Hooks: useOptimistic',
    content: 'Just tried the new useOptimistic hook in the canary build. It simplifies UI updates significantly!',
    author: { name: 'Sarah Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', role: 'Frontend Lead' },
    tags: ['React', 'Frontend'],
    likes: 112,
    isLiked: false,
    comments: 15,
    createdAt: '1 day ago',
    views: 500,
    hotIndex: 99,
    aiSummary: 'Discussion on the developer experience improvements in React 19, specifically focusing on optimistic UI updates.',
    commentsList: []
  }
];

const AdBanner: React.FC = () => {
    const { t } = useLanguage();
    return (
        <div className="my-6 p-4 bg-gray-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-2 right-2 text-[10px] text-gray-400 border border-gray-300 px-1 rounded">{t.community.adLabel}</div>
            <p className="text-sm font-semibold text-gray-700 mb-1">{t.community.sponsored}</p>
            <p className="text-xs text-gray-500 max-w-sm">
                Unlock premium features with Lite-Wiki Pro. Get unlimited storage and advanced AI models today.
            </p>
            <Button size="sm" variant="outline" className="mt-3 text-xs">Learn More</Button>
        </div>
    );
};

export const Community: React.FC = () => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  
  // Data State
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [trends, setTrends] = useState<CommunityTrendMember[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);

  // Subscriptions State
  const [subscribedAuthors, setSubscribedAuthors] = useState<Set<string>>(new Set());

  // View Navigation State
  const [viewMode, setViewMode] = useState<'list' | 'topic' | 'post' | 'create'>('list');
  const [selectedTopic, setSelectedTopic] = useState<CommunityTopic | null>(null);
  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  
  // UI State for inputs
  const [newComment, setNewComment] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [newTopicPostContent, setNewTopicPostContent] = useState('');

  // New Post Form State
  const [newPostForm, setNewPostForm] = useState({
    title: '',
    content: '',
    topicId: '',
    tags: [] as string[],
    tagInput: '',
    attachments: [] as string[]
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setTopics(MOCK_TOPICS);
      setTrends(MOCK_TRENDS);
      setPosts(MOCK_COMMUNITY_POSTS);
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Navigation Handlers ---

  const handleTopicClick = (topic: CommunityTopic) => {
    setSelectedTopic(topic);
    setViewMode('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostClick = (post: CommunityPost) => {
    setSelectedPost(post);
    setViewMode('post');
    setIsStarred(false); // Reset star state for new post
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePostClick = () => {
    // If we are in a topic view, pre-select that topic
    setNewPostForm({
      title: '',
      content: '',
      topicId: selectedTopic ? selectedTopic.id : '',
      tags: selectedTopic ? [...selectedTopic.tags] : [],
      tagInput: '',
      attachments: []
    });
    setEditingPostId(null);
    setViewMode('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setViewMode('list');
    setSelectedTopic(null);
    setSelectedPost(null);
    setEditingPostId(null);
  };

  const handleBackToTopic = () => {
    if (selectedTopic) {
        setViewMode('topic');
        setSelectedPost(null);
    } else {
        handleBackToHome();
    }
  };

  // --- Action Handlers ---

  const handleSubscribe = (e: React.MouseEvent, authorName: string) => {
    e.stopPropagation();
    setSubscribedAuthors(prev => {
        const next = new Set(prev);
        if (next.has(authorName)) {
            next.delete(authorName);
        } else {
            next.add(authorName);
        }
        return next;
    });
  };

  const handleLike = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    const updatePost = (p: CommunityPost) => ({
        ...p,
        isLiked: !p.isLiked,
        likes: p.isLiked ? p.likes - 1 : p.likes + 1
    });

    setPosts(prev => prev.map(p => p.id === postId ? updatePost(p) : p));
    if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(updatePost(selectedPost));
    }
  };

  const handleReport = () => {
    alert("Post reported to moderators.");
  };

  const handleStar = () => {
    setIsStarred(!isStarred);
  };

  const handleAddComment = () => {
    if (!selectedPost || !newComment.trim()) return;
    
    const comment: Comment = {
        id: Date.now().toString(),
        author: MOCK_USER.name,
        content: newComment,
        timestamp: 'Just now'
    };
    
    const updatedPost = {
        ...selectedPost,
        comments: selectedPost.comments + 1,
        commentsList: [...(selectedPost.commentsList || []), comment]
    };
    
    setSelectedPost(updatedPost);
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? updatedPost : p));
    setNewComment('');
  };

  const handleCreateTopicPost = () => {
    if (!newTopicPostContent.trim() || !selectedTopic) return;

    const newPost: CommunityPost = {
        id: Date.now().toString(),
        title: `Thoughts on ${selectedTopic.title}`, // Generic title for quick post, could add title input
        content: newTopicPostContent,
        author: { name: MOCK_USER.name, avatar: MOCK_USER.avatar, role: 'Member' },
        tags: selectedTopic.tags, // Inherit tags from topic
        likes: 0,
        isLiked: false,
        comments: 0,
        createdAt: 'Just now',
        views: 0,
        hotIndex: 0,
        commentsList: []
    };

    setPosts([newPost, ...posts]);
    setNewTopicPostContent('');
  };

  const handleToolClick = (tool: string) => {
    alert(`"${tool}" feature would open here.`);
  };

  // Create Post Handlers
  const handlePublishNewPost = () => {
    if (!newPostForm.title.trim() || !newPostForm.content.trim() || !newPostForm.topicId) {
        alert("Please fill in the title, content and select a topic.");
        return;
    }

    if (editingPostId) {
        // Update existing
        setPosts(prev => prev.map(p => p.id === editingPostId ? {
            ...p,
            title: newPostForm.title,
            content: newPostForm.content,
            tags: newPostForm.tags.length > 0 ? newPostForm.tags : ['General'],
            attachments: newPostForm.attachments
        } : p));
    } else {
        // Create new
        const newPost: CommunityPost = {
            id: Date.now().toString(),
            title: newPostForm.title,
            content: newPostForm.content,
            author: { name: MOCK_USER.name, avatar: MOCK_USER.avatar, role: 'Member' },
            tags: newPostForm.tags.length > 0 ? newPostForm.tags : ['General'],
            likes: 0,
            isLiked: false,
            comments: 0,
            createdAt: 'Just now',
            views: 0,
            hotIndex: 0,
            commentsList: [],
            attachments: newPostForm.attachments
        };
        setPosts([newPost, ...posts]);
    }

    // Redirect to list view
    setViewMode('list');
    setSelectedTopic(null); // Reset topic selection to show all posts including the new one
    setEditingPostId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPost = (e: React.MouseEvent, post: CommunityPost) => {
    e.stopPropagation();
    // Find Topic ID for this post (mocking it by taking first matching topic tag or default)
    const topicId = topics.find(t => post.tags.some(tag => t.tags.includes(tag)))?.id || topics[0].id;
    
    setNewPostForm({
        title: post.title,
        content: post.content,
        topicId: topicId, // Best guess or actual if stored
        tags: post.tags,
        tagInput: '',
        attachments: post.attachments || []
    });
    setEditingPostId(post.id);
    setViewMode('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = (e: React.MouseEvent, postId: string) => {
    e.stopPropagation();
    if (window.confirm(t.common.confirmDelete)) {
        setPosts(prev => prev.filter(p => p.id !== postId));
        if (selectedPost && selectedPost.id === postId) {
            handleBackToHome();
        }
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newPostForm.tagInput.trim()) {
        e.preventDefault();
        if (!newPostForm.tags.includes(newPostForm.tagInput.trim())) {
            setNewPostForm(prev => ({
                ...prev,
                tags: [...prev.tags, prev.tagInput.trim()],
                tagInput: ''
            }));
        }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
      setNewPostForm(prev => ({
          ...prev,
          tags: prev.tags.filter(tag => tag !== tagToRemove)
      }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          const fileName = e.target.files[0].name;
          setNewPostForm(prev => ({
              ...prev,
              attachments: [...prev.attachments, fileName]
          }));
      }
  };

  const handleSelectFromLibrary = () => {
      // Mock selection
      const mockFile = `My_Notes_${Math.floor(Math.random() * 100)}.md`;
      setNewPostForm(prev => ({
          ...prev,
          attachments: [...prev.attachments, mockFile]
      }));
  };

  const handleRemoveAttachment = (fileName: string) => {
      setNewPostForm(prev => ({
          ...prev,
          attachments: prev.attachments.filter(f => f !== fileName)
      }));
  };

  // --- Render Helpers ---

  // Reusable Post Card Component
  const renderPostCard = (post: CommunityPost) => {
    const isOwner = post.author.name === MOCK_USER.name;
    const isSubscribed = subscribedAuthors.has(post.author.name);

    return (
        <div 
            key={post.id} 
            onClick={() => handlePostClick(post)}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group"
        >
        {/* Post Header */}
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
            <img src={post.author.avatar} alt={post.author.name} className="h-10 w-10 rounded-full bg-gray-100" />
            <div>
                <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm group-hover:text-primary-600 transition-colors">{post.author.name}</h4>
                    {/* Subscribe Button */}
                    {!isOwner && (
                        <button
                            onClick={(e) => handleSubscribe(e, post.author.name)}
                            className={`text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                                isSubscribed
                                    ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                    : 'bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100'
                            }`}
                        >
                             {isSubscribed ? (
                                 <>
                                    <UserCheck className="h-3 w-3" />
                                    {t.community.subscribed}
                                 </>
                             ) : (
                                 <>
                                    <UserPlus className="h-3 w-3" />
                                    {t.community.subscribe}
                                 </>
                             )}
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500">{post.author.role} • {post.createdAt}</p>
            </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex gap-2">
                    {post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md font-medium">{tag}</span>
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

        {/* Post Content */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 hover:text-primary-600 transition-colors">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.content}</p>
        
        {/* Attachments Preview in Card */}
        {post.attachments && post.attachments.length > 0 && (
            <div className="flex gap-2 mb-4">
                {post.attachments.map((file, i) => (
                    <div key={i} className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                        <Paperclip className="h-3 w-3" />
                        <span className="truncate max-w-[150px]">{file}</span>
                    </div>
                ))}
            </div>
        )}

        {/* AI Summary Block */}
        {post.aiSummary && (
            <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-100 flex gap-3">
            <div className="p-1.5 bg-white rounded-md h-fit shadow-sm text-purple-600">
                <Bot className="h-4 w-4" />
            </div>
            <div>
                <span className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 block">{t.community.aiSummary}</span>
                <p className="text-xs text-gray-700 leading-relaxed">{post.aiSummary}</p>
            </div>
            </div>
        )}

        {/* Post Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-sm text-gray-500">
            <div className="flex gap-4">
            <button 
                className={`flex items-center gap-1.5 transition-colors z-10 ${post.isLiked ? 'text-blue-600 font-medium' : 'hover:text-blue-600'}`}
                onClick={(e) => handleLike(e, post.id)}
            >
                <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} /> {post.likes}
            </button>
            <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                <MessageCircle className="h-4 w-4" /> {post.comments}
            </button>
            </div>
            <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" /> {post.views} {t.community.views}
            </span>
            <div className="flex items-center gap-1 text-orange-500 font-bold text-xs">
                <Flame className="h-3.5 w-3.5 fill-current" /> {post.hotIndex}
            </div>
            </div>
        </div>
        </div>
    );
  };

  // --- Views ---

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8">
        <div className="w-full max-w-md space-y-4">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-600 animate-[progress_1.5s_ease-in-out_infinite] w-1/3"></div>
          </div>
          <p className="text-center text-gray-500 text-sm animate-pulse">{t.community.loading}</p>
        </div>
      </div>
    );
  }

  // --- VIEW: CREATE POST ---
  if (viewMode === 'create') {
      return (
        <div className="p-8 max-w-3xl mx-auto space-y-8 animate-fade-in bg-white min-h-full">
            <div className="flex justify-between items-center mb-6">
                <Button variant="ghost" onClick={() => setViewMode(selectedTopic ? 'topic' : 'list')} className="gap-2 pl-0 hover:bg-transparent hover:text-primary-600">
                    <ArrowLeft className="h-4 w-4" /> {t.community.cancelPost}
                </Button>
                <h1 className="text-2xl font-bold text-slate-900">{editingPostId ? t.community.editPostTitle : t.community.createPostTitle}</h1>
            </div>

            <div className="space-y-6">
                {/* Topic Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.community.selectTopic}</label>
                    <select
                        value={newPostForm.topicId}
                        onChange={(e) => setNewPostForm(prev => ({ ...prev, topicId: e.target.value }))}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                        <option value="" disabled>Select a topic</option>
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.id}>{topic.title}</option>
                        ))}
                    </select>
                </div>

                {/* Title Input */}
                <Input
                    label={t.community.postTitleLabel}
                    placeholder={t.community.postTitlePlaceholder}
                    value={newPostForm.title}
                    onChange={(e) => setNewPostForm(prev => ({ ...prev, title: e.target.value }))}
                    className="text-lg font-medium"
                />

                {/* Tags Input */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.community.tagsLabel}</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent">
                        {newPostForm.tags.map(tag => (
                            <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 text-sm rounded-md">
                                {tag}
                                <button onClick={() => handleRemoveTag(tag)} className="hover:text-primary-900"><X className="h-3 w-3" /></button>
                            </span>
                        ))}
                        <input
                            type="text"
                            value={newPostForm.tagInput}
                            onChange={(e) => setNewPostForm(prev => ({ ...prev, tagInput: e.target.value }))}
                            onKeyDown={handleAddTag}
                            placeholder={newPostForm.tags.length === 0 ? t.community.addTagPlaceholder : ""}
                            className="flex-1 outline-none text-sm min-w-[120px]"
                        />
                    </div>
                </div>

                {/* Content Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.community.postContentLabel}</label>
                    <textarea 
                        value={newPostForm.content}
                        onChange={(e) => setNewPostForm(prev => ({ ...prev, content: e.target.value }))}
                        placeholder={t.community.postContentPlaceholder}
                        className="w-full p-4 h-64 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-y text-base"
                    />
                </div>

                {/* Attachments */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{t.community.attachmentsLabel}</label>
                    <div className="flex gap-4 mb-4">
                         <div onClick={() => fileInputRef.current?.click()} className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary-400 cursor-pointer transition-colors">
                             <Paperclip className="h-6 w-6 mb-2" />
                             <span className="text-sm font-medium">{t.community.uploadFile}</span>
                             <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
                         </div>
                         <div onClick={handleSelectFromLibrary} className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-primary-400 cursor-pointer transition-colors">
                             <Folder className="h-6 w-6 mb-2" />
                             <span className="text-sm font-medium">{t.community.selectFromLibrary}</span>
                         </div>
                    </div>
                    
                    {newPostForm.attachments.length > 0 && (
                        <div className="space-y-2">
                            {newPostForm.attachments.map((file, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <FileText className="h-4 w-4 text-blue-500" />
                                        <span className="text-sm text-gray-700">{file}</span>
                                    </div>
                                    <button onClick={() => handleRemoveAttachment(file)} className="text-gray-400 hover:text-red-500">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-6 flex justify-end gap-3 border-t border-gray-100">
                    <Button variant="secondary" onClick={() => setViewMode(selectedTopic ? 'topic' : 'list')}>
                        {t.community.cancelPost}
                    </Button>
                    <Button onClick={handlePublishNewPost} className="min-w-[120px]">
                        {editingPostId ? t.community.updatePost : t.community.publishPost}
                    </Button>
                </div>
            </div>
        </div>
      );
  }

  // --- VIEW: POST DETAIL ---
  if (viewMode === 'post' && selectedPost) {
    const isOwner = selectedPost.author.name === MOCK_USER.name;
    const isSubscribed = subscribedAuthors.has(selectedPost.author.name);

    return (
      <div className="p-8 max-w-5xl mx-auto space-y-8 animate-fade-in bg-white min-h-full">
         <Button variant="ghost" onClick={handleBackToTopic} className="gap-2 pl-0 hover:bg-transparent hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" /> {selectedTopic ? t.community.backToTopics : t.community.backToCommunity}
         </Button>

         {/* Post Content */}
         <div className="space-y-6">
            <div className="flex justify-between items-start">
               <div className="flex items-center gap-4">
                   <img src={selectedPost.author.avatar} alt={selectedPost.author.name} className="h-12 w-12 rounded-full bg-gray-100" />
                   <div>
                       <div className="flex items-center gap-3">
                           <h1 className="text-lg font-bold text-gray-900">{selectedPost.author.name}</h1>
                           {/* Subscribe Button in Detail View */}
                            {!isOwner && (
                                <button
                                    onClick={(e) => handleSubscribe(e, selectedPost.author.name)}
                                    className={`text-[10px] flex items-center gap-1 px-2.5 py-1 rounded-full border transition-all ${
                                        isSubscribed
                                            ? 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200'
                                            : 'bg-primary-50 text-primary-600 border-primary-100 hover:bg-primary-100'
                                    }`}
                                >
                                    {isSubscribed ? (
                                        <>
                                            <UserCheck className="h-3 w-3" />
                                            {t.community.subscribed}
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-3 w-3" />
                                            {t.community.subscribe}
                                        </>
                                    )}
                                </button>
                            )}
                       </div>
                       <p className="text-sm text-gray-500">{selectedPost.author.role} • {selectedPost.createdAt}</p>
                   </div>
               </div>
               <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={handleStar} className={`gap-2 ${isStarred ? 'text-yellow-500 border-yellow-200 bg-yellow-50' : ''}`}>
                       <Star className={`h-4 w-4 ${isStarred ? 'fill-current' : ''}`} /> {t.community.star}
                   </Button>
                   <Button variant="ghost" size="sm" onClick={handleReport} className="text-gray-400 hover:text-red-500">
                       <Flag className="h-4 w-4" /> {t.community.report}
                   </Button>
                   {isOwner && (
                        <>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => handleEditPost(e, selectedPost)} 
                            className="text-gray-400 hover:text-primary-600"
                        >
                            <Edit2 className="h-4 w-4" /> {t.common.edit}
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={(e) => handleDeletePost(e, selectedPost.id)} 
                            className="text-gray-400 hover:text-red-600"
                        >
                            <Trash2 className="h-4 w-4" /> {t.common.delete}
                        </Button>
                        </>
                    )}
               </div>
            </div>

            <div>
                <div className="flex gap-2 mb-3">
                    {selectedPost.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">{tag}</span>
                    ))}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{selectedPost.title}</h2>
                <div className="prose prose-indigo max-w-none text-gray-700 leading-relaxed">
                    {selectedPost.content}
                </div>
            </div>
            
            {/* Attachments in Post Detail */}
            {selectedPost.attachments && selectedPost.attachments.length > 0 && (
                <div className="flex gap-3 mt-4 flex-wrap">
                    {selectedPost.attachments.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                            <div className="p-1.5 bg-white rounded border border-gray-100">
                                <FileText className="h-5 w-5 text-primary-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{file}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* AI Summary */}
            {selectedPost.aiSummary && (
                <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 flex gap-4">
                    <div className="p-2 bg-white rounded-lg h-fit shadow-sm text-purple-600">
                        <Bot className="h-5 w-5" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wide mb-1 block">{t.community.aiSummary}</span>
                        <p className="text-sm text-gray-700 leading-relaxed">{selectedPost.aiSummary}</p>
                    </div>
                </div>
            )}

            {/* Post Actions Row */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                <div className="flex gap-4">
                    <Button 
                        variant={selectedPost.isLiked ? 'secondary' : 'outline'} 
                        className={`gap-2 ${selectedPost.isLiked ? 'text-blue-600 bg-blue-50 border-blue-200' : ''}`}
                        onClick={(e) => handleLike(e, selectedPost.id)}
                    >
                        <ThumbsUp className={`h-4 w-4 ${selectedPost.isLiked ? 'fill-current' : ''}`} /> {selectedPost.likes}
                    </Button>
                    <Button variant="outline" className="gap-2">
                        <Share2 className="h-4 w-4" /> {t.community.share}
                    </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                     <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {selectedPost.views} {t.community.views}</span>
                     <span className="flex items-center gap-1"><MessageCircle className="h-4 w-4" /> {selectedPost.comments} {t.community.reply}</span>
                </div>
            </div>
         </div>

         {/* Discussion Section */}
         <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" /> {t.community.discussions}
            </h3>

            {/* Comment List */}
            <div className="space-y-8 mb-10">
                {selectedPost.commentsList?.map((comment, index) => (
                    <React.Fragment key={comment.id}>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold flex-shrink-0">
                                {comment.author.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-gray-900">{comment.author}</span>
                                    <span className="text-xs text-gray-500">{comment.timestamp}</span>
                                </div>
                                <div className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl rounded-tl-none border border-gray-100">
                                    {comment.content}
                                </div>
                                <div className="flex items-center gap-4 mt-2 ml-1">
                                    <button className="text-xs font-medium text-gray-500 hover:text-primary-600 flex items-center gap-1">
                                        <ThumbsUp className="h-3 w-3" /> {t.team.likes}
                                    </button>
                                    <button className="text-xs font-medium text-gray-500 hover:text-primary-600 flex items-center gap-1">
                                        <MessageCircle className="h-3 w-3" /> {t.community.reply}
                                    </button>
                                    <button className="text-xs font-medium text-gray-400 hover:text-red-500 ml-auto flex items-center gap-1">
                                        <Flag className="h-3 w-3" /> {t.community.report}
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* Insert Ad every 3 comments */}
                        {(index + 1) % 3 === 0 && <AdBanner />}
                    </React.Fragment>
                ))}
            </div>

            {/* Comment Input */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                <div className="flex gap-4">
                     <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white flex-shrink-0">
                         <Bot className="h-5 w-5" />
                     </div>
                     <div className="flex-1">
                         <div className="relative bg-white border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-transparent transition-all">
                             <textarea
                                 value={newComment}
                                 onChange={(e) => setNewComment(e.target.value)}
                                 placeholder={t.team.replyPlaceholder}
                                 className="w-full p-4 min-h-[100px] resize-none focus:outline-none rounded-t-xl text-sm"
                             />
                             {/* Toolbar */}
                             <div className="flex items-center justify-between p-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                                 <div className="flex items-center gap-1">
                                     <button onClick={() => handleToolClick('Image')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors" title={t.community.uploadImage}>
                                         <ImageIcon className="h-4 w-4" />
                                     </button>
                                     <button onClick={() => handleToolClick('Emoji')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors" title={t.community.insertEmoji}>
                                         <Smile className="h-4 w-4" />
                                     </button>
                                     <button onClick={() => handleToolClick('Link')} className="p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors" title={t.community.insertLink}>
                                         <LinkIcon className="h-4 w-4" />
                                     </button>
                                 </div>
                                 <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()} className="gap-2">
                                     {t.team.postComment} <Send className="h-3 w-3" />
                                 </Button>
                             </div>
                         </div>
                     </div>
                </div>
            </div>
         </div>
      </div>
    );
  }

  // --- VIEW: TOPIC DETAIL ---
  if (viewMode === 'topic' && selectedTopic) {
    // Filter posts for this topic
    const topicPosts = posts.filter(post => 
      post.tags.some(tag => selectedTopic.tags.includes(tag))
    );

    return (
      <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in bg-gray-50 min-h-full">
         <Button variant="ghost" onClick={handleBackToHome} className="gap-2 pl-0 hover:bg-transparent hover:text-primary-600 mb-2">
            <ArrowLeft className="h-4 w-4" /> {t.community.backToCommunity}
         </Button>

         {/* Topic Header Card */}
         <div className="bg-white rounded-xl border border-orange-200 shadow-sm p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Hash className="h-64 w-64 transform rotate-12" />
            </div>
            <div className="relative z-10">
               <div className="flex items-center gap-3 mb-4">
                  <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                     <Flame className="h-6 w-6" />
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900">{selectedTopic.title}</h1>
               </div>
               <p className="text-lg text-gray-600 max-w-2xl mb-6">{selectedTopic.description}</p>
               
               <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                     <Users className="h-4 w-4" />
                     <span className="font-semibold text-gray-700">{selectedTopic.participants}</span> {t.community.participants}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-bold">
                     <Flame className="h-4 w-4 fill-current" />
                     {t.community.fireIndex}: {selectedTopic.hotIndex}
                  </div>
                  <div className="flex gap-2 ml-auto">
                     {selectedTopic.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-white border border-gray-200 rounded-md text-xs font-medium text-gray-600">#{tag}</span>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Feed */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">{t.community.topicFeed}</h2>
                    <span className="text-sm text-gray-500">{topicPosts.length} posts</span>
                </div>

                {/* Create Post Input */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4 items-start">
                   <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold flex-shrink-0">
                      {MOCK_USER.name.charAt(0)}
                   </div>
                   <div className="flex-1">
                      <textarea
                          value={newTopicPostContent}
                          onChange={(e) => setNewTopicPostContent(e.target.value)}
                          placeholder={t.community.createTopicPost}
                          className="w-full p-2 text-sm border-none focus:ring-0 resize-none min-h-[60px]"
                      />
                      <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                          <div className="flex gap-2">
                             <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><ImageIcon className="h-4 w-4" /></button>
                             <button className="p-1.5 text-gray-400 hover:bg-gray-100 rounded"><LinkIcon className="h-4 w-4" /></button>
                          </div>
                          <Button size="sm" onClick={handleCreateTopicPost} disabled={!newTopicPostContent.trim()}>
                             {t.team.postComment}
                          </Button>
                      </div>
                   </div>
                </div>

                {/* Posts */}
                {topicPosts.length > 0 ? (
                    topicPosts.map(post => renderPostCard(post))
                ) : (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
                        <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">{t.community.noPostsInTopic}</p>
                    </div>
                )}
            </div>

            {/* Right: Sidebar Stats or Related */}
            <div className="space-y-6">
               <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-4">{t.community.membersRank}</h3>
                  {/* Reuse trends logic but maybe filter for this topic later */}
                  <div className="space-y-4">
                     {trends.slice(0, 3).map((member, index) => (
                        <div key={member.id} className="flex items-center gap-3">
                            <span className="w-5 font-bold text-gray-400 text-sm">#{index + 1}</span>
                            <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full bg-gray-100" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                                <p className="text-xs text-gray-500">{member.contributionScore} pts</p>
                            </div>
                        </div>
                     ))}
                  </div>
               </div>
               <AdBanner />
            </div>
         </div>
      </div>
    );
  }

  // --- VIEW: HOME LIST ---
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.community.title}</h1>
          <p className="text-gray-600 mt-2">{t.community.subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
             {/* Search Input */}
             <div className="flex items-center gap-2"> {/* Container for Input + Button */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder={t.community.searchPlaceholder} 
                        className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-64 shadow-sm"
                    />
                </div>
                <Button size="sm" variant="primary" className="px-4 shadow-none">{t.common.search}</Button>
             </div>
            
            <Button onClick={handleCreatePostClick} className="flex items-center gap-2 shadow-lg shadow-primary-500/20">
              <Plus className="h-4 w-4" />
              {t.community.newPost}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column: Topics & Discussions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Topics */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-orange-100 text-orange-600 rounded-lg">
                <Flame className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{t.community.topics}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map(topic => (
                <div 
                    key={topic.id} 
                    onClick={() => handleTopicClick(topic)}
                    className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer relative overflow-hidden"
                >
                   <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                     <Hash className="h-24 w-24 transform rotate-12" />
                   </div>
                   <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">{topic.title}</h3>
                       <div className="flex items-center gap-1 text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-full">
                         <Flame className="h-3 w-3 fill-current" />
                         {topic.hotIndex}
                       </div>
                     </div>
                     <p className="text-sm text-gray-600 mb-4 line-clamp-2">{topic.description}</p>
                     <div className="flex items-center justify-between text-xs text-gray-500">
                       <span className="flex items-center gap-1">
                         <Users className="h-3 w-3" /> {topic.participants} {t.community.participants}
                       </span>
                       <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-primary-500 transition-colors transform group-hover:translate-x-1" />
                     </div>
                   </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Discussions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t.community.discussions}</h2>
              </div>
              <button className="text-sm font-medium text-primary-600 hover:text-primary-700">{t.community.viewAll}</button>
            </div>
            
            <div className="space-y-4">
              {posts.map(post => renderPostCard(post))}
            </div>
          </section>
        </div>

        {/* Right Column: Trends */}
        <div className="space-y-8">
          <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">{t.community.trends}</h2>
            </div>

            {/* Top Contributors */}
            <div>
               <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t.community.membersRank}</h3>
               <div className="space-y-4">
                 {trends.map((member, index) => (
                   <div key={member.id} className="flex items-center justify-between">
                     <div className="flex items-center gap-3">
                       <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                         index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                         index === 1 ? 'bg-gray-100 text-gray-700' : 
                         'bg-orange-50 text-orange-700'
                       }`}>
                         {index + 1}
                       </div>
                       <img src={member.avatar} alt={member.name} className="h-8 w-8 rounded-full bg-gray-100" />
                       <div>
                         <p className="text-sm font-bold text-gray-900">{member.name}</p>
                         <p className="text-xs text-gray-500">{member.contributionScore} pts</p>
                       </div>
                     </div>
                     {member.rank === 1 && <Crown className="h-4 w-4 text-yellow-500 fill-current" />}
                     {member.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-500" />}
                   </div>
                 ))}
               </div>
            </div>

            <div className="my-6 border-t border-gray-100"></div>

            {/* Hot Tags/Keywords */}
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">{t.community.hotTopics}</h3>
              <div className="flex flex-wrap gap-2">
                {['#React', '#AI', '#SystemDesign', '#Career', '#OpenSource'].map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs rounded-full font-medium border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-colors cursor-pointer">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};