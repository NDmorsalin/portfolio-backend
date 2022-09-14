const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
