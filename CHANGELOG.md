# Changelog

All notable changes to this project will be documented in this file. The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.0.1] - 2026-03-11

### Added
- ✨ **Enhanced Products Page**: Full DTO expansion with complete field display
  - All product fields now visible: id, name, description, facilityId, countryId, colors, types
  - Status flags: isBlockedForProduction, freeForProduction, isMixedProduct
  
- 🔍 **Advanced Products Filtering**: Multi-field search with submit-only execution
  - Text filters: name, description
  - Numeric filter: facilityId
  - Country dropdown: Dynamic reference data from /api/countries/reference
  - Boolean filters: Production status flags
  - Prevents unnecessary API calls with separated filter state (filters vs appliedFilters)

- 🛋️ **Redesigned Navigation**: Improved sidebar with integrated user profile
  - Full-height fixed sidebar spanning entire viewport
  - Integrated user profile section with avatar, name, and role
  - Profile dropdown menu (Dashboard, Dark Mode, Logout)
  - Hierarchical menu structure (Language Management parent folder)

- 🔐 **Routing & Authentication**: Enhanced login flow
  - Proper initialization of authentication state on app load
  - Login page displayed by default for unauthenticated users
  - Loading state with spinner during route initialization
  - Prevents undefined content rendering

### Changed
- Removed TopNav component (now integrated into Sidebar profile section)
- Countries fetchCountriesReference() now properly unwraps API response wrapper (data.items)
- Updated Country interface to include isoCode property
- Boolean filter values converted to strings for proper select element binding

### Fixed
- App routing now correctly initializes based on authentication status
- TypeScript errors in ProductsPage boolean select elements resolved
- Proper handling of paginated API responses in countriesApi

## [1.0.0] - 2026-03-10

### Added
- ✨ **Authentication System**: Secure JWT-based login with session management
  - Email/password login form
  - Session storage with persistent tokens
  - Automatic token refresh on expiry
  - Logout functionality with session clearing

- 🔍 **Advanced Search**: Full-text POST-based search across 8 data entities
  - Facilities search
  - Products search
  - Countries search
  - Languages search
  - Users search
  - Production Lines search
  - Language Values search
  - Navision Products search
  - Dynamic search fields per entity type
  - Pagination support (15 items per page)

- 📊 **Data Management Tables**: Interactive paginated tables for:
  - Facilities (with status indicators)
  - Countries
  - Languages
  - Products
  - Production Lines
  - Users
  - Language Values
  - Navision Products

- 🎨 **Modern UI with Tailwind CSS v4**:
  - Responsive design
  - Dark mode toggle (persistent storage)
  - Utility-first CSS approach
  - PostCSS v4 plugin integration
  - Light/Dark color scheme (gray + blue accents)
  - Hover states and transitions

- 🌙 **Dark Mode**: 
  - Toggle in top navigation
  - Persistent user preference
  - CSS class selector strategy
  - Smooth transitions between themes

- 📱 **Responsive Navigation**:
  - Top navigation bar with user menu
  - Collapsible sidebar for authenticated users
  - Dashboard, Facilities, Countries, Languages, Products, Production Lines, Users, Language Values, and Navision Products pages
  - Navigation state tracking

- ⚡ **Performance Optimization**:
  - Vite 7.3.1 build tool
  - Code splitting
  - Production CSS: 39.51 KB gzipped
  - Production JS: 66.47 KB gzipped
  - Optimized bundle size

- 🏗️ **TypeScript Support**:
  - Strict type checking enabled
  - Type-safe API client
  - Interface-based architecture
  - Generic components for reusability

- 🔐 **API Integration**:
  - Custom axios-based HTTP client
  - Bearer token authentication
  - Error handling and validation
  - Response data normalization
  - Automatic error prefix for debugging

- 📖 **Comprehensive Documentation**:
  - Full README with setup instructions
  - API integration guide
  - Architecture overview
  - Deployment instructions
  - Troubleshooting section

### Technical Stack
- **React**: 19.2.0 (latest with new hooks)
- **TypeScript**: 5.7.2 (strict mode)
- **React DOM**: 19.2.0
- **Tailwind CSS**: 4.2.1 (new PostCSS plugin)
- **@tailwindcss/postcss**: 4.2.1
- **Vite**: 7.3.1
- **PostCSS**: 8.5.8
- **Autoprefixer**: 10.4.27
- **ESLint**: 9.39.1 with React plugin

### Project Structure
```
src/
├── components/          # Reusable React components
├── pages/               # Page components (9 total)
├── services/            # API service layer (11 modules)
├── styles/              # Tailwind CSS configuration
├── App.tsx              # Root component with routing
├── main.tsx             # Entry point
└── index.css            # Tailwind imports
```

### Features by Release Phase

#### Phase 1: Foundation (Completed)
- React + TypeScript setup
- Authentication system
- API client integration
- Basic routing

#### Phase 2: UI/Styling (Completed)
- Tailwind CSS v4 migration
- Dark mode implementation
- Responsive design
- Component styling

#### Phase 3: Data Management (Completed)
- GenericListPage component
- Pagination support
- Table rendering for 8 entities
- Search functionality

#### Phase 4: Polish (Completed)
- Error handling
- Validation
- Performance optimization
- Documentation

### Configuration Files
- `package.json` - 1.0.0 with all dependencies
- `vite.config.js` - Vite configuration
- `tailwind.config.js` - Tailwind customization
- `postcss.config.js` - PostCSS with Tailwind v4
- `tsconfig.json` - TypeScript strict mode
- `eslint.config.js` - ESLint rules

### Known Limitations
- Single-page application (no server-side rendering)
- Requires API server at configured URL
- Dark mode uses CSS class selector (not system preference)
- Search fields are entity-specific (not fully customizable)

### Environment Setup
- **Node.js**: 18+ required
- **Package Manager**: npm/yarn
- **API Server**: https://localhost:7046/api (configurable)
- **Browser**: Modern browsers supporting ES2020+

### Initial Commit Details
- 39 files committed (5,937 insertions)
- All core features implemented
- Production build passing
- Ready for deployment

---

## Versioning Strategy

This project uses **Semantic Versioning**: MAJOR.MINOR.PATCH

- **MAJOR**: Breaking changes to API or architecture
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes and minor improvements

### Release Planning
- v1.0.x: Bug fixes and minor improvements
- v1.1.0: Additional search filters, more entities
- v1.2.0: CRUD operations for entities
- v2.0.0: Major refactor with breaking changes (planned for future)

---

**Last Updated**: March 10, 2026  
**Maintained By**: Cesar Cremery  
**Repository**: https://github.com/cesarcremery99/stubbereactfrontend
