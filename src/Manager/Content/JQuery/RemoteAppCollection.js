data.ApiUrl = localStorage.getItem("data_ApiUrl");
data.loginRedirect = localStorage.getItem("data_loginRedirect");
var Deployname = localStorage.getItem("CB");
var status = localStorage.AppBreadcrumbs;
var selectedCollectionName = "";
var selectedCollectionNavName = "";
var CollectionResourceType;
var selectedCollectionResourceType = "";
var IsDisabledRDSCollectionSetting = 0;
var SelectedRDVirtualMachine = "";
var SelectedUsers = "";
var userprofilediskButtonSelection;
var sendMessageState = 0;
var sendMessageStateVM = 0;
var SelectedUsergroupName = "";
var serverselectmodel = {
    serverselect: null
};

var IsAlternateVirtualMachine = 0;
data.selectedCollectionUserlist = ko.observableArray('');
data.userlist = ko.observableArray('');
data.userNamelist = ko.observableArray('');
var viewModelAppUsersScreen7CreateNewUser = {
    appUsersScreen7CreateNewUser: null
};

//Show Active Session
var viewModelActiveSession = {
    activeSession: null
};
//view model for essential data 
var viewModelessentials = {
    essentialloop: null
};

var viewModelessentialsSubscription = {
    essentialloopSubscription: null
};

//View Collection Ajax call

var myViewCollectionViewModel = {
    myviewCollection: null,
    items: null
};
$(window).load(function () {
    // Animate loader off screen
});

//Filter Variables
var RDSCollectionsArray = [];
var AppsCollectionArray = [];
var UserCollectionArray = [];
var SessionCollectionArray = [];
var VMCollectionArray = [];
var AddUserCollectionArray = [];
var UserGroupArray = [];


function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

    var offset = date.getTimezoneOffset() / 60;
    var hours = parseInt(date.getHours()) + 1

    newDate.setHours(hours - offset);

    return newDate;
}




function AddBreadcrumb(breadcrumbName, divID, parentDivID) {
    try {
        RemoveBreadcrumb(parentDivID);
        var prevBreadcrumbHtml = $(".app-breadcrumb").html();
        var forwardMarker = "<span id=\"forwardMarker_" + divID + "\"><svg viewBox=\"0 0 9 12\" class=\"msportalfx-svg-placeholder\" role=\"presentation\" focusable=\"false\" xmlns:svg=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" style=\"font-size:15px;\"><g><path d=\"M1 8.1l.7.8L6 4.6l4.3 4.3.7-.8-5-5z\"></path></g></svg> </span>";
        var newTitle = " <a href=\"#\" id=\"bladeid_" + divID + "\" onclick=\"NavigateToBlade('" + divID + "')\">" + breadcrumbName + "</a>";
        $(".app-breadcrumb").html(prevBreadcrumbHtml + forwardMarker + newTitle);
    }
    catch (ex) { }
}
function RemoveBreadcrumb(parentDivID) {
    try {
        var isFoundTitle = 0;
        $(".app-breadcrumb a").each(function () {
            var thisID = $(this).attr("id");
            thisID = thisID.split("_")[1];
            if (isFoundTitle == 1) {
                $("#forwardMarker_" + thisID + "").remove();
                $(this).remove();
            }
            else {
                if (thisID.toLowerCase() == parentDivID.toLowerCase()) {
                    isFoundTitle = 1;
                }
            }
        });
    }
    catch (ex) { }
}
function NavigateToBlade(myID) {
    var windowWidth = $(".rds-container").scrollLeft();
    var fromLeft = $("#" + myID).offset().left;
    var needToScroll = parseInt(windowWidth) + parseInt(fromLeft);
    $(".rds-container").scrollLeft(needToScroll);
}

function ScrollToHorizontalEnd(widthToAdd) {
    var prevWidth = $(".rds-container").width();
    prevWidth += widthToAdd + 1100;
    $(".rds-container").scrollLeft(prevWidth);
}
function ShowInstantNotification(TypeOfAction, ActionTitle, ActionText, ContainerID) {
    var dynHTML = "";
    var dt = new Date();
    var h = dt.getHours(), m = dt.getMinutes();
    if (h > 12) {
        h = h - 12;
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        var time = (h + ':' + m + ' PM');
    }
    else {
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        var time = (h + ':' + m + ' AM');
    }
  
    //  var time = (h) ? (h + ':' + m + ' AM') : (h + ':' + m + ' PM');

    if (TypeOfAction == "Progress") {
        $("#InstantNotification-Container-ProgressAlert #ActionTitle").text(ActionTitle);
        $("#InstantNotification-Container-ProgressAlert #ActionTime").text(time);
        dynHTML = $("#InstantNotification-Container-ProgressAlert").html();
    }
    else if (TypeOfAction == "Success") {
        $("#InstantNotification-Container-SuccessAlert #ActionTitle").text(ActionTitle);
        $("#InstantNotification-Container-SuccessAlert #ActionTime").text(time);
        $("#InstantNotification-Container-SuccessAlert #ActionText").text(ActionText);
        dynHTML = $("#InstantNotification-Container-SuccessAlert").html();
    }
    else if (TypeOfAction == "Error") {
        $("#InstantNotification-Container-ErrorAlert #ActionTitle").text(ActionTitle);
        $("#InstantNotification-Container-ErrorAlert #ActionTime").text(time);
        $("#InstantNotification-Container-ErrorAlert #ActionText").text(ActionText);
        dynHTML = $("#InstantNotification-Container-ErrorAlert").html();
    }
    $("#inst_" + ContainerID + " .instant-notification").remove();
    var holderStr = "<div id=\"inst_" + ContainerID + "\">" + dynHTML + "</div>";
    $("#InstantNotification-Container-Actual").append(holderStr);
    var curHeight = 0;
    $("#InstantNotification-Container-Actual .instant-notification").each(function () {
        if ($(this).is(':visible') == true) {
            curHeight = parseFloat(curHeight) + parseFloat($(this).height()) + 15;
        }
    });
    curHeight = parseFloat(curHeight) + 50;
    $("#inst_" + ContainerID + " .instant-notification").css("top", curHeight + "px");
    $("#inst_" + ContainerID + " .instant-notification").show();
    $("#inst_" + ContainerID + " .instant-notification .closeNotificationIcon").click(function () {
        $("#inst_" + ContainerID + " .instant-notification").hide();
    });
    PushNotificationTray(TypeOfAction, ActionTitle, ActionText, ContainerID);
    //if (TypeOfAction != "Progress") {
    $("#inst_" + ContainerID + " .instant-notification").delay(2000).fadeOut(300);
    // }
}

function PushNotificationTray(TypeOfAction, ActionTitle, ActionText, ContainerID) {
    if ($("#noNotification").length > 0) {
        $("#noNotification").remove();
    }
    var dt = new Date();
    var h = dt.getHours(), m = dt.getMinutes();
    if (h > 12) {
        h = h - 12;
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        var time = (h + ':' + m + ' PM');
    }
    else {
        if (h < 10) {
            h = "0" + h;
        }
        if (m < 10) {
            m = "0" + m;
        }
        var time = (h + ':' + m + ' AM');
    }
   
    //  var time = (h) ? (h + ':' + m + ' AM') : (h + ':' + m + ' PM');
    if (TypeOfAction == "Progress") {
        $("#PushNotificationItem-progress_item #ActionTitle").text(ActionTitle);
        $("#PushNotificationItem-progress_item #ActionTime").text(time);
        dynHTML = $("#PushNotificationItem-progress_item").html();
    }
    else if (TypeOfAction == "Success") {
        $("#PushNotificationItem-success_item #ActionTitle").text(ActionTitle);
        $("#PushNotificationItem-success_item #ActionTime").text(time);
        $("#PushNotificationItem-success_item #ActionText").text(ActionText);
        dynHTML = $("#PushNotificationItem-success_item").html();
    }
    else if (TypeOfAction == "Error") {
        $("#PushNotificationItem-error_item #ActionTitle").text(ActionTitle);
        $("#PushNotificationItem-error_item #ActionTime").text(time);
        $("#PushNotificationItem-error_item #ActionText").text(ActionText);
        dynHTML = $("#PushNotificationItem-error_item").html();
    }

    if (TypeOfAction != "Progress") {
        $("#push_" + ContainerID + "").remove();
        $("#hfCountMinus").val((parseInt($("#hfCountMinus").val()) - 1));
    }
    var holderStr = "";
    var strTrayNotificationCount = $("#PushNotification-Container-Actual li").length;
    if (strTrayNotificationCount >= 1) {
        holderStr = "<li id=\"push_" + ContainerID + "\" style=\"padding-bottom:20px;\">" + dynHTML + "</li>";
    }
    else {
        var holderStr = "<li id=\"push_" + ContainerID + "\">" + dynHTML + "</li>";
    }
    $("#PushNotification-Container-Actual").prepend(holderStr);
    $("#hfCountMinus").val((parseInt($("#hfCountMinus").val()) + 1));
    $("#trayNotificationCount").text($("#hfCountMinus").val());
    if (parseInt($("#hfCountMinus").val()) > 0) {
        $("#trayNotificationCount").show();
    }
    else {
        $("#trayNotificationCount").hide();
    }

}
function manageEnableDisableRDVM(status) {
    if (status.toLowerCase() == "state_active") {
        $("#enablerdservertenant").attr("disabled", true);
    }
    else if (status.toLowerCase() == "state_unassigned") {
        $("#enablerdservertenant").attr("disabled", true);
        $("#disablerdservertenant").attr("disabled", true);
    }
    else if (status.toLowerCase() == "state_drain") {
        $("#disablerdservertenant").attr("disabled", true);
    }
}
function ChangeScaleStatus(status) {
    var operationText = "";
    $.ajax({
        url: data.ApiUrl + "admin/UpdateScale/" + Deployname + "/" + selectedCollectionName + "/" + status,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            if (status == "true") {
                operationText = "Enabling scale '" + selectedCollectionName + "'...";
                $("#brustconfig input[type!='submit']").attr("disabled", false);
            }
            else {
                operationText = "Disabling scale '" + selectedCollectionName + "'...";
                $("#brustconfig input[type!='submit']").attr("disabled", true);
            }
            ShowInstantNotification("Progress", operationText, "", "ChangeScaleStatus")
        },
        success: function (res) {
            if (status == "true") {
                operationText = "Scale '" + selectedCollectionName + "' enabled successfully..";
                $("#tblRDSCollection tbody tr[class='AppImageName'] .Burst").text("true");
            }
            else {
                operationText = "Scale '" + selectedCollectionName + "' disabled successfully..";
                $("#tblRDSCollection tbody tr[class='AppImageName'] .Burst").text("false");
            }
            ShowInstantNotification("Success", "Scale status changed...", operationText, "ChangeScaleStatus")
        },
        complete: function () {
        },
        error: function (error) {
            ShowInstantNotification("Error", "Failed in changing scale status ...", "Could not change scale '" + selectedCollectionName + "' status to '" + status + "'.", "ChangeScaleStatus")
            console.log("ERROR:", error);
            LogError(data.ApiSubscriptionId, "Change Scale Status", error);
        }
    });
}

function LogError(subID, mtd, err) {
    $.post("ErrorLog", { subscriptionID: "" + subID + "", method: "" + mtd + "", error: "" + JSON.stringify(err) + "" }, function () { });
}


/* Function */
function sendMessageAllUser() {
    var sessionAll = "";
    var serverAll = "";
    $("#ActivesSessionCls tbody tr").each(function () {
        sessionAll += $(".UnifiedSessionID", this).text().trim() + ",";
        serverAll += $(".HostServer", this).text().trim() + ",";
    });
    if (sessionAll != "") {
        sessionAll = sessionAll.substring(0, sessionAll.length - 1);
    }
    if (serverAll != "") {
        serverAll = serverAll.substring(0, serverAll.length - 1);
    }
    var sendmessageserver =
                       {
                           MessageToSesions:
                                              {
                                                  MessageTitle: $('#msgtitle').val(), MessageBody: $('#comment').val(), HostServer: serverAll, UnifiedSessionID: sessionAll
                                              }
                       }

    var jsonData = JSON.stringify(sendmessageserver);
    console.log(data.ApiUrl + "subscriptions/" + data.ApiSubscriptionId + "/processes");
    $.ajax({
        url: data.ApiUrl + "admin/SendMessageToSessions/" + data.ApiSubscriptionId,
        type: "POST",
        crossDomain: true,
        dataType: "json",
        data: jsonData,
        beforeSend: function () {
            ShowInstantNotification("Progress", "Sending message to all available sessions...", "", "sendMessageAllUser");
        },
        success: function (res) {
            $("#comment").val('');
            $("#msgtitle").val('');
            ShowInstantNotification("Success", "Successfully sent message...", "Messaging succesfully sent to all available sessions.", "sendMessageAllUser");
        },
        complete: function () {
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Send Message All Available Sessions", error);
            ShowInstantNotification("Error", "Failed sending message...", "Could not sent message to all available sessions ...", "sendMessageAllUser");
            console.log("ERROR:", error);

        }
    });
    $("#selectedUserName option:first").text("");
    document.getElementById("msgtitle").value = "";
    document.getElementById("comment").value = "";
}

function sendMessageSelectedUser() {
    var thisSelName = $("#selectedUserName option:selected").text().trim();
    var sendmessageserver =
                            {
                                "commandName": "sendmessagesession",
                                "data":
                                {
                                    "HostServer": $("#ActivesSessionCls tr[class='AppImageName'] .HostServer").text().trim(), //data.selectedCollectionUserlist().HostServer,
                                    "MessageTitle": $('#msgtitle').val(),
                                    "MessageBody": $('#comment').val(),
                                    "ConnectionBroker": data.ConnectionBroker,
                                    "UnifiedSessionID": $("#ActivesSessionCls tr[class='AppImageName'] .UnifiedSessionID").text().trim()
                                }
                            }

    var jsonData = JSON.stringify(sendmessageserver);
    console.log(data.ApiUrl + "subscriptions/" + data.ApiSubscriptionId + "/processes");
    $.ajax({
        url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
        type: "POST",
        crossDomain: true,
        dataType: "json",
        data: jsonData,
        beforeSend: function () {
            ShowInstantNotification("Progress", "Sending message to " + thisSelName + "...", "", "sendMessageSelectedUser");
        },
        success: function (res) {
            $("#sendmessageshowclick").removeClass("activeDocBtn");
            $("#comment").val('');
            $("#sendmessage").hide();
            $("#ActivesSessionCls tbody tr").removeClass("active");
            ShowInstantNotification("Success", "Successfully sent message...", "Message successfully sent to '" + thisSelName + "' user.", "sendMessageSelectedUser");
        },
        complete: function () {
            document.getElementById("msgtitle").value = "";
            document.getElementById("comment").value = "";

        },
        error: function (error) {
            ShowInstantNotification("Error", "Failed sending message...", "Could not sent message to '" + thisSelName + "'.", "sendMessageSelectedUser");
            LogError(data.ApiSubscriptionId, "Send Message to Selected User", error);
            console.log("ERROR:", error);
        }
    });
}

function sendMessageSelectedUserVM(servername) {
    if (document.getElementById("msgtitleVM").value != "" && document.getElementById("commentVM").value != '') {
        $("#rdservererroricon").hide();
        $("#errorvmmessage").hide();
        $("#msgtitleVM").removeClass('redborder');
        var sendmessageserver =
                           {
                               "commandName": "sendmessageserver",
                               "data":
                               {
                                   "HostServer": servername,
                                   "MessageTitle": $('#msgtitleVM').val(),
                                   "MessageBody": $('#commentVM').val(),
                                   "ConnectionBroker": data.ConnectionBroker
                               }
                           }

        var jsonData = JSON.stringify(sendmessageserver);
        console.log(data.ApiUrl + "subscriptions/" + data.ApiSubscriptionId + "/processes");
        $.ajax({
            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                ShowInstantNotification("Progress", "Sending message to '" + servername + " RD VM'...", "", "sendMessageSelectedUserVM");
            },
            success: function (res) {
                document.getElementById("msgtitleVM").value = "";
                document.getElementById("commentVM").value = "";
                ShowInstantNotification("Success", "Successfully sent message...", "Message succesfully sent to '" + servername + "' RD VM.", "sendMessageSelectedUserVM");
            },
            complete: function () {
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Send Message to Server", error);
                ShowInstantNotification("Error", "Error sending message...", "Message sending failed to'" + servername + "' RD VM.", "sendMessageSelectedUserVM");
                console.log("ERROR:", error);
            }
        });
    }
    else {
        if ($("#msgtitleVM").val().trim() == "") {
            $("#rdservererroricon").show();
            $("#msgtitleVM").addClass('redborder');
            $("#errorvmmessage").show();
        }
        else {
            $("#errorvmmessage").show();
        }
    }
}

function sendMessageAllUserVM() {
    var strHostServer = "";
    $("#serverlistselectid tbody tr").each(function () {
        strHostServer += $(this).find("td").eq(0).text().trim() + ",";
    });
    if (strHostServer != "") {
        strHostServer = strHostServer.substring(0, strHostServer.length - 1);
    }
    var sendmessageserver =
                       {
                           MessageToServer: { MessageTitle: $('#msgtitleVM').val(), MessageBody: $('#commentVM').val(), ServerNames: strHostServer }
                       }

    var jsonData = JSON.stringify(sendmessageserver);
    $.ajax({
        url: data.ApiUrl + "admin/SendMessageToServers/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/type",
        type: "POST",
        crossDomain: true,
        dataType: "json",
        data: jsonData,
        beforeSend: function () {
            ShowInstantNotification("Progress", "Sending message to all RD VM...", "", "sendMessageAllUserVM");
        },
        success: function (res) {
            document.getElementById("msgtitleVM").value = "";
            document.getElementById("commentVM").value = "";
            ShowInstantNotification("Success", "Successfully sent message...", "Message sent succesfully to all RD VM.", "sendMessageAllUserVM");
        },
        complete: function () {
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Send Message to All RD VM", error);
            ShowInstantNotification("Error", "Error sending message...", "Failed sending message to all RD VM.", "sendMessageAllUserVM");
            console.log("ERROR:", error);
        }
    });
    $("#selectedUserNameVM option:first").text("");
    document.getElementById("msgtitleVM").value = "";
    document.getElementById("commentVM").value = "";
}

function LoadRDSColletion() {
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetCollections/" + data.ApiSubscriptionId + "/" + Deployname + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#tblRDSCollection tbody").html('');
            $("#collectionLoadSpinner").show();
        },
        success: function (res) {
            RDSCollectionsArray = [];
            try {
                if (res.length > 0) {
                    $("#tblRDSCollection tbody").html('');
                    for (var i = 0; i < res.length; i++) {
                        RDSCollectionsArray.push({
                            Name: res[i].Name,
                            CollectionType: res[i].CollectionType,
                            Size: res[i].Size,
                            Burst: res[i].Burst,
                            Description: res[i].Description
                        });
                        $("#myviewCollectionDiv .rowTemplate .NavName").text(res[i].NavName);
                        $("#myviewCollectionDiv .rowTemplate .Name").text(res[i].Name);
                        $("#myviewCollectionDiv .rowTemplate .CollectionType").text(res[i].ResourceType);
                        $("#myviewCollectionDiv .rowTemplate .Size").text(res[i].Size);
                        $("#myviewCollectionDiv .rowTemplate .Burst").text(res[i].Burst);
                        $("#myviewCollectionDiv .rowTemplate .Description").text(res[i].Description);

                        var rowTemplate = $("#myviewCollectionDiv .rowTemplate .dataRow tbody").html();
                        $("#tblRDSCollection tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#myviewCollectionDiv .rowTemplate .blankRow tbody").html();
                    $("#tblRDSCollection tbody").append(rowTemplate);
                }
                $("#tblRDSCollection tbody tr[class!='nodata'][class!='nodata InactiveRow']").unbind("");
                $("#tblRDSCollection tbody tr[class!='nodata'][class!='nodata InactiveRow']").click(function () {
                    //if ($(this).hasClass("AppImageName")) {
                    //    $("#appUserCloseBlade").trigger("click");
                    //    $(this).removeClass('AppImageName');
                    //    $(".rightArrIcon", this).hide();
                    //}
                    //else {
                    $("#CreateCollectionBladeCloseIcon").trigger("click");
                    $("#appUserCloseBlade").trigger("click");
                    $('#tblRDSCollection tbody tr').removeClass('AppImageName');
                    if ($(this).prop("class").indexOf("nodata") < 0) {
                        $(this).addClass('AppImageName');
                        $(".rightArrIcon").hide();
                        $(".rightArrIcon", this).show();
                        CollectionNameSelect();
                    }
                    //}
                });
                if (res.length < 1) {
                    $("#appsuserslist").show();
                    // $("#RDSHomeDiv").show();
                    // $("#CreateCollectionBlade").show();
                    $("#addCollection").trigger("click");
                    $("#collectionHeader").hide();
                    $(".se-pre-con").hide();
                }
                else {
                    $("#collectionHeader").show();
                    $("#collectionHeader1").show();
                    //$("#emptyLine").hide();
                    $(".se-pre-con").hide();
                }
            }
            catch (er) {
                var rowTemplate = $("#myviewCollectionDiv .rowTemplate .blankRow tbody").html();
                $("#tblRDSCollection tbody").append(rowTemplate);
            }

        },
        error: function (error) {
            // Log any error.
            $("#collectionLoadSpinner").hide();
            myviewCollectionModal.style.display = "block";
            LogError(data.ApiSubscriptionId, "Load Collections", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            $(".rds-container").show();
            $("#collectionLoadSpinner").hide();
        }
    });
}

function LoadRDSCollectionAfterCreate(colNew) {
    $.ajax({
        url: data.ApiUrl + "admin/GetCollections/" + Deployname + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
        },
        success: function (res) {
            RDSCollectionsArray = [];
            if (res.length > 0) {
                $("#tblRDSCollection tbody").html('');
                for (var i = 0; i < res.length; i++) {
                    RDSCollectionsArray.push({
                        Name: res[i].Name,
                        CollectionType: res[i].CollectionType,
                        Size: res[i].Size,
                        Burst: res[i].Burst,
                        Description: res[i].Description
                    });
                    $("#myviewCollectionDiv .rowTemplate .Name").text(res[i].Name);
                    $("#myviewCollectionDiv .rowTemplate .CollectionType").text(res[i].CollectionType);
                    $("#myviewCollectionDiv .rowTemplate .Size").text(res[i].Size);
                    $("#myviewCollectionDiv .rowTemplate .Burst").text(res[i].Burst);
                    $("#myviewCollectionDiv .rowTemplate .Description").text(res[i].Description);

                    var rowTemplate = $("#myviewCollectionDiv .rowTemplate .dataRow tbody").html();
                    $("#tblRDSCollection tbody").append(rowTemplate);
                }
            }
            else {
                var rowTemplate = $("#myviewCollectionDiv .rowTemplate .blankRow tbody").html();
                $("#tblRDSCollection tbody").append(rowTemplate);
            }

            $("#tblRDSCollection tbody tr[class!='nodata'][class!='nodata InactiveRow']").click(function () {
                //if ($(this).hasClass("AppImageName")) {
                //    $("#appUserCloseBlade").trigger("click");
                //    $(this).removeClass('AppImageName');
                //    $(".rightArrIcon", this).hide();
                //}
                //else {
                $("#CreateCollectionBladeCloseIcon").trigger("click");
                $("#appUserCloseBlade").trigger("click");
                $('#tblRDSCollection tbody tr').removeClass('AppImageName');
                if ($(this).prop("class").indexOf("nodata") < 0) {
                    $(this).addClass('AppImageName');
                    $(".rightArrIcon").hide();
                    $(".rightArrIcon", this).show();
                    CollectionNameSelect();
                }
                //}
            });
            ShowInstantNotification("Success", "Successfully created...", "'" + colNew + "' collection created successfully.", "CreateCollectionBlade");
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load RDS Collections After Create", error);
            console.log("ERROR:", error);
        },
        complete: function () {
        }
    });
}

function LoadAppIcons() {
    var tileLoader = $('#appsdiv .tileLoader');
    var tile = $('#appsdiv a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
            $("#appCountSpan").text("");
            $("#imagesDiv img").remove();
            $("#appNoCounterSpinner").show();
        },
        success: function (res) {
            if (res.length > 0) {
                $("#imagesDiv img").remove();
                for (var i = 0; i < res.length; i++) {
                    var dynImages = "<img id=\"ico_" + res[i].Alias + "\" src='data:image/jpeg;base64," + res[i].IconContents + "'\" style=\"width:25px; height:25px; float:left;\" />";
                    $("#imagesDiv").append(dynImages);
                }
            }
            $("#appCountSpan").text(res.length);
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load App Icons", error);
            console.log("ERROR:", error);
        }
    });
}
function CollectionNameSelect() {
    AddBreadcrumb($("#tblRDSCollection tr[class='AppImageName'] .Name").text().trim(), "appUser", "appsuserslist");
    selectedCollectionName = $("#tblRDSCollection tr[class='AppImageName'] .Name").text().trim();
    selectedCollectionNavName = $("#tblRDSCollection tr[class='AppImageName'] .NavName").text().trim();
    CollectionResourceType = $("#tblRDSCollection tr[class='AppImageName'] .CollectionType").text().trim();
    selectedCollectionResourceType = CollectionResourceType.replace(" ", "");

    $("#selectedCollectionName").text($("#tblRDSCollection tr[class='AppImageName'] .Name").text().trim());

    $('#appUser').find('.backgroundclr').removeClass('backgroundclr');

    var rdsLoader = $('#appUserLoader');
    var appUser = $('#appUser');
    rdsLoader.width(appUser.width() + 1);
    rdsLoader.height(appUser.height());
    rdsLoader.show();
    appUser.show();
    setTimeout(function () {
        rdsLoader.hide();
    }, 1000);

    loadEssentialData();
    LoadAppIcons();
    usersTileCount();
    usergroupsTileCount();

    serversTileCount();
    sessionHostTileCount();
    $(".tileDiv").removeClass("activeTile");
    ScrollToHorizontalEnd($("#appUser").width());
}
function refreshAppUserData() {
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetUser/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#appusersSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            if (JSON.stringify(viewModelAppUsers.appUsers) != JSON.stringify(res)) {
                viewModelAppUsers.appUsers = res;

                var element = $("#AppUsersDiv")[0];
                ko.cleanNode(element);
                ko.applyBindings(viewModelAppUsers, document.getElementById('AppUsersDiv'));
                $("#AppUserCls tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#AppUserCls tr").each(function () {
                        var trvalSub = $(this).text();
                        if (trval == trvalSub) {
                            IsDuplicate++;
                            if (IsDuplicate > 1) {
                                $(this).remove();
                            }
                        }
                    });
                });

            }

        },
        complete: function () {
            $("#appusersSpinner").hide();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Refresh App User Count", error);
            console.log("ERROR:", error);
        }
    });
}

function appsTilecount() {

    var tileLoader = $('#appsdiv .tileLoader');
    var tile = $('#appsdiv a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
            $("#appNoCounterSpinner").show();
        },
        success: function (res) {
            var appCount = res.length;
            $("#appCountSpan").text(appCount);
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load App Tiles Count", error);
            console.log("ERROR:", error);
            request = true;
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
            $("#appNoCounterSpinner").hide();
        }
    });

}

function usersTileCount() {
    var tileLoader = $('#appUsersTile .tileLoader');
    var tile = $('#appUsersTile a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetUsersAndGroups/" + data.ConnectionBroker.toLowerCase() + "/" + selectedCollectionName.toLowerCase() + "/user/",
        //url: data.ApiUrl + "subscriptions/GetUser/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
            $("#appNoCounterSpinner").show();
        },

        success: function (res) {
            var appUsersCount = res.length;
            $("#appUsersSpan").text(appUsersCount);
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load User Tile Count", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
            $("#appNoCounterSpinner").hide();
        }
    });

}


function usergroupsTileCount() {
    var tileLoader = $('#appGroupTile .tileLoader');
    var tile = $('#appGroupTile a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetUsersAndGroups/" + data.ConnectionBroker.toLowerCase() + "/" + selectedCollectionName.toLowerCase() + "/group/",
        //url: data.ApiUrl + "subscriptions/GetUser/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
        },

        success: function (res) {
            var appUsergroupCount = res.length;
            $("#appGroupSpan").text(appUsergroupCount);
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Usergroup Tile Count", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
        }
    });

}

function sessionHostTileCount() {
    var tileLoader = $('#activesessionshow .tileLoader');
    var tile = $('#activesessionshow a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetServer/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionNavName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
        },
        success: function (res) {

            var serverCount = res.length;
            $("#serverCountSpan").text(serverCount);

        },
        error: function (error) {
            // Log any error.
            LogError(data.ApiSubscriptionId, "Load Session Host Tile Count", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
        }
    });
}

function serversTileCount() {

    var tileLoader = $('#rdservershow .tileLoader');
    var tile = $('#rdservershow a');

    $.ajax({
        url: data.ApiUrl + "subscriptions/GetSessionTest/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tile.hide();
            tileLoader.show();
        },
        success: function (res) {
            var sessioncount = res.length;
            $("#sessionCount").text(sessioncount);

            // ko.cleanNode(element);
            //  requestActiveSession = false;

        },
        error: function (error) {
            //$("#BlockUIWithoutSpinner").hide();
            LogError(data.ApiSubscriptionId, "Load Server Count", error);
            console.log("ERROR:", error);
            requestActiveSession = true;
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
        }
    });

    //ajax call to populate the essential div content

}
function loadEssentialData() {
    $.ajax({
        url: data.ApiUrl + "admin/GetResourceGroup/" + data.ConnectionBroker + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#essential_Data").hide();
            $("#rmappdemo .spinnerDiv").show();
        },
        success: function (res) {
            $("#text_ResourceGroupName").text(res[0].ResourceGroupName);
            $("#text_Location").text(res[0].Location);
            $("#text_ClientURL").text(res[0].ClientURL);
            $("#anchClientURlhrefTenant").attr("href", res[0].ClientURL);
            $("#text_SubscriptionID").text(res[0].SubscriptionID);
        },
        error: function (error) {
            // Log any error.
            LogError(data.ApiSubscriptionId, "Load Essential Data", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            $("#rmappdemo .spinnerDiv").hide();
            $("#essential_Data").show();
            $(".copyTooltip").hide();
        }
    });
}
function refreshSessionData() {
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetSessionTest/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#activesessionSpinner").show();
            $("#ActivesSessionCls tbody").html('');
        },
        success: function (res) {
            for (i = 0; i < res.length; i++) {
                var date1 = new Date(res[i].LogonTime);
                var date2 = new Date();
                var diff = date2.getTime() - date1.getTime();
                var days = Math.floor(diff / (1000 * 60 * 60 * 24));
                diff -= days * (1000 * 60 * 60 * 24);
                var hours = Math.floor(diff / (1000 * 60 * 60));
                diff -= hours * (1000 * 60 * 60);
                var mins = Math.floor(diff / (1000 * 60));
                diff -= mins * (1000 * 60);
                var seconds = Math.floor(diff / (1000));
                diff -= seconds * (1000);

                res[i].LogonTime = days + "D  " + hours + "h: " + mins + ", " + seconds + "s";
                res[i].SessionState = res[i].SessionState.split('_')[1];

                $("#divactivesession .rowTemplate .UnifiedSessionID").text(res[i].UnifiedSessionID);
                $("#divactivesession .rowTemplate .UserName").text(res[i].UserName);
                $("#divactivesession .rowTemplate .SessionState").text(res[i].SessionState);
                $("#divactivesession .rowTemplate .LogonTime").text(res[i].LogonTime);
                $("#divactivesession .rowTemplate .HostServer").text(res[i].HostServer);
                $("#divactivesession .rowTemplate .IdleTime").text(res[i].IdleTime);
                var rowTemplate = $("#divactivesession .rowTemplate .dataRow tbody").html();
                $("#ActivesSessionCls tbody").append(rowTemplate);

                $("#ActivesSessionCls tbody tr").click(function () {

                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                    }
                    else {
                        $('#ActivesSessionCls tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                    }
                });
            }
        },

        complete: function () {
            $("#activesessionSpinner").hide();
        },
        error: function (error) {
            // Log any error.
            LogError(data.ApiSubscriptionId, "Refresh Session Data", error);
            console.log("ERROR:", error);
            requestActiveSession = true;
        }
    });
}

function manupulateTempOkButton() {
    var isSelection = 0;
    $("tr", "#AppImageName").each(function () {
        var cls = $(this).attr("class")
        if (cls == "active") {
            isSelection++;
            return false;
        }
    });
    if (isSelection > 0) {
        $("#btnShowselected").attr("disabled", false);
    }
    else {
        $("#btnShowselected").attr("disabled", true);
    }
}

function manupulateAddUserOkButtonCreateNewUser() {
    var isSelection = 0;
    $("tr", "#myTableCreateNewUser").each(function () {
        var cls = $(this).attr("class")
        if (cls == "active") {
            isSelection++;
            return false;
        }
    });
    if (isSelection > 0) {
        $("#appusersokCreateNewUser").attr("disabled", false);
    }
    else {
        $("#appusersokCreateNewUser").attr("disabled", true);
    }
}

function CloseAndMaintainState() {
    var prevPage = '@ViewBag.PrevPage';
    if (prevPage.toLowerCase() == "index") {
        localStorage.setItem("AppBreadcrumbs", "back");//For showing the Index page in existing State
        $('btnOkCreateColln').attr('href', '/Home/Index.cshtml');
    }
    else if (prevPage.toLowerCase() == "remoteappcollection") {
        localStorage.setItem("AddBreadcrumbs", "backAdd");//For showing the Index page in existing State
        $('btnOkCreateColln').attr('href', '/Home/RemoteAppCollection.cshtml');
    }
    $("#createCollection").hide();
}

function manupulateAddUserOkButton() {
    var isSelection = 0;
    $("tr", "#myTable").each(function () {
        var cls = $(this).attr("class")
        if (cls == "active") {
            isSelection++;
            return false;
        }
    });
    if (isSelection > 0) {
        $("#appusersok").attr("disabled", false);
    }
    else {
        $("#appusersok").attr("disabled", true);
    }
}

function hideAlldivinTenantAdmin() {
    $("#settings").hide();
    $("#ImportUserBlade").hide();
    $("#appsdivshow").hide();
    $("#updatesappsimages").hide();
    $("#selectappsimages").hide();
    $("#signoutuser").hide();
    $("#selectappsimages").hide();
    $("#edidcustomapps").hide();
    $("#addcustomapps").hide();
    $("#sendmessage").hide();
    $("#activitysession").hide();
    $("#activesession").hide();
    $("#appUsersTileBlade").hide();
    $("#CreateCollectionBlade").hide();
    $("#ConfigureBasicSettingBlade").hide();
    $("#createCollection").hide();
    $("#selectappimages").hide();
    $("#appusersdiv").hide();
    $("#deviceSettingsNetwork").hide();
    $("#domainJoinDetals").hide();
    $("#chooseNetwork").hide();
    $("#blankdiv").hide();
    $("#domainDetails").hide();
    $("#serversshow").hide();
    $("#appusersdivCreatenewUser").hide();
    $("#auditlogsconfig").hide();
    $("#brustconfig").hide();
    $("#userprofileconfig").hide();
    $("#appUser").hide();

}

function refreshSessionHostServer() {
    $.ajax({
        url: data.ApiUrl + "admin/GetServer/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#RDServerSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            serverselectmodel.serverselect = res;
            var element = $("#rdsservers")[0];
            ko.cleanNode(element);
            ko.applyBindings(serverselectmodel, document.getElementById('rdsservers'));


            $("#rdsessionhostserverVar tr").each(function () {
                var trval = $(this).text();
                var IsDuplicate = 0;
                $("#rdsessionhostserverVar tr").each(function () {
                    var trvalSub = $(this).text();
                    if (trval == trvalSub) {
                        IsDuplicate++;
                        if (IsDuplicate > 1) {
                            $(this).remove();
                        }
                    }
                });
            });

            if (res.length == 0) {
                $("#rdSessionHostServerExist").show();
            }
            else {
                $("#rdSessionHostServerExist").hide();
            }
        },
        error: function (error) {
            // Log any error.
            LogError(data.ApiSubscriptionId, "Refresh Session Host Server", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            $("#RDServerSpinner").hide();
        }
    });

}

function refreshCustomAppsData() {
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#AppsSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            var element = $("#appStatusDiv")[0];
            ko.cleanNode(element);
            appStatusViewModel.appstatus = res;
            ko.applyBindings(appStatusViewModel, document.getElementById('appStatusDiv'));

            $("#AppStatusName tr").each(function () {
                var trval = $(this).text();
                var IsDuplicate = 0;
                $("#AppStatusName tr").each(function () {
                    var trvalSub = $(this).text();
                    if (trval == trvalSub) {
                        IsDuplicate++;
                        if (IsDuplicate > 1) {
                            $(this).remove();
                        }
                    }
                });
            });
        },
        complete: function () {
            $("#AppsSpinner").hide();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Refresh Custom Apps Data", error);
            console.log("ERROR:", error);
        }
    });
}

