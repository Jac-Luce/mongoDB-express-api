import jwt from "jsonwebtoken";
import Author from "../models/AuthorsModel.js";
import { config } from "dotenv";

config();

//Funzione che genera il JWT (Json Web Token)
export const generateJWT = (payload) => {

    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            {expiresIn: "1d"}, //Data di Scadenza del Token 1d/m/h/ms/y || 1 day/hour/minutes/millisecond/year (si può scrivere in entrambi i modi)
            //Funzione Callback che controlla se c'è un errore o se è stato generato il token
            (err, token) => {
                //Se c'è l'errore
                if (err) {
                    reject(err); //Rimanda l'errore
                } else {
                    //Se non c'è l'errore, rimanda il token generato
                    resolve(token);
                }
            }
        );
    });
};


//Funzione che verifica se il token JWT è valido
export const verifyJWT = (token) => {

    return new Promise((resolve, reject) => {
        //Verifica del token
        jwt.verify(
            token,
            process.env.JWT_SECRET,
            //Funzione Callback controlla se il token è valido lo decodifica, se è sbagliato genera un errore
            (err, decoded) => {
                //Se c'è errore
                if (err) {
                    reject(err);
                } else {
                    //Se non c'è l'errore, decodifica il token
                    resolve(decoded);
                }
            }
        );
    });
};


//Creazione del middleware che verrà utilizzato nelle richieste che hanno bisogno dell'autorizzazione per essere effettuate
export const authMiddleware = async (req, res, next) => {
    try {
        //Se non è stato fornito il token nell'header
        if (!req.headers.authorization) {
            //Effettua il login
            res.status(400).send("Effettua il login");
        } else {
            //Il token è stato fornito, verifichiamo che sia valido tramite la funzione verifyJWT e andiamo a togliere la stringa "Bearer " che precede il token
            const decoded = await verifyJWT(
                req.headers.authorization.replace("Bearer ", "")
            ); 

            //Verifichiamo che il token esiste con exp
            if (decoded.exp) {
                //Se esiste, eliminiamo dall'oggetto decoded issuedAt (iat) e expiredAt (exp)
                delete decoded.iat;
                delete decoded.exp;

                //Troviamo l'utente con i dati del payload
                const me = await Author.findOne({...decoded});

                //Se l'utente è stato trovato
                if (me) {
                    req.author = me;
                    next();
                } else {
                    //Utente non trovato
                    res.status(401).send("Utente non trovato");
                }
            } else {
                //Token non valido o scaduto
                res.status(401).send("Rieffettua il login");
            }
        }
        
    } catch (error) {
        next(error);
    }
};