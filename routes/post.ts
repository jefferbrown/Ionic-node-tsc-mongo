import { Request, Response, Router } from "express";
import FileSyste from "../classes/file-system";
import { FileUpload } from "../interfaces/file-upload";
import { verificarToken } from "../middlewares/autenticacion";
import { Post } from "../models/post.model";



const postRouters = Router();
const fileSystem = new FileSyste()

postRouters.get('/', async (req: any, res: Response) => {

    let pagina = Number(req.query.pagina) || 1;
    let skip = pagina - 1
    skip = skip * 10

    const posts = await Post.find().sort({ _id: -1 }).skip(skip).limit(10).populate('usuario', '-password').exec();

    res.json({
        ok: true,
        posts

    })
})

postRouters.post('/', verificarToken, (req: any, res: Response) => {

    const body = req.body;
    body.usuario = req.usuario._id;


    const imagenes = fileSystem.imgDeTempHaciaPost(req.usuario._id)
    body.img = imagenes

    Post.create(body).then(async postDB => {
        await postDB.populate('usuario', '-password').execPopulate();
        res.json({
            ok: true,
            post: postDB
        })
    }).catch(err => {
        res.json(err)
    })

})



//Servicios para subir archivos

postRouters.post('upload', [verificarToken], async (req: any, res: Response) => {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subio ningun archivo"
        })
    }

    const file = req.files.image as FileUpload;

    if (!file) {
        return res.status(400).json({
            ok: false,
            mensaje: "No se subio ningun archivo --image"
        })
    }


    if (!file.mimetype.includes('image')) {
        return res.status(400).json({
            ok: false,
            mensaje: "Lo que subio no es una imagen"
        })
    }


    await fileSystem.guardarImagenTemporal(file, req.usuario._id)

    res.json({
        ok: true,
        file
    })
})

postRouters.get('/imagen/:userid/:img', (req: any, res: Response) => {

    const userId = req.params.userId;
    const img = req.params.img

    const pathFoto = fileSystem.getUrlPhoto(userId, img)
})

export default postRouters;