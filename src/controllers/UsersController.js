//Gerando ciptografia
const  {hash, compare} = require("bcryptjs")
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
        const {name, email, password, old_password} = request.body;
        const {id} = request.params;

        const database = await sqliteConnection();

        const user  = await database.get("SELECT * FROM users WHERE id = (?)", [id]);

        //Se usúario não existir
        if(!user){
            throw new AppError("Usúario não encontrado")
        }

        //Verificar se a pessoa está tentando mudar o email pra um que já exista
        const userWidthUpdateEmail  = await database.get("SELECT * FROM users WHERE email = (?)", [email]);
        if(userWidthUpdateEmail && userWidthUpdateEmail.id !== user.id){
            throw new AppError("Este e-mail já está em uso");
        }

        user.name = name ?? user.name;
        user.email = email ?? user.name;

        //Atualizando senha 
        if(password && !old_password){
            throw new AppError("Você precisa informar a senha antiga para definir a nva senha")
        }

        if(password && old_password){
        const checkOutPassword = await compare(old_password, user.password);
        

        if(!checkOutPassword){
            throw new AppError("A senha antiga não confere")
        }

        user.password = await hash(password, 8)
    }

        await database.run(`
        UPDATE users SET
        name = ?, 
        email = ?,
        password = ?,
        updated_at = DATETIME( 'now' )
        WHERE id = ?`, 
        [user.name, user.email,user.password, id]
        );
        return response.status(200).json();
    }

}
    


module.exports = UsersController;