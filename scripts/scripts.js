const root = document.querySelector(':root');
const themeBtn = document.querySelector('.theme-btn');
const light = 'light';
const dark = 'dark';
const textarea = document.querySelector('.text-content');
const excludeSpaces = document.querySelector('#exclude-spaces');
const setCharLimit = document.querySelector('#set-char-limit');

themeBtn.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    root.className = theme ?? light;
});


function toggleTheme() {
    const theme = localStorage.getItem('theme');

    if (theme == dark) {
        root.className = light;
        localStorage.setItem('theme', light);
    }
    else {
        root.className = dark;
        localStorage.setItem('theme', dark);
    }
}


textarea.addEventListener('input', (event) => {
    const text = event.target.value;

    if (setCharLimit.checked) {
        const limit = document.querySelector('#char-limit');

        if (text.length > limit.value) {
            event.target.setCustomValidity("Limit Reached!");
        }
        else {
            event.target.setCustomValidity("");
        }
    }
});

