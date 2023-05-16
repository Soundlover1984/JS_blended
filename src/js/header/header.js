const theBody = document.querySelector('body');
const openNav = document.querySelector('.menu-bar button');
const closeNav = document.querySelector('.close-nav button');
const Navbar = document.querySelector('.navbar');

function showHide() {
    Navbar.classList.toggle('show');
}

openNav.onclick = showHide;
closeNav.onclick = showHide;
