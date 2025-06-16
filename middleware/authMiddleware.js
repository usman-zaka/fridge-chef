function protectHTMLfiles(req, res, next) {
    // list of the protected files that are mapped with their conditions
    const protectedFiles = {
        'admin.html': { requireAdmin: true },
        'dashboard.html': {},
        'profile.html': {},
        'recipe.html': {}
    };

    // getting path
    const requestedFile = req.path.split('/').pop();

    if (protectedFiles[requestedFile]) {
        //  if user is logged in (optional chaining ?.)
        if (!req.session?.user) {
            return res.redirect('/signin.html');
        }

        // checking admin requirements 
        if (protectedFiles[requestedFile].requireAdmin && !req.session.user.is_admin) {
            return res.status(403).send('Access forbidden: Admins only!!!');
        }
    }

    next();
}
module.exports = protectHTMLfiles;