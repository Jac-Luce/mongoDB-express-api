import { Schema, model } from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },

        author: {
            type: Schema.Types.ObjectId,
            ref: "Author"
        }
    },
    {
        collection: "comments"
    }
);

export default model("Comment", commentSchema);