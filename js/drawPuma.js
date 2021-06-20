var GLOB = {
  canvasWidth: 1050,
  canvasHeight: 1485,
  cardWidth: 1050/4,
  cardHeight: 1485/3,
  netStyleDash: [5, 15],
  braille: {
    A : "o     ",
    B : "o o   ",
    C : "oo    ",
    D : "oo o  ",
    E : "o  o  ",
    F : "ooo   ",
    G : "oooo  ",
    H : "o oo  ",
    I : " oo   ",
    J : " ooo  ",
    K : "o   o ",
    L : "o o o ",
    M : "oo  o ",
    N : "oo oo ",
    O : "o  oo ",
    P : "ooo o ",
    Q : "ooooo ",
    R : "o ooo ",
    S : " oo o ",
    T : " oooo ",
    U : "o   oo",
    V : "o o oo",
    W : " ooo o",
    X : "oo  oo",
    Y : "oo ooo",
    Z : "o  ooo"
  }
}

function drawCardNet(cardInfo, ctx) {
  function drawVerticals() {
    let x0 = cardInfo.x
    let y0 = cardInfo.y
    let y1 = cardInfo.y + 1.5 * cardInfo.width // note, we want it Squarish
    let xShift = cardInfo.width / 2
    for (x = 1; x < 2; x++) {
      ctx.beginPath();
      ctx.setLineDash(GLOB.netStyleDash);
      ctx.moveTo(x0 + x * xShift, y0);
      ctx.lineTo(x0 + x * xShift, y1);
      ctx.stroke();
    }
  }
  function drawHorizontals() {
    let x0 = cardInfo.x
    let y0 = cardInfo.y
    let x1 = cardInfo.x + cardInfo.width
    let yShift = cardInfo.width / 2  // note, the same as in vertical, to make it squarish
    for (y = 1; y<=2; y++) {
      ctx.beginPath();
      ctx.setLineDash(GLOB.netStyleDash);
      ctx.moveTo(x0, y0 + y * yShift);
      ctx.lineTo(x1, y0 + y * yShift);
      ctx.stroke();
    }
  }
  drawVerticals()
  drawHorizontals()
}

// draw given letter on the n-th order, so for n=0..3 it is at the first row, 4..7 second and 8..11 third row
function drawCard(letter, n, ctx) {
  let x = n % 4
  let y = Math.floor(n / 4) % 3
  let expCardWidth = 0.8 * GLOB.cardWidth
  let offset = (GLOB.cardWidth - expCardWidth) / 2
  let cardInfo = {
    x: x * GLOB.cardWidth + offset,
    y: y * GLOB.cardHeight + offset,
    width: expCardWidth
  }
  var img = document.getElementById("img-background");
  ctx.drawImage(img, x * GLOB.cardWidth, y * GLOB.cardHeight, GLOB.cardWidth, GLOB.cardHeight);
  drawCardNet(cardInfo, ctx)

  // draw Black Circles
  let squareSize = cardInfo.width / 2
  let braileAr = GLOB.braille[letter]
  if (braileAr) {
    for (row = 0; row < 3; row++)
      for (col = 0; col < 2; col++) {
        // console.log("would like to draw dot for letter " + letter + " at row: " + row +" and col:" + col)
        if (braileAr[2 * row + col]==="o") {
          ctx.beginPath();
          ctx.arc(cardInfo.x + (col + 0.5) * squareSize, cardInfo.y + (row + 0.5) * squareSize, 0.8 * (squareSize / 2) , 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.stroke();
        }
      }
  }

  // write the Letter below the dots
  var canvas = document.getElementById("myCanvas");
  ctx.font = "140px Arial";
  let letterInfo = ctx.measureText(letter)
  let heightLeft = GLOB.cardHeight - (cardInfo.y + 1.5 * cardInfo.width)
  ctx.fillText(letter, (x + 0.5) * GLOB.cardWidth - letterInfo.width / 2, (y + 1) * GLOB.cardHeight - 140 / 5 );
}

function drawCardFront(n, ctx) {
  let x = n % 4
  let y = Math.floor(n / 4) % 3
  var img = document.getElementById("img-foreground");
  ctx.drawImage(img, x * GLOB.cardWidth, y * GLOB.cardHeight, GLOB.cardWidth, GLOB.cardHeight);
}

function drawCards(letters, ctx) {
  for (i = 0; i< letters.length; i++) {
    drawCard(letters[i], i, ctx)
  }
}

function drawNet(ctx) {
  function drawVerticals() {
    let x0 = 0
    let y0 = 0
    let y1 = GLOB.canvasHeight
    let xShift = GLOB.canvasWidth / 4
    for (x = 0; x<=4; x++) {
      ctx.beginPath();
      ctx.moveTo(x0 + x * xShift, y0);
      ctx.lineTo(x0 + x * xShift, y1);
      ctx.stroke();
    }
  }
  function drawHorizontals() {
    let x0 = 0
    let y0 = 0
    let x1 = GLOB.canvasWidth
    let yShift = GLOB.canvasHeight / 3  // note, the same as in vertical, to make it squarish
    for (y = 0; y<=3; y++) {
      ctx.beginPath();
      ctx.moveTo(x0, y0 + y * yShift);
      ctx.lineTo(x1, y0 + y * yShift);
      ctx.stroke();
    }
  }
  ctx.setLineDash([]);
  ctx.lineWidth = 1;
  drawVerticals()
  drawHorizontals()
}

function drawPage(letters, canvas) {
  let ctx = canvas.getContext("2d")
  drawCards(letters, ctx)
  drawNet(ctx)
}

function drawFrontPage(canvas) {
  let ctx = canvas.getContext("2d")
  for (i = 0; i<12; i++) {
    drawCardFront(i, ctx)
  }
}

function createCanvas(n) {
  let canvasEl = document.createElement("canvas")
  canvasEl.id = `myCanvas${n}`
  canvasEl.width = 1050
  canvasEl.height = 1485
  return canvasEl
}

function drawPumaPages(text) {
  // for each letter in the text, create a Puma page
  // first - create canvases
  let canvases = document.getElementById("canvases")
  for (let i = 0; i < text.length; i++) {
    let canvasEl = createCanvas(i+1)
    canvases.appendChild(canvasEl)
    drawPage(text[i], canvasEl)
  }
}

function extractInputAndDrawPumas() {
  let formEl = document.getElementById("inputDialog")
  let riddleEl = document.getElementById("riddle")
  let riddleText = riddleEl.value.toUpperCase().replaceAll(" ", "")
  //formEl.appendChild(document.createTextNode(riddleText))
  formEl.style.visibility = "hidden"
  drawPumaPages(riddleText)
}
