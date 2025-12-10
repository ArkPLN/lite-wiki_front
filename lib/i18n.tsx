

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

// 1. Types
export type Language = 'en' | 'zh';

export interface TranslationSchema {
  common: {
    appName: string;
    login: string;
    register: string;
    logout: string;
    searchPlaceholder: string;
    search: string; // New
    features: string;
    about: string;
    getStarted: string;
    welcomeBack: string;
    signIn: string;
    createAccount: string;
    email: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    backToHome: string;
    orContinueWith: string;
    agreeToTerms: string;
    loading: string;
    processing: string;
    // New Registration fields
    registerMethodEmail: string;
    registerMethodPhone: string;
    phoneNumber: string;
    phonePlaceholder: string;
    verificationCode: string;
    codePlaceholder: string;
    sendCode: string;
    resendCode: string;
    codeSent: string;
    // Forgot Password
    forgotPassword: string;
    forgotPasswordDesc: string;
    sendResetLink: string;
    resetLinkSent: string;
    resetLinkSentDesc: string;
    backToLogin: string;
    // Anonymous
    anonymousLogin: string;
    continueAsGuest: string;
    guestDesc: string;
    // Versioning
    versionHistory: string;
    version: string;
    stateWorking: string;
    stateLocked: string;
    stateArchived: string;
    stateDeprecated: string;
    // Batch Operations
    batchOperation: string;
    itemsSelected: string;
    deleteSelected: string;
    cancel: string;
    delete: string;
    update: string; // New
    confirmDelete: string; // New
    confirmBatchDelete: string;
    // Modals
    save: string;
    edit: string;
    select: string;
  };
  modals: {
    filePickerTitle: string;
    selectFileDesc: string;
    editItemTitle: string;
    aliasLabel: string;
    tagsLabel: string;
    addTagPlaceholder: string;
    noTags: string;
    // Invite Member
    inviteMemberTitle: string;
    inviteMemberDesc: string;
    tabLink: string;
    tabEmail: string;
    tabPhone: string;
    copyLink: string;
    linkCopied: string;
    emailLabel: string;
    emailPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    sendInvite: string;
    inviteSent: string;
    // Edit Role
    editRoleTitle: string;
    currentRoleLabel: string;
    newRoleLabel: string;
    updateRole: string;
  };
  welcome: { // New Section
    title: string;
    subtitle: string;
    role: string;
    getStarted: string;
    card1Title: string;
    card1Desc: string;
    card2Title: string;
    card2Desc: string;
    card3Title: string;
    card3Desc: string;
  };
  dashboard: {
    overview: string;
    documents: string;
    community: string; // New
    knowledgeCenter: string;
    teamSpace: string;
    library: string;
    favorites: string;
    recent: string;
    trash: string;
    totalDocs: string;
    teamMembers: string;
    hoursOnline: string;
    storageUsed: string;
    recentActivity: string;
    viewAll: string;
    aiAssistant: string;
    aiDescription: string;
    openEditor: string;
    storageStatus: string;
    signOut: string;
    // Search
    search: {
      placeholder: string;
      modeLabel: string;
      modeAccurate: string;
      modeBlur: string;
      dateLabel: string;
      tagLabel: string;
      filter: string;
      reset: string;
      noResults: string;
      noResultsDesc: string;
    };
  };
  editor: {
    toolbar: {
      bold: string;
      italic: string;
      h1: string;
      h2: string;
      h3: string;
      list: string;
      checklist: string;
      link: string;
      image: string;
      code: string;
      quote: string;
      table: string;
    };
    comments: {
      title: string;
      placeholder: string;
      post: string;
      attach: string;
      emoji: string;
    };
    share: {
      button: string;
      title: string;
      desc: string;
      copyLink: string;
      linkCopied: string;
      settings: string;
      expiration: string;
      passwordProtection: string;
      passwordPlaceholder: string;
      permissions: string;
      permView: string;
      permEdit: string;
      generateLink: string;
    };
  };
  knowledge: {
    title: string;
    subtitle: string;
    selectBase: string;
    personalBase: string;
    teamBase: string;
    webSearch: string;
    deepThinking: string;
    chatPlaceholder: string;
    send: string;
    statsTitle: string;
    storageUsage: string;
    filesIndexed: string;
    vectorCount: string;
    lastUpdated: string;
    indexedFilesTitle: string;
    uploadNew: string;
    indexes: string;
  };
  community: { // New Section
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    topics: string;
    trends: string;
    discussions: string;
    hotTopics: string;
    joinDiscussion: string;
    membersRank: string;
    hotPosts: string;
    aiSummary: string;
    fireIndex: string;
    loading: string;
    newPost: string;
    viewAll: string;
    participants: string;
    views: string;
    trendUp: string;
    star: string;
    report: string;
    uploadImage: string;
    insertEmoji: string;
    insertLink: string;
    sponsored: string;
    adLabel: string;
    reply: string;
    share: string;
    backToCommunity: string;
    // New Topic Detail Translations
    topicFeed: string;
    createTopicPost: string;
    backToTopics: string;
    noPostsInTopic: string;
    // Create Post View
    createPostTitle: string;
    editPostTitle: string; // New
    selectTopic: string;
    postTitleLabel: string;
    postTitlePlaceholder: string;
    postContentLabel: string;
    postContentPlaceholder: string;
    tagsLabel: string;
    addTagPlaceholder: string;
    attachmentsLabel: string;
    uploadFile: string;
    selectFromLibrary: string;
    publishPost: string;
    updatePost: string; // New
    cancelPost: string;
    subscribe: string; // New
    subscribed: string; // New
  };
  notifications: {
    title: string;
    markAllRead: string;
    noNotifications: string;
    noNotificationsDesc: string;
    typeInfo: string;
    typeWarning: string;
    typeError: string;
    typeSystem: string;
    markRead: string;
    delete: string;
  };
  library: {
    // Shared
    removeItem: string;
    // Favorites
    favoritesTitle: string;
    favoritesDesc: string;
    addFavorite: string;
    removeFromFavorites: string;
    dateAdded: string;
    location: string;
    noFavorites: string;
    noFavoritesDesc: string;
    // Recent
    recentTitle: string;
    recentDesc: string;
    addRecent: string;
    lastAccessed: string;
    noRecent: string;
    noRecentDesc: string;
    // Trash
    trashTitle: string;
    trashDesc: string;
    addToTrash: string;
    emptyTrash: string;
    restore: string;
    deleteForever: string;
    daysRemaining: string;
    dateDeleted: string;
    noTrash: string;
    noTrashDesc: string;
    confirmEmpty: string;
    emptySuccess: string;
  };
  team: {
    header: string;
    subHeader: string;
    forum: string;
    wiki: string;
    directory: string;
    management: string;
    // Forum Subpage
    searchDiscussions: string;
    filter: string;
    newDiscussion: string;
    createDiscussion: string; 
    editDiscussion: string; // New
    titleLabel: string; 
    tagsLabel: string; 
    contentLabel: string; 
    dropFiles: string; 
    publish: string; 
    update: string; // New
    cancel: string; 
    likes: string;
    comments: string;
    backToForum: string;
    attachments: string;
    writeComment: string;
    postComment: string;
    replyPlaceholder: string;
    download: string;
    // Directory Subpage
    membersTitle: string;
    exportList: string;
    joined: string;
    activeMembersSubtitle: string;
    directoryMenu: {
        freezeAccount: string;
        unfreezeAccount: string;
        removeMember: string;
        migrateMember: string;
        viewDetails: string;
        memberProfile: string;
        copy: string;
        copied: string;
    };
    // Management Subpage
    accessDenied: string;
    accessDeniedDesc: string;
    managementTitle: string;
    managementDesc: string;
    inviteMember: string;
    totalMembers: string;
    weeklyActivity: string;
    memberPermissions: string;
    showingActive: string;
    actions: string;
    globalSettings: string;
    publicTeamProfile: string;
    allowInvites: string;
    require2FA: string;
    dangerZone: string;
    deleteTeam: string;
    deleteTeamDesc: string;
    // New Team Profile Editing
    teamProfileSettings: string;
    teamName: string;
    teamDescription: string;
    updateProfile: string;
    profileUpdated: string;
    // Wiki Subpage
    teamDocs: string;
    markdownInput: string;
    livePreview: string;
    readOnly: string;
    editingMode: string;
    releaseLock: string;
    save: string;
    editDocument: string;
    lockedBy: string;
  };
  profile: {
    title: string;
    editProfile: string;
    cancelEdit: string;
    accountInfo: string;
    personalDetails: string;
    role: string;
    preferences: string;
    emailNotifications: string;
    darkMode: string;
    language: string;
    saveChanges: string;
    nickname: string;
    telephone: string;
    bio: string;
    security: string;
    newPassword: string;
    newPasswordPlaceholder: string;
    twoFaTitle: string;
    twoFaDesc: string;
    verify: string;
    verificationSent: string;
  };
  hero: {
    newFeature: string;
    title: string;
    subtitle: string;
    startFree: string;
    liveDemo: string;
    whyLiteWiki: string;
    readyToOrganize: string;
    contactSales: string;
    joinPrefix: string;
    joinSuffix: string;
  };
  portal: {
    featuresGrid: {
      header: string;
      subHeader: string;
      structuredKnowledge: { title: string; desc: string };
      aiCopilot: { title: string; desc: string };
      realTimeEditor: { title: string; desc: string };
      teamHub: { title: string; desc: string };
      smartDashboard: { title: string; desc: string };
      securePrivate: { title: string; desc: string };
    };
    deepDive: {
      personalWorkbench: { title: string; desc: string; points: string[] };
      aiAssistant: { title: string; desc: string; points: string[] };
      teamSync: { title: string; desc: string; points: string[] };
    };
    about: {
      p1: string;
      p2: string;
      p3: string;
    }
  };
  footer: {
    description: string;
    product: string;
    features: string;
    integrations: string;
    pricing: string;
    roadmap: string;
    company: string;
    aboutUs: string;
    careers: string;
    contact: string;
    copyright: string;
  };
}

