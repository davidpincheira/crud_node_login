const mongoose = require('mongoose')
const { Schema } = mongoose

//al crear una schema estamos creando como una especie de clase
const NoteSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: Date, default: Date.now}
})

module.exports = mongoose.model('Note', NoteSchema);