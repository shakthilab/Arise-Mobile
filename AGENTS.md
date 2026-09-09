# Project Rules for HunterX-Mobile

## UI & Header Navigation Rules

- **Header Back Buttons**:
  - NEVER add background colors, circular borders (`borderRadius`), or border outlines (`borderWidth`, `borderColor`) to back arrow buttons in page headers or modal headers.
  - Back buttons MUST be clean and background-less across all pages:
    ```ts
    backBtn: {
      width: 38,
      height: 38,
      alignItems: 'center',
      justifyContent: 'center',
    }
    ```
  - Use `<Ionicons name="chevron-back" size={24} color="#FFFFFF" />` consistently for back arrow navigation across all page headers.
