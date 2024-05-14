import { config } from "dotenv";
import GoogleStrategy from "passport-google-oauth20";
import Author from "../models/AuthorsModel.js";
import { generateJWT } from "./auth.js";

config();

//Opzioni che servono per configurare il servizio oauth di google
const options = {
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_CB
};
//Creazione istanza di google strategy
const googleStrategy = new GoogleStrategy(options, async(_accessToken, __refreshToken, profile, passportNext) => {
    try {
        //Destrutturazione dell'oggetto profile per prendere i dati che ci servono
        const {email, given_name, family_name, sub, picture} = profile._json;

        //Verifica utente è nel database
        const user = await Author.findOne({email});

        //Se l'utente esiste
        if (user) {
            //creo il token di accesso, createAccessToken si trova all'interno della libreria GoogleStrategy
            const accToken = await createAccessToken({
                _id: user._id
            })

            //Callback che accetta come primo parametro un errore e come secondo un payload
            //null = non è stato trovato nessun errore
            passportNext(null, { accToken });
        } else {
            //L'utente non esiste nel database, crea nuovo utente
            const newUser = new Author({
                name: given_name,
                LastName: family_name,
                email: email,
                avatar: picture,
                password: sub,
                googleId: sub
            });

            //Salvo utente
            await newUser.save();

            //Creo il token
            const accToken = await generateJWT({
                email: newUser.email
            });

            passportNext(null, { accToken });
        } 
    } catch (error) {
        passportNext(error);
    }
});

export default googleStrategy;