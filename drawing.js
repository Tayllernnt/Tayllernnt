// Código JavaScript para o desenho pixelado

const pixelGrid = document.getElementById('pixel-grid');
const colorPalette = document.getElementById('color-palette');
const brushToolButton = document.getElementById('brush-tool');
const eraserToolButton = document.getElementById('eraser-tool');
const bucketToolButton = document.getElementById('bucket-tool');
const pickerToolButton = document.getElementById('picker-tool');
const lineToolButton = document.getElementById('line-tool');
const rectangleToolButton = document.getElementById('rectangle-tool');
const circleToolButton = document.getElementById('circle-tool');
const saveButton = document.getElementById('save-button');
const exportLink = document.getElementById('export-link');
const brushSizeInput = document.getElementById('brush-size');
const showGridCheckbox = document.getElementById('show-grid');
const imageSizeSelect = document.getElementById('image-size');
const clearButton = document.getElementById('clear-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const colorPicker = document.getElementById('color-picker');
const imageUploadInput = document.getElementById('image-upload');
let currentColor = 'black'; // Cor padrão inicial
let isDrawing = false;
let currentTool = 'brush';
let brushSize = parseInt(brushSizeInput.value);
let gridSize = parseInt(imageSizeSelect.value);
let undoStack = [];
let redoStack = [];

// Função para criar um pixel no grid
function createPixel(color) {
    const pixel = document.createElement('div');
    pixel.classList.add('pixel');
    pixel.style.backgroundColor = color;
    pixel.addEventListener('mousedown', () => {
        isDrawing = true;
        draw(pixel);
    });
    pixel.addEventListener('mouseover', () => {
        if (isDrawing) {
            draw(pixel);
        }
    });
    pixel.addEventListener('mouseup', () => {
        isDrawing = false;
        undoStack.push(pixel.style.backgroundColor);
        redoStack = []; // Limpar a pilha de refazer quando uma nova ação é realizada
    });
    pixelGrid.appendChild(pixel);
}

// Criar pixels no grid
function createGrid() {
    pixelGrid.innerHTML = '';
    for (let i = 0; i < gridSize * gridSize; i++) {
        createPixel('white');
    }
}

// Função para desenhar
function draw(pixel) {
    if (currentTool === 'brush') {
        pixel.style.backgroundColor = currentColor;
    } else if (currentTool === 'eraser') {
        pixel.style.backgroundColor = 'white';
    }
}

// Adicionar evento de clique para selecionar a cor
colorPalette.addEventListener('click', (event) => {
    if (event.target.classList.contains('color')) {
        currentColor = event.target.style.backgroundColor;
        colorPicker.value = currentColor; // Atualizar o seletor de cor com a cor selecionada
    }
});

// Mudar a ferramenta de desenho
function setActiveTool(tool) {
    currentTool = tool;
}

brushToolButton.addEventListener('click', () => {
    setActiveTool('brush');
});

eraserToolButton.addEventListener('click', () => {
    setActiveTool('eraser');
});

bucketToolButton.addEventListener('click', () => {
    setActiveTool('bucket');
});

pickerToolButton.addEventListener('click', () => {
    setActiveTool('picker');
});

lineToolButton.addEventListener('click', () => {
    setActiveTool('line');
});

rectangleToolButton.addEventListener('click', () => {
    setActiveTool('rectangle');
});

circleToolButton.addEventListener('click', () => {
    setActiveTool('circle');
});

// Alterar o tamanho do pincel
brushSizeInput.addEventListener('input', () => {
    brushSize = parseInt(brushSizeInput.value);
});

// Mostrar ou ocultar a grade
showGridCheckbox.addEventListener('change', () => {
    if (showGridCheckbox.checked) {
        pixelGrid.style.border = '1px solid black';
    } else {
        pixelGrid.style.border = 'none';
    }
});

// Salvar o desenho
saveButton.addEventListener('click', () => {
    html2canvas(pixelGrid).then(canvas => {
        const image = canvas.toDataURL('image/png');
        exportLink.href = image;
        exportLink.click();
    });
});

// Carregar imagem e exibir no grid de pixels
imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                gridSize = parseInt(imageSizeSelect.value);
                createGridFromImage(image);
            };
        };
        reader.readAsDataURL(file);
    }
});

// Criar grid de pixels com base na imagem carregada
function createGridFromImage(image) {
    createGrid();
    const canvas = document.createElement('canvas');
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0, gridSize, gridSize);
    const imageData = ctx.getImageData(0, 0, gridSize, gridSize);
    const pixels = imageData.data;
    let index = 0;
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];
            const a = pixels[index + 3];
            const color = `rgba(${r}, ${g}, ${b}, ${a / 255})`;
            const pixel = pixelGrid.children[index];
            pixel.style.backgroundColor = color;
            index += 4;
        }
    }
}

// Alterar o tamanho da grade
imageSizeSelect.addEventListener('change', () => {
    gridSize = parseInt(imageSizeSelect.value);
    createGrid();
});

// Limpar o grid
clearButton.addEventListener('click', () => {
    undoStack = [];
    redoStack = [];
    createGrid();
});

// Desfazer a última ação
undoButton.addEventListener('click', () => {
    if (undoStack.length > 0) {
        const lastColor = undoStack.pop();
        redoStack.push(lastColor);
        const pixels = pixelGrid.children;
        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i].style.backgroundColor === lastColor) {
                pixels[i].style.backgroundColor = 'white';
            }
        }
    }
});

// Refazer a última ação desfeita
redoButton.addEventListener('click', () => {
    if (redoStack.length > 0) {
        const lastColor = redoStack.pop();
        undoStack.push(lastColor);
        const pixels = pixelGrid.children;
        for (let i = 0; i < pixels.length; i++) {
            if (pixels[i].style.backgroundColor === 'white') {
                pixels[i].style.backgroundColor = lastColor;
            }
        }
    }
});

// Sistema anti-bugs: Desativar seleção de texto e arrastar e soltar
pixelGrid.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

// Inicializar grid
createGrid();
// Correções para os bugs no código JavaScript

// Salvar o desenho
saveButton.addEventListener('click', () => {
    html2canvas(pixelGrid).then(canvas => {
        const image = canvas.toDataURL('image/png');
        exportLink.href = image;
        exportLink.click();
    });
});

// Função para desenhar
function draw(pixel) {
    if (isDrawing) {
        if (currentTool === 'brush') {
            pixel.style.backgroundColor = currentColor;
        } else if (currentTool === 'eraser') {
            pixel.style.backgroundColor = 'white';
        }
        undoStack.push(pixel); // Armazenar o pixel para desfazer
    }
}

// Sistema anti-bugs: Desativar seleção de texto
pixelGrid.addEventListener('mousedown', (event) => {
    event.preventDefault();
    isDrawing = true; // Permitir desenhar ao clicar no grid
});

pixelGrid.addEventListener('mouseup', () => {
    isDrawing = false; // Parar de desenhar ao soltar o clique do mouse
});

pixelGrid.addEventListener('mouseover', (event) => {
    if (isDrawing) {
        draw(event.target); // Desenhar ao mover o mouse sobre o grid
    }
});
