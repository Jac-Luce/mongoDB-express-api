import { Schema, model } from "mongoose";

const blogPostSchema = new Schema(
    {
        category: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        cover: {
            type: String,
            required: false
        },

        readTime: {
            value: {
                type: Number,
                required: true
            },
            unit: {
                type: String,
                required: true
            }
        },

        author: {
            /*type: String,
            required: true*/
            type: Schema.Types.ObjectId,
            ref: "Author"
        },

        content: {
            type: String,
            required: true
        },

        comments: [{
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }],
    },

    {
        collection: "blogPost",
        timestamps: true //Questo comando mette in automatico la data in cui è stato creato e/o modificato il blogPost
    }
);

export default model("BlogPost", blogPostSchema);