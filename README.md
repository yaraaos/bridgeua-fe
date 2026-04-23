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

----------------------------------------
FULL PROJECT STRUCTURE OVERVIEW
----------------------------------------
```
bridgeua-fe
├─ .env
├─ .env.example
├─ app
│  ├─ (tabs)
│  │  ├─ add.tsx
│  │  ├─ following.tsx
│  │  ├─ home.tsx
│  │  ├─ notifications.tsx
│  │  ├─ profile.tsx
│  │  └─ _layout.tsx
│  ├─ +not-found.tsx
│  ├─ add-business
│  │  ├─ category-picker.tsx
│  │  ├─ form.tsx
│  │  ├─ no-match.tsx
│  │  ├─ search.tsx
│  │  └─ success.tsx
│  ├─ auth
│  │  ├─ confirm-code.tsx
│  │  ├─ forgot-password.tsx
│  │  ├─ reset-password.tsx
│  │  ├─ sign-in.tsx
│  │  ├─ sign-up-business.tsx
│  │  ├─ sign-up-personal.tsx
│  │  ├─ success.tsx
│  │  └─ _layout.tsx
│  ├─ bookings
│  │  ├─ choose-date.tsx
│  │  ├─ choose-service.tsx
│  │  ├─ choose-specialist.tsx
│  │  ├─ confirm.tsx
│  │  └─ no-slots.tsx
│  ├─ business
│  │  ├─ about.tsx
│  │  ├─ analytics.tsx
│  │  ├─ edit.tsx
│  │  ├─ photos.tsx
│  │  ├─ promotions.tsx
│  │  ├─ recommended-by.tsx
│  │  ├─ reviews.tsx
│  │  ├─ services.tsx
│  │  ├─ write-review.tsx
│  │  └─ [id].tsx
│  ├─ filters
│  │  ├─ cuisines.tsx
│  │  ├─ distance.tsx
│  │  ├─ index.tsx
│  │  ├─ ratings.tsx
│  │  └─ sort.tsx
│  ├─ index.tsx
│  ├─ modal
│  │  ├─ filter.tsx
│  │  ├─ image-viewer.tsx
│  │  ├─ sort.tsx
│  │  └─ switch-account.tsx
│  ├─ onboarding
│  │  ├─ index.tsx
│  │  ├─ step-1.tsx
│  │  ├─ step-2.tsx
│  │  └─ step-3.tsx
│  ├─ profile
│  │  ├─ account-type.tsx
│  │  ├─ business.tsx
│  │  ├─ businesses.tsx
│  │  ├─ edit.tsx
│  │  ├─ followers.tsx
│  │  ├─ following.tsx
│  │  ├─ personal.tsx
│  │  ├─ reviews.tsx
│  │  ├─ saved.tsx
│  │  └─ switch-account.tsx
│  ├─ promotions
│  │  ├─ index.tsx
│  │  └─ [id].tsx
│  ├─ search
│  │  ├─ empty.tsx
│  │  ├─ index.tsx
│  │  └─ results.tsx
│  ├─ settings
│  │  ├─ about.tsx
│  │  ├─ account.tsx
│  │  ├─ help.tsx
│  │  ├─ index.tsx
│  │  ├─ language.tsx
│  │  ├─ notifications.tsx
│  │  ├─ privacy.tsx
│  │  └─ terms.tsx
│  ├─ splash
│  │  └─ index.tsx
│  └─ _layout.tsx
├─ app.json
├─ babel.config.js
├─ eslint.config.js
├─ package-lock.json
├─ package.json
├─ README.md
├─ src
│  ├─ components
│  │  ├─ add-business
│  │  │  ├─ AddBusinessForm
│  │  │  │  ├─ AddBusinessForm.styles.ts
│  │  │  │  └─ AddBusinessForm.tsx
│  │  │  ├─ CategorySelector
│  │  │  │  ├─ CategorySelector.styles.ts
│  │  │  │  └─ CategorySelector.tsx
│  │  │  ├─ index.ts
│  │  │  └─ SimilarBusinessCard
│  │  │     ├─ SimilarBusinessCard.styles.ts
│  │  │     └─ SimilarBusinessCard.tsx
│  │  ├─ auth
│  │  │  ├─ AccountTypeSwitch
│  │  │  ├─ AuthHeader
│  │  │  │  ├─ AuthHeader.styles.ts
│  │  │  │  └─ AuthHeader.tsx
│  │  │  ├─ index.ts
│  │  │  └─ SocialLoginRow
│  │  │     ├─ SocialLoginRow.styles.ts
│  │  │     └─ SocialLoginRow.tsx
│  │  ├─ bookings
│  │  │  ├─ BookingStepper
│  │  │  │  ├─ BookingStepper.styles.ts
│  │  │  │  └─ BookingStepper.tsx
│  │  │  ├─ BookingSummaryCard
│  │  │  │  ├─ BookingSummaryCard.styles.ts
│  │  │  │  └─ BookingSummaryCard.tsx
│  │  │  ├─ CalendarAvailability
│  │  │  │  ├─ CalendarAvailability.styles.ts
│  │  │  │  └─ CalendarAvailability.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ ServiceSelectionCard
│  │  │  │  ├─ ServiceSelectionCard.styles.ts
│  │  │  │  └─ ServiceSelectionCard.tsx
│  │  │  └─ SpecialistCard
│  │  │     ├─ SpecialistCard.styles.ts
│  │  │     └─ SpecialistCard.tsx
│  │  ├─ business
│  │  │  ├─ BusinessActionRow
│  │  │  ├─ BusinessBookingCard
│  │  │  ├─ BusinessCard
│  │  │  │  ├─ BusinessCard.styles.ts
│  │  │  │  └─ BusinessCard.tsx
│  │  │  ├─ BusinessGalleryGrid
│  │  │  ├─ BusinessHeader
│  │  │  ├─ BusinessHeroGallery
│  │  │  │  ├─ BusinessHeroGallery.styles.ts
│  │  │  │  └─ BusinessHeroGallery.tsx
│  │  │  ├─ BusinessInfoRow
│  │  │  │  ├─ BusinessInfoRow.styles.ts
│  │  │  │  └─ BusinessInfoRow.tsx
│  │  │  ├─ BusinessListItem
│  │  │  │  ├─ BusinessListItem.styles.ts
│  │  │  │  └─ BusinessListItem.tsx
│  │  │  ├─ BusinessMetaCard
│  │  │  │  ├─ BusinessMetaCard.styles.ts
│  │  │  │  └─ BusinessMetaCard.tsx
│  │  │  ├─ BusinessOverviewCard
│  │  │  ├─ FollowButton
│  │  │  │  ├─ FollowButton.styles.ts
│  │  │  │  └─ FollowButton.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ RecommendedByCard
│  │  │  │  ├─ RecommendedByCard.styles.ts
│  │  │  │  └─ RecommendedByCard.tsx
│  │  │  ├─ ReviewCard
│  │  │  │  ├─ ReviewCard.styles.ts
│  │  │  │  └─ ReviewCard.tsx
│  │  │  ├─ ReviewComposer
│  │  │  │  ├─ ReviewComposer.styles.ts
│  │  │  │  └─ ReviewComposer.tsx
│  │  │  ├─ ReviewFilters
│  │  │  │  ├─ ReviewFilters.styles.ts
│  │  │  │  └─ ReviewFilters.tsx
│  │  │  └─ ServiceSelectionCard
│  │  ├─ common
│  │  │  ├─ EmptyResults
│  │  │  │  ├─ EmptyResults.styles.ts
│  │  │  │  └─ EmptyResults.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ ScreenHeader
│  │  │  │  ├─ ScreenHeader.styles.ts
│  │  │  │  └─ ScreenHeader.tsx
│  │  │  └─ Section
│  │  │     ├─ Section.styles.ts
│  │  │     └─ Section.tsx
│  │  ├─ filters
│  │  │  ├─ DistanceSelector
│  │  │  │  ├─ DistanceSelector.styles.ts
│  │  │  │  └─ DistanceSelector.tsx
│  │  │  ├─ FilterOptionList
│  │  │  │  ├─ FilterOptionList.styles.ts
│  │  │  │  └─ FilterOptionList.tsx
│  │  │  ├─ FilterSidebar
│  │  │  │  ├─ FilterSidebar.styles.ts
│  │  │  │  └─ FilterSidebar.tsx
│  │  │  ├─ index.ts
│  │  │  └─ RatingSelector
│  │  │     ├─ RatingSelector.styles.ts
│  │  │     └─ RatingSelector.tsx
│  │  ├─ home
│  │  │  ├─ CategoryScroller
│  │  │  │  ├─ CategoryScroller.styles.ts
│  │  │  │  └─ CategoryScroller.tsx
│  │  │  ├─ DiscoverHeader
│  │  │  │  ├─ DiscoverHeader.styles.ts
│  │  │  │  └─ DiscoverHeader.tsx
│  │  │  ├─ HomeFiltersRow
│  │  │  │  ├─ HomeFiltersRow.styles.ts
│  │  │  │  └─ HomeFiltersRow.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ PromoBanner
│  │  │  │  ├─ PromoBanner.styles.ts
│  │  │  │  └─ PromoBanner.tsx
│  │  │  └─ SearchEmptyState
│  │  │     ├─ SearchEmptyState.styles.ts
│  │  │     └─ SearchEmptyState.tsx
│  │  ├─ navigation
│  │  │  ├─ CustomTabBar
│  │  │  │  ├─ CustomTabBar.styles.ts
│  │  │  │  └─ CustomTabBar.tsx
│  │  │  ├─ HeaderBackButton
│  │  │  │  ├─ HeaderBackButton.styles.ts
│  │  │  │  └─ HeaderBackButton.tsx
│  │  │  └─ index.ts
│  │  ├─ notifications
│  │  │  ├─ index.ts
│  │  │  └─ NotificationItem
│  │  │     ├─ NotificationItem.styles.ts
│  │  │     └─ NotificationItem.tsx
│  │  ├─ onboarding
│  │  │  ├─ index.ts
│  │  │  ├─ OnboardingDots
│  │  │  │  ├─ OnboardingDots.styles.ts
│  │  │  │  └─ OnboardingDots.tsx
│  │  │  └─ OnboardingSlide
│  │  │     ├─ OnboardingSlide.styles.ts
│  │  │     └─ OnboardingSlide.tsx
│  │  ├─ profile
│  │  │  ├─ AccountSwitcherSheet
│  │  │  │  ├─ AccountSwitcherSheet.styles.ts
│  │  │  │  └─ AccountSwitcherSheet.tsx
│  │  │  ├─ BusinessDashboardStats
│  │  │  │  ├─ BusinessDashboardStats.styles.ts
│  │  │  │  └─ BusinessDashboardStats.tsx
│  │  │  ├─ BusinessProfileHeader
│  │  │  │  ├─ BusinessProfileHeader.styles.ts
│  │  │  │  └─ BusinessProfileHeader.tsx
│  │  │  ├─ index.ts
│  │  │  ├─ PersonalProfileHeader
│  │  │  │  ├─ PersonalProfileHeader.styles.ts
│  │  │  │  └─ PersonalProfileHeader.tsx
│  │  │  ├─ ProfileHeader
│  │  │  │  ├─ ProfileHeader.styles.ts
│  │  │  │  └─ ProfileHeader.tsx
│  │  │  ├─ ProfileSearchBar
│  │  │  │  ├─ ProfileSearchBar.styles.ts
│  │  │  │  └─ ProfileSearchBar.tsx
│  │  │  ├─ ProfileStatsRow
│  │  │  │  ├─ ProfileStatsRow.styles.ts
│  │  │  │  └─ ProfileStatsRow.tsx
│  │  │  └─ UpcomingBookingsCard
│  │  │     ├─ UpcomingBookingsCard.styles.ts
│  │  │     └─ UpcomingBookingsCard.tsx
│  │  └─ ui
│  │     ├─ AppAvatar
│  │     │  ├─ AppAvatar.styles.ts
│  │     │  └─ AppAvatar.tsx
│  │     ├─ AppBadge
│  │     │  ├─ AppBadge.styles.ts
│  │     │  └─ AppBadge.tsx
│  │     ├─ AppBottomSheet
│  │     │  ├─ AppBottomSheet.styles.ts
│  │     │  └─ AppBottomSheet.tsx
│  │     ├─ AppButton
│  │     │  ├─ AppButton.styles.ts
│  │     │  └─ AppButton.tsx
│  │     ├─ AppCard
│  │     │  ├─ AppCard.styles.ts
│  │     │  └─ AppCard.tsx
│  │     ├─ AppCheckBox
│  │     ├─ AppChip
│  │     │  ├─ AppChip.styles.ts
│  │     │  └─ AppChip.tsx
│  │     ├─ AppDatePickerCard
│  │     ├─ AppDivider
│  │     │  ├─ AppDivider.styles.ts
│  │     │  └─ AppDivider.tsx
│  │     ├─ AppEmptyState
│  │     │  ├─ AppEmptyState.styles.ts
│  │     │  └─ AppEmptyState.tsx
│  │     ├─ AppIconButton
│  │     │  ├─ AppIconButton.styles.ts
│  │     │  └─ AppIconButton.tsx
│  │     ├─ AppImage
│  │     │  ├─ AppImage.styles.ts
│  │     │  └─ AppImage.tsx
│  │     ├─ AppInput
│  │     │  ├─ AppInput.styles.ts
│  │     │  └─ AppInput.tsx
│  │     ├─ AppLoader
│  │     │  ├─ AppLoader.styles.ts
│  │     │  └─ AppLoader.tsx
│  │     ├─ AppOtpInput
│  │     │  ├─ AppOtpInput.styles.ts
│  │     │  └─ AppOtpInput.tsx
│  │     ├─ AppPasswordInput
│  │     │  ├─ AppPasswordInput.styles.ts
│  │     │  └─ AppPasswordInput.tsx
│  │     ├─ AppRadio
│  │     ├─ AppRating
│  │     │  ├─ AppRating.styles.ts
│  │     │  └─ AppRating.tsx
│  │     ├─ AppScreen
│  │     │  ├─ AppScreen.styles.ts
│  │     │  └─ AppScreen.tsx
│  │     ├─ AppSearchInput
│  │     │  ├─ AppSearchInput.styles.ts
│  │     │  └─ AppSearchInput.tsx
│  │     ├─ AppSectionTitle
│  │     │  ├─ AppSectionTitle.styles.ts
│  │     │  └─ AppSectionTitle.tsx
│  │     ├─ AppSegmentedControl
│  │     │  ├─ AppSegmentedControl.styles.ts
│  │     │  └─ AppSegmentedControl.tsx
│  │     ├─ AppSelect
│  │     ├─ AppStatCard
│  │     ├─ AppTabsPills
│  │     │  ├─ AppTabsPills.styles.ts
│  │     │  └─ AppTabsPills.tsx
│  │     ├─ AppText
│  │     │  ├─ AppText.styles.ts
│  │     │  └─ AppText.tsx
│  │     ├─ AppTimeSlot
│  │     ├─ GradientHeader
│  │     │  ├─ GradientHeader.styles.ts
│  │     │  └─ GradientHeader.tsx
│  │     └─ index.ts
│  ├─ constants
│  │  ├─ categories.ts
│  │  ├─ colors.ts
│  │  ├─ gradients.ts
│  │  ├─ index.ts
│  │  ├─ layout.ts
│  │  ├─ radius.ts
│  │  ├─ shadows.ts
│  │  ├─ spacing.ts
│  │  ├─ tabs.ts
│  │  └─ typography.ts
│  ├─ features
│  │  ├─ add-business
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  ├─ types
│  │  │  └─ validation
│  │  ├─ auth
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  ├─ types
│  │  │  └─ validation
│  │  ├─ bookings
│  │  ├─ business-dashboard
│  │  ├─ businesses
│  │  │  ├─ hooks
│  │  │  │  ├─ useAnalytics.ts
│  │  │  │  ├─ useBusiness.ts
│  │  │  │  ├─ useEditBusiness.ts
│  │  │  │  ├─ usePromotions.ts
│  │  │  │  └─ useServices.ts
│  │  │  ├─ index.ts
│  │  │  ├─ mappers
│  │  │  │  └─ business.mapper.ts
│  │  │  ├─ services
│  │  │  │  ├─ analytics.service.ts
│  │  │  │  ├─ business.service.ts
│  │  │  │  ├─ promotions.service.ts
│  │  │  │  └─ services.service.ts
│  │  │  └─ types
│  │  │     ├─ analytics.types.ts
│  │  │     ├─ business.types.ts
│  │  │     ├─ promotion.types.ts
│  │  │     └─ service.types.ts
│  │  ├─ discovery
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  └─ types
│  │  ├─ filters
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  └─ types
│  │  ├─ following
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  └─ types
│  │  ├─ notifications
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  └─ types
│  │  ├─ onboarding
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  └─ types
│  │  ├─ profile
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  └─ types
│  │  ├─ promotions
│  │  ├─ reviews
│  │  │  ├─ hooks
│  │  │  ├─ index.ts
│  │  │  ├─ services
│  │  │  └─ types
│  │  ├─ services
│  │  └─ specialists
│  ├─ hooks
│  │  ├─ index.ts
│  │  ├─ useAppTheme.ts
│  │  ├─ useBottomSheet.ts
│  │  ├─ useDebounce.ts
│  │  └─ useKeyboardOffset.ts
│  ├─ lib
│  │  ├─ env.ts
│  │  ├─ icons.ts
│  │  └─ queryClient.ts
│  ├─ mocks
│  │  ├─ business-details.mock.ts
│  │  ├─ businesses.mock.ts
│  │  ├─ categories.mock.ts
│  │  ├─ notifications.mock.ts
│  │  ├─ onboarding.mock.ts
│  │  ├─ profile.mock.ts
│  │  └─ reviews.mock.ts
│  ├─ services
│  │  ├─ analytics
│  │  │  └─ events.ts
│  │  ├─ api
│  │  │  ├─ client.ts
│  │  │  ├─ config.ts
│  │  │  ├─ endpoints.ts
│  │  │  └─ types.ts
│  │  ├─ auth
│  │  │  ├─ session.ts
│  │  │  └─ tokens.ts
│  │  └─ storage
│  │     ├─ keys.ts
│  │     ├─ onboarding.ts
│  │     └─ secureStore.ts
│  ├─ store
│  │  ├─ app.store.ts
│  │  ├─ auth.store.ts
│  │  ├─ discovery.store.ts
│  │  ├─ filter.store.ts
│  │  ├─ index.ts
│  │  └─ profile.store.ts
│  ├─ theme
│  │  ├─ index.ts
│  │  ├─ navigationTheme.ts
│  │  └─ theme.ts
│  ├─ types
│  │  ├─ auth.ts
│  │  ├─ business.ts
│  │  ├─ category.ts
│  │  ├─ index.ts
│  │  ├─ navigation.ts
│  │  ├─ notification.ts
│  │  ├─ profile.ts
│  │  └─ review.ts
│  └─ utils
│     ├─ formatDate.ts
│     ├─ formatLocation.ts
│     ├─ formatRating.ts
│     ├─ helpers.ts
│     ├─ index.ts
│     └─ validators.ts
└─ tsconfig.json

```