const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');
const path = require('path');

const BG_PATH = path.join(__dirname, '../assets/bg');
const FONT_PATH = path.join(__dirname, '../assets/fonts');
const OUTPUT_PATH = path.join(__dirname, '../output');

if (!fs.existsSync(FONT_PATH)) {
    console.error("❌ ERRO: Pasta 'assets/fonts' não encontrada.");
    process.exit(1);
}

const fontFiles = fs.readdirSync(FONT_PATH).filter(file => file.endsWith('.ttf') || file.endsWith('.otf'));

if (fontFiles.length === 0) {
    console.error("❌ ERRO: Nenhuma fonte encontrada na pasta 'assets/fonts'.");
    process.exit(1);
}

fontFiles.forEach(fontFile => {
    const fontName = path.basename(fontFile, path.extname(fontFile));
    registerFont(path.join(FONT_PATH, fontFile), { family: fontName });
    console.log(`✅ Fonte registrada: ${fontName}`);
});

function getRandomBackground() {
    if (!fs.existsSync(BG_PATH)) {
        console.error("❌ ERRO: Pasta 'assets/bg/' não encontrada. Certifique-se de criar e adicionar imagens.");
        process.exit(1);
    }

    const files = fs.readdirSync(BG_PATH);
    if (files.length === 0) throw new Error("Nenhuma imagem de fundo encontrada.");
    return path.join(BG_PATH, files[Math.floor(Math.random() * files.length)]);
}


async function generateSlide(slideData) {
    const WIDTH = 1080, HEIGHT = 1080;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    try {
        const bgImagePath = getRandomBackground();
        
        try {
            const imageBuffer = fs.readFileSync(bgImagePath);
            const bgImage = await loadImage(imageBuffer);
            ctx.drawImage(bgImage, 0, 0, WIDTH, HEIGHT);
        } catch (error) {
            console.error(`❌ ERRO ao carregar imagem: ${bgImagePath}`);
            console.error(error);
            process.exit(1);
        }

        slideData.components.forEach((component, index) => {
            if (component.type === 'Text') {
                const fontName = component.font || 'Roboto';
                const color = component.color || 'white'; 
                const align = component.align || 'center';
                const baseline = component.baseline || 'middle';
                const fontSize = component.fontSize || '50px';

                ctx.font = `${fontSize} ${fontName}`;
                ctx.fillStyle = color;
                ctx.textAlign = align;
                ctx.textBaseline = baseline;

                ctx.fillText(component.details, WIDTH / 2, 200 + index * 100);
            }
        });

        const timestamp = Date.now();
        const fileName = `slide_${slideData.slide_number}_${timestamp}.png`;
        const filePath = path.join(OUTPUT_PATH, fileName);

        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(filePath, buffer);

        console.log(`✅ Slide ${slideData.slide_number} gerado: ${fileName}`);
        return filePath;
    } catch (error) {
        console.error(`❌ Erro ao gerar slide: ${error.message}`);
        throw error;
    }
}

module.exports = generateSlide;