// Curated list of open-access sources for content roulette
// All URLs point to specific articles (leaf nodes) for clean text-focused content
const curatedSources = [
    {
        name: "Wikipedia",
        urls: [
            "https://en.wikipedia.org/wiki/Poetry",
            "https://en.wikipedia.org/wiki/Erasure_poetry",
            "https://en.wikipedia.org/wiki/Blackout_poetry",
            "https://en.wikipedia.org/wiki/Mary_Ruefle",
            "https://en.wikipedia.org/wiki/Found_poetry",
            "https://en.wikipedia.org/wiki/Collage",
            "https://en.wikipedia.org/wiki/Dadaism",
            "https://en.wikipedia.org/wiki/Surrealism",
            "https://en.wikipedia.org/wiki/William_S._Burroughs",
            "https://en.wikipedia.org/wiki/Cut-up_technique",
            "https://en.wikipedia.org/wiki/New_York_City",
            "https://en.wikipedia.org/wiki/Ocean",
            "https://en.wikipedia.org/wiki/Democracy",
            "https://en.wikipedia.org/wiki/Memory",
            "https://en.wikipedia.org/wiki/Time",
            "https://en.wikipedia.org/wiki/Language"
        ]
    },
    {
        name: "BBC News",
        urls: [
            "https://www.bbc.co.uk/news/articles/crrn054nxe7o"
        ]
    },
    {
        name: "The Conversation",
        urls: [
            "https://theconversation.com/how-the-language-we-speak-affects-the-way-we-think-156212",
            "https://theconversation.com/what-is-art-for-147458",
            "https://theconversation.com/why-we-remember-some-things-and-forget-others-152904",
            "https://theconversation.com/the-power-of-poetry-in-a-pandemic-143287"
        ]
    },
    {
        name: "Aeon",
        urls: [
            "https://aeon.co/essays/how-does-language-change-the-way-we-think",
            "https://aeon.co/essays/why-we-need-to-take-poetry-more-seriously",
            "https://aeon.co/essays/what-the-history-of-the-book-can-tell-us-about-books-today",
            "https://aeon.co/essays/memory-is-like-a-film-edited-by-our-unconscious-minds"
        ]
    },
    {
        name: "Project Gutenberg",
        urls: [
            "https://www.gutenberg.org/files/1342/1342-h/1342-h.htm",  // Pride and Prejudice
            "https://www.gutenberg.org/files/84/84-h/84-h.htm",        // Frankenstein
            "https://www.gutenberg.org/files/2701/2701-h/2701-h.htm",  // Moby Dick
            "https://www.gutenberg.org/files/11/11-h/11-h.htm"         // Alice in Wonderland
        ]
    },
    {
        name: "Public Domain Review",
        urls: [
            "https://publicdomainreview.org/essay/the-art-of-music-copying",
            "https://publicdomainreview.org/essay/a-divine-madness",
            "https://publicdomainreview.org/essay/on-scissors-as-weapons"
        ]
    }
];

