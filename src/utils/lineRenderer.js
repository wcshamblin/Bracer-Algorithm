const lineColors = {
  breeder: "rgb(58,167,77)",
  generated: "rgb(254,193,43)",
  empty: "rgb(206,212,218)",
};

function fitToContainer(canvas) {
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}

export function offsetCoords(box, offset) {
  const { x, y, left, right, type } = box;
  const newBox = {
    x: x - offset.x,
    y: y - offset.y,
    left: left - offset.x,
    right: right - offset.x,
    type: type,
  };
  return newBox;
}

export function countChildren(tree) {
  let maxChildren = 0;
  for (const level in tree) {
    const count = Object.keys(tree[level]).length;
    maxChildren += count;
  }
  return maxChildren;
}

export function drawLines(boxes, canvas) {
  const ctx = canvas.getContext("2d");
  fitToContainer(canvas);
  ctx.lineWidth = 2;
  const keys = Object.keys(boxes).reverse();
  keys.pop();
  keys.forEach((key) => {
    const level = parseInt(key);
    for (let i = 0; i < Object.keys(boxes[level]).length; i++) {
      for (let j = 0; j <= 1; j++) {
        ctx.strokeStyle =
          lineColors[boxes[level - 1][i * 2 + j].type];
        ctx.beginPath();
        ctx.moveTo(
          boxes[level][i].left + 5,
          boxes[level][i].y + parseInt(`${j !== 0 ? 5 : -5}`)
        );
        ctx.lineTo(
          boxes[level - 1][i + 1].right - 5,
          boxes[level - 1][i * 2 + j].y
        );
        ctx.stroke();
      }
    }
  });
}
