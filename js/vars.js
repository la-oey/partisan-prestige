var expt = { //add conditions here
    saveURL: 'submit.simple.php',
    startPage: 'consent', // {'consent','instruction','prior','join','transition','trial'}
    blocks: ['priors','trial'],
    priorTrials: q.length/2,
    totalTrials: q.length, //adjust to how many trials you have
    nStimTrial: 3,
    debug: false //set to false when ready to run
};

var qOrder = {};
var priorOrder = {};

var trial = {
    block: 'priors', // {'priors','trial'}
    number: 1, //which trial is this? //1-indexed
    q: {
        "belief": "",
        "agreement": "",
        "truthiness": ""
    },
    agent: {
        "party": "",
        "prestige": "",
        "vote": ""
    },
    startTime: 0,
    endTime: 0,
    totalTime: 0
}


var client = parseClient();
var trialData = []; //store all data in json format
var data = [];
