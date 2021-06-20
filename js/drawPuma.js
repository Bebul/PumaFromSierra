var GLOB = {
  canvasWidth: 1050,
  canvasHeight: 1485,
  tornX: 1050 * 2.0 / 3.0,
  netStyleDash: [1, 1],
  tornNumber: 20, // 22 still good, but your hands would suffer while using scisors
  tornFont: "55px Arial",
  pictures: []
}

function drawPumaNet(ctx) {
  ctx.setLineDash(GLOB.netStyleDash);
  ctx.lineWidth = 1;

  let x0 = GLOB.tornX
  ctx.beginPath();
  ctx.moveTo(x0, 0)
  ctx.lineTo(x0, GLOB.canvasHeight)
  ctx.stroke()

  let yShift = GLOB.canvasHeight / GLOB.tornNumber
  for (let y = 1; y < GLOB.tornNumber; y++) {
    ctx.beginPath();
    ctx.moveTo(x0, y * yShift)
    ctx.lineTo(GLOB.canvasWidth, y * yShift)
    ctx.stroke()
  }
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

function drawTornLetters(ctx, text, n) {
  let letterText = `${n+1} - ${text[n]}`

  ctx.font = GLOB.tornFont;
  let letterInfo = ctx.measureText(letterText)
  let xShift = 0.75 * ((GLOB.canvasWidth - GLOB.tornX) - letterInfo.width)
  let yShift = GLOB.canvasHeight / GLOB.tornNumber
  for (let i = 0; i < GLOB.tornNumber; i++) {
    let y = (i+1) * yShift - GLOB.tornNumber / 2
    ctx.fillText(letterText, GLOB.tornX + xShift,  y);
  }
}

function drawCentralLetterAndPictures(ctx, text, n) {
  let letterText = `${n+1}.${text[n]}`
  ctx.font = "480px Stint";
  let letterInfo = ctx.measureText(letterText)
  let x = 0.5 * (GLOB.canvasHeight - letterInfo.width)
  ctx.fillText(letterText, x - GLOB.canvasHeight, GLOB.canvasWidth * 0.6)

  // and two images
  let rnd1 = Math.floor(Math.random() * GLOB.pictures.length)
  let rnd2 = (rnd1 + 1 + Math.floor(Math.random() * (GLOB.pictures.length - 1))) % GLOB.pictures.length  // so it is different to left image

  let availableWidth = 0.8 * (0.5 * (GLOB.canvasHeight - letterInfo.width)) // 80%
  let availableHeight = 0.7 * (2 * GLOB.canvasWidth / 3)

  // draw left image
  let left = GLOB.pictures[rnd1]
  let leftWidth = left.naturalWidth
  let leftHeight = left.naturalHeight
  let ratio1 = Math.min(availableWidth / leftWidth, 1.25) // 1.25x resize max
  ctx.drawImage(left, 40-GLOB.canvasHeight, GLOB.canvasWidth * 0.666 - left.naturalHeight * ratio1, leftWidth * ratio1, leftHeight * ratio1)

  // draw right image
  let right = GLOB.pictures[rnd2]
  let rightWidth = right.naturalWidth
  let rightHeight = right.naturalHeight
  let ratio2 = Math.min(availableWidth / rightWidth, 1.25) // 1.25x resize max
  ctx.drawImage(right, -rightWidth * ratio2 - 40, GLOB.canvasWidth * 0.666 - right.naturalHeight * ratio2, rightWidth * ratio2, rightHeight * ratio2)
}

function drawPumaPage(ctx, text, n) {
  drawPumaNet(ctx)
  drawTornLetters(ctx, text, n)
  ctx.rotate(-Math.PI / 2); // BEWARE!!!
  drawCentralLetterAndPictures(ctx, text, n)
}

function preparePictures() {
  let picturesEl = document.getElementById("pictures")
  for (let i=0; i < picturesEl.childNodes.length; i++) {
    let node = picturesEl.childNodes[i]
    let src = node.src
    if (src) {
      //console.log(`picture detected: [${node.naturalWidth},${node.naturalHeight}] ${src}`)
      GLOB.pictures.push(node)
    }
  }
}

function drawPumaPages(text) {
  // for each letter in the text, create a Puma page
  // first - create canvases
  let canvases = document.getElementById("canvases")

  // prepare pictures
  preparePictures()

  // draw pages
  for (let i = 0; i < text.length; i++) {
    let canvasEl = createCanvas(i+1)
    canvases.appendChild(canvasEl)
    let ctx = canvasEl.getContext("2d")
    drawPumaPage(ctx, text, i)
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
