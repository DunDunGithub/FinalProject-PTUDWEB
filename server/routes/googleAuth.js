const passport = require('passport')
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
require('dotenv').config()
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const router = require('express').Router()
const accountDataController = require('../controllers/getAccountDataController')
require('dotenv').config()
const hostname = process.env.HOSTNAME


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL:  hostname + "/auth/google/callback",
    passReqToCallback : true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {

    
    

    // const existUser = await pool.query("SELECT * FROM USER_TABLE WHERE password = $1", [
    //     profile.id,
    // ]);
    const existUser = await accountDataController.getAnGoogleAccount(profile.email,profile.id)

    if (existUser.length != 0) {
        return done(null,existUser[0])
    }
    
    
    const name = profile.displayName

    const newUser = await accountDataController.createAnGoogleAccount(name,profile.id,profile.email)

    return done(null, newUser);
    } catch (error) {
        console.log(error.message + ' at googleAuth.js')
    }
  }
));

passport.serializeUser((user,done)=>{
    try {
        done(null,user.googleID)
    } catch (error) {
        console.log(error.message + ' at serializeUser')
    }
    
})

passport.deserializeUser((id,done)=>{
    accountDataController.getAnGoogleAccount(null,id)
    .then(user => {
        done(null,user)
    })
})

router.get('/',passport.authenticate('google',{scope : ['email','profile']}))

router.get('/callback',
    passport.authenticate('google',{
        successRedirect : '/',
        failureRedirect : ''    //TODO FAIL GOOGLE LOGIN
    })
)


//TODO FIX LOGOUT
router.get('/logout',(req,res) =>{
    try {
        //console.log(req.session)
        //req.logout((error) => console.log(error))
        req.session.destroy((error) =>{ if(error !== undefined)console.log()})
        res.json(true)
    } catch (error) {
        console.log(error.message + ' at logout')
    }
    
})






module.exports = router