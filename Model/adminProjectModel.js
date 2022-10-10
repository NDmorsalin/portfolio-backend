const mongoose = require('mongoose');
const User = require('./userModel');

const adminProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    demoLink: {
        type: String,
        required: true,
    },
    gitHubLink: {
        type: String,
        required: true,
    },
    dependencyTech: [String],
    imageOrVideoLink: String,
    extraNote: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: User },
});

const AdminProject = mongoose.model('AdminProject', adminProjectSchema);
module.exports = AdminProject;
