const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');
const util = require('util');
const connection =  require('./../connection');
const con = require('./../connection');
const axios = require('axios');


const queryFunc = util.promisify(connection.query).bind(connection);

exports.getHotels = catchAsync( async (req,res,next) => {
    const query = 'select * from hotel_distinct';

    const hotels = await queryFunc(query);

    //console.log(hotels)

    //if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })
});
exports.getHotel = catchAsync( async (req,res,next) => {
    const query = `select distinct * from data_hotel dh inner join domain d on dh.domain_id = d.id where dh.hotel_id = '${req.params.id}'`;

    console.log(req.params.id)

    const hotels = await queryFunc(query);

    if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

    const hotel = hotels[0];

    console.log(hotel.domain_hotel_id)

    const query_2 = `select * from review where domain_hotel_id = ${hotel.domain_hotel_id} and domain_id = ${hotel.domain_id}`;

    const query_3 = `select * from price where domain_hotel_id = ${hotel.domain_hotel_id} and domain_id = ${hotel.domain_id}`;

    const reviews = await queryFunc(query_2);

    const prices = await queryFunc(query_3);

    if(prices.length !== 0) {
        const price = prices[0];

        const hotel_ids = `${price.domain_id}_${price.domain_hotel_id}_${price.checkin_date_id}`;

        console.log(hotel_ids);

        const data = JSON.stringify({
            hotel_ids: hotel_ids
        });

        console.log(data)

        const hotel_prices = await axios.post('https://tripgle.data.tripi.vn/get_price', 
                                            data, {
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': 'Basic dHJpcGdsZTpJWkRobm12cjBIU2ZPV1pSekhmZw=='
                                                }
                                            });

        console.log(hotel_prices.data)
        res.status(200).json({
            status: 'success',
            data: {
                hotel,
                reviews,
                hotel_prices: hotel_prices.data,
                number_of_reviews: reviews.length
            }
        })
    }
    else {
        res.status(200).json({
            status: 'success',
            data: {
                hotel,
                reviews,
                hotel_prices: [],
                number_of_reviews: reviews.length
            }
        })
    }
});

exports.searchHotels = catchAsync( async (req,res,next) => {
    const {root_name} = req.body;

    const query = `select distinct * from data_hotel dh inner join domain d on dh.domain_id = d.id where dh.root_name like '%${root_name}%'`;

    let hotels = await queryFunc(query);

    if(req.body.filter){
        const {price_min, price_max, star_number, overall_score} = req.body.filter;
        if (hotels.length === 0) return next(new appError(404, 'No hotels found'));

        if(overall_score) {
            hotels = hotels.filter(hotel => hotel.overall_score === overall_score);
        }
        if(star_number) {
            hotels = hotels.filter(hotel => hotel.star_number === star_number);
        }
        // if(price_min) {
        //     hotels = hotels.filter(hotel => hotel.price > price_min);
        // }
        // if(price_max) {
        //     hotels = hotels.filter(hotel => hotel.price < price_max);
        // }
    }

    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })

});

exports.filterHotels = catchAsync( async (req,res,next) => {
    const {price_min,price_max,star_number,overall_score} = req.body.filter;

    const query = `select * from data_hotel`;

    let hotels = await queryFunc(query);

    if(overall_score) {
        hotels = hotels.filter(hotel => hotel.overall_score >= overall_score);
    }
    if(star_number) {
        hotels = hotels.filter(hotel => hotel.star_number >= star_number);
    }
    // if(price_min) {
    //     hotels = hotels.filter(hotel => hotel.price > price_min);
    // }
    // if(price_max) {
    //     hotels = hotels.filter(hotel => hotel.price < price_max);
    // }

    res.status(200).json({
        status: 'success',
        data: {
            hotels
        }
    })

});
