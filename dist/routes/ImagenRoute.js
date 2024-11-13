"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/ImagenRoute.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ImagenController_1 = require("../controllers/ImagenController");
// Configuración de multer con verificación de tipo de archivo
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'imagenes/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    // Verifica si el archivo es una imagen
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Acepta el archivo
    }
    else {
        cb(new Error('Solo se permiten archivos de imagen')); // Rechaza el archivo con un error
    }
};
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
});
// Crea la instancia de Router y define la ruta
const router = (0, express_1.Router)();
// Aplica el middleware de multer a la ruta específica
router.post('/subir', upload.single('image'), ImagenController_1.subirImagen);
exports.default = router;
