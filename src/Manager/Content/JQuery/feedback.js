$(document).ready(function () {
    $("#btnFeedbackButton").click(function () {
        $("#feedBackText").val("");
        $("#screenShotcheckbox").attr('checked', false);
        $("#yesCheckbox").attr('checked', false);
    });

    $("#feedbackClose").click(function(){
        $("#FeedBackContainer").hide();
        $("#feedBackText").val("");

    });
    
    $("#btnFeedback").click(function () {
        
        var comment = $("#feedBackText").val().trim();
        var emotion;
        var screenShot;
        var yesRespond;
        if ($("#Happy").is(":checked")) {
            emotion = true;
        }
        else {
            emotion = false;
        }

        if ($("#yesCheckbox").is(":checked")) {
            yesRespond = true;
        }
        else {
            yesRespond = false;
        }

        if ($("#screenShotcheckbox").is(":checked")) {
            screenShot = true;
        }
        else {
            screenShot = false;
        }
        var url = window.location.href;
        var senderName = localStorage.getItem("LoginName") + "@" + localStorage.getItem("DomainName");
        $("#FeedBackContainer").hide();
        ShowInstantNotification("Progress", "Sending Feedback..", "", "btnFeedback");
        $.get("FeedbackMail", { subscriptionID: data.ApiSubscriptionId, URL: url, sender: senderName, satisfaction: emotion, replyEmail: yesRespond, feedback: comment, IsAttachScreenShot: screenShot }, function (res) {
            $("#feedBackText").val("");
            $("#screenShotcheckbox").attr('checked', false);
            $("#yesCheckbox").attr('checked', false);
            if (res == "success")
            {
                ShowInstantNotification("Success", "Feedback sent", "Thank you for your feedback!", "btnFeedback");
            }
            else {
                ShowInstantNotification("Error", "Failed sending feedback!", res, "btnFeedback");
            }
        });
    });

});