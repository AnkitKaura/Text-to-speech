var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('.datafield');
var voiceSelect = document.querySelector('select');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');
var pauseBtn = document.getElementById('stop');

var voices = [];
var myTimeout;
var isPaused = false;


function populateVoiceList() {
    voices = synth.getVoices().sort(function (a, b) {
        const aname = a.name.toUpperCase(), bname = b.name.toUpperCase();
        if (aname < bname) return -1;
        else if (aname == bname) return 0;
        else return +1;
    });
    //   var selectedIndex = voiceSelect.selectedIndex < 0 ? 0 : voiceSelect.selectedIndex;
    voiceSelect.innerHTML = '';
    for (i = 0; i < voices.length; i++) {
        var option = document.createElement('option');
        option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

        if (voices[i].default) {
            option.textContent += ' -- DEFAULT';
        }
        if (voices[i].name === 'Google US English') {
            console.log("yess")
            // option.selected = true
            option.setAttribute('selected', 'selected');

        }
        option.setAttribute('data-lang', voices[i].lang);
        option.setAttribute('data-name', voices[i].name);

        voiceSelect.appendChild(option);
    }
    //   voiceSelect.selectedIndex = selectedIndex;
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
}

function myTimer() {
    synth.pause();
    synth.resume();
    myTimeout = setTimeout(myTimer, 5000);
}

function speak() {

    if (synth.speaking && !isPaused) {
        console.log('Already speaking');
        return;
    }
    
    if (inputTxt.value !== '') {
        var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
        utterThis.onend = function (event) {
            clearInterval(myTimeout);
            document.getElementById('search').value = "";
        }
        utterThis.onerror = function (event) {
            clearInterval(myTimeout);
        }
        var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
        for (i = 0; i < voices.length; i++) {
            if (voices[i].name === selectedOption) {
                utterThis.voice = voices[i];
                break;
            }
        }
        utterThis.pitch = pitch.value;
        utterThis.rate = rate.value;
        synth.speak(utterThis);
        if(!isPaused) {
            myTimeout = setTimeout(myTimer, 5000);
        }
        

        
    }
}

inputForm.onsubmit = function (event) {
    event.preventDefault();
    if(isPaused) {
        console.log("is Paused............")
        isPaused = false;
        synth.resume()
        myTimeout = setTimeout(myTimer,5000);
        return;
    }
    speak();
    inputTxt.blur();
}

pitch.onchange = function () {
    pitchValue.textContent = pitch.value;
}

rate.onchange = function () {
    rateValue.textContent = rate.value;
}

voiceSelect.onchange = function () {
    speak();
}

pauseBtn.onclick = function () {
    synth.pause();
    clearInterval(myTimeout);
    isPaused = true;
}