// Sample texts for the MVP
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
    loadText(currentTextIndex);
    setupEventListeners();
}

// Set up event listeners
function setupEventListeners() {
    document.getElementById('newTextBtn').addEventListener('click', loadRandomText);
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

// Load a random text
function loadRandomText() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * sampleTexts.length);
    } while (newIndex === currentTextIndex && sampleTexts.length > 1);

    currentTextIndex = newIndex;
    loadText(currentTextIndex);
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
