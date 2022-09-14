const catchAsyncError = require('../../middleware/common/catchAsyncError');

const allProject = catchAsyncError(async (req, res, next) => {});
const createProject = catchAsyncError(async (req, res, next) => {});
const getSingleProject = catchAsyncError(async (req, res, next) => {});
const updateProject = catchAsyncError(async (req, res, next) => {});
const deleteProject = catchAsyncError(async (req, res, next) => {});

module.exports = {
    allProject,
    createProject,
    getSingleProject,
    updateProject,
    deleteProject,
};
