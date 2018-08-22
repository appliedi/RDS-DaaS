/// <reference path="jquery.min.js" />

$(document).ready(function () {
    //$('div.dockContainer:visible').parent().addClass('columnBorder');
    var columnHeight = $(window).height();
    columnHeight = columnHeight - 40;
    //$(".dockContainer").height(columnHeight);
    //$(".dockContainer").prev().height(columnHeight);
    $("#btnFeedbackButton").click(function () {
        $("#FeedBackContainer").toggle();
    });
    $(document).click(function (e) {
        e.stopPropagation();
        //check if the clicked area is dropDown or not
        if ($(e.target).hasClass("profile-drop-menu-opener") == true || $(e.target).parent().hasClass("profile-drop-menu-opener") == true || $(e.target).parent().parent().hasClass("profile-drop-menu-opener")) {
            $(".drop-menu").slideToggle(1);
            if ($(".drop-menu").prop("IsShown") != "true") {
                $(".profile-drop-menu-opener").addClass("profile-drop-menu-opener-active");
                $(".drop-menu").prop("IsShown", "true");
                $("#FeedBackContainer").hide();
            }
            else {
                $(".profile-drop-menu-opener").removeClass("profile-drop-menu-opener-active");
                $(".drop-menu").prop("IsShown", "false");
            }
            $(".notification-drop-menu").hide();
            $(".notification-drop-menu-opener").removeClass("notification-drop-menu-opener-active");
            $(".notification-drop-menu").prop("IsShown", "false");
        }
        else if ($(e.target).hasClass("notification-drop-menu-opener") == true || $(e.target).parent().hasClass("notification-drop-menu-opener") == true || $(e.target).parent().parent().hasClass("notification-drop-menu-opener") == true || $(e.target).parent().parent().parent().hasClass("notification-drop-menu-opener") == true)
        {
           $(".notification-drop-menu").slideToggle(1);
           if ($(".notification-drop-menu").prop("IsShown") != "true") {
               $(".notification-drop-menu-opener").addClass("notification-drop-menu-opener-active");
               $(".notification-drop-menu").prop("IsShown", "true");
               $("#trayNotificationCount").text("0");
               $("#hfCountMinus").val("0");
               $("#trayNotificationCount").hide();
           }
           else {
               $(".notification-drop-menu-opener").removeClass("notification-drop-menu-opener-active");
               $(".notification-drop-menu").prop("IsShown", "false");
           }
           $(".drop-menu").hide();
           $(".profile-drop-menu-opener").removeClass("profile-drop-menu-opener-active");
           $(".drop-menu").prop("IsShown", "false");

            $(".notification-drop-menu").unbind("click");
            $(".notification-drop-menu").click(function () {
                return false;
            });
       }
       else {
           $(".drop-menu").hide();
           $(".profile-drop-menu-opener").removeClass("profile-drop-menu-opener-active");
           $(".drop-menu").prop("IsShown", "false");
           $(".notification-drop-menu").hide();
           $(".notification-drop-menu-opener").removeClass("notification-drop-menu-opener-active");
           $(".notification-drop-menu").prop("IsShown", "false");
       }

        if ($(".customConfirmation").is(":visible"))
        {
            $(".customConfirmation").unbind("click");
            $(".customConfirmation").click(function () {
                return false;
            });
            var removeiclassOpenerWithoutAnchor = $(".dockButtonList li");
            if (removeiclassOpenerWithoutAnchor.has(e.target).length === 0) {
                //$('.customConfirmation').hide();
                $('.customConfirmation .BtnClsPadding').each(function () {
                    $('button[type=button]:eq(1)', this).each(function () {
                        $(this).trigger("click");
                    });
                });
            }
        }
       
    })  
});