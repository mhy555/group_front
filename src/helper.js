import {inputChange} from './main.js'

var startBtn = document.getElementById("startBtn");

export default{
    UpdateStatus: function(status) {
        statusDiv.innerHTML = status;
    },

    UpdateRecognizedHypothesis: function(text, append) {
        if (append)
            hypothesisDiv.innerHTML += text + " ";
        else
            hypothesisDiv.innerHTML = text;

        var length = hypothesisDiv.innerHTML.length;
        if (length > 403) {
            hypothesisDiv.innerHTML = "..." + hypothesisDiv.innerHTML.substr(length-400, length);
        }
    },

    OnSpeechEndDetected: function () {
        stopBtn.disabled = true;
    },

    UpdateRecognizedPhrase: function (json) {
        var result = JSON.parse(json);
        document.getElementById("story-input").value += result.DisplayText + " ";
        inputChange();
    },

    OnComplete: function() {
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}
