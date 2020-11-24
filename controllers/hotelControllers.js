const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const util = require('util');
const connection =  require('./../connection');


const queryFunc = util.promisify(connection.query).bind(connection);

exports.getHotels = catchAsync( async (req,res,next) => {
    const query = 'select * from data_hotel';

    const hotels = await queryFunc(query);

    if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })
});
exports.getHotel = catchAsync( async (req,res,next) => {
    const query = `select * from data_hotel where hotel_id = '${req.params.id}'`;

    console.log(req.params.id)

    const hotel = await queryFunc(query);

    if (hotel.length === 0) return next(new appError(404, 'No hotels found'));

    res.status(200).json({
        status: 'success',
        data: {
            hotel
        }
    })
});

exports.searchHotels = catchAsync( async (req,res,next) => {
    
});