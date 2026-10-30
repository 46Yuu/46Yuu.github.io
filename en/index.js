document.getElementById('Name').addEventListener('mouseover', function() {
    this.textContent = '46Yuu';
});

document.getElementById('Name').addEventListener('mouseout', function() {
    this.textContent = 'Henri Tran';
});

document.querySelectorAll('.hoverarea').forEach(box => {
    const link = box.querySelector('a');
    box.addEventListener('click', () => {
        if (link) location.href = link.href;
    });
});

// Count projects per technology from the projects page, so the badges stay in sync.
fetch('projects.html')
    .then(response => response.text())
    .then(text => {
        const doc = new DOMParser().parseFromString(text, 'text/html');
        const cards = [...doc.querySelectorAll('.content-box-project')];
        const isFr = document.documentElement.lang === 'fr';
        document.querySelectorAll('.tech-tile').forEach(tile => {
            const tech = tile.dataset.tech;
            const count = cards.filter(card => card.dataset.tech.split(' ').includes(tech)).length;
            const name = tile.querySelector('.tech-name').textContent;
            if (count === 0) {
                // No project to show: plain tile, not a link.
                const plain = document.createElement('div');
                plain.className = 'tech-tile no-project';
                plain.innerHTML = tile.innerHTML;
                tile.replaceWith(plain);
                return;
            }
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = count + ' ↗';
            tile.appendChild(badge);
            tile.title = isFr
                ? `${count} projet${count > 1 ? 's' : ''} en ${name}`
                : `${count} project${count > 1 ? 's' : ''} using ${name}`;
        });
    })
    .catch(() => {});

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
