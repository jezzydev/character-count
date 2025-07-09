const root = document.querySelector(':root');
const themeBtn = document.querySelector('.theme-btn');
const light = 'light';
const dark = 'dark';
const textarea = document.querySelector('.text-content');
const excludeSpacesChkbox = document.querySelector('#exclude-spaces');
const setCharLimitChkbox = document.querySelector('#set-char-limit');
const charLimitInput = document.querySelector('#char-limit');

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

excludeSpacesChkbox.addEventListener('change', function () {
    console.log(this.checked);
    console.log(textarea.value);
    updateTotalCharacters(textarea.value, this.checked);
});

charLimitInput.addEventListener('input', function () {
    startCount(textarea.value);
});

textarea.addEventListener('input', (event) => {
    startCount(event.target.value);
});

function startCount(text) {
    if (setCharLimitChkbox.checked) {

        if (text.length > charLimitInput.value) {
            textarea.setCustomValidity("Limit Reached!");
            document.querySelector('.limit-text').innerText = charLimitInput.value;
            text = text.slice(0, charLimitInput.value);
        }
        else {
            textarea.setCustomValidity("");
        }
    }

    updateTotalCharacters(text, excludeSpacesChkbox.checked);
    updateTotalWords(text);
    updateTotalSentences(text);
}

function updateTotalCharacters(text, excludeSpaces) {
    document.querySelector('#total-char').innerText = countTotalCharacters(text, excludeSpaces);
}

function updateTotalWords(text) {
    document.querySelector('#total-word').innerText = countTotalWords(text);
}

function updateTotalSentences(text) {
    document.querySelector('#total-sentence').innerText = countTotalSentences(text);
}

function countTotalCharacters(text, excludeSpaces) {
    if (excludeSpaces) {
        const regexp = /\s/g;
        return text?.replaceAll(regexp, "")?.length ?? 0;
    }
    else {
        return text?.length ?? 0;
    }
}

function countTotalWords(text) {
    const regexp = /\b\w+\b/gi;
    return text?.match(regexp)?.length ?? 0;

}

function countTotalSentences(text) {
    const regexp = /[^.?!]*[.?!]/g;
    return text?.match(regexp)?.length ?? 0;
}