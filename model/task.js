const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    user:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    done:{
        type:Boolean,
        default:false
    }
})

module.exports = mongoose.model('task', taskSchema)