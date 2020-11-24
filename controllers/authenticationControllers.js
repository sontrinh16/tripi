const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/appError');

const generateToken = (id) => {
    return  jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRED_IN
    });
}

exports.register = catchAsync( async ( req, res, next) => {
    const {first_name, last_name, username, password} = req.body;
    console.log(first_name, last_name, username, password)
    const query = `insert into user(first_name, last_name, username, password) values ('${first_name}', '${last_name}', '${username}','${password}')`;

    await queryFunc(query);

})

exports.login = catchAsync( async (req, res, next) => {
    const {username, password} = req.body;

    console.log(username + ',' + password);

    const query = `SELECT * FROM user WHERE username = '${username}' AND pass = '${password}'`;

    const users = await queryFunc(query);

    if (users.length === 0) return next(new appError(401, 'invalid username or password'));

    const user = users[0];


    //console.log(user);

    const token = generateToken(user.id);

    //console.log(token);
    
    const cookieOptions = {
        expires: new Date(
            Date.now() + 24 * 60 *60 *1000
        ),
        //httpOnly: true,
        sameSite: 'None',
        secure: true
    }

    res.cookie('jwt', token, cookieOptions);

    //ALTER pass_change_at to null 

    //user.password = null;

    res.status(200).json({
        status: 'success',
        token,
        data:{
            user
        }
    })

});

exports.isLogging = catchAsync( async (req, res, next) => {
    if (req.cookies.jwt) {

        //console.log(req.cookies.jwt);

        const decoded = await util.promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );

        // //console.log(checkJwtIsExpired(exp))

        // //if (checkJwtIsExpired(exp)) return res.redirect('/login'); 

        const query = `SELECT * FROM user WHERE id = ${decoded.id}`;

       const users = await queryFunc(query);

        const user = users[0];

        if (user.length === 0) return next(new appError(401, 'username is not exist'));

        // //console.log(student);
        
        // //if (checkPassChangeAfter(student.pass_change_at, decoded.iat)) return next(new appError(401, 'username of password is not exist'));

        // student.pass = undefined;    

        req.user = user;

        res.locals.user = user;
        return next();
    }
    return next(new appError('401', 'user not logging in'));
});