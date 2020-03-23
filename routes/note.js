const fs = require('fs');
const express = require('express');
const router = express.Router();

let savedNotes = [];
let x = 1;

router
   .route('/')
   .get((req,res) => {
       fs.readFile(`${__dirname}/db.json`, (err,data) => {
           if(err) throw err;
           savedNotes = JSON.parse(data);
           res.status(200).json(savedNotes)
    })
})
   
   .post((req,res) => {
    id = Array.from({length: savedNotes.length}, (k,v) => ++v).filter(el => savedNotes.map(e => e.id).indexOf(el) === -1)[0];
    if(!id)  {
        id = x;
        x++;
    }else x = savedNotes.length + 2;
   let newNote = Object.assign({id: id}, req.body);
       savedNotes.push(newNote);
   fs.writeFile(`${__dirname}/db.json`,JSON.stringify(savedNotes, null, 2) , err => {
       if(err) throw err;
   })
   res.status(201).json(savedNotes);
});

router.delete('/:id', (req,res) => {
    let noteId = req.params.id;
    if(isNaN(noteId) || !noteId || noteId < 1)
    return res.status(404).json({
        status: 'Fail',
        message: 'Invalid ID'
    });
    let note = savedNotes.findIndex(el => el.id == noteId);
    savedNotes.splice(note,1);
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