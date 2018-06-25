'use strict'

const headerBtns = Array.from(document.querySelectorAll('.header-btn'));
const catalogBtn = document.querySelector('.catalog-btn');
const catalog = document.querySelector('.catalog-pop-up');

catalogBtn.addEventListener('click', showCatalog);

headerBtns.forEach(el => {
    el.addEventListener('click', onHeaderClick);
})

function showCatalog() {
    catalog.classList.toggle('hidden');
}

function removeCurrent() {
    headerBtns.forEach(el => {
        el.classList.remove('current');
    })
}

function onHeaderClick(event) {
    hidder();
    removeCurrent();
    event.currentTarget.classList.add('current');
    const target = event.currentTarget.classList[1];
    showContent(target);
}

function hidder() {
    const allContent = Array.from(document.querySelectorAll('.content'));
    allContent.forEach(el => {
        el.classList.add('hidden');
    })
}

function showContent(target) {
    document.querySelector(`.${target}-wrap`).classList.remove('hidden');
}

