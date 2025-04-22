// Messages Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const conversationsList = document.getElementById('conversations-list');
    const chatArea = document.getElementById('chat-area');
    const searchMessages = document.getElementById('search-messages');
    const searchPeople = document.getElementById('search-people');
    const peopleList = document.getElementById('people-list');
    const newMessageModal = document.getElementById('new-message-modal');
    const newMessageBtns = document.querySelectorAll('.new-message-btn');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const messagesContainer = document.querySelector('.messages-container');
    
    // State variables
    let currentConversation = null;
    let typingTimeout = null;
    let typingIndicatorTimeout = null;
    
    // Initialize conversations
    loadConversations();
    
    // Event Listeners
    newMessageBtns.forEach(btn => {
        btn.addEventListener('click', openNewMessageModal);
    });
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            newMessageModal.classList.remove('active');
        });
    });
    
    searchMessages.addEventListener('input', filterConversations);
    searchPeople.addEventListener('input', filterPeople);
    
    // Load conversations
    function loadConversations() {
        // In a real app, this would fetch conversations from an API
        const conversations = getMockConversations();
        
        // Filter to only show online conversations
        const onlineConversations = conversations.filter(conv => conv.isOnline);
        
        // Get online contacts who aren't in conversations yet
        const allOnlineContacts = getMockPeople().filter(person => person.isOnline);
        const existingConversationUserIds = onlineConversations.map(conv => conv.userId);
        const onlineContactsWithoutConversations = allOnlineContacts.filter(
            contact => !existingConversationUserIds.includes(contact.id)
        );
        
        // Render conversations
        renderConversations(onlineConversations);
        
        // Render online contacts section
        renderOnlineContacts(allOnlineContacts);
        
        // Load people for new message modal
        loadPeople();
    }
    
    // Render conversations
    function renderConversations(conversations) {
        conversationsList.innerHTML = `
            <div class="section-header">
                <h3>Recent Chats</h3>
                <button class="new-chat-btn"><i class="fas fa-plus"></i> New Chat</button>
            </div>
            <div class="conversations" id="conversations-list"></div>
        `;
        
        const conversationsListElement = document.getElementById('conversations-list');
        conversationsListElement.innerHTML = '';
        
        if (conversations.length === 0) {
            conversationsListElement.innerHTML = `
                <div class="empty-state">
                    <p>No active conversations</p>
                    <button class="new-message-btn">Start a new chat</button>
                </div>
            `;
            
            const newMsgBtn = conversationsListElement.querySelector('.new-message-btn');
            if (newMsgBtn) {
                newMsgBtn.addEventListener('click', openNewMessageModal);
            }
            return;
        }
        
        conversations.forEach(conversation => {
            const conversationEl = createConversationElement(conversation);
            conversationsListElement.appendChild(conversationEl);
        });
        
        // Add event listener to new chat button
        const newChatBtn = document.querySelector('.new-chat-btn');
        if (newChatBtn) {
            newChatBtn.addEventListener('click', openNewMessageModal);
        }
    }
    
    // Render online contacts
    function renderOnlineContacts(contacts) {
        // Get online contacts element
        const onlineContactsElement = document.getElementById('online-contacts');
        
        // Filter to only show online contacts
        const onlineContacts = contacts.filter(contact => contact.isOnline);
        
        if (onlineContacts.length === 0) {
            onlineContactsElement.innerHTML = `
                <div class="empty-state">
                    <p>No one is online right now</p>
                </div>
            `;
            return;
        }
        
        // Create the contacts grid
        const contactsGrid = document.createElement('div');
        contactsGrid.className = 'contacts-grid';
        
        // Add each online contact
        onlineContacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact-item';
            contactElement.setAttribute('data-user-id', contact.id);
            
            contactElement.innerHTML = `
                <div class="contact-avatar-container">
                    <img src="${contact.avatar}" alt="${contact.name}" class="contact-avatar">
                    <span class="online-indicator"></span>
                </div>
                <p class="contact-name">${contact.name.split(' ')[0]}</p>
            `;
            
            contactElement.addEventListener('click', () => {
                startConversation(contact);
            });
            
            contactsGrid.appendChild(contactElement);
        });
        
        onlineContactsElement.innerHTML = '';
        onlineContactsElement.appendChild(contactsGrid);
    }
    
    // Create conversation element
    function createConversationElement(conversation) {
        const conversationEl = document.createElement('div');
        conversationEl.className = 'conversation-item';
        conversationEl.setAttribute('data-conversation-id', conversation.id);
        
        conversationEl.innerHTML = `
            <img src="${conversation.avatar}" alt="${conversation.name}" class="conversation-avatar">
            <div class="conversation-info">
                <div class="conversation-header">
                    <h3 class="conversation-name">${conversation.name}</h3>
                    <span class="conversation-time">${conversation.lastMessageTime}</span>
                </div>
                <p class="conversation-preview">${conversation.lastMessage}</p>
            </div>
            ${conversation.unreadCount > 0 ? `<div class="conversation-status"><span class="unread-badge">${conversation.unreadCount}</span></div>` : ''}
            ${conversation.isOnline ? `<div class="conversation-status online-badge">Online</div>` : ''}
            ${conversation.isFollowing ? `<div class="conversation-status following-badge">Following</div>` : ''}
        `;
        
        conversationEl.addEventListener('click', () => {
            openConversation(conversation);
            
            // On mobile, show chat area
            if (window.innerWidth <= 768) {
                messagesContainer.classList.add('show-chat');
            }
        });
        
        return conversationEl;
    }
    
    // Open conversation
    function openConversation(conversation) {
        // Mark all conversation items as inactive
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Mark the selected conversation as active
        const selectedItem = document.querySelector(`.conversation-item[data-conversation-id="${conversation.id}"]`);
        if (selectedItem) {
            selectedItem.classList.add('active');
            
            // Remove unread badge
            const unreadBadge = selectedItem.querySelector('.unread-badge');
            if (unreadBadge) {
                unreadBadge.remove();
            }
        }
        
        // Load chat
        loadChat(conversation);
    }
    
    // Load chat
    function loadChat(conversation) {
        // In a real app, this would fetch messages from an API
        const messages = getMockMessages(conversation.id);
        currentConversation = conversation;
        
        chatArea.innerHTML = `
            <div class="chat-header">
                <div class="chat-user">
                    <div class="chat-user-avatar-container">
                        <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-user-avatar">
                        ${conversation.isOnline ? '<span class="online-indicator"></span>' : ''}
                    </div>
                    <div class="chat-user-info">
                        <div class="chat-user-name">
                            <h3>${conversation.name}</h3>
                            ${conversation.isFollowing ? '<span class="following-tag">Following</span>' : ''}
                        </div>
                        <p>@${conversation.username} ${conversation.isOnline ? '<span class="online-status">Online</span>' : ''}</p>
                    </div>
                </div>
                <div class="chat-actions">
                    <button class="chat-action-btn"><i class="fas fa-info-circle"></i></button>
                    <button class="chat-action-btn"><i class="fas fa-phone"></i></button>
                    <button class="chat-action-btn"><i class="fas fa-video"></i></button>
                </div>
            </div>
            <div class="chat-messages" id="chat-messages"></div>
            <div class="typing-indicator" id="typing-indicator">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-text">${conversation.name} is typing...</span>
            </div>
            <div class="chat-input-container">
                <div class="chat-input-actions">
                    <button class="chat-input-action"><i class="fas fa-image"></i></button>
                    <button class="chat-input-action"><i class="fas fa-paperclip"></i></button>
                    <button class="chat-input-action"><i class="fas fa-smile"></i></button>
                </div>
                <div class="chat-input">
                    <textarea placeholder="Type a message" id="message-input"></textarea>
                </div>
                <button class="send-message-btn" id="send-message-btn" disabled><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        
        const chatMessages = document.getElementById('chat-messages');
        const messageInput = document.getElementById('message-input');
        const sendMessageBtn = document.getElementById('send-message-btn');
        const typingIndicator = document.getElementById('typing-indicator');
        
        // Hide typing indicator initially
        typingIndicator.style.display = 'none';
        
        // Render messages
        messages.forEach(message => {
            const messageEl = createMessageElement(message);
            chatMessages.appendChild(messageEl);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Enable/disable send button based on input
        messageInput.addEventListener('input', () => {
            sendMessageBtn.disabled = messageInput.value.trim() === '';
            
            // Show typing indicator to the other person
            if (messageInput.value.trim() !== '') {
                showUserIsTyping();
            }
        });
        
        // Send message on Enter (without Shift)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!sendMessageBtn.disabled) {
                    sendMessage(conversation.id);
                }
            }
        });
        
        // Send message on button click
        sendMessageBtn.addEventListener('click', () => {
            sendMessage(conversation.id);
        });
    }
    
    // Create message element
    function createMessageElement(message) {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${message.isOutgoing ? 'outgoing' : 'incoming'}`;
        
        messageEl.innerHTML = `
            <img src="${message.avatar}" alt="Avatar" class="message-avatar">
            <div class="message-content">
                <div class="message-bubble">${message.text}</div>
                <span class="message-time">${message.time}</span>
            </div>
        `;
        
        return messageEl;
    }
    
    // Send message
    function sendMessage(conversationId) {
        const messageInput = document.getElementById('message-input');
        const text = messageInput.value.trim();
        
        if (text === '') return;
        
        const chatMessages = document.getElementById('chat-messages');
        
        // Create message object
        const message = {
            id: 'msg-' + Date.now(),
            conversationId: conversationId,
            text: text,
            isOutgoing: true,
            time: formatTime(new Date()),
            avatar: '../images/avatar-placeholder.jpg'
        };
        
        // Add message to UI
        const messageEl = createMessageElement(message);
        chatMessages.appendChild(messageEl);
        
        // Clear input
        messageInput.value = '';
        messageInput.focus();
        
        // Disable send button
        document.getElementById('send-message-btn').disabled = true;
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // In a real app, this would send the message to a server
        // For demo purposes, we'll simulate a reply
        simulateReply(conversationId);
    }
    
    // Simulate reply
    function simulateReply(conversationId) {
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate delay before reply
        const replyDelay = Math.floor(Math.random() * 3000) + 1000; // 1-4 seconds
        
        setTimeout(() => {
            // Hide typing indicator
            hideTypingIndicator();
            
            const chatMessages = document.getElementById('chat-messages');
            
            // Get conversation details
            const conversation = getMockConversations().find(c => c.id === conversationId);
            
            // Create reply message
            const replyMessages = [
                "That sounds great!",
                "I'll check it out and get back to you.",
                "Thanks for sharing!",
                "Interesting approach. Have you considered using a different framework?",
                "Can you share more details about your implementation?",
                "I've been working on something similar. Let's collaborate!",
                "Great progress! Keep it up!",
                "I'm impressed with your solution.",
                "Let me know if you need any help with that.",
                "When do you think you'll have the final version ready?"
            ];
            
            const randomReply = replyMessages[Math.floor(Math.random() * replyMessages.length)];
            
            const reply = {
                id: 'msg-reply-' + Date.now(),
                conversationId: conversationId,
                text: randomReply,
                isOutgoing: false,
                time: formatTime(new Date()),
                avatar: conversation.avatar
            };
            
            // Add reply to UI
            const replyEl = createMessageElement(reply);
            chatMessages.appendChild(replyEl);
            
            // Update conversation preview
            updateConversationPreview(conversationId, randomReply);
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Play notification sound
            playNotificationSound();
        }, replyDelay);
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            
            // Also update the conversation item to show typing
            if (currentConversation) {
                const conversationItem = document.querySelector(`.conversation-item[data-conversation-id="${currentConversation.id}"]`);
                if (conversationItem) {
                    const previewEl = conversationItem.querySelector('.conversation-preview');
                    if (previewEl) {
                        previewEl.innerHTML = '<em>typing...</em>';
                        previewEl.classList.add('typing');
                    }
                }
            }
        }
    }
    
    // Hide typing indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
            
            // Also update the conversation item to hide typing
            if (currentConversation) {
                const conversationItem = document.querySelector(`.conversation-item[data-conversation-id="${currentConversation.id}"]`);
                if (conversationItem) {
                    const previewEl = conversationItem.querySelector('.conversation-preview');
                    if (previewEl && previewEl.classList.contains('typing')) {
                        previewEl.classList.remove('typing');
                        // Restore the last message
                        const conversations = getMockConversations();
                        const conversation = conversations.find(c => c.id === currentConversation.id);
                        if (conversation) {
                            previewEl.textContent = conversation.lastMessage;
                        }
                    }
                }
            }
        }
    }
    
    // Show that the user is typing to the other person
    function showUserIsTyping() {
        // Clear existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        
        // Set a new timeout to stop showing typing after 2 seconds of inactivity
        typingTimeout = setTimeout(() => {
            // In a real app, this would send a "stopped typing" signal to the server
        }, 2000);
        
        // In a real app, this would send a "typing" signal to the server
    }
    
    // Format time for messages
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Update conversation preview with the latest message
    function updateConversationPreview(conversationId, message) {
        const conversationItem = document.querySelector(`.conversation-item[data-conversation-id="${conversationId}"]`);
        if (conversationItem) {
            const previewEl = conversationItem.querySelector('.conversation-preview');
            const timeEl = conversationItem.querySelector('.conversation-time');
            
            if (previewEl) {
                previewEl.textContent = message;
            }
            
            if (timeEl) {
                timeEl.textContent = 'now';
            }
        }
    }
    
    // Filter conversations
    function filterConversations() {
        const query = searchMessages.value.toLowerCase();
        const conversations = getMockConversations();
        
        const filteredConversations = conversations.filter(conversation => {
            return conversation.name.toLowerCase().includes(query) || 
                   conversation.lastMessage.toLowerCase().includes(query);
        });
        
        renderConversations(filteredConversations);
    }
    
    // Load people for new message
    function loadPeople() {
        // In a real app, this would fetch people from an API
        const people = getMockPeople();
        renderPeople(people);
    }
    
    // Render people
    function renderPeople(people) {
        peopleList.innerHTML = '';
        
        people.forEach(person => {
            const personEl = createPersonElement(person);
            peopleList.appendChild(personEl);
        });
    }
    
    // Create person element
    function createPersonElement(person) {
        const personEl = document.createElement('div');
        personEl.className = 'person-item';
        personEl.setAttribute('data-person-id', person.id);
        
        personEl.innerHTML = `
            <div class="person-avatar-container">
                <img src="${person.avatar}" alt="${person.name}" class="person-avatar">
                ${person.isOnline ? '<span class="online-indicator"></span>' : ''}
            </div>
            <div class="person-info">
                <h3>${person.name}</h3>
                <p>@${person.username}</p>
            </div>
            ${person.isOnline ? `<div class="person-status online-badge">Online</div>` : ''}
            ${person.isFollowing ? `<div class="person-status following-badge">Following</div>` : ''}
        `;
        
        personEl.addEventListener('click', () => {
            startConversation(person);
        });
        
        return personEl;
    }
    
    // Start conversation with person
    function startConversation(person) {
        // Check if conversation already exists
        const conversations = getMockConversations();
        const existingConversation = conversations.find(c => c.username === person.username);
        
        if (existingConversation) {
            // Open existing conversation
            openConversation(existingConversation);
        } else {
            // Create new conversation
            const newConversation = {
                id: 'conv-' + Date.now(),
                userId: person.id,
                name: person.name,
                username: person.username,
                avatar: person.avatar,
                lastMessage: 'Start a conversation',
                lastMessageTime: 'Now',
                unreadCount: 0,
                isOnline: person.isOnline,
                isFollowing: person.isFollowing
            };
            
            // In a real app, this would create a conversation on the server
            console.log('Creating new conversation:', newConversation);
            
            // Add to conversations list
            const conversationEl = createConversationElement(newConversation);
            conversationsList.prepend(conversationEl);
            
            // Open the new conversation
            openConversation(newConversation);
        }
        
        // Close modal
        newMessageModal.classList.remove('active');
    }
    
    // Filter people
    function filterPeople() {
        const query = searchPeople.value.toLowerCase();
        const people = getMockPeople();
        
        const filteredPeople = people.filter(person => {
            return person.name.toLowerCase().includes(query) || 
                   person.username.toLowerCase().includes(query);
        });
        
        renderPeople(filteredPeople);
    }
    
    // Open new message modal
    function openNewMessageModal() {
        newMessageModal.classList.add('active');
        searchPeople.focus();
    }
    
    // Add back button functionality for mobile
    document.querySelector('.header-back').addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && messagesContainer.classList.contains('show-chat')) {
            e.preventDefault();
            messagesContainer.classList.remove('show-chat');
        }
    });
    
    // Mock data functions
    function getMockConversations() {
        return [
            {
                id: 'conv-1',
                userId: 'user-1',
                name: 'Jane Smith',
                username: 'janesmith',
                avatar: '../images/avatar-placeholder-2.jpg',
                lastMessage: 'Looking forward to seeing your new project!',
                lastMessageTime: '2h',
                unreadCount: 2,
                isOnline: true,
                isFollowing: true
            },
            {
                id: 'conv-2',
                userId: 'user-2',
                name: 'Alex Johnson',
                username: 'alexj',
                avatar: '../images/avatar-placeholder-3.jpg',
                lastMessage: 'Can you share the code repository?',
                lastMessageTime: '5h',
                unreadCount: 0,
                isOnline: false,
                isFollowing: true
            },
            {
                id: 'conv-3',
                userId: 'user-3',
                name: 'Sarah Williams',
                username: 'sarahw',
                avatar: '../images/avatar-placeholder-4.jpg',
                lastMessage: 'The design looks amazing! Great job!',
                lastMessageTime: '1d',
                unreadCount: 1,
                isOnline: true,
                isFollowing: false
            },
            {
                id: 'conv-4',
                userId: 'user-4',
                name: 'Michael Brown',
                username: 'mikebrown',
                avatar: '../images/avatar-placeholder-5.jpg',
                lastMessage: 'Let\'s schedule a call to discuss the project details.',
                lastMessageTime: '2d',
                unreadCount: 0,
                isOnline: false,
                isFollowing: true
            },
            {
                id: 'conv-5',
                userId: 'user-5',
                name: 'Emily Davis',
                username: 'emilyd',
                avatar: '../images/avatar-placeholder-6.jpg',
                lastMessage: 'I\'ve sent you the updated wireframes.',
                lastMessageTime: '3d',
                unreadCount: 0,
                isOnline: true,
                isFollowing: false
            }
        ];
    }
    
    function getMockMessages(conversationId) {
        const messages = {
            'conv-1': [
                {
                    id: 'msg-1',
                    conversationId: 'conv-1',
                    text: 'Hi Jane! How are you doing?',
                    isOutgoing: true,
                    time: '2:30 PM',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-2',
                    conversationId: 'conv-1',
                    text: 'Hey! I\'m doing great, thanks for asking. How about you?',
                    isOutgoing: false,
                    time: '2:32 PM',
                    avatar: '../images/avatar-placeholder-2.jpg'
                },
                {
                    id: 'msg-3',
                    conversationId: 'conv-1',
                    text: 'I\'m good too. I\'ve been working on a new project and wanted to get your feedback.',
                    isOutgoing: true,
                    time: '2:35 PM',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-4',
                    conversationId: 'conv-1',
                    text: 'That sounds interesting! What kind of project is it?',
                    isOutgoing: false,
                    time: '2:38 PM',
                    avatar: '../images/avatar-placeholder-2.jpg'
                },
                {
                    id: 'msg-5',
                    conversationId: 'conv-1',
                    text: 'It\'s a web app for project management, similar to Trello but with some unique features.',
                    isOutgoing: true,
                    time: '2:40 PM',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-6',
                    conversationId: 'conv-1',
                    text: 'Looking forward to seeing your new project!',
                    isOutgoing: false,
                    time: '2:45 PM',
                    avatar: '../images/avatar-placeholder-2.jpg'
                }
            ],
            'conv-2': [
                {
                    id: 'msg-7',
                    conversationId: 'conv-2',
                    text: 'Hey Alex, I just pushed the latest changes to the repository.',
                    isOutgoing: true,
                    time: '10:15 AM',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-8',
                    conversationId: 'conv-2',
                    text: 'Great! I\'ll take a look at it. Did you fix the bug we discussed yesterday?',
                    isOutgoing: false,
                    time: '10:20 AM',
                    avatar: '../images/avatar-placeholder-3.jpg'
                },
                {
                    id: 'msg-9',
                    conversationId: 'conv-2',
                    text: 'Yes, it was a simple fix. I also added some new features that we talked about.',
                    isOutgoing: true,
                    time: '10:25 AM',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-10',
                    conversationId: 'conv-2',
                    text: 'Can you share the code repository?',
                    isOutgoing: false,
                    time: '10:30 AM',
                    avatar: '../images/avatar-placeholder-3.jpg'
                }
            ],
            'conv-3': [
                {
                    id: 'msg-11',
                    conversationId: 'conv-3',
                    text: 'Sarah, I\'ve finished the design for the landing page. Would you like to see it?',
                    isOutgoing: true,
                    time: 'Yesterday',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-12',
                    conversationId: 'conv-3',
                    text: 'Absolutely! Send it over when you have a chance.',
                    isOutgoing: false,
                    time: 'Yesterday',
                    avatar: '../images/avatar-placeholder-4.jpg'
                },
                {
                    id: 'msg-13',
                    conversationId: 'conv-3',
                    text: 'Here it is! Let me know what you think.',
                    isOutgoing: true,
                    time: 'Yesterday',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-14',
                    conversationId: 'conv-3',
                    text: 'The design looks amazing! Great job!',
                    isOutgoing: false,
                    time: 'Yesterday',
                    avatar: '../images/avatar-placeholder-4.jpg'
                }
            ],
            'conv-4': [
                {
                    id: 'msg-15',
                    conversationId: 'conv-4',
                    text: 'Hi Michael, I wanted to discuss the project timeline with you.',
                    isOutgoing: true,
                    time: '2 days ago',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-16',
                    conversationId: 'conv-4',
                    text: 'Sure, what\'s on your mind?',
                    isOutgoing: false,
                    time: '2 days ago',
                    avatar: '../images/avatar-placeholder-5.jpg'
                },
                {
                    id: 'msg-17',
                    conversationId: 'conv-4',
                    text: 'I think we might need to extend the deadline by a week to ensure quality.',
                    isOutgoing: true,
                    time: '2 days ago',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-18',
                    conversationId: 'conv-4',
                    text: 'Let\'s schedule a call to discuss the project details.',
                    isOutgoing: false,
                    time: '2 days ago',
                    avatar: '../images/avatar-placeholder-5.jpg'
                }
            ],
            'conv-5': [
                {
                    id: 'msg-19',
                    conversationId: 'conv-5',
                    text: 'Emily, do you have the latest wireframes for the mobile app?',
                    isOutgoing: true,
                    time: '3 days ago',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-20',
                    conversationId: 'conv-5',
                    text: 'Yes, I\'m just making a few final adjustments. I\'ll send them to you soon.',
                    isOutgoing: false,
                    time: '3 days ago',
                    avatar: '../images/avatar-placeholder-6.jpg'
                },
                {
                    id: 'msg-21',
                    conversationId: 'conv-5',
                    text: 'Perfect, thank you!',
                    isOutgoing: true,
                    time: '3 days ago',
                    avatar: '../images/avatar-placeholder.jpg'
                },
                {
                    id: 'msg-22',
                    conversationId: 'conv-5',
                    text: 'I\'ve sent you the updated wireframes.',
                    isOutgoing: false,
                    time: '3 days ago',
                    avatar: '../images/avatar-placeholder-6.jpg'
                }
            ]
        };
        
        return messages[conversationId] || [];
    }
    
    function getMockPeople() {
        return [
            {
                id: 'user-1',
                name: 'Jane Smith',
                username: 'janesmith',
                avatar: '../images/avatar-placeholder-2.jpg',
                isOnline: true,
                isFollowing: true
            },
            {
                id: 'user-2',
                name: 'Alex Johnson',
                username: 'alexj',
                avatar: '../images/avatar-placeholder-3.jpg',
                isOnline: false,
                isFollowing: true
            },
            {
                id: 'user-3',
                name: 'Sarah Williams',
                username: 'sarahw',
                avatar: '../images/avatar-placeholder-4.jpg',
                isOnline: true,
                isFollowing: false
            },
            {
                id: 'user-4',
                name: 'Michael Brown',
                username: 'mikebrown',
                avatar: '../images/avatar-placeholder-5.jpg',
                isOnline: false,
                isFollowing: true
            },
            {
                id: 'user-5',
                name: 'Emily Davis',
                username: 'emilyd',
                avatar: '../images/avatar-placeholder-6.jpg',
                isOnline: true,
                isFollowing: false
            },
            {
                id: 'user-6',
                name: 'David Wilson',
                username: 'davidw',
                avatar: '../images/avatar-placeholder-7.jpg',
                isOnline: true,
                isFollowing: true
            },
            {
                id: 'user-7',
                name: 'Olivia Taylor',
                username: 'oliviat',
                avatar: '../images/avatar-placeholder-8.jpg',
                isOnline: false,
                isFollowing: false
            },
            {
                id: 'user-8',
                name: 'James Anderson',
                username: 'jamesa',
                avatar: '../images/avatar-placeholder-9.jpg',
                isOnline: true,
                isFollowing: true
            }
        ];
    }
});
