var density = 2;
var ribbonWidth = 20;
var shapeColor;
var fontSize = 300;
var pathSimplification = 1;
var pathSampleFactor = 0.1;
var textTyped = "SONIK";
var font;
let video;
var clear1;

var mic;
let sound;
let mode = "mouse";

function preload() {
  font = loadFont("Lausanne-Regular.otf");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  shapeColor = color(255, 255, 255);
  createLetters();
  soundon();
  noFill();

  trslider = select('#letter-space');
  lslider = select('#line-space');
  tsslider = select('#range-typescale');
  
  ribbonwidth = select('#ribbonwidth');
  ribbondensity = select('#ribbondensity');
  strokewidth = select('#strokewidth');
  fill1 = select('#fill');
  
  mouse = select("#mouse");
  sound = select("#sound");
  save1 = select("#save");
  input1 = select("#input1");


  mouse.mousePressed(mouseon);
  sound.mousePressed(soundon);
  save1.mousePressed(save);

  circleCursor = select("#cursor1");
}

function draw() {

  //fill(fill1.value());
  
  strokeWeight(strokewidth.value());
  stroke(shapeColor);
  
  clear();

  circleCursor.style("left", mouseX + "px");
  circleCursor.style("top", mouseY + "px");

   translate(windowWidth / 4, windowHeight / 2 + 60);

  if (mode === "sound") {
    if (mic) {
      let vol = mic.getLevel();

      pathSampleFactor = 0.2 * pow(vol, 1, 0);
    }
  } else if (mode === "mouse") {
    pathSampleFactor = 0.2 * pow(0.01, mouseX / windowWidth);
  }

  for (var i = 0; i < letters.length; i++) {
    letters[i].draw();
  }
}

function createLetters() {
  
  
  letters = [];
  var chars = textTyped.split("a"); 
  var x = 0;
  for (var i = 0; i < chars.length; i++) {    
    if (i > 0) {
      var charsBefore = textTyped.substring(0, i);
      x = font.textBounds(charsBefore, 0, 0, fontSize).w;
    }
    var newLetter = new Letter(chars[i], x, 0);
    letters.push(newLetter);
  }
}

function Letter(char, x, y) {
  
  this.char = char;
  this.x = x;
  this.y = y;

  Letter.prototype.draw = function () {
    
    ribbonWidth =  ribbonwidth.value();
    density = ribbondensity.value();
     
    var path = font.textToPoints(input1.value(), this.x, this.y, tsslider.value(), {
      sampleFactor: pathSampleFactor,
    });

    for (var d = 0; d < ribbonWidth; d += density) {
      beginShape();

      for (var i = 0; i < path.length; i++) {
        var pos = path[i];
        var nextPos = path[i + 1];

        if (nextPos) {
          var p0 = createVector(pos.x, pos.y);
          var p1 = createVector(nextPos.x, nextPos.y);
          var v = p5.Vector.sub(p1, p0);
          v.normalize();
          v.rotate(HALF_PI);
          v.mult(d);
          var pneu = p5.Vector.add(p0, v);
          curveVertex(pneu.x, pneu.y);
        }
      }

      endShape();
    }
  };
}

function soundon() {
  mode = "sound";

}

function mouseon() {
  mode = "mouse";
}

function save() {
  save(".png");
}
function keyTyped() {
  
   mode = "sound";
  
   getAudioContext().resume();
  mic = new p5.AudioIn();
  mic.start();


  
}