// Sample texts for fallback/offline use
const sampleTexts = [
    {
        title: "Wikipedia - Artificial Intelligence",
        content: `Artificial intelligence is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of intelligent agents, any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Colloquially, the term artificial intelligence is often used to describe machines that mimic cognitive functions that humans associate with the human mind, such as learning and problem solving. As machines become increasingly capable, tasks considered to require intelligence are often removed from the definition of AI, a phenomenon known as the AI effect. A quip in Tesler's Theorem says AI is whatever hasn't been done yet. For instance, optical character recognition is frequently excluded from things considered to be AI, having become a routine technology.`
    },
    {
        title: "News Article - Climate Change",
        content: `Scientists warn that climate change is accelerating at an unprecedented rate. The latest research indicates that global temperatures have risen by approximately 1.1 degrees Celsius since the pre-industrial era. This warming trend is primarily driven by human activities, particularly the burning of fossil fuels and deforestation. Experts emphasize the urgent need for collective action to reduce greenhouse gas emissions and transition to renewable energy sources. Without immediate intervention, the consequences could be catastrophic, affecting ecosystems, weather patterns, and human societies worldwide. Many nations have pledged to achieve net-zero emissions by mid-century, but implementation remains a significant challenge.`
    },
    {
        title: "Literary Excerpt",
        content: `The old house stood at the end of the winding road, its windows dark and empty like forgotten memories. Nobody had lived there for years, yet the garden continued to bloom each spring, as if waiting for someone to return. Neighbors whispered stories about the place, each tale more elaborate than the last. Some said they heard music on quiet evenings, others claimed to see lights flickering in the attic. But the truth, as it often is, was far simpler and more beautiful than any fiction they could imagine. The house was simply resting, holding its breath, preserving moments that once filled its rooms with laughter and life.`
    },
    {
        title: "Philosophy - Existence",
        content: `To exist is to be perceived, or so some philosophers claim. But what of the tree that falls in the forest with no one around to hear it? Does it make a sound? These questions have puzzled thinkers for centuries. The nature of reality, consciousness, and existence remains one of the most profound mysteries of human inquiry. We perceive the world through our senses, yet we know these senses can deceive us. Dreams feel real while we experience them. Memories reshape themselves over time. What we call reality might be nothing more than a collective agreement, a shared hallucination we've all decided to believe in.`
    },
    {
        title: "Technology News",
        content: `The latest smartphone release promises revolutionary features that will change how we interact with technology. Industry analysts predict strong sales despite the premium price point. The device features advanced artificial intelligence capabilities, enhanced privacy settings, and a battery that allegedly lasts three days on a single charge. Critics argue that planned obsolescence remains a concern, with manufacturers designing products to become outdated within a few years. Meanwhile, environmental advocates call for more sustainable practices in electronics manufacturing, pointing to the massive amounts of electronic waste generated annually. The debate continues about whether innovation truly serves human needs or primarily drives corporate profits.`
    }
];

let currentTextIndex = 0;
let redactedWords = new Set();

// Article cache for faster loading
const CACHE_PREFIX = 'magpie_article_';
const CACHE_EXPIRY_DAYS = 7;

// Cache helper functions
function getCachedArticle(url) {
    try {
        const cacheKey = CACHE_PREFIX + btoa(url).substring(0, 50);
        const cached = localStorage.getItem(cacheKey);
        if (!cached) return null;

        const data = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is expired
        if (now - data.timestamp > CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000) {
            localStorage.removeItem(cacheKey);
            return null;
        }

        console.log('✅ Using cached article:', url.substring(0, 50) + '...');
        return data;
    } catch (e) {
        console.warn('Cache read error:', e);
        return null;
    }
}

function cacheArticle(url, html, styles) {
    try {
        const cacheKey = CACHE_PREFIX + btoa(url).substring(0, 50);
        const data = {
            html,
            styles,
            timestamp: Date.now(),
            url
        };
        localStorage.setItem(cacheKey, JSON.stringify(data));
        console.log('💾 Cached article:', url.substring(0, 50) + '...');
    } catch (e) {
        // Handle quota exceeded or other errors
        console.warn('Cache write error:', e);
        // Try to clear old cache entries
        try {
            const keys = Object.keys(localStorage);
            keys.filter(k => k.startsWith(CACHE_PREFIX))
                .slice(0, 5)
                .forEach(k => localStorage.removeItem(k));
        } catch (clearError) {
            console.warn('Cache clear error:', clearError);
        }
    }
}

// Initialize the app
function init() {
    setupEventListeners();
    // Load first random source on startup
    spinForContent();
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById('spinBtn').addEventListener('click', spinForContent);
    document.getElementById('screenshotBtn').addEventListener('click', takeScreenshot);
}

