import './styles/main.less'

import $ from 'n-zepto'
import service from './service.js'
import speech from './speech-recognition.js'
import pre from './preview.js'
import * as SDK from 'microsoft-speech-browser-sdk';

$('.preview-btn').on('click', preview);
$('.left-btn').on('click', leftClick);
$('.right-btn').on('click', rightClick);
$('.switch-scene').on('click', switchScene);
$('.text-submit').on('click', submitText);
$('#story-input').on('input porpertychange', inputChange);
$('#startBtn').on('click', startRecognizer);

var ua = window.navigator.userAgent;
var cvs = document.getElementById('cvs');
var ctx = cvs.getContext('2d');
var bgd = document.getElementById('bgd');
var bgd_ctx = bgd.getContext('2d');

ctx.font = '30px Arial';

var DEFAULT_WIDTH = cvs.width/6;
var DEFAULT_HEIGHT = cvs.height/4;

var storedPicture = [];
var storedBackground = [];
var storedText = [];
var currentScene = 0;
var totalScene = 0;
var recognizer;
var storedSubmit = [];
var newScene = true;
var cache = {};

var os = function() {
     var ua = navigator.userAgent,
     isWindowsPhone = /(?:Windows Phone)/.test(ua),
     isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
     isAndroid = /(?:Android)/.test(ua),
     isFireFox = /(?:Firefox)/.test(ua),
     isChrome = /(?:Chrome|CriOS)/.test(ua),
     isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
     isPhone = /(?:iPhone)/.test(ua) && !isTablet,
     isPc = !isPhone && !isAndroid && !isSymbian;
     return {
          isTablet: isTablet,
          isPhone: isPhone,
          isAndroid : isAndroid,
          isPc : isPc,
          isWindowsPhone,
          isSymbian,
          isFireFox,
          isChrome
     };
}();

if (os.isPc && os.isFireFox) {
  $('#startBtn').css('display', 'block');
}

(function setupRecognizer() {
  recognizer = speech.RecognizerSetup(SDK, 'Interactive', 'en-GB', 'Simple', '8788f0f31924485e8c18624605a33710');
})();

function startRecognizer() {
  speech.RecognizerStart(recognizer);
}

function stopRecognizer() {
  speech.RecognizerStop(recognizer);
}

export function inputChange() {
  storedText[currentScene] = document.getElementById("story-input").value;
}

function restoreInput() {
  if (!!storedText[currentScene]) {
    document.getElementById("story-input").value = storedText[currentScene];
  }
}

function leftClick(e) {
  if (currentScene > 0) {
    cleanCanvas();
    cleanTextField();
    currentScene--;
    drawStoredImage();
    restoreInput();
  }
}

function rightClick(e) {
  cleanCanvas();
  cleanTextField();
  if (currentScene < totalScene) {
    currentScene++;
    drawStoredImage();
    restoreInput();
  } else if (currentScene >= totalScene) {
    totalScene++;
    currentScene++;
  }
}

