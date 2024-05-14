import { Schema, model } from "mongoose";

const authorSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },

        LastName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        dateOfBirth: {
            type: String,
            required: false
        },

        avatar: {
            type: String,
            required: false
        },

        password: {
            type: String,
            required: true
        },

        googleId: {
            type: String,
            required: false
        }
    },

    {
        collection: "authors",
        timestamps: true
    }
);


//Esporto modello chiamato "Author" che rispecchia lo schema authorSchema
export default model("Author", authorSchema);