function loadEssential() {

}

function loadUser() {
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetADUser/" + data.ApiSubscriptionId + "/" + Deployname + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#AppUsersSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            if (JSON.stringify(viewModelAppUsersScreen7.appUsersScreen7) != JSON.stringify(res)) {
                viewModelAppUsersScreen7.appUsersScreen7 = res;
                var element = $("#appsuserdivscreen7")[0];
                ko.cleanNode(element);
                ko.applyBindings(viewModelAppUsersScreen7, document.getElementById('appsuserdivscreen7'));
            }
        },
        complete: function () {
            $("#AppUsersSpinner").hide()
            var strTmyTable = $("#myTable").text().trim();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Users", error);
            appUsersmodal.style.display = "block";
            console.log("ERROR:", error);
        }
    });
}


function loadPublishedAppsData() {
    console.log(data.ApiUrl + "subscriptions/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/applications/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType");
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#AppsSpinner").show();
            $("#appsTable tbody").html('');
            $("#publishApp123").attr("disabled", true);
            $("#addcustomappsclick").attr("disabled", true);
            $("#publishDesktopApps").attr("disabled", true);
            $("#unpublishselectedapp").attr("disabled", true);
        },
        success: function (res) {
            $("#appsTable tbody").html(' ');
            AppsCollectionArray = [];
            $("#publishApp123").attr("disabled", false);
            $("#addcustomappsclick").attr("disabled", false);
            $("#publishDesktopApps").attr("disabled", false);
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    AppsCollectionArray.push({
                        IconContents: res[i].IconContents,
                        Alias: res[i].Alias,
                        Name: res[i].Name,
                        Status: res[i].Status,
                        Path: res[i].Path
                    });
                    $("#appStatusDiv .rowTemplate .IconContents").html("<img src='data:image/jpeg;base64," + res[i].IconContents + "'\" style=\"width:25px; height:25px; float:left;\" />");
                    $("#appStatusDiv .rowTemplate .Alias").text(res[i].Alias);
                    $("#appStatusDiv .rowTemplate .Name").text(res[i].Name);
                    $("#appStatusDiv .rowTemplate .Status").text(res[i].Status);
                    $("#appStatusDiv .rowTemplate .Path").text(res[i].Path);
                    var rowTemplate = $("#appStatusDiv .rowTemplate .dataRow tbody").html();
                    $("#appsTable tbody").append(rowTemplate);
                }
            }
            else {
                var rowTemplate = $("#appStatusDiv .rowTemplate .blankRow tbody").html();
                $("#appsTable tbody").append(rowTemplate);
            }

            $("#appsTable tbody tr[class!='nodata']").click(function () {
                if ($(this).hasClass("AppImageName")) {
                    $(this).removeClass('AppImageName');
                    $("#unpublishselectedapp").attr("disabled", true);
                }
                else {
                    $('#appsTable tbody tr').removeClass('AppImageName');
                    $(this).addClass('AppImageName');
                    $("#unpublishselectedapp").attr("disabled", false);
                }
            });
        },
        complete: function () {
            $("#appsTable").show();
            $("#AppsSpinner").hide();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Published Apps Data", error);
            console.log("ERROR:", error);
        }
    });
}

function loadPublishedAppsImages() {
    var tileLoader = $('#appsdiv .tileLoader');
    var tile = $('#appsdiv a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            tileLoader.show();
            tile.hide();
            $("#appsImageTable").hide();
            try {
                var maxAppStatusLength = appStatusViewModel.appstatus.length
                for (var i = 0; i < maxAppStatusLength; i++) {
                    appStatusViewModel.appstatus.pop();
                }
            } catch (ex) {
            }

            $("#AppsSpinner").show();
        },
        success: function (res) {
            if (JSON.stringify(appStatusViewModel.appstatus) != JSON.stringify(res)) {
                appStatusViewModel1.appImages = res;
                $("#appsImageTable").show();
                var elementImage = $("#appsdiv")[0];
                ko.cleanNode(elementImage);
                ko.applyBindings(appStatusViewModel1, document.getElementById('appsdiv'));
            }
            $("#AppImageLoad td").each(function () {
                var trval = $(this)[0].id;
                var IsDuplicate = 0;
                $("#AppImageLoad td").each(function () {
                    var trvalSub = $(this)[0].id;
                    if (trval == trvalSub) {
                        IsDuplicate++;
                        if (IsDuplicate > 1) {
                            $(this).remove();
                        }
                    }
                });
            });
        },
        complete: function () {
            tileLoader.hide();
            tile.show();
            $("#appStatusDiv").show();
            $("#AppsSpinner").hide();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Published App Images", error);
            console.log("ERROR:", error);
        }
    });
}

function loadPublishedAppsDataTileCount() {
    var spinner = $('#appsdiv .spinner');
    var tile = $('#appsdiv a');
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            spinner.show();
            tile.hide();
        },
        success: function (res) {
            if (JSON.stringify(appStatusViewModel.appstatusTileCount) != JSON.stringify(res)) {
                var element = $("#appStatusDivTileCount")[0];
                ko.cleanNode(element);
                appStatusViewModel.appstatus = res;
                ko.applyBindings(appStatusViewModel, document.getElementById('appStatusDivTileCount'));
            }

            $("#AppStatusNameappStatusDivTileCount tr").each(function () {
                var trval = $(this).text();
                var IsDuplicate = 0;
                $("#AppStatusNameappStatusDivTileCount tr").each(function () {
                    var trvalSub = $(this).text();
                    if (trval == trvalSub) {
                        IsDuplicate++;
                        if (IsDuplicate > 1) {
                            $(this).remove();
                        }
                    }
                });
            });
            var appCount = $("#AppStatusNameappStatusDivTileCount  tr").length;
            $("#appCountSpan").text(appCount);
        },
        complete: function () {
            spinner.hide();
            tile.show();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Published Apps Tile Count", error);
            console.log("ERROR:", error);
        }
    });
}


function filterRDSCollection(curVal) {
    curVal = curVal.toLowerCase();
    $("#tblRDSCollection tbody").html('');
    var res = RDSCollectionsArray;
    var isNotFound = 1;
    for (var i = 0; i < res.length; i++) {
        if (res[i].Name.toLowerCase().indexOf(curVal) > -1 || res[i].Description.toLowerCase().indexOf(curVal) > -1) {
            $("#myviewCollectionDiv .rowTemplate .Name").text(res[i].Name);
            $("#myviewCollectionDiv .rowTemplate .CollectionType").text(res[i].CollectionType);
            $("#myviewCollectionDiv .rowTemplate .Size").text(res[i].Size);
            $("#myviewCollectionDiv .rowTemplate .Burst").text(res[i].Burst);
            $("#myviewCollectionDiv .rowTemplate .Description").text(res[i].Description);
            var rowTemplate = $("#myviewCollectionDiv .rowTemplate .dataRow tbody").html();
            $("#tblRDSCollection tbody").append(rowTemplate);
            isNotFound = 0;
        }
    }
    if (isNotFound == 1) {
        var rowTemplate = $("#myviewCollectionDiv .rowTemplate .blankRow tbody").html();
        $("#tblRDSCollection tbody").append(rowTemplate);
    }
    else {
        $("#tblRDSCollection tbody tr[class!='nodata'][class!='nodata InactiveRow']").unbind("click");
        $("#tblRDSCollection tbody tr[class!='nodata'][class!='nodata InactiveRow']").click(function () {
            if ($(this).hasClass("AppImageName")) {
                $("#appUserCloseBlade").trigger("click");
                $(this).removeClass('AppImageName');
                $(".rightArrIcon", this).hide();
            }
            else {
                $("#CreateCollectionBladeCloseIcon").trigger("click");
                $("#appUserCloseBlade").trigger("click");
                $('#tblRDSCollection tbody tr').removeClass('AppImageName');
                if ($(this).prop("class").indexOf("nodata") < 0) {
                    $(this).addClass('AppImageName');
                    $(".rightArrIcon").hide();
                    $(".rightArrIcon", this).show();
                    CollectionNameSelect();
                }
            }
        });
    }
}

function filterApps(curVal) {
    curVal = curVal.toLowerCase();
    $("#appsTable tbody").html('');
    var res = AppsCollectionArray;
    var isNotFound = 1;
    for (var i = 0; i < res.length; i++) {
        if (res[i].Name.toLowerCase().indexOf(curVal) > -1 || res[i].Status.toLowerCase().indexOf(curVal) > -1 || res[i].Path.toString().toLowerCase().indexOf(curVal) > -1) {
            $("#appStatusDiv .rowTemplate .IconContents").html("<img src='data:image/jpeg;base64," + res[i].IconContents + "'\" style=\"width:25px; height:25px; float:left;\" />");
            $("#appStatusDiv .rowTemplate .Alias").text(res[i].Alias);
            $("#appStatusDiv .rowTemplate .Name").text(res[i].Name);
            $("#appStatusDiv .rowTemplate .Status").text(res[i].Status);
            $("#appStatusDiv .rowTemplate .Path").text(res[i].Path);
            var rowTemplate = $("#appStatusDiv .rowTemplate .dataRow tbody").html();
            $("#appsTable tbody").append(rowTemplate);
            isNotFound = 0;
        }
    }
    if (isNotFound == 1) {
        var rowTemplate = $("#appStatusDiv .rowTemplate .blankRow tbody").html();
        $("#appsTable tbody").append(rowTemplate);
    }
    else {
        $("#appsTable tbody tr[class!='nodata']").unbind("click");
        $("#appsTable tbody tr[class!='nodata']").click(function () {
            if ($(this).hasClass("AppImageName")) {
                $(this).removeClass('AppImageName');
                $("#unpublishselectedapp").css("color", "rgb(169, 169, 169)");
            }
            else {
                $('#appsTable tbody tr').removeClass('AppImageName');
                $(this).addClass('AppImageName');
                $("#unpublishselectedapp").css("color", "rgb(255, 255, 255)");
            }
        });
    }
}

function filterUsers(curVal) {
    curVal = curVal.toLowerCase();
    $("#AppUsersTable tbody").html('');
    var res = UserCollectionArray;
    var isNotFound = 1;
    for (var i = 0; i < res.length; i++) {
        if (res[i].Name.toLowerCase().indexOf(curVal) > -1) {
            $("#AppUsersDiv .rowTemplate .Name").text(res[i].Name);
            var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
            $("#AppUsersTable tbody").append(rowTemplate);
            isNotFound = 0;
        }
    }
    if (isNotFound == 1) {
        var rowTemplate = $("#AppUsersDiv .rowTemplate .blankRow tbody").html();
        $("#AppUsersTable tbody").append(rowTemplate);
    }
    else {
        $("#AppUsersTable tbody tr[class!='nodata']").unbind("click");
        $("#AppUsersTable tbody tr[class!='nodata']").click(function () {
            if ($(this).hasClass("AppImageName")) {
                $(this).removeClass('AppImageName');
                $("#menuRemoveAppUser").css("color", "rgb(169, 169, 169)");
            }
            else {
                $('#AppUsersTable tbody tr').removeClass('AppImageName');
                $(this).addClass('AppImageName');
                $("#menuRemoveAppUser").css("color", "rgb(255, 255, 255)");
            }
        });
    }
}
function filterSessions(curVal) {
    curVal = curVal.toLowerCase();
    $("#ActivesSessionCls tbody").html('');
    var res = SessionCollectionArray;
    var isNotFound = 1;
    for (var i = 0; i < res.length; i++) {
        if (res[i].UserName.toLowerCase().indexOf(curVal) > -1 || res[i].SessionState.toLowerCase().indexOf(curVal) > -1 || res[i].LogonTime.toString().toLowerCase().indexOf(curVal) > -1 || res[i].HostServer.toLowerCase().indexOf(curVal) > -1 || res[i].IdleTime.toString().toLowerCase().indexOf(curVal) > -1) {
            $("#divactivesession .rowTemplate .UnifiedSessionID").text(res[i].UnifiedSessionID);
            $("#divactivesession .rowTemplate .UserName").text(res[i].UserName);
            $("#divactivesession .rowTemplate .SessionState").text(res[i].SessionState);
            $("#divactivesession .rowTemplate .LogonTime").text(res[i].LogonTime);
            $("#divactivesession .rowTemplate .HostServer").text(res[i].HostServer);
            $("#divactivesession .rowTemplate .IdleTime").text(res[i].IdleTime);
            var rowTemplate = $("#divactivesession .rowTemplate .dataRow tbody").html();
            $("#ActivesSessionCls tbody").append(rowTemplate);
            isNotFound = 0;
        }
    }
    if (isNotFound == 1 || $("#ActivesSessionCls tbody tr[class!='nodata']").length <= 0) {
        var rowTemplate = $("#divactivesession .rowTemplate .blankRow tbody").html();
        $("#ActivesSessionCls tbody").append(rowTemplate);
    }
    else {
        $("#ActivesSessionCls tbody tr[class!='nodata']").unbind("click");
        $("#ActivesSessionCls tbody tr[class!='nodata']").click(function () {
            if ($(this).hasClass("AppImageName")) {
                $(this).removeClass('AppImageName');
                $("#sendmessageshowclick").attr("disabled", true);
                $("#disconnectbtn").attr("disabled", true);
                $("#signoutusersbtn").attr("disabled", true);
                $("#messageCloseBlade").trigger("click");
            }
            else {
                $('#ActivesSessionCls tbody tr').removeClass('AppImageName');
                $(this).addClass('AppImageName');
                $("#sendmessageshowclick").attr("disabled", false);
                $("#disconnectbtn").attr("disabled", false);
                $("#disconnectallbtn").attr("disabled", false);
                $("#signoutusersbtn").attr("disabled", false);
                $("#logoffalluserbtn").attr("disabled", false);
            }
        });
    }
}

function filterAddUser(curVal) {
    curVal = curVal.toLowerCase();
    $("#myTable tbody").html('');
    var res = AddUserCollectionArray;
    var isNotFound = 1;
    for (var i = 0; i < res.length; i++) {
        if (res[i].Name.toLowerCase().indexOf(curVal) > -1) {
            $("#appsuserdivscreen7 .rowTemplate .Name").text(res[i].Name);
            var rowTemplate = $("#appsuserdivscreen7 .rowTemplate .dataRow tbody").html();
            $("#myTable tbody").append(rowTemplate);
            isNotFound = 0;
        }
    }
    if (isNotFound == 1) {
        var rowTemplate = $("#appsuserdivscreen7 .rowTemplate .blankRow tbody").html();
        $("#myTable tbody").append(rowTemplate);
    }
    else {
        $("#myTable tbody tr[class!='nodata']").unbind("click");
        $("#myTable tbody tr[class!='nodata']").click(function () {
            if ($(this).hasClass("AppImageName")) {
                $(this).removeClass('AppImageName');
            }
            else {
                $(this).addClass('AppImageName');
            }
        });
    }
}

function loadindividualusers() {
    $.ajax({
        url: data.ApiUrl + "admin/GetUsersFromUserGroups/" + data.ApiSubscriptionId + "/" + SelectedUsergroupName,
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#AppIndiUserTable tbody").html('');
            $("#individualusers").show();
            $("#loadingindiuserspinner").show();
        },
        success: function (res) {
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    $("#IndiUserGroupDiv .rowTemplate .IndiUserName").text(res[i].UserName);
                    var rowTemplate = $("#IndiUserGroupDiv .rowTemplate .dataRow tbody").html();
                    $("#AppIndiUserTable tbody").append(rowTemplate);
                }
            }
            else {
                var rowTemplate = $("#IndiUserGroupDiv .rowTemplate .blankRow tbody").html();
                $("#AppIndiUserTable tbody").append(rowTemplate);
            }
        },
        error: function (error) {

            LogError(data.ApiSubscriptionId, "Load Individual users", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            $("#loadingindiuserspinner").hide();
        }
    });
}

function Userprofiledisk() {
   
        $("#profiledisklocationicon").hide();
        $("#profilemaximumsize").hide();
        $("#errorprofiledisk").hide();
        $("#UserProfileLocationtxt").removeClass("redborder");
        $("#UserProfileGBtxt").removeClass("redborder");
        var locationtext = $("#UserProfileLocationtxt").val().trim();
        locationtext = locationtext.replace(/\\/g, "\\");
        var MaxSize = $("#UserProfileGBtxt").val().trim();
        var disconnectSelectedCollection = {
            "commandName": "adminEditCollectionConfig",
            "data":
            {
                "CollectionConfigSettings": {
                    "DeploymentFqdn": Deployname,
                    "CollectionName": selectedCollectionName,
                    "IsBurstActive": iSScale,
                    "ClientSettings": {
                        "EnableUserProfileDisks": userprofilediskButtonSelection,
                        "UserProfileDisksLocation": locationtext,
                        "UserProfileDisksMaxSize": MaxSize == "" ? "0" : MaxSize
                    }
                }
            }
        };
        var jsonData = JSON.stringify(disconnectSelectedCollection);
        $.ajax({
            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                // $("#userprofilecloseicon").trigger("click");
                ShowInstantNotification("Progress", "Updating user profile disk...", "", "userprofilebtn")
            },
            success: function (res) {
                var result = JSON.parse(res);
                if (result == "Success") {
                    ShowInstantNotification("Success", "Successfully updated...", "User profile disk updated successfully...", "userprofilebtn")
                }
                else if ($("#noUSERPROFILEDISKS").hasClass("activeCls")) {
                    //$("#profilemaximumsize").show();
                    $("#errorprofiledisk").hide();
                    $("#profiledisklocationicontxt").hide();
                    $("#profilemaximumsize0").hide();

                    $("#UserProfileLocationtxt").removeClass("redborder");
                    // $("#UserProfileGBtxt").addClass("redborder");
                    ShowInstantNotification("Error", "Updation failed...", "Failed updating user profile disk...", "userprofilebtn")
                }
                else if ($("#yesUSERPROFILEDISKS").hasClass("activeCls")) {
                    $("#errorprofiledisk").show();
                    $("#profiledisklocationicontxt").show();
                    $("#UserProfileLocationtxt").addClass("redborder");
                    // $("#UserProfileGBtxt").addClass("redborder");
                    ShowInstantNotification("Error", "Updation failed...", "Failed updating user profile disk...", "userprofilebtn")
                }
            },
            complete: function () {
            },
            error: function (error) {
                ShowInstantNotification("Error", "Updation failed...", "Failed updating user profile disk...", "userprofilebtn")
                LogError(data.ApiSubscriptionId, "Updating User Profile Disk", error);
                console.log("ERROR:", error);
            }
        });
 

}

var IsDisbaledmenuAddNewAppUser = 0;
var IsDisbaledmenuRemoveAppUser = 0;
var IsDisbaledmenuImportAppUser = 0;
var iSScale = false;
$(document).ready(function () {

    $("#settingsccrlosebtn").click(function () {
        RemoveBreadcrumb("appUser");
        $("#min_settings").hide();
        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#auditlogsconfig").hide();
        $("#brustconfig").hide();
        $("#userprofileconfig").hide();
        $("#collectionsettings").hide();
        $("#settings .supportList a").removeClass("AppImageName");
        $("#settingsshow").removeClass("activeDocBtn");
        $('#btnbrustconfigcloseicon').trigger("click");
        $('#collectionconfigcloseicon').trigger("click");
        $('#ScaleClientSettingscloseicon').trigger("click");
        $('#userprofilecloseicon').trigger("click");

    });

    $("#menuImportUsers").click(function () {
        //import users blade loader

        if ($("#menuImportUsers").prop("disabled") == false) {
            //Bread Crumb
            AddBreadcrumb("Import Users", "ImportUserBlade", "appUsersTileBlade");
            $("#min_appusersdivCreatenewUser").hide();
            $("#min_ImportUserBlade").hide();
            $("#menuRemoveAppUser").attr("disabled", true);
            $("#AppUsersTable tbody tr").removeClass("AppImageName");
            $("#individualusers").hide();
            $("#ImportUserBlade").show();
            ScrollToHorizontalEnd(350);
            $("#appusersdivCreatenewUser").hide();
            $("#AddGroupUsers").hide();
            $("#btnokImportUserBlade,#btnokImportUserBladeSelected").attr("disabled", true);
            $("#imported_users tbody").html('');
            $("#imported_users tbody").append("<tr my-id=\"exist\"><td>No users to display</td></tr>");
            $("#fileUser").val('');
            $("#menuImportUsers").addClass("activeDocBtn");
            $("#menuAddNewAppUser").removeClass("activeDocBtn");
            $("#menuRemoveAppUser").removeClass("activeDocBtn");


        }
        else {
            $("#closeIconImportUserBlade").trigger("click");
        }
    });

    $("#fileUser").change(function () {
        if ($(this).val().trim() != "") {
            $("#btnokImportUserBlade,#btnokImportUserBladeSelected").attr("disabled", false);
        }
        else {
            $("#imported_users tbody").html('');
            $("#imported_users tbody").append("<tr my-id=\"exist\"><td>No users to display</td></tr>");
            $("#btnokImportUserBlade,#btnokImportUserBladeSelected").attr("disabled", true);
        }
    });
    var fileInputCSV = document.getElementById('fileUser');
    fileInputCSV.addEventListener('change', function (e) {

        // parse as CSV
        var file = e.target.files[0];
        var csvParser = new SimpleExcel.Parser.CSV();
        csvParser.setDelimiter(',');
        csvParser.loadFile(file, function () {
            // draw HTML table based on sheet data
            var sheet = csvParser.getSheet();
            $("#imported_users tbody").html('');
            sheet.forEach(function (el, i) {

                //var row = document.createElement('tr');
                var IsAvail = 0;
                var dynCell = "";
                var cellVal = "";
                var isvalidname1 = "";
                var isvalidname2 = "";
                var FirstCheck = "";
                var SecondCheck = "";
                el.forEach(function (el, i) {
                    
                    isvalidname1 = el.value.toLowerCase().split('\\')[0];
                    isvalidname2 = el.value.toLowerCase().split('\\')[1];


                    var str1 = isvalidname1;
                    if ((/^[a-zA-Z0-9-.@ ]*$/.test(str1) == false) || (/^[a-zA-Z0-9- ]*$/.test(str1.substring(0, 1)) == false) || (/^[a-zA-Z0-9- ]*$/.test(str1.substring(0, 1)) == false)) {
                        FirstCheck = "false";
                    }
                    else {
                        FirstCheck = "true";

                    }

                    var str2 = isvalidname2;
                    if (/^[a-zA-Z0-9- ]*$/.test(str2) == false) {
                        SecondCheck = "false";
                    }
                    else {
                        SecondCheck = "true";

                    }

                    if ((FirstCheck == "true") && (SecondCheck == "true") && (isvalidname1) && (isvalidname2)) {
                        dynCell = "<td>";
                        $("#AppUsersTable tr").each(function () {
                            var strAlreadyUser = $(this).text().trim();
                            if (el.value.toLowerCase() == strAlreadyUser.trim().toLowerCase()) {
                                IsAvail++;
                            }
                        });
                        cellVal = el.value;
                        dynCell += cellVal;
                        dynCell += "</td>";

                        var dynRow = "<tr>";
                        if (IsAvail > 0) {
                            dynRow = "<tr style=\"color:red;\" my-id=\"exist\">";
                        }
                        dynRow += dynCell;
                        dynRow += "</tr>";
                        if (cellVal.trim() != "") {
                            $("#imported_users_body").append(dynRow);
                        }


                    }

                });
                
            });
            $("#imported_users_body tr").each(function () {
                var val_one = $(this).children("td:first").text().trim();
                var isDuplicate = 0;
                $("#imported_users_body tr").each(function () {
                    var val_two = $(this).children("td:first").text().trim();
                    if (val_one == val_two) {
                        isDuplicate++;
                    }
                });
                if (isDuplicate > 1) {
                    $(this).remove();
                }
            });
            $("#imported_users_body tr[my-id!='exist']").click(function () {
                if ($(this).hasClass("AppImageName")) {
                    $(this).removeClass('AppImageName');
                }
                else {
                    $(this).addClass('AppImageName');
                }
                if ($("#imported_users tbody tr[class='AppImageName']").length > 0) {
                    $("#btnokImportUserBladeSelected").attr("disabled", false);
                }
                else {
                    $("#btnokImportUserBladeSelected").attr("disabled", true);
                }
            });
        });


    });

    $("#closeIconImportUserBlade").click(function () {
        RemoveBreadcrumb("appUsersTileBlade");
        $("#min_ImportUserBlade").hide();
        $("#ImportUserBlade").hide();
        $("#menuImportUsers").removeClass("activeDocBtn");
    });

    //ajax call to post bulk users
    $("#btnokImportUserBlade,#btnokImportUserBladeSelected").click(function () {

        var groupUsers = "";
        var buttonClicked = 0;
        var countTotalUsernew = 0;
        if ($(this).attr("id") == "btnokImportUserBlade") {
            buttonClicked = 1;
            $("#imported_users tbody tr[my-id!='exist']").each(function () {
                if ($(this).children("td:first").text().trim() != "") {
                    groupUsers += $(this).children("td:first").text().trim() + ",";
                    countTotalUsernew++;
                }
            });
        }
        else if ($(this).attr("id") == "btnokImportUserBladeSelected") {
            if ($("#imported_users tbody tr[class='AppImageName']").length > 0) {
                $("#imported_users tbody tr[class='AppImageName']").each(function () {
                    if ($(this).children("td:first").text().trim() != "") {
                        groupUsers += $(this).children("td:first").text().trim() + ",";
                        countTotalUsernew++;
                    }
                });
            }
        }
        if (groupUsers != "") {
            $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                if ($(this).children("td:first").text().trim() != "") {
                    groupUsers += $(this).children("td:first").text().trim() + ",";
                }
            });
            groupUsers = groupUsers.substring(0, groupUsers.length - 1);
            var AddappscollectionCreateNewUser =
                                        {
                                            "commandName": "addusercollection",
                                            data: {
                                                "ConnectionBroker": data.ConnectionBroker,
                                                "CollectionName": selectedCollectionName,
                                                "UserGroup": groupUsers
                                            }
                                        }
            var jsonData = JSON.stringify(AddappscollectionCreateNewUser).replace("\\r", "");
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#appusersSpinner").show();
                    ShowInstantNotification("Progress", "Importing user(s) from csv file...", "", "btnokImportUserBlade");
                },
                success: function (res) {
                    $("#appusersSpinner").hide();
                    if (buttonClicked == 1) {
                        $("#imported_users tbody tr[my-id!='exist']").each(function () {
                            if ($(this).children("td:first").text().trim() != "") {
                                $("#AppUsersDiv .rowTemplate .Name").text($(this).children("td:first").text().trim());
                                var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                                $("#AppUsersTable tbody").append(rowTemplate);
                                UserCollectionArray.push({
                                    Name: $(this).children("td:first").text().trim()
                                });
                            }
                        });
                    }
                    else if (buttonClicked == 0) {
                        $("#imported_users tbody tr[class='AppImageName']").each(function () {
                            $("#AppUsersDiv .rowTemplate .Name").text($(this).children("td:first").text().trim());
                            var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                            $("#AppUsersTable tbody").append(rowTemplate);
                            UserCollectionArray.push({
                                Name: $(this).children("td:first").text().trim()
                            });
                        });
                    }

                    $("#AppUsersTable tbody tr[class!='nodata']").unbind("click");
                    $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                        $(this).click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                $("#menuRemoveAppUser").css("color", "rgb(169, 169, 169)");
                            }
                            else {
                                $('#AppUsersTable tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                $("#menuRemoveAppUser").css("color", "rgb(255, 255, 255)");
                            }
                        });
                    });

                    $("#appUsersSpan").text($("#AppUsersTable tbody tr[class!='nodata']").length);
                    ShowInstantNotification("Success", "Successfully imported user(s)...", "'" + countTotalUsernew.toString() + "' user(s) from csv file imported successfully.", "btnokImportUserBlade");
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed importing user(s)...", "could not imported '" + countTotalUsernew.toString() + "' user(s).", "btnokImportUserBlade");
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Import Bulk Users", error);
                },
                complete: function () {
                    $("#appusersSpinner").hide();
                    $("#closeIconImportUserBlade").trigger("click");
                    $("#menuImportUsers").removeClass("activeDocBtn");
                }
            });
        }
        else {
            $("#noUserToSelectModal").show();
        }
    });
});

