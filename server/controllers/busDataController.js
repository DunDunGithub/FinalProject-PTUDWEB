const dataController = require('./getDataController')
const accountDataController = require('./getAccountDataController')

const renderBus = async(req, res) => {
    try {

        const query = req.query
        let page = req.query.page || 1
        if(page == 0){
            page = 1
        } 

        const id = req.user
        const accountType = req.accountType

        let user = {
            tenkhachhang : ""
        }
        if(id){
            if(accountType === 'system'){
                const data  = await accountDataController.getAnAccountByID(id)
                user = data[0]
            }else if(accountType === 'google'){
                const data  = await accountDataController.getAnGoogleAccount(null,id)
                user = data[0]
            }
        }

        
        

        const {chuyenxe,fullcount} = await dataController.getAllChuyenxeBySearch(query,page)

        const tinhthanh = await dataController.getAllTinhthanh()

        const nhaxe = await dataController.getAllNhaxe()

        const diachi = await dataController.getAllDiachi()

        const loaixe = await dataController.getAllLoaixe()


       
        const count = fullcount
        res.locals.pagination = {
            page,
            limit : 6,
            totalRows : count
        }

        
        res.render('bus', { chuyenxe, tinhthanh,nhaxe,diachi,loaixe,user })

    } catch (error) {
        console.log(error.message)
        res.render('notfound404',{error: "500: " + error.message})
      
    }
}

const renderIndex = async(req, res) => {
    try {

        
        const id = req.user
        const accountType = req.accountType

        let user = {
            tenkhachhang : ""
        }
        if(id){
            if(accountType === 'system'){
                const data  = await accountDataController.getAnAccountByID(id)
                user = data[0]
            }else if(accountType === 'google'){
                const data  = await accountDataController.getAnGoogleAccount(null,id)
                user = data[0]
            }
        }

        

        const tinhthanh = await dataController.getAllTinhthanh()

        const tuyenduongtop = await dataController.getAllTuyenduongtop()


        res.render('index', { tuyenduongtop, tinhthanh,user })

    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }

}


const renderHistory = async(req,res) => {
    try {
        const id = req.user
        const accountType = req.accountType

        let user = {
            tenkhachhang : ""
        }
        if(id){
            if(accountType === 'system'){
                const data  = await accountDataController.getAnAccountByID(id)
                user = data[0]
            }else if(accountType === 'google'){
                const data  = await accountDataController.getAnGoogleAccount(null,id)
                user = data[0]
            }
        }

        const vexe = await dataController.getAllTicketUser(user.makhachhang)


        res.render('history',{vexe,user})




    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }

}

const getSeatData = async (req,res) => {
    
    try {
	    const {machuyenxe,maloaixe,mabatdau,maketthuc} = req.body
	

	    const dataSeat = await dataController.getAllSeat(machuyenxe,maloaixe)
	
        const diachi = await dataController.getDiachi2Noi(mabatdau,maketthuc)

        
        const data = {
            ghedat : dataSeat.ghedat,
            ghexe: dataSeat.ghexe,
            diachi : diachi
        }

	    res.json(data)
    } catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
}


const ratingBus = async(req,res) => {
    try {
        const id = req.user
        const accountType = req.accountType

        let user = {
            tenkhachhang : ""
        }
        if(id){
            if(accountType === 'system'){
                const data  = await accountDataController.getAnAccountByID(id)
                user = data[0]
            }else if(accountType === 'google'){
                const data  = await accountDataController.getAnGoogleAccount(null,id)
                user = data[0]
            }
        }

        const rating = req.body

        await dataController.createRating(user.makhachhang,rating.manhaxe,rating)

        res.json(true)


    } catch (error) {
        console.log(error.message)
        res.render('notfound404',{error : '500' + error.message})
    }
}

const getAccountInfor = async(req,res) => {
    try {
        const id = req.user
        const accountType = req.accountType

        let user = null
        if(id){
            if(accountType === 'system'){
                const data  = await accountDataController.getAnAccountByID(id)
                user = data[0]
            }else if(accountType === 'google'){
                const data  = await accountDataController.getGoogleAccountSafe(id)
                user = data[0]
            }
        }


        res.json(user)

    } catch (error) {
        console.log(error.message)
        res.render('notfound404',{error : '500' + error.message})
    }
} 


module.exports = {
    renderBus,
    renderIndex,
    getSeatData,
    renderHistory,
    ratingBus,
    getAccountInfor
}