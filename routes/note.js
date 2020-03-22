const fs = require('fs');
const express = require('express');
const router = express.Router();

let savedNotes = [];
let id = 1;

router
   .route('/')
   .get((req,res) => {
       fs.readFile(`${__dirname}/db.json`, (err,data) => {
           if(err) throw err;
           savedNotes = JSON.parse(data);
       });
       res.status(200).sendFile(`${__dirname}/db.json`);
    })
   .post((req,res) => {
   let newNote = Object.assign({id: id}, req.body)
       savedNotes.push(newNote)
   fs.writeFile(`${__dirname}/db.json`,JSON.stringify(savedNotes, null, 2) , err => {
       if(err) throw err;
   })
   res.status(201).json(savedNotes)
   return id++;
});

router.delete('/:id', (req,res) => {
    let noteId = req.params.id;
    if(isNaN(noteId) || !noteId)
    return res.status(404).json({
        status: 'Fail',
        message: 'Invalid ID'
    });
    let note = savedNotes.findIndex(el => el.id == noteId);
    savedNotes.splice(note,1);
    id = 1;
    savedNotes.map(el =>{
        el.id = id ;
        id++;
        return el;
    } )
    fs.writeFile(`${__dirname}/db.json`, JSON.stringify(savedNotes, null, 2) , err => {
        if(err) throw err;
        res.sendFile(`${__dirname}/db.json`)
    });
      res.status(204)
         .json({
          status: 'success',
          data: null
         });
})

module.exports = router;