function drawStoredImage() {
  if (!!storedBackground[currentScene]) {
    var background = new Image();
    background.src = storedBackground[currentScene];
    background.onload = function(){
      drawBackground(this, 0, 0, bgd.width, bgd.height)
    };
  }
  if (!!storedPicture[currentScene]) {
    var img = new Image();
    img.src = storedPicture[currentScene];
    img.onload = function(){
      drawPicture(this, 0, 0, cvs.width, cvs.height)
    };
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

/* FUNCTION TO TRANSFER THE SUBJECT LOCATION TO THE DRAW POSITION */
function getDrawPosition(loc, width, height, length){
  var position_array = new Object();
  var r = getRandomIntInclusive(-1, 1);
  var c = getRandomIntInclusive(-1, 1);
  switch (loc) {
    case 1:{
      position_array.x = cvs.width/6 - width/2;
      position_array.y = cvs.height/6 - height/2;
      break;
    }
    case 2:{
      position_array.x = cvs.width/2 - width/2;
      position_array.y = cvs.height/6 - height/2;
      break;
    }
    case 3:{
      position_array.x = cvs.width*5/6 - width/2;
      position_array.y = cvs.height/6 - height/2;
      break;
    }
    case 4:{
      position_array.x = cvs.width/6 - width/2;
      position_array.y = cvs.height/2 - height/2;
      break;
    }
    case 5:{
      position_array.x = cvs.width/2 - width/2;
      position_array.y = cvs.height/2 - height/2;
      break;
    }
    case 6:{
      position_array.x = cvs.width*5/6 - width/2;
      position_array.y = cvs.height/2 - height/2;
      break;
    }
    case 7:{
      position_array.x = cvs.width/6 - width/2;
      position_array.y = cvs.height*5/6 - height/2;
      break;
    }
    case 8:{
      position_array.x = cvs.width/2 - width/2;
      position_array.y = cvs.height*5/6 - height/2;
      break;
    }
    case 9:{
      position_array.x = cvs.width*5/6 - width/2;
      position_array.y = cvs.height*5/6 - height/2;
      break;
    }
    case -1: {
        position_array.x = 0;
        position_array.y = 0;
        break;
    }
    default:{
      position_array.x = Math.floor(Math.random()*cvs.width);
      position_array.y = Math.floor(Math.random()*cvs.height);
      break;
    }
  }
  if (length != 1) {
    position_array.x =  position_array.x + r*2/3*width;
    position_array.y =  position_array.y + c*2/3*height;
  }
  return position_array;
}

function drawPicture(obj,x,y, width, height){
  ctx.drawImage(obj, x, y, width, height);
}
function drawBackground(obj,x,y, width, height) {
  bgd_ctx.drawImage(obj, x, y, width, height);
}

function cleanCanvas() {
  cleanPicture();
  cleanBackground();
}

function cleanPicture() {
  ctx.clearRect(0, 0, cvs.width, cvs.height);
}

function cleanBackground() {
  bgd_ctx.clearRect(0, 0, bgd.width, bgd.height);
}

function cleanTextField() {
  document.getElementById("story-input").value = " ";
}

function switchScene() {
    cleanTextField();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    cleanCanvas();
    totalScene++;
    currentScene = totalScene;
    newScene = true;
}

//FUNCTION TO DRAW THE SPEECH BUBBLE
function drawSpeechBubble(x,y,text) {
  var ellipse_x = x+230;
  var ellipse_y = y-50;

  var true_length = text.length + 5;
  var draw_length = 0;

  if(true_length < 10){
    draw_length = true_length*2;
  }
  else if(true_length > 30){
    draw_length = true_length/2;
  }
  else{
    draw_length = true_length;
  }

  var ellipse_a = 5*draw_length;
  var ellipse_b = ellipse_a/5;

  // var arc_r = ellipse_b/2.5;
  var arc_x = ellipse_x-ellipse_a;
  var arc_y = ellipse_y+ellipse_b*2;

  // var move_x = arc_x+arc_r;

  ctx.beginPath();
  ctx.ellipse(ellipse_x, ellipse_y, ellipse_a, ellipse_b, 0, 10, Math.PI, true);
  ctx.moveTo(ellipse_x-ellipse_a/2, ellipse_y+ellipse_b);
  // ctx.arc(arc_x, arc_y, arc_r, 0, 360, false);
  ctx.lineTo(arc_x,arc_y)
  ctx.stroke();
  ctx.closePath();

  ctx.font="20px Georgia";
  ctx.fillText(text,ellipse_x-ellipse_a/1.2 + 10,y*0.8);
}

// function drawSpeechBubble(x,y,text) {
//   var draw_x = x+200;
//   $('.speech-area').append("<div class='bubble'><span>"+text+"</span></div><div class='triangle'></div>")
//   $('.bubble').css({top: y + 'px', left: x + 'px'});
//   $('.triangle').css({top: y + 'px', left: x + 'px'});
// }

// drawSpeechBubble(10,10,"hello");

//FUNCTION TO GET THE SIZE OF DISPLAYING PICTURE
function getPictureSize(size){
  var size_array = new Object();
  switch (size) {
    case 0:{
      size_array.width = DEFAULT_WIDTH;
      size_array.height = DEFAULT_HEIGHT;
      break;
    }
    case -1:{
      size_array.width = DEFAULT_WIDTH*0.5;
      size_array.height = DEFAULT_HEIGHT*0.5;
      break;
    }
    case -2:{
      size_array.width = DEFAULT_WIDTH*0.25;
      size_array.height = DEFAULT_HEIGHT*0.25;
      break;
    }
    case -3:{
      size_array.width = DEFAULT_WIDTH*0.12;
      size_array.height = DEFAULT_HEIGHT*0.12;
      break;
    }
    case 1:{
      size_array.width = DEFAULT_WIDTH*1.5;
      size_array.height = DEFAULT_HEIGHT*1.5;
      break;
    }
    case 2:{
      size_array.width = DEFAULT_WIDTH*2.0;
      size_array.height = DEFAULT_HEIGHT*2.0;
      break;
    }
    case 3:{
      size_array.width = DEFAULT_WIDTH*2.5;
      size_array.height = DEFAULT_HEIGHT*2.5;
      break;
    }
    default: {
      size_array.width = DEFAULT_WIDTH;
      size_array.height = DEFAULT_HEIGHT;
      break;
    }
  }
  return size_array;
}

function submitStore() {
  if (!storedSubmit[currentScene]) {
    storedSubmit.push([]);
  }
  var currentStorage = storedSubmit[currentScene];
  var text = "";
  for (let i = 0; i < currentStorage.length; i++) {
    text += currentStorage[i];
  }
  var textInput = document.getElementById("story-input").value;
  var newTextInput = textInput.replace(text, "");
  currentStorage.push(newTextInput);
  return currentStorage[currentStorage.length - 1]
}

function submitText() {
    var start_time = Date.now()

    var text = submitStore();
    console.log("text: ", text);
    // START OF LOADING
    $("#loading").show();
    service.getParserResult(text, newScene, cache).then(res => {
        if(res.length == 0){
          $("#loading").hide();
        }
        for (let i = 0; i < res.length; i ++){
          var min = i;
          for (let j = i + 1 ; j < res.length; j ++){
            if (res[j]['location'] < res[min]['location']){
              min = j;
            }
          }
        if (min != i){
          var temp = res[i];
          res[i] = res[min];
          res[min] = temp;
        }
        }

        var mark = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        var location_x = new Array();
        var location_y = new Array();

        for (let i = 0; i < res.length; i++) {
            if('cache' in res[i]){
                cache = JSON.parse(res[i]['cache']);
                continue;
            }
            if(res[i]['image'].length == 0){
              $("#loading").hide();
            }
            mark[res[i]['location']] = i;
            if (res[i]['image'].length != 0) {
              var acc = new Array(0,0,0,0,0,0,0,0,0,0)
              var count = new Array(0,0,0,0,0,0,0,0,0,0)

              count[res[i]['location']] = res[i]['image'].length;
                try {
                    for (let j = 0; j < res[i]['image'].length; j++) {
                      let width, height, pos, x, y;
                        if (res[i]['location'] != -1) {
                          if ((res[i]['location'] > 3) && (mark[res[i]['location'] - 3] != -1)){
                            console.log(location_x[mark[res[i]['location'] - 3]]);
                            console.log(location_y[mark[res[i]['location'] - 3]]);
                            width = getPictureSize(res[mark[res[i]['location'] - 3]]['size']).width;
                            height = getPictureSize(res[mark[res[i]['location'] - 3]]['size']).height;
                            x = location_x[mark[res[i]['location'] - 3]];
                            y = location_y[mark[res[i]['location'] - 3]] + height;
                          }else{
                            width = getPictureSize(res[i]['size']).width;
                            height = getPictureSize(res[i]['size']).height;
                            x = getDrawPosition(res[i]['location'], width, height, res[i]['image'].length).x;
                            y = getDrawPosition(res[i]['location'], width, height, res[i]['image'].length).y;
                          }
                            x = x + + acc[res[i]['location']]/count[res[i]['location']]*2/3*cvs.width;
                            location_x[i] = x;
                            location_y[i] = y;
                            acc[res[i]['location']]++;

                        } else {
                            width = bgd.width;
                            height = bgd.height;
                            x =  0;
                            y = 0;
                        }
                        if(x < 0){
                          x = 0;
                        }
                        if(y < 0){
                          y = 0;
                        }
                        if(x >= cvs.width-width){
                          x = cvs.width-width;
                        }
                        if(y >= cvs.height-height){
                          y = cvs.height-height
                        }
                        let img = new Image();
                        img.src = "data:image/  png;base64," + res[i]['image'][j];
                        img.onload = function() {
                            if (res[i]['location'] == -1) {
                                drawBackground(this, x, y, width, height)
                                $("#loading").hide();
                            } else {
                                drawPicture(this, x, y, width, height);
                                // END OF LOADING
                                $("#loading").hide();
                                if(res[i]['speech'] != ''){
                                  drawSpeechBubble(x,y, res[i]['speech']);
                                }
                            }
                            saveCvsPicture();
                            saveBackground();
                            console.log("time: ", (Date.now() - start_time) / 1000);
                        };
                        img.onerror = function() {
                          $("#loading").hide();
                        }
                    }
                } catch(e) {
                    console.log(e);
                    $("#loading").hide();
                }
            }
        }
    }).catch(e => {
        console.log(e);
        $("#loading").hide();
    });
    newScene = false;
}

function saveCvsPicture() {
    var picDataURI = cvs.toDataURL();
    storedPicture[currentScene] = picDataURI;
}

function saveBackground() {
    var backgroundDataURI = bgd.toDataURL();
    storedBackground[currentScene] = backgroundDataURI;
}
function preview(){
   pre.preview(totalScene, storedBackground, storedPicture, storedText);
 }
