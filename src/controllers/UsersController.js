//Gerando ciptografia
const  {hash} = require("bcryptjs")
const AppError = require("../utils/AppError");

const sqliteConnection = require("../database/sqlite");
const userRoutes = require("../routes/users.routes");

     //Seleciona e Cadastra usúario
    class UsersController {
    async create(request, response) {
         const {name, email, password} = request.body;

        
        // Conectando com o bacco de dados
         const database = await sqliteConnection();

         //Vendo se não tem outro email igual
         const checkUsersExist = await database.get("SELECT * FROM users WHERE email = (?)", [email])
         
         if(checkUsersExist) {
            throw new AppError("Este e-mail já está em uso.")
         }
         /**/ 

         //Gerando cpitografia
         const hashPassword  = await hash(password, 8);

         await database.run(
           "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
           [name, email, hashPassword]
         )
         return response.status(201).json()
    }
       
    //Atualizando usúario
    async update(request, response){
        const {name, email} = request.body;
        const {id} = request.params;

        const database = await sqliteConnection();

        const user  = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        //Se usúario não existir
        if(!user){
            throw new AppError("Usúario não encontrado")
        }

        //Verificar se a pessoa está tentando mudar o email pra um que já exista
        const userWidthUpdateEmail  = await database.get("SELECT * FROM users WHERE id = (?)", [email]);
        if(userWidthUpdateEmail && userWidthUpdateEmail.id !== user.id){
            throw new AppError("Este e-mail já está em uso");
        }

        user.name = name;
        user.email = email;

        await database.run(`
        UPDATE users SET
        name = ?, 
        email = ?,
        updated_at = ?
        WHERE id = ?
        `, 
        [user.name, user.email, new Date(), id]
        );
        return response.json();
    }

}
    


module.exports = UsersController;