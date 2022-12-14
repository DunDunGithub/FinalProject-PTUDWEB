
require('dotenv').config()
const database = require('../database/models')
const {Sequelize} = require('sequelize')
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect:  'postgres'
})
const {QueryTypes,Op} = require('sequelize')
const moment = require('moment')
const LIMIT = 6


// Tham khảo cách query : https://sequelize.org/docs/v6/core-concepts/model-querying-basics/
// Tham khảo cách inner join 2 table : https://sequelize.org/docs/v6/advanced-association-concepts/eager-loading/#required-eager-loading


const getAllTinhthanh = async() =>{
    try {
        const tinhthanh = await database.tinhthanh.findAll({
            attributes : ['matinh','tentinh'],
            raw : true
        })

        return  tinhthanh

    } catch (error) {
        console.log(error.message);
    }


}

const getAllTuyenduongtop = async () => {
    try {
        const tuyenduongtop = await database.tuyenduongtop.findAll({
            include : [
                {
                    model : database.tuyenduong,
                    require : true,
                    attributes : []
                }

            ],
            attributes : ['matuyenduong','ten','giachitu','hinhanh',
            sequelize.col('tuyenduong.tinhbatdau'),sequelize.col('tuyenduong.tinhketthuc')],
            raw : true
        })

        return  tuyenduongtop

    } catch (error) {
        console.log(error.message);
        
    }
}


const getAllChuyenxe = async () => {
    try {
       const data = await sequelize.query('SELECT CX.HINHANHXE,CX.MATUYENDUONG,CX.MACHUYENXE,NX.TENNHAXE,CX.MANHAXE,LX.TENLOAIXE,CX.TGKHOIHANH,CX.TGKETTHUC,'+
       'DCBD.TENDIACHI TENDIACHIKHOIHANH,DCKT.TENDIACHI TENDIACHIKETTHUC,CX.GIAVENHONHAT,DG.DIEMSO'+
       ' FROM CHUYENXE CX INNER JOIN NHAXE NX ON CX.MANHAXE = NX.MANHAXE INNER JOIN DIACHI DCBD ON CX.DIACHIBATDAU = DCBD.MADIACHI' +
        ' INNER JOIN DIACHI DCKT ON CX.DIACHIKETTHUC = DCKT.MADIACHI INNER JOIN LOAIXE LX ON CX.MALOAIXE = LX.MALOAIXE INNER JOIN TUYENDUONG TD ON CX.MATUYENDUONG = TD.MATUYENDUONG INNER JOIN '+
        ' (SELECT NX1.MANHAXE,AVG(DG.DIEMSO) DIEMSO FROM NHAXE NX1 LEFT OUTER JOIN DANHGIA DG ON NX1.MANHAXE = DG.MANHAXE GROUP BY NX1.MANHAXE) DG ON DG.MANHAXE = CX.MANHAXE'
       ,QueryTypes.SELECT)


        // const data = database.chuyenxe.findAll({
        //     include:[
        //         {
        //             model: database.nhaxe,
        //             required: true,
        //             attributes : []
        //         },
        //         {
        //             model: database.diachi,
        //             as :'DCBD',
        //             required: true,
        //             attributes : []
        //         },
        //         {
        //             model: database.diachi,
        //             as: 'DCKT',
        //             required: true,
        //             attributes : []
        //         },
        //         {
        //             model: database.loaixe,
        //             required: true,
        //             attributes : []
        //         },
               

        //     ],
        //     attributes: ['matuyenduong','tgkhoihanh','tgketthuc','hinhanhxe','giavenhonhat',
        //     [sequelize.col('DCBD.tendiachi'), 'diachibatdau'],
        //     [sequelize.col('DCKT.tendiachi'), 'diachiketthuc'],
        //     [sequelize.col('nhaxe.tennhaxe'), 'tennhaxe'],
        //     [sequelize.col('loaixe.tenloaixe'), 'tenloaixe'],
           
        //     ]
        // })

      

        for (let index = 0; index < data[0].length; index++) {
            const danhgia = await database.danhgia.findAll({
             include : [{
                model : database.khachhang,
                require : true,
                attributes : []
             }],
             attributes: ['binhluan','diemso',sequelize.col('khachhang.tenkhachhang')],
             where:{
                 manhaxe : data[0][index].manhaxe
             },
             raw : true
            })
            
          
            data[0][index].danhgia = danhgia
         }

        return data[0]
        
    } catch (error) {
        console.log(error.message);
        
    }

}

