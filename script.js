// Speech to Text (SpeechRecognition)
const textarea = document.getElementById('answer');
var questions = [];
var answers = [];
var questionIndex = 0;
var interviewFinished = false;

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)(); //Skapar ett objekt för röstigenkänning (SpeechRecognition), baserat på stöd i webbläsaren.
recognition.lang = 'en-US';
recognition.lang = 'sv-SE'; 
recognition.continuous = true; //Gör att röstigenkänning fortsätter utan att stoppa mellan meningar.

recognition.onresult = function(event) { //onresult: Funktion som körs när röstigenkänning plockar upp tal. Resultatet (det du sa) lagras i transcript och läggs till i textarea.
  const transcript = event.results[event.resultIndex][0].transcript;
  textarea.value += transcript + ' ';
};

function stopSpeaking(){
  // Stoppar datorns röst (om den "pratar").
  window.speechSynthesis.cancel()
  
  // Hittar elementet på hemsidan som representerar intervjuarens profil.
  const interviewerProfile = document.querySelector('.interviewer');
  
  // Tar bort animationen "speaking_waves" från intervjuarens profil.
  // Animationen kanske ser ut som ljudvågor eller något som rör sig när intervjuaren pratar.
  interviewerProfile.classList.remove('speaking_waves');
}


function startListning() {
  // För säkerhets skull: stänger av eventuell pågående "prat" från datorn.
  stopSpeaking();
  
  // Hittar elementet på hemsidan som representerar användarens profil.
  const userProfile = document.querySelector('.user');
  
  // Lägger till animationen "speaking_waves" till användarens profil.
  // Det visar att användaren pratar och datorn lyssnar.
  userProfile.classList.add('speaking_waves');

  // Gömmer inspelningsknappen eftersom användaren redan spelar in.
  document.getElementById('record-btn').style.display="none";
  
  // Visar istället en stopp-knapp för att användaren ska kunna sluta prata.
  document.getElementById('stop-record-btn').style.display="block";

  // Inaktiverar skicka-knappen eftersom användaren ännu inte är klar med att prata.
  document.getElementById('send-btn').disabled=true;
  
  // Ändrar skicka-knappens färg till grå för att visa att den inte går att använda.
  document.getElementById('send-btn').style.color="grey";
  
  // Startar datorns röstigenkänning så den kan lyssna på vad användaren säger.
  recognition.start();
};


function stopListning() {
  // Hittar användarens profil på hemsidan.
  const userProfile = document.querySelector('.user');
  
  // Tar bort animationen "speaking_waves" från användarens profil.
  // Det visar att användaren inte längre pratar.
  userProfile.classList.remove('speaking_waves');
  
  // Visar inspelningsknappen igen.
  document.getElementById('record-btn').style.display="block";
  
  // Gömmer stopp-knappen eftersom användaren slutat prata.
  document.getElementById('stop-record-btn').style.display="none";
  
  // Aktiverar skicka-knappen så att användaren kan skicka det hen sagt.
  document.getElementById('send-btn').disabled=false;
  
  // Ändrar färgen på skicka-knappen tillbaka till vit för att visa att den är redo att användas.
  document.getElementById('send-btn').style.color="white";
  
  // Stoppar datorns röstigenkänning.
  recognition.stop();
};


/**
 * Asynchronous function to make a POST request to a specified API endpoint.
 * @param {string} url - The API endpoint URL.
 * @param {Object} params - An object containing the parameters to send in the request body.
 * @returns {Object|null} - Returns the JSON response from the API if successful, or null if an error occurs.
 */

async function fetchAPI(url, params) {
  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json' 
      },
      body: JSON.stringify(params) 
  };

  try {
    
      const response = await fetch(url, options);

    
      if (!response.ok) {
   
          const errorResponse = await response.json();
          alert(`Error: ${errorResponse.error}`);
          return null; 
      }

    
      return await response.json();
  } catch (error) {
      
      alert(`Network error: ${error.message}`);
      return null; 
  }
}


