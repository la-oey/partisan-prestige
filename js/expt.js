

function pageLoad(){
    expt.qOrder = shuffle(q);
    expt.priorOrder = sample_without_replacement(q.length / 2, q);
    genAgents();
    expt.agentOrder = shuffle(agent);
    clicksMap[expt.startPage]();
}

function genAgents(){
    let parties = ["Democrat", "Republican"];
    let followers = ["high", "low"];
    for(var p=0; p<parties.length; p++){
        let pi = parties[p];
        for(var f=0; f<q.length/2; f++){
            let fiLvl = followers[f % 2];
            let fi = fiLvl == "low" ? randomDouble(1, 400) : randomDouble(400, 2400); // make adjustments to this
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

function showTransition(){
    $('#trial').css('display', 'none');
    $('#instruct1').css('display', 'block');
}

function clickTransition(){
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
    trial.q = expt.qOrder[trial.number-1];
    $('#question').html(trial.q);
}

function showAgent() {
    $('#agent').css('display','block');
    trial.agent = expt.agentOrder[trial.number-1]
    let party = trial.agent['party'];
    $('#agentInfo').html('Party: '+party);
    $('#agentInfo').append('<br> Followers: '+trial.agent['prestige']);
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
        showAgent();
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
            showTransition();
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
        trialStim: trial.q,
        agentParty: trial.agent['party'],
        agentPrestige: trial.agent['prestige'],
        agentVote: trial.agent['vote'],
        response: $('#responseSlider').val(),
        startTime: trial.startTime,
        trialTime: trial.totalTime
    });
    console.log(trialData)
}

function experimentDone(){
    submitExternal(client);
}











    //////////////////////////////////
   //////// Helper Functions ////////
  //////////////////////////////////


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
