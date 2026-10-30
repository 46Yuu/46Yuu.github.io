// Technology filter: chips are built from the tags on the cards.
// The current filter is kept in the URL (projects.html?tech=csharp) so links from the homepage work.
const isFr = document.documentElement.lang === 'fr';
const cards = [...document.querySelectorAll('.content-box-project')];
const chipContainer = document.getElementById('filter-chips');
const status = document.getElementById('filter-status');

const techs = new Map();
cards.forEach(card => {
    card.querySelectorAll('.tag').forEach(tag => {
        const key = tag.dataset.tech;
        const entry = techs.get(key) || { label: tag.textContent, count: 0 };
        entry.count++;
        techs.set(key, entry);
    });
});

// Logo file per technology, in logos/.
const LOGOS = {
    unity: 'unity.png', unreal: 'unreal.png', godot: 'godot.png', opengl: 'opengl.png',
    sfml: 'sfml.png', yolo: 'yolov11.png', csharp: 'csharp.png', 'c++': 'c++.png',
    java: 'java.png', verse: 'verse.png', python: 'python.png', html: 'html5.png',
    css: 'css3.png', javascript: 'javascript.png', php: 'php.png', mysql: 'mysql.png',
};
const logoDir = isFr ? 'logos/' : '../logos/';

const ENGINES = ['unity', 'unreal', 'godot', 'opengl', 'sfml', 'yolo'];

function makeGroup(title) {
    const group = document.createElement('div');
    group.className = 'filter-group';
    if (title) {
        const heading = document.createElement('span');
        heading.className = 'filter-group-title';
        heading.textContent = title;
        group.appendChild(heading);
    }
    chipContainer.appendChild(group);
    return group;
}

function makeChip(group, key, label, count) {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'filter-chip';
    chip.dataset.tech = key;
    const logo = LOGOS[key] ? `<img class='filter-chip-logo' src='${logoDir}${LOGOS[key]}' alt=''>` : '';
    chip.innerHTML = `${logo}${label} <span class='filter-chip-count'>${count}</span>`;
    chip.addEventListener('click', () => applyFilter(key));
    group.appendChild(chip);
}

const sorted = [...techs.entries()]
    .sort((a, b) => b[1].count - a[1].count || a[1].label.localeCompare(b[1].label));
makeChip(makeGroup(null), '', isFr ? 'Tous les projets' : 'All projects', cards.length);
const engineGroup = makeGroup(isFr ? 'Moteurs & outils' : 'Engines & tools');
sorted.filter(([key]) => ENGINES.includes(key))
    .forEach(([key, { label, count }]) => makeChip(engineGroup, key, label, count));
const languageGroup = makeGroup(isFr ? 'Langages' : 'Languages');
sorted.filter(([key]) => !ENGINES.includes(key))
    .forEach(([key, { label, count }]) => makeChip(languageGroup, key, label, count));

function applyFilter(tech) {
    if (!techs.has(tech)) tech = '';
    let count = 0;
    cards.forEach(card => {
        const match = !tech || card.dataset.tech.split(' ').includes(tech);
        card.classList.toggle('filtered-out', !match);
        if (match) count++;
        card.querySelectorAll('.tag').forEach(tag => {
            tag.classList.toggle('match', tag.dataset.tech === tech);
        });
    });
    chipContainer.querySelectorAll('.filter-chip').forEach(chip => {
        const active = chip.dataset.tech === tech;
        chip.classList.toggle('active', active);
        chip.setAttribute('aria-pressed', active);
    });

    const plural = count > 1 ? 's' : '';
    if (tech) {
        const label = techs.get(tech).label;
        status.textContent = isFr ? `${count} projet${plural} en ${label}` : `${count} project${plural} using ${label}`;
    } else {
        status.textContent = isFr ? `${count} projets` : `${count} projects`;
    }

    const url = tech ? `?tech=${encodeURIComponent(tech)}` : window.location.pathname;
    history.replaceState(null, '', url);
}

applyFilter(new URLSearchParams(window.location.search).get('tech') || '');

// Logos in the tags under each project name.
document.querySelectorAll('.content-box-project .tag').forEach(tag => {
    const file = LOGOS[tag.dataset.tech];
    if (!file) return;
    const logo = document.createElement('img');
    logo.className = 'tag-logo';
    logo.src = logoDir + file;
    logo.alt = '';
    logo.loading = 'lazy';
    tag.prepend(logo);
});

// Hover preview on each card: the project's video if it has one, otherwise a slideshow of its
// screenshots, otherwise its YouTube video. Media is only loaded when the card is hovered.
const siteRoot = isFr ? '' : '../';
const canHover = window.matchMedia('(hover: hover)').matches;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const SLIDE_DELAY = 1200;

function startPreview(card) {
    const thumb = card.querySelector('.project-thumb');
    const { previewVideo, previewImages, previewYoutube } = card.dataset;
    if (!thumb || thumb.querySelector('.preview-layer')) return;
    if (!previewVideo && !previewImages && !previewYoutube) return;

    const layer = document.createElement('div');
    layer.className = 'preview-layer';
    thumb.appendChild(layer);
    const show = () => layer.classList.add('visible');

    if (previewVideo) {
        const video = document.createElement('video');
        video.src = encodeURI(siteRoot + previewVideo);
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.addEventListener('playing', show, { once: true });
        layer.appendChild(video);
        video.play().catch(() => {});
    } else if (previewImages) {
        const slides = previewImages.split('|').map(src => {
            const img = document.createElement('img');
            img.src = encodeURI(siteRoot + src);
            img.alt = '';
            layer.appendChild(img);
            return img;
        });
        const dots = document.createElement('div');
        dots.className = 'preview-dots';
        slides.forEach(() => dots.appendChild(document.createElement('span')));
        layer.appendChild(dots);

        let index = 0;
        const goTo = i => {
            slides[index].classList.remove('active');
            dots.children[index].classList.remove('active');
            index = i;
            slides[index].classList.add('active');
            dots.children[index].classList.add('active');
        };
        goTo(0);
        if (slides[0].complete) show(); else slides[0].addEventListener('load', show, { once: true });
        if (slides.length > 1) {
            layer.timer = setInterval(() => goTo((index + 1) % slides.length), SLIDE_DELAY);
        }
    } else {
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${previewYoutube}`
            + `?autoplay=1&mute=1&controls=0&loop=1&playlist=${previewYoutube}&modestbranding=1&playsinline=1`;
        iframe.allow = 'autoplay; encrypted-media';
        iframe.tabIndex = -1;
        iframe.title = '';
        iframe.addEventListener('load', () => setTimeout(show, 600), { once: true });
        layer.appendChild(iframe);
    }
}

function stopPreview(card) {
    const layer = card.querySelector('.preview-layer');
    if (!layer) return;
    clearInterval(layer.timer);
    layer.remove();
}

if (canHover && !reducedMotion) {
    cards.forEach(card => {
        let delay;
        // Short delay so sweeping the mouse across the grid does not start every preview.
        card.addEventListener('mouseenter', () => { delay = setTimeout(() => startPreview(card), 150); });
        card.addEventListener('mouseleave', () => { clearTimeout(delay); stopPreview(card); });
    });
}

const button = document.querySelector('.back-to-top');

window.addEventListener('scroll', () => {
    const scrollHeight = window.document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const scrollPercentage = (scrollPosition / (scrollHeight - windowHeight)) * 100;

    if (scrollPercentage < 15) {
        button.classList.add('hide-button');
    } else {
        button.classList.remove('hide-button');
    }
});