const getAllChuyenxeByTuyenduong = async() => {
    try {
        const data = await sequelize.query('SELECT TD.TINHBATDAU,TD.TINHKETTHUC, CX.HINHANHXE,CX.MATUYENDUONG,CX.MACHUYENXE,NX.TENNHAXE,LX.TENLOAIXE,CX.TGKHOIHANH,CX.TGKETTHUC,DCBD.TENDIACHI,DCKT.TENDIACHI,CX.GIAVENHONHAT,DG.DIEMSO'+
        ' FROM CHUYENXE CX INNER JOIN NHAXE NX ON CX.MANHAXE = NX.MANHAXE INNER JOIN DIACHI DCBD ON CX.DIACHIBATDAU = DCBD.MADIACHI' +
         ' INNER JOIN DIACHI DCKT ON CX.DIACHIKETTHUC = DCKT.MADIACHI INNER JOIN LOAIXE LX ON CX.MALOAIXE = LX.MALOAIXE INNER JOIN TUYENDUONG TD ON CX.MATUYENDUONG = TD.MATUYENDUONG INNER JOIN '+
         ' (SELECT NX1.MANHAXE,AVG(DG.DIEMSO) DIEMSO FROM NHAXE NX1 LEFT OUTER JOIN DANHGIA DG ON NX1.MANHAXE = DG.MANHAXE GROUP BY NX1.MANHAXE) DG ON DG.MANHAXE = CX.MANHAXE'
        ,QueryTypes.SELECT)

       

        for (let index = 0; index < data[0].length; index++) {
           const diemdon = await database.diachi.findAll({
            attributes: ['tendiachi','diachicuthe'],
            where:{
                matinh : data[0][index].tinhbatdau
            }
           })
           const diemden = await database.diachi.findAll({
            attributes: ['tendiachi','diachicuthe'],
            where:{
                matinh :  data[0][index].tinhketthuc
            }
           })

           data[0][index].diemdon = diemdon
           data[0][index].diemden = diemden

        }
       
        return data[0]


    } catch (error) {
        console.log(error.message);
    }

}