// Load a text and parse it into clickable words
function loadText(index) {
    const textContainer = document.getElementById('textContainer');
    const text = sampleTexts[index];

    // Clear previous content and redacted words
    textContainer.innerHTML = '';
    redactedWords.clear();

    // Split text into sentences for better formatting
    const sentences = text.content.match(/[^.!?]+[.!?]+/g) || [text.content];

    sentences.forEach(sentence => {
        const paragraph = document.createElement('div');
        paragraph.className = 'paragraph';

        // Parse sentence into words and punctuation
        const tokens = sentence.match(/[\w']+|[.,!?;]/g) || [];

        tokens.forEach((token, idx) => {
            if (/[\w']+/.test(token)) {
                // It's a word
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.textContent = token;
                wordSpan.dataset.index = `${index}-${idx}`;

                // Add click handler
                wordSpan.addEventListener('click', toggleRedaction);

                paragraph.appendChild(wordSpan);
            } else {
                // It's punctuation
                const punctSpan = document.createElement('span');
                punctSpan.textContent = token;
                paragraph.appendChild(punctSpan);
            }

            // Add space after most tokens (except before certain punctuation)
            if (idx < tokens.length - 1 && !/[.,!?;]/.test(tokens[idx + 1])) {
                paragraph.appendChild(document.createTextNode(' '));
            }
        });

        textContainer.appendChild(paragraph);
    });
}

// Toggle redaction on a word
function toggleRedaction(event) {
    const word = event.target;
    const wordId = word.dataset.index;

    if (redactedWords.has(wordId)) {
        // Un-redact
        word.classList.remove('redacted');
        redactedWords.delete(wordId);
    } else {
        // Redact
        word.classList.add('redacted');
        redactedWords.add(wordId);
    }
}

// Spin the content roulette - randomly select from curated sources
async function spinForContent() {
    const textContainer = document.getElementById('textContainer');
    const disruptBtn = document.getElementById('spinBtn');

    console.log('=== DISRUPT BUTTON CLICKED ===');

    try {
        // Add disruption animation to button
        disruptBtn.classList.add('disrupting');
        setTimeout(() => disruptBtn.classList.remove('disrupting'), 600);

        // If there's existing content, animate it dissolving (Thanos snap style)
        const existingContent = textContainer.querySelector('.web-page-content, .paragraph');
        if (existingContent) {
            existingContent.parentElement.classList.add('disrupting-content');
            await new Promise(resolve => setTimeout(resolve, 800));
        }

        // Randomly select a source
        const randomSource = curatedSources[Math.floor(Math.random() * curatedSources.length)];

        // Randomly select a URL from that source
        const randomUrl = randomSource.urls[Math.floor(Math.random() * randomSource.urls.length)];

        // Show source info
        const sourceInfo = document.getElementById('sourceInfo');
        const sourceName = document.getElementById('sourceName');
        sourceName.textContent = randomSource.name;
        sourceInfo.style.display = 'block';

        console.log(`✨ Disrupting to: ${randomSource.name} - ${randomUrl}`);

        // TEMPORARY: Just use sample texts for now (web fetching disabled for debugging)
        textContainer.innerHTML = '<div class="loading">✨ Disrupting the mischief...</div>';
        redactedWords.clear();

        console.log('⚠️ Web fetching temporarily disabled - using sample texts');

        // Small delay for animation
        await new Promise(resolve => setTimeout(resolve, 800));

        // Use sample text
        sourceInfo.style.display = 'none';
        loadRandomText();
    } catch (outerError) {
        console.error('❌ Critical error in spinForContent:', outerError);
        textContainer.innerHTML = '<div class="loading">Critical error occurred.<br>Please refresh the page.</div>';
    }
}

// Load a random sample text (fallback)
function loadRandomText() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * sampleTexts.length);
    } while (newIndex === currentTextIndex && sampleTexts.length > 1);

    currentTextIndex = newIndex;
    loadText(currentTextIndex);
}

// Load a web page from a specific URL
async function loadWebPageFromUrl(url) {
    const textContainer = document.getElementById('textContainer');

    try {
        console.log('Fetching URL:', url);

        // Check cache first
        const cached = getCachedArticle(url);
        if (cached) {
            console.log('⚡ Loading from cache (instant)');
            await processWebPage(cached.html, url, cached.styles);
            return;
        }

        // Try multiple CORS proxies in PARALLEL (race them)
        const proxies = [
            {
                url: `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
                isJson: true
            },
            {
                url: `https://corsproxy.io/?${encodeURIComponent(url)}`,
                isJson: false
            }
        ];

        console.log(`🏁 Racing ${proxies.length} proxies for fastest response...`);

        // Create promise for each proxy
        const proxyPromises = proxies.map((proxy, index) => {
            return new Promise(async (resolve, reject) => {
                try {
                    console.log(`Proxy ${index + 1} starting:`, proxy.url.substring(0, 60) + '...');

                    // 8 second timeout per proxy
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);

                    const response = await fetch(proxy.url, {
                        signal: controller.signal,
                        mode: 'cors'
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }

                    const data = await response.text();

                    // Parse based on proxy type
                    let html;
                    if (proxy.isJson) {
                        try {
                            const json = JSON.parse(data);
                            html = json.contents;
                        } catch (parseErr) {
                            throw new Error('JSON parse failed');
                        }
                    } else {
                        html = data;
                    }

                    if (html && html.length > 100) {
                        console.log(`✅ Proxy ${index + 1} succeeded! (${html.length} chars)`);
                        resolve(html);
                    } else {
                        throw new Error('Response too short');
                    }
                } catch (err) {
                    console.warn(`❌ Proxy ${index + 1} failed:`, err.message);
                    reject(err);
                }
            });
        });

        // Race all proxies - use whichever responds first
        const html = await Promise.any(proxyPromises).catch(err => {
            console.error('All proxies failed:', err);
            throw new Error('All proxies failed to load content');
        });

        console.log('🎉 Got HTML from fastest proxy!');

        // Parse HTML and inject into container (will cache internally)
        await processWebPage(html, url);

    } catch (error) {
        console.error('Error in loadWebPageFromUrl:', error);
        throw error;  // Re-throw to allow caller to handle
    }
}

