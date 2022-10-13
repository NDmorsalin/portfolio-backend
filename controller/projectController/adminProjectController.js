/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
const AdminProject = require('../../Model/adminProjectModel');
const catchAsyncError = require('../../middleware/common/catchAsyncError');

const allProjects = catchAsyncError(async (req, res, next) => {
    const adminProjects = await AdminProject.find();

    res.status(200).json({
        adminProjects,
        message: 'Project is showing success fully',
    });
});
const createProject = catchAsyncError(async (req, res, next) => {
    const projectImg = req.files
        ? `${req.protocol}://${req.hostname}:${process.env.PORT}/adminProjects/${req.files[0].filename}`
        : req.body.imageOrVideoLink;

    const adminProject = await new AdminProject({
        ...req.body,
        user: req.user._id,
        imageOrVideoLink: projectImg,
    });

    await adminProject.save({ validateBeforeSave: false });

    res.status(200).json({
        adminProject,
        message: 'Project is save success fully',
    });
});
const getSingleProject = catchAsyncError(async (req, res, next) => {});
const updateProject = catchAsyncError(async (req, res, next) => {});
const deleteProject = catchAsyncError(async (req, res, next) => {});

module.exports = {
    allProjects,
    createProject,
    getSingleProject,
    updateProject,
    deleteProject,
};