const getAllChuyenxeBySearch = async(query,page) => {
    try {
        
        let QUERY = 'SELECT count(*) OVER() AS FULL_COUNT,CX.HINHANHXE,CX.MATUYENDUONG,CX.MACHUYENXE,NX.TENNHAXE,CX.MANHAXE,CX.MALOAIXE,LX.TENLOAIXE,CX.TGKHOIHANH,CX.TGKETTHUC,' + 
        'DCBD.MADIACHI MABATDAU, DCKT.MADIACHI MAKETTHUC, ' + 
        'DCBD.TENDIACHI TENDIACHIKHOIHANH,DCKT.TENDIACHI TENDIACHIKETTHUC,CX.GIAVENHONHAT,DG.DIEMSO,CX.MOTA'+
        ' FROM CHUYENXE CX INNER JOIN NHAXE NX ON CX.MANHAXE = NX.MANHAXE INNER JOIN DIACHI DCBD ON CX.DIACHIBATDAU = DCBD.MADIACHI' +
         ' INNER JOIN DIACHI DCKT ON CX.DIACHIKETTHUC = DCKT.MADIACHI INNER JOIN LOAIXE LX ON CX.MALOAIXE = LX.MALOAIXE INNER JOIN TUYENDUONG TD ON CX.MATUYENDUONG = TD.MATUYENDUONG INNER JOIN '+
         ' (SELECT NX1.MANHAXE,AVG(DG.DIEMSO) DIEMSO FROM NHAXE NX1 LEFT OUTER JOIN DANHGIA DG ON NX1.MANHAXE = DG.MANHAXE GROUP BY NX1.MANHAXE) DG ON DG.MANHAXE = CX.MANHAXE '

        if(query.tinhbatdau || query.tinhketthuc || query.date || query.tennhaxe || query.search){
            QUERY += 'WHERE '
            CONDITION = []

            if(query.tinhbatdau){
                CONDITION.push(`TD.TINHBATDAU = '${query.tinhbatdau}'`)
            }

            if(query.tinhketthuc){
                CONDITION.push(`TD.TINHKETTHUC = '${query.tinhketthuc}'`) 
            }

            if(query.tennhaxe){
                CONDITION.push(`NX.TENNHAXE ILIKE '%${query.tennhaxe}%'`)
            }

           

            if(query.tgkhoihanh){
                switch (query.tgkhoihanh) {
                    case 'earlymorning':
                        CONDITION.push("CX.TGKHOIHANH::time BETWEEN time '00:00:00' AND time '06:00:00'")
                        break;
                    case 'morning':
                        CONDITION.push("CX.TGKHOIHANH::time BETWEEN time '06:00:00' AND time '12:00:00'")
                        break;
                    case 'afternoon':
                        CONDITION.push("CX.TGKHOIHANH::time BETWEEN time '12:00:00' AND time '18:00:00'")
                        break;
                    case 'evening':
                        CONDITION.push("CX.TGKHOIHANH::time BETWEEN time '18:00:00' AND time '24:00:00'")
                        break;
                    default:
                        break;
                }
            }

            if(query.diemkhoihanh){
                CONDITION.push(`CX.DIACHIBATDAU = ${query.diemkhoihanh}`)
            }
            if(query.diemketthuc){
                CONDITION.push(`CX.DIACHIBATDAU = ${query.diemketthuc}`)
            }
            if(query.maloaixe){
                CONDITION.push(`CX.MALOAIXE = '${query.maloaixe}'`)
            }

            if(query.giavenhonhat){
                CONDITION.push(`CX.GIAVENHONHAT <= ${query.giavenhonhat * 1000}`)
            }

            if(query.date){
                CONDITION.push(`CX.TGKHOIHANH > '${query.date}' ORDER BY ABS(DATE_PART('day','${query.date}' - CX.TGKHOIHANH))`)
            }

            let WHERE = CONDITION.join(' AND ')
            QUERY += WHERE
        }
        

        if(query.sort && !query.date){
            QUERY += ` ORDER BY CX.GIAVENHONHAT ${query.sort}`
        }

    

        QUERY += ` LIMIT ${LIMIT} OFFSET ${LIMIT*(page - 1)}`

        const data = await sequelize.query(QUERY
        ,QueryTypes.SELECT)

       console.log({soluong : data[0].length})
        if(data[0].length <= 0) return data[0]


        let fullcount = data[0][0].full_count
       
        for (let index = 0; index < data[0].length; index++) {
            const danhgia = await database.danhgia.findAll({
             include : [{
                model : database.khachhang,
                require : true,
                attributes : []
             }],
             attributes: ['binhluan','diemso',sequelize.col('khachhang.tenkhachhang')],
             where:{
                 manhaxe : data[0][index].manhaxe
             },
             raw : true
            })

            const ghedat = await database.vexe.findAll({
                include :[{
                    model : database.ghexe,
                    require:true,
                    attributes: []
                }],
                where:{
                    [Op.and]:[
                        {machuyenxe :  data[0][index].machuyenxe},
                       {tinhtrang : {
                            [Op.or] : ['Vừa đặt','Đã thanh toán']
                       }}
                    ]
                },
                attributes : [sequelize.col('ghexes.chitietvexe.ghexeMaghe')],
                raw : true
            })
            
            const ghexe = await database.ghexe.findAll({
                where:{
                    maloaixe : data[0][index].maloaixe
                },
                attributes : ['maghe'],
                raw : true
            })
            
            const slotLeft = ghexe.length - ghedat.length 
            
            if(slotLeft <= 0){
                data[0][index] = undefined
                fullcount -= 1
                continue
            }else{
                if(query.slot){
                    if(slotLeft < query.slot){
                        data[0][index] = undefined
                        fullcount -= 1
                        continue
                    }
                }
                
            }            
            data[0][index].slotLeft = slotLeft
            data[0][index].danhgia = danhgia
            
         }



        return {chuyenxe : data[0],fullcount :fullcount}


    } catch (error) {
        console.log(error.message);
    }

}

