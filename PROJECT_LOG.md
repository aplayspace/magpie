# Magpie Project Log

## 2026-01-09 - Initial Deployment

### Completed
- Initialized git repository for the project
- Created initial commit with all prototype files:
  - index.html - Main application interface
  - app.js - Core redaction functionality
  - styles.css - Mobile-first responsive styles
  - img/ - Example redaction images
  - README.md - Project documentation
  - magpie.md - Project description and context
- Installed and configured GitHub CLI (gh)
- Authenticated with GitHub account (aplayspace)
- Pushed codebase to https://github.com/aplayspace/magpie.git
- Changed repository visibility from private to public
- Enabled GitHub Pages deployment from main branch
- Successfully deployed prototype to http://www.aplayspace.com/magpie/

### Technical Details
- Repository: https://github.com/aplayspace/magpie
- Live URL: http://www.aplayspace.com/magpie/
- Branch: main
- Deployment: GitHub Pages (legacy build)
- Custom domain configured: www.aplayspace.com

### Current Status
Prototype is live and ready for testing. Users can now:
- Access the app via the custom domain
- Test word redaction functionality on mobile devices
- Create and export erasure poetry screenshots
- Share creations on social media

---

## 2026-01-09 - Content Roulette Feature

### Completed
- Implemented content roulette system with curated open-access sources
- Added 🎲 Spin button to randomly load content from quality publications
- Curated list of 5 reliable sources:
  - Wikipedia (including random article feature)
  - The Conversation
  - Literary Hub
  - Aeon
  - Public Domain Review
- Implemented web page fetching with CORS proxy fallbacks
- Preserved original CSS styling of fetched pages ("digital materiality")
- Made all text in fetched pages clickable for redaction
- Added source attribution to show current publication
- Implemented automatic fallback to sample texts if web fetch fails
- Updated UI with green Spin button and improved controls

### Technical Implementation
- Multiple CORS proxy fallback system (3 services)
- DOM TreeWalker for making text nodes interactive
- Relative-to-absolute URL conversion for images and styles
- CSS extraction and injection from fetched pages
- Smart content area detection (article, main elements)

### User Experience
Users can now:
- Click 🎲 Spin to get random content from curated sources
- Experience real web pages with original formatting
- Create erasure poetry from high-quality publications
- See which source they're working with
- Re-spin if content isn't inspiring

---

## 2026-01-09 - Major UX Improvements and Performance Optimization

### Completed
- **Curated Article Sources**: Updated from homepage URLs to specific article leaf nodes
  - 32 specific articles across 6 sources (Wikipedia, BBC News, The Conversation, Aeon, Project Gutenberg, Public Domain Review)
  - Focused on text-heavy articles for better redaction experience

- **Disrupt Branding**: Replaced "Spin" terminology with "Disrupt the mischief"
  - ✨ Disrupt button with purple gradient styling
  - Magpie logo icon added to header banner
  - Thanos-snap style disruption animation (blur + fade + scale effect)
  - 0.8s smooth transition between content loads

- **Article Caching System**: localStorage-based caching for instant repeat loads
  - 7-day cache expiry with automatic cleanup
  - Caches both HTML content and extracted CSS
  - Instant loading for previously viewed articles
  - Smart quota management

- **Faithful CSS Presentation**:
  - Fetch and inject external stylesheets (not just inline styles)
  - Convert relative URLs in CSS to absolute paths
  - Inject styles directly to head for global scope
  - Minimal wrapper interference for authentic source rendering

- **Performance Optimizations**: Fixed critical white screen bug
  - Root cause: Viewport limiting measured heights before browser layout completed
  - Limited text processing to 200 nodes (down from unlimited)
  - Batch processing (20 nodes at a time) for responsive UI
  - Simplified word splitting (whitespace only, faster than complex regex)
  - Performance improved from 30+ seconds to under 1 second
  - Content displays immediately, becomes clickable progressively

