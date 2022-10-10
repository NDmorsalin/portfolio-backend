const express = require('express');
const {
    getAllUser,
    login,
    signup,
    logout,
    getSingleUser,
    updateUser,
    forgetPassword,
    resetPassword,
    updatePassword,
    getAdmin,
} = require('../controller/userController/userController');
const { auth, authenticateRole } = require('../middleware/common/auth');
const avatarUpload = require('../middleware/user/avatarUpload');
const { userValidation, userValidationResult } = require('../middleware/user/userValidation');

const router = express.Router();

router.get('/admin', getAdmin);

// logout
router.get('/logout', logout);

// login
router.post('/login', login);

// signup
router.post('/signup', avatarUpload, userValidation, userValidationResult, signup);

// get all user --admin
router.get('/admin/user', auth, authenticateRole('admin'), getAllUser);

router
    .route('/admin/user/:id')
    .get(auth, authenticateRole('admin'), getSingleUser)
    .put(auth, authenticateRole('admin'), updateUser); // --admin
// todo delete user

// update my account
router.put('/me/update', auth, avatarUpload, updateUser);

// update password
router.put('/me/update-password', auth, updatePassword);

// update password
router.post('/password/forget', forgetPassword);
router.post('/password/reset/:resetToken', resetPassword);

module.exports = router;
