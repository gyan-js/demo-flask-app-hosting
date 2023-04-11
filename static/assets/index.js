var date = new Date()
let display_date= "Date:" + date.toLocaleDateString()


let predicted_emotion;
$(function () {
    $("#predict_button").click(function () {
        let input_data = {
            "text": $("#text").val()
        }
        $.ajax({
            type: 'POST',
            url: "/predict-emotion",
            data: JSON.stringify(input_data),
            dataType: "json",
            contentType: 'application/json',
            success: function (result) {
                $("#prediction").html(result.data.predicted_emotion)
                $("#emo_img_url").attr('src', result.data.predicted_emotion_img_url);
                $('#prediction').css("display", "");
                $('#emo_img_url').css("display", "");
                predicted_emotion = result.data.predicted_emotion
                pred_emourl = result.data.predicted_emotion_img_url
                $('#save_button').prop('disabled', false);
                
            },
            
        });
    });
    $('#save_button').click(function () {
        save_data = {
            "date": display_date,
            "text": $("#text").val(),
            "emotion": predicted_emotion,
            "emotion_url": pred_emourl
        }
        
        $.ajax({
            type: 'POST',
            url: "/save-entry",
            data: JSON.stringify(save_data),
            dataType: "json",
            contentType: 'application/json',
            success: function () {
                alert("Your entry has been saved")
                window.location.reload()
                localStorage.setItem("Saved Data", save_data)
            },
            //error: function (result) {
               /// alert(result.responseJSON.message)
//}
        })
        
    })

    
 

   document.querySelector('#detect-speech').addEventListener('click', startVoiceRecognition)

   function startVoiceRecognition() {
    
    if(navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOfindexOf('Opera') !== -1){
        Swal.fire({
            icon: 'error',
            title: "Can't use speech recognition !",
            text: "Browser not supported, try using Chrome",
          
          })
    }
    else{
        const recognition = new window.webkitSpeechRecognition()
        recognition.lang = 'en-US'
    
        recognition.onresult = function(event) {
            const resultIndex = event.resultIndex;
            const transcript = event.results[resultIndex][0].transcript;
            const inputField = document.querySelector('#chat-input')
            inputField.value = transcript
            console.log(transcript)
        };
        if(document.querySelector('#detect-speech').innerHTML === 'SPEAK'){
            document.querySelector('#detect-speech').innerHTML = 'STOP'
            recognition.start()
        }
        else{
            document.querySelector('#detect-speech').innerHTML = 'SPEAK'
            recognition.stop()
   
        }
    }
 
   }
        

  $(document).ready(function () {
        $("#display_date").html(display_date)
        $('#save_button').prop('disabled', true);
        displayBot()

       if(navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOfindexOf('Opera') !== -1){
        Swal.fire({
            icon: 'error',
            title: "Browser detected other than Chrome ",
            text: "Some features won't work Ex: speech recognition, fancy scrollbar.etc",
          });
       }
    })

    

    function displayBot() {
        $('.bot-button').click(function () {
            $('.bot-button').css("display", "none")
            $('.chatbox-chat').css("display", "block")
        });
        askBot()
    }

    function askBot() {
        const send_button = document.getElementById('chat-send')

        send_button.addEventListener('click', function () {
            var user_bot_input_text = $("#chat-input").val()
            if (user_bot_input_text != "") {
                $("#chat_messages").append('<div id="user_messages" style="margin: 5px; display: flex; flex-direction: row; background: #E0E0E0;padding: 8px 12px 8px 12px;   color: #000;width: fit-content;max-width: 250px;border-top-left-radius: 20px; border-top-right-radius: 20px; border-bottom-left-radius: 20px;flex-direction: column-reverse; margin-left: auto;"  >' + user_bot_input_text + ' </div>')
                document.querySelector('#chat-input').value = ""
            }
            else{
                $("#chat_messages").append('<div id="user_messages" style="margin: 5px; display: flex; flex-direction: row; background: #E0E0E0;padding: 8px 12px 8px 12px;   color: #000;width: fit-content;max-width: 250px;border-top-left-radius: 20px; border-top-right-radius: 20px; border-bottom-left-radius: 20px;flex-direction: column-reverse; margin-left: auto;"  >' + user_bot_input_text + ' </div>')
                document.querySelector('#chat-input').value = ""
            }

            let chat_input_data = {
                "user_bot_input_text": user_bot_input_text
            }
            $.ajax({
                type: 'POST',
                url: "/bot-response",
                data: JSON.stringify(chat_input_data),
                dataType: "json",
                contentType: 'application/json',
                    success: function (result) {
                     
                        $("#chat_messages").append('<div id="bot_messages">' + result.bot_response + ' </div>')                        
                        $('.chat-container').animate({
                            scrollTop: $('.chat-container')[0].scrollHeight}, 10);
                        
                    },
                    error: function (result) {
                        alert(result.responseJSON.message)
                    }
            });
        })
    }
    $('#chat-input').keypress(function(e){
        //If Enter key(key code is 13) pressed
        if(e.which == 13){         
            $('.chat-send').click();
            document.querySelector('#chat-input').value = ""
        }
    });
});
    
        
       
          //Send message if Enter key(key code is 13) pressed message 
            
        


