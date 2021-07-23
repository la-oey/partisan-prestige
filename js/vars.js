var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    startPage: 'consent', // {'consent','instruction','prior','transition','trial'}
    blocks: ['priors','trial'],
    priorTrials: 2,
    totalTrials: q.length, //adjust to how many trials you have
    nStimTrial: 3,
    debug: true, //set to false when ready to run
    stimOrder: [],
    priorOrder: []
};

var trial = {
    block: 'priors', // {'priors','trial'}
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