const getAllSeat = async(machuyenxe,maloaixe) => {
    const ghedat = await database.vexe.findAll({
        include :[{
            model : database.ghexe,
            require:true,
            attributes: []
        }],
        where:{
            [Op.and]:[
                {machuyenxe :  machuyenxe},
               {tinhtrang : {
                    [Op.or] : ['Vừa đặt','Đã thanh toán']
               }}
            ]
        },
        attributes : [[sequelize.col('ghexes.chitietvexe.ghexeMaghe'),'maghe']],
        raw : true
    })
    const ghexe = await database.ghexe.findAll({
        include:[{
            model : database.loaighe,
            required : true,
            attributes : []
        }],
        where:{
            maloaixe : maloaixe
        },
        attributes : ['maghe',sequelize.col('loaighe.giaghe')],
        order: [
            ['maghe','ASC']
        ],
        raw : true
    })

    return {ghedat,ghexe}
}

const getDiachi2Noi = async(mabatdau,maketthuc) => {
    try {
        const diachi = await database.diachi.findAll({
            where : {
                [Op.or]: [
                  { madiachi: mabatdau },
                  { madiachi: maketthuc }
                ]
              },
            attributes : ['madiachi','tendiachi','diachicuthe'],
            raw: true
        })

        return diachi

    } catch (error) {
        console.log(error.message)
    }
}

const getInforFromChuyenxe = async(machuyenxe) => {
    try {
       
        //console.log(database)
        const ticket = await database.chuyenxe.findAll({
            include : [
                {
                    model: database.nhaxe,
                    required : true,
                    attributes : []
                },
                {
                    model: database.loaixe,
                    required : true,
                    attributes : []
                },
                {
                    model: database.diachi,
                    as :'DCBD',
                    required: true,
                    attributes : []
                },
                {
                    model: database.diachi,
                    as: 'DCKT',
                    required: true,
                    attributes : []
                }
            ],
            where : {
                machuyenxe : machuyenxe
            },
            attributes : [sequelize.col('nhaxe.tennhaxe'),
                sequelize.col('loaixe.tenloaixe'),
                [sequelize.col('DCBD.tendiachi'), 'diachibatdau'],
                [sequelize.col('DCKT.tendiachi'), 'diachiketthuc'],
                'tgkhoihanh','tgketthuc'
            ],
            raw : true
        })
        

        return ticket[0]
    } catch (error) {
        console.log(error.message + " at getInforFromChuyenxe")
    }
}



const getAllNhaxeAdmin =async (maquantri) => {
    try {
        const data = await sequelize.query('SELECT NX.MANHAXE,NX.TENNHAXE,NX.SODIENTHOAI,NX.HINHANH,DS.DIEMSO '+ 
        'FROM NHAXE NX LEFT OUTER JOIN (SELECT NX1.MANHAXE,AVG(DG.DIEMSO) DIEMSO FROM NHAXE NX1 LEFT OUTER JOIN DANHGIA DG ' + 
        'ON NX1.MANHAXE = DG.MANHAXE GROUP BY NX1.MANHAXE) DS ON NX.MANHAXE = DS.MANHAXE '+
        `WHERE NX.MAQUANTRI = '${maquantri}'`,QueryTypes.SELECT)

        return data[0]
    } catch (error) {
        console.log(error.message)
    }
}

const getAllNhaxe = async () => {
    try {
        const nhaxe = await database.nhaxe.findAll({
            attributes : ['manhaxe','tennhaxe'],
            raw : true
        })

        return  nhaxe

    } catch (error) {
        console.log(error.message);
        
    }
}


