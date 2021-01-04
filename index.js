var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var passport = require("passport")
var LocalStratergy = require("passport-local")
var flash =  require("connect-flash")
const dotenv = require("dotenv")
const nodemailer = require("nodemailer")
dotenv.config()


var newSubscription = require("./models/subscription/newSubscription")

var middleware = require('./middleware/index')

var friendRoutes = require("./routes/friends")
var indexRoutes = require("./routes/index")
var postRoutes = require("./routes/posts")
var messageRoutes = require("./routes/messages")
var otpRoutes = require("./routes/otp")

app = express();
app.use(express.static("public"))
app.use('/uploads',express.static("uploads"))
app.set("view engine","ejs")
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json());
app.use(methodOverride("_method"));

mongoose.connect(process.env.DBURL ,  { useUnifiedTopology: true,useNewUrlParser : true,useFindAndModify : false })

var userSchema = require("./models/index/userSchema")
User = mongoose.model("User",userSchema)

var schema = require("./models/dummy/schema")
var MailedTo = mongoose.model("MailedTo",schema)

app.use(require("express-session")({
    resave : false, saveUninitialized : false , secret : "This is ryzit"
}))
 
app.use(flash());
app.use(function(req,res,next){
    res.locals.error = req.flash("error")
    res.locals.success = req.flash("success")
    next();
})

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStratergy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(friendRoutes)
app.use(indexRoutes)
app.use(postRoutes)
app.use(messageRoutes)
app.use(otpRoutes)


app.get("/dummyCredentials",(req,res) => {
    res.render("index/dummyCredentials", { title : "Dummy Credentials" })
} )

app.post("/dummyCredentials",async (req,res) => {
    try {
        var {enteredName,enteredEmail} = req.body
        var newUser = await MailedTo.create({ name : enteredName,  email : enteredEmail })
        const smtpTrans = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        })
        const mailOpts = {
            from: "RyZit",
            to: enteredEmail,
            subject: 'Dummy Credentials for RyZit',
            text: "Hi," + enteredName + "\n\n" + 
            "To proceed further with RyZit , you can use following credentials."
            + "\n\n" + 
            "Username - dummy\nPassword - dummy"
            + "\n\n" + 
            "Regards,\n" +
            "Team ,RyZit"
        }
        var response = await smtpTrans.sendMail(mailOpts)
        req.flash("success","Dummy Credentials has been sent to you! Please check your email")
        res.redirect("/")
    } catch (error) {
        console.log(error)
        req.flash("error","Cannot send you credentials right now")
        res.redirect("/")
    }
} )

app.post("/newSubscription",middleware.isLoggedIn,newSubscription)

app.get("/offline",(req,res) => {
    res.render("offline/offline")
} )

app.get("/*",(req,res)=>{
    res.render("404error")
})

var port = process.env.PORT || 4000

app.listen(port,function(){
    console.log("SERVER WORKING AT " + port )
})