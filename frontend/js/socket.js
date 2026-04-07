// ==========================================
// SOCKET.JS - Socket.io Realtime Client
// ==========================================

let socket = null;

function initSocket() {
  const token = getToken();
  if (!token) return;

  // Load socket.io client from server
  if (typeof io === 'undefined') {
    const script = document.createElement('script');
    script.src = '/socket.io/socket.io.js';
    script.onload = () => connectSocket(token);
    document.head.appendChild(script);
  } else {
    connectSocket(token);
  }
}

function connectSocket(token) {
  socket = io(window.location.origin, {
    auth: { token }
  });

  socket.on('connect', () => {
    console.log('🔌 Socket connected');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
  });

  // Notification events
  socket.on('notification:new', (data) => {
    showToast('🔔 Thông báo mới', data.title || data.content || 'Bạn có thông báo mới', 'info');
    updateNotificationBadge();
  });

  // Leaderboard update
  socket.on('leaderboard:update', (data) => {
    showToast('🏆 Bảng xếp hạng', 'Bảng xếp hạng vừa được cập nhật', 'info');
    // Refresh leaderboard if on that page
    if (typeof loadLeaderboard === 'function') {
      loadLeaderboard();
    }
  });

  // New reward
  socket.on('reward:new', (data) => {
    showToast('🎁 Phần thưởng mới', data.title || 'Có phần thưởng mới!', 'success');
    // Refresh rewards if on that page
    if (typeof loadRewards === 'function') {
      loadRewards();
    }
  });

  // Level up
  socket.on('level:up', (data) => {
    showToast('🎉 Level Up!', `Chúc mừng! Bạn đã lên Level ${data.level || ''}`, 'success');
  });
}

// ===== TOAST NOTIFICATION SYSTEM =====
function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <div class="toast-body">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  container.appendChild(toast);

  // Auto remove after 5s
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.remove(), 300);
  }, 5000);
}

// Update notification badge in sidebar
async function updateNotificationBadge() {
  try {
    const res = await getUnreadCount();
    const badge = document.getElementById('notification-badge');
    if (badge) {
      const count = res.data.unreadCount;
      badge.textContent = count;
      badge.style.display = count > 0 ? 'inline' : 'none';
    }
  } catch (e) {
    // Silent fail
  }
}