const getAllDiachi = async () => {
    try {
        const diachi = await database.diachi.findAll({
            attributes : ['madiachi','tendiachi','diachicuthe'],
            raw : true
        })

        return  diachi

    } catch (error) {
        console.log(error.message);
        
    }
}

const getAllLoaixe = async () => {
    try {
        const loaixe = await database.loaixe.findAll({
            attributes : ['maloaixe','tenloaixe'],
            raw : true
        })

        return  loaixe

    } catch (error) {
        console.log(error.message);
        
    }
}


const checkSlot = async (maghe,machuyenxe) => {
    try {
        const ghedadat = await database.vexe.findAll({
            include :[{
                model : database.ghexe,
                required:true,
                attributes: [],
                where : {
                    maghe : {
                        [Op.or] : maghe
                    }
                }
            }],
            where:{
                [Op.and]:[
                    {machuyenxe :  machuyenxe},
                   {tinhtrang : {
                        [Op.or] : ['Vừa đặt','Đã thanh toán']
                   }}
                ]
            },
            attributes : [[sequelize.col('ghexes.chitietvexe.ghexeMaghe'),'maghe']],
            raw : true
        })

        return ghedadat.length > 0


    } catch (error) {
        console.log(error.message + " at checkSlot")
    }


}


const createNewTicket = async (ticket) => {
    try {

        ticketdetail  = {
            machuyenxe : ticket.machuyenxe,
            hoten: ticket.fullname,
            email: ticket.email,
            sodienthoai :ticket.email,
            tongtien : ticket.totalPrice,
            tinhtrang : 'Vừa đặt'
        }

        if(ticket.makhachhang){
            ticketdetail.makhachhang = ticket.makhachhang
        }
        const data  = await database.vexe.create(ticketdetail)
        
        const vexe = data.dataValues
        

        // !FIX 
        for (const ghe of ticket.maghe) {
            const createdAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            const updatedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')



            await sequelize.query(`INSERT INTO CHITIETVEXE("ghexeMaghe","vexeMave","createdAt","updatedAt") VALUES('${ghe}','${vexe.mave}','${createdAt}','${updatedAt}')`)
            //await database.chitietvexe.create(chitiet)
        }

        return vexe.mave


    } catch (error) {
        console.log(error.message + " at createNewTicket")
    }

}

const updateTicket = async(mave,status) => {
    try {
        const vexe = await database.vexe.findOne({
            where : {
                mave : mave
            }
        })

        vexe.tinhtrang = status
        vexe.save()
        return vexe

    } catch (error) {
        console.log(error.message + " at updateTicket")
    }

}

const getAllTicketUser = async (makhachhang) => {
    try {
        
        const vexe = await database.vexe.findAll({
            include: [
                {
                    model : database.chuyenxe,
                    required : true,
                    attributes : [],
                    include : [
                        {
                            model: database.diachi,
                            as :'DCBD',
                            required: true,
                            attributes : []
                        },
                        {
                            model: database.diachi,
                            as: 'DCKT',
                            required: true,
                            attributes : []
                        },
                        {
                            model : database.nhaxe,
                            required : true,
                            attributes : ['tennhaxe']
                        },
                        {
                            model : database.loaixe,
                            required : true,
                            attributes : []
                        },
                    ]
                },
            ],
            where : {
                makhachhang : makhachhang
            },
            attributes : [sequelize.col('chuyenxe.nhaxe.tennhaxe'),
            sequelize.col('chuyenxe.manhaxe'),
            sequelize.col('chuyenxe.loaixe.tenloaixe'),
            sequelize.col('chuyenxe.tgkhoihanh'),
            [sequelize.col('chuyenxe.DCBD.tendiachi'), 'diachibatdau'],
            [sequelize.col('chuyenxe.DCKT.tendiachi'), 'diachiketthuc'],
            sequelize.col('chuyenxe.tgketthuc'),
            sequelize.col('chuyenxe.hinhanhxe'),
            'tongtien',
            'tinhtrang',
            'mave'
        ],
            raw : true
        })
      

        for (let index = 0; index < vexe.length; index++) {
            const ghedadat = await database.vexe.findAll({
                include :[{
                    model : database.ghexe,
                    require:true,
                    attributes: []
                }],
                where:{
                    mave : vexe[0].mave
                },
                attributes : [[sequelize.col('ghexes.chitietvexe.ghexeMaghe'),'maghe']],
                raw : true
            })
            const slot = ghedadat.map(function(ghe) {
                return ghe['maghe'];
            });

            vexe[index].slots = slot.join(',')
        }

        return vexe



    } catch (error) {
        console.log(error.message + " at getAllTicketUser")
    }




}

