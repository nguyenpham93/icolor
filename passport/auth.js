module.exports = {
    checkAuthentication : ( req, res, next ) => {
        if ( req.isAuthenticated() ) {
            req.session.login = true;
            req.session.user = req.user;
            next ();
        } else {
            req.session.login = false;
            req.session.user = {};
            next ();
        }
    }
}