// 2. Dictionaries
export const translations: Record<Language, TranslationSchema> = {
  en: {
    common: {
      appName: 'Lite-Wiki',
      login: 'Log in',
      register: 'Get Started',
      logout: 'Sign Out',
      searchPlaceholder: 'Search documents, folders, or comments...',
      search: 'Search',
      features: 'Features',
      about: 'About',
      getStarted: 'Get Started',
      welcomeBack: 'Welcome Back!',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      email: 'Email address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      fullName: 'Full Name',
      backToHome: 'Back to Home',
      orContinueWith: 'Or continue with',
      agreeToTerms: 'By clicking "Create Account", you agree to our Terms of Service and Privacy Policy.',
      loading: 'Loading...',
      processing: 'Processing...',
      registerMethodEmail: 'Email',
      registerMethodPhone: 'Phone',
      phoneNumber: 'Phone Number',
      phonePlaceholder: 'Enter your phone number',
      verificationCode: 'Verification Code',
      codePlaceholder: '6-digit code',
      sendCode: 'Send Code',
      resendCode: 'Resend ({time}s)',
      codeSent: 'Sent!',
      // Forgot Password
      forgotPassword: 'Forgot password?',
      forgotPasswordDesc: 'Enter your email address and we\'ll send you a link to reset your password.',
      sendResetLink: 'Send Reset Link',
      resetLinkSent: 'Reset link sent!',
      resetLinkSentDesc: 'Please check your email inbox for instructions.',
      backToLogin: 'Back to Login',
      // Anonymous
      anonymousLogin: 'Anonymous Login',
      continueAsGuest: 'Continue as Guest',
      guestDesc: 'Try Lite-Wiki instantly without an account. Some features may be limited.',
      // Versioning
      versionHistory: 'Version History',
      version: 'Version',
      stateWorking: 'Working',
      stateLocked: 'Locked',
      stateArchived: 'Archived',
      stateDeprecated: 'Deprecated',
      // Batch
      batchOperation: 'Batch Operation',
      itemsSelected: 'items selected',
      deleteSelected: 'Delete Selected',
      cancel: 'Cancel',
      delete: 'Delete',
      update: 'Update',
      confirmDelete: 'Are you sure you want to delete this?',
      confirmBatchDelete: 'Are you sure you want to delete these {count} items?',
      // Modals
      save: 'Save',
      edit: 'Edit',
      select: 'Select',
    },
    modals: {
      filePickerTitle: 'Select a File',
      selectFileDesc: 'Choose a file or folder from your workspace.',
      editItemTitle: 'Edit Item',
      aliasLabel: 'Alias / Name',
      tagsLabel: 'Tags',
      addTagPlaceholder: 'Type tag and press Enter',
      noTags: 'No tags added',
      // Invite Member
      inviteMemberTitle: 'Invite Team Member',
      inviteMemberDesc: 'Share the link or send an invitation directly to new members.',
      tabLink: 'Invite Link',
      tabEmail: 'Email',
      tabPhone: 'Phonebook',
      copyLink: 'Copy Link',
      linkCopied: 'Copied',
      emailLabel: 'Email Address',
      emailPlaceholder: 'colleague@example.com',
      phoneLabel: 'Phone Number',
      phonePlaceholder: 'Enter phone number',
      sendInvite: 'Send Invite',
      inviteSent: 'Invite sent!',
      // Edit Role
      editRoleTitle: 'Modify Member Role',
      currentRoleLabel: 'Current Role',
      newRoleLabel: 'New Role',
      updateRole: 'Update Role',
    },
    welcome: {
        title: 'Welcome to Lite-Wiki',
        subtitle: 'Your workspace is ready. Here are a few ways to get started:',
        role: 'Guest Account',
        getStarted: 'Go to Dashboard',
        card1Title: 'Personal Workbench',
        card1Desc: 'Organize your notes, drafts, and projects in a structured file system.',
        card2Title: 'AI Knowledge Assistant',
        card2Desc: 'Ask questions about your documents and get intelligent summaries.',
        card3Title: 'Team Collaboration',
        card3Desc: 'Join discussions, share wikis, and collaborate in real-time.'
    },
    dashboard: {
      overview: 'Overview',
      documents: 'Documents',
      community: 'Community',
      knowledgeCenter: 'Knowledge Center',
      teamSpace: 'Team Space',
      library: 'Library',
      favorites: 'Favorites',
      recent: 'Recent',
      trash: 'Trash',
      totalDocs: 'Total Documents',
      teamMembers: 'Team Members',
      hoursOnline: 'Hours Online',
      storageUsed: 'Storage Used',
      recentActivity: 'Recent Activity',
      viewAll: 'View All',
      aiAssistant: 'AI Assistant',
      aiDescription: 'Your documentation copilot is ready. Ask questions or get writing suggestions.',
      openEditor: 'Open Editor',
      storageStatus: 'Storage Status',
      signOut: 'Sign Out',
      search: {
        placeholder: 'Search by name...',
        modeLabel: 'Mode:',
        modeAccurate: 'Accurate',
        modeBlur: 'Blur',
        dateLabel: 'Date',
        tagLabel: 'Tag',
        filter: 'Filter',
        reset: 'Reset',
        noResults: 'No matching results found',
        noResultsDesc: 'Try adjusting your search criteria'
      },
    },
    editor: {
      toolbar: {
        bold: 'Bold',
        italic: 'Italic',
        h1: 'Heading 1',
        h2: 'Heading 2',
        h3: 'Heading 3',
        list: 'List',
        checklist: 'Checklist',
        link: 'Link',
        image: 'Image',
        code: 'Code Block',
        quote: 'Quote',
        table: 'Table',
      },
      comments: {
        title: 'Team Comments',
        placeholder: 'Write a comment...',
        post: 'Post Comment',
        attach: 'Attach File',
        emoji: 'Insert Emoji',
      },
      share: {
        button: 'Share',
        title: 'Share Document',
        desc: 'Generate a secure link to share this document.',
        copyLink: 'Copy Link',
        linkCopied: 'Copied!',
        settings: 'Link Settings',
        expiration: 'Expiration Date',
        passwordProtection: 'Password Protection',
        passwordPlaceholder: 'Set access password',
        permissions: 'Permissions',
        permView: 'Viewer (Read Only)',
        permEdit: 'Editor (Can Edit)',
        generateLink: 'Generate Link',
      }
    },
    knowledge: {
      title: 'AI Knowledge Assistant',
      subtitle: 'Ask questions based on your team\'s documentation and verified sources.',
      selectBase: 'Select Knowledge Base',
      personalBase: 'Personal Base',
      teamBase: 'Team Engineering',
      webSearch: 'Web Search',
      deepThinking: 'Deep Thinking',
      chatPlaceholder: 'Ask anything about the project...',
      send: 'Send',
      statsTitle: 'Knowledge Status',
      storageUsage: 'Vector Storage',
      filesIndexed: 'Files Indexed',
      vectorCount: 'Total Vectors',
      lastUpdated: 'Last Updated',
      indexedFilesTitle: 'Indexed Files',
      uploadNew: 'Index New File',
      indexes: 'indexes',
    },
    community: {
      title: 'Community Hub',
      subtitle: 'Connect, share, and grow with the global developer community.',
      searchPlaceholder: 'Search discussions...',
      topics: 'Hot Topics',
      trends: 'Trending Now',
      discussions: 'Live Discussions',
      hotTopics: 'Trending Topics',
      joinDiscussion: 'Join Discussion',
      membersRank: 'Top Contributors',
      hotPosts: 'Popular Posts',
      aiSummary: 'AI Summary',
      fireIndex: 'Heat',
      loading: 'Loading Community Data...',
      newPost: 'New Post',
      viewAll: 'View All',
      participants: 'participants',
      views: 'views',
      trendUp: 'Trending Up',
      star: 'Star',
      report: 'Report',
      uploadImage: 'Image',
      insertEmoji: 'Emoji',
      insertLink: 'Link',
      sponsored: 'Sponsored',
      adLabel: 'Advertisement',
      reply: 'Reply',
      share: 'Share',
      backToCommunity: 'Back to Community',
      topicFeed: 'Topic Feed',
      createTopicPost: 'Post your thoughts in this topic...',
      backToTopics: 'Back to Topics',
      noPostsInTopic: 'No posts yet in this topic. Be the first to start the conversation!',
      // Create Post
      createPostTitle: 'Create New Post',
      editPostTitle: 'Edit Post',
      selectTopic: 'Select Topic',
      postTitleLabel: 'Title',
      postTitlePlaceholder: 'Enter an interesting title',
      postContentLabel: 'Content',
      postContentPlaceholder: 'Share your thoughts, questions, or findings...',
      tagsLabel: 'Tags',
      addTagPlaceholder: 'Add a tag and press Enter',
      attachmentsLabel: 'Attachments',
      uploadFile: 'Upload from Computer',
      selectFromLibrary: 'Select from Docs',
      publishPost: 'Publish Post',
      updatePost: 'Update Post',
      cancelPost: 'Cancel',
      subscribe: 'Subscribe',
      subscribed: 'Subscribed',
    },
    notifications: {
      title: 'Notifications',
      markAllRead: 'Mark all as read',
      noNotifications: 'All caught up!',
      noNotificationsDesc: 'You have no new notifications at this time.',
      typeInfo: 'Info',
      typeWarning: 'Warning',
      typeError: 'Error',
      typeSystem: 'System',
      markRead: 'Mark as read',
      delete: 'Delete',
    },
    library: {
      removeItem: 'Remove Item',
      favoritesTitle: 'Favorites',
      favoritesDesc: 'Your pinned documents and folders for quick access.',
      addFavorite: 'Add Favorite',
      removeFromFavorites: 'Remove from Favorites',
      dateAdded: 'Date Added',
      location: 'Location',
      noFavorites: 'No favorites yet',
      noFavoritesDesc: 'Star items in the document explorer to see them here.',
      recentTitle: 'Recent Files',
      recentDesc: 'Files you have viewed or edited recently.',
      addRecent: 'Add Entry',
      lastAccessed: 'Last Accessed',
      noRecent: 'No recent files',
      noRecentDesc: 'Documents you open will appear here.',
      trashTitle: 'Trash',
      trashDesc: 'Items deleted within the last 30 days.',
      addToTrash: 'Simulate Deletion',
      emptyTrash: 'Empty Trash',
      restore: 'Restore',
      deleteForever: 'Delete Forever',
      daysRemaining: 'days remaining',
      dateDeleted: 'Date Deleted',
      noTrash: 'Trash is empty',
      noTrashDesc: 'Great! No deleted items found.',
      confirmEmpty: 'Are you sure you want to empty the trash? This action cannot be undone.',
      emptySuccess: 'Trash emptied successfully',
    },
    team: {
      header: 'Engineering Team Alpha',
      subHeader: 'Collaborative workspace for the core engineering group.',
      forum: 'Forum Channels',
      wiki: 'Knowledge Base',
      directory: 'Directory',
      management: 'Management',
      // Forum
      searchDiscussions: 'Search discussions...',
      filter: 'Filter',
      newDiscussion: 'New Discussion',
      createDiscussion: 'Create New Discussion',
      editDiscussion: 'Edit Discussion',
      titleLabel: 'Discussion Title',
      tagsLabel: 'Select Tags',
      contentLabel: 'Content',
      dropFiles: 'Click or drag to upload files',
      publish: 'Publish',
      update: 'Update',
      cancel: 'Cancel',
      likes: 'Likes',
      comments: 'Comments',
      backToForum: 'Back to Forum',
      attachments: 'Attachments',
      writeComment: 'Write a comment',
      postComment: 'Post Comment',
      replyPlaceholder: 'Share your thoughts...',
      download: 'Download',
      // Directory
      membersTitle: 'Team Members',
      exportList: 'Export List',
      joined: 'Joined',
      activeMembersSubtitle: 'Active members in Engineering',
      directoryMenu: {
        freezeAccount: 'Temporary Frozen',
        unfreezeAccount: 'Unfreeze Account',
        removeMember: 'Remove Member',
        migrateMember: 'Migrate Member to...',
        viewDetails: 'View Details',
        memberProfile: 'Member Profile',
        copy: 'Copy',
        copied: 'Copied!',
      },
      // Management
      accessDenied: 'Access Denied',
      accessDeniedDesc: 'You do not have permission to view the team management panel. Please contact your Team Leader.',
      managementTitle: 'Team Management',
      managementDesc: 'Manage permissions, members, and settings.',
      inviteMember: 'Invite Member',
      totalMembers: 'Total Members',
      weeklyActivity: 'Weekly Activity',
      memberPermissions: 'Member Permissions',
      showingActive: 'Showing 5 active',
      actions: 'Actions',
      globalSettings: 'Global Settings',
      publicTeamProfile: 'Public Team Profile',
      allowInvites: 'Allow Member Invites',
      require2FA: 'Require 2FA',
      dangerZone: 'Danger Zone',
      deleteTeam: 'Delete Team',
      deleteTeamDesc: 'Once you delete the team, there is no going back. Please be certain.',
      // Team Profile Edit
      teamProfileSettings: 'Team Profile Settings',
      teamName: 'Team Name',
      teamDescription: 'Team Description',
      updateProfile: 'Update Profile',
      profileUpdated: 'Team profile updated successfully!',
      // Wiki
      teamDocs: 'Team Docs',
      markdownInput: 'Markdown Input',
      livePreview: 'Live Preview',
      readOnly: 'Read Only',
      editingMode: 'Editing Mode',
      releaseLock: 'Release Lock',
      save: 'Save',
      editDocument: 'Edit Document',
      lockedBy: 'Locked by',
    },
    profile: {
      title: 'My Profile',
      editProfile: 'Edit Profile',
      cancelEdit: 'Cancel Editing',
      accountInfo: 'Account Information',
      personalDetails: 'Personal Details',
      role: 'Role',
      preferences: 'Preferences',
      emailNotifications: 'Email Notifications',
      darkMode: 'Dark Mode (Beta)',
      language: 'Language',
      saveChanges: 'Save Changes',
      nickname: 'Nickname',
      telephone: 'Telephone Number',
      bio: 'Personal Introduction',
      security: 'Security',
      newPassword: 'New Password',
      newPasswordPlaceholder: 'Leave blank to keep current',
      twoFaTitle: '2FA Verification Required',
      twoFaDesc: 'To reset your password, please enter the code sent to your phone.',
      verify: 'Verify',
      verificationSent: 'Code sent to',
    },
    hero: {
      newFeature: 'New: AI-Powered Document Assistance',
      title: 'Your Team\'s Collective Brain Power, Organized.',
      subtitle: 'Lite-Wiki is the lightweight, intelligent knowledge base designed for student groups and startup teams. Stop losing files in chats—start building your legacy.',
      startFree: 'Start for Free',
      liveDemo: 'Live Demo',
      whyLiteWiki: 'Why Lite-Wiki?',
      readyToOrganize: 'Ready to organize your team?',
      contactSales: 'Contact Sales',
      joinPrefix: 'Join',
      joinSuffix: 'of students and startup founders who use Lite-Wiki to build their collective brain.',
    },
    portal: {
      featuresGrid: {
        header: 'Everything you need to sync your team',
        subHeader: 'We cut the bloat of enterprise software and focused on the core features teams actually use.',
        structuredKnowledge: { title: 'Structured Knowledge', desc: 'Intuitive tree-view folder structure allows you to organize folders, Markdown docs, and assets just like your local file system.' },
        aiCopilot: { title: 'AI Copilot', desc: 'Built-in AI Assistant (Viewer & Editor modes) helps you summarize docs, generate content, and refine your writing instantly.' },
        realTimeEditor: { title: 'Real-time Editor', desc: 'Powerful Markdown editor with live preview, real-time saving, and inline commenting for seamless collaboration.' },
        teamHub: { title: 'Team Hub', desc: 'Dedicated spaces for forums, team wikis, and member management. Keep discussions contextually linked to your docs.' },
        smartDashboard: { title: 'Smart Dashboard', desc: 'Personal workbench with recent files, favorites, and visual data insights to keep track of your contributions.' },
        securePrivate: { title: 'Secure & Private', desc: 'Role-based access control ensures sensitive team information stays within the right circle.' },
      },
      deepDive: {
        personalWorkbench: { 
          title: 'Your Personal Command Center', 
          desc: 'The Personal Workbench is your starting point. Get a bird\'s-eye view of your work with data dashboards, quick access to recent docs, favorites, and your own private workspace.',
          points: ['Data visualization of your contributions', 'Drag-and-drop tree folder management', '集成的回收站和恢复系统']
        },
        aiAssistant: { 
          title: 'Intelligent Writing Assistant', 
          desc: 'Don\'t write alone. Our AI Sidebar has two powerful modes: Viewer for Q&A about your docs, and Editor for direct content manipulation and improvement.',
          points: ['Ask questions about your document base', 'Auto-generate summaries and meeting notes', 'Real-time grammar and style suggestions']
        },
        teamSync: { 
          title: 'Seamless Team Sync', 
          desc: 'Move beyond static files. The Team Space offers forums for discussion, shared wikis, and member directory to keep everyone connected.',
          points: ['Team Forums with threads and attachments', 'Role-based permissions (Admin, Member, Viewer)', 'Collaborative editing with lock protection']
        }
      },
      about: {
        p1: 'In daily studies and work, whether it\'s a course group, a club organization, or a startup team, everyone faces the challenge of information synchronization and knowledge retention.',
        p2: 'Materials, documents, and meeting minutes are often scattered across chat logs, emails, and personal cloud drives, making information hard to find and version control a nightmare. While giants like Notion exist, they are often too complex.',
        p3: 'Lite-Wiki focuses on the essentials: a lightweight, structured online knowledge base that solves these pain points perfectly for small teams, without the bloat.'
      }
    },
    footer: {
      description: 'Empowering teams with a centralized, AI-enhanced knowledge base. Capture, organize, and share information effortlessly.',
      product: 'Product',
      features: 'Features',
      integrations: 'Integrations',
      pricing: 'Pricing',
      roadmap: 'Roadmap',
      company: 'Company',
      aboutUs: 'About Us',
      careers: 'Careers',
      contact: 'Contact',
      copyright: 'All rights reserved.',
    }
  },
  zh: {
    common: {
      appName: 'Lite-Wiki',
      login: '登录',
      register: '注册',
      logout: '退出登录',
      searchPlaceholder: '搜索文档、文件夹或评论...',
      search: '搜索',
      features: '功能特点',
      about: '关于我们',
      getStarted: '立即开始',
      welcomeBack: '欢迎回来！',
      signIn: '登录账户',
      createAccount: '创建账户',
      email: '电子邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      fullName: '全名',
      backToHome: '返回首页',
      orContinueWith: '其他方式登录',
      agreeToTerms: '点击“创建账户”即表示您同意我们的服务条款和隐私政策。',
      loading: '加载中...',
      processing: '处理中...',
      registerMethodEmail: '邮箱注册',
      registerMethodPhone: '手机号注册',
      phoneNumber: '手机号码',
      phonePlaceholder: '请输入手机号',
      verificationCode: '验证码',
      codePlaceholder: '6位验证码',
      sendCode: '发送验证码',
      resendCode: '重发 ({time}s)',
      codeSent: '已发送',
      // Forgot Password
      forgotPassword: '忘记密码?',
      forgotPasswordDesc: '输入您的电子邮箱地址，我们将向您发送重置密码的链接。',
      sendResetLink: '发送重置链接',
      resetLinkSent: '重置链接已发送!',
      resetLinkSentDesc: '请检查您的邮箱收件箱以获取进一步指示。',
      backToLogin: '返回登录',
      // Anonymous
      anonymousLogin: '匿名登录',
      continueAsGuest: '以访客身份继续',
      guestDesc: '无需注册即可立即试用 Lite-Wiki。部分功能可能受限。',
      // Versioning
      versionHistory: '版本历史',
      version: '版本',
      stateWorking: '进行中',
      stateLocked: '已锁定',
      stateArchived: '已归档',
      stateDeprecated: '已弃用',
      // Batch
      batchOperation: '批量操作',
      itemsSelected: '项已选择',
      deleteSelected: '删除所选',
      cancel: '取消',
      delete: '删除',
      update: '更新',
      confirmDelete: '确定要删除此内容吗？',
      confirmBatchDelete: '确定要删除这 {count} 个项目吗？',
      // Modals
      save: '保存',
      edit: '编辑',
      select: '选择',
    },
    modals: {
      filePickerTitle: '选择文件',
      selectFileDesc: '从您的工作区选择文件或文件夹。',
      editItemTitle: '编辑项目',
      aliasLabel: '别名 / 名称',
      tagsLabel: '标签',
      addTagPlaceholder: '输入标签并回车',
      noTags: '暂无标签',
      // Invite Member
      inviteMemberTitle: '邀请团队成员',
      inviteMemberDesc: '分享链接或直接发送邀请给新成员。',
      tabLink: '邀请链接',
      tabEmail: '邮箱邀请',
      tabPhone: '通讯录',
      copyLink: '复制链接',
      linkCopied: '已复制',
      emailLabel: '邮箱地址',
      emailPlaceholder: 'colleague@example.com',
      phoneLabel: '手机号码',
      phonePlaceholder: '输入手机号码',
      sendInvite: '发送邀请',
      inviteSent: '邀请已发送！',
      // Edit Role
      editRoleTitle: '修改成员角色',
      currentRoleLabel: '当前角色',
      newRoleLabel: '新角色',
      updateRole: '更新角色',
    },
    welcome: {
        title: '欢迎使用 Lite-Wiki',
        subtitle: '您的工作空间已就绪。以下是快速开始的几种方式：',
        role: '访客账户',
        getStarted: '前往仪表盘',
        card1Title: '个人工作台',
        card1Desc: '在结构化的文件系统中整理您的笔记、草稿和项目。',
        card2Title: 'AI 知识助手',
        card2Desc: '针对您的文档提问并获取智能摘要。',
        card3Title: '团队协作',
        card3Desc: '参与讨论、分享 Wiki 并进行实时协作。'
    },
    dashboard: {
      overview: '概览',
      documents: '文档',
      community: '社区',
      knowledgeCenter: '知识库',
      teamSpace: '团队空间',
      library: '资料库',
      favorites: '收藏夹',
      recent: '最近访问',
      trash: '回收站',
      totalDocs: '文档总数',
      teamMembers: '团队成员',
      hoursOnline: '在线时长',
      storageUsed: '已用存储',
      recentActivity: '最近动态',
      viewAll: '查看全部',
      aiAssistant: 'AI 助手',
      aiDescription: '您的文档副驾驶已就绪。提问或获取写作建议。',
      openEditor: '打开编辑器',
      storageStatus: '存储状态',
      signOut: '退出登录',
      search: {
        placeholder: '按名称搜索...',
        modeLabel: '模式:',
        modeAccurate: '精确',
        modeBlur: '模糊',
        dateLabel: '日期',
        tagLabel: '标签',
        filter: '筛选',
        reset: '重置',
        noResults: '未找到匹配结果',
        noResultsDesc: '请尝试调整搜索条件',
      },
    },
    editor: {
      toolbar: {
        bold: '加粗',
        italic: '斜体',
        h1: '标题 1',
        h2: '标题 2',
        h3: '标题 3',
        list: '列表',
        checklist: '任务列表',
        link: '链接',
        image: '图片',
        code: '代码块',
        quote: '引用',
        table: '表格',
      },
      comments: {
        title: '团队评论',
        placeholder: '写下你的评论...',
        post: '发布',
        attach: '附件',
        emoji: '表情',
      },
      share: {
        button: '分享',
        title: '分享文档',
        desc: '生成安全链接以分享此文档。',
        copyLink: '复制链接',
        linkCopied: '已复制！',
        settings: '链接设置',
        expiration: '过期日期',
        passwordProtection: '密码保护',
        passwordPlaceholder: '设置访问密码',
        permissions: '权限管理',
        permView: '查看者 (只读)',
        permEdit: '编辑者 (可编辑)',
        generateLink: '生成链接',
      }
    },
    knowledge: {
      title: 'AI 知识助手',
      subtitle: '基于团队文档和权威来源回答问题。',
      selectBase: '选择知识库',
      personalBase: '个人知识库',
      teamBase: '工程团队知识库',
      webSearch: '联网搜索',
      deepThinking: '深度思考',
      chatPlaceholder: '询问有关项目的任何问题...',
      send: '发送',
      statsTitle: '知识库状态',
      storageUsage: '向量存储占用',
      filesIndexed: '已索引文件',
      vectorCount: '向量总数',
      lastUpdated: '最后更新',
      indexedFilesTitle: '索引文件列表',
      uploadNew: '索引新文件',
      indexes: '索引',
    },
    community: {
      title: '社区中心',
      subtitle: '与全球开发者联系、分享和成长。',
      searchPlaceholder: '搜索讨论...',
      topics: '热门话题',
      trends: '即时趋势',
      discussions: '实时讨论',
      hotTopics: '热门话题',
      joinDiscussion: '参与讨论',
      membersRank: '贡献榜',
      hotPosts: '热门帖子',
      aiSummary: 'AI 智能摘要',
      fireIndex: '热度',
      loading: '正在加载社区数据...',
      newPost: '发布帖子',
      viewAll: '查看全部',
      participants: '人参与',
      views: '次浏览',
      trendUp: '上升趋势',
      star: '收藏',
      report: '举报',
      uploadImage: '上传图片',
      insertEmoji: '表情',
      insertLink: '链接',
      sponsored: '赞助内容',
      adLabel: '广告',
      reply: '回复',
      share: '分享',
      backToCommunity: '返回社区',
      topicFeed: '话题动态',
      createTopicPost: '在此话题下发表您的看法...',
      backToTopics: '返回话题列表',
      noPostsInTopic: '此话题暂无帖子。快来抢占沙发！',
      // Create Post
      createPostTitle: '创建新帖子',
      editPostTitle: '编辑帖子',
      selectTopic: '选择话题',
      postTitleLabel: '标题',
      postTitlePlaceholder: '输入一个有趣的标题',
      postContentLabel: '内容',
      postContentPlaceholder: '分享你的想法、问题或发现...',
      tagsLabel: '标签',
      addTagPlaceholder: '添加标签并回车',
      attachmentsLabel: '附件',
      uploadFile: '上传文件',
      selectFromLibrary: '从文档库选择',
      publishPost: '发布帖子',
      updatePost: '更新帖子',
      cancelPost: '取消',
      subscribe: '关注', // New
      subscribed: '已关注', // New
    },
    notifications: {
      title: '通知中心',
      markAllRead: '全部标记为已读',
      noNotifications: '暂无通知',
      noNotificationsDesc: '您目前没有任何新通知。',
      typeInfo: '信息',
      typeWarning: '警告',
      typeError: '错误',
      typeSystem: '系统',
      markRead: '标记已读',
      delete: '删除',
    },
    library: {
      removeItem: '移除项目',
      favoritesTitle: '收藏夹',
      favoritesDesc: '您固定的文档和文件夹，方便快速访问。',
      addFavorite: '添加收藏',
      removeFromFavorites: '取消收藏',
      dateAdded: '添加日期',
      location: '位置',
      noFavorites: '暂无收藏',
      noFavoritesDesc: '在文档浏览器中标记星号以在此处显示。',
      recentTitle: '最近访问',
      recentDesc: '您最近查看或编辑过的文件。',
      addRecent: '添加记录',
      lastAccessed: '上次访问',
      noRecent: '暂无最近文件',
      noRecentDesc: '您打开的文档将显示在这里。',
      trashTitle: '回收站',
      trashDesc: '过去 30 天内删除的项目。',
      addToTrash: '移至回收站',
      emptyTrash: '清空回收站',
      restore: '还原',
      deleteForever: '永久删除',
      daysRemaining: '天后删除',
      dateDeleted: '删除日期',
      noTrash: '回收站为空',
      noTrashDesc: '太好了！没有发现被删除的项目。',
      confirmEmpty: '确定要清空回收站吗？此操作无法撤销。',
      emptySuccess: '回收站已清空',
    },
    team: {
      header: 'Alpha 工程团队',
      subHeader: '核心工程团队的协作工作区。',
      forum: '讨论频道',
      wiki: '知识库',
      directory: '成员目录',
      management: '管理',
      // Forum
      searchDiscussions: '搜索讨论...',
      filter: '筛选',
      newDiscussion: '新建讨论',
      createDiscussion: '发起新讨论',
      editDiscussion: '编辑讨论',
      titleLabel: '讨论标题',
      tagsLabel: '选择标签',
      contentLabel: '内容',
      dropFiles: '点击或拖拽上传附件',
      publish: '发布讨论',
      update: '更新讨论',
      cancel: '取消',
      likes: '点赞',
      comments: '评论',
      backToForum: '返回频道',
      attachments: '附件',
      writeComment: '发表评论',
      postComment: '发布',
      replyPlaceholder: '分享你的想法...',
      download: '下载',
      // Directory
      membersTitle: '团队成员',
      exportList: '导出列表',
      joined: '加入于',
      activeMembersSubtitle: '工程部活跃成员',
      directoryMenu: {
        freezeAccount: '暂时冻结',
        unfreezeAccount: '解冻账户',
        removeMember: '移除成员',
        migrateMember: '转移成员至...',
        viewDetails: '查看详情',
        memberProfile: '成员资料',
        copy: '复制',
        copied: '已复制',
      },
      // Management
      accessDenied: '访问被拒绝',
      accessDeniedDesc: '您没有权限查看团队管理面板。请联系您的团队负责人。',
      managementTitle: '团队管理',
      managementDesc: '管理权限、成员和设置。',
      inviteMember: '邀请成员',
      totalMembers: '成员总数',
      weeklyActivity: '每周活动',
      memberPermissions: '成员权限',
      showingActive: '显示 5 位活跃成员',
      actions: '操作',
      globalSettings: '全局设置',
      publicTeamProfile: '公开团队资料',
      allowInvites: '允许邀请成员',
      require2FA: '强制双重认证',
      dangerZone: '危险区域',
      deleteTeam: '删除团队',
      deleteTeamDesc: '一旦删除团队，将无法恢复。请务必确定。',
      // Team Profile Edit
      teamProfileSettings: '团队资料设置',
      teamName: '团队名称',
      teamDescription: '团队描述',
      updateProfile: '更新资料',
      profileUpdated: '团队资料已更新！',
      // Wiki
      teamDocs: '团队文档',
      markdownInput: 'Markdown 输入',
      livePreview: '实时预览',
      readOnly: '只读',
      editingMode: '编辑模式',
      releaseLock: '释放锁定',
      save: '保存',
      editDocument: '编辑文档',
      lockedBy: '锁定者',
    },
    profile: {
      title: '我的个人资料',
      editProfile: '编辑资料',
      cancelEdit: '取消编辑',
      accountInfo: '账户信息',
      personalDetails: '个人详细信息',
      role: '角色',
      preferences: '偏好设置',
      emailNotifications: '邮件通知',
      darkMode: '深色模式 (测试版)',
      language: '语言 / Language',
      saveChanges: '保存更改',
      nickname: '昵称',
      telephone: '电话号码',
      bio: '个人简介',
      security: '账户安全',
      newPassword: '新密码',
      newPasswordPlaceholder: '留空以保持当前密码',
      twoFaTitle: '需要 2FA 验证',
      twoFaDesc: '为了重置您的密码，请输入发送到您手机的验证码。',
      verify: '验证并保存',
      verificationSent: '验证码已发送至',
    },
    hero: {
      newFeature: '新功能：AI 驱动的文档助手',
      title: '团队智慧，井井有条。',
      subtitle: 'Lite-Wiki 是专为学生团体和初创团队设计的轻量级、结构化知识库。拒绝在聊天记录中查找文件，从现在开始积累团队资产。',
      startFree: '免费开始',
      liveDemo: '现场演示',
      whyLiteWiki: '为什么选择 Lite-Wiki？',
      readyToOrganize: '准备好组织您的团队了吗？',
      contactSales: '联系销售',
      joinPrefix: '加入',
      joinSuffix: '名学生和初创团队用户正在使用的知识库',
    },
    portal: {
      featuresGrid: {
        header: '同步团队所需的一切',
        subHeader: '我们剔除了企业级软件的臃肿，专注于团队实际使用的核心功能。',
        structuredKnowledge: { title: '结构化知识', desc: '直观的树形文件夹结构，让您像管理本地文件系统一样组织文件夹、Markdown 文档和资源。' },
        aiCopilot: { title: 'AI 副驾驶', desc: '内置 AI 助手（阅读器和编辑器模式），帮助您即时总结文档、生成内容并润色写作。' },
        realTimeEditor: { title: '实时编辑器', desc: '强大的 Markdown 编辑器，支持实时预览、实时保存和行内评论，实现无缝协作。' },
        teamHub: { title: '团队枢纽', desc: '专用的论坛、具有细粒度权限的团队 Wiki 和成员目录，保持讨论与文档的上下文关联。' },
        smartDashboard: { title: '智能仪表盘', desc: '包含最近文件、收藏夹和可视化数据洞察的个人工作台，随时跟踪您的贡献。' },
        securePrivate: { title: '安全私密', desc: '基于角色的访问控制，确保敏感的团队信息仅在正确的小圈子内流转。' },
      },
      deepDive: {
        personalWorkbench: { 
          title: '您的个人指挥中心', 
          desc: '个人工作台是您的起点。通过数据仪表盘、最近文档、收藏夹和私人工作区，鸟瞰您的工作全貌。',
          points: ['个人贡献的数据可视化', '拖放式树形文件夹管理', '集成的回收站和恢复系统']
        },
        aiAssistant: { 
          title: '智能写作助手', 
          desc: '不要独自写作。我们的 AI 侧边栏拥有两种强大模式：阅读器用于解答文档相关问题，编辑器用于直接生成和优化内容。',
          points: ['针对文档库提问', '自动生成摘要和会议记录', '实时语法和风格建议']
        },
        teamSync: { 
          title: '无缝团队同步', 
          desc: '超越静态文件。团队空间提供用于讨论的论坛、具有精细权限的共享 Wiki 以及保持全员联系的成员目录。',
          points: ['支持话题和附件的团队论坛', '基于角色的权限（管理员、成员、查看者）', '带锁定保护的协作编辑']
        }
      },
      about: {
        p1: '在日常学习和工作中，无论是课程小组、社团组织还是创业团队，每个人都面临着信息同步和知识留存的挑战。',
        p2: '资料、文档和会议记录往往散落在聊天记录、邮件和个人云盘中，导致信息难以查找，版本控制更是一场噩梦。虽然有 Notion 这样的巨头，但它们往往过于复杂。',
        p3: 'Lite-Wiki 专注于核心需求：一个轻量级、结构化的在线知识库，完美解决小型团队的痛点，没有臃肿的功能。'
      }
    },
    footer: {
      description: '通过集中式 AI 增强知识库赋能团队。轻松捕捉、整理和共享信息。',
      product: '产品',
      features: '功能',
      integrations: '集成',
      pricing: '定价',
      roadmap: '路线图',
      company: '公司',
      aboutUs: '关于我们',
      careers: '加入我们',
      contact: '联系我们',
      copyright: '保留所有权利。',
    }
  }
};

// 3. Context
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationSchema;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 4. Hook
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from localStorage or default to 'zh' (Chinese)
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_language');
      return (saved === 'en' || saved === 'zh') ? saved : 'zh';
    } catch (e) {
      return 'zh';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('app_language', lang);
    } catch (e) {
      console.warn('Failed to save language preference');
    }
  };

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};