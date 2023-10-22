const task = require('../model/task');

const router = require('express').Router();

router.get('/login', (req,res,next)=>{
 res.render('login')
})


router.get('/create', (req,res,next)=>{
 res.render('create')
})


router.post('/create',async (req,res,next)=>{
    const {body} = req.body;
    if(!body){
        return res.send('Not a valid Body')
    }
    await task.create({
        body,
        user:'a',
        done:false
    })
    res.redirect('/home')
})


router.get('/read/:id',async (req,res,next)=>{
try {
    const t = await task.findOne({_id:req.params.id});
    data.done = false
    await data.save();
    res.redirect('/home')
} catch (error) {
    res.send('Crazy things are happening!!')
}
})


router.get('/home',async (req,res,next)=>{
    try {
        const tasks = await task.find({user:'a'});
        res.render('home', {tasks})
    } catch (error) {
        res.send('Crazy things are happening!!')
    }
    })
module.exports = router;