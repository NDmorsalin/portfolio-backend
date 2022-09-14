const express = require('express');
const {
    allProject,
    createProject,
    getSingleProject,
    updateProject,
    deleteProject,
} = require('../controller/projectController/projectController');
const { auth, authenticateRole } = require('../middleware/common/auth');
const avatarUpload = require('../middleware/user/avatarUpload');

const router = express.Router();

/* project */

// get all project --admin
router
    .route('/admin/project')
    .get(auth, authenticateRole('admin'), allProject)
    .post(auth, authenticateRole('admin'), avatarUpload, createProject);

router
    .route('/admin/project/:id')
    .get(auth, authenticateRole('admin'), getSingleProject)
    .put(auth, authenticateRole('admin'), updateProject) // --admin
    .delete(auth, authenticateRole('admin'), deleteProject);

module.exports = router;
