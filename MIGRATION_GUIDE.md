# Component Library Migration Guide

This guide explains how to swap the current implementation with your organization's component library with minimal code changes.

## Architecture Overview

The app uses an **abstraction layer** pattern where all UI primitives are isolated in the `src/ui/` directory. This allows you to swap the underlying implementation without touching business logic.

## Abstraction Points

### 1. Buttons (`src/ui/Button.jsx`)

**Current Implementation:** Native HTML button
**Your Org's Library:** Example with Material-UI

```javascript
// BEFORE (Current)
export const Button = ({ variant, children, ...rest }) => {
  const variantClasses = {
    primary: 'btn-primary',
    icon: 'btn-icon',
  };
  
  return (
    <button className={`btn ${variantClasses[variant]}`} {...rest}>
      {children}
    </button>
  );
};

// AFTER (Material-UI example)
import { Button as MuiButton } from '@mui/material';

export const Button = ({ variant, children, ...rest }) => {
  const variantMap = {
    primary: 'contained',
    secondary: 'outlined',
    icon: 'text',
  };
  
  return (
    <MuiButton variant={variantMap[variant]} {...rest}>
      {children}
    </MuiButton>
  );
};
```

**Component usage stays identical:**
```javascript
<Button variant="primary" onClick={handleClick}>Send</Button>
```

### 2. Icons (`src/ui/Icons.jsx`)

**Current Implementation:** Custom SVG
**Your Org's Library:** Example with Heroicons

```javascript
// BEFORE (Current)
export const PlusIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    {/* SVG paths */}
  </svg>
);

// AFTER (Heroicons example)
import { PlusIcon as HeroPlusIcon } from '@heroicons/react/24/outline';

export const PlusIcon = (props) => <HeroPlusIcon {...props} />;
```

**Component usage stays identical:**
```javascript
<PlusIcon />
```

### 3. Future Abstractions to Add

As you build more features, add abstractions for:

#### Input Fields
```javascript
// src/ui/Input.jsx
export const Input = ({ variant, ...props }) => {
  // Map to your library
  return <YourOrgInput {...props} />;
};
```

#### Select/Dropdown
```javascript
// src/ui/Select.jsx
export const Select = ({ options, ...props }) => {
  // Map to your library
  return <YourOrgSelect {...props} />;
};
```

#### Modal/Dialog
```javascript
// src/ui/Modal.jsx
export const Modal = ({ isOpen, onClose, children }) => {
  // Map to your library
  return <YourOrgModal open={isOpen} onClose={onClose}>{children}</YourOrgModal>;
};
```

## Migration Checklist

### Step 1: Install Your Component Library
```bash
npm install @your-org/components
```

### Step 2: Update UI Abstractions

For each file in `src/ui/`:
1. Import your org's component
2. Map props between your API and theirs
3. Export using the same name

### Step 3: Update Styles

Choose one approach:

**Option A: Use Your Library's Theme**
```javascript
// src/App.jsx
import { ThemeProvider } from '@your-org/components';
import yourTheme from '@your-org/theme';

function App() {
  return (
    <ThemeProvider theme={yourTheme}>
      {/* ... */}
    </ThemeProvider>
  );
}
```

**Option B: Keep Custom CSS**
- Update CSS variables in `src/styles/App.css`
- Remove unused classes
- Keep layout and spacing styles

### Step 4: Test Each Component

Verify these components still work:
- [ ] Sidebar with new chat button
- [ ] Chat input with send button
- [ ] Message rendering
- [ ] Loading states
- [ ] File upload

### Step 5: Update Theme Variables

Match your design system:
```css
/* src/styles/App.css */
:root {
  --color-primary: #YOUR_PRIMARY;
  --font-body: 'Your Font', sans-serif;
  --spacing-md: 1rem; /* Your spacing scale */
}
```

## Common Patterns

### Conditional Props
```javascript
export const Button = ({ variant, loading, ...rest }) => {
  return (
    <YourOrgButton
      variant={variant === 'primary' ? 'solid' : 'outline'}
      isLoading={loading}
      {...rest}
    />
  );
};
```

### Event Handlers
```javascript
export const Input = ({ onChange, ...rest }) => {
  const handleChange = (e) => {
    // Your library might pass just the value
    onChange(e.target ? e.target.value : e);
  };
  
  return <YourOrgInput onChange={handleChange} {...rest} />;
};
```

### Styling Props
```javascript
export const Button = ({ className, ...rest }) => {
  return (
    <YourOrgButton
      className={className}
      // Or use your library's styling prop
      sx={{ /* styles */ }}
      {...rest}
    />
  );
};
```

## Example Libraries

### Material-UI (MUI)
```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Ant Design
```bash
npm install antd
```

### Chakra UI
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

### Your Org's Library
```bash
npm install @your-org/design-system
```

## Validation

After migration, ensure:

1. **Visual Consistency** - UI looks correct
2. **Functionality** - All interactions work
3. **Accessibility** - ARIA labels preserved
4. **Performance** - No degradation
5. **Type Safety** - Props are correctly typed (if using TypeScript)

## Need Help?

- Check your component library's documentation
- Review the abstraction layer in `src/ui/`
- Test incrementally (one component at a time)
- Keep the same prop API for business logic components

## Benefits of This Approach

✅ **Minimal Changes** - Only edit `src/ui/` files
✅ **Safe Migration** - Business logic untouched
✅ **Gradual Rollout** - Migrate component by component
✅ **Easy Rollback** - Simple to revert if needed
✅ **Future-Proof** - Easy to switch libraries again