// Process fetched HTML and make it redactable - FAST VERSION (no CSS)
async function processWebPage(html, baseUrl, preloadedStyles = null) {
    const textContainer = document.getElementById('textContainer');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    console.log('⚡ Processing web page (fast mode - text only)...');

    // Remove scripts, iframes, and navigation elements
    doc.querySelectorAll('script, iframe, noscript, nav, header, footer, .nav, .header, .footer, .menu, aside, .sidebar').forEach(el => el.remove());

    // Try to find main content area
    let contentElement = doc.querySelector('article, main, [role="main"], .article-body, .story-body, .content');
    if (!contentElement) {
        contentElement = doc.body;
    }

    console.log('Content element found:', contentElement.tagName);

    // Extract just the text content - FAST!
    const textContent = contentElement.textContent || contentElement.innerText || '';

    // Split into paragraphs
    const paragraphs = textContent
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 50); // Skip very short paragraphs (likely navigation/metadata)

    console.log(`Extracted ${paragraphs.length} paragraphs`);

    // Clear container
    textContainer.innerHTML = '';

    // Create clean, simple presentation
    const wrapper = document.createElement('div');
    wrapper.className = 'web-page-content simple-text';

    // Add paragraphs
    paragraphs.slice(0, 20).forEach(paragraphText => { // Limit to first 20 paragraphs for speed
        const p = document.createElement('p');
        p.className = 'text-paragraph';
        p.textContent = paragraphText;
        wrapper.appendChild(p);
    });

    // Add to container
    textContainer.appendChild(wrapper);

    console.log('Making text redactable...');
    const startTime = performance.now();

    // Make text clickable immediately (no waiting for layout)
    setTimeout(() => {
        makeTextRedactable(wrapper);
        const endTime = performance.now();
        console.log(`✅ Text made redactable in ${Math.round(endTime - startTime)}ms`);
        console.log('✅ Web page processed and rendered');

        // Cache the simplified version
        cacheArticle(baseUrl, html, ''); // Cache with empty styles
    }, 0);
}

