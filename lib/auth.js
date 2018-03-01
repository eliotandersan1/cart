 var auth = {
    authenticate: function (role) {
        return function (req, res, next) {

            if(!req.session.user){

                req.flash('error ','login required');
                res.redirect('/user/signup');
                return;
            }
            if(role && req.session.user.role != role){
                req.flash('error', 'not authorised to view this page');
                res.redirect('/user/signin');
            }
                console.log('hiiiiiiiiiiiiiiii');

            next();
        }

    }

 };

 module.exports = auth;