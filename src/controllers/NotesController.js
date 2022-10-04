const nodemon = require("nodemon");
const knex = require("../database/knex");

class NotesController {

    //Cadrastrando rota 
    async create (request, response){
        const {title, description, tags, links} = request.body;

        const { user_id} = request.params;

        const note_id = await knex("notes").insert({
            title, 
            description, 
            user_id
        });

        const linksInsert = links.map(link =>{
            return{
                note_id,
                url: links
            }
        });
        await knex("links").insert(linksInsert)

        const tagsInsert = tags.map(name =>{
            return{
                note_id,
                name, 
                user_id
            }
        });
        await knex("tags").insert(tagsInsert)

        response.json();
    }

    //Exibindo rota
    async show(request, response){
        const {id} = request.params;

        const note = await knex("notes").where({id}).first();
        const tags = await knex("tags").where({note_id: id}).orderBy("name");
        const links = await knex("links").where({note_id:id}).orderBy("created_at");


        return response.json({
            note, 
            tags, 
            links
        });
    }

    //Deletando nota

    async delete(request, response){
        const {id} = request.params;
        
        await knex("notes").where({id}).delete();
        return response.json();
    }

    //Listando rota

    async index(request, response){
        const {title, user_id, tags} = request.query;
        let notes;

        //Filtrando tag
        if(tags) {
            const filterTags = tags.split(','.map(tag => tag.trim()));
        
            notes = await knex("tags")

            .select([

                "notes.id",
                "notes.title",
               " notes.user.id",
            ])
        .where("notes_user_id", user_id)                     //InnerJoin
        .whereLike("notes.title",`%${title}%`)
        .whereIn("name", filterTags)
        .innerJoin("notes", "notes.id", "tags.note_id")
        .orderBy("notes.title")

            .whereIn("name", filterTags)
        }else{
         notes = await knex("notes")
        .where({user_id})
        .where("title", `%${title}%`) //Consulta por conteúdo do tipo title
        .orderBy("title");
        }

        //Obtendo tags da nota

        const userTags = await knex("tags").where({user_id});
        const notesWidthTags = notes.map(note => {
            const notesTags = userTags.filter(tag => tag.note_id === note_id);
            return{
                ...note,
                tags: notesTags
            }
                })

        return response.json(notesWidthTags)




    }
}
module.exports = NotesController

