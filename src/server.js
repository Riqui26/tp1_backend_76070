import { postService } from "./service/pos.service";
import express from "express";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/posts", async (req, res) => {
    const posts = await postService.getAll();
    res.json(posts);

    res.status(200).json(posts);
});

app.get("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    const regex = new RegExp("^[0-9]+$");

    const post = await postService.getById({id});

    if (!post) {
        res.status(404).json({error: "Post no encontrado"});
    } else {
        res.status(200).json(post);
    }
});

app.post("/api/posts", async (req, res) => {
    const { title, description, code, price, status, stock, category } = req.body;
    
    try {
        const post = await postService.create({title, description, code, price, status, stock, category});
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
    } 
});

app.put("/api/posts/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, status, stock, category } = req.body;

    try {
        const post = await postService.update({id, title, description, code, price, status, stock, category});
        if (!post) {
            res.status(404).json({error: "Post no encontrado"});
        } else {
            res.status(200).json(post);
        }    
    } catch (error) {
        res.status(500).json({message: "Error interno del servidor"});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost: ${PORT}`);
});
