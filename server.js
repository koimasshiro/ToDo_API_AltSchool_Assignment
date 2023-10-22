const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
const PORT = 8000;
const main = require('./Router/main.Route')
mongoose.connect(
    `mongodb+srv://eseimhariagbe:admin@bloggingapi.fkdmsin.mongodb.net/blog?retryWrites=true&w=majority`, {
    useNewUrlParser: true
}
);

app.use('/',main)
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`)
});