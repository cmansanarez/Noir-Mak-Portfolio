import dotenv from 'dotenv';
dotenv.config();

import * as utils from './utils/utils.js';
import * as db from './utils/database.js';

import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

const FEATURED_PROJECT_ID = parseInt(process.env.FEATURED_PROJECT_ID) || 10;

const FALLBACK_FEATURED = {
    id: 10,
    name: 'Signal Bloom',
    image: 'signal-bloom-poster-web.webp',
    description: 'A modular AI-assisted live visual performance environment merging Hydra live coding, generative AI imagery via ComfyUI, and audio-reactive systems into a unified performance instrument. The project investigates what happens when AI generation itself becomes performative — treating image creation not as a pre-authored asset, but as an event that unfolds in real time through improvisation between human and machine.',
    url: 'https://signal-bloom.noirmak.com',
    tags: ['Live Coding', 'Generative Art', 'AI-Assisted', 'Audio Reactive', 'Hydra', 'ComfyUI', 'Performance']
};

const FALLBACK_PROJECTS = [
    { id: 1, name: 'Lumyn: Constellation of Self', image: 'noirmak-visit-lumyn.jpg', description: 'An interactive installation that transforms participant reflections into generative poetry, color, and constellation-inspired visual compositions. Using ml5.js-powered motion tracking via webcam, the installation responds to the physical movements of gallery attendees in real time, weaving their presence directly into the generative output. Through AI, creative coding, and projection, Lumyn creates a collective archive of identity, affirmation, and belonging.', url: 'https://visit-lumyn.noirmak.com/', tags: ['Interactive', 'Installation', 'Experiential', 'Generative Art', 'ml5.js', 'Node.js', 'Express.js', 'Three.js', 'AI-Assisted', 'Projection'] },
    { id: 2, name: 'GLITCH.EXE: Orpheus Protocol', image: 'noirmak-orpheus.jpg', description: 'An experimental web-based artwork reimagining the myth of Orpheus and Eurydice through the lens of digital memory, machine perception, and generative systems. Participants navigate a fragmented computational landscape where text, image, and interaction become unstable artifacts of loss, desire, and retrieval. Drawing from glitch aesthetics, audio-reactive visuals, and speculative storytelling, the project explores what remains when memory is translated into code.', url: 'https://orpheus.noirmak.com/', tags: ['Interactive', 'Web Experience', 'Generative Art', 'JavaScript', 'Node.js', 'Hydra Video Synth', 'HTML/CSS'] },
    { id: 3, name: 'stillbecoming', image: 'noirmak-still-becoming.jpg', description: "A generative art project created as a series of personalized digital gifts for friends and loved ones. Each piece combines code, color, motion, and procedural composition to create a unique visual reflection of a person's journey, celebrating growth, transformation, and the unfinished nature of becoming. The project explores how generative systems can serve as acts of care, connection, and personal storytelling.", url: 'https://stillbecoming.noirmak.com/', tags: ['Generative Art', 'JavaScript', 'p5.js', 'HTML/CSS', 'Procedural Design'] },
    { id: 4, name: 'Undertones', image: 'noirmak-undertones.jpg', description: 'An interactive digital poetry experience exploring memory, emotion, and the unspoken layers beneath human communication. Through text, interaction, and generative visual elements, participants navigate a nonlinear poetic landscape where meaning emerges through exploration rather than direct narration. The project investigates how digital media can expand poetry beyond the page into an experiential form.', url: 'https://undertones.noirmak.com/', tags: ['Interactive', 'Digital Poetry', 'Web Experience', 'HTML/CSS'] },
    { id: 5, name: 'Between States', image: 'noirmak-between-states.jpg', description: 'A concept and pitch platform for an immersive XR experience designed to extend live music performances beyond the stage. Blending spatial media, generative visuals, audience participation, and real-time audio reactivity, the project envisions new forms of connection between performers and audiences through shared digital environments. Developed as both a creative technology proposal and experiential design framework, Between States explores how emerging media can deepen connection, presence, and storytelling beyond the stage.', url: 'https://between-states-pitch-deck.noirmak.com/', tags: ['XR', 'Immersive Media', 'Experiential Design', 'Product Concept', 'Interactive', 'Speculative Design', 'WebXR', 'JavaScript', 'Three.js', 'Spatial Computing', 'Real-Time Graphics', 'Audio Reactive'] },
    { id: 6, name: 'Noise Palette', image: 'noirmak-noise-palette.jpg', description: 'A browser-based creative tool for generating glitch-inspired artworks through noise, color, and procedural drawing systems. By blending user input with algorithmic intervention, Noise Palette transforms digital painting into an unpredictable dialogue between artist and machine.', url: 'https://noise-palette.noirmak.com/', tags: ['Creative Tool', 'Glitch Art', 'Interactive', 'Generative Art', 'JavaScript', 'HTML5 Canvas', 'Procedural Graphics'] },
    { id: 7, name: 'Atmos Index', image: 'noirmak-atmos-index.jpg', description: 'A location-aware generative artwork that transforms local time and atmospheric conditions into a personalized digital sky. Real-world environmental data drives evolving cloud formations, daylight transitions, and celestial elements, creating a unique visualization for every viewer.', url: 'https://atmosindex.noirmak.com/', tags: ['Generative Art', 'Data Visualization', 'Interactive', 'Particle Systems', 'JavaScript'] },
    { id: 8, name: 'Stitched in Code', image: 'noirmak-web-stitched-in-code.jpg', description: 'A digital holiday card that combines glitch art, ASCII-inspired visuals, and creative coding to transform a seasonal greeting into an interactive artwork. Created as a gift for friends and family, the project explores code as a medium for expression, play, and connection.', url: 'https://stitchedincode.noirmak.com/', tags: ['Glitch Art', 'ASCII Art', 'Digital Art', 'JavaScript', 'HTML/CSS'] },
    { id: 9, name: 'Lumyn', image: 'noirmak-lumyn-web.jpg', description: 'A web-based generative art platform that uses a fine-tuned language model to create personalized poetry and color metaphors from participant responses celebrating identity, resilience, and inner beauty. The project explores the intersection of AI, creative coding, and interactive storytelling as tools for reflection and emotional connection.', url: 'https://lumyn.noirmak.com/', tags: ['Generative AI', 'Interactive', 'Digital Poetry', 'Creative Technology', 'Web Experience', 'JavaScript', 'Node.js', 'Express.js', 'LLM Integration'] }
];

