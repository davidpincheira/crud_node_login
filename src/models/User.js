const bcrypt = require('bcrypt');
const mongoose = require('mongoose')
const { Schema } = mongoose

//al crear una schema estamos creando como una especie de clase
const UserSchema = new Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}
})

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    const pass = await bcrypt.hash(password, salt)
    return pass
}

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema);
/* 
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}; */