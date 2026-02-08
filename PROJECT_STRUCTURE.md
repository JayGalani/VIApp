# LiveApp - Project Structure & Component Documentation

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, fonts, etc.)
├── common/          # Common constants and configurations
│   ├── colors.js    # Color palette
│   ├── fonts.js     # Font styles and sizes
│   ├── images.js    # Image references
│   └── strings.js   # Localized strings
├── components/      # Reusable UI components
│   ├── CustomButton.js
│   ├── CustomHeader.js
│   ├── CustomInput.js
│   ├── EmptyState.js
│   ├── Loader.js
│   ├── MediaItem.js
│   ├── MediaListComponent.js
│   ├── MediaPreview.js
│   ├── TabItem.js
│   └── index.js     # Component exports
├── hooks/           # Custom React hooks
│   ├── useMediaPicker.js
│   └── index.js
├── navigation/      # Navigation configuration
│   ├── AppNavigator.js
│   ├── DashboardNavigator.js
│   └── ListNavigator.js
├── redux/           # State management
│   ├── actions/
│   ├── reducers/
│   ├── slices/
│   └── store.js
├── screens/         # Screen components
│   ├── AddPhoto/
│   ├── AddVideo/
│   ├── Dashboard/
│   ├── List/
│   ├── Login/
│   ├── Splash/
│   └── UploadScreen/
└── utils/           # Utility functions
    ├── mediaHelpers.js
    ├── permissions.js
    ├── storage.js
    ├── validators.js
    └── index.js
```

## 🧩 Reusable Components

### CustomButton
**Purpose**: Consistent button styling across the app
**Props**:
- `title` (string): Button text
- `onPress` (function): Click handler
- `isLoading` (boolean): Show loading state
- `disabled` (boolean): Disable button
- `secondary` (boolean): Use secondary style
- `style` (object): Additional styles

**Usage**:
```javascript
<CustomButton 
  title="Upload"
  onPress={handleUpload}
  isLoading={uploading}
/>
```

### CustomInput
**Purpose**: Consistent text input with validation
**Props**:
- `value` (string): Input value
- `onChangeText` (function): Change handler
- `placeholder` (string): Placeholder text
- `error` (string): Error message
- `multiline` (boolean): Multi-line input
- `secureTextEntry` (boolean): Password field
- `editable` (boolean): Enable/disable editing

**Usage**:
```javascript
<CustomInput 
  value={email}
  onChangeText={setEmail}
  placeholder="Enter email"
  error={emailError}
/>
```

### Loader
**Purpose**: Consistent loading indicator
**Props**:
- `visible` (boolean): Show/hide loader
- `text` (string): Loading message
- `overlay` (boolean): Full-screen overlay
- `size` (string): 'small' | 'large'
- `color` (string): Loader color

**Usage**:
```javascript
<Loader 
  visible={isLoading}
  text="Processing..."
  overlay
/>
```

### MediaPreview
**Purpose**: Display photo/video preview with processing state
**Props**:
- `type` (string): 'photo' | 'video'
- `uri` (string): Media URI
- `thumbnailUri` (string): Video thumbnail URI
- `fileName` (string): File name
- `fileSize` (number): File size in bytes
- `isProcessing` (boolean): Show processing state

### EmptyState
**Purpose**: Display empty state with icon and message
**Props**:
- `message` (string): Empty state message
- `IconComponent` (component): Icon to display

## 🎣 Custom Hooks

### useMediaPicker
**Purpose**: Handle media selection with validation and processing
**Returns**:
- `media` (object): Selected media object
- `isProcessing` (boolean): Processing state
- `selectFromCamera` (function): Launch camera
- `selectFromGallery` (function): Launch gallery
- `resetMedia` (function): Clear selection

**Usage**:
```javascript
const { 
  media, 
  isProcessing, 
  selectFromCamera, 
  selectFromGallery 
} = useMediaPicker('video');
```

## 🛠️ Utility Functions

### Validators (`utils/validators.js`)
- `validateEmail(email)`: Email validation
- `validatePassword(password)`: Password validation
- `validateDescription(description)`: Description validation
- `validateVideoFile(video)`: Video file validation
- `validatePhotoFile(photo)`: Photo file validation

### Media Helpers (`utils/mediaHelpers.js`)
- `cleanVideoUri(uri)`: Clean URI for processing
- `formatThumbnailPath(path)`: Format thumbnail path
- `formatFileSize(bytes)`: Format file size
- `formatMediaForUpload(media, type, description)`: Format media object
- `getThumbnailConfig()`: Get thumbnail configuration

### Permissions (`utils/permissions.js`)
- `requestCameraPermission()`: Request camera access
- `requestGalleryPermission()`: Request gallery access
- `requestMediaPermission(type)`: Request media permission

### Storage (`utils/storage.js`)
- `setToken(token)`: Save auth token
- `getToken()`: Retrieve auth token
- `removeToken()`: Remove auth token

## 🎨 Styling Guidelines

### Colors
All colors are defined in `common/colors.js`:
- Use `COLORS.PRIMARY` for primary actions
- Use `COLORS.SECONDARY` for secondary actions
- Use `COLORS.ERROR` for error states
- Use `COLORS.TEXT_PRIMARY` for main text
- Use `COLORS.TEXT_SECONDARY` for secondary text

### Fonts
Font styles are defined in `common/fonts.js`:
- Use `FONTS.REGULAR` for normal text
- Use `FONTS.MEDIUM` for medium weight
- Use `FONTS.BOLD` for bold text
- Use `SIZES.h1`, `SIZES.h2`, etc. for consistent sizing

### Component Styling
- All styles use `StyleSheet.create()` for performance
- No inline styles (moved to StyleSheet)
- Consistent spacing and sizing using `SIZES`

## 🔒 Best Practices

### State Management
- Use `useState` for local component state
- Use `useRef` for values that don't trigger re-renders
- Use `isMounted` ref to prevent state updates on unmounted components

### Error Handling
- Always use try-catch for async operations
- Show user-friendly error messages via Alert
- Validate inputs before processing

### Performance
- Use `React.memo` for expensive components
- Use `useCallback` for event handlers passed as props
- Lazy load heavy components when possible

### Code Organization
- One component per file
- Export components from index files
- Group related utilities together
- Use meaningful variable and function names

## 🚀 Adding New Features

### Adding a New Screen
1. Create folder in `src/screens/`
2. Create `index.js` with screen component
3. Add to navigation in `AppNavigator.js`
4. Add screen name to `STRINGS.SCREEN_NAMES`

### Adding a New Component
1. Create component file in `src/components/`
2. Use StyleSheet for all styles
3. Add PropTypes or TypeScript types
4. Export from `components/index.js`
5. Document props and usage

### Adding a New Utility
1. Create utility file in `src/utils/`
2. Export functions individually
3. Add to `utils/index.js`
4. Add JSDoc comments

## 📝 Code Quality

### Linting
- Follow ESLint rules
- Use Prettier for formatting
- Run `npm run lint` before committing

### Testing
- Write unit tests for utilities
- Test component rendering
- Test user interactions

### Documentation
- Add JSDoc comments for functions
- Document complex logic
- Keep README updated
