const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const util = require('util');
const connection =  require('./../connection');


const queryFunc = util.promisify(connection.query).bind(connection);

exports.getHotels = catchAsync( async (req,res,next) => {
    const query = 'select * from data_hotel';

    const hotels = await queryFunc(query);

    //console.log(hotels)

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

    const hotels = await queryFunc(query);

    if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

    const hotel = hotels[0];

    const query_2 = `select * from review where domain_hotel_id = ${hotel.domain_hotel_id} and domain_id = ${hotel.domain_id}`;

    const reviews = await queryFunc(query_2);

    res.status(200).json({
        status: 'success',
        data: {
            hotel,
            reviews
        }
    })
});



exports.searchHotels = catchAsync( async (req,res,next) => {
    const {name} = req.body;

    const query = `select * from data_hotel where root_name like '%${name}%'`;

    const hotels = await queryFunc(query);

    if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })

});