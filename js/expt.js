

function pageLoad(){
    expt.qOrder = shuffle(q);
    expt.agentOrder = shuffle(agent);
    clicksMap[expt.startPage]();
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

function clickContConsent(){
    $('#consent').css('display','none');
    trialStart();
}

function showSlider(){
    // always start inactive
    $('#responseSlider').addClass('inactiveSlider');
    $('#responseSlider').removeClass('activeSlider');
    $('#responseSlider').on('click input',
        function(){
            var val = $('#responseSlider').prop('value');

            $('#responseSlider').removeClass('inactiveSlider');
            $('#responseSlider').addClass('activeSlider');
            // var dynamColor = 'linear-gradient(90deg, red ' + val + '%, blue ' + val + '%)'; // to color left and right of slider
            // $('.activeSlider').css('background',dynamColor); 
            $('#catch-button').prop('disabled',false);
            $('#next').prop('disabled', false);
        });
}

function showQ(){
    $('#question').html(expt.qOrder[trial.number-1]);
}

function showAgent() {
    $('#agentInfo').html('Party: '+expt.agentOrder[trial.number-1]['party']);
    $('#agentInfo').append('<br> Followers: '+expt.agentOrder[trial.number-1]['prestige']);
    $('#agentInfo').append('<br><br> Voted: <br>');
    var s = $("#agentSlider").slider();
    s.slider('value', expt.agentOrder[trial.number-1]['vote']);
}


function trialStart(){
    $('#trial').css('display','block');
    //$('#next').attr('disabled',true);
    $('#round').html('Round ' + trial.number + " of " + expt.totalTrials);
    trial.startTime = new Date().getTime(); //reset start of trial time
    showQ();
    showAgent();
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
    if(trial.number == expt.totalTrial){
        $('#trial').css('display', 'none');
        $('#completed').css('display','block');
    } else {
        // increase trial number
        ++trial.number;
        trial.endTime = null;
        trialStart();
    }
}


function recordData(){
    // record what the subject did in json format
    trialData.push({
        trialNumber: trial.number,
        trialStim: trial.q,
        //trialAgentParty: trial.agent['party'],
        //trialAgentPrestige: trial.agent['prestige'],
        //trialAgentVote: trial.agent['vote'],
        startTime: trial.startTime
    });
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

function debugLog(message) {
    if(expt.debug){
        console.log(message);
    }
}
