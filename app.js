var express = require('express')  
var app = express() 
var path=require('path');
const { initializeApp, cert } = require('firebase-admin/app');
const {getFirestore} = require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount)
});
const db =getFirestore();
const session=require('express-session');
var passwordHash = require('password-hash');
var bodyParser=require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret : 'secret',
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated || false;
    next();
});

app.use('/public', express.static('public'));
app.set("view engine","ejs");
app.set('views',path.join(__dirname,'views'));

app.get('/', function (req, res) { 
    res.sendFile(__dirname+"/public"+"/template.html")
})
app.get('/signup', function (req, res) { 
    let pagetitle="signup"; 
    res.render('signup',{title : pagetitle,message : null});  
})

app.post('/signupSubmit',function (req, res) {  
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;
        db.collection("UserInfo")
            .where('Email', '==', email)
            .get()
            .then((docs) => {
                if (docs.size > 0) {
                    res.render('signup',{title : "signup", message : "A user already exists with the given email"});    
                } else {
                    db.collection("UserInfo").add({
                        Name:name,
                        Email:email,
                        Password:passwordHash.generate(password),
                    }).then(()=>{
                        res.redirect('/login');
                    })
                }
            });
    });
app.get('/login', function (req, res) {  
    let pagetitle="login"; 
    res.render('login',{title : pagetitle});
})

app.post('/loginsubmit', function (req, res) {  
    const email=req.body.email;
    const password=req.body.password;
    db.collection("UserInfo")
    .where('Email','==',email)
    .get()
    .then((docs) => {
        let password_verification=false;
        docs.forEach(doc=>{
            password_verification=passwordHash.verify(password, doc.data().Password);
        })
        if(password_verification){
            req.session.isAuthenticated = true;
            res.redirect('/dashboard');
        }
        else{
            res.send('Please check login credentials');
        }
    })
})

app.get('/dashboard', function (req, res) { 
    let pagetitle="novelworld";
    res.render('dashboard',{title : pagetitle});
})
app.get('/logout',function (req,res){
    res.sendFile(__dirname+"/public"+"/template.html");
})
app.listen(8080, function () {  
console.log('app listening on port 8080!')  
})