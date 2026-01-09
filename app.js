// Curated list of open-access sources for content roulette
const curatedSources = [
    {
        name: "Wikipedia",
        urls: [
            "https://en.wikipedia.org/wiki/Special:Random",
            "https://en.wikipedia.org/wiki/Poetry",
            "https://en.wikipedia.org/wiki/Erasure_poetry",
            "https://en.wikipedia.org/wiki/New_York_City",
            "https://en.wikipedia.org/wiki/Ocean",
            "https://en.wikipedia.org/wiki/Democracy"
        ]
    },
    {
        name: "The Conversation",
        urls: [
            "https://theconversation.com/uk",
        ]
    },
    {
        name: "Literary Hub",
        urls: [
            "https://lithub.com/"
        ]
    },
    {
        name: "Aeon",
        urls: [
            "https://aeon.co/essays"
        ]
    },
    {
        name: "Public Domain Review",
        urls: [
            "https://publicdomainreview.org/"
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
    // Randomly select a source
    const randomSource = curatedSources[Math.floor(Math.random() * curatedSources.length)];

    // Randomly select a URL from that source
    const randomUrl = randomSource.urls[Math.floor(Math.random() * randomSource.urls.length)];

    // Show source info
    const sourceInfo = document.getElementById('sourceInfo');
    const sourceName = document.getElementById('sourceName');
    sourceName.textContent = randomSource.name;
    sourceInfo.style.display = 'block';

    console.log(`🎲 Spinning to: ${randomSource.name} - ${randomUrl}`);

    // Try to load the web page
    const textContainer = document.getElementById('textContainer');
    textContainer.innerHTML = '<div class="loading">🎲 Disrupting the mischief...<br><small>Loading from ' + randomSource.name + '</small></div>';
    redactedWords.clear();

    try {
        await loadWebPageFromUrl(randomUrl);
        console.log('✅ Successfully loaded web content');
    } catch (error) {
        console.warn('⚠️ Failed to load curated source, falling back to sample text:', error);

        // Show user-friendly message
        textContainer.innerHTML = '<div class="loading">Could not load web page.<br>Using sample text instead...</div>';

        // Small delay so user sees the message
        await new Promise(resolve => setTimeout(resolve, 800));

        // Fallback to sample text if web page fails
        sourceInfo.style.display = 'none';
        loadRandomText();
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

        // Try multiple CORS proxies in order
        const proxies = [
            `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
            `https://corsproxy.io/?${encodeURIComponent(url)}`,
            `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`
        ];

        let html = null;
        let lastError = null;

        for (const proxyUrl of proxies) {
            try {
                console.log('Trying proxy:', proxyUrl);

                // Create fetch with timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(proxyUrl, {
                    signal: controller.signal,
                    mode: 'cors'
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.text();

                // allorigins.win returns JSON, others return raw HTML
                if (proxyUrl.includes('allorigins.win')) {
                    try {
                        const json = JSON.parse(data);
                        html = json.contents;
                    } catch (parseErr) {
                        console.warn('Failed to parse JSON from allorigins:', parseErr);
                        throw parseErr;
                    }
                } else {
                    html = data;
                }

                if (html && html.length > 100) {  // Ensure we got meaningful content
                    console.log('Successfully fetched HTML, length:', html.length);
                    break;
                }
            } catch (err) {
                console.warn('Proxy failed:', proxyUrl, err.name, err.message);
                lastError = err;
            }
        }

        if (!html) {
            console.error('All proxies failed. Last error:', lastError);
            throw lastError || new Error('All proxies failed');
        }

        // Parse HTML and inject into container
        await processWebPage(html, url);

    } catch (error) {
        console.error('Error in loadWebPageFromUrl:', error);
        throw error;  // Re-throw to allow caller to handle
    }
}

// Process fetched HTML and make it redactable
async function processWebPage(html, baseUrl) {
    const textContainer = document.getElementById('textContainer');
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    console.log('Processing web page...');

    // Remove scripts, iframes, and navigation elements
    doc.querySelectorAll('script, iframe, noscript, nav, header, footer, .nav, .header, .footer, .menu').forEach(el => el.remove());

    // Convert relative URLs to absolute
    convertRelativeUrls(doc, baseUrl);

    // Extract styles (now async)
    const styles = await extractStyles(doc, baseUrl);

    // Try to find main content area (article, main, or body)
    let contentElement = doc.querySelector('article, main, [role="main"], .article-body, .story-body, .content');
    if (!contentElement) {
        // Try to find the body content, excluding headers/footers
        contentElement = doc.body;
    }

    console.log('Content element found:', contentElement.tagName);

    // Clear container
    textContainer.innerHTML = '';

    // Inject styles directly for faithful rendering
    if (styles) {
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);  // Add to head for global scope
        console.log('Injected styles, length:', styles.length);
    }

    // Create wrapper with minimal interference
    const wrapper = document.createElement('div');
    wrapper.className = 'web-page-content';

    // Clone the content element to preserve all attributes and structure
    const clonedContent = contentElement.cloneNode(true);
    wrapper.appendChild(clonedContent);

    // Make all text clickable
    makeTextRedactable(wrapper);

    textContainer.appendChild(wrapper);
    console.log('✅ Web page processed and rendered');
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

    // Extract inline styles
    doc.querySelectorAll('style').forEach(styleTag => {
        styles += styleTag.textContent + '\n';
    });

    // Extract and fetch external stylesheets
    const styleLinks = doc.querySelectorAll('link[rel="stylesheet"]');
    const base = new URL(baseUrl);

    console.log(`Found ${styleLinks.length} external stylesheets`);

    for (const link of styleLinks) {
        try {
            const href = link.getAttribute('href');
            if (!href) continue;

            const cssUrl = new URL(href, base).href;
            console.log('Fetching CSS:', cssUrl);

            // Try to fetch the CSS file through proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(cssUrl)}`;

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

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
                styles += fixedCss + '\n';
                console.log('✅ Loaded CSS:', cssUrl.substring(0, 50) + '...');
            }
        } catch (err) {
            console.warn('Failed to fetch stylesheet:', err.message);
        }
    }

    return styles;
}

// Make all text in an element redactable
function makeTextRedactable(element) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );

    const textNodes = [];
    while (walker.nextNode()) {
        // Skip empty or whitespace-only text nodes
        if (walker.currentNode.textContent.trim()) {
            textNodes.push(walker.currentNode);
        }
    }

    textNodes.forEach((textNode, nodeIndex) => {
        const text = textNode.textContent;
        const words = text.split(/(\s+)/);  // Split but keep whitespace

        const fragment = document.createDocumentFragment();

        words.forEach((word, wordIndex) => {
            if (word.match(/\S/)) {  // Contains non-whitespace
                // Further split into words and punctuation
                const tokens = word.split(/\b/);

                tokens.forEach(token => {
                    if (token.match(/\w+/)) {  // It's a word
                        const span = document.createElement('span');
                        span.className = 'word';
                        span.textContent = token;
                        span.dataset.index = `web-${nodeIndex}-${wordIndex}-${token}`;
                        span.addEventListener('click', toggleRedaction);
                        fragment.appendChild(span);
                    } else if (token) {  // Punctuation or other
                        fragment.appendChild(document.createTextNode(token));
                    }
                });
            } else {
                // Whitespace
                fragment.appendChild(document.createTextNode(word));
            }
        });

        textNode.parentNode.replaceChild(fragment, textNode);
    });
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
