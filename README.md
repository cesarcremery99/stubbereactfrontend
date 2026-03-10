# Stubbe Admin Dashboard

> A modern React-based admin dashboard for the Stubbe TrackTrace API.  
> **Version**: 1.0.0 | **Status**: ✅ Production Ready  
> [📋 Changelog](./CHANGELOG.md) | [🐛 Issues](https://github.com/cesarcremery99/stubbereactfrontend/issues)

Built with React 19, TypeScript, Tailwind CSS v4, and Vite.

## ✨ Features

- **🔐 Authentication**: Secure login and session management with JWT tokens
- **🔍 Advanced Search**: Full-text search across 8 data entities with POST-based filtering
- **📊 Data Management**: Interactive tables with pagination for:
  - Facilities
  - Countries
  - Languages
  - Products
  - Production Lines
  - Users
  - Language Values
  - Navision Products
- **🎨 Modern UI**: Built with Tailwind CSS v4 with responsive design and dark mode
- **🌙 Dark Mode**: Toggle between light and dark themes with persistent settings
- **📱 Responsive Design**: Mobile-friendly interface with collapsible sidebar
- **⚡ Fast Performance**: Optimized with Vite, producing minimal bundle sizes

## 🏗️ Architecture

- **Frontend Framework**: React 19.2.0 with TypeScript (strict mode)
- **Build Tool**: Vite 7.3.1
- **Styling**: Tailwind CSS v4.2.1 with @tailwindcss/postcss
- **State Management**: React hooks (useState, useEffect, useMemo)
- **API Integration**: Custom axios-based API client with error handling
- **Routing**: Client-side routing with browser history API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- API server running at `https://localhost:7046/api` (configurable)

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/cesarcremery99/stubbereactfrontend.git
cd stubbereactfrontend

# Install dependencies (v1.0.0)
npm install
```

### Development

```bash
# Start the development server (hot reload enabled)
npm run dev

# Server will start on http://localhost:5176 (or next available port)
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build
npm run preview
```

### Linting

```bash
# Check for ESLint errors
npm run lint
```

## 🔧 Configuration

### API Base URL

Set your API server URL in one of these ways:

1. **Environment Variable**: Set `VITE_API_URL` in `.env` file
2. **Local Storage**: Enter URL in login page (saved: `authApiBaseUrl`)
3. **Default**: `https://localhost:7046/api`

Example `.env`:
```env
VITE_API_URL=https://api.example.com/api
```

### Dark Mode

Dark mode preference is persisted in localStorage as `darkMode`. Toggle it using the theme switcher in the top navigation.

## 🔐 Authentication Flow

1. User enters email and password on login page
2. Credentials sent to `/auth/login` endpoint
3. API returns `accessToken`, `refreshToken`, and `expiryDate`
4. Session stored in localStorage and state
5. Access token included in all subsequent API requests
6. Token refresh handled automatically on expiry

## 📡 API Integration

### Search Functionality

All search endpoints are **POST** requests with the following body structure:

```json
{
  "name": "search query",
  "pagination": {
    "pageNumber": 1,
    "pageSize": 15
  }
}
```

Supported search endpoints:
- `POST /facilities/search`
- `POST /products/search`
- `POST /languages/search`
- `POST /production-lines/search`
- `POST /management/users/search`
- `POST /language-values/search`
- `POST /navision-products/search`
- `GET /countries/search` (query parameters)

### Custom API Client

The `apiClient.ts` provides utility functions for making authenticated requests:

```typescript
const result = await apiRequest({
  baseUrl: 'https://api.example.com/api',
  path: '/facilities/all',
  method: 'GET',
  accessToken: 'jwt-token-here',
  errorPrefix: 'Failed to fetch facilities'
})
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── GenericListPage.tsx    # Paginated table with search
│   ├── TopNav.tsx              # Navigation header
│   └── Sidebar.tsx             # Side navigation menu
├── pages/               # Page components
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── FacilitiesPage.tsx
│   └── ...other pages
├── services/            # API service layer
│   ├── apiClient.ts     # HTTP client utilities
│   ├── authApi.ts       # Authentication endpoints
│   ├── facilitiesApi.ts # Facilities endpoints
│   └── ...other services
├── styles/              # Global styles
│   └── app.css          # Tailwind directives
├── App.tsx              # Root component with routing
├── main.tsx             # Application entry point
└── index.css            # Tailwind imports
```

## 🎨 Styling

This project uses **Tailwind CSS v4** with the new PostCSS plugin. All styles are utility-first and can be customized via `tailwind.config.js`.

### Color Scheme

- **Light Mode**: Gray scale (50-950) with blue accents
- **Dark Mode**: Dark gray backgrounds with light text
- **Primary Color**: Blue (500-600)
- **Secondary Colors**: Teal, Green, Red for status indicators

### Responsive Breakpoints

Tailwind's default breakpoints are used:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## 🧪 Testing

```bash
# Run linting (built-in ESLint)
npm run lint
# (Unit/integration testing setup recommended for production use)
```

## 🐛 Troubleshooting

### Login not working
- Verify API server is running on configured URL
- Check browser console for CORS errors
- Ensure credentials are correct

### Search not returning results
- Verify POST request body includes pagination object
- Check API response format matches expected schema
- Enable browser DevTools network tab to inspect requests

### Styling not applied
- Clear browser cache and node_modules
- Rebuild: `npm run build`
- Check Tailwind classes are spelled correctly

## 📝 Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_URL=https://localhost:7046/api

# Other configurations
VITE_DEBUG=false
```

## 📍 Versioning

This project uses **Semantic Versioning** (MAJOR.MINOR.PATCH):

- **Current Version**: 1.0.0
- **Release Date**: March 10, 2026
- **Status**: ✅ Production Ready

### Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed release notes and update history.

**Versioning Strategy:**
- **MAJOR** (x.0.0): Breaking API changes or major architectural updates
- **MINOR** (0.x.0): New features (backwards compatible)
- **PATCH** (0.0.x): Bug fixes and minor improvements

### Checking Your Version

```bash
# Check version from package.json
npm list | grep stubbe-admin-dashboard

# Or view VERSION file
cat VERSION
```

## 🚢 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized `dist/` folder with:
- Minified CSS (~39 KB gzipped)
- Minified JavaScript (~66 KB gzipped)
- Optimized assets

### Serving

Use any static file server:

```bash
# Using Node.js http-server
npx http-server dist

# Using Python
python -m http.server --directory dist 8000

# Using Docker (example)
docker run -p 80:80 -v $(pwd)/dist:/usr/share/nginx/html nginx
```

## 📚 Dependencies

- `react@19.2.0` - UI library
- `react-dom@19.2.0` - React DOM rendering
- `typescript@5.7.2` - Type safety
- `tailwindcss@4.2.1` - Utility-first CSS
- `vite@7.3.1` - Build tool

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create a Pull Request

## 📄 License

This project is proprietary software for Stubbe/TrackTrace.

## 📞 Support

For issues or questions, contact the development team or open an issue on GitHub.

---

**Last Updated**: March 10, 2026
**Version**: 1.0.0
