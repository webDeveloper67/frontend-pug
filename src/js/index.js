let val = 0;

rotateItem = (item) => {
  item.style.transform = `rotate(${val}deg)`;
  item.style.webkitTransform = `rotate(${val}deg)`;
  item.style.mozTransform = `rotate(${val}deg)`;
  val += 10;
};

setInterval(() => {
  setTimeout(() => {
    rotateItem(document.getElementById("img"), 0);
  }, 8000);
}, 100);