function showQuestion(){
  if (questionIndex < questions.length) {
    if (questions) {
      const language = document.getElementById('language').value;
      const image = "images/interviwer.webp";
      className = "interviewer-message-row"
      message = questions[questionIndex++].replace(/^\d+\.\s*/, '');
      displayMessage(image, className, message);

      speak(message, language);
    }
  }else{
    thanksAndGoodBy()
  }
}

async function getInterviewQuestions(){
  const language = document.getElementById('language').value;
  const field = document.getElementById('field').value;
  const user_info = document.getElementById('user-info').value;
  const job_des = document.getElementById('job-des').value;

  if (!language || !field) {
      alert("Please select a language and specify the field or career.");
      return;
  }
  const url = 'http://127.0.0.1:5000/get-interview-questions';
  const params = { language, field, user_info, job_des };

  questionsResponse = await fetchAPI(url, params);
  questions = questionsResponse.response.split('\n')
}

function testVoice() {
  const language = document.getElementById('language').value;
  const selectedVoiceName = document.getElementById('voice-select').value;

  // Check if both language and voice are selected
  if (!language) {
      alert("Please select a language first.");
      return;
  }
  if (!selectedVoiceName) {
      alert("Please select a voice to test.");
      return;
  }

  const selectedVoice = voices.find(voice => voice.name === selectedVoiceName); // Match by name
  if (!selectedVoice) {
      alert("Selected voice not found.");
      return;
  }

  // Determine the sample text based on the language
  let sampleText = "This is a voice demonstration. Let us know if this voice suits your preferences."; // Default to English
  if (language === "sv-SE") {
      sampleText = "Det finns bara en röst att välja på. Men oroa dig inte, den är ändå fantastisk!";
  }

  // Create a SpeechSynthesisUtterance for the sample text
  const msg = new SpeechSynthesisUtterance(sampleText);
  msg.lang = language;
  msg.voice = selectedVoice;

  // Speak the sample text
  window.speechSynthesis.speak(msg);
}



async function startInterview() {
  const language = document.getElementById('language').value;
  const voice = document.getElementById('voice-select').value;
  const field = document.getElementById('field').value;
  const user_info = document.getElementById('user-info').value;
  const job_des = document.getElementById('job-des').value;

  if (!language || !voice || !field) {
      alert("Please select a language, voice and specify the field or career.");
      return;
  }

  const url = 'http://127.0.0.1:5000/get-interview-greeting';
  const params = { language, field, user_info, job_des };

  const greeting = await fetchAPI(url, params);
  if (greeting) {
      openModal();

      const image = "images/interviwer.webp";
      className = "interviewer-message-row"
      message = greeting;
      displayMessage(image, className, message);

      speak(greeting, language, true);
      await getInterviewQuestions()
  }
}

async function thanksAndGoodBy() {
  const language = document.getElementById('language').value;
  const field = document.getElementById('field').value;
  const user_info = document.getElementById('user-info').value;
  const job_des = document.getElementById('job-des').value;

  if (!language || !field) {
      alert("Please select a language and specify the field or career.");
      return;
  }

  const url = 'http://127.0.0.1:5000/get-interview-thanks-and-goodbye';
  const params = { language, field, user_info, job_des, questions, answers };
  const goodbye = await fetchAPI(url, params);
  if (goodbye) {
      interviewFinished = true;
      openModal();

      const image = "images/interviwer.webp";
      className = "interviewer-message-row"
      message = goodbye.replace(/\[.*?\]/g, '')
      .trim();
      displayMessage(image, className, message);

      speak(message, language);
  }
}

function enableChatButtons(value) {
  const chatButtons = document.querySelectorAll('.chat-button'); 
  chatButtons.forEach(button => {
    button.disabled = !value; 
    button.style.color = value ? "white" : "grey"; 
  });
}

// Global variable to store voices
let voices = [];

// Fetch available voices
function populateVoiceList() {
    voices = window.speechSynthesis.getVoices();
    updateVoiceList();
}

