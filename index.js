document.getElementById('Name').addEventListener('mouseover', function() {
    this.textContent = '46Yuu';
});

document.getElementById('Name').addEventListener('mouseout', function() {
    this.textContent = 'Henri Tran';
});

document.querySelectorAll('.hoverarea').forEach(box => {
    const link = box.dataset.href; 
    box.addEventListener('click', () => {
        location.href = link;
    });
});


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