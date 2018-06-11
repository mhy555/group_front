import helper from './helper.js'
export default {
  RecognizerSetup: function(SDK, recognitionMode, language, format, subscriptionKey) {
      let recognizerConfig = new SDK.RecognizerConfig(
          new SDK.SpeechConfig(
              new SDK.Context(
                  new SDK.OS(navigator.userAgent, "Browser", null),
                  new SDK.Device("SpeechSample", "SpeechSample", "1.0.00000"))),
          recognitionMode, // SDK.RecognitionMode.Interactive  (Options - Interactive/Conversation/Dictation)
          language, // Supported languages are specific to each recognition mode Refer to docs.
          format); // SDK.SpeechResultFormat.Simple (Options - Simple/Detailed)

      // Alternatively use SDK.CognitiveTokenAuthentication(fetchCallback, fetchOnExpiryCallback) for token auth
      let authentication = new SDK.CognitiveSubscriptionKeyAuthentication(subscriptionKey);

      return SDK.CreateRecognizer(recognizerConfig, authentication);
  },


  RecognizerStart: function(recognizer) {
    console.log('test');
      recognizer.Recognize((event) => {
          /*
              Alternative syntax for typescript devs.
              if (event instanceof SDK.RecognitionTriggeredEvent)
          */
          console.log('event', event);
          switch (event.Name) {
              case "RecognitionTriggeredEvent" :
                  // helper.UpdateStatus("Initializing");
                  console.log("Initializing");
                  break;
              case "ListeningStartedEvent" :
                  // helper.UpdateStatus("Listening");
                  console.log("Listening");
                  break;
              case "RecognitionStartedEvent" :
                  // helper.UpdateStatus("Listening_Recognizing");
                  console.log("Listening_Recognizing");
                  break;
              case "SpeechStartDetectedEvent" :
                  // helper.UpdateStatus("Listening_DetectedSpeech_Recognizing");
                  console.log("Listening_DetectedSpeech_Recognizing");
                  console.log(JSON.stringify(event.Result)); // check console for other information in result
                  break;
              case "SpeechHypothesisEvent" :
                  // helper.UpdateRecognizedHypothesis(event.Result.Text);
                  console.log(JSON.stringify(event.Result)); // check console for other information in result
                  break;
              case "SpeechFragmentEvent" :
                  // helper.UpdateRecognizedHypothesis(event.Result.Text);
                  console.log(JSON.stringify(event.Result)); // check console for other information in result
                  break;
              case "SpeechEndDetectedEvent" :
                  // helper.OnSpeechEndDetected();
                  // helper.UpdateStatus("Processing_Adding_Final_Touches");
                  console.log("Processing_Adding_Final_Touches");
                  console.log(JSON.stringify(event.Result)); // check console for other information in result
                  break;
              case "SpeechSimplePhraseEvent" :
                  helper.UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                  break;
              case "SpeechDetailedPhraseEvent" :
                  helper.UpdateRecognizedPhrase(JSON.stringify(event.Result, null, 3));
                  break;
              case "RecognitionEndedEvent" :
                  // helper.OnComplete();
                  // helper.UpdateStatus("Idle");
                  console.log("Idle");
                  console.log(JSON.stringify(event)); // Debug information
                  break;
          }
      })
      .On(() => {
          // The request succeeded. Nothing to do here.
      },
      (error) => {
          console.error(error);
      });
  },

  RecognizerStop: function(recognizer) {
      // recognizer.AudioSource.Detach(audioNodeId) can be also used here. (audioNodeId is part of ListeningStartedEvent)
      recognizer.AudioSource.TurnOff();
  }

}
