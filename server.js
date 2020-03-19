const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

let savedNotes = [];
let id = 1;

app.get('/', (req,res) => res.sendFile(`${__dirname}/public/index.html`));

app.get('/notes', (req,res) => res.sendFile(`${__dirname}/public/notes.html`));

app
   .route('/api/notes')
   .get((req,res) => res.status(200).sendFile(`${__dirname}/database/db.json`))
   .post((req,res) => {
   let newNote = Object.assign({id: id}, req.body)
       savedNotes.push(newNote)
   fs.writeFile('./database/db.json',JSON.stringify(savedNotes, null, 2) , err => {
       if(err) throw err;
   })
   res.status(201).json(savedNotes)
   return id++;
});

app.delete('/api/notes/:id', (req,res) => {
    let noteId = req.params.id;
    if(isNaN(noteId) || !noteId)
    return res.status(404).json({
        status: 'Fail',
        message: 'Invalid ID'
    });
    let note = savedNotes.findIndex(el => el.id == noteId);
    savedNotes.splice(note,1);
    fs.writeFile(`${__dirname}/database/db.json`, JSON.stringify(savedNotes, null, 2) , err => {
        if(err) throw err;
        res.sendFile(`${__dirname}/database/db.json`)
    });
      res.status(204)
       .json({
        status: 'success',
        data: null
       });
})

app.listen(port, () => console.log(`now listening on port ${port}...`))