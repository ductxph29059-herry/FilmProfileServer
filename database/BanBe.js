const mongoose = require('mongoose');

const BanBeSchema = new mongoose.Schema({
    idNguoiDung:String,
    idDuocTheoDoi:String,
    TrangThai:String,
})
module.exports = mongoose.model('BanBe', BanBeSchema , 'BanBe');