// Limit content to fit within the viewport for single-screen exports
function limitToViewport(wrapper, container) {
    try {
        // Get available height (viewport - header - footer)
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        const headerHeight = header ? header.offsetHeight : 0;
        const footerHeight = footer ? footer.offsetHeight : 0;
        const availableHeight = window.innerHeight - headerHeight - footerHeight - 40; // 40px padding

        console.log('=== VIEWPORT LIMITING ===');
        console.log('Available height for content:', availableHeight);
        console.log('Wrapper children count:', wrapper.children.length);

        // Get the actual content container (first child of wrapper)
        const contentContainer = wrapper.firstElementChild;
        if (!contentContainer) {
            console.warn('No content container found in wrapper');
            return;
        }

        console.log('Content container tag:', contentContainer.tagName);
        console.log('Content container height:', contentContainer.offsetHeight);

        // Get all child elements from the content container
        const children = Array.from(contentContainer.children);
        console.log('Children count:', children.length);

        if (children.length === 0) {
            console.warn('No children found to limit - content may be in text nodes');
            return;
        }

        // Log first few children heights for debugging
        for (let i = 0; i < Math.min(5, children.length); i++) {
            console.log(`Child ${i} (${children[i].tagName}): height = ${children[i].offsetHeight}px`);
        }

        let currentHeight = 0;
        let cutoffIndex = children.length;
        let hasNonZeroHeight = false;

        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            const childHeight = child.offsetHeight;

            // Track if we've seen any elements with actual height
            if (childHeight > 0) {
                hasNonZeroHeight = true;
            }

            // Only count elements with actual height
            if (childHeight > 0 && currentHeight + childHeight > availableHeight) {
                cutoffIndex = i;
                console.log(`✂️ Content limited at element ${i} (accumulated height: ${currentHeight}px, available: ${availableHeight}px)`);
                break;
            }

            currentHeight += childHeight;
        }

        console.log(`Total accumulated height: ${currentHeight}px`);
        console.log(`Has non-zero height elements: ${hasNonZeroHeight}`);
        console.log(`Cutoff index: ${cutoffIndex} of ${children.length}`);

        // If no elements have height yet, don't cut anything off
        if (!hasNonZeroHeight) {
            console.warn('⚠️ No elements with height found, skipping viewport limiting');
            return;
        }

        // Remove elements beyond viewport
        if (cutoffIndex < children.length) {
            const removedCount = children.length - cutoffIndex;
            console.log(`Removing ${removedCount} elements beyond viewport`);

            for (let i = cutoffIndex; i < children.length; i++) {
                children[i].remove();
            }

            // Add subtle fade indicator at bottom
            const fadeIndicator = document.createElement('div');
            fadeIndicator.className = 'content-fade';
            fadeIndicator.style.cssText = 'height: 20px; background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1)); margin-top: -20px; position: relative; z-index: 10;';
            contentContainer.appendChild(fadeIndicator);
            console.log('✅ Viewport limiting complete');
        } else {
            console.log('✅ All content fits in viewport, no limiting needed');
        }
    } catch (error) {
        console.error('❌ Error in limitToViewport:', error);
        console.error(error.stack);
    }
}

// Convert relative URLs to absolute
function convertRelativeUrls(doc, baseUrl) {
    const base = new URL(baseUrl);

    // Convert image sources
    doc.querySelectorAll('img[src]').forEach(img => {
        try {
            img.src = new URL(img.getAttribute('src'), base).href;
        } catch (e) {}
    });

    // Convert link hrefs
    doc.querySelectorAll('link[href]').forEach(link => {
        try {
            link.href = new URL(link.getAttribute('href'), base).href;
        } catch (e) {}
    });

    // Convert CSS background images
    doc.querySelectorAll('[style*="url"]').forEach(el => {
        try {
            const style = el.getAttribute('style');
            const updated = style.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (match, url) => {
                try {
                    return `url('${new URL(url, base).href}')`;
                } catch (e) {
                    return match;
                }
            });
            el.setAttribute('style', updated);
        } catch (e) {}
    });
}

