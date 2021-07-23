

function pageLoad(){
    let allQ = q.test.concat(q.filler); //combine filler and test questions
    qOrder = shuffle(allQ);
    priorOrder = shuffle(q.test);
    expt.condition = Array.isArray(expt.condition) ? sample(expt.condition) : expt.condition; //randomly assign condition
    genAgents();
    agentOrder = shuffle(agent);
    clicksMap[expt.startPage]();
}

function genAgents(){
    let parties = ["Democrat", "Republican"];
    let followers = ["high", "low"];
    for(var p=0; p<parties.length; p++){
        let pi = parties[p];
        for(var f=0; f<q.length/2; f++){
            let fiLvl = followers[f % 2];
            let fi = fiLvl == "low" ? "-" : "+"; // make adjustments to this
            fi = fi + Math.floor(randomDouble(50,500));
            let vo = randomDouble(0, 100); // random voting -- algorithm?
            agent.push({ 'party' : pi, 'prestigeLvl' : fiLvl, 'prestige' : fi, 'vote' : vo });
        }
    }
}

function loadConsent(){
    $('#consent').css('display','block');
    $('#continueConsent').attr('disabled',true);
    $('input:radio[name="consent"]').change(
        function(){
            if($(this).is(':checked') && $(this).val()=="yes"){
                $('#continueConsent').attr('disabled',false);
            }
        });
}

function clickConsent(){
    $('#consent').css('display','none');
    $('#instruct0').css('display', 'block');
}

function clickInstruction(){
    $('#instruct0').css('display', 'none');
    trialStart();
}

function showTransitionJoin() {
    $('#trial').css('display', 'none');
    $('#join').css('display', 'block');
}

function clickTransitionJoin(){
    $('#join').css('display', 'none');
    $('#instruct1').css('display', 'block');
    submitDemo();
}

function showTransitionTrial(){
    $('#join').css('display', 'none');
    $('#instruct1').css('display', 'block');
}

function clickTransitionTrial(){
    $('#instruct1').css('display', 'none');
    trial.block = "trial";
    trialStart();
}




function sampleAgent(){
    // sample agent prestige and voting pattern?
}

function showSlider(){
    $('#next').prop('disabled', true);
    // always start inactive
    $('#responseSlider').addClass('inactiveSlider');
    $('#responseSlider').removeClass('activeSlider');
    $('#responseSlider').on('click input',
        function(){
            $('#responseSlider').removeClass('inactiveSlider');
            $('#responseSlider').addClass('activeSlider');
            // var val = $('#responseSlider').prop('value');
            // var dynamColor = 'linear-gradient(90deg, red ' + val + '%, blue ' + val + '%)'; // to color left and right of slider
            // $('.activeSlider').css('background',dynamColor); 
            $('#next').prop('disabled', false);
        });
}

function showQ(){
    if(trial.block == "priors"){
        trial.q = priorOrder[trial.number-1];
    } else{
        trial.q = qOrder[trial.number-1];
    }
    $('#question').html(trial.q["belief"]);
}

function showAgent() {
    $('#agent').css('display','block');
    trial.agent = agentOrder[trial.number-1]
    let party = trial.agent['party'];
    $('#agentInfo').html('Party: '+party);
    $('#agentInfo').append('<br> Follower Score: '+trial.agent['prestige']);
    $('#agentInfo').append('<br><br> Voted: <br>');
    $('#agentSlider').val(trial.agent['vote']);
    $('#agentSlider').prop('disabled', 'true');
    let color = party == "Democrat" ? "blue" : "red"; // set slider color to red or blue
    $("<style type='text/css'>#agentSlider::-webkit-slider-thumb{background:" + color + "}</style>").appendTo($("head"));
}


function trialStart(){
    $('#trial').css('display','block');
    
    trial.startTime = new Date().getTime(); //reset start of trial time
    showQ();
    if(trial.block == "trial"){
        if(expt.condition == "test"){
            showAgent();
        } else{
            $('#agent').css('display','none');
        }
        $('#round').html('Round ' + trial.number + " of " + expt.totalTrials);
    } else {
        $('#agent').css('display','none');
        $('#round').html('Round ' + trial.number + " of " + expt.priorTrials);
    }
    
    showSlider();
    $('#next').prop('disabled', true);
}


function saveData(){
    recordData();
    // these lines write to server
    let data = {client: client, expt: expt, trials: trialData};
    if(!expt.debug){
        writeServer(data);
    }
}


function trialDone(){
    $('#trial').css('display','none');
    
    trial.endTime = new Date().getTime();
    trial.totalTime = trial.endTime - trial.startTime;

    saveData();
    
    // if we are done with all trials, then go to completed page
    if(trial.number == expt.totalTrials){
        $('#trial').css('display', 'none');
        $('#completed').css('display','block');
    } else {
        if(trial.block == "priors" && trial.number == expt.priorTrials) {
            showTransitionJoin();
            trial.number = 1;
        } else{
            // increase trial number
            ++trial.number;
            trialStart();
        }
        trial.endTime = null;
    }
}


function recordData(){
    // record what the subject did in json format
    trialData.push({
        trialNumber: trial.number,
        trialBlock: trial.block,
        question: trial.q["belief"],
        qAgreement: trial.q["agreement"],
        qTruthiness: trial.q["truthiness"],
        agentParty: trial.agent['party'],
        agentPrestige: trial.agent['prestige'],
        agentVote: trial.agent['vote'],
        response: $('#responseSlider').val(),
        startTime: trial.startTime,
        trialTime: trial.totalTime
    });
}

function experimentDone(){
    submitExternal(client);
}











    //////////////////////////////////
   //////// Helper Functions ////////
  //////////////////////////////////

function sample(set) {
    return (set[Math.floor(Math.random() * set.length)]);
}

function shuffle(array){ //shuffle list of objects
  var tornado = array.slice(0);
  var return_array = [];
  for(var i=0; i<array.length; i++){
    var randomIndex = Math.floor(Math.random()*tornado.length);
    return_array.push(tornado.splice(randomIndex, 1)[0]);
  }
  return return_array;   
}

function randomDouble(min, max){
    return Math.random() * (max - min) + min;
}

function sample_without_replacement(sampleSize, sample){
  var urn = sample.slice(0);
  var return_sample = [];
  for(var i=0; i<sampleSize; i++){
    var randomIndex = Math.floor(Math.random()*urn.length);
    return_sample.push(urn.splice(randomIndex, 1)[0]);
  }
  return return_sample;
}


function debugLog(message) {
    if(expt.debug){
        console.log(message);
    }
}
