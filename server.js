import express  from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import { authorRoute } from "./services/routes/AuthorRoute.js";
import cors from "cors";
import { blogPostRoute } from "./services/routes/BlogPostRoute.js";
import logger from "./services/middlewares/logger.js";
import { badRequest, genericError, notFound, unauthorized } from "./services/middlewares/errorHandlers.js";
import { authRoute } from "./services/routes/AuthenticationRoute.js";
import { authMiddleware } from "./services/authentication/auth.js";
import passport from "passport";
import googleStrategy from "./services/authentication/passport.js";

//Inizializziamo la gestione dei file .env
config();

//Crea una porta
const PORT = process.env.PORT || 3001;

//Crea il server
const app = express();

//Middleware di terze parti: Abilita la comunicazione con il FrontEnd
app.use(cors());

//Middleware di terze parti: Abilita la comunicazione con dati JSON
app.use(express.json());

//Utilizzo della google strategy
passport.use("google", googleStrategy);

//Middleware creato da me: Logger comunica le richieste http effettuate
app.use(logger);

//Per utilizzare un middleware solo su una route: app.use("/authors", logger, authorRoute);

//Middleware creato da me: Autenticazione per accedere agli endpoint
app.use(authMiddleware);

//Importa Routes
/* http://localhost:3001/auth */
app.use("/auth", authRoute);
 /* http://localhost:3001/authors */
app.use("/authors", authMiddleware, authorRoute);
 /* http://localhost:3001/blogPosts */
app.use("/blogPosts", authMiddleware, blogPostRoute);

//Route di default per pagina non trovata
app.get("*", function(req, res, next) {
    const error = new Error("404 Not Found!");
    error.status = 404;

    next(error);
});

//Middlewares creati da me: gestione errori, posizionati sempre sotto le rotte
app.use(badRequest);
app.use(unauthorized);
app.use(notFound);
app.use(genericError); //IMPORTANTE mettere sempre per ultimo quello dell'errore generico


const initServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Sei connesso al database.");

        //Abilita server
        app.listen(PORT, () => {
        console.log("Il nostro server sta ascoltando alla porta " + PORT);
        });
    } catch (error) {
        console.error("Connessione al database fallita!", error);
    }
};

initServer();