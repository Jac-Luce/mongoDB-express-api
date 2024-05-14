import { Router } from "express";
import Author from "../models/AuthorsModel.js"
import BlogPost from "../models/BlogPostModel.js";
import cloudinaryMiddleware from "../middlewares/multerAvatar.js";

export const authorRoute = Router();

//GET per paginazione
authorRoute.get("/", async(req, res, next) => {
    try {
        const page = req.query.page || 1;

        let authorsList = await Author.find().limit(10).skip(10 * ( page - 1));
        res.send(authorsList);
    } catch (error) {
        next(error);
    } 
});

//GET riceve lista degli autori
authorRoute.get("/", async(req, res, next) => {
    try {
        let authorsList = await Author.find();
        res.send(authorsList);
    } catch (error) {
        next(error);
    } 
});

//GET riceve uno specifico autore tramite id
authorRoute.get("/:id", async(req, res, next) => {
    try {
        let author = await Author.findById(req.params.id);
        res.send(author);
    } catch (error) {
        next(error);
    }
});

//GET riceve tutti i blog di uno specifico autore
authorRoute.get("/:id/blogPosts", async (req, res, next) => {
    try {
        let author = await BlogPost.find({
            author: req.params.id
        }).populate({
            path: "author",
            select: ["name", "LastName", "avatar"]
        });
        res.send(author);
    } catch (error) {
        next(error);
    }
});

//PUT modifica dati autore
authorRoute.put("/:id", async(req, res, next) => {
    try {
        let author = await Author.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.send(author);
    } catch (error) {
        next(error);
    }
});

//DELETE elimina un autore
authorRoute.delete("/:id", async(req, res, next) => {
    try {
        await Author.deleteOne({
            _id: req.params.id,
        });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

/*
//POST aggiunta di un nuovo autore
authorRoute.post("/", async(req, res, next) => {
    try {
        let author = await Author.create(req.body);
        res.send(author).status(400);
    } catch (error) {
        next(error);
    }
});
*/

//PATCH modifica di un autore già esistente
authorRoute.patch("/:id/avatar", cloudinaryMiddleware, async(req, res, next) => {
    try {
        let author = await Author.findByIdAndUpdate(
            req.params.id,
            {avatar: req.file.path},
            {new: true}
        );
        res.send(author);
    } catch (error) {
        next(error);
    }
});