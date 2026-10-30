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

const modal = document.getElementById("myModal");
const images = document.querySelectorAll(".content-images img");
const modalImg = document.getElementById("img01");
const span = document.getElementsByClassName("close")[0];

function closeModal() {
    modal.style.display = "none";
}

images.forEach(img => {
    img.onclick = function(){
        modal.style.display = "flex";
        modalImg.src = this.src;
        modalImg.alt = this.alt;
    }
});

// Some project pages have no image gallery.
if (modal) {
    span.onclick = closeModal;

    // Clicking outside the image or pressing Escape also closes it.
    modal.onclick = function(event) {
        if (event.target !== modalImg) closeModal();
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") closeModal();
    });
}
