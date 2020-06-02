// Определение контекста рисования
var img = new Image(); //Создает новый экземпляр HTMLImageElement
var canvas = document.getElementById("canvas"); //Получение контекста визуализации
var ctx = canvas.getContext("2d"); // 2d контекст холста
var fileName = ""; // Строка,содержащая имя файла
$(document).ready(function() {
$('input[type=range]').change(applyFilters); // Работа с ползунком
// Функция применения фильтров
function applyFilters() {
var cntrst = parseInt($('#contrast').val());
var sep = parseInt($('#sepia').val());
var yark = parseInt($('#brightness').val());
var hu = parseInt($('#hue').val());
Caman('#canvas', img, function() {
this.revert(false);
this.contrast(cntrst).sepia(sep).brightness(yark).hue(hu).render();
});
}
/* Создание пользовательских фильтров */
Caman.Filter.register("oldpaper", function() {
this.pinhole();
this.noise(10);
this.orangePeel();
this.render();
});
Caman.Filter.register("pleasant", function() {
this.colorize(60, 105, 218, 10);
this.contrast(10);
this.sunrise();
this.hazyDays();
this.render();
});
// Фильтр "Обесцвечивание"
$("#vintage-btn").on("click", function(e) {
Caman("#canvas", function () {
this.greyscale().render();
});
});
// Фильтр шума
$("#noise-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.noise(10).render();
});
});
// Фильтр резкости
$("#sharpen-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.sharpen(20).render();
});
});
//Фильтр размытости
$("#blur-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.stackBlur(5).render();
});
});
//Фильтр «Cross Process»
$("#crossprocess-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.crossProcess().render();
});
});
//Фильтр «Majestic»
$("#majestic-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.herMajesty().render();
});
});
//Фильтр «Nostalgia»
$("#nostalgia-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.nostalgia().render();
});
});
//Фильтр «Lomo»
$("#lomo-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.lomo().render();
});
});
/* Вызов нескольких фильтров внутри одной функции */
// Фильтр «HDR Effect»
$("#hdr-btn").on('click', function(e) {
Caman('#canvas', img, function() {
this.contrast(10);
this.contrast(10);
this.jarques();
this.render();
});
});
// Фильтр "Old Paper"
$("#oldpaper-bnt").on('click', function(e) {
Caman('#canvas', img, function() {
this.oldpaper();
this.render();
});
});
//Фильтр «Pleasant»
$("#pleasant-btn").on('click', function(e) {
Caman('#canvas', img, function() {
this.pleasant();
this.render();
});
});
//Фильтр «Псевдоцвет»
$("#pseudo-btn").on('click', function(e) {
var file = document.querySelector("#upload-file").files[0];
var reader = new FileReader();
if (file) {
fileName = file.name;
reader.readAsDataURL(file);
}
reader.addEventListener(
"load",
function() {
img = new Image();
img.src = reader.result;
// Привязка функции к событию onload
// Передача браузеру, что делать, когда изображение загружено
img.onload = function() {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img, 0, 0, img.width, img.height);
ctx.save();
newImage = grafi.pseudocolor(ctx.getImageData(0, 0, img.width, img.height))
ctx.putImageData(newImage, 0, 0)
$("#canvas").removeAttr("data-caman-id");
};
},
false
);
});
$("#download-btn").on("click", function(e) {
var fileExtension = fileName.slice(-4);
if (fileExtension == ".jpg" || fileExtension == ".png") {
var actualName = fileName.substring(0, fileName.length - 4);
}
download (canvas, actualName + "-edited.jpg");
});
// Сброс настроек
$("#reset-btn").on("click", function(e) {
Caman("#canvas", img, function() {
this.revert(false);
this.render();
var hue = parseInt($('#hue').val(0));
var cntrst = parseInt($('#contrast').val(0));
var vibr = parseInt($('#vibrance').val(0));
var sep = parseInt($('#sepia').val(0));
var yark = parseInt($('#brightness').val(0));
ctx.restore();
});
});
$("#upload-file").on("change", function() {
var file = document.querySelector("#upload-file").files[0];
var reader = new FileReader();
if (file) {
fileName = file.name;
reader.readAsDataURL(file);
}
reader.addEventListener(
"load",
function() {
img = new Image();
img.src = reader.result;
// Привязка функции к событию onload
// Передача браузеру, что делать, когда изображение загружено
img.onload = function() {
canvas.width = img.width;
canvas.height = img.height;
ctx.drawImage(img, 0, 0, img.width, img.height);
$("#canvas").removeAttr("data-caman-id");
};
},
false
);
});
});
// Функция сохранения изображения
function download (canvas, filename) {
var e;
var lnk = document.createElement("a");
lnk. download = filename;
lnk.href = canvas.toDataURL("image/jpeg", 0.8);
if (document.createEvent) {
e = document.createEvent("MouseEvents");
e.initMouseEvent(
"click",
true,
true,
window,
0,
0,
0,
0,
0,
false,
false,
false,
false,
0,
null
);
lnk.dispatchEvent(e);
} else if (lnk.fireEvent) {
lnk.fireEvent("onclick");
}
}
//Масштабирование изображения
var pos = document.getElementById("pos");
var slider = document.getElementById("slider");
function zoomPOS() {
zoomlevel = slider.valueAsNumber;
pos.style.webkitTransform = "scale("+zoomlevel+")";
pos.style.msTransform = "scale("+zoomlevel+")";
pos.style.transform = "scale(" + zoomlevel + ")";
}
