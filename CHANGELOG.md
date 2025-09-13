# Changelog

All notable changes to AI Governance Navigator will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-09-13

### 🚀 Added
- **Interactive Dashboard**: Clickable risk level cards with seamless navigation to filtered Registry views
- **URL-based Registry Filtering**: Direct links to filtered AI systems (e.g., `/registry?riskLevel=high`)
- **Enhanced Visual Feedback**: 
  - Animated counter effects with staggered timing
  - Hover effects with scaling and color transitions
  - Status badges with emojis and pulse animations
  - Gradient progress bars with shine effects
- **Data Transformation Utils**: Centralized utilities for frontend-backend data conversion
- **Risk Level Management**: Backend utilities for consistent risk level handling across API endpoints

### 🔧 Enhanced
- **Dashboard Navigation**: Risk level distribution cards now navigate to filtered Registry views
- **Registry UX**: Added visual indicators for active filters, "Back to Dashboard" button, and clear filter functionality
- **API Reliability**: Improved risk level enum mapping between frontend (`high`, `minimal`) and backend (`HIGH_RISK`, `MINIMAL_RISK`)
- **Code Organization**: Refactored data transformations into reusable utility functions
- **Error Handling**: Better handling of unclassified systems (null risk levels)

### 🐛 Fixed
- **Registry Filtering**: Fixed blank registry when navigating from Dashboard risk cards
- **Data Format Mismatch**: Resolved inconsistency between backend enum format and frontend expectations
- **URL Parameter Handling**: Proper state synchronization when URL parameters change
- **Database Connection**: Improved PostgreSQL connection reliability

### 🎨 Improved
- **User Experience**: Smooth transitions and animations throughout the application
- **Visual Design**: Modern status badges, hover effects, and responsive layouts
- **Performance**: Optimized data transformations and reduced redundant API calls
- **Code Quality**: Removed debug logs, consolidated utility functions, and improved type safety

### 🏗️ Refactored
- **Frontend Components**: 
  - Extracted data transformation logic to `src/frontend/utils/dataTransforms.ts`
  - Simplified Registry component with reusable utilities
  - Improved component modularity and maintainability
- **Backend Routes**:
  - Created `src/backend/utils/riskLevelUtils.ts` for consistent risk level handling
  - Consolidated filtering logic across API endpoints
  - Enhanced error handling and validation

### 📚 Documentation
- **README.md**: Updated with new interactive features and enhanced UX descriptions
- **Package.json**: Version bump to 0.2.0 with updated description
- **Code Comments**: Improved inline documentation and type definitions

## [0.1.0] - 2025-09-12

### 🚀 Initial Release
- **AI System Intake**: Complete form with EU AI Act risk classification
- **Policy Packs**: Functional MVP with 42 EU AI Act controls
- **AI Registry**: System portfolio management and tracking
- **Dashboard**: Risk distribution and compliance overview
- **Authentication**: Basic auth system with role-based access
- **QA Pipeline**: 147+ automated compliance and security checks
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful endpoints with TypeScript
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Node.js + Express + TypeScript

### 🏗️ Architecture
- Full-stack TypeScript application
- Modern React frontend with Vite
- Express.js backend with Prisma ORM
- PostgreSQL database
- Docker containerization support
- GitHub Actions CI/CD pipeline

---

## 🔗 Links
- [GitHub Repository](https://github.com/hemdesai/AIGovNav)
- [Documentation](README.md)
- [CTO Demo Materials](CTO_DEMO_MATERIALS.md)
- [QA Summary](QA_CALIBRATION_SUMMARY.md)

## 📋 Version Schema
- **Major** (X.0.0): Breaking changes, major feature releases
- **Minor** (0.X.0): New features, enhancements, significant improvements
- **Patch** (0.0.X): Bug fixes, small improvements, documentation updates