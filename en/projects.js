document.querySelectorAll('.content-box').forEach(box => {
    const link = box.dataset.href; 
    box.addEventListener('click', () => {
        location.href = link;
    });
});

const pageName = window.location.pathname.split('/').pop().split('.')[0];

if (pageName) {
    const navbarItem = document.getElementById(pageName);

    if (navbarItem) {
        navbarItem.classList.add('current');
    }
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