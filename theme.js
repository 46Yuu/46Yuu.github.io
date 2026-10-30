// Applies the saved theme before first paint and adds a light/dark toggle to the navbar.
(function () {
    const root = document.documentElement;
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) {}
    if (saved === 'light' || saved === 'dark') root.dataset.theme = saved;

    function currentTheme() {
        if (root.dataset.theme) return root.dataset.theme;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    document.addEventListener('DOMContentLoaded', () => {
        const navbar = document.querySelector('.navbar');
        if (!navbar) return;
        const isFr = root.lang === 'fr';
        const button = document.createElement('button');
        button.className = 'theme-toggle';
        button.type = 'button';

        function render() {
            const light = currentTheme() === 'light';
            // Show the icon of the theme you will switch to.
            button.innerHTML = light
                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>'
                : '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
            const label = light
                ? (isFr ? 'Passer en mode sombre' : 'Switch to dark mode')
                : (isFr ? 'Passer en mode clair' : 'Switch to light mode');
            button.setAttribute('aria-label', label);
            button.title = label;
        }

        button.addEventListener('click', () => {
            const next = currentTheme() === 'light' ? 'dark' : 'light';
            root.dataset.theme = next;
            try { localStorage.setItem('theme', next); } catch (e) {}
            render();
        });

        render();
        const languageSwitch = navbar.querySelector('.language-switch');
        navbar.insertBefore(button, languageSwitch);
    });
})();
