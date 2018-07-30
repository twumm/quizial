// Check if user is logged in.
exports.requiresLogin = (req, res, next) => {
  if (req.user) {
    return next()
  }
  req.flash('info', 'Kindly login or signup to continue.')
  return res.redirect('back')
}
