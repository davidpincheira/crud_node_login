const express = require('express')
const router = express.Router()
const Note = require('../models/Note')
const { isAuthenticated } = require('../helpers/auth')

router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-notes')
})

router.post('/notes/new-note', isAuthenticated, async(req, res)=>{
    const { title, description } = req.body
    const errors = []

    if(title === '' || description === ''){
        errors.push({text: 'please write title or description'})
        res.render('notes/new-notes', {
            errors,
            title,
            description
        })
    } else {
        const newNote = new Note({ 
            title: req.body.title, 
            description: req.body.description
        })
        await newNote.save()
        req.flash('success_msg', 'Note Added Succesfully')
        res.redirect('/notes')
    }
})

router.get('/notes', isAuthenticated, async(req, res)=>{
    await Note.find().sort({date: 'desc'})
      .then(items => {
        const contexto = {
            notes: items.map(note => {
                return {
                    _id: note._id,
                    title: note.title,
                    description: note.description
                }
            })
        }
        res.render('notes/all-notes', { notes: contexto.notes }) 
      })     
})

router.get('/notes/edit/:id', isAuthenticated, async(req, res)=>{
    const note = await Note.findById(req.params.id)
    .then(data =>{
        return {
            title: data.title,
            description: data.description,
            _id: data._id
        }
    })

    res.render('notes/edit-notes', {note})
})

router.put('/notes/edit-note/:id', isAuthenticated,  async(req, res) => {
    const { title, description } = req.body
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg', 'Note edited Succesfully')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', isAuthenticated, async(req, res) => {
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg', 'Note deleted Succesfully')
    res.redirect('/notes')
})

module.exports = router