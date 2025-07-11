const root = document.querySelector(':root');
const themeBtn = document.querySelector('.theme-btn');
const light = 'light';
const dark = 'dark';
const textarea = document.querySelector('.text-content');
const excludeSpacesChkbox = document.querySelector('#exclude-spaces');
const setCharLimitChkbox = document.querySelector('#set-char-limit');
const charLimitInput = document.querySelector('#char-limit');
const totalCharacters = document.querySelector('#total-char');
const totalWords = document.querySelector('#total-word');
const totalSentences = document.querySelector('#total-sentence');
const initialList = document.querySelector('ul.letter-density-list');
const moreList = document.querySelector('ul.more-list');
const seeBtn = document.querySelector('.see-btn');
const densityMsg = document.querySelector('.density-message');
const readingTime = document.querySelector('.reading-time');

themeBtn.addEventListener('click', toggleTheme);

document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    root.className = theme ?? light;
});

excludeSpacesChkbox.addEventListener('change', function () {
    startCount(textarea.value);
});

charLimitInput.addEventListener('input', function () {
    startCount(textarea.value);
});

textarea.addEventListener('input', (event) => {

    if (event.target.value) {
        densityMsg.style.display = 'none';
        startCount(event.target.value);
    }
    else {
        densityMsg.style.display = 'block';
        totalCharacters.innerText = '00';
        totalWords.innerText = '00';
        totalSentences.innerText = '00';
        readingTime.innerText = '0 minute';
        initialList.innerHTML = '';
        moreList.innerHTML = '';
        textarea.setCustomValidity("");
    }
});

seeBtn.addEventListener('click', function () {
    if (getComputedStyle(moreList).display === 'none') {
        moreList.style.display = 'grid';
        seeBtn.innerHTML = 'See less <i class="fa-solid fa-angle-up icon-arrowhead"></i>';
    }
    else {
        moreList.style.display = 'none';
        seeBtn.innerHTML = 'See more <i class="fa-solid fa-angle-down icon-arrowhead"></i>';
    }
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

    const charCount = calcTotalCharacters(text, excludeSpacesChkbox.checked);
    const wordCount = calcTotalWords(text);
    const sentenceCount = calcTotalSentences(text);
    const time = calcReadingTime(wordCount);

    updateReadingTime(time);
    updateTotalCharacters(charCount);
    updateTotalWords(wordCount);
    updateTotalSentences(sentenceCount);
    updateLetterDensity(text);
}

function updateTotalCharacters(value) {
    totalCharacters.innerText = value.toString().padStart(2, "0");
}

function updateTotalWords(value) {
    totalWords.innerText = value.toString().padStart(2, "0");
}

function updateTotalSentences(value) {
    totalSentences.innerText = value.toString().padStart(2, "0");
}

function updateReadingTime(value) {
    if (value === 0) {
        readingTime.innerText = '0 minute';
    }
    else if (value < 1) {
        readingTime.innerText = '< 1 minute';
    }
    else {
        readingTime.innerText = `${Math.round(value)} minutes`;
    }

}

function updateLetterDensity(text) {
    const newText = text?.toUpperCase().match(/[A-Z]/g);
    const sortedList = calcLetterDensities(newText);
    prepareLetterDensityResults(sortedList, newText.length);
}

function calcTotalCharacters(text, excludeSpaces) {
    if (excludeSpaces) {
        const regexp = /\s/g;
        return text?.replaceAll(regexp, "")?.length ?? 0;
    }
    else {
        return text?.length ?? 0;
    }
}

function calcTotalWords(text) {
    const regexp = /\b\w+\b/gi;
    return text?.match(regexp)?.length ?? 0;

}

function calcTotalSentences(text) {
    const regexp = /[^.?!]*[.?!]/g;
    return text?.match(regexp)?.length ?? 0;
}


function calcLetterDensities(text) {
    let counter = {};

    for (let i = 0; i < text.length; i++) {
        const letter = text[i];

        if (!(letter in counter)) {
            counter[letter] = 1;
        }
        else {
            counter[letter] += 1;
        }
    }

    let entries = Object.entries(counter);
    entries.sort((a, b) => {
        return b[1] - a[1];
    });

    return entries;
}


function prepareLetterDensityResults(list, totalChar) {
    initialList.innerHTML = '';
    moreList.innerHTML = '';

    for (let i = 0; i < list.length; i++) {
        const item = list[i];
        const listItem = document.createElement('li');
        listItem.className = "density-item";

        const letter = document.createElement('p');
        letter.className = 'letter';
        letter.innerText = item[0];

        const percentageValue = item[1] / totalChar * 100;
        const rateText = document.createElement('p');
        rateText.className = 'rate';
        const percentageText = percentageValue.toFixed(2) + '%';
        rateText.innerText = `${item[1]} (${percentageText})`;

        const progressbarBg = document.createElement('div');
        progressbarBg.classList = "progressbar progressbar-bg";

        const progressbarFill = document.createElement('div');
        progressbarFill.classList = "progressbar progressbar-fill";
        progressbarFill.style.width = percentageText;
        progressbarBg.appendChild(progressbarFill);

        listItem.appendChild(letter);
        listItem.appendChild(progressbarBg);
        listItem.appendChild(rateText);

        if (i < 5) {
            initialList.appendChild(listItem);
        }
        else {
            moreList.append(listItem);
        }
    }
}

function calcReadingTime(numOfWords) {
    //average: 238 words per min
    const avg = 238;
    return numOfWords / avg;
}