// Extract and consolidate styles from the page
async function extractStyles(doc, baseUrl) {
    let styles = '';

    // Extract inline styles (fast)
    doc.querySelectorAll('style').forEach(styleTag => {
        styles += styleTag.textContent + '\n';
    });

    // Limit external stylesheet fetching for speed
    const styleLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    const MAX_STYLESHEETS = 3; // Only fetch first 3 for speed
    const STYLESHEET_TIMEOUT = 2000; // 2 second timeout per stylesheet

    console.log(`Found ${styleLinks.length} external stylesheets, fetching max ${MAX_STYLESHEETS}`);

    const base = new URL(baseUrl);
    const fetchPromises = [];

    // Fetch stylesheets in parallel (much faster)
    for (let i = 0; i < Math.min(styleLinks.length, MAX_STYLESHEETS); i++) {
        const link = styleLinks[i];
        const href = link.getAttribute('href');
        if (!href) continue;

        const cssUrl = new URL(href, base).href;

        const fetchPromise = (async () => {
            try {
                console.log(`Fetching CSS ${i + 1}:`, cssUrl.substring(0, 60) + '...');

                // Try to fetch the CSS file through proxy with timeout
                const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cssUrl)}`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), STYLESHEET_TIMEOUT);

                const response = await fetch(proxyUrl, { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const css = await response.text();
                    // Fix relative URLs in CSS (for images, fonts, etc.)
                    const fixedCss = css.replace(/url\(['"]?([^'")\s]+)['"]?\)/g, (match, url) => {
                        if (url.startsWith('data:') || url.startsWith('http')) {
                            return match;
                        }
                        try {
                            const absoluteUrl = new URL(url, cssUrl).href;
                            return `url('${absoluteUrl}')`;
                        } catch (e) {
                            return match;
                        }
                    });
                    console.log(`✅ Loaded CSS ${i + 1} (${css.length} chars)`);
                    return fixedCss;
                }
            } catch (err) {
                console.warn(`⚠️ Failed to fetch stylesheet ${i + 1}:`, err.message);
            }
            return '';
        })();

        fetchPromises.push(fetchPromise);
    }

    // Wait for all stylesheets to load (in parallel)
    const fetchedStyles = await Promise.all(fetchPromises);
    styles += fetchedStyles.join('\n');

    console.log(`📦 Total CSS loaded: ${styles.length} characters`);
    return styles;
}

// Make all text in an element redactable - optimized version
function makeTextRedactable(element) {
    // Limit to first 200 text nodes for performance
    const MAX_TEXT_NODES = 200;
    let processedNodes = 0;

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip whitespace-only nodes
                if (!node.textContent.trim()) {
                    return NodeFilter.FILTER_REJECT;
                }
                // Limit total nodes processed
                if (processedNodes >= MAX_TEXT_NODES) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    const textNodes = [];
    while (walker.nextNode() && textNodes.length < MAX_TEXT_NODES) {
        textNodes.push(walker.currentNode);
        processedNodes++;
    }

    console.log(`Processing ${textNodes.length} text nodes...`);

    // Process in batches to avoid blocking UI
    let batchIndex = 0;
    const BATCH_SIZE = 20;

    function processBatch() {
        const endIndex = Math.min(batchIndex + BATCH_SIZE, textNodes.length);

        for (let i = batchIndex; i < endIndex; i++) {
            const textNode = textNodes[i];
            const text = textNode.textContent;

            // Simple word splitting - faster than complex regex
            const words = text.split(/\s+/);
            const fragment = document.createDocumentFragment();

            words.forEach((word, wordIndex) => {
                if (word.trim()) {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = word;
                    span.dataset.index = `web-${i}-${wordIndex}`;
                    span.addEventListener('click', toggleRedaction);
                    fragment.appendChild(span);

                    // Add space after word (except last)
                    if (wordIndex < words.length - 1) {
                        fragment.appendChild(document.createTextNode(' '));
                    }
                }
            });

            if (textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
            }
        }

        batchIndex = endIndex;

        if (batchIndex < textNodes.length) {
            // Process next batch
            setTimeout(processBatch, 0);
        } else {
            console.log('✅ All text nodes processed');
        }
    }

    processBatch();
}

// Take a screenshot of the redacted text
async function takeScreenshot() {
    const container = document.querySelector('.app-container');

    // Add screenshot mode class to hide UI elements
    container.classList.add('screenshot-mode');

    try {
        // Use html2canvas to capture the content
        const canvas = await html2canvas(container, {
            backgroundColor: '#ffffff',
            scale: 2, // Higher quality
            logging: false,
            useCORS: true
        });

        // Convert canvas to blob
        canvas.toBlob(async (blob) => {
            // Check if Web Share API is available (mobile devices)
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], 'magpie-creation.png', { type: 'image/png' })] })) {
                try {
                    const file = new File([blob], 'magpie-creation.png', { type: 'image/png' });
                    await navigator.share({
                        files: [file],
                        title: 'My Magpie Creation',
                        text: 'Check out what I created with Magpie'
                    });
                } catch (err) {
                    if (err.name !== 'AbortError') {
                        // If share fails, fall back to download
                        downloadImage(blob);
                    }
                }
            } else {
                // Fall back to download for desktop
                downloadImage(blob);
            }

            // Remove screenshot mode
            container.classList.remove('screenshot-mode');
        }, 'image/png');

    } catch (error) {
        console.error('Screenshot failed:', error);
        alert('Failed to create screenshot. Please try again.');
        container.classList.remove('screenshot-mode');
    }
}

// Download image (fallback for desktop)
function downloadImage(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `magpie-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
