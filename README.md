# SpaceMate - Modern PG/Hostel Management System

## Overview
SpaceMate is a comprehensive mobile application designed to streamline the management of Paying Guest (PG) accommodations and hostels. The application serves three distinct user roles: Administrators, PG Guests, and Public users, each with tailored functionalities to enhance the accommodation experience.

## 🎯 Purpose
SpaceMate addresses the growing need for digital solutions in the accommodation management sector by:
- Simplifying room booking and management
- Streamlining meal planning and tracking
- Enhancing communication between administrators and guests
- Providing a seamless booking experience for new guests
- Managing payments and notifications efficiently

## 🚀 Features

### For Administrators
- Dashboard with key metrics and analytics
- Room management and availability tracking
- Meal planning and management
- Guest management and communication
- Notification system
- Profile and settings management

### For PG Guests
- Personalized dashboard
- Room information and status
- Meal schedules and preferences
- Notification center
- Profile management
- Payment tracking

### For Public Users
- Room browsing and filtering
- Detailed room information
- Online booking system
- Secure payment processing
- Booking status tracking

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: 
  - Tailwind CSS
  - shadcn/ui components
  - Radix UI primitives
- **State Management**: React Query
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Comprehensive set of Radix UI components
- **Data Visualization**: Recharts

### Mobile Development
- **Framework**: Capacitor 7
- **Platforms**: 
  - iOS
  - Android

### Development Tools
- TypeScript for type safety
- ESLint for code quality
- PostCSS for CSS processing
- Tailwind for utility-first CSS

## 🏗️ Project Structure
```
src/
├── components/     # Reusable UI components
├── contexts/       # React context providers
├── hooks/          # Custom React hooks
├── lib/           # Utility functions and configurations
├── pages/         # Application pages
│   ├── admin/     # Admin-specific pages
│   ├── guest/     # PG guest pages
│   └── public/    # Public-facing pages
├── types/         # TypeScript type definitions
└── data/          # Static data and constants
```

## 🚀 Getting Started

### Prerequisites
- Node.js (Latest LTS version recommended)
- npm or yarn
- iOS/Android development environment (for mobile builds)

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd space-mate-app

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Mobile
```bash
# Build the web application
npm run build

# Add mobile platforms
npx cap add android
npx cap add ios

# Sync with native projects
npx cap sync

# Open in native IDEs
npx cap open android
npx cap open ios
```

## 🔧 Development Workflow
1. Development server runs on `http://localhost:8080`
2. Changes are automatically reflected in the browser
3. Mobile builds can be tested using Capacitor's live reload
4. Use the provided scripts for building and deployment

## 📱 Mobile Deployment
The application can be deployed to both iOS and Android platforms using Capacitor. Follow the platform-specific guidelines for:
- App Store submission
- Google Play Store submission
- Production builds
- Environment configuration

## 🔐 Security
- Role-based access control
- Secure authentication system
- Protected API endpoints
- Secure payment processing

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support
For support, please contact [support email/contact]

## 🔄 Updates
Regular updates and improvements are planned for:
- Enhanced user experience
- Additional features
- Performance optimizations
- Security enhancements