$(document).ready(function () {

    $('input[id$="peakstarttime"]').inputmask(
        "hh:mm", {
            placeholder: "HH:MM",
            insertMode: false,
            showMaskOnHover: false,
            //hourFormat: 12
        }
      );

    $('input[id$="peakendtime"]').inputmask(
        "hh:mm", {
            placeholder: "HH:MM",
            insertMode: false,
            showMaskOnHover: false,
            //hourFormat: 12
        }
      );



    //collection level scale validations

    $("#logoffwaittime,#tshpercpu,#minservercount,#peakstarttime,#peakendtime").keyup(function () {
        var curVal = $(this).val();
        var txtThisID = $(this).attr("id");
        if (curVal != "") {
            $("#Scale_" + txtThisID + "").hide();
            $("#" + txtThisID + "").removeClass("redborder");
        }
        else {
            $("#Scale_" + txtThisID + "").show();
            $("#" + txtThisID + "").addClass("redborder");

        }
        if (($("#peakstarttime").val() != "") && ($("#peakendtime").val() != "") && ($("#logoffwaittime").val() != "") && ($("#tshpercpu").val() != "") && ($("#minservercount").val() != "")) {
            IsValidScaleData = "true";
            $("#CollScaleErrorMsg").hide();
        }

    });



    //window.setTimeout(function () {
    //    $("div.bfh-timepickerDemo input[type='text']").eq(0).attr('id', 'peakstarttime');
    //    $("div.bfh-timepickerDemo input[type='text']").eq(0).prop('readonly', false);
    //    $("div.bfh-timepickerDemo input[type='text']").eq(3).attr('id', 'peakendtime');
    //    $("div.bfh-timepickerDemo input[type='text']").eq(3).prop('readonly', false);
    //}, 500);

    // $('.bfh-timepicker .bfh-timepicker-toggle input[type="text"]').attr('id', 'peakstarttime');
    //$("#peakstarttime").prop("disable", false);
    $("#divSHSMonitor .amcharts-chart-div a").text("");
    $("#Enddisconnecteddd").change(function () {
        if ($("option:selected", this).text() != "Never") {
            $("#disconnectedsessionvaluesdiv").show();
        }
        else {
            $("#disconnectedsessionvaluesdiv").hide();
        }
    });

    $("#activesessionlimitdd").change(function () {
        if ($("#activesessionlimitdd option:selected").text() != "Never") {
            $("#activesessionvaluesdiv").show();
        }
        else {
            $("#activesessionvaluesdiv").hide();
        }
    });

    $("#idlesessionlimitdd").change(function () {
        if ($("#idlesessionlimitdd option:selected").text() != "Never") {
            $("#idlesessionvaluesdiv").show();
        }
        else {
            $("#idlesessionvaluesdiv").hide();
        }
    });

    for (var i = 1; i <= 100; i++) {
        $("#disconnectedsessionvalues").append("<option value=\"" + i + "\" >" + i + "</option>");
        $("#activesessionvalues").append("<option value=\"" + i + "\" >" + i + "</option>");
        $("#idlesessionvalues").append("<option value=\"" + i + "\" >" + i + "</option>");
    }

    //Filter code
    $("input[filter=txtRDSCollection]").keyup(function () {
        var curVal = $(this).val();
        filterRDSCollection(curVal);
    });
    $("input[filter=txtAppsFilter]").keyup(function () {
        var curVal = $(this).val();
        filterApps(curVal);
    });
    $("input[filter=txtUserFilter]").keyup(function () {
        var curVal = $(this).val();
        filterUsers(curVal);
    });
    $("input[filter=txtSessionFilter]").keyup(function () {
        var curVal = $(this).val();
        filterSessions(curVal);
    });
    $("input[filter=txtAddUserFilter]").keyup(function () {
        var curVal = $(this).val();
        filterAddUser(curVal);
    });
    //
    //End of filter


    data.arraylistDta = ko.observableArray('');

    //Initialise
    var frmCreateCollection = "";
    $("#RDSHomeDiv").hide();
    $("#selectappimages").hide();
    $("#appsuserslist").hide();
    $("#createCollection").hide();
    $("#righticondone").hide();
    $("#RCArighticondone").hide();
    $("#RDSHrighticondone").hide();
    $("#AddUserrighticondone").hide();
    $("#appUser").hide();
    $("#serversshow").hide();
    $("#settings").hide();
    $("#ImportUserBlade").hide();
    $("#brustconfig").hide();
    $("#userprofileconfig").hide();
    $("#auditlogsconfig").hide();
    $("#selectappimages").hide();
    $("#updatesappsimages").hide();
    $("#appsdivshow").hide();
    $("#selectappsimages").hide();
    $("#signoutuser").hide();
    $("#activesession").hide();
    $("#sendmessage").hide();
    $("#addcustomapps").hide();
    $("#edidcustomapps").hide();
    $("#activitysession").hide();
    $("#downloadusageshow").hide();
    $("#builduser").hide();
    $("#appUsersTileBlade").hide();
    $("#CreateCollectionBlade").hide();
    $("#ConfigureBasicSettingBlade").hide();
    $(".Userprofilereadonly input").prop("readonly", true);

    $("span[cust-id='spanValidation']").hide();
    $("span[cust-id='spanDiscValidation']").hide();
    $("#collectionCreationValidation").hide();
    $("#CreateCollectionBlade").hide();
    $("#ConfigureBasicSettingBlade").hide();
    $("#collectionCreationSuccessValidation").hide();
    $("#createCollection").hide();
    $("#selectappimages").hide();
    $("#appscontent").hide();
    $("#appusersdiv").hide();
    $("#appuserscontent").hide();
    $("#deviceSettingsNetwork").hide();
    $("#domainJoinDetals").hide();
    $("#chooseNetwork").hide();
    $("#domainDetails").hide();
    $("#blankdiv").hide();
    $("#aaadu").hide();
    $("#su").hide();
    $("#appsImageValidation").hide();
    $("#appsUserValidation").hide();
    $("#noServer").hide();
    $("#noUser").hide();

    $("#editNameSpecialChar").hide();
    $("#descriptionspecialChar").hide();
    $("#descriptionValidation").hide();
    $("#collectionCreationValidation").hide();
    $("#CreateCollectionBlade").hide();
    $("#ConfigureBasicSettingBlade").hide();
    $("#collectionCreationSuccessValidation").hide();

    $("#createCollection").hide();
    $("#selectappimages").hide();
    $("#appscontent").hide();
    $("#appusersdiv").hide();
    $("#appuserscontent").hide();
    $("#deviceSettingsNetwork").hide();
    $("#domainJoinDetals").hide();
    $("#chooseNetwork").hide();
    $("#domainDetails").hide();
    $("#blankdiv").hide();
    $("#appsImageValidation").hide();
    $("#appsUserValidation").hide();
    $("#noServer").hide();
    $("#noUser").hide();
    $("#appusersdivCreatenewUser").hide();
    $("#adddesktopapp").hide();
    $("#rdSessionHostServerExist").hide();
    $("#sendmessageVM").hide();
    $("#AddGroupUsers").hide();
    $("#individualusers").hide();
    $("#appGroupTileBlade").hide();
    $("#ImportUserGroupBlade").hide();
    $("#divCollectionMonitor").hide();
    $("#deploymentdetails").hide();
    $("#azuredetails").hide();

    $("#publishApp123").click(function () {

        if ($("#publishApp123").prop("disabled") == false) {
            $("#min_adddesktopapp").hide();
            $("#min_addcustomapps").hide();
            var publishLoader = $('#adddesktopappLoader');
            var adddesktopapp = $('#adddesktopapp');
            publishLoader.width(adddesktopapp.width() + 1);
            publishLoader.height(adddesktopapp.height());
            adddesktopapp.show();
            publishLoader.show();
            setTimeout(function () {
                publishLoader.hide();
            }, 1000);
            ScrollToHorizontalEnd($("#adddesktopapp").width());
            //Bread Crumb
            AddBreadcrumb("Publish Start Menu Programs", "adddesktopapp", "appsdivshow");
            $("#appsTable tbody tr").removeClass("AppImageName");
            $("#unpublishselectedapp").attr("disabled", true);
            $("#publishApp123").addClass("activeDocBtn");
            $("#edidcustomapps").hide();
            //$("#addcustomapps").hide();
            $("#closeIconAddCustomApps").trigger("click");
            $("#btnokdesktopapp").attr("disabled", true);
            $.ajax({
                //  url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/startMenuApps" + "/",
                url: data.ApiUrl + "subscriptions/GetApplication/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/startMenuApps/getapps",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function () {
                    $("#DesktopAppSpinner").show();
                    $("#desktopapplistselectid tr").removeClass("active");
                    $("#desktopapplistselectid tbody").html('');
                    $("#btnokdesktopapp").attr("disabled", true);
                },
                success: function (res) {
                    if (res != null) {
                        for (var i = 0; i < res.length; i++) {
                            $("#desktopappsdisplay .rowTemplate .IconContentsImage").html("<img src='data:image/jpeg;base64," + res[i].IconContents + "'\" style=\"width:25px; height:25px; float:left;\" />");
                            $("#desktopappsdisplay .rowTemplate .IconContents").text(res[i].IconContents);
                            $("#desktopappsdisplay .rowTemplate .Alias").text(res[i].Alias);
                            $("#desktopappsdisplay .rowTemplate .Name").text(res[i].Name);
                            $("#desktopappsdisplay .rowTemplate .Path").text(res[i].Path);
                            var rowTemplate = $("#desktopappsdisplay .rowTemplate .dataRow tbody").html();
                            $("#desktopapplistselectid tbody").append(rowTemplate);
                        }
                    }
                    else {
                        var rowTemplate = $("#desktopappsdisplay .rowTemplate .blankRow tbody").html();
                        $("#desktopapplistselectid tbody").append(rowTemplate);
                    }

                    $("#desktopapplistselectid tbody tr").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                        }
                        else {
                            $(this).addClass('AppImageName');
                        }
                        if ($("#desktopapplistselectid tbody tr[class='AppImageName']").length > 0) {
                            $("#btnokdesktopapp").attr("disabled", false);
                        }
                        else {
                            $("#btnokdesktopapp").attr("disabled", true);
                        }
                    });
                },
                complete: function () {
                    $("#DesktopAppSpinner").hide();
                },
                error: function (error) {
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Publish Applications", error);
                }
            });
        }
        else {
            $("#publishApp123").removeClass("activeDocBtn");
        }
    });

    $("#publishDesktopApps").click(function () {
        if ($("#publishDesktopApps").prop("disabled") == false) {
            $("#adddesktopclose").trigger("click");
            $("#closeIconAddCustomApps").trigger("click");
            var thisSelCol = selectedCollectionName;
            $("#appsTable tbody tr").removeClass("AppImageName");
            $("#publishDesktopApps").removeClass("activeDocBtn");
            // publishDesktopConfirmationModal.style.display = "none";
            var objCollection =
                    {
                        "commandName": "publishdesktop",
                        "data": {
                            "ConnectionBroker": data.ConnectionBroker,
                            "CollectionName": selectedCollectionName
                        }
                    }

            var jsonData = JSON.stringify(objCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#appUserCloseBlade").trigger("click");
                    ShowInstantNotification("Progress", "Publishing desktop for '" + thisSelCol + "' collection...", "", "publishDesktopApps");
                },
                success: function (res) {
                    $("#tblRDSCollection tr[class='AppImageName'] .CollectionType").text("Remote Desktop");
                    ShowInstantNotification("Success", "Desktop published successfully..", "'" + thisSelCol + "' collection published as desktop.", "publishDesktopApps");
                },
                complete: function () {
                    $("#publishDesktopApps").removeClass("activeDocBtn");
                },
                error: function (error) {
                    $("#publishDesktopConfirmationSpinner").hide();
                    $("#publishDesktopApps").removeClass("activeDocBtn");
                    ShowInstantNotification("Error", "Failed publishing..", "Failed publishing '" + thisSelCol + "' collection as desktop app.", "publishDesktopApps");
                    LogError(data.ApiSubscriptionId, "Publish Desktop Apps", error);

                }
            });
        }
        else {
            $("#publishDesktopApps").removeClass("activeDocBtn");
        }
    });

    //ajax call to load the collection's resourcetype on load

    $.ajax({
        url: data.ApiUrl + "subscriptions/GetCollections/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (res) {
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Collections Resource Type", error);
        }
    });

    $("#menuAddNewAppUser").click(function () {

        if ($("#menuAddNewAppUser").prop("disabled") == false) {
            $("#menuAddNewAppUser").addClass("activeDocBtn");
            $("#menuImportUsers").removeClass("activeDocBtn");
            $("#min_appusersdivCreatenewUser").hide();
            $("#min_ImportUserBlade").hide();
            //Bread Crumb
            AddBreadcrumb("Add User", "appusersdivCreatenewUser", "appUsersTileBlade");
            var createnewuserLoader = $('#appusersdivCreatenewUserLoader');
            var addnewuser = $('#appusersdivCreatenewUser');
            createnewuserLoader.width(addnewuser.width() + 1);
            createnewuserLoader.height(addnewuser.height());
            addnewuser.show();
            createnewuserLoader.show();
            setTimeout(function () {
                createnewuserLoader.hide();
            }, 1000);
            $("#ImportUserBlade").hide();
            $("#appscontent").hide();
            $("#appusersdiv").hide();
            $("#appuserscontent").hide();
            $("#deviceSettingsNetwork").hide();
            $("#domainJoinDetals").hide();
            $("#chooseNetwork").hide();
            $("#domainDetails").hide();
            $("#aaadu").hide();
            $("#selectappimages").hide();
            $("#blankdiv").hide();
            $("#appsUserValidation").hide();
            $("#userStatusCreateNewUser").hide();
            $("#AddGroupUsers").hide();
            $("#individualusers").hide();
            $("#AppUsersTable tbody tr").removeClass("AppImageName");
            $("#menuRemoveAppUser").attr("disabled", true);
            ScrollToHorizontalEnd(450);
            $.ajax({
                url: data.ApiUrl + "subscriptions/GetADUser/" + data.ApiSubscriptionId + "/" + Deployname + "/",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function () {
                    $("#AppUsersSpinnerCreateNewUser").show();
                    $("#myTableCreateNewUser tbody").html('');
                    $("#appusersokCreateNewUser").attr("disabled", true);
                },
                success: function (res) {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            $("#appsuserdivscreen7CreateNewUser .rowTemplate .Name").text(res[i].Name);
                            var rowTemplate = $("#appsuserdivscreen7CreateNewUser .rowTemplate .dataRow tbody").html();
                            $("#myTableCreateNewUser tbody").append(rowTemplate);
                        }
                        try {
                            $("#AppUsersTable tbody tr").each(function () {
                                var strUserName = $(this).text().trim();
                                strUserName = strUserName.split(/\\/g)[1];
                                $("#myTableCreateNewUser tbody tr").each(function () {
                                    var strUserNameAlready = $(this).text().trim();
                                    strUserNameNew = strUserNameAlready.split("@")[0];
                                    if (strUserName.toLowerCase() == strUserNameNew.toLowerCase()) {
                                        $(this).remove();
                                    }
                                });
                            });
                        } catch (er) { }

                        if ($("#myTableCreateNewUser tbody tr").length == 0) {
                            var rowTemplate = $("#appsuserdivscreen7CreateNewUser .rowTemplate .blankRow tbody").html();
                            $("#myTableCreateNewUser tbody").append(rowTemplate);
                        }
                    }
                    else {
                        var rowTemplate = $("#appsuserdivscreen7CreateNewUser .rowTemplate .blankRow tbody").html();
                        $("#myTableCreateNewUser tbody").append(rowTemplate);
                    }
                    $("#myTableCreateNewUser tbody tr[class!='nodata']").unbind("click");
                    $("#myTableCreateNewUser tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                        }
                        else {
                            $(this).addClass('AppImageName');
                        }
                        if ($("#myTableCreateNewUser tr[class='AppImageName']").length > 0) {
                            $("#appusersokCreateNewUser").attr("disabled", false);
                        }
                        else {
                            $("#appusersokCreateNewUser").attr("disabled", true);
                        }
                    });
                    $("#AppUsersSpinnerCreateNewUser").hide();
                },
                complete: function () {
                    $("#AppUsersSpinnerCreateNewUser").hide()
                    var strTmyTable = $("#myTable").text().trim();

                },
                error: function (error) {
                    $("#AppUsersSpinnerCreateNewUser").hide();
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Add New App User", error);
                }
            });
        }
        else {
            $("#appCloseBladeCreatenewUser").trigger("click");
        }
    });

    $("#menuRemoveAppUser").click(function () {
        $("#appCloseBladeCreatenewUser").trigger("click");
        $("#closeIconImportUserBlade").trigger("click");
        var selectUserToRemove = $("#AppUsersTable tr[class='AppImageName']").text().trim();
        var selectOldUserToRemove = selectUserToRemove;
        var arrayUnselectedUser = "";
        //$("#AppUsersTable tbody tr[class!='AppImageName']").each(function () {
        //    var nameToRemove = $(".Name", this).text().trim();
        //    if (nameToRemove != selectUserToRemove) {
        //        nameToRemove = nameToRemove.replace(/\\/g, "\\");
        //        arrayUnselectedUser += nameToRemove + ",";
        //    }
        //});
        if (selectUserToRemove.trim() != "") {
            var domainNM = localStorage.getItem("DomainName");
            var userNM = selectUserToRemove.split(/\\/g)[1];
            selectUserToRemove = userNM + "@" + domainNM;
            $("#delusernm").text(selectOldUserToRemove);
            $("#deleteUserSpan").text(selectOldUserToRemove);
            deleteCollectionConfirmationModalCreateNewUser.style.display = "block";
            deleteCollectionConfirmationNoCreateNewUser.onclick = function () {
                deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                $("#menuRemoveAppUser").removeClass("activeDocBtn");
            }
            deleteCollectionConfirmationYesCreateNewUser.onclick = function () {
                deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                $("#menuRemoveAppUser").removeClass("activeDocBtn");
                deleteCollectionConfirmationNoCreateNewUser.disabled = true;
                deleteCollectionConfirmationYesCreateNewUser.disabled = true;
                if (selectUserToRemove != "" && selectUserToRemove != 'undefined') {
                    var objCollection = null;
                    objCollection =
                        {
                            "commandName": "removeusercollection",
                            "data": {
                                "ConnectionBroker": data.ConnectionBroker,
                                "CollectionName": selectedCollectionName,
                                //"UserGroup": arrayUnselectedUser.substring(0, arrayUnselectedUser.length - 1)
                                "UserGroup": selectOldUserToRemove

                            }
                        }
                    var jsonData = JSON.stringify(objCollection);

                    $.ajax({
                        url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                        type: "POST",
                        crossDomain: true,
                        dataType: "json",
                        data: jsonData,
                        beforeSend: function () {
                            $("#AppUsersTable tr[class='AppImageName'] .Name").text($("#AppUsersTable tr[class='AppImageName'] .Name").text() + "-deleting user...");
                            $("#AppUsersTable tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                            $("#AppUsersTable tr[class='nodata']").css("background-color", "#E6E6E6");
                            $("#AppUsersTable tr[class='nodata']").css("color", "#3A3A3A");
                            $("#AppUsersTable tbody tr").unbind("click");
                            $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                                $(this).click(function () {
                                    if ($(this).hasClass("AppImageName")) {
                                        $(this).removeClass('AppImageName');
                                        $("#menuRemoveAppUser").css("color", "rgb(169, 169, 169)");
                                    }
                                    else {
                                        $('#AppUsersTable tbody tr').removeClass('AppImageName');
                                        $(this).addClass('AppImageName');
                                        $("#menuRemoveAppUser").css("color", "rgb(255, 255, 255)");
                                    }
                                });
                            });

                            ShowInstantNotification("Progress", "Deleting user '" + selectOldUserToRemove + "'...", "", "menuRemoveAppUser");
                        },
                        success: function (res) {
                            for (var i = 0; i < UserCollectionArray.length; i++) {
                                var groupUsers = selectUserToRemove;
                                var nm = groupUsers.split("@")[0];
                                var dm = groupUsers.split("@")[1];
                                groupUsers = dm.split(".")[0] + '\\' + nm;
                                if (UserCollectionArray[i].Name.toLowerCase() == groupUsers.toLowerCase()) {
                                    UserCollectionArray.splice(i, 1);
                                }
                            }
                            $("#AppUsersTable tbody tr").each(function () {
                                if ($(".Name", this).text().trim().indexOf(selectOldUserToRemove) >= 0) {
                                    $(this).remove();
                                }
                            });
                            if ($("#AppUsersTable tr").length == 0) {
                                var rowTemplate = $("#AppUsersDiv .rowTemplate .blankRow tbody").html();
                                $("#AppUsersTable tbody").append(rowTemplate);
                            }

                            var prevUserCount = $("#appUsersSpan").text();
                            prevUserCount -= 1;
                            $("#appUsersSpan").text(prevUserCount);
                            ShowInstantNotification("Success", "Successfully deleted user...", "'" + selectOldUserToRemove + "' user deleted successfully.", "menuRemoveAppUser");
                        },
                        complete: function () {
                            deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                            deleteCollectionConfirmationNoCreateNewUser.disabled = false;
                            deleteCollectionConfirmationYesCreateNewUser.disabled = false;
                            $("#AppUserCls a").removeClass("AppImageName");
                            $("#menuRemoveAppUser").removeClass("activeDocBtn");
                            $("#menuRemoveAppUser").css("color", "rgb(169, 169, 169)");
                        },
                        error: function (error) {
                            deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                            console.log("ERROR:", error);

                            $("#AppUsersTable tr[class='nodata'] .Name").text(selectOldUserToRemove);

                            $("#AppUsersTable tr[class='nodata']").removeClass("nodata").addClass("AppImageName");

                            $("#AppUsersTable tr[class='AppImageName']").css("background-color", "#FFFFFF");
                            $("#AppUsersTable tr[class='AppImageName']").css("color", "#000000");
                            $("#AppUsersTable tr[class='AppImageName']").removeClass("AppImageName");

                            $("#AppUsersTable tbody tr").unbind("click");
                            $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                                $(this).click(function () {
                                    if ($(this).hasClass("AppImageName")) {
                                        $(this).removeClass('AppImageName');
                                        $("#menuRemoveAppUser").css("color", "rgb(169, 169, 169)");
                                    }
                                    else {
                                        $('#AppUsersTable tbody tr').removeClass('AppImageName');
                                        $(this).addClass('AppImageName');
                                        $("#menuRemoveAppUser").css("color", "rgb(255, 255, 255)");
                                    }
                                });
                            });

                            ShowInstantNotification("Error", "Failed deleting user...", "Could not delete '" + selectOldUserToRemove + "' user.", "menuRemoveAppUser");
                            LogError(data.ApiSubscriptionId, "Remove App User", error);
                        }
                    });
                }
                else {
                }
            }
        }
        else {
            $("#menuRemoveAppUser").removeClass("activeDocBtn");
        }
    });

    $("#menuAddUserGroup").click(function () {

        if ($("#menuAddUserGroup").prop("disabled") == false) {
            $("#min_AddGroupUsers").hide();
            $("#min_ImportUserGroupBlade").hide();
            $("#AddGroupUsers").show();
            $("#individualusers").hide();
            $("#ImportUserGroupBlade").hide();
            AddBreadcrumb("Add User Group", "AddGroupUsers", "appGroupTileBlade");
            $("#menuAddUserGroup").addClass("activeDocBtn");
            $("#menuImportUserGroup").removeClass("activeDocBtn");
            $("#showUsersingroup").removeClass("activeDocBtn");
            //ajax call to fetch the user group details
            $.ajax({
                url: data.ApiUrl + "admin/GetUserGroups/" + data.subscriptionid,
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function () {
                    $("#AppUserGroupTable tbody").html('');
                    $("#loadingusergroupspinner").show();
                    $("#showUsersingroup").attr("disabled", true);
                },
                success: function (res) {
                    UserGroupArray = [];
                    $("#AppUserGroupTable tbody").html('');
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            UserGroupArray.push({
                                UserGroupName: res[i].UserGroupName
                            });
                            $("#UserGroupDiv .rowTemplate .UserGroupName").text(res[i].UserGroupName);
                            var rowTemplate = $("#UserGroupDiv .rowTemplate .dataRow tbody").html();
                            $("#AppUserGroupTable tbody").append(rowTemplate);
                        }
                    }
                    else {
                        var rowTemplate = $("#UserGroupdiv .rowTemplate .blankRow tbody").html();
                        $("#AppUserGroupTable tbody").append(rowTemplate);
                    }
                    $("#AppUserGroupTable tbody tr[class!='nodata']").unbind("click");
                    $("#AppUserGroupTable tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                        }
                        else {
                            $(this).addClass('AppImageName');
                        }
                        $("#btnokAddUserGroup").attr("disabled", true);
                        if ($("#AppUserGroupTable tr[class='AppImageName']").length != 1) {
                            $("#showUsersingroup").attr("disabled", true);
                            if ($("#AppUserGroupTable tr[class='AppImageName']").length > 1) {
                                $("#btnokAddUserGroup").attr("disabled", false);
                                $("#showUsersingroup").attr("disabled", true);
                            }
                        }
                        else {
                            $("#showUsersingroup").attr("disabled", false);
                            SelectedUsergroupName = $("#AppUserGroupTable tr[class='AppImageName'] span[class='UserGroupName']").text().trim().split("\\")[1];
                        }
                        if ($("#AppUserGroupTable tr[class='AppImageName']").length = 1) {
                            $("#btnokAddUserGroup").attr("disabled", false);
                        }

                    });
                },
                complete: function () {
                    $("#loadingusergroupspinner").hide();
                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Load UserGroup", error);
                    console.log("ERROR:", error);
                }
            });
            ScrollToHorizontalEnd($("#AddGroupUsers").width());
        }
    });


    $("#showUsersingroup").click(function () {
        if ($("#showUsersingroup").prop("disabled", false)) {
            if ($("#AppUserGroupTable tbody tr[class='AppImageName']").length == 1) {
                loadindividualusers();
                $("#individualusers").show();
                ScrollToHorizontalEnd($("#individualusers").width());
                AddBreadcrumb("Users In The Group", "individualusers", "AddGroupUsers");
                $("#showUsersingroup").addClass("activeDocBtn");
            }
            else {
                $("#individualusers").hide();
            }
        }
        else {
            $("#showUsersingroup").attr("color", "rgb(125, 125, 125)");
        }
    });

    $("#menuImportUserGroup").click(function () {
        $("#min_AddGroupUsers").hide();
        $("#min_ImportUserGroupBlade").hide();
        $("#AddGroupUsers").hide();
        $("#individualusers").hide();
        $("#ImportUserGroupBlade").show();
        $("#menuImportUserGroup").addClass("activeDocBtn");
        $("#menuAddUserGroup").removeClass("activeDocBtn");
        AddBreadcrumb("Import UserGroups", "ImportUserGroupBlade", "appGroupTileBlade");
        ScrollToHorizontalEnd($("#ImportUserGroupBlade").width());
    });

    $("#closeIconAddUserGroup").click(function () {
        $("#min_AddGroupUsers").hide();
        $("#AddGroupUsers").hide();
        $("#closeIconIndividualUserGroup").trigger("click");
        RemoveBreadcrumb("appGroupTileBlade");
        $("#showUsersingroup").removeClass("activeDocBtn");
        $("#menuAddUserGroup").removeClass("activeDocBtn");
    });

    $("#closeIconIndividualUserGroup").click(function () {
        $("#individualusers").hide();
        $("#showUsersingroup").removeClass("activeDocBtn");
        RemoveBreadcrumb("AddGroupUsers");
    });
    $("#closeIconImportUserGroupBlade").click(function () {
        $("#min_ImportUserGroupBlade").hide();
        $("#ImportUserGroupBlade").hide();
        $("#menuImportUserGroup").removeClass("activeDocBtn");
        RemoveBreadcrumb("appGroupTileBlade");
    });

    $("#btnokAddUserGroup").click(function () {
        RemoveBreadcrumb("appUsersTileBlade");
        $("#closeIconAddUserGroup").trigger("click");
        //ajax call to post the user groups selected
        var selectedusercount = "";
        var selgroupUsers = "";
        selectedusercount = $("#AppUserGroupTable tr[class='AppImageName']").length;
        if ($("#AppUserGroupTable tr[class='AppImageName']").length > 0) {
            var groupUsers = "";

            $("#GroupUsersTable tbody tr[class!='nodata']").each(function () {
                groupUsers += $(this).text().trim() + ",";
            });

            $("#AppUserGroupTable tbody tr[class='AppImageName']").each(function () {
                groupUsers += $(".UserGroupName", this).text().trim() + ",";
                selgroupUsers += $(".UserGroupName", this).text().trim() + ",";
                $("#AppUsersDiv .rowTemplate .Name").text($(".UserGroupName", this).text().trim() + " - adding user group...");
                var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                $("#GroupUsersTable tbody").append(rowTemplate);
                $("#GroupUsersTable tbody tr:last").attr("blankrow", "blankrow");
            });
            if (groupUsers != "") {
                groupUsers = groupUsers.substring(0, groupUsers.length - 1);
            }
            var AddappscollectionCreateNewUser =
                        {
                            "commandName": "addusercollection",
                            data: {
                                "ConnectionBroker": data.ConnectionBroker,
                                "CollectionName": selectedCollectionName,
                                "UserGroup": groupUsers
                            }
                        }
            var jsonData = JSON.stringify(AddappscollectionCreateNewUser);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#AddGroupUsers").hide();
                    $("#GroupUsersTable tbody .nodata").remove();
                    ShowInstantNotification("Progress", "Adding '" + selectedusercount + "' User Group(s)...", "", "AddGroupUsers");
                },
                success: function (res) {
                    $("#GroupUsersTable tbody tr[blankrow='blankrow']").remove();
                    var totalSelected = 0;
                    var eachusr = selgroupUsers.split(",");
                    for (var j = 0; j < eachusr.length; j++) {
                        if (eachusr[j].trim() != "") {
                            var thisusr = eachusr[j];
                            $("#UserGroupDiv .rowTemplate .UserGroupName").text(thisusr);
                            var rowTemplate = $("#UserGroupDiv .rowTemplate .dataRow tbody").html();
                            $("#GroupUsersTable tbody").append(rowTemplate);
                            UserCollectionArray.push({
                                Name: thisusr
                            });
                            totalSelected++;
                        }
                    }
                    $("#GroupUsersTable tbody tr[class!='nodata']").unbind("click");
                    $("#GroupUsersTable tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                            $("#menuRemoveAppUserGroup").attr("disabled", true);
                        }
                        else {
                            $('#GroupUsersTable tbody tr').removeClass('AppImageName');
                            $(this).addClass('AppImageName');
                            $("#menuRemoveAppUserGroup").attr("disabled", false);
                        }
                    });
                    var prevUserCount = $("#appGroupSpan").text();
                    prevUserCount = (parseInt(prevUserCount) + totalSelected);
                    $("#appGroupSpan").text(prevUserCount);
                    $("#addusernm").text(selectedCollectionName);

                    $("#addcustomapps").hide();
                    ShowInstantNotification("Success", "Successfully added user group(s)...", "'" + selectedusercount + "' user(s) added successfully.", "AddGroupUsers");
                },
                error: function (error) {
                    $("#AppUserGroupTable tbody tr[blankrow='blankrow']").remove();
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Create New User", error);
                    ShowInstantNotification("Error", "Failed adding user group(s)...", "Failed adding '" + selectedusercount + "' user(s).", "AddGroupUsers");
                },
                complete: function () {
                    $("#menuAddUserGroup").removeClass("activeDocBtn");
                }
            });
        }
        else {
            $("#appsUserValidationCreateNewUser").show();
        }
    });

    $("#menuRemoveAppUserGroup").click(function () {
        $("#closeIconAddUserGroup").trigger("click");
        $("#menuRemoveAppUserGroup").addClass("activeDocBtn");
        var selectUserToRemove = $("#GroupUsersTable tr[class='AppImageName']").text().trim();
        var selectOldUserToRemove = selectUserToRemove;
        var arrayUnselectedUser = "";
        $("#GroupUsersTable tbody tr[class!='AppImageName']").each(function () {
            var nameToRemove = $(".Name", this).text().trim();
            if (nameToRemove != selectUserToRemove) {
                nameToRemove = nameToRemove.replace(/\\/g, "\\");
                arrayUnselectedUser += nameToRemove + ",";
            }
        });
        if (arrayUnselectedUser.trim() != "") {
            if (selectUserToRemove != "" && selectUserToRemove != 'undefined') {
                //var domainNM = localStorage.getItem("DomainName");
                //var userNM = selectUserToRemove.split(/\\/g)[1];
                //selectUserToRemove = userNM + "@" + domainNM;
                $("#delusernm").text(selectOldUserToRemove);
                $("#deleteUserGroupSpan").text(selectOldUserToRemove);
                deleteCollectionConfirmationModalCreateNewUserGroup.style.display = "block";
                deleteCollectionConfirmationNoCreateNewUserGroup.onclick = function () {
                    deleteCollectionConfirmationModalCreateNewUserGroup.style.display = "none";
                    $("#menuRemoveAppUserGroup").removeClass("activeDocBtn");
                }
                deleteCollectionConfirmationYesCreateNewUserGroup.onclick = function () {
                    deleteCollectionConfirmationModalCreateNewUserGroup.style.display = "none";
                    $("#menuRemoveAppUserGroup").removeClass("activeDocBtn");
                    if (selectUserToRemove != "" && selectUserToRemove != 'undefined') {
                        var objCollection = null;
                        objCollection =
                            {
                                "commandName": "removeusercollection",
                                "data": {
                                    "ConnectionBroker": data.ConnectionBroker,
                                    "CollectionName": selectedCollectionName,
                                    "UserGroup": selectOldUserToRemove
                                }
                            }
                        var jsonData = JSON.stringify(objCollection);

                        $.ajax({
                            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                            type: "POST",
                            crossDomain: true,
                            dataType: "json",
                            data: jsonData,
                            beforeSend: function () {
                                $("#GroupUsersTable tr[class='AppImageName'] .Name").text($("#GroupUsersTable tr[class='AppImageName'] .Name").text() + "-deleting user...");
                                $("#GroupUsersTable tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                                $("#GroupUsersTable tr[class='nodata']").css("background-color", "#E6E6E6");
                                $("#GroupUsersTable tr[class='nodata']").css("color", "#3A3A3A");
                                $("#GroupUsersTable tbody tr").unbind("click");
                                $("#GroupUsersTable tbody tr[class!='nodata']").each(function () {
                                    $(this).click(function () {
                                        if ($(this).hasClass("AppImageName")) {
                                            $(this).removeClass('AppImageName');
                                        }
                                        else {
                                            $('#GroupUsersTable tbody tr').removeClass('AppImageName');
                                            $(this).addClass('AppImageName');
                                        }
                                    });
                                });

                                ShowInstantNotification("Progress", "Deleting usergroup '" + selectOldUserToRemove + "'...", "", "appGroupSpan");
                            },
                            success: function (res) {
                                for (var i = 0; i < UserCollectionArray.length; i++) {
                                    var groupUsers = selectUserToRemove;
                                    var nm = groupUsers.split("@")[0];
                                    var dm = groupUsers.split("@")[1];
                                    groupUsers = dm.split(".")[0] + '\\' + nm;
                                    if (UserCollectionArray[i].Name.toLowerCase() == groupUsers.toLowerCase()) {
                                        UserCollectionArray.splice(i, 1);
                                    }
                                }
                                $("#GroupUsersTable tbody tr").each(function () {
                                    if ($(".Name", this).text().trim().indexOf(selectOldUserToRemove) >= 0) {
                                        $(this).remove();
                                    }
                                });
                                if ($("#GroupUsersTable tr").length == 0) {
                                    var rowTemplate = $("#AppUsersDiv .rowTemplate .blankRow tbody").html();
                                    $("#GroupUsersTable tbody").append(rowTemplate);
                                }

                                var prevUserCount = $("#appGroupSpan").text();
                                prevUserCount -= 1;
                                $("#appGroupSpan").text(prevUserCount);
                                ShowInstantNotification("Success", "Successfully deleted usergroup...", "'" + selectOldUserToRemove + "' user deleted successfully.", "appGroupSpan");
                            },
                            complete: function () {
                                deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                                deleteCollectionConfirmationNoCreateNewUser.disabled = false;
                                deleteCollectionConfirmationYesCreateNewUser.disabled = false;
                                $("#AppUserCls a").removeClass("AppImageName");
                                $("#menuRemoveAppUserGroup").removeClass("activeDocBtn");
                            },
                            error: function (error) {
                                deleteCollectionConfirmationModalCreateNewUser.style.display = "none";
                                console.log("ERROR:", error);

                                $("#GroupUsersTable tr[class='nodata'] .Name").text(selectOldUserToRemove);

                                $("#GroupUsersTable tr[class='nodata']").removeClass("nodata").addClass("AppImageName");

                                $("#GroupUsersTable tr[class='AppImageName']").css("background-color", "#FFFFFF");
                                $("#GroupUsersTable tr[class='AppImageName']").css("color", "#000000");
                                $("#GroupUsersTable tr[class='AppImageName']").removeClass("AppImageName");

                                $("#GroupUsersTable tbody tr").unbind("click");
                                $("#GroupUsersTable tbody tr[class!='nodata']").each(function () {
                                    $(this).click(function () {
                                        if ($(this).hasClass("AppImageName")) {
                                            $(this).removeClass('AppImageName');
                                        }
                                        else {
                                            $('#GroupUsersTable tbody tr').removeClass('AppImageName');
                                            $(this).addClass('AppImageName');
                                        }
                                    });
                                });

                                ShowInstantNotification("Error", "Failed deleting user...", "Could not delete '" + selectOldUserToRemove + "' user.", "appGroupSpan");
                            }
                        });
                    }
                    else {
                    }
                }
            }
            else {
            }
        }
        else {
            $("#menuRemoveAppUserGroup").removeClass("activeDocBtn");
        }
    });

    //Configure Basic Settings Blade Close Icon
    $("#ConfigurationBladeCloseIcon").click(function () {
        $("#basicsetting").removeClass("activeDocBtn");
        $("#RDSCollectionSetting").removeClass("activeDocBtn");
        $("#ConfigureBasicSettingBlade").hide();
        $("#createCollection").hide();
    })

    //Create Collection Button
    $("#btnCreateCreateCollection").click(function () {
        //Textbox validations

        //btnOkCreateCollection

        $("#selectappimages").hide();
        $("#appusersdiv").hide();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#blankdiv").hide();
        $("#aaadu").hide();
        $("#su").hide();
        //$("#addCollection").removeClass("active");
        CloseAndMaintainState();
        var thisColSel = $("#txtName").val().trim();

        if (SelectedRDVirtualMachine != "") {
            SelectedRDVirtualMachine = SelectedRDVirtualMachine.substring(0, SelectedRDVirtualMachine.length - 1);
        }
        if (SelectedUsers != "") {
            SelectedUsers = SelectedUsers.substring(0, SelectedUsers.length - 1);
        }
        else {
            //to be dynamically implemented
            SelectedUsers = "ptgrds.local\\TenantAdmin";
        }
        var objCollection = null;

        objCollection =
            {
                "commandName": "adminNewCollection",
                "data":
                        {
                            "CollectionDescription": $("#txtDescription").val().trim(),
                            "CollectionName": $("#txtName").val().trim(),
                            "ConnectionBroker": data.ConnectionBroker,
                            "ConnectionBrokerId": data.ConnectionBrokerId,
                            "SessionHost": SelectedRDVirtualMachine,
                            "UserGroup": SelectedUsers
                        }
            }
        var jsonData = JSON.stringify(objCollection);
        if ($("#txtName").val().trim() != "" && SelectedRDVirtualMachine != "" && SelectedUsers != "") {
            $(".erroricon").hide();
            $("#txtName").removeClass("redborder");
            $(".Errormessage").hide();
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#tblRDSCollection tbody tr[class='nodata']").remove();
                    $("#myviewCollectionDiv .rowTemplate .Name").text($("#txtName").val().trim());
                    $("#myviewCollectionDiv .rowTemplate .CollectionType").text("creating collection...");
                    $("#myviewCollectionDiv .rowTemplate .Size").text("");
                    $("#myviewCollectionDiv .rowTemplate .Burst").text("");
                    $("#myviewCollectionDiv .rowTemplate .Description").text("");
                    var rowTemplate = $("#myviewCollectionDiv .rowTemplate .dataRow tbody").html();
                    $("#tblRDSCollection tbody").append(rowTemplate);

                    $("#RDSHomeDiv").hide();
                    $("#CreateCollectionBlade").hide();
                    $("#addCollection").removeClass("activeDocBtn");
                    RemoveBreadcrumb("appsuserslist");
                    var prevColDep = $("#appCountSpanDeployAdmin").text().trim();
                    prevColDep = (parseInt(prevColDep) + 1);
                    $("#appCountSpanDeployAdmin").text(prevColDep);
                    ShowInstantNotification("Progress", "Creating '" + thisColSel + "' collection...", "", "CreateCollectionBlade");
                },
                complete: function () {
                    SelectedRDVirtualMachine = "";
                    SelectedUsers = "";
                    LoadRDSCollectionAfterCreate(thisColSel);
                },
                success: function (res) {

                    $("#selectserverCount").text("");
                    $("#userCount").text("");
                    $('#myTable').removeClass("active");
                    $("#righticon").show();
                    $("#righticondone").hide();
                    $("#RCArighticon").show();
                    $("#RCArighticondone").hide();
                    $("#RDSHrighticondone").hide();
                    $("#serversArrowIcon").show();
                    $("#appsArrowIcon").show();
                    $("#AddUserrighticondone").hide()
                    $("#createCollection").hide();

                },
                //error: function (error) {
                //    console.log("ERROR:", error);
                //    LogError(data.ApiSubscriptionId, "Create Collection", error);
                //    ShowInstantNotification("Error", "Failed collection...", "Failed creating '" + thisColSel + "' collection.", "CreateCollectionBlade");
                //}
            });
        }
        else {
            if ($("#txtName").val().trim() != "") {
                $(".erroricon").hide();
                $("#txtName").removeClass("redborder");
                if ($("#selectserverCount").text().trim() == "0" || $("#selectserverCount").text().trim() == "") {
                    $(".Errormessage").show();
                }
                else {
                    $(".Errormessage").hide();
                }
            }
            else {

                $(".erroricon").show();
                $("#txtName").addClass("redborder");
                $(".Errormessage").show();
            }

        }
    });


    //Create Collection Blade Close Icon
    $("#CreateCollectionBladeCloseIcon").click(function () {
        $("#appCloseBlade").trigger("click");
        $("#imageCloseBlade").trigger("click");
        $("#min_CreateCollectionBlade").hide();
        $("#CreateCollectionBlade").hide();
        RemoveBreadcrumb("appsuserslist");
        $("#basicsetting").removeClass("activeDocBtn");
        $("#RDSCollectionSetting").removeClass("activeDocBtn");
        $("#addCollection").removeClass("activeDocBtn");
        $("#selectserverCount").text("");
        SelectedRDVirtualMachine = "";
        $(".erroricon").hide();
        $(".Errormessage").hide();
        $("#txtName").removeClass("redborder");
        $("#selectapp").removeClass("active");
        $("#apps").removeClass("active");
    })

    //Close the Add new user in Tenant Admin under Add User
    $("#appCloseBladeCreatenewUser").click(function () {
        RemoveBreadcrumb("appUsersTileBlade");
        $("#min_appusersdivCreatenewUser").hide();
        $("#appusersdivCreatenewUser").hide();
        $("#menuAddNewAppUser").removeClass("activeDocBtn");
    })


    $("#createbutton").click(function () {
        $("#CreateCollectionBlade").show();


    });

    $("#adddesktopclose").click(function () {
        RemoveBreadcrumb("appsdivshow");
        $("#min_adddesktopapp").hide();
        $("#adddesktopapp").hide();
        $("#publishApp123").removeClass("activeDocBtn");
    });

    $("#RDSCollectionSetting").click(function () {
        if (IsDisabledRDSCollectionSetting == 1) {
            $("#createCollection").show();
            $("#ConfigureBasicSettingBlade").hide();
            $("#deviceSettingsNetwork").hide();
            $("#domainJoinDetals").hide();
            $("#appusersdiv").hide();
            $("#selectappimages").hide();
            $("#chooseNetwork").hide();
            $("#deviceSettingsNetwork").hide();
            $("#domainDetails").hide();
            $("#blankdiv").hide();
            $("#basicsetting").removeClass("activeDocBtn");
            $("#RDSCollectionSetting").addClass("activeDocBtn");
            $("#CloseIconCreateCollection").focus();
        }
    });


    if (status == "back") {
        $("#CreateCollectionBlade").show();
        localStorage.setItem("AppBreadcrumbs", "");
    }

    var appImagesmodal = document.getElementById('appImagesModal');
    var appImagesCloseButton = document.getElementById("appImagesCloseButton");

    //appImagesCloseButton.onclick = function () {
    //    appImagesmodal.style.display = "none";
    //}
    //
    //
    ////App Users Modal
    //var appUsersmodal = document.getElementById('appUsersModal');
    //var appUsersbtn = document.getElementById("appusersok");
    //var appUsresCrossButton = document.getElementById("appUsersCrossButton");
    //var appUsersCloseButton = document.getElementById("appUsersCloseButton");
    //
    ////Create new User Modal
    //var appUsersmodalCreateNewUser = document.getElementById('appUsersModalCreateNewUser');
    //var appUsersbtnCreateNewUser = document.getElementById("appusersokCreateNewUser");
    //
    //
    //document.getElementById("userStatusCreateNewUserFailureCloseButton").onclick = function () {
    //    Editufailedmodalbox.style.display = "none";
    //}    
    //
    //appUsersCloseButton.onclick = function () {
    //    appUsersmodal.style.display = "none";
    //}

    $('ul li a').click(function () {
        $('li a').removeClass("active");
        $(this).addClass("active");
    });

    $("#aaadu").hide();
    $("#su").hide();
    $("#usersselected").hide();
    $("#selusers").click(function () {
        $("#su").show();
    });
    $("#usrinfo").click(function () {
        $("#usersselected").show();
    });

    $("#selctdusersdiv").click(function () {
        $("#su").hide();
    });

    $("#appusersok").click(function () {
        if ($("#myTable tr[class='AppImageName']").length > 0) {
            $("#apps").removeClass("activeDocBtn");
            $("#appsUserValidation").hide();
            $("#appusersdiv").hide();
            $("#aaadu").hide();
            $("#su").hide();
            $("#appsArrowIcon").hide();
            $("#AddUserrighticondone").show();
            $("#AddUserrighticondone").css("margin-top", "20px");
            var strUserCount = 0;
            $("#myTable tr[class='AppImageName']").each(function () {
                strUserCount++;
                SelectedUsers += $(".Name", this).text().trim() + ",";
            });
            if (parseInt(strUserCount) > 1) {
                $("#userCount").text(strUserCount + " Users selected");
            }
            else {
                $("#userCount").text(strUserCount + " User selected");
            }

        }
        else {
            $("#appsUserValidation").show();
        }
    });

    $("#appusersokCreateNewUser").click(function () {
        $("#appCloseBladeCreatenewUser").trigger("click");
        var selectedusercount = "";
        var selgroupUsers = "";
        selectedusercount = $("#myTableCreateNewUser tr[class='AppImageName']").length;
        if ($("#myTableCreateNewUser tr[class='AppImageName']").length > 0) {
            var groupUsers = "";

            $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                groupUsers += $(this).text().trim() + ",";
            });
            $("#myTableCreateNewUser tbody tr[class='AppImageName']").each(function () {
                groupUsers += $(".Name", this).text().trim() + ",";
                selgroupUsers += $(".Name", this).text().trim() + ",";
                $("#AppUsersDiv .rowTemplate .Name").text($(".Name", this).text().trim() + " - adding user...");
                var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                $("#AppUsersTable tbody").append(rowTemplate);
                $("#AppUsersTable tbody tr:last").attr("blankrow", "blankrow");
            });
            if (groupUsers != "") {
                groupUsers = groupUsers.substring(0, groupUsers.length - 1);
            }
            var AddappscollectionCreateNewUser =
                        {
                            "commandName": "addusercollection",
                            data: {
                                "ConnectionBroker": data.ConnectionBroker,
                                "CollectionName": selectedCollectionName,
                                "UserGroup": groupUsers
                            }
                        }
            var jsonData = JSON.stringify(AddappscollectionCreateNewUser);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#appusersdivCreatenewUser").hide();
                    $("#AppUsersTable tbody .nodata").remove();
                    ShowInstantNotification("Progress", "Adding '" + selectedusercount + "' User(s)...", "", "appusersokCreateNewUser");
                },
                success: function (res) {
                    $("#AppUsersTable tbody tr[blankrow='blankrow']").remove();
                    var totalSelected = 0;
                    var eachusr = selgroupUsers.split(",");
                    for (var j = 0; j < eachusr.length; j++) {
                        if (eachusr[j].trim() != "") {
                            var thisusr = eachusr[j];
                            var nm = thisusr.split("@")[0];
                            var dm = thisusr.split("@")[1];
                            thisusr = dm.split(".")[0] + '\\' + nm;
                            $("#AppUsersDiv .rowTemplate .Name").text(thisusr);
                            var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                            $("#AppUsersTable tbody").append(rowTemplate);
                            UserCollectionArray.push({
                                Name: thisusr
                            });
                            totalSelected++;
                        }
                    }

                    $("#AppUsersTable tbody tr[class!='nodata']").unbind("click");
                    $("#AppUsersTable tbody tr[class!='nodata']").each(function () {
                        $(this).click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                $("#menuRemoveAppUser").attr("disabled", true);
                            }
                            else {
                                $('#AppUsersTable tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                $("#menuRemoveAppUser").attr("disabled", false);
                            }
                        });
                    });


                    var prevUserCount = $("#appUsersSpan").text();
                    prevUserCount = (parseInt(prevUserCount) + totalSelected);
                    $("#appUsersSpan").text(prevUserCount);
                    $("#addusernm").text(selectedCollectionName);
                    $("#addcustomapps").hide();
                    ShowInstantNotification("Success", "Successfully added user(s)...", "'" + selectedusercount + "' user(s) added successfully.", "appusersokCreateNewUser");
                },
                error: function (error) {
                    $("#AppUsersTable tbody tr[blankrow='blankrow']").remove();
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Create New User", error);
                    ShowInstantNotification("Error", "Failed adding user(s)...", "Failed adding '" + selectedusercount + "' user(s).", "appusersokCreateNewUser");
                },
                complete: function () {
                    $("#AppUserCls a").removeClass("AppImageName");
                    $("#menuAddNewAppUser").removeClass("activeDocBtn");
                }
            });
        }
        else {
            $("#appsUserValidationCreateNewUser").show();
        }
    });

    $("#btnOKDeviceSettingsandNetwork").click(function () {
        $("#deviceSettingsNetwork").hide();
        $("#blankdiv").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#domainJoinDetals").hide();

    });

    $("#blankdiv").hide();
    //$("#navbarleft").hide();

    $("#aaadbtn").click(function () {
        $("#appscontent").show();
        $("#aaadu").show();
        $("#appuserscontent").hide();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#blankdiv").hide();
    });

    $("#selectapp").click(function () {
        AddBreadcrumb("Add RD Virtual Machines", "selectapp", "CreateCollectionBlade");
        $("#min_selectappimages").hide();
        $("#min_appusersdiv").hide();
        var addRDVMLoader = $('#selectappimagesLoader');
        var selectappimages = $('#selectappimages');
        addRDVMLoader.width(selectappimages.width() + 1);
        addRDVMLoader.height(selectappimages.height());
        selectappimages.show();
        addRDVMLoader.show();

        setTimeout(function () {
            addRDVMLoader.hide();
        }, 1000);

        $("#appuserscontent").hide();
        $("#appusersdiv").hide();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#appscontent").hide();
        $("#blankdiv").hide();
        $("#appsImageValidation").hide();
        $("#RDSCollectionSetting").addClass("activeDocBtn");
        $("#addCollection").addClass("activeDocBtn");
        IsAlternateVirtualMachine = 1;
        ScrollToHorizontalEnd($("#selectappimages").width());
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + data.ConnectionBroker + "/" + data.role + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#AppImagesSpinner").show();
                $("#AppsImagesTableId tbody").html('');
                $("#btnShowselected").attr("disabled", true);
            },
            success: function (res) {
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        $("#availableRDServer .rowTemplate .Name").text(res[i].Name);
                        $("#availableRDServer .rowTemplate .Type").text(res[i].Type);
                        var rowTemplate = $("#availableRDServer .rowTemplate .dataRow tbody").html();
                        $("#AppsImagesTableId tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#availableRDServer .rowTemplate .blankRow tbody").html();
                    $("#AppsImagesTableId tbody").append(rowTemplate);
                }
                $("#AppsImagesTableId tbody tr[class!='nodata']").each(function () {
                    var curRow = $(".Name", this).text().trim();
                    if (SelectedRDVirtualMachine.indexOf(curRow) >= 0) {
                        $(this).addClass("AppImageName");
                        $("#btnShowselected").attr("disabled", false);
                    }
                });
                $("#AppsImagesTableId tbody tr[class!='nodata']").unbind("click");
                $("#AppsImagesTableId tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                    }
                    else {
                        $(this).addClass('AppImageName');
                    }
                    if ($("#AppsImagesTableId tr[class='AppImageName']").length > 0) {
                        $("#btnShowselected").attr("disabled", false);
                    }
                    else {
                        $("#btnShowselected").attr("disabled", true);
                    }

                });
                frmCreateCollection = "yes";
            },
            complete: function () {
                $("#AppImagesSpinner").hide();
            },
            error: function (error) {
                $("#AppImagesSpinner").hide();
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Load RD VM at Creating collection time.", error);
            }
        });
    });

    $("#apps").click(function () {
        //Bread Crumb
        AddBreadcrumb("Add Users", "appusersdiv", "CreateCollectionBlade");
        var appuserLoader = $('#appusersdivLoader');
        var appuserdiv = $('#appusersdiv');
        appuserLoader.width(appuserdiv.width() + 1);
        appuserLoader.height(appuserdiv.height());
        appuserdiv.show();
        appuserLoader.show();

        setTimeout(function () {
            appuserLoader.hide();
        }, 1000);
        $("#min_appusersdiv").hide();
        $("#min_selectappimages").hide();
        $("#appscontent").show();
        $("#appuserscontent").hide();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#aaadu").hide();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
        $("#appsUserValidation").hide();
        $("#RDSCollectionSetting").addClass("activeDocBtn");
        $("#addCollection").addClass("activeDocBtn");
        ScrollToHorizontalEnd($("#appusersdiv").width());
        //For App User
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetADUser/" + data.ApiSubscriptionId + "/" + Deployname + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#AppUsersSpinner").show();
                $("#appusersok").attr("disabled", true);
                $("#myTable tbody").html('');
            },
            success: function (res) {
                AddUserCollectionArray = [];
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        AddUserCollectionArray.push({
                            Name: res[i].Name,
                        });
                        $("#appsuserdivscreen7 .rowTemplate .Name").text(res[i].Name);
                        var rowTemplate = $("#appsuserdivscreen7 .rowTemplate .dataRow tbody").html();
                        $("#myTable tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#appsuserdivscreen7 .rowTemplate .blankRow tbody").html();
                    $("#myTable tbody").append(rowTemplate);
                }

                $("#myTable tbody tr").each(function () {
                    var curRow = $(this).text().trim();
                    if (SelectedUsers.indexOf(curRow) >= 0) {
                        $(this).addClass("AppImageName");
                        $("#appusersok").attr("disabled", false);
                    }
                });
                $("#myTable tbody tr[class!='nodata']").unbind("click");
                $("#myTable tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                    }
                    else {
                        $(this).addClass('AppImageName');
                    }
                    if ($("#myTable tr[class='AppImageName']").length > 0) {
                        $("#appusersok").attr("disabled", false);
                    }
                    else {
                        $("#appusersok").attr("disabled", true);
                    }
                });
            },
            complete: function () {
                $("#AppUsersSpinner").hide()
            },
            error: function (error) {
                appUsersmodal.style.display = "block";
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Retrieving add users", error);
            }
        });
    });

    $("#appusers").click(function () {
        $("#appuserscontent").show();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#appscontent").hide();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
    });

    $("#optionalConfiguration").click(function () {
        $("#deviceSettingsNetwork").show();
        $("#appuserscontent").hide();
        $("#appscontent").hide();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
        $("#closeIconDeviceSettingsNetwork").focus();
        $("#RDSCollectionSetting").addClass("activeDocBtn");
    });

    $("#virtualnetwork").click(function () {
        $("#chooseNetwork").show();
        $("#appuserscontent").hide();
        $("#domainJoinDetals").hide();
        $("#domainDetails").hide();
        $("#appscontent").hide();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
        $("#closeIconChooseNetwork").focus();
    });

    $("#domainJoin").click(function () {
        $("#domainJoinDetals").show();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#appscontent").hide();
        $("#appuserscontent").hide();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
        $("#closeIconDomainJoinDetail").focus();
    });

    $("#createNew").click(function () {
        $("#domainDetails").show();
        $("#selectappimages").hide();
        $("#blankdiv").hide();
        $("#closeIcondomainDetails").focus();
    });

    $("#subnetUndefined").click(function () {
        $("#blankdiv").show();
        $("#domainDetails").hide();
        $("#chooseNetwork").hide();
        $("#closeIconBlankDiv").focus();
    });

    $("#ARA-image").click(function () {
        $("#blankdiv").show();
        $("#domainDetails").hide();
        $("#closeIconBlankDiv").focus();
    });

    $("#BugBash").click(function () {
        $("#blankdiv").show();
        $("#domainDetails").hide();
        $("#closeIconBlankDiv").focus();
    });

    $("#Latestapp").click(function () {
        $("#blankdiv").show();
        $("#domainDetails").hide();
        $("#closeIconBlankDiv").focus();
    });

    $("#scaravent").click(function () {
        $("#blankdiv").show();
        $("#domainDetails").hide();
        $("#closeIconBlankDiv").focus();
    });

    /* Create Collection Ok Button functionality*/


    $("#CloseIconCreateCollection").click(function () {
        CloseAndMaintainState();
        $("#selectappimages").hide();
        $("#appusersdiv").hide();
        $("#deviceSettingsNetwork").hide();
        $("#domainJoinDetals").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#blankdiv").hide();
    });
    /*all Close icons functionality*/

    $("#appCloseBlade").click(function () {
        RemoveBreadcrumb("CreateCollectionBlade");
        $("#min_appusersdiv").hide();
        $("#appusersdiv").hide();
        $("#aaadu").hide();
        $("#su").hide();
        $("#apps").removeClass("active");
    });

    $("#closeIconAddDirecCloseBlade").click(function () {
        $("#aaadu").hide();
        $("#su").hide();
    });


    $("#imageCloseBlade").click(function () {
        $("#selectappimages").hide();
        $("#min_selectappimages").hide();
        $("#AddRDServerClick").removeClass("activeDocBtn");
        RemoveBreadcrumb("serversshow");
        $("#selectapp").removeClass("active");
        $("#AddRDServerClick").removeClass("activeDocBtn");
    })

    $("#closeIconDeviceSettingsNetwork").click(function () {
        $("#deviceSettingsNetwork").hide();
        $("#blankdiv").hide();
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#domainJoinDetals").hide();
    });

    $("#closeIconDomainJoinDetail").click(function () {
        $("#domainJoinDetals").hide();
    });

    $("#closeIconChooseNetwork").click(function () {
        $("#chooseNetwork").hide();
        $("#domainDetails").hide();
        $("#blankdiv").hide();

    });

    $("#closeIcondomainDetails").click(function () {
        $("#domainDetails").hide();
    });

    $("#closeIconBlankDiv").click(function () {
        $("#blankdiv").hide();
    });

    $("#closeIconSu").click(function () {
        $("#su").hide();
    });

    /* Domain Join Detail Validations*/
    $("#btnDomaindetail").click(function () {

        if ($("#domain").val() != "" && $("#username").val() != "" && $("#password").val() != "" && $("#confirmpassword").val() != "") {
            $("#domainJoinDetals").hide();
        }
        else {
            $('.domainJointxt').not("#unit").each(function () {

                if ($(this).val() == '') {
                    $(this).css("border", "1px solid red");
                    return false;
                }
            });
        }

        $("#confirmpassword").focusout(function () {
            if ($("#password").val() != $("#confirmpassword").val()) {

                $("#spanConfirmPassword").addClass("error");
            }
        });
        var UserName = $("#username").val()
    });
    /* Domain Join Detail Validations End*/

    /* Create New Validations */
    $("#btnsaveCreateNewDomain").click(function () {

        if ($("#name").val() != "" && $("#address").val() != "" && $("#subnet").val() != "" && $("#subnetaddress").val() != "") {
            $("#domainDetails").hide();
        }
        else {
            $('.txtValidate').each(function () {

                if ($(this).val() == '') {
                    $(this).css("border", "1px solid red");
                    return false;
                }
            });
        }

    });
    /* Create New Validations End */

    $("#btnShowselected").click(function () {//select clcik function

        if ($("#AppsImagesTableId tr[class='AppImageName']").length > 0) {
            if ($("#txtName").val().trim() != "") {
                $(".Errormessage").hide();
            }
            $("#selectapp").removeClass("activeDocBtn");
            if (IsAlternateVirtualMachine == 0) {
                var thisSelServers = "";
                var thisSelServersType = "";
                var totalSelLenght = 0;
                $("#AppsImagesTableId tr[class='AppImageName']").each(function () {
                    thisSelServers += $(".Name", this).text().trim() + ",";
                    thisSelServersType += $(".Type", this).text().trim() + ",";
                    $("#rdsservers .rowTemplate .Name").text($(".Name", this).text().trim());
                    $("#rdsservers .rowTemplate .Status").text("");
                    $("#rdsservers .rowTemplate .Type").text("creating RD virtual machine..");
                    $("#rdsservers .rowTemplate .Sessions").text("");
                    var rowTemplate = $("#rdsservers .rowTemplate .dataRow tbody").html();
                    $("#serverlistselectid tbody").append(rowTemplate);
                    $("#serverlistselectid tbody tr:last").attr("blankrow", "blankrow");
                    totalSelLenght++;
                });
                if (thisSelServers != "") {
                    thisSelServers = thisSelServers.substring(0, thisSelServers.length - 1);
                }
                if (thisSelServersType != "") {
                    thisSelServersType = thisSelServersType.substring(0, thisSelServersType.length - 1);
                }
                $("#appsImageValidation").hide();
                $("#selectedName").text(selectedItems);
                $("#selectappimages").hide();
                $("#RDSHrighticondone").show();
                $("#AddRDServerClick").removeClass("activeDocBtn");

                $("#serversArrowIcon").hide();
                var values = $('#listOfADUsers').map(function () {
                    return $(this).attr('data-value');
                });

                if (frmCreateCollection == "no") {

                    var objCollection =
                        {
                            ServerDetails: {
                                CollectionName: selectedCollectionName, ServerNames: thisSelServers
                            }
                        }
                    var jsonData = JSON.stringify(objCollection);
                    $.ajax({
                        url: data.ApiUrl + "admin/AddCollectionServers/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
                        type: "POST",
                        crossDomain: true,
                        dataType: "json",
                        data: jsonData,
                        beforeSend: function () {
                            $("#imageCloseBlade").trigger("click");
                            $("#serverlistselectid tbody tr[class='nodata']").remove();
                            ShowInstantNotification("Progress", "Adding '" + totalSelLenght + "' RD virtual machine(s)'...", "", "btnShowselected");
                        },
                        success: function (res) {
                            $("#serverlistselectid tbody tr[blankrow='blankrow']").remove();
                            //Update Size column
                            var prevSize = $("#tblRDSCollection tr[class='AppImageName']").find("td").eq(2).text().trim();
                            prevSize = parseInt(prevSize) + parseInt(totalSelLenght);
                            $("#tblRDSCollection tr[class='AppImageName']").find("td").eq(2).text(prevSize.toString());
                            prevSize = $("#serverCountSpan").text().trim();
                            prevSize = parseInt(prevSize) + parseInt(totalSelLenght);
                            $("#serverCountSpan").text(prevSize.toString());

                            var eachServers = thisSelServers.split(",");
                            var eachServersType = thisSelServersType.split(",");
                            for (var j = 0; j < eachServers.length; j++) {
                                $("#rdsservers .rowTemplate .Name").text(eachServers[j]);
                                $("#rdsservers .rowTemplate .Status").text("STATE_ACTIVE");
                                $("#rdsservers .rowTemplate .Type").text(eachServersType[j]);
                                $("#rdsservers .rowTemplate .Sessions").text("0");
                                var rowTemplate = $("#rdsservers .rowTemplate .dataRow tbody").html();
                                $("#serverlistselectid tbody .nodata").html('');
                                $("#serverlistselectid tbody").append(rowTemplate);
                            }

                            $("#serverlistselectid tbody tr[class!='nodata']").unbind("click");
                            $("#serverlistselectid tbody tr[class!='nodata']").click(function () {
                                if ($(this).hasClass("AppImageName")) {
                                    $(this).removeClass('AppImageName');
                                    $("#RemoveRDServerclick").attr("disabled", true);
                                    $("#sendmessageVMclick").attr("disabled", true);
                                    $("#enablerdservertenant").attr("disabled", true);
                                    $("#disablerdservertenant").attr("disabled", true);
                                    $("#messageCloseBladeVM").trigger("click");
                                    $("#sendmessageVMclick").removeClass("activeDocBtn");
                                }
                                else {
                                    $('#serverlistselectid tbody tr').removeClass('AppImageName');
                                    $(this).addClass('AppImageName');
                                    $("#RemoveRDServerclick").attr("disabled", false);
                                    $("#sendmessageVMclick").attr("disabled", false);
                                    $("#enablerdservertenant").attr("disabled", false);
                                    $("#disablerdservertenant").attr("disabled", false);
                                }
                                manageEnableDisableRDVM($(".Status", this).text().trim());
                            });
                            ShowInstantNotification("Success", "Successfully added RD virtual machine(s)...", "'" + totalSelLenght + "' virtual machine(s) added succesfully.", "btnShowselected");
                        },
                        error: function (error) {
                            $("#serverlistselectid tbody tr[blankrow='blankrow']").remove();
                            LogError(data.ApiSubscriptionId, "Add Virtual Machines", error);
                            ShowInstantNotification("Error", "Error adding RD virtual machine(s)...", "'" + totalSelLenght + "' virtual machine(s) adding failed.", "btnShowselected");
                        },
                        complete: function () {
                            $("#selectappimages").hide();
                        }
                    });
                }
            }
            else {
                $("#serversArrowIcon").hide();
                $("#AppsImagesTableId tr[class='AppImageName']").each(function () {
                    SelectedRDVirtualMachine += $(".Name", this).text().trim() + ",";
                });
                if (parseInt($("#AppsImagesTableId tr[class='AppImageName']").length) > 1) {
                    $("#selectserverCount").html("&nbsp;&nbsp;&nbsp;&nbsp;" + $("#AppsImagesTableId tr[class='AppImageName']").length + " virtual machines selected");
                }
                else {
                    $("#selectserverCount").html("&nbsp;&nbsp;&nbsp;&nbsp;" + $("#AppsImagesTableId tr[class='AppImageName']").length + " virtual machine selected");
                }
                $("#RDSHrighticondone").show();
                $("#RDSHrighticondone").css("margin-top", "20px");
                IsAlternateVirtualMachine = 0;
                $("#selectappimages").hide();
            }
        }
    });

    $("#RemoveRDServerclick").click(function () {
        if ($("#RemoveRDServerclick").prop("disabled") == false) {
            frmCreateCollection = "no";
            $("#imageCloseBlade").trigger("click");
            $("#messageCloseBladeVM").trigger("click");
            $("#SHSMonitorCloseBlade").trigger("click");
            var selectedserverremove = "";
            selectedserverremove = $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim();
            $("#RemoveRDServerclick").addClass("activeDocBtn");

            //ajax call to remove server from collections
            $("#removesessionSpan").text(selectedserverremove);
            removeSessionHostServerConfirmationModal.style.display = "block";
            removeSessionHostServerConfirmationNo.onclick = function () {
                removeSessionHostServerConfirmationModal.style.display = "none";
                $("#RemoveRDServerclick").removeClass("activeDocBtn");
            }
            removeSessionHostServerConfirmationYes.onclick = function () {
                removeSessionHostServerConfirmationModal.style.display = "none";
                var objCollection =
                                {
                                    "commandName": "removeCollectionServer",
                                    "data": {
                                        "ConnectionBroker": data.ConnectionBroker,
                                        "SessionHost": $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim()
                                    }
                                }

                var jsonData = JSON.stringify(objCollection);
                $.ajax({
                    url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                    type: "POST",
                    crossDomain: true,
                    dataType: "json",
                    data: jsonData,
                    beforeSend: function () {
                        $("#serverlistselectid tr[class='AppImageName'] .Status").text("");
                        $("#serverlistselectid tr[class='AppImageName'] .Type").text("deleting RD virtual machine...");
                        $("#serverlistselectid tr[class='AppImageName'] .Sessions").text("");

                        $("#serverlistselectid tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                        $("#serverlistselectid tr[class='nodata']").css("background-color", "#E6E6E6");
                        $("#serverlistselectid tr[class='nodata']").css("color", "#3A3A3A");
                        $("#serverlistselectid tbody tr").unbind("click");
                        $("#serverlistselectid tbody tr[class!='nodata']").click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                $("#RemoveRDServerclick").attr("disabled", true);
                                $("#sendmessageVMclick").attr("disabled", true);
                                $("#enablerdservertenant").attr("disabled", true);
                                $("#disablerdservertenant").attr("disabled", true);
                                $("#messageCloseBladeVM").trigger("click");
                                $("#sendmessageVMclick").removeClass("activeDocBtn");
                            }
                            else {
                                $('#serverlistselectid tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                $("#RemoveRDServerclick").attr("disabled", false);
                                $("#sendmessageVMclick").attr("disabled", false);
                                $("#enablerdservertenant").attr("disabled", false);
                                $("#disablerdservertenant").attr("disabled", false);
                            }
                            manageEnableDisableRDVM($(".Status", this).text().trim());
                        });

                        ShowInstantNotification("Progress", "Removing RD VM '" + selectedserverremove + "'...", "", "RemoveRDServerclick");
                    },
                    success: function (res) {
                        //Update Size column
                        var prevSize = $("#serverCountSpan").text().trim();
                        prevSize--;
                        $("#serverCountSpan").text(prevSize.toString());
                        removeSessionHostServerConfirmationModal.style.display = "none";
                        $("#serverlistselectid tbody tr").each(function () {
                            if ($(".Name", this).text().trim() == selectedserverremove) {
                                $(this).remove();
                            }
                        });
                        if ($("#serverlistselectid tbody tr").length == 0) {
                            var rowTemplate = $("#rdsservers .rowTemplate .blankRow tbody").html();
                            $("#serverlistselectid tbody").append(rowTemplate);
                        }
                        var prevSize = $("#tblRDSCollection tbody tr[class='AppImageName'] td:eq(2)").text();
                        prevSize--;
                        $("#tblRDSCollection tbody tr[class='AppImageName'] td:eq(2)").text(prevSize);
                        ShowInstantNotification("Success", "Successfully removed RD VM...", "'" + selectedserverremove + "' RD VM removed succesfully.", "RemoveRDServerclick");
                    },
                    complete: function () {
                        removeSessionHostServerConfirmationModal.style.display = "none";
                        removeSessionHostServerConfirmationNo.disabled = false;
                        removeSessionHostServerConfirmationYes.disabled = false;
                        $("#RemoveRDServerclick").removeClass("activeDocBtn");
                        $("#RemoveRDServerclick").attr("disabled", true);
                    },
                    error: function (error) {
                        LogError(data.ApiSubscriptionId, "Remove Virtual Machines", error);
                        ShowInstantNotification("Error", "Error removing RD VM...", "'" + selectedserverremove + "' RD VM removing failed.", "RemoveRDServerclick");
                    }
                });

            }
        }
        else {
            $("#RemoveRDServerclick").removeClass("activeDocBtn");
        }
    });

    //ajax call to enable rd server in tenant admin

    $("#enablerdservertenant").click(function () {
        if ($("#enablerdservertenant").prop("disabled") == false) {
            var dply = $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim();
            var objCollection =
                {
                    "commandName": "startserver",
                    "data": {
                        "ConnectionBroker": data.ConnectionBroker,
                        "SessionHost": $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim()
                    }
                }
            var jsonData = JSON.stringify(objCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Enabeling '" + dply + "' RD VM...", "", "enablerdserver");
                },
                success: function (res) {

                    ShowInstantNotification("Success", "Successfully enabled RD VM", "Successfully enabled connection for RD VM '" + dply + "'.", "enablerdserver");
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed enabling...", "Failed enabling connection for RD VM '" + dply + "' connection.", "enablerdserver");
                    LogError(data.ApiSubscriptionId, "Enable RD Virtual Machine", error);
                    console.log("ERROR:", error);
                },
                complete: function () {
                    $("#rdservershow").trigger("click");
                    $("#enablerdservertenant").removeClass("activeDocBtn");
                }
            });
        }
        else
            $("#enablerdservertenant").removeClass("activeDocBtn");

    });

    //ajax call to disable selected rd server tenant

    $("#disablerdservertenant").click(function () {
        if ($("#disablerdservertenant").prop("disabled") == false) {
            var dply = $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim();
            var objCollection =
                {
                    "commandName": "shutdownserver",
                    "data": {
                        "ConnectionBroker": data.ConnectionBroker,
                        "SessionHost": $("#serverlistselectid tr[class='AppImageName'] .Name").text().trim()
                    }
                }
            var jsonData = JSON.stringify(objCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Disabling connection for RD VM '" + dply + "'.", "", "disablerdserver");
                },
                success: function (res) {
                    $("#disableservernm").text(dply);
                    ShowInstantNotification("Success", "Successfully disabled...", "Sussessfully disabled connection for RD VM '" + dply + "'.", "disablerdserver");

                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Disable Virtual Machine", error);
                    ShowInstantNotification("Error", "Failed disable...", "Failed disabling connection for RD VM '" + dply + "' connection.", "disablerdserver");

                },
                complete: function () {
                    $("#rdservershow").trigger("click");
                    $("#disablerdservertenant").removeClass("activeDocBtn");
                }
            });
        }
        else {
            $("#disablerdservertenant").removeClass("activeDocBtn");
        }
    });

    //Select button

    $("#btnSelect").click(function () {
        var values = $('#listOfADUsers').map(function () {
            return $(this).attr('data-value');
        });

        // TODO: Store actual selected value
        localStorage.setItem("AADUser", "TestValue");
    });

    $("#showselected").click(function () {//select clcik function
        var check = data.selectedImageNameList();
        var count = data.selectedImageNameList().length;


        $("#selectserverCount").text(count);

        if (check == "") {
            //alert("Please select Image name");
            $("#appsImageValidation").show();
            return false;
        }
        else {
            $("#appsImageValidation").hide();
            $("#selectedName").text(selectedItems);
            $("#selectappimages").hide();
            var values = $('#listOfADUsers').map(function () {
                return $(this).attr('data-value');
            });

            // TODO: Store actual selected value
            localStorage.setItem("AppImage", data.selectedImageNameList());

        }
    });

    $("#btnSelect_appsImages").click(function () {
        var values = $("#table-responsivev table td").selected;

        // TODO: Store actual selected value

    });

    //active the button
    $('.addactive .table tbody').on('click', function (event) {
        $('.act-rmv table tbody tr').removeClass('active');
        $(event.target).parent().addClass('active');
        $("")
    });

    $('.addactive2 .table tbody').on('click', function (event) {
        $('.act-rmv table tbody tr').removeClass('active');
        $(event.target).parent().addClass('active');
    });

    //Create Collections JS Ends

    //RemoteApp Collections JS Starts

    //Initialze
    $("#CreateCollectionBlade").hide();
    $("#ConfigureBasicSettingBlade").hide();


    $("#selectappsimages").hide();
    $("#brustconfig").hide();
    $("#userprofileconfig ").hide();
    $("#auditlogsconfig").hide();
    $("#appUser").hide();
    $("#settings").hide();
    $("#ImportUserBlade").hide();
    $("#updatesappsimages").hide();
    $("#selectappsimages").hide();
    $("#signoutuser").hide();
    $("#appUsersTileBlade").hide();
    $("#appsdivshow").hide();
    $("#addcustomapps").hide();
    $("#edidcustomapps").hide();
    $("#activitysession").hide();
    $("#activesession").hide();
    $("#sendmessage").hide();
    $("#downloadusageshow").hide();
    $("#builduser").hide();
    $("#serversshow").hide();


    $("#delivermessageclick").click(function () {
        if ($("#msgtitle").val().trim() == "") {
            $("#sessionmesgerroricon").show();
            $("#msgtitle").addClass("redborder");
            $("#errorsessionmesg").show();
        }
        else if ($("#comment").val().trim() != "") {
            var selectedOption = $("#selectedUserName :selected").val();
            if (selectedOption == 0) {
                sendMessageSelectedUser();
            }
            else {
                sendMessageAllUser();
            }
        }
        else {
            $("#errorsessionmesg").show();
        }

    });

    //key up function for message title in session

    $("#msgtitle").keyup(function () {
        $("#sessionmesgerroricon").hide();
        $("#msgtitle").removeClass("redborder");
        if ($("#comment").val().trim() != "") {
            $("#errorsessionmesg").hide();
        }
    });

    //key up function for message body in session

    $("#comment").keyup(function () {
        if ($("#msgtitle").val().trim() != "") {
            $("#errorsessionmesg").hide();
        }
    });
    //key up function for title in message rd server

    $("#msgtitleVM").keyup(function () {
        $("#rdservererroricon").hide();
        $("#msgtitleVM").removeClass('redborder');
        if ($("#commentVM").val().trim() != "") {
            {
                $("#errorvmmessage").hide();
            }
        }
    });

    // key up function for message in message rd server
    $("#commentVM").keyup(function () {
        if ($("#msgtitleVM").val().trim() != "") {
            $("#errorvmmessage").hide();
        }
    });


    $("#delivermessageclickVM").click(function () {
        var selectedOption = $("#selectedUserNameVM option:selected").val();
        if (selectedOption == 0) {
            sendMessageSelectedUserVM($("#selectedUserNameVM option:selected").text());
        }
        else {
            sendMessageAllUserVM();
        }
    });

    $("#messageCloseBladeVM").click(function () {
        $("#min_sendmessageVM").hide();
        $("#sendmessageVM").hide();
        $("#commentVM").val('');
        $("#sendmessageVMclick").removeClass("activeDocBtn");
        RemoveBreadcrumb("serversshow");
        $("#rdservererroricon").hide();
        $("#errorvmmessage").hide();
        $("#msgtitleVM").removeClass('redborder');
        $("#msgtitleVM").val('');
        $("#commentVM").val('');
        $("#sendmessageVMclick").removeClass("activeDocBtn");
    });

    $("#messageCloseBlade").click(function () {
        $("#min_sendmessage").hide();
        $("#sessionmesgerroricon").hide();
        $("#msgtitle").removeClass("redborder");
        $("#errorsessionmesg").hide();
        RemoveBreadcrumb("activesession");
        $("#sendmessage").hide();
        $("#comment").val('');
        document.getElementById("msgtitle").value = "";
        document.getElementById("comment").value = "";
        $("#sendmessageshowclick").removeClass("activeDocBtn");
    });

    $("#sendmessageshowclick").click(function () {
        if ($("#sendmessageshowclick").prop("disabled") == false) {
            $("#sendmessageshowclick").addClass("activeDocBtn");
            $("#min_sendmessage").hide();
            AddBreadcrumb("Message", "sendmessage", "activesession");
            $("#appsuserslist").show();
            $("#settings").hide();
            $("#ImportUserBlade").hide();
            $("#activitysession").hide();
            $("#builduser").hide();
            $("#appsdivshow").hide();
            $("#appsdivshow").hide();
            $("#downloadusageshow").hide();
            $("#addcustomapps").hide();
            $("#edidcustomapps").hide();
            $("#activesession").show();
            $("#sendmessage").show();
            ScrollToHorizontalEnd($("#sendmessage").width());
            $("#updatesappsimages").hide();
            $("#selectappsimages").hide();
            $("#signoutuser").hide();

            $("#ConfigureBasicSettingBlade").hide();
            $("#CreateCollectionBlade").hide();
            $("#selectedUserName option[value=0]").text($("#ActivesSessionCls tr[class='AppImageName'] .UserName").text().trim());
            $("#errorsessionmesg").hide();
            $("#sessionmesgerroricon").hide();
            $("#msgtitle").removeClass("redborder");
        }
        else {
            $("#sendmessageshowclick").removeClass("activeDocBtn");
        }
    });

    $("#btnokdesktopapp").click(function () {
        $("#adddesktopclose").trigger("click");
        var DeskAppName = "";
        var DeskAppPath = "";
        var iconContents = "";
        var alias = "";
        var tCount = 0;
        tCount = $("#desktopapplistselectid tr[class='AppImageName']").length;
        $("#desktopapplistselectid tr[class='AppImageName']").each(function () {
            DeskAppName += $(".Name", this).text().trim() + ",";
            DeskAppPath += $(".Path", this).text().trim() + ",";
            iconContents += $(".IconContents", this).text() + ",";

            $("#appStatusDiv .rowTemplate .IconContents ").html("<img src='data:image/jpeg;base64," + $(".IconContents", this).text() + "'\" style=\"width:25px; height:25px; float:left;\" />");
            $("#appStatusDiv .rowTemplate .Alias").text("");
            $("#appStatusDiv .rowTemplate .Name").text($(".Name", this).text().trim());
            $("#appStatusDiv .rowTemplate .Status").text("");
            $("#appStatusDiv .rowTemplate .Status").prev().remove();
            $("#appStatusDiv .rowTemplate .Path").text("Publishing app...");
            var rowTemplate = $("#appStatusDiv .rowTemplate .dataRow tbody").html();
            $("#appsTable tbody").append(rowTemplate);
            $("#appsTable tbody tr:last").attr("blankarea", "blankarea");
        });
        DeskAppName = DeskAppName.substring(0, DeskAppName.length - 1);
        DeskAppPath = DeskAppPath.substring(0, DeskAppPath.length - 1);

        var Addappscollection = {
            AppDetails: { ConnectionBroker: data.ConnectionBroker, CollectionName: selectedCollectionName, DisplayNames: DeskAppName, Path: DeskAppPath }
        };
        var jsonData = JSON.stringify(Addappscollection);

        $.ajax({
            url: data.ApiUrl + "admin/AddApps/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                $("#AppStatusName").removeClass("AppImageName");
                $("#appsTable tbody .nodata").remove();
                ShowInstantNotification("Progress", "Publishing '" + tCount + "' app(s)...", "", "btnokdesktopapp");

            },
            success: function (res) {
                $("#appsTable tbody tr[blankarea='blankarea']").remove();
                $("#tblRDSCollection tr[class='AppImageName'] .CollectionType").text("RemoteApp programs");
                $("#appsTable tbody tr").each(function () {
                    if ($(".Alias", this).text().trim() == "") {
                        $(this).remove();
                        $("#ico_").remove();
                        var prevappCountSpan = $("#appCountSpan").text().trim();
                        prevappCountSpan--;
                        $("#appCountSpan").text(prevappCountSpan.toString());
                        return false;
                    }
                });

                var iconContentsArray = iconContents.split(",");
                var DeskAppNameArray = DeskAppName.split(",");
                var DeskAppPathArray = DeskAppPath.split(",");
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        $("#appStatusDiv .rowTemplate .IconContents ").html("<img src='data:image/jpeg;base64," + iconContentsArray[i] + "'\" style=\"width:25px; height:25px; float:left;\" />");
                        $("#appStatusDiv .rowTemplate .Alias").text(res[i].Alias.replace(/\"/g, ""));
                        $("#appStatusDiv .rowTemplate .Name").text(DeskAppNameArray[i]);
                        $("#appStatusDiv .rowTemplate .Status").html("<span class=\"segoeIcon circledBgAcceptIcon fontGreen\"></span>Published");
                        $("#appStatusDiv .rowTemplate .Path").text(DeskAppPathArray[i]);
                        var rowTemplate = $("#appStatusDiv .rowTemplate .dataRow tbody").html();
                        $("#appsTable tbody").append(rowTemplate);
                        //Update Apps count
                        var prevappCountSpan = $("#appCountSpan").text().trim();
                        prevappCountSpan++;
                        $("#appCountSpan").text(prevappCountSpan.toString());
                        //end of update
                        AppsCollectionArray.push({
                            IconContents: "",
                            Alias: res[i].Alias.replace(/\"/g, ""),
                            Name: DeskAppNameArray[i],
                            Status: "Published",
                            Path: DeskAppPathArray[i]
                        });
                        var dynImages = "<img id=\"ico_" + res[i].Alias.replace(/\"/g, "") + "\" src='data:image/jpeg;base64," + iconContentsArray[i] + "'\" style=\"width:25px; height:25px; float:left;\" />";
                        $("#imagesDiv").append(dynImages);
                    }

                }
                $("#appsTable tbody tr[class!='nodata']").unbind("click");
                $("#appsTable tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#unpublishselectedapp").attr("disabled", true);
                    }
                    else {
                        $('#appsTable tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        $("#unpublishselectedapp").attr("disabled", false);
                    }
                });
                $("#adddesktopapp").hide();
                $("#publishApp123").removeClass("activeDocBtn");
                //addCustomAppFailureModal.style.display = "none";
                ShowInstantNotification("Success", "Successfully published app(s)...", "'" + tCount + "' app(s) published successfully.", "btnokdesktopapp");
            },
            error: function (error) {
                $("#appsTable tbody tr[blankarea='blankarea']").remove();
                LogError(data.ApiSubscriptionId, "Publish Desktop Apps", error);
                ShowInstantNotification("Error", "Error in publishing app(s)...", "Failed in publishing '" + tCount + "' app(s).", "btnokdesktopapp");
                console.log("ERROR:", error);
            },
            complete: function () {
            }
        });
    });

    //Essentials drop down script
    $("#rmappdemo a[data-target='#demo']").click(function () {
        $('#essentialContentTenantAdmin').slideToggle(1);
        $("#essential_Data").slideToggle(1);
        $('#rmappdemo').toggleClass('essentialDiv1');
        if ($('#rmpuparrowicon').hasClass("segoeIcon upArrowIcon")) {
            $('#rmpuparrowicon').removeClass("segoeIcon upArrowIcon");
            $('#rmpuparrowicon').addClass("segoeIcon downArrowIcon");
        }
        else {
            $('#rmpuparrowicon').removeClass("segoeIcon downArrowIcon");
            $('#rmpuparrowicon').addClass("segoeIcon upArrowIcon");
        }
    });
  

    $("#addCollection").click(function () {
        $("#addCollection").addClass("activeDocBtn");
        $("#min_CreateCollectionBlade").hide();
        $("#appUserCloseBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#CreateCollectionBlade").show();
        //Manage breadcrumb
        AddBreadcrumb("Create Collection", "CreateCollectionBlade", "appsuserslist");
        //Hiding all opened windows
        $(".acceptIcon").hide();

        $("#righticon").show();
        $("#righticondone").hide();
        $("#RCArighticon").show();
        $("#RCArighticondone").hide();
        $("#collectionsettings").hide();
        $("#txtName").val('');
        $("#txtDescription").val('');

        $("#selectserverCount").text("");
        $("#userCount").text("");
        $("#myTable tr").removeClass("active");
        viewModelAppUsersScreen7.appUserScr7SelectNames.removeAll();
        $("#collectionCreationValidation").hide();
        $("#collectionCreationSuccessValidation").hide();
        $("#selectappimages").hide();
        $("#appusersdiv").hide();
        $("#txtSubscription").val("");
        $(".erroricon").hide();
        $(".Errormessage").hide();
        $("#txtName").removeClass("redborder");
        document.getElementById("txtName").value = "";
        document.getElementById("txtDescription").value = "";
        SelectedUsers = "";
        SelectedRDVirtualMachine = "";
        $("#appsArrowIcon").show();
        $("#serversArrowIcon").show();
        if (localStorage.getItem("UserType").toLowerCase() == "tenantadmin") {
            $.ajax({
                url: data.ApiUrl + "admin/GetResourceGroup/" + data.ConnectionBroker + "/",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function () {
                    $("#txtSubscription").attr("placeholder", "Loading subscription id...");
                },
                success: function (res) {
                    $("#txtSubscription").val(res[0].SubscriptionID);
                },
                error: function (error) {
                    // Log any error.
                    LogError(data.ApiSubscriptionId, "Add Collection", error);
                    console.log("ERROR:", error);
                },
                complete: function () {
                    $("#txtSubscription").attr("placeholder", "");
                }
            });
            $("#updatelicRedirection").hide();
        }
        else {
            $("#txtSubscription").val($("#text_SubscriptionIDDeployAdmin").text());
        }
        ScrollToHorizontalEnd($("#CreateCollectionBlade").width());
    });
    $("#collectionconfigcloseicon").click(function () {
        RemoveBreadcrumb("settings");
        $("#min_collectionsettings").hide();
        $("#collectionsettings").hide();
        $("#ScaleCollectionSettings").removeClass("AppImageName");
        $("#ConnectConfig").removeClass("brustconfig");
    });
    $("#btnbrustconfigcloseicon").click(function () {
        RemoveBreadcrumb("settings");
        $("#min_brustconfig").hide();
        $("#brustconfig").hide();
        $("#brusticon").removeClass("AppImageName");
    });

    $("#userprofilecloseicon").click(function () {
        $("#min_userprofileconfig").hide();
        $("#UserProfileLocationtxt").removeClass("redborder");
        $("#UserProfileGBtxt").removeClass("redborder");
        $("#profiledisklocationicon").hide();
        $("#profilemaximumsize").hide();
        $("#errorprofiledisk").hide();
        RemoveBreadcrumb("settings");
        $("#userprofileicon").removeClass("AppImageName");
        $("#userprofileconfig").hide();
    });

    $("#auditslogbtn").click(function () {

        $("#brustconfigcloseicon").trigger("click");
        $("#userprofilecloseicon").trigger("click");
        AddBreadcrumb("Logs", "auditlogsconfig", "settings");
        $("#auditlogsconfig").show();
        $("#brustconfig").hide();
        $("#userprofileconfig ").hide();
        $("#settingsshow").addClass("activeDocBtn");
        $("#auditslogbtn").addClass("AppImageName");
        ScrollToHorizontalEnd(350);
    });
    data.appuserStatus = ko.observableArray('');

    //active the select button
    $('.addactive .table tbody').on('click', function (event) {
        $('.act-rmv table tbody tr').removeClass('active');
        $(event.target).parent().addClass('active');
        $("#showselected").focus();
    });

    $('.addactive2 .table tbody').on('click', function (event) {
        $('.act-rmv table tbody tr').removeClass('active');
        $(event.target).parent().addClass('active');
    });

    $("#showselectedanother").click(function () {
        $("#signoutuser").hide();
    });

    $("#SignoutCloseBlade").click(function () {
        $("#signoutuser").hide();
    });

    $("#downloadUsageCloseBlade").click(function () {
        $("#downloadusageshow").hide();
    });

    $("#closeIconappUsersTileBlade").click(function () {
        $("#min_appUsersTileBlade").hide();
        $("#appusersdivCreatenewUser").hide();
        $("#AddGroupUsers").hide();
        $("#closeIconImportUserBlade").trigger("click");
        $("#closeIconIndividualUserGroup").trigger("click");
    });

    $("#rdservershow").click(function () {
        $("#min_divSHSMonitor").hide();
        $("#min_sendmessageVM").hide();
        $("#min_selectappimages").hide();
        $("#min_serversshow").hide();

        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#rdservershow").addClass("activeTile");
        AddBreadcrumb("RD Virtual Machines", "serversshow", "appUser");
        var vmLoader = $('#serversshowLoader');
        var rdsservers = $('#serversshow');
        vmLoader.width(rdsservers.width() + 1);
        vmLoader.height(rdsservers.height());
        rdsservers.show();
        vmLoader.show();
        setTimeout(function () {
            vmLoader.hide();
        }, 1000);
        $("#settingsshow").removeClass("activeDocBtn");
        $('#appUser').find('.backgroundclr').removeClass('backgroundclr');
        $('#rdservershow .tileDiv').addClass('backgroundclr');

        ScrollToHorizontalEnd(rdsservers.width() + 1);
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetServer/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionNavName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#RDServerSpinner").show();
                $("#serverlistselectid tbody").html('');
                $("#AddRDServerClick").attr("disabled", true);
                $("#RemoveRDServerclick").attr("disabled", true);
                $("#sendmessageVMclick").attr("disabled", true);
                $("#enablerdservertenant").attr("disabled", true);
                $("#disablerdservertenant").attr("disabled", true);
                $("#disablerdservertenant").attr("disabled", true);
                $("#menuMonitorSHS").attr("disabled", true);
            },
            success: function (res) {
                $("#AddRDServerClick").attr("disabled", false);
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        $("#rdsservers .rowTemplate .Name").text(res[i].Name);
                        $("#rdsservers .rowTemplate .Status").text(res[i].Status);
                        $("#rdsservers .rowTemplate .Type").text(res[i].Type);
                        $("#rdsservers .rowTemplate .Sessions").text(res[i].Sessions);
                        var rowTemplate = $("#rdsservers .rowTemplate .dataRow tbody").html();
                        $("#serverlistselectid tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#rdsservers .rowTemplate .blankRow tbody").html();
                    $("#serverlistselectid tbody").append(rowTemplate);
                }
                $("#serverlistselectid tbody tr[class!='nodata']").unbind("click");
                $("#serverlistselectid tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#RemoveRDServerclick").attr("disabled", true);
                        $("#sendmessageVMclick").attr("disabled", true);
                        $("#enablerdservertenant").attr("disabled", true);
                        $("#disablerdservertenant").attr("disabled", true);
                        $("#menuMonitorSHS").attr("disabled", true);
                        $("#messageCloseBladeVM").trigger("click");
                        $("#SHSMonitorCloseBlade").trigger("click");
                    }
                    else {
                        $('#serverlistselectid tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        $("#RemoveRDServerclick").attr("disabled", false);
                        $("#sendmessageVMclick").attr("disabled", false);
                        $("#enablerdservertenant").attr("disabled", false);
                        $("#disablerdservertenant").attr("disabled", false);
                        $("#menuMonitorSHS").attr("disabled", false);
                    }
                    manageEnableDisableRDVM($(".Status", this).text().trim());
                });


                if (res.length == 0) {
                    $("#rdSessionHostServerExist").show();
                }
                else {
                    $("#rdSessionHostServerExist").hide();
                }


            },
            error: function (error) {
                // Log any error.
                LogError(data.ApiSubscriptionId, "Load RD Servers", error);
                LoadSessionHostServersModal.style.display = "block";
                console.log("ERROR:", error);
            },
            complete: function () {
                $("#RDServerSpinner").hide();
            }
        });


    });


    $("#activesessionCloseBlade").click(function () {
        $("#activesession").hide();
        $("#min_activesession").hide();
        $("#messageCloseBlade").trigger("click");
        RemoveBreadcrumb("appUser");
        $(".tileDiv").removeClass("activeTile");
    })

    $("#settingsCloseBlade").click(function () {
        $("#settings").hide();
        $("#ImportUserBlade").hide();
    })

    $("#buildUserCloseBlade").click(function () {
        $("#builduser").hide();
    })

    $("#settingsshow").click(function () {
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#settings").show();
        AddBreadcrumb("Settings", "settings", "appUser");

        $("#collectionconfigcloseicon").trigger("click");
        $(".tileDiv").removeClass("activeTile");
        $("#settingsshow").addClass("activeDocBtn");
        $("#settings .rightArrIcon").show();
        ScrollToHorizontalEnd($("#appsdivshow").width());
    });

    $("#closeIconSelectAppImages").click(function () {
        $("#selectappsimages").hide();
    });

    $("#closeIconAddCustomApps").click(function () {
        RemoveBreadcrumb("appsdivshow");
        $("#addcustomapps").hide();
        $("#min_addcustomapps").hide();
        $("#addcustomappsclick").removeClass("activeDocBtn");
        document.getElementById("nameaddCustomeApp").value = "";
        document.getElementById("pathAddCustomApp").value = "";
        $("#addapperroricon").hide();
        $("#addapppatherroricon").hide();
        $("#Errormessage").hide();
        $("#nameaddCustomeApp").removeClass("redborder");
        $("#pathAddCustomApp").removeClass("redborder");

    });

    $("#addDivCloseBlade").click(function () {
        RemoveBreadcrumb("appUser");
        $("#adddesktopclose").trigger("click");
        $("#closeIconAddCustomApps").trigger("click");
        $("#appsdivshow").hide();
        $("#min_appsdivshow").hide();
        $(".tileDiv").removeClass("activeTile");
    });

    $("#closeIconActivity").click(function () {
        $("#activitysession").hide();
    });

    $("#updateappsimagesclick").click(function () {

        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").hide();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide(); $("#sendmessage").hide();
        $("#updatesappsimages").show();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });

    $("#UpdatecloseBlade").click(function () {
        $("#updatesappsimages").hide();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();
    })

    $("#selectedimagesBtn").click(function () {
    });

    $("#closeIconappUsersTileBlade").click(function () {
        $("#appCloseBladeCreatenewUser").trigger("click");
        $("#closeIconImportUserBlade").trigger("click");
        RemoveBreadcrumb("appUser");
        $("#appUsersTileBlade").hide();
        $(".tileDiv").removeClass("activeTile");
    });

    $("#selectappsimagesclick").click(function () {

        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").hide();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide(); $("#sendmessage").hide();
        $("#selectappsimages").show();
        $("#updatesappsimages").show();
        $("#signoutuser").hide();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });

    $("#ServersCloseBlade").click(function () {
        RemoveBreadcrumb("appUser");
        $("#imageCloseBlade").trigger("click");
        $("#messageCloseBladeVM").trigger("click");
        $("#SHSMonitorCloseBlade").trigger("click");
        $("#serversshow").hide();
        $("#min_serversshow").hide();
        $(".tileDiv").removeClass("activeTile");
    });

    $("#signoutuserclick").click(function () {

        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").hide();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide(); $("#sendmessage").hide();
        $("#selectappsimages").hide();
        $("#updatesappsimages").show();
        $("#signoutuser").show();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });

    //AppsUser


    $("#appUsersTile").click(function () {

        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#appUsersTile").addClass("activeTile");
        AddBreadcrumb("Users", "appUsersTileBlade", "appUser");
        var usersLoader = $('#appUsersTileBladeLoader');
        var appUsersTileBlade = $('#appUsersTileBlade');
        usersLoader.width(appUsersTileBlade.width() + 1);
        usersLoader.height(appUsersTileBlade.height());
        appUsersTileBlade.show();
        usersLoader.show();

        setTimeout(function () {
            usersLoader.hide();
        }, 1000);

        //$("#appUsersTileBlade").show();
        $("#settingsshow").removeClass("activeDocBtn");
        $
        $('#appUser').find('.backgroundclr').removeClass('backgroundclr');
        $('#appUsersTile .tileDiv').addClass('backgroundclr');

        IsDisbaledmenuAddNewAppUser = 0;
        IsDisbaledmenuRemoveAppUser = 0;
        IsDisbaledmenuImportAppUser = 0;
        ScrollToHorizontalEnd($("#appUsersTileBlade").width());
        // if (appUsersRequest) {
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetUsersAndGroups/" + data.ConnectionBroker.toLowerCase() + "/" + selectedCollectionName.toLowerCase() + "/user/",
            //url: data.ApiUrl + "subscriptions/GetUser/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#appusersSpinner").show();
                $("#AppUsersTable tbody").html('');
                $("#menuAddNewAppUser").removeClass("activeDocBtn");
                $("#menuRemoveAppUser").removeClass("activeDocBtn");
                $("#menuImportUsers").removeClass("activeDocBtn");
                $("#menuAddNewAppUser").attr("disabled", true);
                $("#menuRemoveAppUser").attr("disabled", true);
                $("#menuImportUsers").attr("disabled", true);
                $("#menuAddUserGroup").attr("disabled", true);
            },
            success: function (res) {
                $("#AppUsersTable tbody").html('');
                UserCollectionArray = [];
                $("#menuAddNewAppUser").attr("disabled", false);
                $("#menuImportUsers").attr("disabled", false);
                $("#menuAddUserGroup").attr("disabled", false);
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        UserCollectionArray.push({
                            Name: res[i].Name
                        });
                        $("#AppUsersDiv .rowTemplate .Name").text(res[i].Name);
                        var rowTemplate = $("#AppUsersDiv .rowTemplate .dataRow tbody").html();
                        $("#AppUsersTable tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#AppUsersDiv .rowTemplate .blankRow tbody").html();
                    $("#AppUsersTable tbody").append(rowTemplate);
                }
                $("#AppUsersTable tbody tr[class!='nodata']").unbind("click");
                $("#AppUsersTable tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#menuRemoveAppUser").attr("disabled", true);
                    }
                    else {
                        $('#AppUsersTable tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        $("#menuRemoveAppUser").attr("disabled", false);
                    }
                });
            },
            complete: function () {
                $("#appusersSpinner").hide();
                $("#AppUserCls a").removeClass("AppImageName");
            },
            error: function (error) {
                $("#appusersSpinner").hide();
                LogError(data.ApiSubscriptionId, "Load App Users", error);
                console.log("ERROR:", error);
            }
        });

        //}
    })


    $("#appGroupTile").click(function () {

        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $('#appGroupTileBlade').show();
        $("#appGroupTile").addClass("activeTile");
        AddBreadcrumb("Usergroups", "appGroupTileBlade", "appUser");
        $("#settingsshow").removeClass("activeDocBtn");
        $("#menuAddUserGroup").removeClass("activeDocBtn");
        $("#menuImportUserGroup").removeClass("activeDocBtn");
        $("#menuRemoveAppUserGroup").removeClass("activeDocBtn");
        $('#appUser').find('.backgroundclr').removeClass('backgroundclr');
        $('#appUsersTile .tileDiv').addClass('backgroundclr');
        ScrollToHorizontalEnd($("#appGroupTileBlade").width());
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetUsersAndGroups/" + data.ConnectionBroker.toLowerCase() + "/" + selectedCollectionName.toLowerCase() + "/group/",
            //url: data.ApiUrl + "subscriptions/GetUser/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#appGroupSpinner").show();
                $("#GroupUsersTable tbody").html('');
                $("#menuAddUserGroup").attr("disabled", true);
                $("#menuRemoveAppUserGroup").attr("disabled", true);
                $("#menuImportUserGroup").attr("disabled", true);
            },
            success: function (res) {
                $("#GroupUsersTable tbody").html('');
                UserGroupCollectionArray = [];
                $("#menuAddUserGroup").attr("disabled", false);
                $("#menuRemoveAppUserGroup").attr("disabled", false);
                $("#menuImportUserGroup").attr("disabled", false);
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        UserGroupCollectionArray.push({
                            Name: res[i].Name
                        });
                        $("#GroupUsersDiv .rowTemplate .Name").text(res[i].Name);
                        var rowTemplate = $("#GroupUsersDiv .rowTemplate .dataRow tbody").html();
                        $("#GroupUsersTable tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#GroupUsersDiv .rowTemplate .blankRow tbody").html();
                    $("#GroupUsersTable tbody").append(rowTemplate);
                }
                $("#GroupUsersTable tbody tr[class!='nodata']").unbind("click");
                $("#GroupUsersTable tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#menuRemoveAppUserGroup").attr("disabled", true);
                    }
                    else {
                        $('#GroupUsersTable tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        $("#menuRemoveAppUserGroup").attr("disabled", false);
                    }
                });
            },
            complete: function () {
                $("#menuRemoveAppUserGroup").attr("disabled", true);
                $("#appGroupSpinner").hide();
                $("#AppUserCls a").removeClass("AppImageName");
            },
            error: function (error) {
                $("#appGroupSpinner").hide();
                LogError(data.ApiSubscriptionId, "Load App Users", error);
                console.log("ERROR:", error);
            }
        });
        //}
    });

    function appsRefresh() {
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetApplication/a4ce1ea9-063a-53bc-d8ed-fef6f053b18d/" + data.ConnectionBroker + "/" + selectedCollectionName + "/" + selectedCollectionResourceType + "/collAppType" + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#AppsSpinner").show();
                $("#BlockUIWithoutSpinner").show();
            },
            success: function (res) {
                if (JSON.stringify(appStatusViewModel.appstatus) != JSON.stringify(res)) {
                    var element = $("#AppStatusName")[0];
                    ko.cleanNode(element);
                    appStatusViewModel.appstatus = res;
                    ko.applyBindings(appStatusViewModel, document.getElementById('AppStatusName'));
                }

                $("#AppStatusName tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#AppStatusName tr").each(function () {
                        var trvalSub = $(this).text();
                        if (trval == trvalSub) {
                            IsDuplicate++;
                            if (IsDuplicate > 1) {
                                $(this).remove();
                            }
                        }
                    });
                });
            },
            complete: function () {
                $("#AppsSpinner").hide();
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Refreshing Apps", error);
                console.log("ERROR:", error);
            }
        });
    }

    $(".tileDiv").each(function () {
        $(this).click(function () {
            $(".tileDiv").removeClass("activeTile");
            $(this).addClass("activeTile");
        });
    });
    //AppsDiv
    $("#appsdiv").click(function () {
        $("#min_appsdivshow").hide();
        $("#min_adddesktopapp").hide();
        $("#min_addcustomapps").hide();
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#appsdiv").addClass("activeTile");

        var appsLoader = $('#appsdivshowLoader');
        var appsdivshow = $('#appsdivshow');
        appsLoader.width(appsdivshow.width() + 1);
        appsLoader.height(appsdivshow.height());
        appsdivshow.show();
        appsLoader.show();

        setTimeout(function () {
            appsLoader.hide();
        }, 1000);

        AddBreadcrumb("Apps", "appsdivshow", "appUser");
        $("#settingsshow").removeClass("activeDocBtn");
        loadPublishedAppsData();
        ScrollToHorizontalEnd(550);
    });

    $("#addcustomappsclick").click(function () {
        $("#addapppatherroricontxt").hide();
        $("#addapperroricon").hide();
        $("#addapppatherroricon").hide();
        $("#erroraddapp").hide();
        $("#nameaddCustomeApp").removeClass("redborder");
        $("#pathAddCustomApp").removeClass("redborder");

        if ($("#addcustomappsclick").prop("disabled") == false) {
            $("#min_adddesktopapp").hide();
            $("#min_addcustomapps").hide();
            AddBreadcrumb("Publish Using Path", "addcustomapps", "appsdivshow");
            /* Publish Apps AJAX End */
            $("#appsTable tbody tr").removeClass("AppImageName");
            $("#unpublishselectedapp").attr("disabled", true);
            $("#settings").hide();
            $("#ImportUserBlade").hide();
            $("#activitysession").hide();
            $("#builduser").hide();
            $("#appsdivshow").show();
            $("#appsuserslist").show();
            $("#downloadusageshow").hide();
            $("#addcustomapps").show();
            $("#edidcustomapps").hide();
            $("#activesession").hide();
            $("#sendmessage").hide();
            $("#updatesappsimages").hide();
            $("#selectappsimages").hide();
            $("#signoutuser").hide();
            $("#appUsersTileBlade").hide();

            $("#addcustomappsclick").addClass("activeDocBtn");
            $("#ConfigureBasicSettingBlade").hide();
            $("#CreateCollectionBlade").hide();
            //$("#adddesktopapp").hide();
            //$("#adddesktopapp").hide();
            $("#adddesktopclose").trigger("click");
            ScrollToHorizontalEnd(350);
        }
        else {
            $("#addcustomappsclick").removeClass("activeDocBtn");
        }
    });
    //$('#UserProfileGBtxt').keypress(function (event) {
    //    var $this = $(this);
    //    if ((event.which != 46 || $this.val().indexOf('.') != -1) &&
    //       ((event.which < 48 || event.which > 57) &&
    //       (event.which != 0 && event.which != 8))) {
    //        event.preventDefault();
    //    }

    //    var text = $(this).val();
    //    if ((event.which == 46) && (text.indexOf('.') == -1)) {
    //        setTimeout(function () {
    //            if ($this.val().substring($this.val().indexOf('.')).length > 3) {
    //                $this.val($this.val().substring(0, $this.val().indexOf('.') + 3));
    //            }
    //        }, 1);
    //    }

    //    if ((text.indexOf('.') != -1) &&
    //        (text.substring(text.indexOf('.')).length > 2) &&
    //        (event.which != 0 && event.which != 8) &&
    //        ($(this)[0].selectionStart >= text.length - 2)) {
    //        event.preventDefault();
    //    }

    //});
    //$('#UserProfileGBtxt').bind("paste", function (e) {
    //    var text = e.originalEvent.clipboardData.getData('Text');
    //    if ($.isNumeric(text)) {
    //        if ((text.substring(text.indexOf('.')).length > 3) && (text.indexOf('.') > -1)) {
    //            e.preventDefault();
    //            $(this).val(text.substring(0, text.indexOf('.') + 3));
    //        }
    //    }
    //    else {
    //        e.preventDefault();
    //    }
    //});
    //var check;
    //function validate(txt) {
    //    check = (/^(?:[\w]\:|\\)(\\[a-z_\-\s0-9\.]+)+\.(txt|gif|pdf|doc|docx|xls|xlsx)$/.test(txt).toString());
    //    alert(check);
       
    //}

    $("#btnOkAddCustomApp").click(function () {       
        RemoveBreadcrumb("appsdivshow");
        var isValid = true;
        var name = $("#nameaddCustomeApp").val().trim();
        var path = $("#pathAddCustomApp").val().trim();
        if (name == null || name == undefined || name.length < 1) {
            isValid = false;
            $("#addapperroricon").show();
            $("#nameaddCustomeApp").addClass("redborder");
            $("#erroraddapp").show();
        }

        if (path == null || path == undefined || path.length < 1) {
            isValid = false;
            $("#addapppatherroricon").show();
            $("#pathAddCustomApp").addClass("redborder");
            $("#erroraddapp").show();
        }

        var test1 = $("#pathAddCustomApp").val().trim();
        var check = (/^(?:[\w]\:|\\)(\\[A-Za-z_\-\s0-9\.]+)+\.(txt|gif|pdf|doc|docx|xls|xlsx|exe)$/.test(test1).toString());

        if (check == "false") {
            isValid = false;
            $("#addapppatherroricontxt").show();
            $("#pathAddCustomApp").addClass("redborder");
            $("#erroraddapp").show();
        }

        if (isValid) {
            localStorage.setItem("NameAddCustomeApp", $("#nameaddCustomeApp").val());
            localStorage.setItem("PathAddCustomApp", $("#pathAddCustomApp").val());
            localStorage.setItem("CmdLinePara", $('#cmdLinePara').val());

            $("#addapperroricon").hide();
            $("#addapppatherroricon").hide();
            $("#addapperroricon").removeClass("redborder");
            $("#addapppatherroricon").removeClass("redborder");
            $("#erroraddapp").hide();

            var Addappscollection =
            {
                "commandName": "addwappcollection",
                data: {
                    "CollectionName": selectedCollectionName,
                    "DisplayName": localStorage.getItem("NameAddCustomeApp"),
                    "ConnectionBroker": data.ConnectionBroker,
                    "FilePath": localStorage.getItem("PathAddCustomApp").replace(/\\/g, "\\\\")
                }
            }
            var jsonData = JSON.stringify(Addappscollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Publishing app using path...", "", "btnOkAddCustomApp");
                },
                success: function (res) {
                        document.getElementById("nameaddCustomeApp").value = "";
                        document.getElementById("pathAddCustomApp").value = "";
                        localStorage.setItem("NameAddCustomeApp", "");
                        localStorage.setItem("PathAddCustomApp", "");
                        localStorage.setItem("CmdLinePara", "");
                        //appsRefresh();
                        LoadAppIcons();
                        loadPublishedAppsData();
                        $("#customappname").text(name);
                        $("#addcustomapps").hide();
                        document.getElementById("nameaddCustomeApp").value = "";
                        document.getElementById("pathAddCustomApp").value = "";
                        ShowInstantNotification("Success", "Successfully published...", "'" + $("#nameaddCustomeApp").val() + "' published successfully.", "btnOkAddCustomApp");
                },
                error: function (error) {                    
                    LogError(data.ApiSubscriptionId, "Publish Custom Apps", error);
                    ShowInstantNotification("Error", "Failed publishing app...", "Failed publishing '" + $("#nameaddCustomeApp").val() + "'app.", "btnOkAddCustomApp");
                    console.log("ERROR:", error);
                    $("#erroraddapp").show();
                    $("#addapppatherroricontxt").show();
                    $("#pathAddCustomApp").addClass("redborder");
                },
                complete: function () {
                    loadPublishedAppsDataTileCount();
                    $("#addcustomappsclick").removeClass("activeDocBtn");
                }             
            });
        }
    });

    $("#updateAppsid").click(function () {
        $("#adddesktopapp").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
    });

    $("#editcustomappsclick").click(function () {
        $("#adddesktopapp").hide();
        if ($("#appsTable tr[class='AppImageName']").length > 0) {
            $("#settings").hide();
            $("#ImportUserBlade").hide();
            $("#activitysession").hide();
            $("#builduser").hide();
            $("#appsdivshow").show();
            $("#appsuserslist").show();
            $("#downloadusageshow").hide();
            $("#addcustomapps").hide();
            $("#edidcustomapps").show();
            $("#activesession").hide(); $("#sendmessage").hide();
            $("#updatesappsimages").hide();
            $("#selectappsimages").hide();
            $("#signoutuser").hide();
            $("#appUsersTileBlade").hide();
            $("#nameEdit").val(data.appuserStatus());
            $("#adddesktopapp").hide();
            $("#ConfigureBasicSettingBlade").hide();
            $("#CreateCollectionBlade").hide();
            ScrollToHorizontalEnd(350);
        }
        else {
            editselectModal.style.display = "block";
        }
    });

    $("#closeIconappGroupTileBlade").click(function () {

        $("#closeIconAddUserGroup").trigger("click");
        $("#closeIconImportUserGroupBlade").trigger("click");
        $("#appGroupTileBlade").hide();
        $("#min_appGroupTileBlade").hide();
        $(".tileDiv").removeClass("activeTile");
        RemoveBreadcrumb("appUser");
        $("#menuAddUserGroup").removeClass("activeDocBtn");
        $("#menuImportUserGroup").removeClass("activeDocBtn");
    })

    //On Load Fill the collection
    if (localStorage.getItem("UserType").toLowerCase() == "tenantadmin") {
        $("#appsuserslist").show();
        LoadRDSColletion();
    }
    else {
        $("#collectionHeader").show();
        $("#collectionHeader1").show();
        $(".se-pre-con").hide();
        $(".rds-container").show();
    }
    var viewModelAppUsersScreen7 = {
        appUsersScreen7: null
    };


    viewModelAppUsersScreen7.appUserScr7SelectNames = ko.observableArray('');
    viewModelAppUsersScreen7.appUserScr7UserInfo = ko.observableArray('');
    viewModelAppUsersScreen7.appUserScr7SelectName = function () {
        var index = viewModelAppUsersScreen7.appUserScr7SelectNames.indexOf(this.Name);
        if (index > -1) {
            $('#myTable tr:contains(' + this.Name + ')').removeClass('active');
            viewModelAppUsersScreen7.appUserScr7SelectNames.splice(index, 1);
        }
        else {
            viewModelAppUsersScreen7.appUserScr7SelectNames.push(this.Name);
            viewModelAppUsersScreen7.appUserScr7UserInfo.push(this);
            for (var i = 0; i < viewModelAppUsersScreen7.appUserScr7SelectNames().length; i++) {
                $('#myTable tr:contains(' + viewModelAppUsersScreen7.appUserScr7SelectNames()[i] + ')').addClass('active');
            }
        }
        manupulateAddUserOkButton();
    }

    //Add & CreateNew user
    viewModelAppUsersScreen7CreateNewUser.appUserScr7SelectNamesCreateNewUser = ko.observableArray('');
    viewModelAppUsersScreen7CreateNewUser.appUserScr7UserInfoCreateNewUser = ko.observableArray('');

    var SimpleListModel = function (items) {
        this.items = ko.observableArray(items);
        this.itemToAdd = ko.observable("");
        this.addItem = function () {
            if (this.itemToAdd() != "") {
                this.items.push(this.itemToAdd()); // Adds the item. Writing to the "items" observableArray causes any associated UI to update.
                this.itemToAdd(""); // Clears the text box, because it's bound to the "itemToAdd" observable
            }
        }.bind(this);  // Ensure that "this" is always this view model
    };

    ko.applyBindings(SimpleListModel(["ravikumar1993@gmail.com"]), document.getElementById('appuserscontent'));

    var myImagesViewModel = {
        apps_images_tab1: null
    };



    data.selectedImageNameList = ko.observableArray('');


    var platformImagesViewModel = {
        apps_images_tab2: data.apps_images_tab2
    };

    var selectedItems;
    myImagesViewModel.selectiontab = function () {
        selectedItems = this.HostServer;
    }

    data.appUserCountName = ko.observableArray('');

    var dataresult = ko.observableArray();
    //Show App Users View Model
    var viewModelAppUsers = {
        appUsers: null
    };

    viewModelAppUsers.appUsersClick = function () {
        data.appUsersStatus(this.Name);
    }

    //Show Apps View Model
    var appStatusViewModel = {
        appstatus: null
    };
    var appStatusViewModel1 = {
        appImages: null
    };

    var appStatusViewModelTileCount = {
        appstatusTileCount: null
    };

    var desktopappModel = {
        desktopappselect: null
    };

    data.desktopappselectedlist = ko.observableArray('');


    data.RDSessionHostserverRD = ko.observableArray('');
    serverselectmodel.selectedserver = ko.observableArray('');


    var requestActiveSession = true;

    $("#AddRDServerClick").click(function () {
        if ($("#AddRDServerClick").prop("disabled") == false) {
            $("#AddRDServerClick").addClass("activeDocBtn");
            $("#menuMonitorSHS").removeClass("activeDocBtn");
            $("#sendmessageVMclick").removeClass("activeDocBtn");
            $("#min_divSHSMonitor").hide();
            $("#min_sendmessageVM").hide();
            $("#min_selectappimages").hide();
            //add RD VM Blade Loader
            var addRDVMLoader = $('#selectappimagesLoader');
            var selectappimages = $('#selectappimages');
            addRDVMLoader.width(selectappimages.width() + 1);
            addRDVMLoader.height(selectappimages.height());
            selectappimages.show();
            addRDVMLoader.show();
            setTimeout(function () {
                addRDVMLoader.hide();
            }, 1000);

            AddBreadcrumb("Add RD VM", "selectappimages", "serversshow");
            ScrollToHorizontalEnd($('#selectappimages').width() + 1);
            $("#sendmessageVM").hide();
            $("#divSHSMonitor").hide();
            frmCreateCollection = "no";
            $.ajax({
                url: data.ApiUrl + "admin/GetServer/" + data.ConnectionBroker + "/" + data.role + "/",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function () {
                    $("#AppImagesSpinner").show();
                    $("#AppsImagesTableId tbody").html('');
                    $("#btnShowselected").attr("disabled", true);
                    $("#serverlistselectid tbody tr").removeClass("AppImageName");
                    $("#RemoveRDServerclick").attr("disabled", true);
                    $("#sendmessageVMclick").attr("disabled", true);
                    $("#disablerdservertenant").attr("disabled", true);
                    $("#menuMonitorSHS").attr("disabled", true);
                },
                success: function (res) {
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            $("#availableRDServer .rowTemplate .Name").text(res[i].Name);
                            $("#availableRDServer .rowTemplate .Type").text(res[i].Type);
                            var rowTemplate = $("#availableRDServer .rowTemplate .dataRow tbody").html();
                            $("#AppsImagesTableId tbody").append(rowTemplate);
                        }
                    }
                    else {
                        var rowTemplate = $("#availableRDServer .rowTemplate .blankRow tbody").html();
                        $("#AppsImagesTableId tbody").append(rowTemplate);
                    }

                    $("#AppsImagesTableId tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                        }
                        else {
                            $(this).addClass('AppImageName');
                        }
                        if ($("#AppsImagesTableId tr[class='AppImageName']").length > 0) {
                            $("#btnShowselected").attr("disabled", false);
                        }
                        else {
                            $("#btnShowselected").attr("disabled", true);
                        }
                    });
                },
                complete: function () {
                    $("#AppImagesSpinner").hide();
                    $("#AddRDServerClick").removeClass("activeDocBtn");
                },
                error: function (error) {
                    // Log any error.
                    LoadSessionHostServersModal.style.display = "block";
                    LogError(data.ApiSubscriptionId, "Add RD Server", error);
                    console.log("ERROR:", error);
                }
            });
        }
        else {
            $("#AddRDServerClick").removeClass("activeDocBtn");
        }

    })

    var myImagesViewModel = {
        apps_images_tab1: null
    };

    data.selectedImageNameList = ko.observableArray('');
    $("#activesessionshow").click(function () {
        $("#min_activesession").hide();
        $("#min_sendmessage").hide();
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#activesessionshow").addClass("activeTile");
        AddBreadcrumb("Active Session", "activesession", "appUser");
        var sessionsLoader = $('#activesessionLoader');
        var activesession = $('#activesession');
        sessionsLoader.width(activesession.width() + 1);
        sessionsLoader.height(activesession.height());
        activesession.show();
        sessionsLoader.show();

        setTimeout(function () {
            sessionsLoader.hide();
        }, 1000);
        $("#settingsshow").removeClass("activeDocBtn");
        $('#appUser').find('.backgroundclr').removeClass('backgroundclr');
        $('#activesessionshow .tileDiv').addClass('backgroundclr');

        var subcriptionif = ""
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetSessionTest/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#sendmessageshowclick").attr("disabled", true);
                $("#disconnectbtn").attr("disabled", true);
                $("#disconnectallbtn").attr("disabled", true);
                $("#signoutusersbtn").attr("disabled", true);
                $("#logoffalluserbtn").attr("disabled", true);

                $("#ActivesSessionCls tbody").html('');
                $("#activesessionSpinner").show();
            },
            success: function (res) {

                $("#ActivesSessionCls tbody").html('');
                SessionCollectionArray = [];
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        SessionCollectionArray.push({
                            SessionCollectionArray: res[i].SessionCollectionArray,
                            UserName: res[i].UserName,
                            SessionState: res[i].SessionState,
                            LogonTime: res[i].LogonTime,
                            HostServer: res[i].HostServer,
                            IdleTime: res[i].IdleTime
                        });

                        $("#divactivesession .rowTemplate .UnifiedSessionID").text(res[i].UnifiedSessionID);
                        $("#divactivesession .rowTemplate .UserName").text(res[i].UserName);
                        $("#divactivesession .rowTemplate .SessionState").text(res[i].SessionState);
                        $("#divactivesession .rowTemplate .LogonTime").text(res[i].LogonTime);
                        $("#divactivesession .rowTemplate .HostServer").text(res[i].HostServer);
                        $("#divactivesession .rowTemplate .IdleTime").text(res[i].IdleTime);
                        var rowTemplate = $("#divactivesession .rowTemplate .dataRow tbody").html();
                        $("#ActivesSessionCls tbody").append(rowTemplate);
                    }
                    $("#disconnectallbtn").attr("disabled", false);
                    $("#logoffalluserbtn").attr("disabled", false);
                }
                else {
                    var rowTemplate = $("#divactivesession .rowTemplate .blankRow tbody").html();
                    $("#ActivesSessionCls tbody").append(rowTemplate);
                }
                $("#ActivesSessionCls tbody tr[class!='nodata']").unbind("click");
                $("#ActivesSessionCls tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#sendmessageshowclick").attr("disabled", true);
                        $("#disconnectbtn").attr("disabled", true);
                        $("#signoutusersbtn").attr("disabled", true);
                        $("#messageCloseBlade").trigger("click");
                    }
                    else {
                        $('#ActivesSessionCls tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        $("#sendmessageshowclick").attr("disabled", false);
                        $("#disconnectbtn").attr("disabled", false);
                        $("#disconnectallbtn").attr("disabled", false);
                        $("#signoutusersbtn").attr("disabled", false);
                        $("#logoffalluserbtn").attr("disabled", false);
                    }
                });
            },

            complete: function () {
                $("#activesessionSpinner").hide();
            },
            error: function (error) {
                // Log any error.
                LogError(data.ApiSubscriptionId, "Load Active Sessions", error);
                console.log("ERROR:", error);
                requestActiveSession = true;
            }
        });
        //}

        $("#brustconfig").hide();
        $("#userprofileconfig ").hide();

        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").hide();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#sendmessage").hide();
        $("#updatesappsimages").hide();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
        ScrollToHorizontalEnd($("#activesession").width());
    });

    $("#editBladeclose").click(function () {
        $("#edidcustomapps").hide();
        $("#editcustomappsclick").removeClass("activeDocBtn");
    })

    $("#showactivitysession").click(function () {
        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").show();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#appsdivshow").hide();
        $("#appsuserslist").show();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide();
        $("#sendmessage").hide();
        $("#updatesappsimages").hide();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });

    $("#downloadusage").click(function () {
        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#activitysession").show();
        $("#builduser").hide();
        $("#appsdivshow").hide();
        $("#appsdivshow").hide();
        $("#appUsersTileBlade").hide();
        $("#downloadusageshow").show();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide();
        $("#sendmessage").hide();
        $("#updatesappsimages").hide();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });

    $("#auditlogsclosebtn").click(function () {
        RemoveBreadcrumb("settings");
        $("#auditslogbtn").removeClass("AppImageName");
        $("#auditlogsconfig").hide();
    })

    $("#userprofileicon").click(function () {
        $("#min_userprofileconfig").hide();
        $("#profiledisklocationicontxt").hide();
        $("#profiledisklocationicon").hide();
        $("#profilemaximumsize").hide();
        $("#profilemaximumsize0").hide();
        $("#UserProfileLocationtxt").removeClass("redborder");
        $("#UserProfileGBtxt").removeClass("redborder");
        $("#profiledisklocationicon").hide();
        $("#profilemaximumsize").hide();
        $("#errorprofiledisk").hide();
        $("#btnbrustconfigcloseicon").trigger("click");
        $("#collectionconfigcloseicon").trigger("click");
        $("#ScaleClientSettingscloseicon").trigger("click");
        AddBreadcrumb("User Profile Disk", "userprofileconfig", "settings");
        $("#brustconfig ").hide();
        $("#auditlogsconfig").hide();
        $("#userprofileconfig ").show();
        $("#settingsshow").addClass("activeDocBtn");
        $("#userprofileicon").addClass("AppImageName");
        $("#brusticon").removeClass("AppImageName");
        $("#ScaleCollectionSettings").removeClass("AppImageName");
        $("#ScaleClientSettings").removeClass("AppImageName");

        $.ajax({
            url: data.ApiUrl + "admin/GetUserProfileDisk/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#UserProfileLocationtxt").val("");
                $("#UserProfileGBtxt").val("");
                $("#UserProfileLocationtxt").attr("placeholder", "Loading location...");
                $("#UserProfileGBtxt").attr("placeholder", "Loading maximum size...");
            },
            success: function (res) {
                var strEnableUserProfileDisk = res.EnableUserProfileDisk;
                var strDiskPath = res.DiskPath;
                var strMaxUserProfileDiskSizeGB = res.MaxUserProfileDiskSizeGB;
                if (strEnableUserProfileDisk == true) {
                    $("#yesUSERPROFILEDISKS").trigger("click");
                }
                else {
                    $("#noUSERPROFILEDISKS").trigger("click");
                }
                $("#UserProfileLocationtxt").val(strDiskPath);
                $("#UserProfileGBtxt").val(strMaxUserProfileDiskSizeGB);

            },
            complete: function () {
                $("#UserProfileLocationtxt").attr("placeholder", "");
                $("#UserProfileGBtxt").attr("placeholder", "");
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Load UserProfile Information", error);
                console.log("ERROR:", error);
            }
        });
        ScrollToHorizontalEnd(350);

    });

    $("#ScaleCollectionSettings").click(function () {
        $("#min_collectionsettings").hide();
        $("#ConcurrentSessions").hide();
        $("#errorcollectionsettings").hide();
        $("#ConcurrentSession").hide();
        $("#ScaleCollectionSettings").addClass("AppImageName");
        $("#brusticon").removeClass("AppImageName");
        $("#ScaleClientSettings").removeClass("AppImageName");
        $("#userprofileicon").removeClass("AppImageName");

        $("#btnbrustconfigcloseicon").trigger("click");
        $("#ScaleClientSettingscloseicon").trigger("click");
        $("#userprofilecloseicon").trigger("click");
        $("#collectionsettings").show();
        $("#ConnectConfig").addClass("AppImageName");
        ScrollToHorizontalEnd($("#collectionsettings").width());
        $("#disconnectedsessionvaluesdiv").hide();
        $("#activesessionvaluesdiv").hide();
        $("#idlesessionvaluesdiv").hide();
        $("#settingsshow").addClass("activeDocBtn");
        AddBreadcrumb("Collection Settings", "collectionsettings", "settings");
        //ajax call to get the data related to collection configuration
        var objCollection =
                       {
                           "commandName": "getcollectionconfig",
                           "data":
                               {
                                   "CollectionName": selectedCollectionName,
                                   "ConnectionBroker": data.ConnectionBroker
                               }
                       }

        var jsonData = JSON.stringify(objCollection);
        $.ajax({
            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                $("#collectionsettings .spinnerDiv").show();
                $(".panelNoShadow").hide();
            },
            success: function (res) {
                res = $.parseJSON(res);
                var DSVparsed;
                DSVparsed = parseInt(res.DisconnectFromSession);
                var ASLparsed;
                ASLparsed = parseInt(res.ActiveSessionLmit);
                var ISLparsed;
                ISLparsed = parseInt(res.IdleSessionLimit);

                //DSV
                if (DSVparsed == 0) {
                    $("#disconnectedsessionvaluesdiv").hide();
                    $("#Enddisconnecteddd option:contains('Never')").attr('selected', 'selected');
                }
                else if ((DSVparsed % 1440) == 0) {
                    $("#disconnectedsessionvaluesdiv").show();
                    $("#Enddisconnecteddd option:contains('Days')").attr('selected', 'selected');
                    var y = (DSVparsed / 1440);
                    $("#disconnectedsessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else if ((DSVparsed % 60) == 0) {
                    $("#disconnectedsessionvaluesdiv").show();
                    $("#Enddisconnecteddd option:contains('Hours')").attr('selected', 'selected');
                    var y = (DSVparsed / 60);
                    $("#disconnectedsessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else {
                    $("#disconnectedsessionvaluesdiv").show();
                    $("#Enddisconnecteddd option:contains('Minutes')").attr('selected', 'selected');
                    $("#disconnectedsessionvalues option[value='" + DSVparsed + "']").attr('selected', 'selected');
                }

                //ASL
                if (ASLparsed == 0) {
                    $("#activesessionvaluesdiv").hide();
                    $("#activesessionlimitdd option:contains('Never')").attr('selected', 'selected');
                }
                else if ((ASLparsed % 1440) == 0) {
                    $("#activesessionvaluesdiv").show();
                    $("#activesessionlimitdd option:contains('Days')").attr('selected', 'selected');
                    var y = (ASLparsed / 1440);
                    $("#activesessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else if ((ASLparsed % 60) == 0) {
                    $("#activesessionvaluesdiv").show();
                    $("#activesessionlimitdd option:contains('Hours')").attr('selected', 'selected');
                    var y = (ASLparsed / 60);
                    $("#activesessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else {
                    $("#activesessionvaluesdiv").show();
                    $("#activesessionlimitdd option:contains('Minutes')").attr('selected', 'selected');
                    $("#activesessionvalues option[value='" + ASLparsed + "']").attr('selected', 'selected');
                }

                //ISL
                if (ISLparsed == 0) {
                    $("#idlesessionvaluesdiv").hide();
                    $("#idlesessionlimitdd option:contains('Never')").attr('selected', 'selected');
                }
                else if ((ISLparsed % 1440) == 0) {
                    $("#idlesessionvaluesdiv").show();
                    $("#idlesessionlimitdd option:contains('Days')").attr('selected', 'selected');
                    var y = (ISLparsed / 1440);
                    $("#idlesessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else if ((ISLparsed % 60) == 0) {
                    $("#idlesessionvaluesdiv").show();
                    $("#idlesessionlimitdd option:contains('Hours')").attr('selected', 'selected');
                    var y = (ISLparsed / 60);
                    $("#idlesessionvalues option[value='" + y + "']").attr('selected', 'selected');
                }
                else {
                    $("#idlesessionvaluesdiv").show();
                    $("#idlesessionlimitdd option:contains('Minutes')").attr('selected', 'selected');
                    $("#idlesessionvalues option[value='" + ISLparsed + "']").attr('selected', 'selected');
                }

                if (res.EndADisconnectedSession == true) {
                    $("#disconnectsessionradio").attr("checked", true);
                    $("#endsessionradio").attr("checked", false);
                }
                else {
                    $("#disconnectsessionradio").attr("checked", false);
                    $("#endsessionradio").attr("checked", true);
                }
                if (res.EndSession == true) {
                    $("#automaticreconnection").attr("checked", true);
                }
                else {
                    $("#automaticreconnection").attr("checked", false);
                }

                $("#sessionsperserver").val(res.LoadBalancingConcurrentSessionsPerServer);
            },
            complete: function () {
                $("#collectionsettings .spinnerDiv").hide();
                $(".panelNoShadow").show();
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Load Connection Configuration Data", error);
                //alert("failed");
            }
        });

    });

    $("#brusticon").click(function () {
        $("span[id^='Scale_']").hide();
        $("#CollScaleErrorMsg").hide();
        $("#ScaleInfoMessageDiv").show();
        $("#brusticon").addClass("AppImageName");
        $("#ScaleCollectionSettings").removeClass("AppImageName");
        $("#ScaleClientSettings").removeClass("AppImageName");
        $("#userprofileicon").removeClass("AppImageName");
        $("#min_brustconfig").hide();
        $("#ScaleClientSettingscloseicon").trigger("click");
        $("#collectionconfigcloseicon").trigger("click");
        $("#userprofilecloseicon").trigger("click");
        $("#brustconfig").show();
        ScrollToHorizontalEnd($("#brustconfig").width());
        AddBreadcrumb("Scale Setting", "brustconfig", "settings");
        //ajax call to get the scale session values

        var objCollection =
                       {
                           "commandName": "getcollectionconfigForScaleSettings",
                           "data":
                               {
                                   "CollectionName": selectedCollectionName,
                                   "ConnectionBroker": data.ConnectionBroker
                               }
                       }

        var jsonData = JSON.stringify(objCollection);
        $.ajax({
            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                $("#brustconfig .spinnerDiv").show();
                $(".panelNoShadow").hide();
                var getStatus = $("#tblRDSCollection tbody tr[class='AppImageName'] .Burst").text().trim();
                if (getStatus.toLowerCase() == "true") {
                    $("#btnSwitch #noScalestatus").removeClass("activeCls");
                    $("#btnSwitch #yesScalestatus").addClass("activeCls");
                    $("#brustconfig input[type!='submit']").attr("disabled", false);
                }
                else {
                    $("#btnSwitch #yesScalestatus").removeClass("activeCls");
                    $("#btnSwitch #noScalestatus").addClass("activeCls");
                    $("#brustconfig input[type!='submit']").attr("disabled", true);
                }
            },
            success: function (res) {
                res = $.parseJSON(res);

                var date = convertUTCDateToLocalDate(new Date("01-01-1111 " + res.PeakStartTime + ""));
                var PSThrs = date.getHours();
                var PSTmins = date.getMinutes();
                if (parseInt(date.getHours()) < 10) {
                    PSThrs = "0" + date.getHours();
                }
                if (parseInt(date.getMinutes()) < 10) {
                    PSTmins = "0" + date.getMinutes();
                }
                var PeakStarttime = PSThrs + ":" + PSTmins;


                var dateEnd = convertUTCDateToLocalDate(new Date("01-01-1111 " + res.PeakEndTime + ""));
                var PEThrs = dateEnd.getHours();
                var PETmins = dateEnd.getMinutes();
                if (parseInt(dateEnd.getHours()) < 10) {
                    PEThrs = "0" + dateEnd.getHours();
                }
                if (parseInt(dateEnd.getMinutes()) < 10) {
                    PETmins = "0" + dateEnd.getMinutes();
                }
                var PeakEndtime = PEThrs + ":" + PETmins;



                $("#peakstarttime").val(PeakStarttime);
                $("#peakendtime").val(PeakEndtime);
                $("#logoffwaittime").val(res.LogoffWaitTime);
                $("#tshpercpu").val(res.SessionThreshholdPerCPU);
                $("#minservercount").val(res.MinServerCount);
            },
            complete: function () {
                $("#brustconfig .spinnerDiv").hide();
                $(".panelNoShadow").show();
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Load Connection Configuration Data", error);
            }
        });
    });

    $("#ScaleSettingscloseicon").click(function () {
        RemoveBreadcrumb("brustconfig");
        $("#ScaleSettings").hide();
        $("#ScaleOptionScale").removeClass("AppImageName");

    });

    $("#ScaleClientSettings").click(function () {
        
        $("#min_ClientSettings").hide();
        $("#redirectedmonitorstxt").hide();
        $("#errorclientsettings").hide()
        $("#ClientSettings").show();
        $("#ScaleCollectionSettings").removeClass("AppImageName");
        $("#brusticon").removeClass("AppImageName");
        $("#ScaleClientSettings").addClass("AppImageName");
        $("#userprofileicon").removeClass("AppImageName");
        ScrollToHorizontalEnd($("#ClientSettings").width());
        $("#collectionconfigcloseicon").trigger("click");
        $("#ScaleSettingscloseicon").trigger("click");
        $("#userprofilecloseicon").trigger("click");
        $("#btnbrustconfigcloseicon").trigger("click");
        $("#brustconfig").hide();
        AddBreadcrumb("Client Setting", "ClientSettings", "settings");

        //ajax call to get the client settings values

        var objCollection =
                       {
                           "commandName": "getcollectionconfigForClientSettings",
                           "data":
                               {
                                   "CollectionName": selectedCollectionName,
                                   "ConnectionBroker": data.ConnectionBroker
                               }
                       }

        var jsonData = JSON.stringify(objCollection);
        $.ajax({
            url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: jsonData,
            beforeSend: function () {
                $("#ClientSettings .spinnerDiv").show();
                $(".panelNoShadow").hide();
            },
            success: function (res) {
                res = $.parseJSON(res);

                if (res.AudioVideoPlayback == true) {
                    $("#AudioVideoPlayback").attr("checked", true);
                }
                else {
                    $("#AudioVideoPlayback").attr("checked", false);
                }
                if (res.AudioRecording == true) {
                    $("#AudioRecording").attr("checked", true);
                }
                else {
                    $("#AudioRecording").attr("checked", false);
                }

                if (res.SmartCard == true) {
                    $("#SmartCard").attr("checked", true);
                }
                else {
                    $("#SmartCard").attr("checked", false);
                }

                if (res.PlugAndPlay == true) {
                    $("#PlugAndPlay").attr("checked", true);
                }
                else {
                    $("#PlugAndPlay").attr("checked", false);
                }

                if (res.Drive == true) {
                    $("#Drive").attr("checked", true);
                }
                else {
                    $("#Drive").attr("checked", false);
                }
                if (res.Clipboard == true) {
                    $("#Clipboard").attr("checked", true);
                }
                else {
                    $("#Clipboard").attr("checked", false);
                }
                if (res.ClientPrinterRedirected == true) {
                    $("#clientprinterredirection").attr("checked", true);
                }
                else {
                    $("#clientprinterredirection").attr("checked", false);
                }
                if (res.ClientPrinterAsDefault == true) {
                    $("#defaultprintingdevice").attr("checked", true);
                }
                else {
                    $("#defaultprintingdevice").attr("checked", false);
                }
                if (res.RDEasyPrintDriverEnabled == true) {
                    $("#rdeasyprint").attr("checked", true);
                }
                else {
                    $("#rdeasyprint").attr("checked", false);
                }
                $("#redirectedmonitors").val(res.MaxRedirectedMonitors);

                $("#btnCollectionSettings").attr("disabled", false);

            },
            complete: function () {
                $("#ClientSettings .spinnerDiv").hide();
                $(".panelNoShadow").show();
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Load Connection Configuration Data", error);
            }
        });


    });

    $("#ScaleClientSettingscloseicon").click(function () {
        $("#ClientSettings").hide();
        $("#min_ClientSettings").hide();
        RemoveBreadcrumb("settings");
        $("#ScaleClientSettings").removeClass("AppImageName");
    });

    $("#btnCollectionSettings").click(function () {
        var sessionserver = $("#sessionsperserver").val().trim();

    if ($("#sessionsperserver").val().toString().substring(0, 1) == "0") {
        $("#ConcurrentSession").show();
            $("#sessionsperserver").addClass("redborder");
            $("#errorcollectionsettings").show();
        }

        else if ((sessionserver != 0 || sessionserver != "")) {
            var isEndDisSession = false;
            var isEndSession = false;
            if ($("#automaticreconnection").is(":checked")) {
                isEndSession = true;
            }
            else {
                isEndSession = false;
            }
            if ($("#disconnectsessionradio").is(":checked")) {
                isEndDisSession = true;
            }
            else {
                isEndDisSession = false;
                isEndSession = false;
            }


            var totalMinsDS;
            if ($("#Enddisconnecteddd option:selected").text() == "Never") {
                totalMinsDS = 0;
            }
            else if ($("#Enddisconnecteddd option:selected").text() == "Minutes") {
                totalMinsDS = parseInt($("#disconnectedsessionvalues option:selected").text());
            }
            else if ($("#Enddisconnecteddd option:selected").text() == "Hours") {
                totalMinsDS = parseInt($("#disconnectedsessionvalues option:selected").text()) * 60;
            }
            else if ($("#Enddisconnecteddd option:selected").text() == "Days") {
                totalMinsDS = parseInt($("#disconnectedsessionvalues option:selected").text()) * 24 * 60;
            }

            var totalMinsAS;
            if ($("#activesessionlimitdd option:selected").text() == "Never") {
                totalMinsAS = 0;
            }
            else if ($("#activesessionlimitdd option:selected").text() == "Minutes") {
                totalMinsAS = parseInt($("#activesessionvalues option:selected").text());
            }
            else if ($("#activesessionlimitdd option:selected").text() == "Hours") {
                totalMinsAS = parseInt($("#activesessionvalues option:selected").text()) * 60;
            }
            else if ($("#activesessionlimitdd option:selected").text() == "Days") {
                totalMinsAS = parseInt($("#activesessionvalues option:selected").text()) * 24 * 60;
            }

            var totalMinsIS;
            if ($("#idlesessionlimitdd option:selected").text() == "Never") {
                totalMinsIS = 0;
            }
            else if ($("#idlesessionlimitdd option:selected").text() == "Minutes") {
                totalMinsIS = parseInt($("#idlesessionvalues option:selected").text());
            }
            else if ($("#idlesessionlimitdd option:selected").text() == "Hours") {
                totalMinsIS = parseInt($("#idlesessionvalues option:selected").text()) * 60;
            }
            else if ($("#idlesessionlimitdd option:selected").text() == "Days") {
                totalMinsIS = parseInt($("#idlesessionvalues option:selected").text()) * 24 * 60;
            }
            var objCollection =
                           {
                               "commandName": "savecollectionconfig",
                               "data":
                                   {
                                       "CollectionName": selectedCollectionName,
                                       "ConnectionBroker": data.ConnectionBroker,
                                       "CorrelationId": null, //data.ApiSubscriptionId,
                                       "DisconnectFromSession": totalMinsDS,
                                       "ActiveSessionLmit": totalMinsAS,
                                       "IdleSessionLimit": totalMinsIS,
                                       "EndADisconnectedSession": isEndDisSession,
                                       "EndSession": isEndSession,
                                       "LoadBalancingConcurrentSessionsPerServer": $("#sessionsperserver").val(),
                                       "SaveOnlyBurstSettings": false,
                                       "PeakStartTime": "00:00",
                                       "PeakEndTime": "00:00",
                                       "LogoffWaitTime": "0",
                                       "SessionThreshholdPerCPU": "0",
                                       "MinServerCount": "0",
                                       "AudioVideoPlayback": false,
                                       "AudioRecording": false,
                                       "SmartCard": false,
                                       "PlugAndPlay": false,
                                       "Drive": false,
                                       "Clipboard": false,
                                       "ClientPrinterRedirected": false,
                                       "ClientPrinterAsDefault": false,
                                       "RDEasyPrintDriverEnabled": false,
                                       "MaxRedirectedMonitors": "0",
                                   }
                           }

            var jsonData = JSON.stringify(objCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Managing configuration settings for '" + selectedCollectionName + "' collection...", "", "connectionConfig");
                },
                success: function (res) {
                    ShowInstantNotification("Success", "Successfully modified...", "'" + selectedCollectionName + "' collection configuration modified successfully.", "connectionConfig");
                },
                complete: function () {
                },
                error: function (error) {

                    LogError(data.ApiSubscriptionId, "Managing Collection Configuration", error);
                    ShowInstantNotification("Error", "Error modifying", "Could not modified collection configuration for '" + selectedCollectionName + "' collection.", "connectionConfig");
                }
            });
        } else {
            if (($("#sessionsperserver").val() == "")) {
                $("#ConcurrentSessions").show();
                $("#sessionsperserver").addClass("redborder");
                $("#errorcollectionsettings").show();
            }
            else {
                $("#sessionsperserver").show();
                $("#errorcollectionsettings").show();
                $("#ConcurrentSessions").addClass("redborder");
            }
        }
    });

    $("#sessionsperserver").keyup(function () {
        $("#ConcurrentSessions").hide();
        $("#ConcurrentSession").hide();
        $("#sessionsperserver").removeClass("redborder");
        $("#errorcollectionsettings").hide();
    });

    $("#btnScaleSetting").click(function () {
        var IsValidScaleData = "";
        var count = 0;
        $("#scaleformvalids input[type='text']").each(function () {
            var curVal = $(this).val();
            if ((curVal == "") || (curVal.indexOf('H') > 0) || (curVal.indexOf('M') > 0)) {
                var txtThisID = $(this).attr("id");
                $("#Scale_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#CollScaleErrorMsg").show();
                count++;
            }
            else {
                var txtThisID = $(this).attr("id");
                $("#Scale_" + txtThisID + "").hide();
                $("#" + txtThisID + "").removeClass("redborder");
            }
        });
        if (count > 0) {
            IsValidScaleData = "false";
        } else {
            IsValidScaleData = "true";
        }

        $("#logoffwaittime,#tshpercpu").each(function () {
            var curVal = $(this).val();
            var txtThisID = $(this).attr("id");
            if (curVal) {
                if (parseInt(curVal)<=0) {
                    $("#Scale_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#CollScaleErrorMsg").show();
                    IsValidScaleData = "false";
                    $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("This value should be positive)");
                }
                else {
                    var txtThisID = $(this).attr("id");
                    $("#Scale_" + txtThisID + "").hide();
                    $("#" + txtThisID + "").removeClass("redborder");
                }
            } else {
                $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("");
                $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("This value should not be empty");

            }
        });
        $("#minservercount").each(function () {
            var curVal = $(this).val();
            var txtThisID = $(this).attr("id");
            if (curVal) {
                if (parseInt(curVal) <0) {
                    $("#Scale_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#CollScaleErrorMsg").show();
                    IsValidScaleData = "false";
                    $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("This value should be Zero or Positive)");
                }
                else {
                    var txtThisID = $(this).attr("id");
                    $("#Scale_" + txtThisID + "").hide();
                    $("#" + txtThisID + "").removeClass("redborder");
                }
            } else {
                $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("");
                $("#Scale_" + txtThisID + "").children('span .tooltiptext').text("This value should not be empty");

            }
        });

        //if (($("#peakstarttime").val() != "") && ($("#peakendtime").val() != "") && ($("#logoffwaittime").val() != "") && ($("#tshpercpu").val() != "") && ($("#minservercount").val() != "")) {
        //    $("#CollScaleErrorMsg").hide();
        //}

        if ($("#peakstarttime").val().indexOf('H') > 0 || $("#peakstarttime").val().indexOf('M') > 0) {
            IsValidScaleData = "false";
            $("#CollScaleErrorMsg").show();
        }
        if ($("#peakendtime").val().indexOf('H') > 0 || $("#peakendtime").val().indexOf('M') > 0) {
            IsValidScaleData = "false";
            $("#CollScaleErrorMsg").show();
        }




        if (IsValidScaleData == "true") {


            var peakStartTime = $("#peakstarttime").val();
            if (peakStartTime.indexOf("PM") > -1) {
                var hrs = $("#peakstarttime").val().split(":")[0];
                peakStartTime = (parseInt(hrs) + 12);

                peakStartTime = peakStartTime + ":" + $("#peakstarttime").val().split(":")[1];
            }
            peakStartTime = peakStartTime.replace(" AM", "");
            peakStartTime = peakStartTime.replace(" PM", "");

            var peakEndTime = $("#peakendtime").val();
            if (peakEndTime.indexOf("PM") > -1) {
                var hrs = $("#peakendtime").val().split(":")[0];
                peakEndTime = (parseInt(hrs) + 12);
                peakEndTime = peakEndTime + ":" + $("#peakendtime").val().split(":")[1];
            }
            peakEndTime = peakEndTime.replace(" AM", "");
            peakEndTime = peakEndTime.replace(" PM", "");

            var PSDatetoBeConverted = new Date("01-01-1111 " + $("#peakstarttime").val() + "")

            var peakStartTimeUtc = PSDatetoBeConverted.toUTCString();
            peakStartTimeUtc = peakStartTimeUtc.substring(17, 22);


            var PEDatetoBeConverted = new Date("01-01-1111 " + $("#peakendtime").val() + "")

            var peakEndTimeUtc = PEDatetoBeConverted.toUTCString();
            peakEndTimeUtc = peakEndTimeUtc.substring(17, 22);


            //ajax call to save the scale session data

            var objCollection =
                           {
                               "commandName": "savecollectionconfigForScaleSettings",
                               "data":
                                   {

                                       "CollectionName": selectedCollectionName,
                                       "ConnectionBroker": data.ConnectionBroker,
                                       "SaveOnlyBurstSettings": false,
                                       "CorrelationId": null, //data.ApiSubscriptionId,
                                       "DisconnectFromSession": "0",
                                       "ActiveSessionLmit": "0",
                                       "IdleSessionLimit": "0",
                                       "EndADisconnectedSession": false,
                                       "EndSession": false,
                                       "LoadBalancingConcurrentSessionsPerServer": "0",
                                       "SaveOnlyBurstSettings": false,
                                       "PeakStartTime": peakStartTimeUtc,
                                       "PeakEndTime": peakEndTimeUtc,
                                       "LogoffWaitTime": $("#logoffwaittime").val(),
                                       "SessionThreshholdPerCPU": $("#tshpercpu").val(),
                                       "MinServerCount": $("#minservercount").val(),
                                       "AudioVideoPlayback": false,
                                       "AudioRecording": false,
                                       "SmartCard": false,
                                       "PlugAndPlay": false,
                                       "Drive": false,
                                       "Clipboard": false,
                                       "ClientPrinterRedirected": false,
                                       "ClientPrinterAsDefault": false,
                                       "RDEasyPrintDriverEnabled": false,
                                       "MaxRedirectedMonitors": "0",
                                   }
                           }

            var jsonData = JSON.stringify(objCollection);
            debugger;
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Managing session  settings for '" + selectedCollectionName + "' collection...", "", "brustconfig");
                },
                success: function (res) {
                    ShowInstantNotification("Success", "Successfully modified...", "'" + selectedCollectionName + "' session settings modified successfully.", "brustconfig");
                },
                complete: function () {
                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Managing session settings", error);
                    ShowInstantNotification("Error", "Error modifying", "Could not modified session settings for '" + selectedCollectionName + "' collection.", "brustconfig");
                }
            });
        }
    });


    $("#btnClientSettings").click(function () {
        var Monitors = $("#redirectedmonitors").val().trim();

        if ($("#redirectedmonitors").val().toString().substring(0,1) == "0") {
            $("#redirectedmonitor").show();
            $("#redirectedmonitors").addClass("redborder");
            $("#errorclientsettings").show();
        }

        else if ((Monitors != 0 || Monitors != "")) {
            var AudioVideoPlaybackchk;
            if ($("#AudioVideoPlayback").is(":checked")) {
                AudioVideoPlaybackchk = true;
            }
            else {
                AudioVideoPlaybackchk = false;
            }
            var AudioRecordingchk;
            if ($("#AudioRecording").is(":checked")) {
                AudioRecordingchk = true;
            }
            else {
                AudioRecordingchk = false;
            }
            var SmartCardchk;
            if ($("#SmartCard").is(":checked")) {
                SmartCardchk = true;
            }
            else {
                SmartCardchk = false;
            }
            var PlugAndPlaychk;
            if ($("#PlugAndPlay").is(":checked")) {
                PlugAndPlaychk = true;
            }
            else {
                PlugAndPlaychk = false;
            }
            var Drivechk;
            if ($("#Drive").is(":checked")) {
                Drivechk = true;
            }
            else {
                Drivechk = false;
            }
            var Clipboardchk;
            if ($("#Clipboard").is(":checked")) {
                Clipboardchk = true;
            }
            else {
                Clipboardchk = false;
            }
            var clientprinterredirectionchk;
            if ($("#clientprinterredirection").is(":checked")) {
                clientprinterredirectionchk = true;
            }
            else {
                clientprinterredirectionchk = false;
            }
            var defaultprintingdevicechk;
            if ($("#defaultprintingdevice").is(":checked")) {
                defaultprintingdevicechk = true;
            }
            else {
                defaultprintingdevicechk = false;
            }
            var rdeasyprintchk;
            if ($("#rdeasyprint").is(":checked")) {
                rdeasyprintchk = true;
            }
            else {
                rdeasyprintchk = false;
            }
            //ajax call to save the client settings data
            var objCollection =
                           {
                               "commandName": "savecollectionconfigForClientSettings",
                               "data":
                                   {
                                       "CollectionName": selectedCollectionName,
                                       "ConnectionBroker": data.ConnectionBroker,
                                       "CorrelationId": null, //data.ApiSubscriptionId,
                                       "DisconnectFromSession": "0",
                                       "ActiveSessionLmit": "0",
                                       "IdleSessionLimit": "0",
                                       "EndADisconnectedSession": false,
                                       "EndSession": false,
                                       "LoadBalancingConcurrentSessionsPerServer": "0",
                                       "SaveOnlyBurstSettings": false,
                                       "PeakStartTime": "00:00",
                                       "PeakEndTime": "00:00",
                                       "LogoffWaitTime": "0",
                                       "SessionThreshholdPerCPU": "0",
                                       "MinServerCount": "0",
                                       "AudioVideoPlayback": AudioVideoPlaybackchk,
                                       "AudioRecording": AudioRecordingchk,
                                       "SmartCard": SmartCardchk,
                                       "PlugAndPlay": PlugAndPlaychk,
                                       "Drive": Drivechk,
                                       "Clipboard": Clipboardchk,
                                       "ClientPrinterRedirected": clientprinterredirectionchk,
                                       "ClientPrinterAsDefault": defaultprintingdevicechk,
                                       "RDEasyPrintDriverEnabled": rdeasyprintchk,
                                       "MaxRedirectedMonitors": $("#redirectedmonitors").val(),
                                   }
                           }

            var jsonData = JSON.stringify(objCollection);
            debugger;
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Managing client settings for '" + selectedCollectionName + "' collection...", "", "client");
                },
                success: function (res) {
                    ShowInstantNotification("Success", "Successfully modified...", "'" + selectedCollectionName + "' client settings modified successfully.", "client");
                },
                complete: function () {
                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Managing Client settings", error);
                    ShowInstantNotification("Error", "Error modifying", "Could not modified client settings for '" + selectedCollectionName + "' collection.", "client");
                }
            });
        } else {
            if ($("#redirectedmonitors").val() == "") {
                $("#redirectedmonitorstxt").show();
                $("#redirectedmonitors").addClass("redborder");
                $("#errorclientsettings").show();
            }
            else {
                $("#redirectedmonitors").show();
                $("#errorclientsettings").show();
                $("#redirectedmonitors").addClass("redborder");
            }
        }
    });
    $("#redirectedmonitors").keyup(function () {
        $("#redirectedmonitorstxt").hide();
        $("#redirectedmonitors").removeClass("redborder");
        $("#errorclientsettings").hide();
        $("#redirectedmonitor").hide();
    });
    $("#settingsclosebtn").click(function () {
        $("#userprofileconfig ").hide();
        $("#brustconfig ").hide();
        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#auditlogsconfig").hide();
        $("#settingsshow").removeClass("activeDocBtn");
    })

    $("#deletecollection").click(function () {
        $("#deletecollection").addClass("activeDocBtn");
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        var thisColSel = selectedCollectionName;
        $("#deletcollctionconfirmmodal").text(selectedCollectionName);
        deleteCollectionConfirmationModal.style.display = "block";
        deleteCollectionConfirmationNo.onclick = function () {
            $("#deletecollection").removeClass("activeDocBtn");
            deleteCollectionConfirmationModal.style.display = "none";
        }
        deleteCollectionConfirmationYes.onclick = function () {
            var ColName = $("#tblRDSCollection tbody tr[class='AppImageName'] .Name").text().trim();
            var CollectionType = $("#tblRDSCollection tbody tr[class='AppImageName'] .CollectionType").text().trim();
            var Size = $("#tblRDSCollection tbody tr[class='AppImageName'] .Size").text().trim();
            var Burst = $("#tblRDSCollection tbody tr[class='AppImageName'] .Burst").text().trim();
            var Description = $("#tblRDSCollection tbody tr[class='AppImageName'] .Description").text().trim();

            $("#deletecollection").removeClass("activeDocBtn");
            deleteCollectionConfirmationModal.style.display = "none";
            if (selectedCollectionName != "" && selectedCollectionName != 'undefined') {
                var objCollection = null;
                objCollection =
                    {
                        "commandName": "adminRemoveCollection",
                        "data": {
                            "ConnectionBroker": data.ConnectionBroker,
                            "CollectionName": selectedCollectionName
                        }
                    }
                var jsonData = JSON.stringify(objCollection);

                $.ajax({
                    url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                    type: "POST",
                    crossDomain: true,
                    dataType: "json",
                    data: jsonData,
                    beforeSend: function () {
                        $("#tblRDSCollection tbody tr[class='AppImageName'] .Name").text(ColName);
                        $("#tblRDSCollection tbody tr[class='AppImageName'] .CollectionType").text("deleting collection...");
                        $("#tblRDSCollection tbody tr[class='AppImageName'] .Size").text("");
                        $("#tblRDSCollection tbody tr[class='AppImageName'] .Burst").text("");
                        $("#tblRDSCollection tbody tr[class='AppImageName'] .Description").text("");

                        $("#tblRDSCollection tbody tr[class='AppImageName']").addClass("nodata");
                        $("#tblRDSCollection tbody tr[class='AppImageName nodata']").removeClass("AppImageName");
                        $("#tblRDSCollection tbody tr[class='nodata']").addClass("InactiveRow");
                        $("#appUser").hide();
                        RemoveBreadcrumb("appsuserslist");
                        ShowInstantNotification("Progress", "Deleting '" + thisColSel + "' collection...", "", "deletecollection");
                    },
                    success: function (res) {
                        for (var i = 0; i < RDSCollectionsArray.length; i++) {
                            if (RDSCollectionsArray[i].Name == selectedCollectionName) {
                                RDSCollectionsArray.splice(i, 1);
                            }
                        }
                        deleteCollectionConfirmationModal.style.display = "none";
                        $("#tblRDSCollection tbody tr[class='nodata InactiveRow']").remove();
                        if ($("#myviewCollectionDiv tbody tr").length == 0) {
                            var rowTemplate = $("#myviewCollectionDiv .rowTemplate .blankRow tbody").html();
                            $("#tblRDSCollection tbody").append(rowTemplate);
                        }
                        var prevColDep = $("#appCountSpanDeployAdmin").text().trim();
                        prevColDep = (parseInt(prevColDep) - 1);
                        $("#appCountSpanDeployAdmin").text(prevColDep);
                        ShowInstantNotification("Success", "Successfully deleted...", "'" + thisColSel + "' collection deleted successfully.", "deletecollection");
                    },
                    complete: function () {
                    },
                    error: function (error) {
                        $("#tblRDSCollection tbody tr[class='InactiveRow'] .Name").text(ColName);
                        $("#tblRDSCollection tbody tr[class='InactiveRow'] .CollectionType").text(CollectionType);
                        $("#tblRDSCollection tbody tr[class='InactiveRow'] .Size").text(Size);
                        $("#tblRDSCollection tbody tr[class='InactiveRow'] .Burst").text(Burst);
                        $("#tblRDSCollection tbody tr[class='InactiveRow'] .Description").text(Description);
                        $("#tblRDSCollection tbody tr[class='InactiveRow']").removeClass("nodata");
                        $("#tblRDSCollection tbody").addClass("AppImageName");
                        $("#tblRDSCollection tbody tr[class='InactiveRow']").removeClass("InactiveRow");
                        deleteCollectionConfirmationModal.style.display = "none";
                        LogError(data.ApiSubscriptionId, "Delete Collection", error);
                        ShowInstantNotification("Error", "Deletion failed...", "Failed deleteing '" + thisColSel + "' collection.", "deletecollection");
                        console.log("ERROR:", error);
                    }
                });
            }
            else {
            }
        }
    });

    var requestcollectionRefresh = true;
    $("#collectionrefresh").click(function () {
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");

        CollectionNameSelect();
        $("#collectionrefresh").removeClass("activeDocBtn");

    });

    $("#showbuilduser").click(function () {
        $("#settings").hide();
        $("#ImportUserBlade").hide();
        $("#builduser").show();
        $("#activitysession").hide();
        $("#appsdivshow").hide();
        $("#downloadusageshow").hide();
        $("#addcustomapps").hide();
        $("#edidcustomapps").hide();
        $("#activesession").hide();
        $("#sendmessage").hide();
        $("#updatesappsimages").hide();
        $("#selectappsimages").hide();
        $("#signoutuser").hide();
        $("#appUsersTileBlade").hide();

        $("#ConfigureBasicSettingBlade").hide();
        $("#CreateCollectionBlade").hide();
    });
    $("#closeIconRDSCollectionBlade").click(function () {
        if ($("i", this).hasClass("inactiveIcon") == false) {
            $("#appUserCloseBlade").trigger("click");
            $("#CreateCollectionBladeCloseIcon").trigger("click");
            $("#appsuserslist").hide();
            $("#min_appsuserslist").hide();
            $("#dplycollections").removeClass("activeTile");
            RemoveBreadcrumb("dplydashboard");
        }

    });

    $("#appUserCloseBlade").click(function () {
        $("#settingsccrlosebtn").trigger("click");
        $("#CollectionMonitorCloseBlade").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#min_appUser").hide();
        $("#appUser").hide();
        RemoveBreadcrumb("appsuserslist");
        $(".rightArrIcon").hide();
        $("#tblRDSCollection tbody tr[class='AppImageName']").removeClass("AppImageName");
    });

    var status = localStorage.AddBreadcrumbs;
    if (status == "backAdd") {
        $("#addCollection").trigger('click');
        localStorage.setItem("AddBreadcrumbs", "");
    }
    //textBox validation
    //$('#txtName,#txtDescription,#nameaddCustomeApp,#comment,#commentVM').bind("paste", function (e) {
    //    e.preventDefault();
    //});

    $("#txtName").keyup(function () {
        var strNameField = $("#txtName").val().trim();
        if (strNameField != "") {
            $(".erroricon").hide();
            $("#txtName").removeClass("redborder");
            $(".Errormessage").hide();
        }

    });
    //Enable & Desable button in Create Custom App
    $("#nameaddCustomeApp").keyup(function () {
        var strNameField = $("#nameaddCustomeApp").val().trim();
        $("#addapperroricon").hide();
        $("#nameaddCustomeApp").removeClass("redborder");
        if ($("#pathAddCustomApp").val().trim() != "") {
            $("#erroraddapp").hide();
        }
    });
    $("#pathAddCustomApp").keyup(function () {
        var strDescField = $("#pathAddCustomApp").val().trim();
        $("#addapppatherroricon").hide();
        $("#addapppatherroricontxt").hide();
        $("#pathAddCustomApp").removeClass("redborder");
        if ($("#nameaddCustomeApp").val().trim() != "") {
            $("#addapperroricon").hide();
            $("#addapperroricon").removeClass("redborder");
            $("#erroraddapp").hide();
        }
    });

    //Enable & Desable button in Edit Custom App
    $("#nameEdit").keyup(function () {
        var strNameField = $("#nameEdit").val().trim();
        if (strNameField == "") {

            $("#btnEditCustomOk").attr("disabled", true);
        } else {
            $("#btnEditCustomOk").attr("disabled", false);
        }
    });

    $("#yesScalestatus").click(function (e) {
        $("#noScalestatus").removeClass("activeCls");
        $("#yesScalestatus").addClass("activeCls");
        ChangeScaleStatus("true");
    });

    $("#noScalestatus").click(function (e) {
        $("#noScalestatus").addClass("activeCls");
        $("#yesScalestatus").removeClass("activeCls");
        ChangeScaleStatus("false");
    });

    $("#selectedUserMsg").click(function (e) {
        $("#selectedUserMsg").addClass("btn-info");
        $("#allUserMsg").removeClass("btn-info");

        sendMessageState = 0;
    });

    $("#allUserMsg").click(function (e) {
        $("#allUserMsg").addClass("btn-info");
        $("#selectedUserMsg").removeClass("btn-info");

        sendMessageState = 1;
    });

    $("#selectedUserMsgVM").click(function (e) {
        $("#selectedUserMsgVM").addClass("btn-info");
        $("#allUserMsgVM").removeClass("btn-info");

        sendMessageStateVM = 0;
    });

    $("#allUserMsgVM").click(function (e) {
        $("#allUserMsgVM").addClass("btn-info");
        $("#selectedUserMsgVM").removeClass("btn-info");

        sendMessageStateVM = 1;
    });

     userprofilediskButtonSelection = true;
    $("#yesUSERPROFILEDISKS").click(function (e) {
        $("#noUSERPROFILEDISKS").removeClass("activeCls");
        $("#yesUSERPROFILEDISKS").addClass("activeCls");
        $(".Userprofilereadonly input").prop("readonly", false);
        $('.dockFooter input[type="submit"]').prop('disabled', false);
        //$("#profiledisklocationicontxt").show();
        //$("#errorprofiledisk").show();
        //$("#profilemaximumsize").show();
        //$("#profilemaximumsize0").show();
        //$("#profiledisklocationicon").show();
        userprofilediskButtonSelection = true;
    });

    $("#noUSERPROFILEDISKS").click(function (e) {
        $("#noUSERPROFILEDISKS").addClass("activeCls");
        $("#yesUSERPROFILEDISKS").removeClass("activeCls");
        $(".Userprofilereadonly input").prop("readonly", true);
        $("#profiledisklocationicontxt").hide();
        $("#errorprofiledisk").hide();
        $("#profilemaximumsize").hide();
        $("#profilemaximumsize0").hide();
        $("#profiledisklocationicon").hide();
        userprofilediskButtonSelection = false;
    });

    var t = false

    $('#redirectedmonitors').focus(function () {
        var $this = $(this)

        t = setInterval(

        function () {
            if (($this.val() < 1 || $this.val() > 16) && $this.val().length != 0) {
                if ($this.val() < 1) {
                    $this.val(1)
                }
                if ($this.val() > 16) {
                    $this.val(16)
                }
            }
        }, 50)
    })

    $('#redirectedmonitors').blur(function () {
        if (t != false) {
            window.clearInterval(t)
            t = false;
        }
    })

    $("#userprofilebtn").click(function () {
        $("#profiledisklocationicontxt").hide();
        $("#errorprofiledisk").hide();
        $("#profiledisklocationicon").hide();
        RemoveBreadcrumb("settings");
        var locationtext = $("#UserProfileLocationtxt").val().trim();
        // var locationtext1 = $("#UserProfileLocationtxt").val().split("")[0] + $("#UserProfileLocationtxt").val().split("")[1];
        locationtext = locationtext.replace(/\\/g, "\\");
        var MaxSize = $("#UserProfileGBtxt").val().trim();
        var MaxSize0 = $("#UserProfileGBtxt").val().toString().substring(0, 1);
        var test1 = $("#UserProfileLocationtxt").val().trim();
        var check = (/^(\\(\\[^\s\\]+)+|(-[^\s-]+)+|([A-Za-z]:(\\)?|[A-z]:(\\[^\s\\]+)+))(\\)?$/.test(test1).toString());
      
        if ((locationtext == "") && $("#yesUSERPROFILEDISKS").hasClass("activeCls")) {
            $("#profiledisklocationicon").show();
            $("#errorprofiledisk").show();
            //$("#erroraddapp").show();
        }       
        else if ((check == "false") && $("#yesUSERPROFILEDISKS").hasClass("activeCls")) {
            $("#profiledisklocationicontxt").show();
            $("#errorprofiledisk").show();
            //$("#erroraddapp").show();
        }       

        else if ((locationtext != "") && (MaxSize != 0 || MaxSize != "") && (MaxSize0 != 0) && $("#yesUSERPROFILEDISKS").hasClass("activeCls")) {

            Userprofiledisk();
        }
        if ($("#noUSERPROFILEDISKS").hasClass("activeCls")) {
             Userprofiledisk();
        }
        if (($("#UserProfileGBtxt").val() == "") && ($("#yesUSERPROFILEDISKS").hasClass("activeCls"))) {
            $("#profilemaximumsize").show();
            $("#UserProfileGBtxt").addClass("redborder");
            $("#errorprofiledisk").show();
        }


        if (($("#UserProfileGBtxt").val().toString().substring(0, 1) == "0") && ($("#yesUSERPROFILEDISKS").hasClass("activeCls"))) {
            $("#profilemaximumsize0").show();
            //   $("#UserProfileLocationtxt").adClass("redborder");
            $("#UserProfileGBtxt").addClass("redborder");
            $("#errorprofiledisk").show();
        }
    });
    

    //key up function for the user profile disk location

    $("#UserProfileLocationtxt").keyup(function () {
        $("#profiledisklocationicon").hide();
        $("#profiledisklocationicontxt").hide();
        $("#UserProfileLocationtxt").removeClass("redborder");
        
        if ($("#UserProfileGBtxt").val() != "") {
            $("#UserProfileGBtxt").removeClass("redborder");
            $("#errorprofiledisk").hide();
        }
     });


    //key up function for the maximum size gb text box

    $("#UserProfileGBtxt").keyup(function () {
        $("#UserProfileGBtxt").removeClass("redborder");
        $("#profilemaximumsize").hide();
        $("#profilemaximumsize0").hide();
        $("#errorprofiledisk").hide();
        if ($("#UserProfileLocationtxt").val().trim() != "") {

            $("#profiledisklocationicon").hide();
            $("#UserProfileLocationtxt").removeClass("redborder");
            $("#UserProfileGBtxt").removeClass("redborder");
            $("#errorprofiledisk").hide();
            //$("#errorprofiledisk").hide();
        }
        
    });

    myViewCollectionViewModel.Query = ko.observable('');

    /*Edit Custom App TextBox Validation */
    $('#btnEditCustomOk').click(function () {

        if ($("#nameEdit").val() == "") {
            $("#nameEdit").css("border", "1px solid red");

        } else {
            var objCollection =
                       {
                           "commandName": "editwappcollection",
                           "data": {
                               "ConnectionBroker": "CONTOSO-RDCB.PTGRDS.LOCAL",
                               "CollectionName": selectedCollectionName,
                               "ApplicationName": $("#appsTable tr[class='AppImageName'] .Alias").text().trim(),
                               "DisplayName": $("#nameEdit").val(),
                           }
                       }

            var jsonData = JSON.stringify(objCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#editSpinner").show();
                },
                success: function (res) {
                    $("#appsTable tr[class='AppImageName'] .Alias").text($("#nameEdit").val());
                    $("#edidcustomapps").hide();
                    editSuccessModal.style.display = "block";
                },
                complete: function () {
                    $("#editSpinner").hide();
                    $("#editcustomappsclick").removeClass("activeDocBtn");
                },
                error: function (error) {
                    $("#editSpinner").hide();
                    editModal.style.display = "block";
                    LogError(data.ApiSubscriptionId, "Edit Custom App", error);
                }
            });

        }
    });


    $("#logoffalluserbtn").click(function () {
        var userlogoffall = "";
        userlogoffall = $("#ActivesSessionCls tr[class='AppImageName']").length;
        if ($("#logoffalluserbtn").prop("disabled") == false) {
            $("#messageCloseBlade").trigger("click");
            var logoffAllUser =
                    {
                        commandName: "logOffAllSessions",
                        "data":
                         {
                             "ConnectionBroker": data.ConnectionBroker,
                             "CollectionName": selectedCollectionName
                         }
                    }
            var jsonData = JSON.stringify(logoffAllUser);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Logging off all session server...", "", "logoffalluserbtn");
                    $("#ActivesSessionCls tr[class='AppImageName']").each(function () {

                        $(".SessionState", this).text("deleting RD virtual machine...");
                        $(".LogonTime", this).text("");
                        $(".HostServer", this).text("");
                        $(".IdleTime", this).text("");

                        $(this).removeClass("AppImageName").addClass("nodata");
                        $(this).css("background-color", "#E6E6E6");
                        $(this).css("color", "#3A3A3A");
                    });


                    $("#ActivesSessionCls tbody tr").unbind("click");
                    $("#ActivesSessionCls tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                            $("#sendmessageshowclick").attr("disabled", true);
                            $("#disconnectbtn").attr("disabled", true);
                            $("#signoutusersbtn").attr("disabled", true);
                            $("#messageCloseBlade").trigger("click");
                        }
                        else {
                            $('#ActivesSessionCls tbody tr').removeClass('AppImageName');
                            $(this).addClass('AppImageName');
                            $("#sendmessageshowclick").attr("disabled", false);
                            $("#disconnectbtn").attr("disabled", false);
                            $("#disconnectallbtn").attr("disabled", false);
                            $("#signoutusersbtn").attr("disabled", false);
                            $("#logoffalluserbtn").attr("disabled", false);
                        }
                    });
                },
                success: function (res) {
                    for (var i = 0; i < SessionCollectionArray.length; i++) {
                        SessionCollectionArray.splice(i, 1);
                    }
                    $("#ActivesSessionCls tbody tr").each(function () {
                        $(this).remove();
                    });
                    $("#sessionCount").text(0);
                    $("#ActivesSessionCls tbody").html('');
                    var rowTemplate = $("#divactivesession .rowTemplate .blankRow tbody").html();
                    $("#ActivesSessionCls tbody").append(rowTemplate);
                    ShowInstantNotification("Success", "Successfully Logged off...", "'" + userlogoffall + "' session(s) logged Off succesfully.", "logoffalluserbtn");
                },
                complete: function () {
                    $("#logoffalluserbtn").removeClass("activeDocBtn");
                },
                error: function (error) {
                    console.log("ERROR:", error);
                    LogError(data.ApiSubscriptionId, "Log-Off All Sessions", error);
                    ShowInstantNotification("Error", "Error Logging Off...", "'" + userlogoffall + "' session(s) logged Off failed.", "logoffalluserbtn");
                }
            });
        }
        else {
            $("#logoffalluserbtn").removeClass("activeDocBtn");
        }
    });
    //ajax call to unpublish an app
    $("#unpublishselectedapp").click(function () {

        var selAlias = $("#appsTable tr[class='AppImageName'] .Alias").text().trim();
        var appnm = $("#appsTable tr[class='AppImageName'] .Name").text().trim();
        var selStatus = $("#appsTable tr[class='AppImageName'] .Status").text().trim();
        var selPath = $("#appsTable tr[class='AppImageName'] .Path").text().trim();
        var unpublishcount = "";
        unpublishcount = $("#appsTable tr[class='AppImageName']").length

        unpublishappConfirmationModal.style.display = "block";
        $("#unpublishselectedSpan").text(appnm);
        UnpublishConfirmationNo.onclick = function () {
            $("#deletecollection").removeClass("activeDocBtn");
            unpublishappConfirmationModal.style.display = "none";
        }

        UnpublishConfirmationYes.onclick = function () {

            if ($("#unpublishselectedapp").prop("disabled") == false) {
                unpublishappConfirmationModal.style.display = "none";
                $("#adddesktopclose").trigger("click");
                $("#closeIconAddCustomApps").trigger("click");
                $("#unpublishselectedapp").addClass("activeDocBtn");
                var objCollection =
                                    {
                                        "commandName": "removeappcollection",
                                        "data": {
                                            "ConnectionBroker": data.ConnectionBroker,
                                            "CollectionName": selectedCollectionName,
                                            "Alias": $("#appsTable tr[class='AppImageName'] .Alias").text()
                                        }
                                    }
                var jsonData = JSON.stringify(objCollection);
                $.ajax({
                    url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                    type: "POST",
                    crossDomain: true,
                    dataType: "json",
                    data: jsonData,
                    beforeSend: function () {
                        $("#appsTable tr[class='AppImageName'] .Path").text("deleting app...");
                        $("#appsTable tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                        $("#appsTable tr[class='nodata']").css("background-color", "#E6E6E6");
                        $("#appsTable tr[class='nodata']").css("color", "#3A3A3A");
                        $("#appsTable tbody tr").unbind("click");
                        $("#appsTable tbody tr[class!='nodata']").click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                $("#unpublishselectedapp").attr("disabled", true);
                            }
                            else {
                                $('#appsTable tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                $("#unpublishselectedapp").attr("disabled", false);
                            }
                        });
                        ShowInstantNotification("Progress", "Unpublishing '" + appnm + "' app...", "", "unpublishselectedapp");
                    },
                    success: function (res) {
                        //
                        $("#ico_" + selAlias + "").remove();
                        $("#AppImageLoad " + selAlias + "").remove();
                        var prevappCountSpan = $("#appCountSpan").text().trim();
                        prevappCountSpan--;
                        $("#appCountSpan").text(prevappCountSpan.toString());
                        if ($("#appsTable tbody tr").length == 0) {
                            var rowTemplate = $("#appStatusDiv .rowTemplate .blankRow tbody").html();
                            $("#appsTable tbody").append(rowTemplate);
                        }
                        for (var i = 0; i < AppsCollectionArray.length; i++) {
                            if (AppsCollectionArray[i].Alias == selAlias) {
                                AppsCollectionArray.splice(i, 1);
                            }
                        }
                        $("#appsTable tbody tr").each(function () {
                            if ($(".Alias", this).text().trim() == selAlias) {
                                $(this).remove();
                            }
                        });
                        $("#unpublishappnm").text(appnm);
                        $("#unpublishselectedapp").attr("disabled", true);
                        $("#deletecollection").removeClass("activeDocBtn");
                        ShowInstantNotification("Success", "Successfully unpublished app...", "'" + appnm + "' app unpublished successfully.", "unpublishselectedapp");
                    },
                    complete: function () {
                        $("#AppStatusName tr").removeClass("AppImageName");
                        $("#unpublishselectedapp").removeClass("activeDocBtn");
                    },
                    error: function (error) {
                        $("#appsTable tr[class='nodata'] .Alias").text(selAlias);
                        $("#appsTable tr[class='nodata'] .Name").text(appnm);
                        $("#appsTable tr[class='nodata'] .Status").text(selStatus);
                        $("#appsTable tr[class='nodata'] .Path").text(selPath);
                        $("#appsTable tr[class='nodata']").removeClass("nodata").addClass("AppImageName");

                        $("#appsTable tr[class='AppImageName']").css("background-color", "#FFFFFF");
                        $("#appsTable tr[class='AppImageName']").css("color", "#000000");
                        $("#appsTable tr[class='AppImageName']").removeClass("AppImageName");

                        $("#appsTable tbody tr").unbind("click");
                        $("#appsTable tbody tr[class!='nodata']").click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                $("#unpublishselectedapp").attr("disabled", true);
                            }
                            else {
                                $('#appsTable tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                $("#unpublishselectedapp").attr("disabled", false);
                            }
                        });

                        LogError(data.ApiSubscriptionId, "Unpublish Apps", error);
                        ShowInstantNotification("Error", "Failure unpublishing app...", "Failed unpublishing '" + appnm + "' app.", "unpublishselectedapp");
                    }
                });

            }

            else {
                $("#unpublishselectedapp").removeClass("activeDocBtn");
            }
        }
    });

    // ajax for Active sessions
    $.ajax({
        url: data.ApiUrl + "subscriptions/GetSessionTest/" + data.ApiSubscriptionId + "/" + data.ConnectionBroker + "/" + selectedCollectionName + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        success: function (res) {
            self.user = res[0].data// response to observable arrray

        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load Active Sessions", error);
            console.log("ERROR:", error);
        }
    });

    //Ajax for Sigout User
    $("#signoutusersbtn").click(function () {
        var userlogoff = "";
        userlogoff = $("#ActivesSessionCls tr[class='AppImageName']").length;
        if ($("#signoutusersbtn").prop("disabled") == false) {
            $("#messageCloseBlade").trigger("click");
            var thisUserName = $("#ActivesSessionCls tr[class='AppImageName'] .UserName").text().trim();
            var thisSelServ = $("#ActivesSessionCls tr[class='AppImageName'] .HostServer").text().trim();
            var signoutSelectedUser =
                                               {
                                                   commandName: "logOffSelectedSession",
                                                   "data":
                        {
                            "HostServer": $("#ActivesSessionCls tr[class='AppImageName'] .HostServer").text().trim(),
                            "UnifiedSessionID": $("#ActivesSessionCls tr[class='AppImageName'] .UnifiedSessionID").text().trim()
                        }
                                               }
            var jsonData = JSON.stringify(signoutSelectedUser);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#ActivesSessionCls tr[class='AppImageName'] .Status").text("");
                    $("#ActivesSessionCls tr[class='AppImageName'] .Type").text("deleting RD virtual machine...");
                    $("#ActivesSessionCls tr[class='AppImageName'] .Sessions").text("");

                    $("#ActivesSessionCls tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                    $("#ActivesSessionCls tr[class='nodata']").css("background-color", "#E6E6E6");
                    $("#ActivesSessionCls tr[class='nodata']").css("color", "#3A3A3A");

                    $("#ActivesSessionCls tbody tr").unbind("click");
                    $("#ActivesSessionCls tbody tr[class!='nodata']").click(function () {
                        if ($(this).hasClass("AppImageName")) {
                            $(this).removeClass('AppImageName');
                            $("#sendmessageshowclick").attr("disabled", true);
                            $("#disconnectbtn").attr("disabled", true);
                            $("#signoutusersbtn").attr("disabled", true);
                            $("#messageCloseBlade").trigger("click");
                        }
                        else {
                            $('#ActivesSessionCls tbody tr').removeClass('AppImageName');
                            $(this).addClass('AppImageName');
                            $("#sendmessageshowclick").attr("disabled", false);
                            $("#disconnectbtn").attr("disabled", false);
                            $("#disconnectallbtn").attr("disabled", false);
                            $("#signoutusersbtn").attr("disabled", false);
                            $("#logoffalluserbtn").attr("disabled", false);
                        }
                    });

                    ShowInstantNotification("Progress", "Logging off '" + thisSelServ + "' session server...", "", "signoutusersbtn");
                },
                success: function (res) {
                    for (var i = 0; i < SessionCollectionArray.length; i++) {
                        if (SessionCollectionArray[i].UserName == thisUserName) {
                            SessionCollectionArray.splice(i, 1);
                        }
                    }
                    $("#ActivesSessionCls tbody tr").each(function () {
                        if ($(".UserName", this).text().trim() == thisUserName) {
                            $(this).remove();
                        }
                    });
                    var prevsessionCount = $("#sessionCount").text().trim();
                    prevsessionCount--;
                    $("#sessionCount").text(prevsessionCount);
                    if ($("#ActivesSessionCls tbody tr").length == 0) {
                        var rowTemplate = $("#divactivesession .rowTemplate .blankRow tbody").html();
                        $("#ActivesSessionCls tbody").append(rowTemplate);
                    }
                    ShowInstantNotification("Success", "Successfully logged off session server...", "'" + thisSelServ + "' session server logged off succesfully.", "signoutusersbtn");
                },
                complete: function () {
                    $("#signoutusersbtn").removeClass("activeDocBtn");
                },
                error: function (error) {
                    $("#signoutusersbtn").removeClass("activeDocBtn");
                    console.log("ERROR:", error);
                    ShowInstantNotification("Error", "Failed logging off session server...", "'" + thisSelServ + "' session server logged off failed.", "signoutusersbtn");
                    LogError(data.ApiSubscriptionId, "Log-Off Session Host Server", error);
                }
            });
        }
        else {
            $("#signoutusersbtn").removeClass("activeDocBtn");
        }
    });

    //Ajax for Diconnecting users
    $("#disconnectbtn").click(function () {
        var thisSelServ = "";
        thisSelServ = $("#ActivesSessionCls tr[class='AppImageName'] .HostServer").text().trim();
        if ($("#disconnectbtn").prop("disabled") == false) {
            $("#messageCloseBlade").trigger("click");
            var disconnectSelectedCollection = {
                "commandName": "disconnectSelectedSession",
                "data":
                        {
                            "HostServer": $("#ActivesSessionCls tr[class='AppImageName'] .HostServer").text().trim(),
                            "UnifiedSessionID": $("#ActivesSessionCls tr[class='AppImageName'] .UnifiedSessionID").text().trim()
                        }
            }
            var jsonData = JSON.stringify(disconnectSelectedCollection);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Disconnecting '" + thisSelServ + "' server...", "", "disconnectbtn");
                },
                success: function (res) {
                    $("#disconnectModalmsg").text('"' + $("#ActivesSessionCls tr[class='AppImageName'] .UserName").text().trim() + '"')
                    refreshSessionData();
                    ShowInstantNotification("Success", "Successfully disconnected server...", "'" + thisSelServ + "' session server disconnected succesfully.", "disconnectbtn");
                },
                complete: function () {
                    $("#disconnectbtn").removeClass("activeDocBtn");
                },
                error: function (error) {
                    $("#disconnectbtn").removeClass("activeDocBtn");
                    LogError(data.ApiSubscriptionId, "Disconnect Session Host Server", error);
                    ShowInstantNotification("Error", "Failed disconnecting session server...", "Could not disconnect'" + thisSelServ + "' session server.", "disconnectbtn");
                    console.log("ERROR:", error);
                }
            });
        }
        else {
            $("#disconnectbtn").removeClass("activeDocBtn");
        }
    });

    $("#disconnectallbtn").click(function () {
        var userdisconnectall = "";
        userdisconnectall = $("#ActivesSessionCls tr[class='AppImageName']").length;
        if ($("#disconnectallbtn").prop("disabled") == false) {
            $("#messageCloseBlade").trigger("click");
            var disconnectallsession = {
                "commandName": "disconnectAllSessions",
                "data":
                        {
                            "ConnectionBroker": data.ConnectionBroker,
                            "CollectionName": selectedCollectionName
                        }
            }
            var jsonData = JSON.stringify(disconnectallsession);
            $.ajax({
                url: data.ApiUrl + "subscriptions/ProcessCommand/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    ShowInstantNotification("Progress", "Disconnecting session server(s) ...", "", "disconnectallbtn");
                },
                success: function (res) {
                    refreshSessionData();
                    ShowInstantNotification("Success", "Successfully disconnected session server(s)...", "'" + userdisconnectall + "' session server(s) disconnected successfully.", "disconnectallbtn");
                },
                complete: function () {
                    $("#disconnectallbtn").removeClass("activeDocBtn");
                },
                error: function (error) {
                    $("#disconnectallbtn").removeClass("activeDocBtn");
                    LogError(data.ApiSubscriptionId, "Disconnect All Session Host Server", error);
                    ShowInstantNotification("Error", "Failed disconnecting all session server(s)...", "'" + userdisconnectall + "' session(s) disconnection failed.", "disconnectallbtn");
                    console.log("ERROR:", error);
                }
            });
        }
        else {
            $("#disconnectallbtn").removeClass("activeDocBtn");
        }
    });

    $('#sendmessageVMclick').click(function () {
        $("#msgtitleVM").val('');
        $("#commentVM").val('');
        if ($("#sendmessageVMclick").prop("disabled") == false) {
            $("#min_divSHSMonitor").hide();
            $("#min_sendmessageVM").hide();
            $("#min_selectappimages").hide();
            $("#SHSMonitorCloseBlade").trigger("click");
            AddBreadcrumb("Message", "sendmessageVM", "serversshow");
            $("#sendmessageVM").show();
            $("#selectappimages").hide();
            $("#selectedUserNameVM option[value=0]").text($("#serverlistselectid tr[class='AppImageName'] .Name").text().trim());
            $('#sendmessageVMclick').addClass("activeDocBtn");
        }
        else {
            $('#sendmessageVMclick').removeClass("activeDocBtn");
        }
        ScrollToHorizontalEnd(350);
    });

    $("#menuMonitorSHS").click(function () {
        if ($("#menuMonitorSHS").prop("disabled") == false) {
            $("#menuMonitorSHS").addClass("activeDocBtn");
            $("#imageCloseBlade").trigger("click");
            $("#messageCloseBladeVM").trigger("click");
            $("#min_divSHSMonitor").hide();
            $("#divSHSMonitor").show();
            var serverName = $("#serverlistselectid tbody tr[class='AppImageName'] .Name").text();
            $("#SHSMonitorHeader").text(serverName);
            ScrollToHorizontalEnd($("#divSHSMonitor").width());
            AddBreadcrumb("SHS Monitor", "divSHSMonitor", "serversshow");
            $("#selectappimages").hide();
            FilterSessionsNo();
            FilterCPUUtilization();
            FilterDiskReadWrite();
            FilterNetworkInOut();

        }
    });
    //Open Monitor Customization
    $("#editBtn").click(function () {
        $("#typeofconnection").text("Collection:");
        $("#recordName").text($("#tblRDSCollection tr[class='AppImageName'] .Name").text().trim());
        $("#EditChartContainer").show();
        $(".checkboxChart input[type='checkbox']").prop("checked", false);
        $(".radiogroup input[type='radio']").prop("checked", false);
        $("#collectionleveldiv").css('display', "block");
        $("#cpuUtilizationdiv").css('display', "none");
        $("#activeSessiondiv").css('display', "none");
        $("#readandWritediv").css('display', "none");
        $("#networkINOutdiv").css('display', "none");
        $("#collectionleveldiv").css('display', "none");
        $("input[value='collectionlevel']").prop('checked', true);
        checkFilterBy($(this).attr("search"));
    });

    $("#EditChartClose").click(function () {

        $("input[value='cpuUtilization']").attr('disabled', false);
        $("input[value='activeSession']").attr('disabled', false);
        $("input[value='readandWrite']").attr('disabled', false);
        $("input[value='networkINOut']").attr('disabled', false);
        $("input[value='collectionlevel']").attr('disabled', false);
        checkFilterBy($(this).attr("search"));
    });
    function checkFilterBy(filterby) {
        if (filterby == "past hour") {
            $("input[id='Hour']").prop('checked', true);
            $("input[id='Hour']").trigger("click");

        }
        else if (filterby == "today") {
            $("input[id='Today']").prop('checked', true);
            $("input[id='Today']").trigger("click");
        }
        else if (filterby == "past week") {
            $("input[id='Week']").prop('checked', true);
            $("input[id='Week']").trigger("click");
        }
        else {
            $("input[id='Custom']").prop('checked', true);
            $("input[id='Custom']").trigger("click");
        }
    }
    $("#ActiveSHSBtn").click(function () {
        $("#typeofconnection").text("SHS:");
        $("#recordName").text($("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim());
        $("#EditChartContainer").show();
        $(".checkboxChart input[type='checkbox']").prop("checked", false);
        $("input[value='activeSession']").prop('checked', true);
        $(".radiogroup input[type='radio']").prop("checked", false);
        checkFilterBy($(this).attr("search"));
        //$("input[value='collectionlevel']").attr('disabled', "");
        $("#collectionleveldiv").css('display', "none");
        $("#cpuUtilizationdiv").css('display', "block");
        $("#activeSessiondiv").css('display', "block");
        $("#readandWritediv").css('display', "block");
        $("#networkINOutdiv").css('display', "block");
    });
    $("#CPUutizBtn").click(function () {
        $("#typeofconnection").text("SHS:");
        $("#recordName").text($("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim());
        $("#EditChartContainer").show();
        $(".checkboxChart input[type='checkbox']").prop("checked", false);
        $("input[value='cpuUtilization']").prop('checked', true);
        $(".radiogroup input[type='radio']").prop("checked", false);
        checkFilterBy($(this).attr("search"));
        //$("input[value='collectionlevel']").attr('disabled', "");
        $("#collectionleveldiv").css('display', "none");
        $("#cpuUtilizationdiv").css('display', "block");
        $("#activeSessiondiv").css('display', "block");
        $("#readandWritediv").css('display', "block");
        $("#networkINOutdiv").css('display', "block");

    });

    $("#networkInOutBtn").click(function () {
        $("#typeofconnection").text("SHS:");
        $("#recordName").text($("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim());
        $("#EditChartContainer").show();
        $(".checkboxChart input[type='checkbox']").prop("checked", false);
        $("input[value='networkINOut']").prop('checked', true);
        $(".radiogroup input[type='radio']").prop("checked", false);
        checkFilterBy($(this).attr("search"));
        //$("input[value='collectionlevel']").attr('disabled', "");
        $("#collectionleveldiv").css('display', "none");
        $("#cpuUtilizationdiv").css('display', "block");
        $("#activeSessiondiv").css('display', "block");
        $("#readandWritediv").css('display', "block");
        $("#networkINOutdiv").css('display', "block");

    });

    $("#diskRandWBtn").click(function () {
        $("#typeofconnection").text("SHS:");
        $("#recordName").text($("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim());
        $("#EditChartContainer").show();
        $(".checkboxChart input[type='checkbox']").prop("checked", false);
        $(":checkbox[value=readandWrite]").prop('checked', true);
        $(".radiogroup input[type='radio']").prop("checked", false);
        checkFilterBy($(this).attr("search"));
        //$("input[value='collectionlevel']").attr('disabled', "");
        $("#collectionleveldiv").css('display', "none");
        $("#cpuUtilizationdiv").css('display', "block");
        $("#activeSessiondiv").css('display', "block");
        $("#readandWritediv").css('display', "block");
        $("#networkINOutdiv").css('display', "block");

    });
    //End.........................................
    function FilterSessionsNo() {
        if ($("#ActiveSHSBtn").attr("search") == "past hour") {
            ShowActiveSession(getPrevHourDateTime(), getNowDateTime());
        }
        else if ($("#ActiveSHSBtn").attr("search") == "today") {
            ShowActiveSession(getPrevDay(), getNowDateTime());
        }
        else if ($("#ActiveSHSBtn").attr("search") == "past week") {
            ShowActiveSession(getPastWeek(), getNowDateTime());
        }
        else {
            var starttime = formatCustomDate($("#datetimepickerFrom input").val());
            var endtime = formatCustomDate($("#datetimepickerTo input").val());
            ShowActiveSession(starttime, endtime);
        }
    }
    function FilterCPUUtilization() {
        var vm_name = $("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim()
        if ($("#CPUutizBtn").attr("search") == "past hour") {
            ReadCPUUtilization(vm_name, getPrevHourDateTime(), getNowDateTime());
        }
        else if ($("#CPUutizBtn").attr("search") == "today") {
            ReadCPUUtilization(vm_name, getPrevDay(), getNowDateTime());
        }
        else if ($("#CPUutizBtn").attr("search") == "past week") {
            ReadCPUUtilization(vm_name, getPastWeek(), getNowDateTime());
        }
        else {
            var starttime = formatCustomDate($("#datetimepickerFrom input").val());
            var endtime = formatCustomDate($("#datetimepickerTo input").val());
            ReadCPUUtilization(vm_name, starttime, endtime);
        }
    }
    function FilterDiskReadWrite() {
        var vm_name = $("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim()
        if ($("#diskRandWBtn").attr("search") == "past hour") {
            ReadDiskReadWrite(vm_name, getPrevHourDateTime(), getNowDateTime());
        }
        else if ($("#diskRandWBtn").attr("search") == "today") {
            ReadDiskReadWrite(vm_name, getPrevDay(), getNowDateTime());
        }
        else if ($("#diskRandWBtn").attr("search") == "past week") {
            ReadDiskReadWrite(vm_name, getPastWeek(), getNowDateTime());
        }
        else {
            var starttime = formatCustomDate($("#datetimepickerFrom input").val());
            var endtime = formatCustomDate($("#datetimepickerTo input").val());
            ReadDiskReadWrite(vm_name, starttime, endtime);
        }
    }
    function FilterNetworkInOut() {
        var vm_name = $("#serverlistselectid tbody tr[class='AppImageName'] .Name").text().trim()
        if ($("#networkInOutBtn").attr("search") == "past hour") {
            ReadNetworkInOut(vm_name, getPrevHourDateTime(), getNowDateTime());
        }
        else if ($("#networkInOutBtn").attr("search") == "today") {
            ReadNetworkInOut(vm_name, getPrevDay(), getNowDateTime());
        }
        else if ($("#networkInOutBtn").attr("search") == "past week") {
            ReadNetworkInOut(vm_name, getPastWeek(), getNowDateTime());
        }
        else {
            var starttime = formatCustomDate($("#datetimepickerFrom input").val());
            var endtime = formatCustomDate($("#datetimepickerTo input").val());
            ReadNetworkInOut(vm_name, starttime, endtime);
        }
    }

    $("#btnEstiChartOk").click(function () {

        var search = $("input[name='chartradio']:checked").parent().text().trim();
        $(".checkboxChart input[type='checkbox']:checked").each(function () {
            var opt = $(this).val();
            if (opt == "cpuUtilization") {
                if (search != $("#CPUutizBtn").attr("search")) {
                    $("#CPUutizBtn").attr("search", search);
                    FilterCPUUtilization();
                }

            }
            else if (opt == "activeSession") {
                if (search != $("#ActiveSHSBtn").attr("search")) {
                    $("#ActiveSHSBtn").attr("search", search);
                    FilterSessionsNo();
                }
            }
            else if (opt == "readandWrite") {
                if (search != $("#diskRandWBtn").attr("search")) {
                    $("#diskRandWBtn").attr("search", search);
                    FilterDiskReadWrite();
                }

            }
            else if (opt == "networkINOut") {
                if (search != $("#networkInOutBtn").attr("search")) {
                    $("#networkInOutBtn").attr("search", search);
                    FilterNetworkInOut();
                }
            }
            else if (opt == "collectionlevel") {
                if (search != $("#editBtn").attr("search")) {
                    $("#editBtn").attr("search", search);
                    $("#collectionmonitor").trigger("click");
                }
            }
        });

        $("#EditChartClose").trigger("click");
    });

    function getPrevHourDateTime() {
        var today = new Date();
        var date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate());
        var hr = (today.getUTCHours() - 1);
        if (parseInt(hr) < 0) {
            hr = (24 + parseInt(hr));
        }
        var time = hr + ":" + (today.getUTCMinutes());
        var dateTime = date + ' ' + time;
        return dateTime;
    }
    function getNowDateTime() {
        var today = new Date();
        var date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate());
        var time = today.getUTCHours() + ":" + (today.getUTCMinutes());
        var dateTime = date + ' ' + time;
        return dateTime;
    }
    function getPrevDay() {
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate());
        var time = today.getUTCHours() + ":" + (today.getUTCMinutes());
        var dateTime = date + ' ' + time;
        return dateTime;
    }
    function getPastWeek() {
        var today = new Date();
        today.setDate(today.getDate() - 7);
        var date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate());
        var time = today.getUTCHours() + ":" + (today.getUTCMinutes());
        var dateTime = date + ' ' + time;
        return dateTime;
    }
    function formatCustomDate(customDate) {
        var today = new Date(customDate);
        var date = today.getUTCFullYear() + "-" + (today.getUTCMonth() + 1) + '-' + (today.getUTCDate());
        var time = today.getUTCHours() + ":" + (today.getUTCMinutes());
        var dateTime = date + ' ' + time;
        return dateTime;
    }

    function generateChartData(x, y) {
        var chartData = [];
        var firstDate = new Date();
        firstDate.setDate(firstDate.getDate() - 60);
        for (var i = 0; i < 60; i++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);
            var visits = Math.round(Math.random() * 80) + 50 + 1 * 3;
            chartData.push({
                time: newDate,
                sessions: visits
            });
        }
        return chartData;
    }
    function generateChartData2() {
        var chartData = [];
        var firstDate = new Date();
        firstDate.setDate(firstDate.getDate() - 60);
        for (var i = 0; i < 60; i++) {
            var newDate = new Date(firstDate);
            newDate.setDate(newDate.getDate() + i);
            var visits = Math.round(Math.random() * 80) + 1 * 3;
            chartData.push({
                time: newDate,
                sessions: visits
            });
        }
        return chartData;
    }
    function ShowActiveSession(fromDate, toDate) {
        fromDate = fromDate.replace(" ", "_");
        fromDate = fromDate.replace(":", "!");
        toDate = toDate.replace(" ", "_");
        toDate = toDate.replace(":", "!");
        var VM = $("#serverlistselectid tbody tr[class='AppImageName'] .Name").text();
        var url = data.ApiUrl + "/admin/GetDiagnosticData/" + VM + "/" + fromDate + "/" + toDate + "/SHSSESSION";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () {
                $("#activeSessionMockupSpinner").show();
                $("#activeSessionMockup").hide();
            },
            complete: function () {
                $("#activeSessionMockupSpinner").hide();
                $("#activeSessionMockup").show();
                $("a[title='JavaScript charts']").hide();
            },
            success: function (res) {
                var chartData = [];
                for (var i = 0; i < res.length; i++) {
                    var dateFieldData = "";
                    if ($("#ActiveSHSBtn").attr("search") != "past hour" && $("#ActiveSHSBtn").attr("search") != "today") {
                        dateFieldData = res[i].Time.substring(0, 6).trim();
                    }
                    else {
                        dateFieldData = res[i].Time.substring(6, 14).trim();
                    }
                    chartData.push({
                        Time: dateFieldData,
                        ActiveSHS: res[i].ActiveSessions
                    });
                    $("a[title='JavaScript charts']").hide();
                }
                var chart = AmCharts.makeChart("activeSessionMockup", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": chartData,
                    "synchronizeGrid": true,
                    "valueAxes": [{
                        "id": "v1",
                        "axisColor": "#2E80AB",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "left",
                        "integersOnly": true
                    }],
                    "graphs": [{
                        "valueAxis": "v1",
                        "lineColor": "#2E80AB",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "Active Sessions",
                        "valueField": "ActiveSHS",
                        "fillAlphas": 0
                    }],
                    "chartScrollbar": {
                        "scrollbarHeight": 1,
                        "backgroundAlpha": 0.1,
                        "backgroundColor": "#868686",
                        "selectedBackgroundColor": "#CDCDCD",
                        "selectedBackgroundAlpha": 1
                    },
                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true
                    },
                    "categoryField": "Time",
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });

                chart.addListener("dataUpdated", zoomChart);
                zoomChart();

                function zoomChart() {
                    if (chart.zoomToIndexes) {
                        chart.zoomToIndexes(0, chartData.length - 1);
                        $("a[title='JavaScript charts']").hide();
                    }
                    setTimeout(function () {
                        $("a[title='JavaScript charts']").hide();
                    }, 2000);
                }
            },
            error: function (error) {

            }
        });
    }
    function ReadCPUUtilization(VM, fromDate, toDate) {
        fromDate = fromDate.replace(" ", "_");
        fromDate = fromDate.replace(":", "!");
        toDate = toDate.replace(" ", "_");
        toDate = toDate.replace(":", "!");
        var url = data.ApiUrl + "/admin/GetDiagnosticData/" + VM + "/" + fromDate + "/" + toDate + "/CPU";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () {
                $("#NoOfActivatedSessions").hide();
                $("#SHSMonitorSpinner").show();
                $("#currentCPUStatus").parent().hide();
            },
            complete: function () {
                $("#SHSMonitorSpinner").hide();
                $("#NoOfActivatedSessions").show();
                $("#currentCPUStatus").parent().show();
                $("a[title='JavaScript charts']").hide();
            },
            success: function (res) {
                var chartData = [];
                for (var i = 0; i < res.length; i++) {
                    if (i == res.length - 1) {
                        $("#currentCPUStatus").text(res[i].Data + "%");
                    }
                    var dateFieldData = "";
                    if ($("#CPUutizBtn").attr("search") != "past hour" && $("#CPUutizBtn").attr("search") != "today") {
                        dateFieldData = res[i].Time.substring(0, 6).trim();
                    }
                    else {
                        dateFieldData = res[i].Time.substring(6, 14).trim();
                    }
                    chartData.push({
                        lineColor: "#0072C6",
                        date: dateFieldData,
                        cpu: res[i].Data
                    });
                }
                var chart = AmCharts.makeChart("NoOfActivatedSessions", {
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": chartData,
                    "balloon": {
                        "cornerRadius": 0,
                        "horizontalPadding": 15,
                        "verticalPadding": 10,
                        "color": "#0072C6",
                        "fillColor": "#FFFFFF",
                        "adjustBorderColor": true,
                        "borderThickness": 1,
                    },
                    "valueAxes": [{
                        "minimum": 0,
                        "maximum": 100,
                        "axisAlpha": 0
                    }],
                    "graphs": [{
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "bulletBorderThickness": 1,
                        "fillAlphas": 0.3,
                        "fillColorsField": "lineColor",
                        "legendValueText": "[[value]]",
                        "lineColorField": "lineColor",
                        "title": "CPU Utilization",
                        "valueField": "cpu"
                    }],
                    "chartScrollbar": {
                        "scrollbarHeight": 1,
                        "backgroundAlpha": 0.1,
                        "backgroundColor": "#868686",
                        "selectedBackgroundColor": "#CDCDCD",
                        "selectedBackgroundAlpha": 1
                    },
                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true
                    },
                    "categoryField": "date",
                    "export": {
                        "enabled": true
                    }
                });

                chart.addListener("dataUpdated", zoomChart);
                zoomChart();
                function zoomChart() {
                    if (chart.zoomToIndexes) {
                        chart.zoomToIndexes(0, chartData.length - 1);
                    }
                    setTimeout(function () {
                        $("a[title='JavaScript charts']").hide();
                    }, 2000);
                }
            },
            error: function (error) {

            }
        });

    }
    function ReadDiskReadWrite(VM, fromDate, toDate) {
        fromDate = fromDate.replace(" ", "_");
        fromDate = fromDate.replace(":", "!");
        toDate = toDate.replace(" ", "_");
        toDate = toDate.replace(":", "!");

        var url = data.ApiUrl + "/admin/GetDiagnosticData/" + VM + "/" + fromDate + "/" + toDate + "/DISK";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () {
                $("#DiskReadWriteGraph").hide();
                $("#DiskReadWriteGraphSpinner").show();
            },
            complete: function () {
                $("#DiskReadWriteGraphSpinner").hide();
                $("#DiskReadWriteGraph").show();
                $("a[title='JavaScript charts']").hide();
            },
            success: function (res) {
                var chartData = [];
                for (var i = 0; i < res.length; i++) {
                    var dateFieldData = "";
                    if ($("#diskRandWBtn").attr("search") != "past hour" && $("#diskRandWBtn").attr("search") != "today") {
                        dateFieldData = res[i].Time.substring(0, 6).trim();
                    }
                    else {
                        dateFieldData = res[i].Time.substring(6, 14).trim();
                    }

                    chartData.push({
                        date: dateFieldData,
                        read: res[i].Read,
                        write: res[i].Write,
                    });
                }
                var chart = AmCharts.makeChart("DiskReadWriteGraph", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": chartData,
                    "synchronizeGrid": true,
                    "valueAxes": [{
                        "id": "v1",
                        "axisColor": "#009E49",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "left"
                    }, {
                        "id": "v2",
                        "axisColor": "#7FBA00",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "right"
                    }],
                    "graphs": [{
                        "valueAxis": "v1",
                        "lineColor": "#009E49",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "DISK READ BYTES",
                        "valueField": "read",
                        "fillAlphas": 0
                    }, {
                        "valueAxis": "v2",
                        "lineColor": "#7FBA00",
                        "bullet": "square",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "DISK WRITE BYTES",
                        "valueField": "write",
                        "fillAlphas": 0
                    }],
                    "chartScrollbar": {
                        "scrollbarHeight": 1,
                        "backgroundAlpha": 0.1,
                        "backgroundColor": "#868686",
                        "selectedBackgroundColor": "#CDCDCD",
                        "selectedBackgroundAlpha": 1
                    },
                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true
                    },
                    "categoryField": "date",
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });

                chart.addListener("dataUpdated", zoomChart);
                zoomChart();

                function zoomChart() {
                    if (chart.zoomToIndexes) {
                        chart.zoomToIndexes(0, chartData.length - 1);
                    }
                    setTimeout(function () {
                        $("a[title='JavaScript charts']").hide();
                    }, 2000);
                }
            },
            error: function (error) {

            }
        });
    }
    function ReadNetworkInOut(VM, fromDate, toDate) {
        fromDate = fromDate.replace(" ", "_");
        fromDate = fromDate.replace(":", "!");
        toDate = toDate.replace(" ", "_");
        toDate = toDate.replace(":", "!");

        var url = data.ApiUrl + "/admin/GetDiagnosticData/" + VM + "/" + fromDate + "/" + toDate + "/NETWORK";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () {
                $("#NetworkInOutGraph").hide();
                $("#NetworkInOutGraphSpinner").show();
            },
            complete: function () {
                $("#NetworkInOutGraph").show();
                $("#NetworkInOutGraphSpinner").hide();
                $("a[title='JavaScript charts']").hide();
            },
            success: function (res) {
                var chartData = [];
                for (var i = 0; i < res.length; i++) {
                    var dateFieldData = "";
                    if ($("#networkInOutBtn").attr("search") != "past hour" && $("#networkInOutBtn").attr("search") != "today") {
                        dateFieldData = res[i].Time.substring(0, 6).trim();
                    }
                    else {
                        dateFieldData = res[i].Time.substring(6, 14).trim();
                    }
                    chartData.push({
                        date: dateFieldData,
                        indata: res[i].In,
                        outdata: res[i].Out,
                    });
                }
                var chart = AmCharts.makeChart("NetworkInOutGraph", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": chartData,
                    "synchronizeGrid": true,
                    "valueAxes": [{
                        "id": "v1",
                        "axisColor": "#FFB900",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "left"
                    }, {
                        "id": "v2",
                        "axisColor": "#DD5900",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "right"
                    }],
                    "graphs": [{
                        "valueAxis": "v1",
                        "lineColor": "#FFB900",
                        "bullet": "round",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "NETWORK IN",
                        "valueField": "indata",
                        "fillAlphas": 0
                    }, {
                        "valueAxis": "v2",
                        "lineColor": "#DD5900",
                        "bullet": "square",
                        "bulletBorderThickness": 1,
                        "hideBulletsCount": 30,
                        "title": "NETWORK OUT",
                        "valueField": "outdata",
                        "fillAlphas": 0
                    }],
                    "chartScrollbar": {
                        "scrollbarHeight": 1,
                        "backgroundAlpha": 0.1,
                        "backgroundColor": "#868686",
                        "selectedBackgroundColor": "#CDCDCD",
                        "selectedBackgroundAlpha": 1
                    },
                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true
                    },
                    "categoryField": "date",
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                });
                chart.addListener("dataUpdated", zoomChart);
                zoomChart();



                function zoomChart() {
                    if (chart.zoomToIndexes) {
                        chart.zoomToIndexes(0, chartData.length - 1);
                    }
                    //setTimeout(function () {
                    //    $("a[title='JavaScript charts']").hide();
                    //}, 2000);
                }
            },
            error: function (error) {

            }
        });


    }

    $("#collectionmonitor").click(function () {
        $("#settingsccrlosebtn").trigger("click");
        $("#addDivCloseBlade").trigger("click");
        $("#closeIconappUsersTileBlade").trigger("click");
        $("#closeIconappGroupTileBlade").trigger("click");
        $("#activesessionCloseBlade").trigger("click");
        $("#ServersCloseBlade").trigger("click");
        $("#divCollectionMonitor").show();
        $("#CollectionMonitorHeader").text("Monitor - " + $("#selectedCollectionName").text());
        $("#CollectionMonitorSpinner").show();
        $("#NoOfActiveSHS").hide();
        $("#collectionmonitor").addClass("activeDocBtn");
        ScrollToHorizontalEnd($("#divCollectionMonitor").width());
        AddBreadcrumb("Collection Monitor", "divCollectionMonitor", "appUser");

        var colname = $("#tblRDSCollection tbody tr[class='AppImageName'] .Name").text();
        var starttime = "";
        var endtime = "";

        // var chartData = generateChartData2();
        if ($("#editBtn").attr("search") == "past hour") {
            starttime = getPrevHourDateTime();
            endtime = getNowDateTime();
        }
        else if ($("#editBtn").attr("search") == "today") {
            starttime = getPrevDay();
            endtime = getNowDateTime();
        }
        else if ($("#editBtn").attr("search") == "past week") {
            starttime = getPastWeek();
            endtime = getNowDateTime();
        }
        else {
            starttime = formatCustomDate($("#datetimepickerFrom input").val());
            endtime = formatCustomDate($("#datetimepickerTo input").val());
        }
        starttime = starttime.replace(" ", "_");
        starttime = starttime.replace(":", "!");
        endtime = endtime.replace(" ", "_");
        endtime = endtime.replace(":", "!");
        var url = data.ApiUrl + "/admin/GetDiagnosticData/" + colname + "/" + starttime + "/" + endtime + "/COLLECTIONSHS";
        //var url = "https://azurerdsmanager.com/RDSManagerApiNew//admin/GetDiagnosticData/Human Resources/2017-2-9_10!0/2017-2-9_11!0/COLLECTIONSHS";
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            beforeSend: function () {
            },
            complete: function () {
                $("a[title='JavaScript charts']").hide();
            },
            success: function (res) {
                var chartData = [];
                for (var i = 0; i < res.length; i++) {
                    var dateFieldData = "";
                    if ($("#editBtn").attr("search") != "past hour" && $("#editBtn").attr("search") != "today") {
                        dateFieldData = res[i].Time.substring(0, 6).trim();
                    }
                    else {
                        dateFieldData = res[i].Time.substring(6, 14).trim();
                    }
                    chartData.push({
                        Time: dateFieldData,
                        ActiveSHS: res[i].ActiveSHS,
                        ActiveSessions: res[i].ActiveSessions
                    });
                }
                var chart = AmCharts.makeChart("NoOfActiveSHS", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "dataProvider": chartData,
                    "synchronizeGrid": true,
                    "valueAxes": [{
                        "id": "v1",
                        "axisColor": "#2E80AB",
                        "axisThickness": 2,
                        "axisAlpha": 1,
                        "position": "left",
                        "integersOnly": true
                    }],
                    "graphs": [{
                        "alphaField": "alpha",
                        "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "fillAlphas": 1,
                        "title": "Session Host Servers",
                        "type": "column",
                        "valueField": "ActiveSHS",
                        "dashLengthField": "dashLengthColumn"
                    }, {
                        "id": "graph2",
                        "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                        "bullet": "round",
                        "lineThickness": 3,
                        "bulletSize": 7,
                        "bulletBorderAlpha": 1,
                        "bulletColor": "#FFFFFF",
                        "useLineColorForBulletBorder": true,
                        "bulletBorderThickness": 1,
                        "fillAlphas": 0,
                        "lineAlpha": 1,
                        "title": "Sessions",
                        "valueField": "ActiveSessions",
                        "dashLengthField": "dashLengthLine"
                    }],
                    "chartScrollbar": {
                        "scrollbarHeight": 1,
                        "backgroundAlpha": 0.1,
                        "backgroundColor": "#868686",
                        "selectedBackgroundColor": "#CDCDCD",
                        "selectedBackgroundAlpha": 1
                    },
                    "chartCursor": {
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true
                    },
                    "categoryField": "Time",
                    "export": {
                        "enabled": true,
                        "position": "bottom-right"
                    }
                    //"type": "serial",
                    //"addClassNames": true,
                    //"theme": "light",
                    //"autoMargins": false,
                    //"marginLeft": 30,
                    //"marginRight": 8,
                    //"marginTop": 10,
                    //"marginBottom": 26,
                    //"balloon": {
                    //    "adjustBorderColor": false,
                    //    "horizontalPadding": 10,
                    //    "verticalPadding": 8,
                    //    "color": "#ffffff"
                    //},

                    //"dataProvider": chartData,
                    //"valueAxes": [{
                    //    "axisAlpha": 0,
                    //    "position": "left",
                    //    "integersOnly": true
                    //}],
                    //"startDuration": 1,
                    //"graphs": [{
                    //    "alphaField": "alpha",
                    //    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    //    "fillAlphas": 1,
                    //    "title": "SHS",
                    //    "type": "column",
                    //    "valueField": "ActiveSHS",
                    //    "dashLengthField": "dashLengthColumn"
                    //}, {
                    //    "id": "graph2",
                    //    "balloonText": "<span style='font-size:12px;'>[[title]] in [[category]]:<br><span style='font-size:20px;'>[[value]]</span> [[additional]]</span>",
                    //    "bullet": "round",
                    //    "lineThickness": 3,
                    //    "bulletSize": 7,
                    //    "bulletBorderAlpha": 1,
                    //    "bulletColor": "#FFFFFF",
                    //    "useLineColorForBulletBorder": true,
                    //    "bulletBorderThickness": 3,
                    //    "fillAlphas": 0,
                    //    "lineAlpha": 1,
                    //    "title": "Sessions",
                    //    "valueField": "ActiveSessions",
                    //    "dashLengthField": "dashLengthLine"
                    //}],
                    //"chartScrollbar": {
                    //    "scrollbarHeight": 5,
                    //    "backgroundAlpha": 0.1,
                    //    "backgroundColor": "#868686",
                    //    "selectedBackgroundColor": "#67b7dc",
                    //    "selectedBackgroundAlpha": 1
                    //},
                    //"categoryField": "Time",
                    //"categoryAxis": {
                    //    "gridPosition": "start",
                    //    "axisAlpha": 0,
                    //    "tickLength": 0
                    //},
                    //"export": {
                    //    "enabled": true
                    //}
                });
                $("#CollectionMonitorSpinner").hide();
                $("#NoOfActiveSHS").show();
                chart.addListener("dataUpdated", zoomChart);
                zoomChart();

                function zoomChart() {
                    if (chart.zoomToIndexes) {
                        chart.zoomToIndexes(0, chartData.length - 1);
                    }
                    setTimeout(function () {
                        $("a[title='JavaScript charts']").hide();
                    }, 2000);
                }
            },
            error: function (error) {

            }
        });
    });

    $("#CollectionMonitorCloseBlade").click(function () {
        $("#min_divCollectionMonitor").hide();
        $("#divCollectionMonitor").hide();
        $("#collectionmonitor").removeClass("activeDocBtn");
        //$("#EditChartContainer").hide();
        $("#EditChartClose").trigger("click");
        RemoveBreadcrumb("divCollectionMonitor");
    });

    $("#SHSMonitorCloseBlade").click(function () {
        $("#min_divSHSMonitor").hide();
        $("#divSHSMonitor").hide();
        $("#menuMonitorSHS").removeClass("activeDocBtn");
        $("#EditChartClose").trigger("click");
        //$("#EditChartContainer").hide();
        RemoveBreadcrumb("serversshow");
    });
    $(".maxclass").click(function () {
        var isMax = $(this).attr("is-maxmimized");
        var cont_id = $(this).attr("id");
        cont_id = cont_id.split('_')[1];
        if (isMax == "no") {
            var screenWidth = $(window).width();
            $("#" + cont_id).css('width', screenWidth);
            $(this).attr("is-maxmimized", "yes");
            $("img", this).attr("src", "" + data.loginRedirect + "/Content/Images/minmax.png");
        }
        else {
            $("#" + cont_id).css('width', $("#" + cont_id).css("min-width"));
            $(this).attr("is-maxmimized", "no");
            $("img", this).attr("src", "" + data.loginRedirect + "/Content/Images/maximize.png");
        }
        NavigateToBlade(cont_id);
    })
    $(".minclass").click(function () {
        var cont_id = $(this).attr("id");
        cont_id = cont_id.split('_')[1];
        $("#" + cont_id).hide();
        $("#min_" + cont_id).show();
        var txt = $(this).parent().next().find("h4").html();
        $("#min_" + cont_id + " label").text(txt);
    });
    $(".minimizeWindow").click(function () {
        var cont_id = $(this).attr("id");
        cont_id = cont_id.split('_')[1];
        $("#" + cont_id).show();
        $(this).hide();
        NavigateToBlade(cont_id);
    });


    var viewModel = {
        apps_tab1: data.apps_tab1,
        apps_tab2: data.apps_tab2,
        wantsSpam: ko.observable(),
        wantSpam: ko.observable(),

        appsTable: data.appsTable,
        year: data.year,
        selectedYear: data.selectedYear,
        month: data.month,
        yearSelect: data.yearSelect,
        monthSelect: data.monthSelect,
        apps_images_tab1: data.apps_images_tab1,
        apps_images_tab2: data.apps_images_tab2,
        appsuserlist: data.appsuserlist,
        publishers1: ko.observable(data.publishers1),
        publishers2: ko.observable(data.publishers2),
        session1: ko.observable(data.session1),
        active1: ko.observable(data.active1),
        users: ko.observable(data.users),
        publishers3: ko.observable(data.publishers3),
        session2: ko.observable(data.session2),
        active2: ko.observable(data.active2),
        resourcegroup: ko.observable(data.resourcegroup),
        activestatus: ko.observable(data.activestatus),
        location: ko.observable(data.location),
        subscriptionname: ko.observable(data.subscriptionname),
        subscriptionid: ko.observable(data.subscriptionid),
        clienturl: ko.observable(data.clienturl),
        appsimages: ko.observable(data.appsimages),
        user: data.user,
    };

    var selectedItems;
    viewModel.selectiontab = function () {
        selectedItems = this.email;
        $("#selectedUserName").text(selectedItems);
    };
    var selectedImages;
    viewModel.selectedimagestab = function () {
        selectedImages = this.appimages;
    }
    //selectbutton for table2
    viewModel.selectedimagestab2 = function () {
        selectedImages = this.appimages;
    }

    viewModel.wantsSpam.subscribe(function (val) {
        if (val) {
            viewModel.wantSpam(false);
        }
        else {
        }
    })

    viewModel.wantSpam.subscribe(function (val) {
        if (val) {
            viewModel.wantsSpam(false);
        }
        else {

        }
    })
    // viewModel.user = data.user;

    viewModel.showSelectedoption = function () {
        var selected = [];
        $('#findcheckedElements input:checked').each(function () {
            $("#selecteduser").text(this.name);
        });
    }
    ko.applyBindings(viewModel, document.getElementById('appUser'));


    //selected users existing script start
    var vwModel = {
    };
    vwModel.items = data.items;

    vwModel.AppUsers = ko.observable('');

    vwModel.searchResults = ko.computed(function () {
        var q = vwModel.AppUsers();
        return vwModel.items.filter(function (i) {
            return i.Name.toLowerCase().indexOf(q) >= 0;
        });
    });
    vwModel.items2 = data.items2;
    vwModel.actUsers = ko.observable('');
    vwModel.searchResults2 = ko.computed(function () {
        var r = vwModel.actUsers();
        return vwModel.items2.filter(function (j) {
            return j.Name.toLowerCase().indexOf(r) >= 0;
        });
    });

    //selected users existing script end

    // selected users newly added script start
    vwModel.selectedItem = ko.observable(-1);
    vwModel.seletedItems = ko.observableArray();
    vwModel.selectedNames = ko.observableArray();
    vwModel.selectedUserss = ko.observableArray();

    vwModel.removeProduct = function (data) {
        vwModel.selectedItem(data);
        vwModel.seletedItems.push(data);
        $("#usersselected").show();
        if (vwModel.selectedNames() != vwModel.selectedItem().Id) {
            vwModel.selectedNames.push(data.Id);
            vwModel.selectedUserss.push(data);
            var selsearchres2 = ko.observableArray();
        }
    }

    vwModel.selectedUsersdisply = ko.observableArray();
    vwModel.selectedUserClick = function (val) {
        var self = this;
        vwModel.selectedUsersdisply.push(val.selectedUserss);
    }
    //selected users end

    vwModel.UserselectionClick = function (val) {

        if (vwModel.seletedItems() == "") {
            return false;
        }
        else {
            //getting seleted values
            var aadUserValue = vwModel.selectedItem().Name;   //vwModel.seletedItems

            //storing selected values in localstorage
            localStorage.setItem("AADUser", aadUserValue);
            $("#aaadu").hide();
            $("#su").hide();
        }
    }

    ko.applyBindings(platformImagesViewModel, document.getElementById('appPlatformImagesDiv'));
    ko.applyBindings(vwModel, document.getElementById('appscontent'));

    //RDSH SErvers count
    $.ajax({
        url: data.ApiUrl + "admin/GetServer/" + data.ConnectionBroker + "/" + data.role + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#creeateCollectionSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            var appCount = res.length;
            if (appCount == 0) {
                $("#noServer").show();
            }

        },

        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load RDSH Server count", error);
            console.log("ERROR:", error);
        },
        complete: function () {
            $("#creeateCollectionSpinner").hide();
        },
    });

    //App Users count

    $.ajax({
        url: data.ApiUrl + "subscriptions/GetADUser/" + data.ApiSubscriptionId + "/" + Deployname + "/",
        type: "GET",
        crossDomain: true,
        dataType: "json",
        beforeSend: function () {
            $("#creeateCollectionSpinner").show();
            $("#BlockUIWithoutSpinner").show();
        },
        success: function (res) {
            if (JSON.stringify(viewModelAppUsersScreen7.appUsersScreen7) != JSON.stringify(res)) {
                var appusers = res.length;
                if (appusers == 0) {
                    $("#noUser").show();
                }
            }
        },
        complete: function () {
            $("#creeateCollectionSpinner").hide();
        },
        error: function (error) {
            LogError(data.ApiSubscriptionId, "Load App User count", error);
            console.log("ERROR:", error);
        }
    });

    //logoffalluserbtn


});

