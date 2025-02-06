require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

if (!process.env.DO_SPACES_ENDPOINT || !process.env.DO_SPACE_KEY || !process.env.DO_SPACE_SECRET || !process.env.DO_BUCKET_NAME) {
    throw new Error("❌ ERRO: Variáveis de ambiente do DigitalOcean Spaces não configuradas corretamente.");
}

const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.DO_SPACE_KEY,
    secretAccessKey: process.env.DO_SPACE_SECRET,
    region: process.env.DO_REGION,
});

const BUCKET_NAME = process.env.DO_BUCKET_NAME;

async function uploadImage(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        const fileName = path.basename(filePath);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `slides/${fileName}`,
            Body: fileContent,
            ACL: 'public-read', // Deixa a imagem acessível publicamente
            ContentType: 'image/png',
        };

        const result = await s3.upload(uploadParams).promise();
        console.log(`✅ Upload concluído: ${result.Location}`);
        return result.Location;
    } catch (error) {
        console.error(`❌ Erro ao enviar imagem para DigitalOcean: ${error.message}`);
        throw error;
    }
}

module.exports = uploadImage;