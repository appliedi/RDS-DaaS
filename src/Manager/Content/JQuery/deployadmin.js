data.ApiUrl = localStorage.getItem("data_ApiUrl");
data.loginRedirect = localStorage.getItem("data_loginRedirect");
data.ConnectionBroker = localStorage.getItem("CB");

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

function LogError(subID, mtd, err) {
    $.post("ErrorLog", { subscriptionID: "" + subID + "", method: "" + mtd + "", error: "" + JSON.stringify(err) + "" }, function () { });
}
var RDSDeploymentArray = [];

$(document).ready(function () {
    if (localStorage.getItem("UserType").toLowerCase() != "tenantadmin") {
        var notifyUser = localStorage.getItem("Notification");
        if (notifyUser != "") {

            ShowInstantNotification("Progress", "Account Notification", notifyUser, "NotifyUser");
            ShowInstantNotification("Error", "Account Notification", notifyUser, "NotifyUser");
            $("#push_NotifyUser").css("cursor", "pointer");
            $("#ErrorAlert img").attr("src", "../Content/Images/infoIcon.png");
            $("#push_NotifyUser img").attr("src", "../Content/Images/infoIcon.png");

            $("#push_NotifyUser").mousemove(function () {
                $("#push_NotifyUser").css("color", "#2E80AB");
            });
            $("#push_NotifyUser").mouseleave(function () {
                $("#push_NotifyUser").css("color", "#000000");
            });
            $("#push_NotifyUser").click(function () {
                location.href = "UpdateLicense";
            });
            setTimeout(function () {
                $("#ErrorAlert img").attr("src", "../Content/Images/failed_icon.gif");
            }, 4000);
        }
    }
    $(this).bind("contextmenu", function (e) {
        e.preventDefault();
    });
    $(document).keydown(function (event) {
        if (event.keyCode == 123) {
            return false;
        }
        else if (event.ctrlKey && event.shiftKey && event.keyCode == 73) {
            return false;
        }
    });
    $(document).on("contextmenu", function (e) {
        e.preventDefault();
    });
    // scale validations
    $("#scaleName,#scalePassword,#scaleAzureSubscriptionName,#scaleresourceGroupName").keyup(function () {
        var curVal = $(this).val();
        var txtThisID = $(this).attr("id");
        if (curVal == "") {
            $("#errorscalemessage").show();

        }
        else {
            $("#Exc_" + txtThisID + "").hide();
            $("#scaleAzureSubscriptionNameMinLength").hide();
            $("#" + txtThisID + "").removeClass("redborder");
        }
    });

    $("#servername,#databaseNm,#userId,#dbpassword").keyup(function () {
        var curVal = $(this).val();
        var txtThisID = $(this).attr("id");
        if (curVal != "") {
            $("#Exc_" + txtThisID + "").hide();
            $("#" + txtThisID + "").removeClass("redborder");
        }
        if (($("#servername").val() != "") && ($("#databaseNm").val() != "") && ($("#userId").val() != "") && ($("#dbpassword").val() != "")) {
            $("#ErrormessagedatabaseConfigBlade").hide();
        }
        else {
            $("#ErrormessagedatabaseConfigBlade").show();
        }

    });

    //scalemessage keyup function
    $("#scaleName,#scalePassword,#scaleAzureSubscriptionName,#scaleresourceGroupName").keyup(function () {
        if (($("#scaleName").val() != "") && ($("#scalePassword").val() != "") && ($("#scaleAzureSubscriptionName").val() != "") && ($("#scaleresourceGroupName").val() != "")) {
            $("#errorscalemessage").hide();
        }
        else {
            $("#errorscalemessage").show();
        }

    });
    //Filter code
    $("input[filter=txtRDSDeployment]").keyup(function () {
        var curVal = $(this).val();
        filterRDSDeployment(curVal);
    });

    $("#ImportSHSDeployeAdmin").click(function () {
        if ($("#RDServerSpinnerDeployAdmin").is(":visible") == false) {
            AddBreadcrumb("Import Session Host Server", "divImportSHS", "dplyserversshow");
            $("#deployserversadd").hide();
            $("#min_divImportSHS").hide();
            $("#divImportSHS").show();
            $("#min_deployserversadd").hide();
            $("#serverlistselectidDeployAdmin tbody tr").removeClass("AppImageName");
            $("#AddRDServerClickDeployeAdmin").removeClass("activeDocBtn");
            $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
            $("#enablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#disablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#ImportSHSDeployeAdmin").addClass("activeDocBtn");

            $("#btnokImportSHS").attr("disabled", true);
            $("#fileUserdeployadmin").val('');
            $("#imported_SHS tbody").html('');
            $("#imported_SHS tbody").append("<tr my-id=\"exist\"><td>No Session Host Server to display</td></tr>");
            ScrollToHorizontalEndDeployAdmin(300);
        }
    });

    $("#fileUserdeployadmin").change(function () {
        if ($(this).val().trim() != "") {
            $("#btnokImportSHS").attr("disabled", false);
        }
        else {
            $("#imported_SHS tbody").html('');
            $("#imported_SHS tbody").append("<tr my-id=\"exist\"><td>No Session Host Server to display</td></tr>");
            $("#btnokImportSHS").attr("disabled", true);
        }
    });
    var fileInputCSV = document.getElementById('fileUserdeployadmin');
    fileInputCSV.addEventListener('change', function (e) {

        // parse as CSV
        var file = e.target.files[0];
        var csvParser = new SimpleExcel.Parser.CSV();
        csvParser.setDelimiter(',');
        csvParser.loadFile(file, function () {
            // draw HTML table based on sheet data
            var sheet = csvParser.getSheet();
            $("#imported_SHS tbody").html('');
            //var table = document.getElementById('imported_users_body');
            sheet.forEach(function (el, i) {

                //var row = document.createElement('tr');
                var IsAvail = 0;
                var dynCell = "";
                var cellVal = "";
                el.forEach(function (el, i) {
                    dynCell = "<td>";
                    //var cell = document.createElement('td');
                    //cell.innerHTML = el.value;
                    $("#serverlistselectidDeployAdmin tr").each(function () {
                        var strAlreadyUser = $(this).text().trim();
                        if (el.value.toLowerCase() == strAlreadyUser.trim().toLowerCase()) {
                            IsAvail++;
                        }
                    });
                    cellVal = el.value;
                    dynCell += cellVal;
                    dynCell += "</td>";
                    //dynRow.appendChild(dynCell);
                });
                var dynRow = "<tr>";
                if (IsAvail > 0) {
                    dynRow = "<tr style=\"color:red;\" my-id=\"exist\">";
                }
                dynRow += dynCell;
                dynRow += "</tr>";
                if (cellVal.trim() != "") {
                    $("#imported_SHS_body").append(dynRow);
                }
                //table.appendChild(dynRow);
            });
            $("#imported_SHS_body tr").each(function () {
                var val_one = $(this).children("td:first").text().trim();
                var isDuplicate = 0;
                $("#imported_SHS_body tr").each(function () {
                    var val_two = $(this).children("td:first").text().trim();
                    if (val_one == val_two) {
                        isDuplicate++;
                    }
                });
                if (isDuplicate > 1) {
                    $(this).remove();
                }
            });
            $("#imported_SHS_body tr[my-id!='exist']").click(function () {
                if ($(this).hasClass("AppImageName")) {
                    $(this).removeClass('AppImageName');
                }
                else {
                    $(this).addClass('AppImageName');
                }
                if ($("#imported_SHS tbody tr[class='AppImageName']").length > 0) {
                    $("#btnokImportSHSSelected").attr("disabled", false);
                }
                else {
                    $("#btnokImportSHSSelected").attr("disabled", true);
                }
            });
        });
    });

    $("#CBIshow").click(function () {
        $("#closeIconazuredetails").trigger("click");
        $("#min_deploymentdetails").hide();
        $("span[id^='Con_']").hide();
        $("#errormesgcreatedplymnt").hide();
        $("#deploymentdetails").show();
        $("#azuredetails").hide();
        $("#CBIshow").addClass("AppImageName");
        $("#createiclass").addClass("activeDocBtn");
        AddBreadcrumb("Connection Broker Information", "deploymentdetails", "createdplymnt");
    });

    $("#closeIconDeploymentdetails").click(function () {
        $("#deploymentdetails").hide();
        RemoveBreadcrumb("createdplymnt");
        $("#CBIshow").removeClass("AppImageName");
        $("#min_deploymentdetails").hide();
    });

    var isfilledcbinfo = false;
    $("#btnokcbinfo").click(function () {
        isfilledcbinfo = true;
        if ($("#rdcbFQDN").val().trim() != "" && $("#fndNameDeployment").val().trim() != "" && $("#descDeoployment").val().trim() != "") {

            var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z0-9]{2,})$");
            var result = pattern.test($("#rdcbFQDN").val().trim());
            if (result == false) {
                isfilledcbinfo = false;
                var txtThisID = "rdcbFQDN";
                $("#Con_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#errormesgcreatedplymnt").show();
                isfilledcbinfo = false;
                $("#cbntick").hide();
                $("#createcbnarrow").show();
                $("#deploymentdetails").show();
            }
        }
        else {
            $("#CreateFormelementscb input[type='text'],#CreateFormelementscb input[type='password']").each(function () {
                var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z0-9]{2,})$");
                var result = pattern.test($("#rdcbFQDN").val().trim());
                if (result == false) {
                    isfilledcbinfo = false;
                    var txtThisID = "rdcbFQDN";
                    $("#Con_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#errormesgcreatedplymnt").show();
                    isfilledcbinfo = false;
                    $("#cbntick").hide();
                    $("#createcbnarrow").show();
                    $("#deploymentdetails").show();
                }

                var curVal = $(this).val();
                if (curVal == "") {
                    var txtThisID = $(this).attr("id");
                    $("#Con_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#errormesgcreatedplymnt").show();
                    isfilledcbinfo = false;
                    $("#cbntick").hide();
                    $("#createcbnarrow").show();
                    $("#deploymentdetails").show();
                }
            });
        }

        if (isfilledcbinfo) {
            $("#cbntick").show();
            $("#createcbnarrow").hide();
            $("span[id^='Con_']").hide();
            $("#errormesgcreatedplymnt").hide();
            $("#deploymentdetails").hide();
            isfilledcbinfo = true;
        }
    });

    $("#ACshow").click(function () {
        $("#closeIconDeploymentdetails").trigger("click");
        AddBreadcrumb("Azure Credentials", "azuredetails", "createdplymnt")
        $("#ACshow").addClass("AppImageName");
        $("#min_azuredetails").hide();
        $("span[id^='Conn_'] ").hide();
        $("#errormesageac").hide();
        $("#AzreSubIDMinLength").hide();
        $("#azuredetails").show();
        $("#createiclass").addClass("activeDocBtn");
    });
    $("#closeIconazuredetails").click(function () {
        RemoveBreadcrumb("createdplymnt");
        $("#azuredetails").hide();
        $("#ACshow").removeClass("AppImageName");
        $("#min_azuredetails").hide();
    });
    var isfilledazinfo = true;
    $("#btnokazinfo").click(function () {
        isfilledazinfo = true;
        if ($("#AzreLgnName").val().trim() != "" && $("#AzrPassword").val().trim() != "" && $("#AzreSubID").val().trim() != "" && $("#AzreResrceGrp").val().trim() != "") {
            var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
            var result = pattern.test($("#AzreLgnName").val().trim());
            if (result == false) {
                isfilledazinfo = false;
                var txtThisID = "AzreLgnName";
                $("#Conn_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#errormesageac").show();
                $("#aztick").hide();
                $("#createazarrow").show();
                $("#azuredetails").show();
            }

            var value = $("#AzreResrceGrp").val().trim();
            if (value.substr(-1) == ".") {
                isfilledazinfo = false;
                var txtThisID = "AzreResrceGrp";
                $("#Conn_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#aztick").hide();
                $("#createazarrow").show();
                $("#errormesageac").show();
                $("#azuredetails").show();
            }

            var AzreSubIDLength = $("#AzreSubID").val().length;
            if (AzreSubIDLength < 36) {
                isfilledazinfo = false;
                var txtThisID = "AzreSubID";
                if ($("#AzreSubID").val().length == 0)
                {
                    $("#Conn_" + txtThisID + "").show();
                    $("#AzreSubIDMinLength").hide();
                }
                else {
                    $("#Conn_" + txtThisID + "").hide();
                    $("#AzreSubIDMinLength").show();
                }

                //$("#Conn_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#aztick").hide();
                $("#createazarrow").show();
                $("#errormesageac").show();
                $("#azuredetails").show();
            }
        }
        else {
            $("#CreateFormelementsac input[type='text'],#CreateFormelementsac input[type='password']").each(function () {
                var curVal = $(this).val();
                if (curVal == "") {
                    var txtThisID = $(this).attr("id");
                    $("#AzreSubIDMinLength").hide();
                    $("#Conn_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#errormesageac").show();
                    $("#azuredetails").show();
                    isfilledazinfo = false;
                }
                var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
                var result = pattern.test($("#AzreLgnName").val().trim());
                if (result == false) {
                    isfilledazinfo = false;
                    var txtThisID = "AzreLgnName";
                    $("#Conn_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#errormesageac").show();
                    $("#azuredetails").show();
                }
                var value = $("#AzreResrceGrp").val().trim();
                if (value.substr(-1) == ".") {
                    isfilledazinfo = false;
                    var txtThisID = "AzreResrceGrp";
                    $("#Conn_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    $("#errormesageac").show();
                    $("#azuredetails").show();
                }
            });
        }

        if (isfilledazinfo) {
            $("#aztick").show();
            $("#createazarrow").hide();
            $("span[id^='Conn_']").hide();
            $("#errormesageac").hide();
            $("#azuredetails").hide();
            isfilledazinfo = true;
        }
    });


    $("#btnokImportSHS,#btnokImportSHSSelected").click(function () {

        var groupSHS = "";
        var buttonClicked = 0;
        if ($(this).attr("id") == "btnokImportSHS") {
            buttonClicked = 1;
            $("#imported_SHS tbody tr[my-id!='exist']").each(function () {
                if ($(this).children("td:first").text().trim() != "") {
                    groupSHS += $(this).children("td:first").text().trim() + ",";
                }
            });
        }
        else if ($(this).attr("id") == "btnokImportSHSSelected") {
            if ($("#imported_SHS tbody tr[class='AppImageName']").length > 0) {
                $("#imported_SHS tbody tr[class='AppImageName']").each(function () {
                    if ($(this).children("td:first").text().trim() != "") {
                        groupSHS += $(this).children("td:first").text().trim() + ",";
                    }
                });
            }
        }
        if (groupSHS != "") {
            groupSHS = groupSHS.substring(0, groupSHS.length - 1);

            var objCollection =
             { ServerDetails: { ConnectionBroker: connectionBrokerName, ServerNames: groupSHS } }
            var jsonData = JSON.stringify(objCollection);
            $("#RDServerSpinnerDeployAdmin").show();
            $.ajax({
                url: data.ApiUrl + "admin/AddServers/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {

                    ShowInstantNotification("Progress", "Importing RD VM from csv file...", "", "addSHS");

                },

                success: function (res) {
                    $("#closeIconImportSHS").trigger("click");
                    shsCount = groupSHS.split(',');
                    var strPrevvmServerCount = $("#vmServerCount").text().trim();
                    strPrevvmServerCount = (parseInt(strPrevvmServerCount) + parseInt(shsCount.length));
                    $("#vmServerCount").text(strPrevvmServerCount);
                    $("#dplyservers").trigger("click");
                    ShowInstantNotification("Success", "Successfully imported SHS...", "Succesfully imported '" + shsCount.length + "' RD VM.", "addSHS");

                },

                complete: function () {
                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Import Session Host Server", error);
                    ShowInstantNotification("Error", "Failed importing SHS...", "'" + shsCount.length + "' RD VM failed importing from csv file.", "addSHS");
                }
            });
        }
        else {
            $("#noSHSToSelectModal").show();
        }
    });

    $("#closeIconImportSHS").click(function () {
        RemoveBreadcrumb("dplyserversshow");
        $("#divImportSHS").hide();
        $("#min_divImportSHS").hide();
        $("#AddRDServerClickDeployeAdmin").removeClass("activeDocBtn");
        $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
        $("#enablerdserverDeployeAdmin").removeClass("activeDocBtn");
        $("#disablerdserverDeployeAdmin").removeClass("activeDocBtn");
        $("#ImportSHSDeployeAdmin").removeClass("activeDocBtn");
        $("#fileUserdeployadmin").val('');
        $("#imported_SHS tbody").html('');
        $("#imported_SHS tbody").append("<tr my-id=\"exist\"><td>No Session Host Server to display</td></tr>");
        $("#btnokImportSHS, #btnokImportSHSSelected").attr("disabled", true);
    });

    $("#publishDesktopApps").click(function () {
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
                $("#createspinner").show();
            },
            success: function (res) {
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Publish Desktop apps", error);
            }
        });

    });


    //LoadSessionHostServersCloseButtonError.onclick = function () {
    //    LoadSessionHostServersModalError.style.display = "none";
    //}

    $("#fnameValidation").hide();
    $("#descDeployValidation").hide();
    $("#friendlynameValidation").hide();
    $("#deployserversadd").hide();
    $("#auditlogsid").hide();
    $("#databaseConfigBlade").hide();

    ////Rename Modal
    //var renamemodal = document.getElementById('renameModal');
    //var renamespan = document.getElementById("renameSpan");
    //renamespan.onclick = function () {
    //    renamemodal.style.display = "none";
    //}
    //
    ////Load Filure
    //var loadfailuremodal = document.getElementById('loadfailureModal');
    //var loadfailurespan = document.getElementById("loadfailureSpan");
    //loadfailurespan.onclick = function () {
    //    loadfailuremodal.style.display = "none";
    //}
    //
    ////Create Success
    //var createSuccessmodal = document.getElementById('createSuccessModal');
    //var createSuccessspan = document.getElementById("createSuccessSpan");
    //createSuccessspan.onclick = function () {
    //    createSuccessmodal.style.display = "none";
    //}
    //
    ////Create Fail
    //var createfailmodal = document.getElementById('createFailModal');
    //var createfailspan = document.getElementById("createFailSpan");
    //createfailspan.onclick = function () {
    //    createfailmodal.style.display = "none";
    //}
    //
    ////rename Success
    //var renameSuccessmodal = document.getElementById('renameSuccessModal');
    //var renameSuccessspan = document.getElementById("renameSuccessSpan");
    //renameSuccessspan.onclick = function () {
    //    renameSuccessmodal.style.display = "none";
    //}
    //
    ////Remove Modal
    //var removemodal = document.getElementById('removeModal');
    //var removespan = document.getElementById("removeSpan");
    //removespan.onclick = function () {
    //    removemodal.style.display = "none";
    //}
    //
    ////Remove Success
    //var removeSuccessmodal = document.getElementById('removeSuccessModal');
    //var removeSuccessspan = document.getElementById("removeSuccessSpan");
    //removeSuccessspan.onclick = function () {
    //    removeSuccessmodal.style.display = "none";
    //}
    //
    ////Remove Server Confirmation Failure
    //var serverRemoveConfirmationModal = document.getElementById('removeServerConfirmationModal');
    ////deleteCollectionFailureCloseButton = document.getElementById("deleteCollectionFailureCloseButton");
    //
    //removeServerConfirmationNo.onclick = function () {
    //    serverRemoveConfirmationModal.style.display = "none";
    //}
    //
    //// Remove Server Select Modal  ***********************************************************************************
    //var removserverselectmodal = document.getElementById('removeServerSelectionModal');
    //var removeserverselectbtn = document.getElementById("removeServerSelectionButton");
    //removeserverselectbtn.onclick = function () {
    //    removserverselectmodal.style.display = "none";
    //}
    //
    //// Remove Server Fail
    //var scalesavefailmodal = document.getElementById('scaleSaveFailureModal');
    //var scalesavefailbtn = document.getElementById("scaleSaveFailureButton");
    //scalesavefailbtn.onclick = function () {
    //    scalesavefailmodal.style.display = "none";
    //}
    //noSHSToSelectModalCloseButton.onclick = function () {
    //    noSHSToSelectModal.style.display = "none";
    //}
    //// Remove Server Success
    //var scalesavesuccessmodal = document.getElementById('scaleSaveSuccessModal');
    //var scalesavesuccessbtn = document.getElementById("scaleSaveSuccessButton");
    //scalesavesuccessbtn.onclick = function () {
    //    scalesavesuccessmodal.style.display = "none";
    //}
    //
    ////Scale Save Fail
    //var removefailmodal = document.getElementById('removeServerFailureModal');
    //var removefailbtn = document.getElementById("removeRDServerFailureButton");
    //removefailbtn.onclick = function () {
    //    removefailmodal.style.display = "none";
    //}
    //
    //// Remove Server Success
    //var removeserversuccessmodal = document.getElementById('removeServerSuccessModal');
    //var removeserversuccessbtn = document.getElementById("removeRDServerSuccessButton");
    //removeserversuccessbtn.onclick = function () {
    //    removeserversuccessmodal.style.display = "none";
    //}
    //
    //// Enable Server Select Modal  ***********************************************************************************
    //var enableserverselectmodal = document.getElementById('enableServerSelectionModal');
    //var enableserverselectbtn = document.getElementById("enableServerSelectionButton");
    //enableserverselectbtn.onclick = function () {
    //    enableserverselectmodal.style.display = "none";
    //}
    //
    ////Enable Success Server
    //var enableServerModal = document.getElementById('enableServerModal');
    //var enablesuccessbtn = document.getElementById("enableServerButton");
    //enablesuccessbtn.onclick = function () {
    //    enableServerModal.style.display = "none";
    //}
    //
    ////Enable Failure Modal
    //var enablefailmodal = document.getElementById('enableServerfailModal');
    //var enablefailbtn = document.getElementById("enableServerfailButton");
    //enablefailbtn.onclick = function () {
    //    enablefailmodal.style.display = "none";
    //}
    //
    //// Disable Server Select Modal  ***********************************************************************************
    //var disableserverselectmodal = document.getElementById('disableServerSelectionModal');
    //var disableserverselectbtn = document.getElementById("disableServerSelectionButton");
    //disableserverselectbtn.onclick = function () {
    //    disableserverselectmodal.style.display = "none";
    //}
    //
    ////Disable Success Server
    //var disableserverModal = document.getElementById('disableServerModal');
    //var disablesuccessbtn = document.getElementById("disableServerButton");
    //disablesuccessbtn.onclick = function () {
    //    disableserverModal.style.display = "none";
    //}
    //
    ////Disable Failure Modal
    //var disablefailmodal = document.getElementById('disableServerfailModal');
    //var disablefailbtn = document.getElementById("disableServerfailButton");
    //disablefailbtn.onclick = function () {
    //    disablefailmodal.style.display = "none";
    //}
    //
    ////ADD Server Success Modal
    //var addsuccessmodal = document.getElementById('addRDServerModal');
    //var addsuccessbtn = document.getElementById("addRDServerButton");
    //addsuccessbtn.onclick = function () {
    //    addsuccessmodal.style.display = "none";
    //}
    //
    ////ADD Server Success Modal
    //var addfailuremodal = document.getElementById('addRDServerFailureModal');
    //var addfailurebtn = document.getElementById("addRDServerFailureButton");
    //addfailurebtn.onclick = function () {
    //    addfailuremodal.style.display = "none";
    //}
    //
    //Remove Deployment Modal

    //var removeDeploymentConfirmationModal = document.getElementById('removeDeploymentConfirmationModal');

    removeDeploymentConfirmationNo.onclick = function () {
        removeDeploymentConfirmationModal.style.display = "none";
        $("#removeiclass").removeClass("activeDocBtn");
    }

    //Random String
    var randomString = function (length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    var rndmstring = randomString(10);
    localStorage.setItem("GenerateName", rndmstring);
    function filterRDSDeployment(curVal) {
        curVal = curVal.toLowerCase();
        $("#deploymentId tbody").html('');
        var res = RDSDeploymentArray;
        var isNotFound = 1;
        for (var i = 0; i < res.length; i++) {
            if (res[i].name.toLowerCase().indexOf(curVal) > -1 || res[i].FriendlyName.toLowerCase().indexOf(curVal) > -1) {
                $("#deploymentDiv .rowTemplate .Id").text(res[i].Id);
                $("#deploymentDiv .rowTemplate .name").text(res[i].name);
                $("#deploymentDiv .rowTemplate .FriendlyName").text(res[i].FriendlyName);
                var rowTemplate = $("#deploymentDiv .rowTemplate .dataRow tbody").html();
                $("#deploymentId tbody").append(rowTemplate);
                isNotFound = 0;
            }
        }
        if (isNotFound == 1) {
            var rowTemplate = $("#deploymentDiv .rowTemplate .blankRow tbody").html();
            $("#deploymentId tbody").append(rowTemplate);
        }
        else {
            $("#deploymentId tbody tr[class!=nodata]").unbind("click");
            $("#deploymentId tbody tr[class!=nodata]").click(function () {
                if ($(this).hasClass("AppImageName")) {
                    $("#dplydashboardCloseBlade").trigger("click");
                    $("#closeIconRenameDeployment").trigger("click");
                    $('#deploymentId tbody .rightArrIconDeployAdmin').hide();
                    $(this).removeClass('AppImageName');
                    $("#renameiclass").attr("disabled", false);
                    $("#removeiclass").attr("disabled", false);
                    $("#auditslogbtnDeployAdmin").attr("disabled", false);
                }
                else {
                    $("#dplydashboardCloseBlade").trigger("click");
                    $('#deploymentId tbody tr').removeClass('AppImageName');
                    $(this).addClass('AppImageName');
                    $('#deploymentId tbody .rightArrIconDeployAdmin').hide();
                    $('.rightArrIconDeployAdmin', this).show();
                    $("#renameiclass").attr("disabled", true);
                    $("#removeiclass").attr("disabled", true);
                    $("#auditslogbtnDeployAdmin").attr("disabled", true);
                    selectdplmnt($('.FriendlyName', this).text().trim(), $('.name', this).text().trim());
                }
            });
        }
    }
    //v ajax call
    LoadRDSDeployment();
    function LoadRDSDeployment() {
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetList/" + data.ApiSubscriptionId + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#deploymentName").show();
                $("#deploymentId tbody").html('');
                $("#createiclass").attr("disabled", true);
                $("#renameiclass").attr("disabled", true);
                $("#removeiclass").attr("disabled", true);
                $("#auditslogbtnDeployAdmin").attr("disabled", true);
            },
            success: function (res) {
                RDSDeploymentArray = [];
                $("#createiclass").attr("disabled", true);
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        RDSDeploymentArray.push({
                            Id: res[i].Id,
                            name: res[i].name,
                            FriendlyName: res[i].FriendlyName
                        });

                        $("#deploymentDiv .rowTemplate .Id").text(res[i].Id);
                        $("#deploymentDiv .rowTemplate .name").text(res[i].name);
                        $("#deploymentDiv .rowTemplate .FriendlyName").text(res[i].FriendlyName);
                        var rowTemplate = $("#deploymentDiv .rowTemplate .dataRow tbody").html();
                        $("#deploymentId tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#deploymentDiv .rowTemplate .blankRow tbody").html();
                    $("#deploymentId tbody").append(rowTemplate);
                }
                $("#deploymentId tbody tr[class!=nodata]").unbind("click");
                $("#deploymentId tbody tr[class!=nodata]").click(function () {
                    //if ($(this).hasClass("AppImageName")) {
                    //    $("#dplydashboardCloseBlade").trigger("click");
                    //    $('#deploymentId tbody .rightArrIconDeployAdmin').hide();
                    //    $(this).removeClass('AppImageName');
                    //    $("#renameiclass").css("disabled", true);
                    //    $("#removeiclass").css("disabled", true);
                    //}
                    //else {
                    //    $("#dplydashboardCloseBlade").trigger("click");
                    //    $('#deploymentId tbody tr').removeClass('AppImageName');
                    //    $(this).addClass('AppImageName');
                    //    $('#deploymentId tbody .rightArrIconDeployAdmin').hide();
                    //    $('.rightArrIconDeployAdmin', this).show();
                    //    $("#renameiclass").attr("disabled", false);
                    //    $("#removeiclass").attr("disabled", false);
                    //    selectdplmnt($('.FriendlyName', this).text().trim(), $('.name', this).text().trim());
                    //}
                    $("#dplydashboardCloseBlade").trigger("click");
                    $('#deploymentId tbody tr').removeClass('AppImageName');
                    $(this).addClass('AppImageName');
                    $('#deploymentId tbody .rightArrIconDeployAdmin').hide();
                    $('.rightArrIconDeployAdmin', this).show();
                    $("#renameiclass").attr("disabled", false);
                    $("#removeiclass").attr("disabled", false);
                    $("#auditslogbtnDeployAdmin").attr("disabled", false);
                    selectdplmnt($('.FriendlyName', this).text().trim(), $('.name', this).text().trim());
                });
                $("#createiclass").attr("disabled", false);
                $("#dplysettingsshow").attr("disabled", false);
            },
            complete: function () {
                $("#deploymentName").hide();
                $("#mainContainer").show();
                if (localStorage.getItem("UserType").toLowerCase() == "tenantadmin") {
                    $("#closeIconRDSCollectionBlade i").addClass("inactiveIcon");
                    $("#divRrdDeployment").hide();
                    $("#updatelicRedirection").hide();
                }
            },
            error: function (error) {
                console.log("ERROR:", error);
            }
        });
    }

    $(function () {
        $("img.copyTooltip").click(function () {
            if (this.parentNode.children[1].innerHTML === "") {
                makeSelection(this.parentNode.childNodes[1].children[0]);
            }
            else {
                makeSelection(this.parentNode.children[1]);
            }
            $("div.tooltip-inner:visible").text("Copied");
        });
        $("img.copyTooltip").mouseout(function () {
            if (window.getSelection) {
                window.getSelection().removeAllRanges();
            } else { }
        });
        $('.tooltiplink').tooltip();
    });

    $("div[my-class='copyLabel']").each(function () {
        $(this).mousemove(function () {
            $(".copyTooltip").hide();
            $("img", this).show().css('cursor', 'pointer');
        });
        $(this).mouseleave(function () {
            $(".copyTooltip").hide();
        });
    });

    var path;
    $('input[type=file]').change(function () {
        path = this.files[0];
        console.dir(this.files[0]);
    });
    //ajax call to post the scale data
    $("#scaleBtnSave").click(function () {
        var isValidatedscale = true;
        if (btnClickYesNo == true) {
            $("#scaleAzureSubscriptionNameMinLength").hide();
            $("span[id^='Exc_']").hide();
            $("#errorscalemessage").hide();

            $("#formelementsscale input[type='text'],#formelementsscale input[type='password']").each(function () {
                var curVal = $(this).val();
                if (curVal == "") {
                    var txtThisID = $(this).attr("id");
                    $("#scaleAzureSubscriptionNameMinLength").hide();
                    $("#Exc_" + txtThisID + "").show();
                    $("#" + txtThisID + "").addClass("redborder");
                    isValidatedscale = false;
                    if ($("#scaleAzureSubscriptionName").val().length == 0) {
                        $("#scaleAzureSubscriptionNameMinLength").hide();
                        $("#Exc_scaleAzureSubscriptionName").show();

                    }
                }
                else {

                    var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$");
                    var result = pattern.test($("#scaleName").val().trim());
                    if (result == false) {
                        isValidatedscale = false;
                        var txtThisID = "scaleName";
                        $("#Exc_" + txtThisID + "").show();
                        $("#" + txtThisID + "").addClass("redborder");
                        $("#errorscalemessage").show();
                    }

                    var value = $("#scaleresourceGroupName").val().trim();
                    if (value.substr(-1) == ".") {
                        isValidatedscale = false;
                        var txtThisID = "scaleresourceGroupName";
                        $("#Exc_" + txtThisID + "").show();
                        $("#" + txtThisID + "").addClass("redborder");
                        $("#errorscalemessage").show();
                    }

                    var AzreSubIDLength = $("#scaleAzureSubscriptionName").val().length;
                    if (AzreSubIDLength < 36) {
                        isValidatedscale = false;
                        var txtThisID = "scaleAzureSubscriptionName";
                        if ($("#scaleAzureSubscriptionName").val().length == 0)
                        {
                            $("#scaleAzureSubscriptionNameMinLength").hide();
                            $("#Exc_scaleAzureSubscriptionName").show();
                            
                        }
                        else {
                            $("#Exc_scaleAzureSubscriptionName").hide();
                            $("#scaleAzureSubscriptionNameMinLength").show();
                        }
                        
                        $("#Exc_" + txtThisID + "").show();
                        $("#" + txtThisID + "").addClass("redborder");
                        $("#errorscalemessage").show();
                    }
                }

            });

        }

        if (isValidatedscale == true) {
            var userName = $("#scaleName").val().trim();
            var password = $("#scalePassword").val().trim();
            var subscriptionName = $("#scaleAzureSubscriptionName").val().trim();
            var resourceGroupName = $("#scaleresourceGroupName").val().trim();
            var createddate = $("#scaleCreatedDate").text().trim();
            var lastmodifieddate = $("#scaleModifiedDate").text().trim();
            var dploymentName = $("#deploymentId tr[class='AppImageName'] .name").text().trim();

            var objCollection =
                {
                    "commandName": "adminEditDeploymentBurstSettings",
                    "data": {
                        "AdminBurstSettings": {
                            "AzureSubscriptionName": subscriptionName,
                            "CreatedDate": createddate,
                            "DeploymentFQDN": dploymentName,
                            "IsActive": btnClickYesNo,  //retutn True if Enable clicked or False if Disabled clicked
                            "LastModifiedDate": lastmodifieddate,
                            "PublishPassword": password,
                            "PublishUserName": userName,
                            "ResourceGroupName": resourceGroupName,
                        },
                        "ConnectionBroker": connectionBrokerName,
                        "ConnectionBrokerId": data.ConnectionBrokerId
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
                    $("#errorscalemessage").hide();
                    ShowInstantNotification("Progress", "Modifying scale for '" + dploymentName + "' deployment...", "", "scaleBtnSave");
                },
                success: function (res) {
                   var result = JSON.parse(res);
                    if (result == "Success") {
                        date = new Date();
                        var md = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear();
                        $("#scaleModifiedDate").text(md);
                        $("#errorscalemessage").hide();
                        $("#dplyburstclosebtn").trigger("click");
                        ShowInstantNotification("Success", "Scale modified successfully ...", "Scale for '" + dploymentName + "' deployment modified successfully.", "scaleBtnSave");
                    }
                    else {
                        var res = "";
                        var reso = result.includes("Provided resource group does not exist");
                        var subscription = result.includes("The provided subscription ID");
                        var sub = result.includes("Please try logging in with different credentials or a different subscription ID");
                        var password = result.includes("Invalid username or password");
                        var userName = result.includes("account must be added to the azurerdsfarm");
                        var UnknownUser = result.includes("Unknown User Type");
                        if (password == true || userName == true) {
                            res = "Invalid azure username or password";
                        }
                        else if (sub == true || subscription == true) {
                            res = "Please try logging in with different azure credentials or a different subscription ID.";
                        }
                        else if (reso) {
                            res = "The provided resource group does not exist.";
                        }
                        else if (UnknownUser) {
                            res = "Invalid azure username.";
                        }
                        else {
                            res = result;
                        }

                        $("#errorscalemessageText").text("");
                        $("#errorscalemessageText").text(res);
                        $("#errorscalemessage").show();
                        ShowInstantNotification("Error", "Failed modifying scale...", "Could not modified scale for '" + dploymentName + "' deployment.", "scaleBtnSave");
                    }
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed modifying scale...", "Could not modified scale for '" + dploymentName + "' deployment.", "scaleBtnSave");
                    LogError(data.ApiSubscriptionId, "Managing Scale in Deployments", error);
                },
                complete: function () {
                }
            });
        }
        else {
            $("#errorscalemessage").show();
        }
    });
    //v view model
    var viewModelessentials = {
        essentialloop: null
    };

    var deploymentsmodel = {
        rddeployments: null
    };
    //var a;
    //deploymentsmodel.rddeployments = data.rddeployments;

    deploymentsmodel.selecteddeploy = ko.observable(-1);
    deploymentsmodel.seleteddplyments = ko.observable();
    deploymentsmodel.selecteddplymentsId = ko.observable();
    data.SelectedDeployment = ko.observableArray('');
    data.SelectedDeploymentId = ko.observableArray('');
    data.serverRD = ko.observableArray('');
    var connectionBrokerName;


    /* On Selecting Deployment from List */
    //deploymentsmodel.selectdplmnt = function (val) {
    function selectdplmnt(val_FriendlyName, val_RDSConnectionBroker) {
        $("#closeIconDeployments").trigger("click");
        $("#dplysettingsclosebtn").trigger("click");
        //Bread Crumb
        AddBreadcrumb(val_FriendlyName, "dplydashboard", "divRrdDeployment");

        var dplydashboardLoader = $('#dplydashboardLoader');
        var dplydashboard = $('#dplydashboard');
        dplydashboardLoader.width(dplydashboard.width() + 1);
        dplydashboardLoader.height(dplydashboard.height());
        dplydashboard.show();
        dplydashboardLoader.show();

        setTimeout(function () {
            dplydashboardLoader.hide();
        }, 1000);

        $("#selectedDeployementName").text(val_FriendlyName);
        //ajax call to get the collections with respect to the deployment
        connectionBrokerName = val_RDSConnectionBroker;
        data.ConnectionBroker = val_RDSConnectionBroker;
        $("#selectedconnectionbroker").text(val_FriendlyName);
        $("#friendlynameforll").text(val_FriendlyName);
        refreshCollectionTileCount();
        LoadRDSessionHostServer();

        loadEssential();
    }

    var serverselectmodel = {
        serverselect: null
    };

    serverselectmodel.selectedserver = ko.observableArray('');

    //serverselectmodel.selectedserverName = function ()
    function selectedserverName(name, status) {
        if (name == "" || name == undefined) {
            $("#AddRDServerClickDeployeAdmin").attr("disabled", false);
            $("#disablerdserverDeployeAdmin").attr("disabled", true);
            $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
            $("#enablerdserverDeployeAdmin").attr("disabled", true);
            $("#ImportSHSDeployeAdmin").attr("disabled", false);
        }
        else {
            $("#deployserversadd").hide();
            $("#divImportSHS").hide();
            //manupulating menu buttons
            IsDisabledEnableServer = 0;
            IsDisabledRemoveServer = 0;
            IsDisabledDisableServer = 0;
            $("#AddRDServerClickDeployeAdmin").attr("disabled", false);
            $("#disablerdserverDeployeAdmin").attr("disabled", false);
            $("#RemoveRDServerDeployeAdmin").attr("disabled", false);
            $("#enablerdserverDeployeAdmin").attr("disabled", false);
            $("#ImportSHSDeployeAdmin").attr("disabled", false);
            if (status.toLowerCase() == "state_active") {
                $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
                $("#enablerdserverDeployeAdmin").attr("disabled", true);
                IsDisabledRemoveServer = 1;
                IsDisabledEnableServer = 1;
                $('enablerdserver').on("click", function (e) {
                    e.preventDefault();
                });
            }
            else if (status.toLowerCase() == "state_unassigned") {
                $("#enablerdserverDeployeAdmin").attr("disabled", true);
                $("#disablerdserverDeployeAdmin").attr("disabled", true);
                IsDisabledEnableServer = 1;
                IsDisabledDisableServer = 1;
            }
            else if (status.toLowerCase() == "state_drain") {
                $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
                $("#disablerdserverDeployeAdmin").attr("disabled", true);
                IsDisabledRemoveServer = 1;
                IsDisabledDisableServer = 1;
            }
            //end
            $("#AddRDServerClickDeployeAdmin").removeClass("activeDocBtn");
            $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
            $("#enablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#disablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#ImportSHSDeployeAdmin").removeClass("activeDocBtn");
        }

    }
    //functionality show and hide
    $("#createdplymnt").hide();
    $("#renamedplymnt").hide();
    $("#dplysettings").hide();
    $("#dplyserversshow").hide();
    $("#divImportSHS").hide();
    $("#dplydashboard").hide();
    $("#dplyburst").hide();
    $("#linkedresourcesblade").hide();
    $("#auditlogsErrorTextid").hide();

    //Id click functions

    $("#auditlogErrorTextclosebtn").click(function () {
        $("#auditlogsErrorTextid").hide();

    });

    $("#linkedresources").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        $("#linkedresourcesblade").show();
        $("#linkedresources").addClass("activeDocBtn");
        AddBreadcrumb("Linked Resource", "linkedresourcesblade", "dplydashboard");

        var LinkedResourceLoader = $('#linkedresourcesbladeLoader');
        var LinkedResourcediv = $('#linkedresourcesblade');
        LinkedResourceLoader.width(LinkedResourcediv.width() + 1);
        LinkedResourceLoader.height(LinkedResourcediv.height());
        LinkedResourcediv.show();
        LinkedResourceLoader.show();

        setTimeout(function () {
            LinkedResourceLoader.hide();
        }, 1000);
        LoadLinkedResources();

        ScrollToHorizontalEndDeployAdmin($("#linkedresourcesblade").width());
    });

    $("#closeIconlinkedresources").click(function () {
        $("#linkedresourcesblade").hide();
        RemoveBreadcrumb("dplydashboard");
        $("#min_linkedresourcesblade").hide();
        $("#linkedresources").removeClass("activeDocBtn");
    });

    $("#closeIconDeployments").click(function () {
        RemoveBreadcrumb("divRrdDeployment");
        $("#createiclass").removeClass("activeDocBtn");
        $("#closeIconazuredetails").trigger("click");
        $("#closeIconDeploymentdetails").trigger("click");
        $("#min_createdplymnt").hide();
        $("#createdplymnt").hide();
    });

    $("#closeIconRenameDeployment").click(function () {
        $("#renamedplymnt").hide();
        $("#renameiclass").removeClass("activeDocBtn");
        $("#min_renamedplymnt").hide();
        $("#frnderroricon").hide();
        $("#friendlyname").removeClass("redborder");
        $("#Errormessagerenamedplymnt").hide();
        RemoveBreadcrumb("renamedplymnt");
    });

    $("#createiclass").click(function () {

        $("#closeIconDeployments").trigger("click");
        $("#dplysettingsclosebtn").trigger("click");
        $("#dplydashboardCloseBlade").trigger("click");
        AddBreadcrumb("Connect to RD Deployment", "createdplymnt", "divRrdDeployment");
        $("#min_createdplymnt").hide();
        $("#deploymentId tbody tr").removeClass("AppImageName");
        $("#deploymentId tbody tr img").hide();
        $("#createiclass").addClass("activeDocBtn");
        $("#dplysettingsshow").removeClass("activeDocBtn");
        $("#createdplymnt").show();
        $("#createcbnarrow").show();
        $("#createazarrow").show();
        $("#cbntick").hide();
        $("#aztick").hide();

        document.getElementById("rdcbFQDN").value = "";
        document.getElementById("fndNameDeployment").value = "";
        document.getElementById("descDeoployment").value = "";
        //document.getElementById("CollectionAdminUsername").value = "";
        //document.getElementById("CollectionAdminPassword").value = "";

        document.getElementById("AzreLgnName").value = "";
        document.getElementById("AzrPassword").value = "";
        document.getElementById("AzreSubID").value = "";
        document.getElementById("AzreResrceGrp").value = "";

        //Remove textbox icon validation 
        $("#fqdnerroricon").hide();
        $("#rdcbFQDN").removeClass("redborder");
        $("#fndnmerroricon").hide();
        $("#fndNameDeployment").removeClass("redborder");
        $("#descerroricon").hide();
        $("#descDeoployment").removeClass("redborder");
        $("#errormesgcreatedplymnt").hide();
        $("#min_dplysettings").hide();
        $("#min_databaseConfigBlade").hide();
        $("#min_auditlogsid").hide();
    });

    $("#dplysettingsshow").click(function () {
        $("#closeIconDeployments").trigger("click");
        $("#dplysettingsclosebtn").trigger("click");
        $("#dplydashboardCloseBlade").trigger("click");
        $("#dplysettings").show();
        $("#dplysettingsshow").addClass("activeDocBtn");
        $("#createiclass").removeClass("activeDocBtn");
        $("#dplysettings .rightArrIcon").show();
        //Bread Crumb
        AddBreadcrumb("Settings", "dplysettings", "dplydashboard");
        ScrollToHorizontalEndDeployAdmin(300);
    });

    $("#dplysettingsok").click(function () {
        $("#dplysettings").hide();
        $("#dplyburst").hide();
        $("#auditlogsid").hide();
        $("#databaseConfigBlade").hide();
        $("#dplysettingsshow").removeClass("activeDocBtn");
    });

    $("#dplyservers").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        //Bread Crumb
        AddBreadcrumb("RD Virtual Machines", "dplyserversshow", "dplydashboard");
        var dplyserversshowLoader = $('#dplyserverLoader2');
        var dplyserversshow = $('#dplyserversshow');
        dplyserversshowLoader.width(dplyserversshow.width() + 1);
        dplyserversshowLoader.height(dplyserversshow.height());
        dplyserversshow.show();
        dplyserversshowLoader.show();
        setTimeout(function () {
            dplyserversshowLoader.hide();
        }, 1000);
        ScrollToHorizontalEndDeployAdmin(900);
        $("#dplyservers").addClass("activeTile");
        $('#dplydashboard').find('.backgroundclr').removeClass('backgroundclr');
        $('#dplyservers .tileDiv').addClass('backgroundclr');
        LoadRDSessionHostServerList();
    });

    $("#dplydashboardCloseBlade").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#dplydashboard").hide();
        $("#min_dplydashboard").hide();
        RemoveBreadcrumb("divRrdDeployment");
        $("#auditlogclosebtn").trigger("click");
        $('#deploymentId tbody tr').removeClass('AppImageName');
        $('#deploymentId .rightArrIconDeployAdmin').hide();

    });

    $("#dplysettingsclosebtn").click(function () {
        RemoveBreadcrumb("divRrdDeployment");
        $("#databaseConfigclosebtn").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        $("#min_dplysettings").hide();
        $("#dplysettings").hide();
        $("#dplysettingsshow").removeClass("activeDocBtn");
    });

    $("#dplyServersCloseBlade").click(function () {
        $("#closeIconDeploymentsrdserver").trigger("click");
        $("#closeIconImportSHS").trigger("click");
        $("#min_dplyserversshow").hide();
        $("#dplyserversshow").hide();
        RemoveBreadcrumb("dplydashboard");
        $("#dplyservers").removeClass("activeTile");
    });

    $("#dplybrusticon").click(function () {
        $("#dplyburst").show();
    });

    $("#dplybrusticon").click(function () {
        $("#dplyburst").show();
    });

    $("#dplyscaleshow").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        $("#dplyburst").show();

        var dploymentName = $("#deploymentId tr[class='AppImageName'] .name").text().trim();
        $("#scaleName").attr("Placeholder", "Loading scale name...");
        $("#scalePassword").attr("Placeholder", "Loading password...");
        $("#scaleAzureSubscriptionName").attr("Placeholder", "Loading subscription name...");
        $("#scaleresourceGroupName").attr("Placeholder", "Loading resource group...");
        $("#scaleCreatedDate").text("Loading date...");
        $("#scaleModifiedDate").text("Loading date...");
        $.ajax({
            url: data.ApiUrl + "admin/GetDeploymentBurstSettings/" + dploymentName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (res) {
                $("#scaleName").val(res.PublishUserName);
                $("#scalePassword").val("your password");
                $("#scaleAzureSubscriptionName").val(res.AzureSubscriptionName);
                $("#scaleresourceGroupName").val(res.ResourceGroupName);
                if (res.IsActive == true) {
                    $("#yesScalestatusDeployAdmin").trigger("click");
                }
                else {
                    $("#noScalestatusDeployAdmin").trigger("click");
                }
                var date = new Date(res.CreatedDate);
                var cd = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear();
                $("#scaleCreatedDate").text(cd);
                date = new Date(res.LastModifiedDate);
                var md = date.getDate() + "/" + (parseInt(date.getMonth()) + 1) + "/" + date.getFullYear();
                $("#scaleModifiedDate").text(md);
            },
            error: function (error) {
                $("#scaleCreatedDate").text("");
                $("#scaleModifiedDate").text("");
                LogError(data.ApiSubscriptionId, "Loading Scale in Deployemnts", error);
            },
            complete: function () {
                $("#scaleName").attr("Placeholder", "");
                $("#scalePassword").attr("Placeholder", "");
                $("#scaleAzureSubscriptionName").attr("Placeholder", "");
                $("#scaleresourceGroupName").attr("Placeholder", "");
            }
        });

        //Bread Crumb
        AddBreadcrumb("Manage Cloud Scale", "dplyburst", "dplydashboard");
        $("#dplyscaleshow").addClass("activeDocBtn");
        ScrollToHorizontalEndDeployAdmin(300);
        $("span[id^='Exc_']").hide();
        $("#errorscalemessage").hide();

    });

    $("#dplyburstclosebtn").click(function () {
        RemoveBreadcrumb("dplydashboard");
        $("#dplyburst").hide();
        $("#dplyscaleshow").removeClass("activeDocBtn");
        $("#errorscalemessage").hide();
        $("span[id^='Exc_']").hide();
        $("#min_dplyburst").hide();
        $("#formelementsscale input").removeClass("redborder");
    });


    var btnClickYesNo;
    $("#yesScalestatusDeployAdmin").click(function (e) {
        $("#noScalestatusDeployAdmin").removeClass("activeCls");
        $("#yesScalestatusDeployAdmin").addClass("activeCls");
        $("#allInputFields input").attr("disabled", false);
        $("#scaleBtnSave").attr("disabled", false);
        btnClickYesNo = true;
    });

    $("#noScalestatusDeployAdmin").click(function (e) {
        $("#noScalestatusDeployAdmin").addClass("activeCls");
        $("#yesScalestatusDeployAdmin").removeClass("activeCls");
        $("#allInputFields input").attr("disabled", true);
        $("#scaleBtnSave").attr("disabled", false);
        btnClickYesNo = false;
        $("span[id^='Exc_']").hide();
        $("#errorscalemessage").hide();
    });

    $("#allInputFields input").each(function () {
        $(this).keyup(function () {
            maniPulateSaveButton();
        });
    });

    $("#renameiclass").click(function () {
        if ($("#renameiclass").prop("disabled") == false) {
            $("#dplyburstclosebtn").trigger("click");
            $("#closeIconlinkedresources").trigger("click");
            $("#closeIconRenameDeployment").trigger("click");
            $("#closeIconRDSCollectionBlade").trigger("click");
            $("#dplyServersCloseBlade").trigger("click");
            $("#auditlogclosebtn").trigger("click");
            $("#renamedplymnt").show();
            $("#renameiclass").addClass("activeDocBtn");
            //Bread Crumb
            AddBreadcrumb("Rename Deployment", "renamedplymnt", "dplydashboard");
            $("#friendlyname").val($("#deploymentId tr[class='AppImageName'] .FriendlyName").text().trim());
            ScrollToHorizontalEndDeployAdmin($("#renamedplymnt").width());

        } else {
            $("#renameiclass").removeClass("activeDocBtn");
            //renamemodal.style.display = "block";
        }
    });

    $("#removeiclass").click(function () {
        if ($("#removeiclass").prop("disabled") == false) {
            $("#dplyburstclosebtn").trigger("click");
            $("#closeIconlinkedresources").trigger("click");
            $("#closeIconRenameDeployment").trigger("click");
            $("#closeIconRDSCollectionBlade").trigger("click");
            $("#dplyServersCloseBlade").trigger("click");
            $("#auditlogclosebtn").trigger("click");
            $("#removeiclass").addClass("activeDocBtn");
            var dply = $("#deploymentId tr[class='AppImageName'] .name").text().trim();

            $("#deletedeploy").text(dply);
            removeDeploymentConfirmationModal.style.display = "block";

            removeDeploymentConfirmationYes.onclick = function () {
                removeDeploymentConfirmationModal.style.display = "none";
                $("#removeiclass").removeClass("activeDocBtn");
                removeDeploymentConfirmationNo.disabled = true;
                removeDeploymentConfirmationYes.disabled = true;

                var objCollection =
                    {
                        "commandName": "removedeployment",
                        "data": {
                            "Id": $("#deploymentId tr[class='AppImageName'] .Id").text().trim()
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
                        ShowInstantNotification("Progress", "Removing '" + dply + "' deployment...", "", "removeiclass");
                    },

                    success: function (res) {
                        $("#dplydashboardCloseBlade").trigger("click");
                        for (var i = 0; i < RDSDeploymentArray.length; i++) {
                            if (RDSDeploymentArray[i].name == dply) {
                                RDSDeploymentArray.splice(i, 1);
                            }
                        }
                        $("#removeSuccessModalmsg").text(dply);
                        $("#deploymentId tbody tr").each(function () {
                            if ($(".name", this).text().trim() == dply) {
                                $(this).remove();
                            }
                        });
                        removeDeploymentConfirmationModal.style.display = "none";
                        ShowInstantNotification("Success", "Successfully removed deployment...", "Successfully removed deployment '" + dply + "'.", "removeiclass");

                    },
                    error: function (error) {
                        removeDeploymentConfirmationModal.style.display = "none";
                        ShowInstantNotification("Error", "Failed removing...", "Failed removing '" + dply + "' deployment.", "removeiclass");
                        LogError(data.ApiSubscriptionId, "Remove Deployments", error);

                    },
                    complete: function () {
                        removeDeploymentConfirmationModal.style.display = "none";
                        removeDeploymentConfirmationNo.disabled = false;
                        removeDeploymentConfirmationYes.disabled = false;
                    }
                });
            }
        }
        else {
            $("#removeiclass").removeClass("activeDocBtn");
        }

    });
    $("#TimeDifferenceinHrs").keyup(function () {
        var curVal = $(this).val().trim();
        if (parseFloat(curVal) < -12 || parseFloat(curVal) > 14) {
            $(this).val("");
        }
    });
    $("#MinNoRDSH,#SessionThreshold").keyup(function () {
        var curVal = $(this).val().trim();
        var i = 0;

        if (parseFloat(curVal) < 1) {
            $(this).val("");
        }
    });
    //$('#rdcbFQDN,#fndNameDeployment,#descDeoployment,#friendlyname,#rdcbaddFQDN,#friendlyname').bind("paste", function (e) {
    //    e.preventDefault();
    //});

    $("#rdcbFQDN,#fndNameDeployment,#descDeoployment").keyup(function () {
        var curVal = $(this).val();
        var txtThisID = $(this).attr("id");
        if (curVal == "") {
            $("#errormesgcreatedplymnt").show();
        }
        else {
            $("#Con_" + txtThisID + "").hide();
            $("#" + txtThisID + "").removeClass("redborder");
        }
        if (($("#rdcbFQDN").val() != "") && ($("#fndNameDeployment").val() != "") && ($("#descDeoployment").val() != "")) {
            $("#errormesgcreatedplymnt").hide();
        }
        else {
            $("#errormesgcreatedplymnt").show();
        }
    });

    $("#AzreLgnName,#AzrPassword,#AzreSubID,#AzreResrceGrp").keyup(function () {
        var curVal = $(this).val();
        var txtThisID = $(this).attr("id");
        if (curVal == "") {
            $("#errormesageac").show();
        }
        else {
            $("#Conn_" + txtThisID + "").hide();
            $("#AzreSubIDMinLength").hide();
            $("#" + txtThisID + "").removeClass("redborder");
        }
        if (($("#AzreLgnName").val() != "") && ($("#AzrPassword").val() != "") && ($("#AzreSubID").val() != "") && ($("#AzreResrceGrp").val() != "")) {
            $("#errormesageac").hide();
        }
        else {
            $("#errormesageac").show();
        }
    });


    // Create deployments button validation
    $("#rdcreate").click(function () {

        var isValid = true;
        var fname = $("#rdcbFQDN").val();
        var fnamedeploy = $("#fndNameDeployment").val().trim();
        var descDeploy = $("#descDeoployment").val().trim();
        localStorage.setItem("FriendlyName", $("#fndNameDeployment").val()); //Name from rename blade
        var brokerfqdn = $("#rdcbFQDN").val();

        if (isfilledazinfo && isfilledcbinfo) {
            $("#errormesgcreatedplymnt").hide();
            //ajax call to create deployments

            var objCollection =
                {
                    "commandName": "newdeployment",
                    "data": {
                        "Id": localStorage.getItem("GenerateName"),
                        "FriendlyName": localStorage.getItem("FriendlyName"),
                        "RDSConnectionBroker": brokerfqdn,
                        "AzureLoginName": $("#AzreLgnName").val(),
                        "AzurePassword": $("#AzrPassword").val(),
                        "AzureResourceGroup": $("#AzreResrceGrp").val(),
                        "AzureSubscriptionID": $("#AzreSubID").val()
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
                    ShowInstantNotification("Progress", "Connecting '" + fname + "' deployment...", "", "rdcreate");
                    $("#errormessagedetunfilled").hide();
                },
                success: function (res) {
                    
                    var result = JSON.parse(res);
                    if (result == "Success") {
                        LoadRDSDeployment();
                        $("#errormessagedetunfilled").hide();
                        $("#closeIconDeployments").trigger("click");
                        ShowInstantNotification("Success", "Successfully connected...", "'" + fname + "' deployment connected successfully.", "rdcreate");
                    }
                    else {

                        var res = "";
                        var reso = result.includes("Provided resource group does not exist.");
                        var subscription = result.includes("The provided subscription ID");
                        var sub = result.includes("Please try logging in with different credentials or a different subscription ID");
                        var password = result.includes("Invalid username or password");
                        var userName = result.includes("account must be added to the azurerdsfarm");
                        var UnknownUser = result.includes("Unknown User Type");
                        if (password == true || userName == true) {
                            res = "Invalid azure username or password";
                        }
                        else if (sub == true || subscription ==true) {
                            res = "Please try logging in with different azure credentials or a different subscription ID.";
                        }
                        else if (reso) {
                            res = "The provided resource group does not exist.";
                        }
                        else if (UnknownUser)
                        {
                            res = "Invalid azure username.";
                        }
                        else {
                            res = result;
                        }

                        $("#DplyDetailErrorMsgP").text("");
                        $("#DplyDetailErrorMsgP").text(res);
                        $("#errormessagedetunfilled").show();
                        ShowInstantNotification("Error", "Failed establishing connection...", "Failed establishing '" + fname + "' deployment connection.", "rdcreate");
                    }
                },
                complete: function () {
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed establishing connection...", "Failed establishing '" + fname + "' deployment connection.", "rdcreate");
                    LogError(data.ApiSubscriptionId, "Create Deployemnts", error);
                }
            });
        }
        else {
            $("#errormessagedetunfilled").show();
        }
    });

    //Enable & Desable rdcreate button
    var textvalue = false;
    $("#friendlyname").keyup(function () {
        //var strFNameField = $("#friendlyname").val().trim();
        $("#frnderroricon").hide();
        $("#friendlyname").removeClass("redborder");
        $("#Errormessagerenamedplymnt").hide();
        textvalue = true;
        //if (strFNameField == "") {
        //    $("#rdrename").attr("disabled", true);
        //}
        //else {
        //    $("#rdrename").attr("disabled", false);
        //}
    });

    //rename deployments click function
    $("#rdrename").click(function () {
        var isValid = false;
        var name = $("#friendlyname").val().trim();

        if (name == "" || name == undefined || name.length < 1) {
            $("#frnderroricon").show();
            $("#friendlyname").addClass("redborder");
            $("#Errormessagerenamedplymnt").show();
            isValid = false;
        }
        else {
            isValid = true;
        }
        if (isValid) {
            //setting the post data from the input fields filled
            localStorage.setItem("RenameFriendlyName", $("#friendlyname").val()); //Name from rename blade
            //ajax call to rename deployments
            var objCollection =
                {
                    "commandName": "editdepoyment",
                    "data": {
                        "Id": $("#deploymentId tr[class='AppImageName'] .Id").text().trim(),
                        "FriendlyName": localStorage.getItem("RenameFriendlyName")
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
                    $("#closeIconRenameDeployment").trigger("click");
                    ShowInstantNotification("Progress", "Renaming deployment friendly name to '" + name + "' ...", "", "rdrename");
                },
                success: function (res) {
                    for (var i = 0; i < RDSDeploymentArray.length; i++) {
                        if (RDSDeploymentArray[i].name == $("#deploymentId tr[class='AppImageName'] .name").text().trim()) {
                            RDSDeploymentArray.splice(i, 1);
                        }
                    }
                    var dplynm = $("#deploymentId tr[class='AppImageName'] .name").text().trim();
                    RDSDeploymentArray.push({
                        Id: $("#deploymentId tbody tr[class='AppImageName'] .Id").text().trim(),
                        name: $("#deploymentId tbody tr[class='AppImageName'] .name").text().trim(),
                        FriendlyName: $("#friendlyname").val().trim()
                    });
                    $("#deploymentId tbody tr[class='AppImageName'] .FriendlyName").text($("#friendlyname").val());

                    $("#renamespan").text(dplynm);
                    ShowInstantNotification("Success", "Deployment successfully renamed", "Deployment successfully renamed to '" + name + "'.", "rdrename");
                    $("#selectedconnectionbroker").text($("#friendlyname").val());
                    $("#bladeid_dplydashboard").text($("#friendlyname").val());
                    textvalue = false;
                    RemoveBreadcrumb("dplydashboard");
                    $("#renameiclass").removeClass("activeDocBtn");
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed renaming...", "Failed renaming '" + name + "' deployment.", "rdrename");
                    LogError(data.ApiSubscriptionId, "Rename Deployment", error);
                }
            });
        } else {
            $("#frnderroricon").show();
            $("#friendlyname").addClass("redborder");
            $("#Errormessagerenamedplymnt").show();

        }
    });

    $("#deplydemo a[data-target='#demo']").click(function () {
        $('#essentialContentDeployAdmin').slideToggle(1);
        $("#essential_DataDeployAdmin").slideToggle(1);
        $('#deplydemo').toggleClass('essentialDiv1');
        if ($('#deplyuparrowicon').hasClass("upArrowIcon")) {
            $('#deplyuparrowicon').addClass("downArrowIcon");
            $('#deplyuparrowicon').removeClass("upArrowIcon");
        }
        else {
            $('#deplyuparrowicon').removeClass("downArrowIcon");
            $('#deplyuparrowicon').addClass("upArrowIcon");
        }
    });

    $("#enablerdserverDeployeAdmin").click(function () {
        if ($("#enablerdserverDeployeAdmin").prop("disabled") == false) {
            $("#closeIconDeploymentsrdserver").trigger("click");
            $("#closeIconImportSHS").trigger("click");
            var dply = $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim();
            //ajax call to enable a server
            var objCollection =
                {
                    "commandName": "startserver",
                    "data": {
                        "ConnectionBroker": connectionBrokerName,
                        "SessionHost": $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim()
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
                    LogError(data.ApiSubscriptionId, "Enable  RD Server in Deployadmin", error);
                    console.log("ERROR:", error);
                },
                complete: function () {
                    $("#dplyservers").trigger("click");
                }
            });
        }
        else {
            $("#enablerdserverDeployeAdmin").removeClass("activeDocBtn");
        }
    });

    $("#disablerdserverDeployeAdmin").click(function () {
        if ($("#disablerdserverDeployeAdmin").prop("disabled") == false) {
            $("#closeIconDeploymentsrdserver").trigger("click");
            $("#closeIconImportSHS").trigger("click");
            var dply = $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim();
            //ajax call to disable a server
            var objCollection =
                {
                    "commandName": "shutdownserver",
                    "data": {
                        "ConnectionBroker": connectionBrokerName,
                        "SessionHost": $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim()
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
                    $("#dplyservers").trigger("click");
                    $("#disableservernm").text(dply);
                    ShowInstantNotification("Success", "Successfully disabled...", "Sussessfully disabled connection for RD VM '" + dply + "'.", "disablerdserver");
                },
                error: function (error) {
                    ShowInstantNotification("Error", "Failed disable...", "Failed disabling connection for RD VM '" + dply + "' connection.", "disablerdserver");
                    LogError(data.ApiSubscriptionId, "Disable RD Server in Deployadmin", error);
                },
                complete: function () {
                }
            });
        }
        else {
            $("#disablerdserverDeployeAdmin").removeClass("activeDocBtn");
        }
    });

    var IsDisabledEnableServer = 0;
    var IsDisabledRemoveServer = 0;
    var IsDisabledDisableServer = 0;
    $("#AddRDServerClickDeployeAdmin").click(function () {
        if ($("#RDServerSpinnerDeployAdmin").is(":visible") == false) {
            //Bread Crumb
            AddBreadcrumb("Add RD Server", "deployserversadd", "dplyserversshow");
            $("#min_deployserversadd").hide();
            $("#serverlistselectidDeployAdmin tbody tr").removeClass("AppImageName");
            $("#rdcbadderroricon").hide();
            $("#Errormessagedeployserversadd").hide();
            $("#deployserversadd").show();
            document.getElementById("rdcbaddFQDN").value = "";
            $("#divImportSHS").hide();
            $("#AddRDServerClickDeployeAdmin").addClass("activeDocBtn");
            $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
            $("#enablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#disablerdserverDeployeAdmin").removeClass("activeDocBtn");
            $("#ImportSHSDeployeAdmin").removeClass("activeDocBtn");
            ScrollToHorizontalEndDeployAdmin(300);
        }
    });

    //Enable & Desable rdcreate button
    $("#rdcbaddFQDN").keyup(function () {
        $("#rdcbadderroricon").hide();
        $("#rdcbaddFQDN").removeClass("redborder");
        $("#Errormessagedeployserversadd").hide();
    });

    $("#rdaddserver").click(function () {
        var straddFQDNField = $("#rdcbaddFQDN").val().trim();
        if (straddFQDNField != "") {
            var pattern = new RegExp("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*[A-Za-z0-9]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z0-9]{2,})$");
            var result = pattern.test($("#rdcbaddFQDN").val().trim());
            if (result == false) {
                var txtThisID = "rdcbaddFQDN";
                $("#rdcbadderroricon").show();
                $("#rdcbaddFQDN").addClass("redborder");
                $("#Errormessagedeployserversadd").show();
                $("#deployserversadd").show();
            }
            else {
                $("#deployserversadd").hide();
                $("#AddRDServerClickDeployeAdmin").removeClass("activeDocBtn");
                var objCollection =
                  { ServerDetails: { ConnectionBroker: connectionBrokerName, ServerNames: $('#rdcbaddFQDN').val() } }
                var jsonData = JSON.stringify(objCollection);
                $.ajax({
                    url: data.ApiUrl + "admin/AddServers/" + data.ApiSubscriptionId + "/",
                    type: "POST",
                    crossDomain: true,
                    dataType: "json",
                    data: jsonData,
                    beforeSend: function () {

                        ShowInstantNotification("Progress", "Adding server '" + straddFQDNField + "'...", "", "deployserversadd");
                    },

                    success: function (res) {
                        $("#serverspan").text($("#rdcbaddFQDN").val());
                        var strPrevvmServerCount = $("#vmServerCount").text().trim();
                        strPrevvmServerCount = (parseInt(strPrevvmServerCount) + 1);
                        $("#vmServerCount").text(strPrevvmServerCount);
                        ShowInstantNotification("Success", "Successfully added server", "Successfully added server'" + $('#rdcbaddFQDN').val() + "'", "deployserversadd");
                        $("#dplyservers").trigger("click");
                    },
                    error: function (error) {
                        ShowInstantNotification("Error", "Failed adding...", "Failed adding server '" + $('#rdcbaddFQDN').val() + "'", "deployserversadd");
                        LogError(data.ApiSubscriptionId, "Add RD Server DeployAdmin", error);
                    }
                });
            }
         }
        else {
            $("#rdcbadderroricon").show();
            $("#rdcbaddFQDN").addClass("redborder");
            $("#Errormessagedeployserversadd").show();
        }

    });

    $("#RemoveRDServerDeployeAdmin").click(function () {
        var selRowNow = $("#serverlistselectidDeployAdmin tr[class='AppImageName']");
        //ajax call to remove the RD server
        if ($("#RemoveRDServerDeployeAdmin").prop("disabled") == false) {
            $("#closeIconDeploymentsrdserver").trigger("click");
            $("#closeIconImportSHS").trigger("click");
            var dply = $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim();
            $("#removeservernm").text(dply);
            $("#RemoveRDServerDeployeAdmin").addClass("activeDocBtn");
            removeServerConfirmationModal.style.display = "block";
            removeServerConfirmationNo.onclick = function () {
                removeServerConfirmationModal.style.display = "none";
                $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");

            }
            removeServerConfirmationYes.onclick = function () {
                removeServerConfirmationModal.style.display = "none";
                $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
                $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
                var objCollection =
                         {
                             "commandName": "removeserver",
                             "data": {
                                 "ConnectionBroker": connectionBrokerName,
                                 "Server": $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Name").text().trim()
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
                        ShowInstantNotification("Progress", "Deleting '" + dply + "' RD VM...", "", "RemoveRDServer");
                        $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Status").text("");
                        $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Collection").text("");
                        $("#serverlistselectidDeployAdmin tr[class='AppImageName'] .Type").text("Removing RD virtual machine...");
                        $("#serverlistselectidDeployAdmin tr[class='AppImageName']").removeClass("AppImageName").addClass("nodata");
                        $("#serverlistselectidDeployAdmin tr[class='nodata']").css("background-color", "#E6E6E6");
                        $("#serverlistselectidDeployAdmin tr[class='nodata']").css("color", "#3A3A3A");
                        $("#serverlistselectidDeployAdmin tbody tr").unbind("click");
                        $("#serverlistselectidDeployAdmin tbody tr[class!='nodata']").click(function () {
                            if ($(this).hasClass("AppImageName")) {
                                $(this).removeClass('AppImageName');
                                selectedserverName();
                            }
                            else {
                                $('#serverlistselectidDeployAdmin tbody tr').removeClass('AppImageName');
                                $(this).addClass('AppImageName');
                                selectedserverName($(".Name", this).text().trim(), $(".Status", this).text().trim())
                            }
                        });
                    },
                    success: function (res) {
                        var prevVM = $("#vmServerCount").text().trim();
                        prevVM--;
                        $("#vmServerCount").text(prevVM);
                        $("#serverlistselectidDeployAdmin tr[class='nodata']").remove();
                        var dply = $("#deploymentId tr[class='AppImageName'] .name").text().trim();
                        ShowInstantNotification("Success", "Successfully deleted RD VM...", "Successfully deleted RD VM '" + dply + "'.", "RemoveRDServer");


                    },
                    complete: function () {
                        // serverRemoveConfirmationModal.style.display = "none";
                        removeServerConfirmationNo.disabled = false;
                        removeServerConfirmationYes.disabled = false;
                    },
                    error: function (error) {
                        serverRemoveConfirmationModal.style.display = "none";
                        ShowInstantNotification("Error", "Failed deleting...", "Failed deteting '" + dply + "' RD VM.", "RemoveRDServer");
                        LogError(data.ApiSubscriptionId, "Remove RD Server in DeployAdmin", error);
                        console.log("ERROR:", error);
                    }
                });
            }
        }
        else {
            $("#RemoveRDServerDeployeAdmin").removeClass("activeDocBtn");
        }
    });

    $("#closeIconDeploymentsrdserver").click(function () {
        RemoveBreadcrumb("dplyserversshow");
        $("#deployserversadd").hide();
        $("#min_deployserversadd").hide();
        $("#AddRDServerClickDeployeAdmin").removeClass("activeDocBtn");
        //Hide Text box va;idation icon
        $("#rdcbadderroricon").hide();
        $("#rdcbaddFQDN").removeClass("redborder");
        $("#Errormessagedeployserversadd").hide();
    });

    $("#collectionRefreshDeploy").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#dplyServersCloseBlade a").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        selectdplmnt($("#deploymentId tbody tr[class='AppImageName'] .FriendlyName").text().trim(), $("#deploymentId tbody tr[class='AppImageName'] .name").text().trim());
        $("#collectionRefreshDeploy").removeClass("activeDocBtn");
    });

    $("#auditslogbtnDeployAdmin").click(function () {

        // $("#logFileList").html("");
        $("#auditlogsid").show();
        //$("#errorLogSpinner").show();
        $("#databaseConfigBlade").hide();
        $("#min_auditlogsid").hide();
        $("#min_databaseConfigBlade").hide();
        $("#auditslogbtnDeployAdmin").addClass("activeDocBtn");
        $("#databaseConfigbtn").removeClass("AppImageName");
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        //$("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#dplyServersCloseBlade a").trigger("click");
        //$.get("GetErrorFiles", { subscriptionID: "" + data.ApiSubscriptionId + "" }, function (res) {
        //    var fileLST = res;
        //    for (var i = 0; i < res.aaData.length; i++) {
        //        var listDynamic = "<li style=\"border-bottom:1px dotted #808080;padding-top:10px;\"><a href=\"" + res.aaData[i].split(',')[1] + "\" target=\"_blank\">" + res.aaData[i].split(',')[0] + "</a></li>";
        //        $("#logFileList").append(listDynamic);
        //    }
        //    $("#errorLogSpinner").hide();
        //});
        //Bread Crumb
        AddBreadcrumb("Audit Logs", "auditlogsid", "dplydashboard");
        ScrollToHorizontalEndDeployAdmin(300);

        //ajax call to fetch the log records and display in front end
        var dateFrom = new Date();

        var fd = (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate() + "-" + dateFrom.getFullYear() + " 00:00";
        var ft = (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate() + "-" + dateFrom.getFullYear() + " 23:59";
        $("#fromdateAL").val(fd);
        $("#todateAL").val(ft);
        LoadErrorLogs();
    });

    $("#auditlogclosebtn").click(function () {
        $("#auditlogsid").hide();
        $("#min_auditlogsid").hide();
        $("#auditslogbtnDeployAdmin").removeClass("activeDocBtn");
        $("#closemsgerror").trigger("click");
        $("#min_auditlogsid").hide();
        RemoveBreadcrumb("dplydashboard");
    });

    $("#databaseConfigbtn").click(function () {
        $("#ErrormessagedatabaseConfigBlade").hide();
        $("#servername").attr("Placeholder", "Loading server name...");
        $("#databaseNm").attr("Placeholder", "Loading database name...");
        $("#userId").attr("Placeholder", "Loading user ID...");
        $("#dbpassword").attr("Placeholder", "Loading password...");

        $.ajax({
            url: data.ApiUrl + "admin/GetDBCredentials",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            success: function (res) {
                $("#servername").val(res.serverName);
                $("#databaseNm").val(res.dbName);
                $("#userId").val(res.userId);
                $("#dbpassword").val(res.password);
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Loading Database Configuration", error);
            },
            complete: function () {
                $("#servername").attr("Placeholder", "");
                $("#databaseNm").attr("Placeholder", "");
                $("#userId").attr("Placeholder", "");
                $("#dbpassword").attr("Placeholder", "");
            }
        });

        AddBreadcrumb("Database Configuration", "databaseConfigBlade", "dplysettings");
        $("#databaseConfigBlade").show();
        $("#auditlogsid").hide();
        $("#min_databaseConfigBlade").hide();
        $("#auditlogsconfig").hide();
        $("#min_auditlogsid").hide();
        $("#databaseConfigbtn").addClass("AppImageName");
        $("#auditslogbtnDeployAdmin").removeClass("AppImageName");
        $("#dplysettingsshow").addClass("activeDocBtn");
        ScrollToHorizontalEndDeployAdmin(300);
    });

    $("#databaseConfigclosebtn").click(function () {
        $("#databaseConfigBlade").hide();
        $("#min_databaseConfigBlade").hide();
        $("#databaseConfigbtn").removeClass("AppImageName");
        RemoveBreadcrumb("dplysettings");

    });

    $("#databaseSave").click(function () {
        var isValidatedscale = true;
        $("#formelementsdatabaseConfig input[type='text'],#formelementsdatabaseConfig input[type='password']").each(function () {
            var curVal = $(this).val();
            if (curVal == "") {
                var txtThisID = $(this).attr("id");
                $("#Exc_" + txtThisID + "").show();
                $("#" + txtThisID + "").addClass("redborder");
                $("#ErrormessagedatabaseConfigBlade").show();
                isValidatedscale = false;
            }

        });

        if (isValidatedscale) {
            var dplynm = $("#deploymentId tr[class='AppImageName'] .name").text().trim();
            var servernm = $("#servername").val().trim();
            var dbnm = $("#databaseNm").val().trim();
            var userid = $("#userId").val().trim();
            var pwd = $("#dbpassword").val().trim();
            var objJsonData = {
                "Credential":
                {
                    "serverName": servernm,
                    "dbName": dbnm,
                    "userId": userid,
                    "password": pwd,
                    "domainName": "",
                }
            }
            var jsonData = JSON.stringify(objJsonData);

            $.ajax({
                url: data.ApiUrl + "admin/UpdateDBCredentials/" + data.ApiSubscriptionId,
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: jsonData,
                beforeSend: function () {
                    $("#ErrormessagedatabaseConfigBlade").hide();
                    ShowInstantNotification("Progress", "Database Configuration in process...", "", "dbConfig");
                },

                success: function (res) {
                    if (res == "Success") {
                        ShowInstantNotification("Success", "Successfully configured databse...", "Database credentials configured successfully.", "dbConfig");
                    }
                    else {
                        ShowInstantNotification("Error", "Failed configuring database...", res, "dbConfig");
                        LogError(data.ApiSubscriptionId, "Upadting Database Credentials", res);
                    }
                },
                complete: function () {

                },
                error: function (error) {
                    LogError(data.ApiSubscriptionId, "Upadting Database Credentials", error);
                    ShowInstantNotification("Error", "Failed configuring database...", "'" + dplynm + "' database configuration failed.", "dbConfig");
                }
            });
        }

    });

    function ScrollToHorizontalEndDeployAdmin(heightToAdd) {
        var prevHeight = $(".rds-container").width();
        prevHeight += heightToAdd;
        $(".rds-container").scrollLeft(prevHeight);
    }
    function loadEssential() {
        $.ajax({
            url: data.ApiUrl + "admin/GetResourceGroup/" + data.ConnectionBroker + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#essential_DataDeployAdmin").hide();
                $("#deplydemo .spinnerDiv").show();
            },
            success: function (res) {
                $("#anchClientURlhref").attr("href", res[0].ClientURL);
                $("#text_ResourceGroupNameDeployAdmin").text(res[0].ResourceGroupName);
                $("#text_LocationDeployAdmin").text(res[0].Location);
                $("#text_ClientURLDeployAdmin").text(res[0].ClientURL);
                $("#text_SubscriptionIDDeployAdmin").text(res[0].SubscriptionID);
                data.ApiSubscriptionId = res[0].SubscriptionID;
            },
            error: function (error) {
                LogError(data.ApiSubscriptionId, "Load Essentials", error);
                console.log("ERROR:", error);
            },
            complete: function () {
                $("#essential_DataDeployAdmin").show();
                $("#deplydemo .spinnerDiv").hide();
            }
        });
    };

    function refreshRDSessionHostServer() {
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/" + data.SessionHOSTServerRole + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#RDServerSpinnerDeployAdmin").show();
            },
            success: function (res) {
                try {
                    serverselectmodel.serverselect = res;
                    var element = $("#rdsserversDeployAdmin")[0];
                    ko.cleanNode(element);
                    ko.applyBindings(serverselectmodel, document.getElementById('rdsservers'));
                }
                catch (ex) {

                }

                $("#serverselectVar tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#serverselectVar tr").each(function () {
                        var trvalSub = $(this).text();
                        if (trval == trvalSub) {
                            IsDuplicate++;
                            if (IsDuplicate > 1) {
                                $(this).remove();
                            }
                        }
                    });
                });
                if (res != null) {
                    $("#vmServerCount").text(res.length);
                }
                else {
                    $("#vmServerCount").text(0);
                }
            },
            error: function (error) {
                // Log any error.
                LogError(data.ApiSubscriptionId, "Refresh RD Session Host Server", error);
                console.log("ERROR:", error);
            },
            complete: function () {
                $("#RDServerSpinnerDeployAdmin").hide();
            }
        });
    }
    function LoadRDSessionHostServerList() {
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/" + data.SessionHOSTServerRole + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#RDServerSpinnerDeployAdmin").show();
                $("#dplyserversshow .dockButtonList a").css("color", "#CDCDCD");
                $("#serverlistselectidDeployAdmin tbody").html('');
                $("#AddRDServerClickDeployeAdmin").attr("disabled", true);
                $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
                $("#enablerdserverDeployeAdmin").attr("disabled", true);
                $("#disablerdserverDeployeAdmin").attr("disabled", true);
                $("#ImportSHSDeployeAdmin").attr("disabled", true);
            },
            success: function (res) {
                $("#serverlistselectidDeployAdmin tbody").html('');
                if (res != null) {
                    for (var i = 0; i < res.length; i++) {
                        $("#serverlistselect .rowTemplate .Name").text(res[i].Name);
                        $("#serverlistselect .rowTemplate .Status").text(res[i].Status);
                        $("#serverlistselect .rowTemplate .Collection").text(res[i].Collection);
                        $("#serverlistselect .rowTemplate .Type").text(res[i].Type);
                        var rowTemplate = $("#serverlistselect .rowTemplate .dataRow tbody").html();
                        $("#serverlistselectidDeployAdmin tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#serverlistselect .rowTemplate .blankRow tbody").html();
                    $("#serverlistselectidDeployAdmin tbody").append(rowTemplate);
                }
                $("#serverlistselectidDeployAdmin tbody tr[class!='nodata']").unbind("click");
                $("#serverlistselectidDeployAdmin tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        selectedserverName();
                    }
                    else {
                        $('#serverlistselectidDeployAdmin tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        selectedserverName($(".Name", this).text().trim(), $(".Status", this).text().trim())
                    }
                });
            },
            error: function (error) {
                // Log any error.
                LoadSessionHostServersModalError.style.display = "block";
                LogError(data.ApiSubscriptionId, "Load RD Session Host Servers", error);
                console.log("ERROR:", error);
            },
            complete: function () {
                $("#AddRDServerClickDeployeAdmin").attr("disabled", false);
                $("#AddRDServerClickDeployeAdmin").attr("disabled", false);
                $("#RemoveRDServerDeployeAdmin").attr("disabled", true);
                $("#ImportSHSDeployeAdmin").attr("disabled", false);
                $("#RDServerSpinnerDeployAdmin").hide();
            }
        });
    }

    function LoadRDSessionHostServer() {
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/" + data.SessionHOSTServerRole + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#lblData_VM").hide();
                $("#tilesNoSpinner_VM").show();
            },
            success: function (res) {
                if (res == null) {
                    $("#vmServerCount").text("0");
                }
                else {
                    $("#vmServerCount").text(res.length);
                }
            },
            error: function (error) {
                LoadSessionHostServersModalError.style.display = "block";
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Load RD Session Host Server", error);
            },
            complete: function () {
                $("#lblData_VM").show();
                $("#tilesNoSpinner_VM").hide();
            }
        });
    }

    function refreshRDSDeploymentList() {
        $.ajax({
            url: data.ApiUrl + "subscriptions/GetList/" + data.ApiSubscriptionId + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#deploymentName").show();
            },
            success: function (res) {
                try {
                    deploymentsmodel.rddeployments = res;
                    var element = $("#rddeploymentslist")[0];
                    ko.cleanNode(element);
                    ko.applyBindings(deploymentsmodel, document.getElementById('rddeploymentslist'));
                }
                catch (ex) {

                }

                $("#deployment tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#deployment tr").each(function () {
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
                $("#deploymentName").hide();
            },
            error: function (error) {
                // Log any error.
                loadfailuremodal.style.display = "block";
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Refresh RD Deployment", error);
            }
        });
    }
    function collectionRefreshDeployIcon() {

        $.ajax({
            url: data.ApiUrl + "admin/GetCollections/" + connectionBrokerName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#tilesNoSpinner").show();
            },
            success: function (res) {
                if (res != null) {
                    $("#appCountSpanDeployAdmin").text(res.length);
                }
                else {
                    $("#appCountSpanDeployAdmin").text(0);
                }

            },
            complete: function () {
                $("#tilesNoSpinner").hide();
            },
            error: function (error) {
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Refresh Collections", error);
            }
        });

        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/" + "STATUS-RDS-RD-SERVER" + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#tilesNoSpinner").show();
            },
            success: function (res) {
                serverselectmodel.serverselect = res;
                var element = $("#rdsserversDeployAdmin")[0];
                ko.cleanNode(element);
                ko.applyBindings(serverselectmodel, document.getElementById('rdsservers'));
                $("#serverlistselectidDeployAdmin tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#serverlistselectidDeployAdmin tr").each(function () {
                        var trvalSub = $(this).text();
                        if (trval == trvalSub) {
                            IsDuplicate++;
                            if (IsDuplicate > 1) {
                                $(this).remove();
                            }
                        }
                    });
                });
                if (res != null) {
                    $("#appUsersSpan").text(res.length);
                }
                else {
                    $("#appUsersSpan").text(0);
                }

            },
            error: function (error) {
                // Log any error.
                console.log("ERROR:", error);
            },
            complete: function () {
                $("#tilesNoSpinner").hide();
            }
        });

    }

    function refreshCollectionTileCount() {
        $.ajax({
            url: data.ApiUrl + "admin/GetCollections/" + connectionBrokerName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#tilesNoSpinner_Collection").show();
                $("#lblData_Collection").hide();
            },
            success: function (res) {
                if (res != null) {
                    $("#appCountSpanDeployAdmin").text(res.length);
                }
                else {
                    $("#appCountSpanDeployAdmin").text(0);
                }

            },
            complete: function () {
                $("#lblData_Collection").show();
                $("#tilesNoSpinner_Collection").hide();
            },
            error: function (error) {
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Refresh Collection Tile Count", error);
            }
        });
    }

    function refreshSHSTileCount() {
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/" + data.SessionHOSTServerRole + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#tilesNoSpinner").show();
            },
            success: function (res) {
                if (res != null && JSON.stringify(serverselectmodel.serverselectTileCount) != JSON.stringify(res)) {
                    serverselectmodel.serverselectTileCount = res;
                    var element = $("#rdsserversDeployAdminTileCount")[0];
                    ko.cleanNode(element);
                    ko.applyBindings(serverselectmodel, document.getElementById('rdsserversTileCount'));
                }

                $("#serverlistselectidDeployAdminTileCount tr").each(function () {
                    var trval = $(this).text();
                    var IsDuplicate = 0;
                    $("#serverlistselectidDeployAdminTileCount tr").each(function () {
                        var trvalSub = $(this).text();
                        if (trval == trvalSub) {
                            IsDuplicate++;
                            if (IsDuplicate > 1) {
                                $(this).remove();
                            }
                        }
                    });
                });

                if (res != null) {
                    var vmservercount = res.length;
                    $("#vmServerCount").text(vmservercount);
                }
                else {
                    $("#vmServerCount").text(0);
                }
            },
            error: function (error) {
                // Log any error.
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Refresh Session Host Server Tile Count", error);
            },
            complete: function () {
                $("#tilesNoSpinner").hide();
            }
        });
    }

    function LoadLinkedResources() {
        //ajax call to fetch the data related to linked resources
        $.ajax({
            url: data.ApiUrl + "admin/GetServer/" + connectionBrokerName + "/",
            type: "GET",
            crossDomain: true,
            dataType: "json",
            beforeSend: function () {
                $("#linkedResourcespinner").show();
                $("#linkedresourcestable tbody").html('');
            },
            success: function (res) {
                $("#linkedresourcestable tbody").html('');
                if (res != null) {
                    for (var i = 0; i < res.length; i++) {
                        $("#linkedresourcemain .rowTemplate .Name").text(res[i].Name);
                        $("#linkedresourcemain .rowTemplate .Roles").text(res[i].Roles);
                        var rowTemplate = $("#linkedresourcemain .rowTemplate .dataRow tbody").html();
                        $("#linkedresourcestable tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#linkedresourcemain .rowTemplate .blankRow tbody").html();
                    $("#linkedresourcestable tbody").append(rowTemplate);
                }

            },
            error: function (error) {
                console.log("ERROR:", error);
                LogError(data.ApiSubscriptionId, "Load Linked Resources", error);
            },
            complete: function () {
                $("#linkedResourcespinner").hide();
            }
        });

    }


    function LoadErrorLogs() {
        var dateFrom = new Date($("#fromdateAL").val());
        var dateTo = new Date($("#todateAL").val());

        var fd = dateFrom.getFullYear() + "-" + (dateFrom.getMonth() + 1) + "-" + dateFrom.getDate() + " " + dateFrom.getHours() + ":" + dateFrom.getMinutes();
        var ft = dateTo.getFullYear() + "-" + (dateTo.getMonth() + 1) + "-" + dateTo.getDate() + " " + dateTo.getHours() + ":" + dateTo.getMinutes();

        var SelectedDplyNm = $("#deploymentId tbody tr[class='AppImageName'] .name").text().trim();

        var objCollection =
                   {
                       "FilterData": {
                           "StartDate": fd,
                           "EndDate": ft,
                           "MethodName": $("#searchFunctionbar").val(),
                           "DeploymentName": SelectedDplyNm,
                           "SubID": data.ApiSubscriptionId,
                       }
                   }
        var jsonData = JSON.stringify(objCollection);
        $.ajax({
            url: data.ApiUrl + "admin/GetErrors/logs/",
            type: "POST",
            crossDomain: true,
            data: jsonData,
            dataType: "json",
            beforeSend: function () {
                $("#errorLogSpinner").show();
                $("#ErrorLogTable tbody").html('');
            },
            success: function (res) {
                $("#ErrorLogTable tbody").html('');
                if (res.length > 0) {
                    for (var i = 0; i < res.length; i++) {
                        $("#logList .rowTemplate .Date").text(res[i].DateTime);
                        //$("#logList .rowTemplate .DeploymentName").text(res[i].DeploymentName);
                        $("#logList .rowTemplate .Function").text(res[i].MethodName);
                        $("#logList .rowTemplate .ErrorText").text(res[i].Message);
                        var rowTemplate = $("#logList .rowTemplate .dataRow tbody").html();
                        $("#ErrorLogTable tbody").append(rowTemplate);
                    }
                }
                else {
                    var rowTemplate = $("#logList .rowTemplate .blankRow tbody").html();
                    $("#ErrorLogTable tbody").append(rowTemplate);
                }
                $("#logList tbody tr[class!='nodata']").unbind("click");
                $("#logList tbody tr[class!='nodata']").click(function () {
                    if ($(this).hasClass("AppImageName")) {
                        $(this).removeClass('AppImageName');
                        $("#onlyErrorText").text("");
                        $("#errorMSGContainer").slideUp(500);
                    }
                    else {
                        $('#logList tbody tr').removeClass('AppImageName');
                        $(this).addClass('AppImageName');
                        var txtError = $(".ErrorText", this).text();
                        $("#onlyErrorText").text(txtError);
                        $("#errorMSGContainer").hide();
                        $("#errorMSGContainer").slideDown(500);
                    }
                });
                $("#errorLogSpinner").hide();
            },
            error: function (error) {
                // Log any error.
                LogError(data.ApiSubscriptionId, "Load Error Logs", error);
                console.log("ERROR:", error);
                $("#errorLogSpinner").hide();
            },
            complete: function () {

            }
        });
    }

    $("#closemsgerror").click(function () {
        $("#errorMSGContainer").hide();
        $("#ErrorLogTable tbody tr[class='AppImageName']").removeClass("AppImageName");
    });
    $("#errorLogButtonApply").click(function () {
        LoadErrorLogs();
    });

    $("#dplycollections").click(function () {
        $("#dplyburstclosebtn").trigger("click");
        $("#closeIconlinkedresources").trigger("click");
        $("#closeIconRenameDeployment").trigger("click");
        $("#closeIconRDSCollectionBlade").trigger("click");
        $("#dplyServersCloseBlade").trigger("click");
        $("#auditlogclosebtn").trigger("click");
        $("#appsuserslist").show();
        var strappCountSpanDeployAdmin = $("#appCountSpanDeployAdmin").text().trim();
        Deployname = $("#deploymentId tbody tr[class='AppImageName'] .name").text().trim();
        LoadRDSColletion();
        ScrollToHorizontalEndDeployAdmin($("#appsuserslist").width());
        AddBreadcrumb("RDS Collections", "appsuserslist", "dplydashboard");
        var appuserListLoader = $('#appsuserslistLoader');
        var appuserslistdiv = $('#appsuserslist');
        appuserListLoader.width(appuserslistdiv.width() + 1);
        appuserListLoader.height(appuserslistdiv.height());
        appuserslistdiv.show();
        appuserListLoader.show();

        setTimeout(function () {
            appuserListLoader.hide();
        }, 1000);

        $("#dplycollections").addClass("activeTile");
    });

    $("a[id^='LoaderClose_']").each(function () {
        $(this).click(function () {
            var originalDiv = $(this).attr("id").split('_')[1];
            $("#" + originalDiv).trigger("click");
        });
    });

    $("#errorLogButtonReset").click(function () {
        $("#fromdateAL").val("");
        $("#todateAL").val("");
        $("#searchFunctionbar").val("");


    });
    ///////////Start Smart Copy

    function makeSelection(element) {
        var doc = document, selection, range;
        if (doc.body.createTextRange) {
            var range = document.body.createTextRange();
            range.moveToElementText(element);
            range.select();
            doc.execCommand("copy")
        } else if (window.getSelection) {
            selection = window.getSelection();
            range = doc.createRange();
            range.selectNodeContents(element);
            selection.removeAllRanges();
            selection.addRange(range);
            doc.execCommand("copy");
        }
    }


});

////////////Ends Smart Copy
