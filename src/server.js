require("express-async-errors");

const insdata = require("./database/sqlite");

const AppError = require("./utils/AppError");

const { response } = require("express");

const express = require("express");

const routes= require("./routes")

const app = express();
app.use(express.json());

app.use(routes);

insdata()

//verificando se o error está do lado do cliente e devolve a resposta de acordo com error
app.use = ((error, request, response, next ) =>{
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }

    console.error()

    //verificando se error está do lado do servidor
    return response.status(500).json ({
            status: "error",
            message: error.message
    });
});

const port = 3000;
app.listen(port, () => console.log(`server is running on port ${port}`));