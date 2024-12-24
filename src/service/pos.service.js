import fs from "node:fs"
import { v4 as uuidv4 } from "uuid";

class PostService {
    path;
    posts;

    constructor({path}) {
        this.path = path;
        if (fs.existsSync(path)) {
          try {
            this.posts = JSON.parse(fs.readFileSync(this.path, "utf-8"));
          } catch (error) {
            this.posts = [];
          }
        } else {
          this.users = [];
        };
    };

    async getAll() {
        return this.posts;
    };


    async getById({id}) {
        const posts = this.posts.find((post=> post.id === id));
        return posts;
    };

    async create({id, title, description, code, price, status, stock, category}) {
        const id = uuidv4();
        
        if (this.posts.some((post) => post.id === id)) {
            throw new Error("ya existe un post con ese id");
        };
        
        const post = {
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
        };
        
        this.posts.push(post);
        try {
            await this.saveOnFile();
            return post;
        } catch (error) {
            console.error("Error al crear el archivo", error);
        };
    };
    
    async update({id, title, description, code, price, status, stock, category}) {
        const post = this.posts.find((post) => post.id === id);

        if (!post) {
            return null;
        }
        
        post.title = title ?? post.title;
        post.description = description ?? post.description;
        post.code = code ?? post.code;
        post.price = price ?? post.price;
        post.status = status ?? post.status;
        post.stock = stock ?? post.stock;
        post.category = category ?? post.category;

        const index = this.posts.findIndex((post) => post.id === id);
        this.posts[index] = post;

        try {
            await this.saveOnFile();
            return post;
        } catch (error) {
            console.error("Error al actualizar el archivo", error);
        };
    }
     
    async saveOnFile() {    
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.posts));
        } catch (error) {
            console.error("Error al guardar el archivo", error);
        }
    }

}

export const postService = new PostService({path: "./db/posts.json"});