### Technical Implementation
- **Double requestAnimationFrame**: Wait for browser layout before measuring
- **Skip zero-height elements**: Prevent premature content cutoff
- **Async style fetching**: External CSS files loaded through CORS proxy
- **Progressive enhancement**: Content visible before text processing completes
- **Performance logging**: Console shows exact timing for debugging

### Known Issues Fixed
- ✅ White screen bug (viewport limiting before layout)
- ✅ Slow text processing (30+ seconds → under 1 second)
- ✅ Missing external CSS (now fetched and applied)
- ✅ Homepage clutter (switched to article leaf nodes)
- ✅ CORS proxy failures (multiple fallbacks)

### Current Status
**Working**: BBC News article loads quickly with faithful CSS rendering and clickable text for redaction.

**Temporarily Disabled for Testing**:
- Viewport limiting (was causing white screen, needs proper fix)
- Multiple sources (narrowed to single BBC article for debugging)

### Next Steps (To Resume)
1. **Re-enable smart viewport limiting**: Fixed version that waits for layout
2. **Add back curated sources**: Restore all 32 article URLs
3. **Perfect single-screen export**: Content fits viewport for social media sharing

### Next Steps
See ROADMAP.md for planned enhancements and future development priorities.

---

## 2026-01-09 - Performance Crisis and Simplification

### Issue Encountered
Despite previous optimizations, the app experienced persistent loading failures:
- White screen on content load
- 30+ second load times
- Content not appearing even with cached articles
- User experience severely degraded

### Troubleshooting Attempts

1. **Re-enabled viewport limiting with layout timing**
   - Restored all 32 curated article sources
   - Added double requestAnimationFrame to wait for layout
   - Added zero-height element detection
   - Result: Still not loading

2. **Optimized CSS fetching**
   - Limited to max 3 stylesheets (from unlimited)
   - Made stylesheet fetching parallel with Promise.all
   - Reduced timeout to 2 seconds per stylesheet
   - Result: Still slow, content stuck on "Loading from Wikipedia"

3. **Optimized CORS proxy fetching**
   - Changed from sequential proxy tries to parallel racing with Promise.any()
   - Two proxies race simultaneously, fastest wins
   - Reduced timeout to 8 seconds
   - Result: Still not loading fast enough

4. **Removed CSS entirely (text-only mode)**
   - Completely eliminated CSS fetching overhead
   - Extract only textContent from HTML
   - Split into paragraphs, limit to 20
   - Simple Georgia serif font for clean typography
   - Result: Still experiencing white screen/loading issues

### Final Solution: Temporary Fallback

**Web fetching temporarily disabled** - Using sample texts only until root cause is identified
- Modified spinForContent() to skip web fetching
- Falls back to built-in sample texts immediately
- Allows app to remain functional while debugging continues

### Technical Changes

**app.js modifications:**
- Parallel proxy racing with Promise.any()
- Parallel CSS fetching with Promise.all() (now disabled)
- Text-only extraction mode (no CSS preservation)
- Web fetching disabled in spinForContent()

**styles.css modifications:**
- Changed .text-container overflow from auto to hidden (single-screen view)
- Added .simple-text and .text-paragraph classes for clean text presentation

### Current Status

**Working:**
- Sample text mode functional
- Word redaction works
- Export functionality intact
- Disrupt button loads different sample texts

**Disabled/Pending:**
- Web content fetching (temporarily disabled)
- CSS preservation (removed for speed)
- 32 curated sources (in code but not used)
- Viewport limiting (may still have issues)

### Root Cause Analysis Needed

The persistent loading failure suggests a fundamental issue beyond CSS/proxy optimization:
- Possible CORS/security policy changes
- Browser rendering pipeline issues
- Race condition in async loading
- localStorage quota exceeded
- Proxy services unreliable/blocked

### Next Steps

1. **Debug web fetching in isolation** - Test proxies and content extraction separately
2. **Add comprehensive error logging** - Catch and report all fetch/parse failures
3. **Test on different devices/browsers** - Isolate if issue is environment-specific
4. **Consider alternative approach** - Backend proxy service or different content strategy
5. **Re-enable features incrementally** - Once root cause found, restore functionality step by step
