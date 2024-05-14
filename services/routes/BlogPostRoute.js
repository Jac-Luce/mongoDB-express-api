import { Router } from "express";
import BlogPost from "../models/BlogPostModel.js";
import cloudinaryMiddleware from "../middlewares/multerCover.js";
import Comment from "../models/CommentModel.js";

export const blogPostRoute = Router();

//GET per paginazione
blogPostRoute.get("/", async(req, res, next) => {
    try {
        const page = req.query.page || 1;

        let blogPostList = await BlogPost.find().limit(10).skip(10 * ( page - 1));
        res.send(blogPostList);
    } catch (error) {
        next(error);
    } 
});

//GET riceve la lista dei blogPost
blogPostRoute.get("/", async(req, res, next) => {
    try {
        let blogPostList = await BlogPost.find();
        res.send(blogPostList);
    } catch (error) {
        next(error);
    } 
});

//GET riceve uno specifico blogPost tramite id
blogPostRoute.get("/:id", async(req, res, next) => {
    try {
        let blogPost = await BlogPost.findById(req.params.id);
        res.send(blogPost);
    } catch (error) {
        next(error);
    }
});

//PUT modifica blogPost con specifico id
blogPostRoute.put("/:id", async(req, res, next) => {
    try {
        let blogPost = await BlogPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.send(blogPost);
    } catch (error) {
        next(error);
    }
});

//DELETE cancellazione blogPost con specifico id
blogPostRoute.delete("/:id", async(req, res, next) => {
    try {
        await BlogPost.deleteOne({
            _id: req.params.id,
        });
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

//POST creazione di un nuovo blogPost
blogPostRoute.post("/", async(req, res, next) => {
    try {
        let blogPost = await BlogPost.create({...req.body, author: req.author._id});
        res.send(blogPost).status(400);
    } catch (error) {
        next(error);
    }
});

//PATCH modifica di un blogPost già esistente
blogPostRoute.patch("/:id/cover", cloudinaryMiddleware, async(req, res, next) => {
    try {
        let blogPost = await BlogPost.findByIdAndUpdate(
            req.params.id,
            {cover: req.file.path},
            {new: true}
        );
        res.send(blogPost);
    } catch (error) {
        next(error);
    }
});

//GET riceve la lista di tutti i commenti di uno specifico blogPost
blogPostRoute.get("/:id/comments", async(req, res, next) => {
    try {
        let blogPost = await BlogPost.findById(req.params.id);
        let comments = blogPost.comments;
        res.send(comments);
    } catch (error) {
        next(error);
    }
});

//GET riceve uno specifico commento di uno specifico blogPost
blogPostRoute.get("/:id/comments/:commentId", async(req, res, next) => {
    try {
        let comment = await Comment.findById(req.params.commentId).populate({
            path: "author",
            select: ["name", "LastName", "avatar"]
        });
        res.send(comment);
    } catch (error) {
        next(error);
    }
});

//PUT modifica uno specifico commento di uno specifico blogPost
blogPostRoute.put("/:id/comments/:commentId", async(req, res, next) => {
    try {
        let comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, {new: true});
        res.send(comment);
    } catch (error) {
        next(error);
    }
});

//DELETE elimina uno specifico commento di uno specifico blogPost
blogPostRoute.delete("/:id/comments/:commentId", async(req, res, next) => {
    try {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
});

//POST aggiungi un nuovo commento ad uno specifico blogPost
blogPostRoute.post("/:id/comments", async(req, res, next) => {
    try {
        let comment = new Comment({...req.body, author: req.author._id});
        comment.save();

        await BlogPost.findByIdAndUpdate(req.params.id, {
            $push: {
                comments: comment.commentId
            }
        });
        res.send(comment);
    } catch (error) {
        next(error);
    }
});