// Update the voice list dynamically based on the selected language
function updateVoiceList() {
    const languageSelect = document.getElementById('language');
    const selectedLanguage = languageSelect.value; // Get the selected language
    const voiceSelect = document.getElementById('voice-select');

    if (!selectedLanguage) {
        // Disable the voice list if no language is selected
        voiceSelect.innerHTML = '<option value="">-- Select a Language First --</option>';
        voiceSelect.disabled = true;
        return;
    }

    // Enable the voice list and filter voices based on the selected language
    voiceSelect.disabled = false;
    voiceSelect.innerHTML = '<option value="">-- Select a Voice --</option>'; // Reset options

    // Filter voices based on the selected language
    const filteredVoices = voices.filter(voice => voice.lang.startsWith(selectedLanguage));
    filteredVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = voice.name; // Use the voice's name as the value
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [Default]' : ''}`;
        voiceSelect.appendChild(option);
    });

    // Show a message if no voices are available for the selected language
    if (voiceSelect.options.length === 1) {
        const noVoiceOption = document.createElement('option');
        noVoiceOption.value = "";
        noVoiceOption.textContent = "No voices available for the selected language";
        voiceSelect.appendChild(noVoiceOption);
    }
}

function speak(text, language, readFirstQuestion = false) {
  window.speechSynthesis.cancel();
  enableChatButtons(false)
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = language
  
  // Get the selected voice from the dropdown
  const selectedVoiceName = document.getElementById('voice-select').value;
  const selectedVoice = voices.find(voice => voice.name === selectedVoiceName); // Match by name
  if (selectedVoice) {
      msg.voice = selectedVoice;
  } else {
      console.warn("No matching voice found. Using the default voice.");
  }

  const interviewerProfile = document.querySelector('.interviewer');
  const pulseIntensity = 0.8;
  interviewerProfile.style.setProperty('--pulse-speed', `${pulseIntensity}s`);

  interviewerProfile.classList.add('speaking_waves');
  msg.onend = () => {
      interviewerProfile.classList.remove('speaking_waves');
      if(readFirstQuestion === true){
        showQuestion()
      }else{
        if(!interviewFinished) enableChatButtons(true)
      }
  };
  window.speechSynthesis.speak(msg);
}

// Event listener to update voices when language changes
document.getElementById('language').addEventListener('change', updateVoiceList);

// Initialize the voices when the page loads
window.onload = () => {
    populateVoiceList();

    // Ensure voices are updated dynamically if loaded asynchronously
    if (typeof speechSynthesis !== 'undefined') {
        speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Disable voice list initially
    document.getElementById('voice-select').disabled = true;
};




function openModal() {
    document.getElementById('interview-modal').style.display = 'flex';
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('interview-modal').style.display = 'none';
    document.getElementById('modal-overlay').style.display = 'none';
}

function endInterview() {
  stopListning()
  stopSpeaking()
  const chatBody = document.getElementById('chat-body');
  chatBody.innerHTML=""
  document.getElementById('answer').value=""
  questions = [];
  answers = [];
  questionIndex = 0;
  interviewFinished = false;
  closeModal();
}

function displayMessage(image, className, message){

  const chatBody = document.getElementById('chat-body');

  var userImage = document.createElement('img');
  userImage.src = image

  var imageDiv = document.createElement('div');
  imageDiv.className='image-div'
  imageDiv.appendChild(userImage)

  var textMessage = document.createElement('div');
  textMessage.className="message "
  textMessage.innerText=message;


  var userMessageRow = document.createElement('div');
  userMessageRow.className=className
  userMessageRow.appendChild(imageDiv)
  userMessageRow.appendChild(textMessage)


  chatBody.appendChild(userMessageRow);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function sendAnswer(){
  const language = document.getElementById('language').value;
  const field = document.getElementById('field').value;
  var answer = document.getElementById('answer');
  if(answer.value.trim() !== ''){    
    const image = "images/user.png";
    className = "user-message-row"
    message=textarea.value;
    textarea.value="";
    displayMessage(image, className, message);

    const url = 'http://127.0.0.1:5000/analyse-the-answer';
    const answer_value = message
    answers.push(answer_value)
    const params = { language, field, answer_value };
  
    const feedback = await fetchAPI(url, params);
    if (feedback.response) {
        openModal();
  
        const image = "images/interviwer.webp";
        className = "interviewer-message-row"
        message = feedback.response;
        displayMessage(image, className, message);
  
        speak(message, language, true);
    }


  }
}
