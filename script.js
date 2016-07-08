"use strict";

var synth = window.speechSynthesis;
var lang = "fi-FI";
var voice = null;

// Pronounciation fixes for letters the browser can't say right in Finnish
var CHARACTER_PRONOUNCIATIONS = {
    "i": "ii",
    ",": "pilkku",
    ".": "piste"
};

var WORDS = [
    "aasi", "aita", "amme", "appelsiini", "aurinko", "auto",
    "banaani", "banaani", "banaani", "blimpsisblömpsis böbberöö",
    "celsius", "cowboy",
    "delfiini", "dinosaurus", "donitsi",
    "etana", "elokuva",
    "faarao", "farkut",
    "gerbiili", "gorilla",
    "haarukka", "halla", "hattara", "helle", "helistin", "hömppä", "höpsö",
    "ilta", "imuri", "intiaani", "isi", "iskä",
    "jekku", "jalkapallo", "jakkara", "jukurtti", "juna", "jänis", "jäätelö",
    "kakku", "kameli", "karkki", "kello", "kivi", "kiivi", "kilpikonna", "kuppi", "karhu", "koira", "käärme", "kala",
        "kana", "kesä", "kevät", "kännykkä",
    "lamppu", "lapsi", "lasi", "lautanen", "leijona", "leikki", "lentokone", "liukumäki", "lyhty", "lintu",
    "mi-ke", "makkara", "makarooni", "mopo", "myyrä", "muurahainen", "möhköfantti", "mörkö",
    "naru", "nökö", "nalle", "nakupelle", "nenä", "norsu", "näk'käri",
    "orava", "omena",
    "paloauto", "parkkipaikka", "piirakka", "piimä", "pilli", "poliisi", "potta", "puuro", "pöytä", "papukaija",
    "quesadilla",
    "rusina", "raketti",
    "salaatti", "sauna", "sininen", "sipuli", "soittopeli", "suihku", "syksy",
    "taika", "talvi", "takka", "talvi", "tarra", "telkkari", "tietokone", "tikkari", "timantti", "trampoliini",
    "uimahousut",
    "veitsi", "västäräkki", "voltti",
    "watti",
    "yö",
    "zumba",
    "äiti",
    "öylätti"
];

// Munge the words array into a convenient hash indexed by the starting letter
var CHARACTER_TO_WORD = (function(words) {
    return words.reduce(function(acc, word) {
        var letter = word[0];
        if (!acc[letter]) {
            acc[letter] = [];
        }
        acc[letter].push(word);
        return acc;
    }, {})
}(WORDS));

function findVoice(lang) {
    var voices = window.speechSynthesis.getVoices();
    for (var i = 0; i < voices.length; i++) {
        if (voices[i].lang === lang) {
            return voices[i];
        }
    }
    return undefined;
}

voice = findVoice(lang);
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = function() {
        voice = findVoice(lang);
    }
}

document.body.addEventListener("keypress", function(e) {
    var str = ("" + String.fromCharCode(e.keyCode)).toLowerCase();
    sayWordForCharacter(str[0]);
});

document.body.addEventListener("click", function(e) {
    var character = getRandomCharacter();
    sayWordForCharacter(character);
});

document.body.addEventListener("touchstart", function(e) {
    var character = getRandomCharacter();
    sayWordForCharacter(character);
});

function getRandomCharacter() {
    return String.fromCharCode(Math.round(Math.random() * (122 - 97) + 97));
}

function getRandomWordForCharacter(character) {
    var len = CHARACTER_TO_WORD[character].length;
    return CHARACTER_TO_WORD[character][Math.round(Math.random() * (len - 1))]
}

function showWord(word) {
    var displayStr = "&nbsp;";
    if (word.length > 1) {
        displayStr = word.toUpperCase();
    }
    document.querySelector(".word").innerHTML = displayStr;
}

function showCharacter(character) {
    var charactersToShow = character.toUpperCase();
    if (character.toLowerCase() !== character.toUpperCase()) {
        charactersToShow += " " + character.toLowerCase();
    }
    document.querySelector(".character").innerText = charactersToShow;
}

function hideInfo() {
    document.querySelector(".info").classList.add("successfully-used");
}

// Utter something like "s is for snail" (fi. "e niinkuin etana")
function sayWordForCharacter(character) {
    if (synth.speaking) {
        synth.cancel();
    }

    // Apply a pronounciation fix if exists
    var phrase = CHARACTER_PRONOUNCIATIONS[character] || character;
    var word = character;

    if (CHARACTER_TO_WORD[character]) {
        word = getRandomWordForCharacter(character);
        phrase = phrase + " niin kuin " + word;
    }
    showWord(word);
    showCharacter(character);
    hideInfo();

    var utterThis = new SpeechSynthesisUtterance(phrase);
    utterThis.voice = voice;
    utterThis.pitch = 1;
    utterThis.rate = 0.9;
    synth.speak(utterThis);
}