const createRating = async (makhachhang,manhaxe,rating) => {
    try {
        const rateID = await database.danhgia.findOne({
            where : {
                [Op.and]: [
                    { makhachhang: makhachhang },
                    { manhaxe: manhaxe }
                ]
            },
            attributes : ['madanhgia']
        })

        if(rateID){
            rateID.binhluan = rating.comment
            rateID.diemso = rating.score
            rateID.save()
            
        }else{
            const newRating = await database.danhgia.create({
                makhachhang : makhachhang,
                manhaxe : manhaxe,
                binhluan : rating.comment,
                diemso : rating.score
            })
        }

    } catch (error) {
        console.log(error.message + " at checkRating")
    }

}





const getAllChuyenxeAdmin = async (maquantri) => {
    try {
        const chuyenxe = await sequelize.query('SELECT CX.MACHUYENXE,NX.MANHAXE,CX.TGKHOIHANH,'+
        'CX.TGKETTHUC,CX.DIACHIBATDAU,CX.DIACHIKETTHUC,CX.GIAVENHONHAT,CX.HINHANHXE,CX.MOTA,CX.MALOAIXE '+   
        'FROM CHUYENXE CX INNER JOIN NHAXE NX ON CX.MANHAXE = NX.MANHAXE INNER JOIN ' + 
        'QUANTRI QT ON NX.MAQUANTRI = QT.MAQUANTRI '+ 
        `WHERE QT.MAQUANTRI ='${maquantri}'`)

        return chuyenxe[0]

    } catch (error) {
        console.log(error.message);
        
    }
}

const getAllVexeAdmin = async(maquantri) => {
    try {
        
        const data = await sequelize.query('SELECT VX.MAVE,VX.MACHUYENXE,VX.MAKHACHHANG,VX.TINHTRANG,VX.TONGTIEN,VX.HOTEN,VX.SODIENTHOAI,VX.EMAIL '+
        'FROM VEXE VX INNER JOIN CHUYENXE CX ON VX.MACHUYENXE = CX.MACHUYENXE '+ 
        'INNER JOIN NHAXE NX ON CX.MANHAXE = NX.MANHAXE '+ 
        'INNER JOIN QUANTRI QT ON NX.MAQUANTRI = QT.MAQUANTRI '+
        `WHERE QT.MAQUANTRI ='${maquantri}'`)



        for (let index = 0; index < data[0].length; index++) {
            const ghedadat = await database.vexe.findAll({
                include :[{
                    model : database.ghexe,
                    require:true,
                    attributes: []
                }],
                where:{
                    mave : data[0][index].mave
                },
                attributes : [[sequelize.col('ghexes.chitietvexe.ghexeMaghe'),'maghe']],
                raw : true
            })
            const slot = ghedadat.map(function(ghe) {
                return ghe['maghe'];
            });

            data[0][index].slots = slot.join(',')
            
            
        }


        return data[0]

    } catch (error) {
        console.log(error.message);
    }
}






module.exports = {
    getAllTinhthanh,
    getAllTuyenduongtop,
    getAllChuyenxe,
    getAllChuyenxeBySearch,
    getAllChuyenxeByTuyenduong,
    getAllNhaxe,
    getAllDiachi,
    getAllLoaixe,
    getAllNhaxeAdmin,
    getAllChuyenxeAdmin,
    getAllVexeAdmin,
    getAllSeat,
    getDiachi2Noi,
    getInforFromChuyenxe,
    createNewTicket,
    updateTicket,
    checkSlot,
    getAllTicketUser,
    createRating
}