const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const noteRouter = require('./routes/note');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use('/api/notes', noteRouter);

app.get('/notes', (req,res) => res.sendFile(`${__dirname}/public/notes.html`));
app.get('*', (req,res) => res.sendFile(`${__dirname}/public/index.html`));

app.listen(port, () => console.log(`now listening on port ${port}...`))
