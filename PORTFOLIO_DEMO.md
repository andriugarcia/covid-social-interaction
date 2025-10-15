# COVID Social Interaction - Portfolio Demo Mode

This project has been transformed into a portfolio demonstration app with all backend dependencies removed and replaced with hardcoded demo data.

## 🔥 Changes Made

### ✅ Authentication System Removed
- **Removed files:**
  - `pages/signup.vue` - Signup page
  - `pages/recoverPassword.vue` - Password recovery page
  - `components/login/login.vue` - Login component

- **Updated files:**
  - `store/auth.js` - Now contains hardcoded demo user data
  - `mixins/login.js` - Always returns false for authentication checks
  - `layouts/default.vue` - Removed login component references
  - `store/index.js` - Disabled login dialogs

### ✅ Demo User Data
The app now runs with a pre-configured demo user:
```javascript
{
  profile_id: 'demo-user-123',
  username: 'demo_user',
  name: 'Demo User',
  email: 'demo@olimaps.com',
  profile_picture: 'https://picsum.photos/200/200?random=1',
  description: '¡Hola! Soy un usuario demo de Olimaps...',
  followers: 142,
  following: 89,
  notifications: [...],
  participation: [...],
  rrss: [...],
  groups: [...]
}
```

### ✅ Backend API Calls Replaced
All store actions now return demo data instead of making HTTP requests:

- **`store/auth.js`** - Authentication flows return demo user
- **`store/chat.js`** - Chat actions return demo conversations and groups
- **`store/post.js`** - Post actions return demo posts and media
- **`store/event.js`** - Event actions return demo events and RSVPs
- **`store/user.js`** - User actions return demo profiles and social data
- **`store/storage.js`** - Upload actions return placeholder URLs

### ✅ Socket.io Mocked
- **`socket.js`** - Replaced with mock socket object
- **`components/chat/grupal.vue`** - Uses mock socket
- Real-time features simulated with static data

### ✅ Default Location Set
- **`store/map.js`** - Default location set to Madrid (40.4168, -3.7038)
- No geolocation required for demo

### ✅ Environment Variables
- **`nuxt.config.js`** - Added fallback values for all environment variables
- App runs without requiring `.env` file

## 🚀 Demo Data Features

### Posts
- Interactive map with demo posts around Madrid
- Image, video, and text posts
- Realistic engagement numbers (likes, shares)

### Events
- Demo events with categories (🌳, 🎵, 💬, etc.)
- Event participation and RSVP functionality
- Location-based event discovery

### Chat & Groups
- Demo private chats and group conversations
- Message history simulation
- Group member management

### User Profiles
- Demo user profiles with posts and events
- Follow/unfollow functionality
- Social media links

### Search
- User search with demo results
- Place search using Mapbox (requires MAPBOX_TOKEN)

## 🛠️ Running the Demo

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set environment variables (optional):**
   ```bash
   # For Mapbox map functionality
   export MAPBOX_TOKEN=your_mapbox_token
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run start
   ```

## 📱 Available Features

### ✅ Working in Demo Mode
- ✅ Interactive map with posts
- ✅ User profiles and navigation
- ✅ Event browsing and creation UI
- ✅ Chat interface with demo conversations
- ✅ Post creation and media upload UI
- ✅ Search functionality
- ✅ Notifications system
- ✅ Social features (follow, like, save)

### ⚠️ Requires External Services
- 🗺️ **Maps** - Requires Mapbox token for full functionality
- 🔥 **Analytics** - Firebase analytics (optional)
- 📱 **Push notifications** - OneSignal (optional)

## 🎯 Portfolio Showcase Points

1. **Vue.js/Nuxt.js Expertise** - Full-stack Vue application with SSR
2. **Vuetify Design System** - Material Design implementation
3. **State Management** - Complex Vuex store patterns
4. **Real-time UI** - Chat and notification interfaces
5. **Geolocation & Maps** - Interactive mapping features
6. **Media Handling** - Image/video upload and display
7. **Responsive Design** - Mobile-first approach
8. **PWA Features** - Progressive Web App capabilities

## 🔧 Technical Stack

- **Frontend:** Vue.js 2, Nuxt.js, Vuetify
- **State Management:** Vuex
- **Maps:** Mapbox GL JS
- **Styling:** SCSS, Material Design
- **Build:** Webpack, Babel
- **PWA:** Service Workers, App Manifest

## 📝 Notes

- All data is static and resets on page refresh
- No actual backend communication occurs
- Perfect for showcasing frontend skills and UX design
- Can be easily deployed to static hosting (Netlify, Vercel, etc.)

---

*This demo transformation maintains all the original UI/UX while making the app fully self-contained for portfolio purposes.*