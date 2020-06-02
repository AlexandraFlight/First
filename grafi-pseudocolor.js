;(function () {
/**
## Конструктор объекта ImageData
Каждый возврат из метода grafi форматируется в объект ImageData.
Этот конструктор используется, когда "окно" недоступно.
*/
function GrafiImageData (pixelData, width, height) {
this.width = width
this.height = height
this.data = pixelData
}
/**
## Проверка глубины цвета
Чтобы сохранить простоту кода, grafi принимает только данные изображения в RGBA
Длина пиксельных данных должна быть в 4 раза больше доступных пикселей (ширина * высота).
*/
function checkColorDepth (dataset, width, height) {
var colorDepth
if (dataset.width && dataset.height) {
// Когда объект данных изображения был передан в качестве набора данных
colorDepth = dataset.data.length / (dataset.width * dataset.height)
} else {
// Когда в качестве набора данных был передан только массив
colorDepth = dataset.length / (width * height)
}
if (colorDepth !== 4) {
throw new Error('data and size of the image does now match')
}
}
/**
## Formatter
Внутренняя функция, используемая для форматирования пиксельных данных в объект данных изоб-ражения
### Параметры
- пиксельные данные "Uint8ClampedArray": пиксельное представление изображения
- ширина "Number": ширина изображения
- высота "Number": высота изображения
### Например
formatter(new Uint8ClampedArray[400], 10, 10)
// данные изображения { data: Uint8ClampedArray[400], width: 10, height: 10, }
*/
function formatter (pixelData, width, height) {
// Проверка размера совпадений данных
checkColorDepth(pixelData, width, height)
if (!(pixelData instanceof Uint8ClampedArray)) {
throw new Error('pixel data passed is not an Uint8ClampedArray')
}
// Если окно доступно данные изображения созданы с помощью API браузера,
// в противном случае вызов конструктора она
if (typeof window === 'object') {
return new window.ImageData(pixelData, width, height)
}
return new GrafiImageData(pixelData, width, height)
}
/**
## Метод оттенков серого
Оттенки серого цвета данного изображения.
Если опция не передана, по умолчанию используется {mode: 'luma', monochrome: false}
### Параметры
- данные изображения "Объект": объект данных изображения
- опция "Объект": опция объекта
- режим "Строка": grayscaling mode, 'luma', 'simple', or 'average'
- канал "Строка": цветной канал для использования в простом режиме, 'r', 'g', или 'b'
### Например
var input = { data: Uint8ClampedArray[400], width: 10, height: 10 }
// Оттенки серого на основе среднего значения цветов RGB
grafi.grayscale(input, {mode: 'average'})
// Оттенки серого путем повторения значения заданного цветового канала по всем каналам
grafi.grayscale(input, {mode: 'simple', channel: 'r'})
*/
function grayscale (imgData, option) {
// Контроль за вводными данными
checkColorDepth(imgData)
// Установка параметров проверки объекта и установка параметров по умолчанию, если это необхо-димо
option = option || {}
option.mode = option.mode || 'luma'
option.channel = option.channel || 'g'
// Различные методы оттенков серого
var mode = {
'luma': function (r, g, b) {
return 0.299 * r + 0.587 * g + 0.114 * b
},
'simple': function (r, g, b, a, c) {
var ref = {r: 0, g: 1, b: 2}
return arguments[ref[c]]
},
'average': function (r, g, b) {
return (r + g + b) / 3
}
}
var pixelSize = imgData.width * imgData.height
var newPixelData = new Uint8ClampedArray(pixelSize * 4)
var i, _grayscaled, _index
// Цикл по размеру пикселя, извлечение значений r, g, b и вычисление значения в градациях серого
for (i = 0; i < pixelSize; i++) {
_index = i * 4
_grayscaled = mode[option.mode](imgData.data[_index], imgData.data[_index + 1], imgData.data[_index + 2], imgData.data[_index + 3], option.channel)
newPixelData[_index] = _grayscaled
newPixelData[_index + 1] = _grayscaled
newPixelData[_index + 2] = _grayscaled
newPixelData[_index + 3] = imgData.data[_index + 3]
}
return formatter(newPixelData, imgData.width, imgData.height)
}
/**
## Метод псевдоцвета
TODO: поддержка различных псевдоцветных схем
### Параметры
- данные изображения "Объект": объект данных изображения
- опция "Объект": опция объекта
- оттенки серого "Boolean": входные данные изображения являются оттенками серого или нет
### Например
var input = { data: Uint8ClampedArray[400], width: 10, height: 10 }
// изображение в виде псевдоцвета
grafi.pseudocolor(input)
// если входное изображение уже в градациях серого, передайте флаг в градациях серого, чтобы обойти избыточную градацию серого
grafi.pseudocolor(input, {grayscaled: true})
*/
function pseudocolor (imgData, option) {
// контроль за ввод данных
checkColorDepth(imgData)
// Проверить параметры объекта и установить переменные по умолчанию
option = option || {}
option.grayscaled = option.grayscaled || false
var pixelSize = imgData.width * imgData.height
var grayscaledData = imgData.data
if (!option.grayscaled) {
grayscaledData = grayscale(imgData).data
}
var newPixelData = new Uint8ClampedArray(pixelSize * 4)
var redLookupTable = new Uint8ClampedArray(256)
var greenLookupTable = new Uint8ClampedArray(256)
var blueLookupTable = new Uint8ClampedArray(256)
redLookupTable.forEach(function (d, i) {
var n = 0
if (i > 128 && i < 192) {
n = (i - 128) * (256 / (192 - 128))
}
if (i >= 192) {
n = 255
}
redLookupTable[i] = n
})
greenLookupTable.forEach(function (d, i) {
var n = 255
if (i < 64) {
n = i * (256 / 64)
}
if (i >= 192) {
n = 255 - ((i - 191) * (256 / (256 - 192)))
}
greenLookupTable[i] = n
})
blueLookupTable.forEach(function (d, i) {
var n = 0
if (i > 64 && i < 128) {
n = 255 - ((i - 63) * (256 / (192 - 128)))
}
if (i < 65) {
n = 255
}
blueLookupTable[i] = n
})
var pixel, index
for (pixel = 0; pixel < pixelSize; pixel++) {
index = pixel * 4
newPixelData[index] = redLookupTable[grayscaledData[index]]
newPixelData[index + 1] = greenLookupTable[grayscaledData[index + 1]]
newPixelData[index + 2] = blueLookupTable[grayscaledData[index + 2]]
newPixelData[index + 3] = imgData.data[index + 3]
}
return formatter(newPixelData, imgData.width, imgData.height)
}
var grafi = {}
grafi.pseudocolor = pseudocolor
if (typeof module === 'object' && module.exports) {
module.exports = grafi
} else {
this.grafi = grafi
}
}())
