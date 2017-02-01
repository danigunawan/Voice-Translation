$(document).ready(function(){
  if (!('webkitSpeechRecognition' in window)) {
    $("#input").val("Speech API is not supported here");
  } else {
    var output = ""
    var chosen_language = "en"
    var user_input = ""
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

    var recognition = new SpeechRecognition();
    var speechRecognitionList = new SpeechGrammarList();
    recognition.grammars = speechRecognitionList;
    recognition.continuous = true;

    // recognition.lang change languages (English: en-US, Japanese: ja, Filipino: *fil-PH*)

    recognition.lang = 'en';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
        var last = event.results.length - 1;
        output = event.results[last][0].transcript;
        user_input = output
        recognition.stop();
    }

    recognition.onend = function() {
      user_input = output
      $.ajax({
        type: 'get',
        url: '/translate',
        data: {
          input: output,
          language: recognition.lang + "-" + chosen_language
        },
        dataType: "json",
        success: function(result){
          if(result['code'] == 200 && result['text'][0].length > 0){
            if(result['type'] == 'command'){
              try{
                eval(result['text'][0]);
              }catch(err){
                responsiveVoice.speak("There was an error in the execution");
              }
            }else{
              if(result['lang'].length > 0){
                chosen_language == result['lang'].slice(-2);
              }
              if(chosen_language == 'ja' ){
                responsiveVoice.speak(result['text'][0], 'Japanese Female');
              }else if (chosen_language == 'en') {
                responsiveVoice.speak(result['text'][0]);
              }
              else{
                responsiveVoice.speak(result['text'][0]);
              }
              $('#command_keywords').val(user_input);
              $('#command_response').val(result['text'][0]);
              $('#command_language').val(chosen_language);
            }
            console.log(chosen_language)
          }else if (result['code'] !== '200' ){
            if(typeof result['message'] !== 'undefined' && result['message'].length > 0){
              responsiveVoice.speak(result['message'])
            }else{
              responsiveVoice.speak("I didn't recognize what you said.");
            }
          }
        }
      });
      $('#speak').text("Start Speaking")
    }

    recognition.onnomatch = function(event) {
      responsiveVoice.speak("I didn't recognize what you said.");
    }

    recognition.onerror = function(event) {
      responsiveVoice.speak('Error occurred in recognition: ' + event.error);
    }

    $('#language_options').on('change', function(){
      chosen_language = $(this).val()
    });

    $('#recognition_options').on('change', function(){
      recognition.lang = $(this).val()
    });

    $('#speak').on("click", function() {
      if($(this).data('click') == 'off'){
        var text = $('#input').val()
        if(text.length > 0){
          output = text;
          user_input = output
          $.ajax({
            type: 'get',
            url: '/translate',
            data: {
              input: output,
              language: recognition.lang + "-" + chosen_language
            },
            dataType: "json",
            success: function(result){
              if(result['code'] == 200 && result['text'][0].length > 0){
                if(result['type'] == 'command'){
                  eval(result['text'][0])
                }else{
                  if(result['lang'].length > 0){
                    chosen_language == result['lang'].slice(-2)
                  }
                  if(chosen_language == 'ja' ){
                    responsiveVoice.speak(result['text'][0], 'Japanese Female');
                  }else if (chosen_language == 'en') {
                    responsiveVoice.speak(result['text'][0]);
                  }
                  else{
                    responsiveVoice.speak(result['text'][0]);
                  }
                  $('#command_keywords').val(user_input);
                  $('#command_response').val(result['text'][0]);
                  $('#command_language').val(chosen_language);
                }
                console.log(chosen_language)
              }else if (result['code'] !== '200' ){
                if(typeof result['message'] !== 'undefined' && result['message'].length > 0){
                  responsiveVoice.speak(result['message'])
                }else{
                  responsiveVoice.speak("I didn't recognize what you said.");
                }
              }
            }
          });
        }else{
          output = ""
          $(this).text("Stop Speaking")
          recognition.start();
        }
        $(this).data('click', 'on');
      }else{
        recognition.stop();
        $(this).data('click', 'off');
      }
    });
  }
})
