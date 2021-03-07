import { FileUpload } from "../interfaces/file-upload";
import path from 'path';
import fs from 'fs';
import uniqid from 'uniqid';


export default class FileSyste {

    constructor() {

    }

    guardarImagenTemporal(file: FileUpload, userId: string) {

        return new Promise<void>((resolve, reject) => {

            //crear carpetas
            const path = this.crearCarpetaUsuario(userId);
            //nombre del archivo
            const nombreArchivo = this.generarNombreUnico(file.name)

            //Mover el archivo del temo a nuestra carpeta
            file.mv(`${path}/${nombreArchivo}`, (err: any) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

    }

    private generarNombreUnico(nombreOriginal: string) {
        const nombreArr = nombreOriginal.split('.');
        const extension = nombreArr[nombreArr.length - 1]

        const idUnico = uniqid();

        return `${idUnico}.${extension}`
    }

    private crearCarpetaUsuario(userId: string) {
        const pathUser = path.resolve(__dirname, '../uploads', userId);
        const pathUserTemp = pathUser + '/temp';

        const existe = fs.existsSync(pathUser);
        if (!existe) {
            fs.mkdirSync(pathUser)
            fs.mkdirSync(pathUserTemp)
        }
        return pathUserTemp
    }


    imgDeTempHaciaPost(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        const pathPost = path.resolve(__dirname, '../uploads', userId, 'posts');

        if (!fs.existsSync(pathTemp)) {
            return [];
        }
        if (!fs.existsSync(pathPost)) {
            fs.mkdirSync(pathPost);
        }
        const imaganesTemp = this.obtenerImagenesEnTemp(userId);

        imaganesTemp.forEach(imagen => {
            fs.renameSync(`${pathTemp}/${imagen}`, `${pathPost}/${imagen}`)
        })
        return imaganesTemp;
    }

    private obtenerImagenesEnTemp(userId: string) {
        const pathTemp = path.resolve(__dirname, '../uploads', userId, 'temp');
        return fs.readFileSync(pathTemp) || [];
    }

    getUrlPhoto(userId: string, img: string) {
        const pathFoto = path.resolve(__dirname, '../uploads', userId, 'posts', img);

        const existe = fs.existsSync(pathFoto);
        if (!existe) {
            return path.resolve(__dirname, '../asssets/400x250.jpg')
        }
    }
}