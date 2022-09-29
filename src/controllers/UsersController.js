const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");

     //Seleciona e Cadastra usúario
    class UsersController {
    async create(request, response) {
         const {name, email, password} = request.body;

         const dataBase = await sqliteConnection();
         const checkUsersExist = await dataBase.get("SELECT * FROM users WHERE email = (?)", [email])
         
         if(checkUsersExist) {
            throw new AppError("Este e-mail já está em uso")
         }

         await dataBase.run(
           "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
           [name, email, password]
         )
         return response.status(201).json()
    }
        
}
    


module.exports = UsersController;