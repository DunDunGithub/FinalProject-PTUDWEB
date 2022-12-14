const accountDataController = require('../controllers/getAccountDataController')
const bcrypt = require("bcrypt");
const router = require("express").Router();
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require('../middlewares/authorization')
require('dotenv').config()


// ! NOT FIX

// - REGISTER ONLY FOR ADMIN
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const user = await accountDataController.getAnAdminAccountByEmail(email)
  
    
    if(user.length > 0){
        return res.status(401).render('registerAdmin',{error : "User is already existed!"});
    }

    // Bcrypt the password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    
    const newUser = await accountDataController.createAnAdminAccount(name,bcryptPassword,email)


    const token = jwtGenerator.jwtGenerator(newUser.maquantri)
    req.session.token = token
    res.redirect('/admin')


  } catch (error) {
    console.error(error.message);
    res.status(500).render('notfound404',"Server error");
  }
});

// - LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await accountDataController.getAnAdminAccountByEmail(email)


    if(user.length === 0){
      return res.status(401).render('loginAdmin',{error : "User is not exist"});  
    }
    

    const validPassword = await bcrypt.compare(
      password,
      user[0].matkhau
    );

    if (!validPassword) {
      
      return res.status(401).render('loginAdmin',{error: "The password is wrong"});
    }
    const token = jwtGenerator.jwtGenerator(user[0].maquantri);
    
    req.session.token = token

    res.redirect('/admin')

  } catch (err) {
    console.error(err.message);
    res.status(500).render('notfound404',"Server error");
  }
});


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/admin/login')
})






module.exports = router;