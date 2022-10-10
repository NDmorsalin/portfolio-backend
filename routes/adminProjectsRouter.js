const express = require('express');
const {
    allProjects,
    createProject,
    getSingleProject,
    updateProject,
    deleteProject,
} = require('../controller/projectController/adminProjectController');
const { auth, authenticateRole } = require('../middleware/common/auth');
const adminProjectsImgUpload = require('../middleware/project/adminProjectsImgUpload');

const router = express.Router();

/* project */

// get all project --admin
router
    .route('/admin/adminProjects')
    .get(auth, authenticateRole('admin'), allProjects)
    .post(auth, authenticateRole('admin'), adminProjectsImgUpload, createProject);

router
    .route('/admin/adminProject/:id')
    .get(auth, authenticateRole('admin'), getSingleProject)
    .put(auth, authenticateRole('admin'), updateProject) // --admin
    .delete(auth, authenticateRole('admin'), deleteProject);

module.exports = router;
