var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var methodOverride = require("method-override")
var passport = require("passport")
var LocalStratergy = require("passport-local")
var flash =  require("connect-flash")

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
app.use(methodOverride("_method"));

mongoose.connect("mongodb://localhost:27017/ryzit" ,  { useUnifiedTopology: true,useNewUrlParser : true })

var userSchema = require("./models/index/userSchema")
User = mongoose.model("User",userSchema)

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

app.get("/*",(req,res)=>{
    res.render("404error")
})


app.listen(process.env.PORT || 3000,function(){
    console.log("SERVER WORKING AT 3000")
})