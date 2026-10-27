const fs = require('fs');
const vm = require('vm');

const scripts = [
    'seed-data.js',
    'storage.js',
    'neurolearn.js',
    'charts.js',
    'oscilloscope.js',
    'gamification.js',
    'ai-classroom.js',
    'community-qa.js',
    'faculty.js',
    'eeg-simulator.js',
    'app.js'
];

const basePath = 'C:/Users/ELCOT/Downloads/Neuronexus/frontend/js/';

for (let s of scripts) {
    try {
        const code = fs.readFileSync(basePath + s, 'utf8');
        new vm.Script(code, { filename: s });
        console.log(`[PASS] ${s} syntax is valid.`);
    } catch (e) {
        console.error(`[ERROR] ${s} has syntax error:`, e.message);
    }
}
