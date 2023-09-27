const express = require('express');
const router = express.Router();
const mongo = require('mongoose');
const NguoiDung = require('../database/NguoiDung')
const MulterConfigs = require("../config/MulterConfigs");

//api đăng kí
//vd: taiKhoan: admin, matKhau: a
//nếu chưa tồn tại tài khoản này thì hiện ra JSON data: bao gồm thông tin cá nhân và message đăng kí thành công
//nếu đã tồn tại tài khoản thì sẽ trả về data rỗng và message đăng ký thất bại
//link local: http://localhost:3002/api/themTaiKhoan
//linh glitch: https://gratis-dusty-cabinet.glitch.me/api/themTaiKhoan
router.post('/themTaiKhoan', MulterConfigs.upload.array('hinhAnh',1), async function (req, res) {
        const taiKhoan = req.body.taiKhoan
        const matKhau = req.body.matKhau
        const hoTen = req.body.hoTen
        const hinhAnh = 'https://gratis-dusty-cabinet.glitch.me/uploads/logofpt.png';
        var objId ;
        var item = await NguoiDung.find({taiKhoan: taiKhoan})

        if (item[0] == null){
            await NguoiDung.create({
                taiKhoan:taiKhoan,
                matKhau:matKhau,
                hoTen:hoTen,
                ngaySinh:"dd-mm-yyyy",
                gioiTinh:2,
                moTa:"gioi thieu",
                hinhAnh: hinhAnh,
                trangThai:1
            }).then(result => {objId = result._id})

            const query = NguoiDung.where({_id:objId})
            const data = await query.findOne();

            res.end(JSON.stringify({
                id:data._id,
                hoTen:data.hoTen,
                ngaySinh:data.ngaySinh,
                gioiTinh:data.gioiTinh,
                moTa:data.moTa,
                hinhAnh:data.hinhAnh,
                trangThai:data.trangThai,
                message:'Dang ki thanh cong'}));
        }else{
            res.end(JSON.stringify({data: {}, message: "Tai khoan da ton tai"}));
        }
    });


//api đăng nhập
//VD: taiKhoan: Quyet, matKhau: Quyet
//Tìm kiếm trong database theo tài khoản mật khẩu
//Nếu đúng tài khoản và mật khẩu thì cho phép đăng nhập và trả về thông tin cá nhân của tài khoản đăng nhập
//Nếu sai thì sẽ hiện ra message sai thông tin đăng nhập
router.post('/dangNhap', async function (req, res,next) {
    const username = req.body.taiKhoan;
    const password = req.body.matKhau;
    const query = NguoiDung.where({taiKhoan: username, matKhau: password})
    var item = await query.findOne();

    if (item._id == null){
        res.end(JSON.stringify({data: {}, message: "dang nhap that bai"}));
    }else{
        res.end(JSON.stringify({
            data:{
                id:item._id,
                taiKhoan:item.taiKhoan,
                matKhau: item.matKhau,
                hoTen:item.hoTen,
                ngaySinh:item.ngaySinh,
                gioiTinh:item.gioiTinh,
                moTa: item.moTa,
                hinhAnh: item.hinhAnh,
                trangThai: item.trangThai},
            message:"dang nhap thanh cong"}));
    }
});

//lay api thong tin ca nhan
// router.get('/getPersonalInfos/:id', async function(req, res, next) {
//     const id = req.params.id;
//     const data = await NguoiDung.find({_id: id});
//     console.log("day la data:" + data)
//     // const mapping = await data.map((item) => {
//     //     let urlImg;
//     //     if (item.hinhAnh == null) {
//     //         urlImg = ""
//     //     } else {
//     //         urlImg = item.hinhAnh;
//     //     }
//     //     return {
//     //         id: item._id,
//     //         hoTen: item.hoTen,
//     //         gioiTinh: item.gioiTinh,
//     //         ngaySinh: item.ngaySinh,
//     //         hinhAnh: urlImg
//     //     }
//     // })
//     res.end(JSON.stringify(data));
// });

module.exports = router;