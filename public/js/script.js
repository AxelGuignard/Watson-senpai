function toggleSpeechRecognition(element)
{
    let state = element.dataset.state;
    if (state === "off")
    {
        element.dataset.state = "on";
        $(element).css("background-color", "#f39562")
    }
    else
    {
        element.dataset.state = "off";
        $(element).css("background-color", "#f9813a")
    }

    $.ajax({
        url: "/",
        method: "post",
        data: {
            mic: (state === "off" ? "on" : "off")
        },
        dataType: "json",
        success: (data) =>
        {
            let now = new Date();
            $("<div class='container-right'>" +
                "                <p class='user'>You</p>" +
                "                <p>" + data.result + "</p>" +
                "                <span class='time'>" + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0") + "</span>" +
                "            </div>").appendTo($("#chat"));

            if (typeof data.keywords_result["used to"] !== "undefined")
            {
                $("<div class='container-left'>" +
                    "                <p class='user'>WatSen</p>" +
                    "                <p>Congratulation! You used the right tense, \"use to\" indeed become \"used to\" when you put it in past tense. It indicate something that you were doing often in the past but you don't do anymore.</p>" +
                    "                <span class='time'>" + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0") + "</span>" +
                    "            </div>").appendTo($("#chat"));
                $("<div class='container-left'>" +
                    "                <p class='user'>WatSen</p>" +
                    "                <p>Final exercise, say this sentence in the past tense:<br>Where is Brian?</p>" +
                    "                <span class='time'>" + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0") + "</span>" +
                    "            </div>").appendTo($("#chat"));
            }
            else
            {
                $("<div class='container-left'>" +
                    "                <p class='user'>WatSen</p>" +
                    "                <p>You made a mistake, you didn't use the right tense. Try again.</p>" +
                    "                <span class='time'>" + String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0") + ":" + String(now.getSeconds()).padStart(2, "0") + "</span>" +
                    "            </div>").appendTo($("#chat"));
            }
        }
    });
}