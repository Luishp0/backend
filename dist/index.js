"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const database_1 = __importDefault(require("./config/database"));
const UsuarioRoutes_1 = __importDefault(require("./routes/UsuarioRoutes"));
const PecesRoutes_1 = __importDefault(require("./routes/PecesRoutes"));
const SensoresRoutes_1 = __importDefault(require("./routes/SensoresRoutes"));
const AparatosRoutes_1 = __importDefault(require("./routes/AparatosRoutes"));
const RespaldoRoutes_1 = __importDefault(require("./routes/RespaldoRoutes"));
const ImagenRoute_1 = __importDefault(require("./routes/ImagenRoute"));
// Verifica que la carpeta 'imagenes/' exista
const imageDir = 'imagenes/';
if (!fs_1.default.existsSync(imageDir)) {
    fs_1.default.mkdirSync(imageDir);
}
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)());
// Middlewares de análisis de cuerpo
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Rutas
app.use('/imagenes', express_1.default.static('imagenes'));
app.use('/imagen', ImagenRoute_1.default);
app.use('/usuario', UsuarioRoutes_1.default);
app.use('/peces', PecesRoutes_1.default);
app.use('/sensores', SensoresRoutes_1.default);
app.use('/aparatos', AparatosRoutes_1.default);
app.use('/respaldo', RespaldoRoutes_1.default);
// Middleware de manejo de errores de multer y otros errores
app.use((err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({ error: err.message });
    }
    else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
});
// Conectar a la base de datos y levantar el servidor
(0, database_1.default)()
    .then(() => {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
})
    .catch((error) => {
    console.error('Error al iniciar la aplicación:', error);
    process.exit(1);
});
