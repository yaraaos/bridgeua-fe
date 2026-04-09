BridgeUA — Frontend (Expo / React Native)

BridgeUA is a community-driven mobile application that connects users with trusted Ukrainian businesses through real recommendations.

This repository contains the frontend (mobile app), built with:
- React Native
- Expo
- Expo Router
- TypeScript


----------------------------------------
GETTING STARTED
----------------------------------------

1. Clone the repository

git clone <your-repo-url>
cd bridgeua-fe


2. Install dependencies

npm install


3. Start the app

npx expo start


Open on your phone:
- Install Expo Go from the App Store or Google Play
- Scan the QR code shown in the terminal
- Make sure your phone and laptop are on the same Wi-Fi


If it doesn’t connect:

npx expo start --tunnel


----------------------------------------
PROJECT STRUCTURE OVERVIEW
----------------------------------------
```text
bridgeua-fe/
├── app/        → Screens and navigation (Expo Router)
├── src/        → Logic, components, services, theme
├── assets/     → Images, icons, fonts
```

----------------------------------------
APP FOLDER (ROUTING & SCREENS)
----------------------------------------

The app/ folder controls navigation using Expo Router.

Think of it as the "pages" of the app.

Main sections:
```text
app/
- splash/           → Splash screen
- onboarding/       → Onboarding flow
- auth/             → Login, signup, password flows
- (tabs)/           → Main app (bottom tabs navigation)
- business/         → Business details and related pages
- add-business/     → Add business flow
- profile/          → User profile pages
- search/           → Search screens
- filters/          → Filters (can also be modal)
- promotions/       → Promotions pages
- settings/         → App settings
- modal/            → Bottom sheets and overlays
```

Routing example:

File:
app/business/[id].tsx

Route:
business/123


----------------------------------------
COMPONENTS (REUSABLE UI)
----------------------------------------

Location:
src/components/

This is the most important folder for UI consistency.

Never duplicate UI — reuse components from here.


Global UI components:

src/components/ui/

Includes:
- AppButton
- AppInput
- AppScreen
- AppChip
- AppRating
- GradientHeader
- AppBottomSheet
- AppCard

If you want to change the design globally, modify components here.


Feature-based components:

src/components/home/
src/components/business/
src/components/profile/
src/components/add-business/
src/components/auth/

Examples:
- BusinessCard
- DiscoverHeader
- ProfileHeader
- PromoBanner


----------------------------------------
FEATURES (BUSINESS LOGIC)
----------------------------------------

Location:
src/features/

Each feature is isolated.

Structure:

features/
- auth/
- businesses/
- reviews/
- profile/
- add-business/
- filters/

Inside each feature:
- hooks/        → custom hooks
- services/     → API logic
- types/        → types
- validation/   → form validation


----------------------------------------
SERVICES (EXTERNAL LOGIC)
----------------------------------------

Location:
src/services/

Handles communication with backend and external systems.

Includes:
- api/        → API client and endpoints
- auth/       → token and session logic
- storage/    → SecureStore and local storage
- analytics/  → event tracking


----------------------------------------
STORE (GLOBAL STATE)
----------------------------------------

Location:
src/store/

Holds global state:

- auth.store.ts
- profile.store.ts
- filter.store.ts
- discovery.store.ts


----------------------------------------
DESIGN SYSTEM
----------------------------------------

Location:
src/constants/

This defines the visual identity of the app.

Includes:
- colors.ts
- spacing.ts
- radius.ts
- typography.ts
- gradients.ts
- shadows.ts

Important rule:
Do NOT hardcode styles. Always use constants.


----------------------------------------
MOCK DATA
----------------------------------------

Location:
src/mocks/

Used during development before backend is ready.

Examples:
- businesses.mock.ts
- reviews.mock.ts
- profile.mock.ts


----------------------------------------
UTILS
----------------------------------------

Location:
src/utils/

Helper functions such as:
- formatDate
- validators
- general helpers


----------------------------------------
ASSETS
----------------------------------------

Location:
assets/

Includes:
- images/
- icons/
- fonts/
- lottie/


----------------------------------------
NAVIGATION FLOW
----------------------------------------

App flow:

Splash → Onboarding → Auth → Main App (Tabs)

Tabs include:
- Home
- Following
- Add
- Notifications
- Profile


----------------------------------------
DESIGN RULES
----------------------------------------

Colors:
- Primary: Green
- Accent: Orange
- Background: Light neutral
- Text: Dark + gray variants

UI Principles:
- Rounded corners
- Clean white cards
- Soft shadows
- Gradient headers
- Consistent spacing


----------------------------------------
DEVELOPMENT GUIDELINES
----------------------------------------

1. Do NOT duplicate UI  
Always reuse components from src/components/ui/

2. Do NOT hardcode styles  
Use constants:
colors.primaryGreen
spacing.md
radius.lg

3. Keep logic out of screens  
Screens = layout only  
Logic → features/

4. Use mock data first  
Located in src/mocks/

5. Naming conventions  
- Components: PascalCase  
- Files: camelCase or kebab-case  
- Folders: kebab-case  


----------------------------------------
ENVIRONMENT VARIABLES
----------------------------------------

Create a .env file:

EXPO_PUBLIC_API_URL=http://localhost:4000


----------------------------------------
BACKEND CONNECTION (FUTURE)
----------------------------------------

API will be connected through:

src/services/api/client.ts


----------------------------------------
CURRENT STATUS
----------------------------------------

- Project structure created
- Navigation configured
- Core UI components added
- Mock data in place
- Backend integration pending


----------------------------------------
QUICK GUIDE
----------------------------------------

If you want to:

Add a screen → go to app/  
Create reusable UI → src/components/ui/  
Add feature logic → src/features/  
Call API → src/services/api/  
Change design → src/constants/  
Use fake data → src/mocks/
