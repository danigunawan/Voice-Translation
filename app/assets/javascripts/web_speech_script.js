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

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event) {
              //
              // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
              // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
              // It has a getter so it can be accessed like an array
              // The [last] returns the SpeechRecognitionResult at the last position.
              // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
              // These also have getters so they can be accessed like arrays.
              // The [0] returns the SpeechRecognitionAlternative at position 0.
              // We then return the transcript property of the SpeechRecognitionAlternative object
        var last = event.results.length - 1;
        var received_speech = event.results[last][0].transcript;
              // diagnostic.textContent = 'Result received: ' + color + '.';
              // bg.style.backgroundColor = color;
              // responsiveVoice.speak(color);
        output = output + " " + received_speech
        user_input = output
        recognition.stop();
        // console.log('Confidence: ' + event.results[0][0].confidence);
    }

    recognition.onend = function() {
      // responsiveVoice.speak("We are no longer recording");
      user_input = output
      $.ajax({
        type: 'get',
        url: '/translate',
        data: {
          input: output,
          language: chosen_language
        },
        dataType: "json",
        success: function(result){
          if(result['code'] == 200 && result['text'][0].length > 0){
            if(result['lang'].length > 0){
              chosen_language == result['lang']
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
          }else if (result['code'] !== '200' ){
            responsiveVoice.speak(result['message'])
          }
        }
      });
      recognition.stop();
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
              language: chosen_language
            },
            dataType: "json",
            success: function(result){
              if(result['code'] == 200 && result['text'][0].length > 0){
                if(result['lang'].length > 0){
                  chosen_language == result['lang']
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
              }else if (result['code'] !== '200' ){
                responsiveVoice.speak(result['message'])
              }
            }
          });
        }else{
          output = ""
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