const FALLBACK_GALLERY = [
    { id: 1, numeral: 'I', image: 'redacted-bodies-gen-01.png', prompt: 'NoirmakStyle, digital artwork featuring two luminous classical marble figures surrounded by abstract botanical forms, vibrant cyan and magenta atmosphere, surreal composition, glowing signal traces, textured digital painting, harmonious symmetry, rule of thirds' },
    { id: 2, numeral: 'II', image: 'redacted-bodies-gen-02.png', prompt: 'NoirmakStyle, portrait emerging through compression artifacts, erased identity, chromatic aberration, digital noise, atmospheric glow' },
    { id: 3, numeral: 'III', image: 'redacted-bodies-gen-03.png', prompt: 'NoirmakStyle, queer body emerging from digital bloom, fragmented light, datamosh artifacts, signal reconstruction' },
    { id: 4, numeral: 'IV', image: 'redacted-bodies-gen-04.png', prompt: 'NoirmakStyle, queer identity indexed as machine archive, glitch blocks, scanline distortion, digital deterioration' },
    { id: 5, numeral: 'V', image: 'redacted-bodies-gen-05.png', prompt: 'NoirmakStyle, portrait hidden beneath algorithmic masking, signal corruption, chromatic bloom, black background' },
    { id: 6, numeral: 'VI', image: 'redacted-bodies-gen-06.png', prompt: 'NoirmakStyle, two abstract humanoid forms facing one another, digital duplicate reflections, overlapping signal structures, surreal dialogue, painterly textures' },
    { id: 7, numeral: 'VII', image: 'redacted-bodies-gen-07.png', prompt: 'NoirmakStyle, body reconstructed from fragmented digital memory, translucent crystalline surfaces, corrupted scanlines, neon cyan and magenta bloom, machine hallucination' },
    { id: 8, numeral: 'VIII', image: 'redacted-bodies-gen-08.png', prompt: 'NoirmakStyle, radiant human silhouette blooming into crystalline light, fragmented pixels dissolving into organic geometry, RGB split, atmospheric haze' },
    { id: 9, numeral: 'IX', image: 'redacted-bodies-gen-09.png', prompt: 'NoirmakStyle, luminous skeletal figure assembled from broken transmission fragments, crystalline structure, neon cyan, magenta highlights, black void' },
    { id: 10, numeral: 'X', image: 'redacted-bodies-gen-10.png', prompt: 'NoirmakStyle, fragmented angelic figure reconstructed from corrupted transmission, glitch sculpture, atmospheric glow' },
    { id: 11, numeral: 'XI', image: 'redacted-bodies-gen-11.png', prompt: 'NoirmakStyle, surreal digital artwork featuring blooming recursive geometry, atmospheric cyan light, glowing marble textures, abstract computational landscape' },
    { id: 12, numeral: 'XII', image: 'redacted-bodies-gen-12.png', prompt: 'NoirmakStyle, angelic figure with blue hues, ethereal, emerging from the mist' }
];

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.static('public'));

app.get('/', async (req, res) => {
    let projectArray;
    let featuredProject;
    try {
        [projectArray, featuredProject] = await Promise.all([
            db.getAllProjects(),
            db.getProjectById(FEATURED_PROJECT_ID)
        ]);
        if (!featuredProject) featuredProject = FALLBACK_FEATURED;
    } catch (e) {
        console.error('DB query failed, using fallback:', e.message);
        projectArray = FALLBACK_PROJECTS;
        featuredProject = FALLBACK_FEATURED;
    }
    res.render('index', { projectArray, featuredProject });
});

app.get('/collection', async (req, res) => {
    let gallery;
    try {
        gallery = await db.getAllArtworks();
        if (!gallery || gallery.length === 0) gallery = FALLBACK_GALLERY;
    } catch (e) {
        console.error('DB query failed, using fallback:', e.message);
        gallery = FALLBACK_GALLERY;
    }
    res.render('collection', { gallery });
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/projects', async (req, res) => {
    let projectArray;
    try {
        projectArray = await db.getAllProjects();
    } catch (e) {
        console.error('DB query failed, using fallback:', e.message);
        projectArray = FALLBACK_PROJECTS;
    }
    res.render('projects', { projectArray });
});

app.get('/project/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        throw new Error('No project with that ID');
    }
    let project;
    try {
        project = await db.getProjectById(id);
    } catch (e) {
        console.error('DB query failed, using fallback:', e.message);
        project = FALLBACK_PROJECTS.find(p => p.id === id) || null;
    }
    if (!project) {
        throw new Error('No project with that ID');
    }
    res.render('project', { project });
});

app.get('/newProject', (req, res) => {
    res.render('newProject');
});

app.post('/mail', async (req, res) => {
    try {
        await utils.sendMessage(req.body.subject, req.body.text);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(404).render('error');
});

try {
    await db.connect();
} catch (e) {
    console.warn('Database unavailable — running on fallback data:', e.message);
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
