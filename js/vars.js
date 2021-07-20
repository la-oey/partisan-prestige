var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    startPage: 'trial', // {'consent','trial'}
    totalTrials: 4, //adjust to how many trials you have
    nStimTrial: 3,
    debug: true, //set to false when ready to run
    stimOrder: []
};

var trial = {
    number: 1, //which trial is this? //1-indexed
    q: [],
    agent: [],
    startTime: 0,
    endTime: 0,
    totalTime: 0
}


var client = parseClient();
var trialData = []; //store all data in json format
var data = [];