//Accordion Menu
function showChevron(e) {
    var index = 0;
    $("div.panel-collapse").each(function (e, y) {
        if ($(this).hasClass("in")) {
            index = e;
        }
    });
    $("ul.list-group li").each(function (e, y) {
        if (e === index) {
            $(this).addClass("hghlight");
        }
        if (index === $("ul.list-group li").length - 1) {
            if (!$("ul.list-group li").hasClass("hghlight"))
                $("ul.list-group li:last").addClass("hghlight");
        }
    }); index = 0;
    $(e.target)
       .prev('.panel-heading')
       .find("i.indicator")
       .toggleClass('glyphicon-chevron-up glyphicon-chevron-up');
}
function hideChevron(e) {
    $("ul.list-group li").removeClass("hghlight");
    $(e.target)
       .prev('.panel-heading')
       .find("i.indicator")
       .toggleClass('glyphicon-chevron-down glyphicon-chevron-down');
}
function toggle_caret(curID) {

    if ($(curID).hasClass('glyphicon-chevron-up')) {
        $("#caret1,#caret2,#caret3").removeClass("glyphicon-chevron-up");
        $("#caret1,#caret2,#caret3").addClass("glyphicon-chevron-down");

        $(curID).removeClass("glyphicon-chevron-up");
        $(curID).addClass("glyphicon-chevron-down");
    }
    else {
        $("#caret1,#caret2,#caret3").removeClass("glyphicon-chevron-up");
        $("#caret1,#caret2,#caret3").addClass("glyphicon-chevron-down");
        $(curID).removeClass("glyphicon-chevron-down");
        $(curID).addClass("glyphicon-chevron-up");
    }
}

$(function () {
    $('#accordion').on('hidden.bs.collapse', hideChevron);
    $('#accordion').on('shown.bs.collapse', showChevron);
    $('#accordion .panel-heading:eq("0")').trigger("click");
});
$(document).on("click", "input.clsbtnnxt", function (e) {
    var nextPanel = $(this).parents("div.panel-info").next("div.panel-info");
    $(nextPanel).find("div.panel-heading").trigger("click");
});
$(document).on("click", "input.clsbtnprv", function (e) {
    var prevPanel = $(this).parents("div.panel-info").prev("div.panel-info");
    $(prevPanel).find("div.panel-heading").trigger("click");
});

//End

