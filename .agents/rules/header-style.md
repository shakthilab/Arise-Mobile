# Header & Page Navigation Rules

## Back Button & Header Styling Rules
Whenever creating new screens, pages, or modals (in `app/` or `components/`):

1. **No Background on Back Arrow Buttons**:
   - Back buttons in page headers MUST NOT have any background color (`backgroundColor`), border radius (`borderRadius`), or borders (`borderWidth`, `borderColor`).
   - The back button touch container (`TouchableOpacity` / `Pressable`) should only handle touch padding and alignment:
     ```ts
     backBtn: {
       width: 38,
       height: 38,
       alignItems: 'center',
       justifyContent: 'center',
     }
     ```

2. **Standardized Back Icon**:
   - Always use `<Ionicons name="chevron-back" size={24} color="#FFFFFF" />` for back navigation icons across all screens and headers.

3. **Page Header Bar Structure**:
   - Page headers must maintain clean 3-part layout alignment (Left: `backBtn`, Center: `headerTitle`, Right: balance spacer or right action button).
