var SubId = "", Location = "", ResourceName = '';
var AdVNet, AdSubNet;

$(document).ready(function () {
    $("#tblDeployment tbody").click(function () {
        $("#tblDeployment tbody tr").removeClass("table-row-selected");
        if ($("#tblDeployment tbody tr").text() != "No data available in table") { $("#tblDeployment tbody tr").addClass("table-row-selected"); }
        $("#OpenCreateSHSImage").removeAttr("disabled");
        $("#OpenCreateSHSImage").css("color", "#0078d7")
    });
    $("#btnAddDeployment,#openAddDeployment").click(function (event) {
        event.preventDefault();
        $("#AdddeploymentsBC").show();
        $("#AddSHSBC").hide();
        $("#IsResourceValid").hide();
        $("#FailedDeplyError").hide();
        $("#SuccessDeplyError").hide();
        $("#IsVmSizesAvailable").hide();
        $("#ErrorMsgDeploy").hide();
        $("#dicAddDeployment input[type='text']").removeClass("Redborder");
        $("#dicAddDeployment input[type='password']").removeClass("Redborder");
        $("#dicAddDeployment select").removeClass("Redborder");
        $("#dicAddDeployment input[type='text']").val('');
        $("#dicAddDeployment input[type='password']").val('');
        $('input[type=radio][value="CreateFreshSHS"]').prop('checked', 'checked');
        var SubId = $("#dropdownSub").val();
        $("#FreshVHDMenuForm").hide();
        $("#UnmanagedVM").hide();
        $("#AzureVmImage").hide();
        $("#blockUI").show();
        $("#dicAddDeployment").show();
        $("#txtIPAddress").val("10.0.0.1")
        LoadResourceValue();
    });
    $("#btnCancel").click(function () {
        $("#dicAddDeployment").hide();
        $("#AdddeploymentsBC").hide();
        $("#AddSHSBC").hide();
    });
    $("#dropdownOffer").change(function () {
        var desc = $("#dropdownOffer option:selected").attr('desc');
        $("#lblDescription").text(desc);
    });
    $("#dicAddDeployment input[type='text']").keyup(function () {
        var txtThisID = $(this).attr("id");
        $("#" + txtThisID + "").removeClass("Redborder");
        $("#txtAdminpassword").removeClass("Redborder");
    });
    $("#txtAdminpassword").keyup(function () {
        $("#txtAdminpassword").removeClass("Redborder");
    });
    $("input[name='rdDomain']").change(function () {
        var domainFlag = $(this).val();
        if (domainFlag == 0) {
            $(".newDomain").show();
            $(".existingDomain").hide();
            $(".newexistingtext").text("New");
        }
        else if (domainFlag == 1) {
            $(".newDomain").hide();
            $(".existingDomain").show();
            $(".newexistingtext").text("Existing");
        }
    });
    $("#OpenCreateSHSImage").click(function () {
        $("#AdddeploymentsBC").hide();
        $("#AddSHSBC").show();
        $("#CreateSHSfromImageDiv").show();
        $("#CreateSHSfromImageDiv input[type='text'] , #CreateSHSfromImageDiv input[type='password']").val('');
        $("#CreateSHSfromImageDiv input[type='text'] , #CreateSHSfromImageDiv input[type='password']").removeClass("Redborder");
        $("#txtSHSIPAddress").val("10.0.0.1");
        $("#SHSRG").removeClass("Redborder");
        $("#SHSAzureVmImages").removeClass("Redborder");
        $("#CreateSHSfromImageDiv p").hide();
        $("#tblDeployment tbody tr.table-row-selected td:nth-child(1)").text().trim();
        $("#tblDeployment tbody tr.table-row-selected td:nth-child(2)").text().trim();
        $("#TxtSubscriptionID").val($("#tblDeployment tbody tr.table-row-selected td:nth-child(1)").text().trim());
        $("#TxtDeplyName").val($("#tblDeployment tbody tr.table-row-selected td:nth-child(2)").text().trim());
        $("#blockUI").show();
        LoadVmImageList();
        LoadSHSResourceGroup();
    });
    $("#OpenCreateSHSImage, #openDeleteDeployment").css("color", "gray")
    $("#btnCancelSHS").click(function () {
        $("#CreateSHSfromImageDiv").hide();
        $("#blockUI").hide();
        $("#AdddeploymentsBC").hide();
        $("#AddSHSBC").hide();
    });
    var count1 = '';
    $("#CreateSHSfromImageBtn").click(function () {
        count1 = '';
        var ISVmImageValid = true;
        var IsSHSValid = true
        var IsRGNamevalid = true;
        var IsVMSizevalid = true;
        if (($("#SHSAzureVmImages option:selected").text() == "No VM images available") || ($("#SHSAzureVmImages").val() == "")) {
            ISVmImageValid = false
            $("#SHSAzureVmImages").addClass("Redborder");
            $("#VMImageSHSError").show();
        }
        else {
            $("#SHSAzureVmImages").removeClass("Redborder");
            $("#VMImageSHSError").hide();
            ISVmImageValid = true
        }
        if ($("#SHSRG").val() == "" || ($("#SHSRG").val() == "No Resource Groups found with this Id")) {
            $("#ValidSHSRG").show();
            $("#SHSRG").addClass("Redborder");
            IsRGNamevalid = false;
        }
        else {
            $("#SHSRG").removeClass("Redborder");
            $("#ValidSHSRG").hide();
            IsRGNamevalid = true;
        }
        if (($("#AzureSHSVMSizes").val() == "") && ($("#AzureSHSVMSizes").val() == "No Vms available")) {
            $("#ValidVMSize").show();
            $("#AzureSHSVMSizes").addClass("Redborder");
            IsVMSizevalid = false;
        }
        else {
            $("#ValidVMSize").hide();
            $("#AzureSHSVMSizes").removeClass("Redborder");
            IsVMSizevalid = true;
        }
        if ($("#ShsAdminpassword").val() == "") {
            $("#ShsAdminpassword").addClass("Redborder");
            IsSHSValid = false;
        }
        else {
            $("#ShsAdminpassword").removeClass("Redborder");
            IsSHSValid = true;
        }
        $("#CreateSHSfromImageDiv input[type='text']").each(function () {
            var curVal = $(this).val();
            if ((curVal == "")) {
                var txtThisID = $(this).attr("id");
                if ((txtThisID == "TxtSubscriptionID") || (txtThisID == "TxtDeplyName") || (txtThisID == "txtSHSIPAddress")) {

                }
                else {
                    $("#" + txtThisID + "").addClass("Redborder");
                    count1++;
                    $("#ValidErrorTxtbx").show()
                }
            }
            else {
                var txtThisID = $(this).attr("id");
                if ((txtThisID == "TxtSubscriptionID") || (txtThisID == "TxtDeplyName") || (txtThisID == "txtSHSIPAddress")) {

                }
                else {
                    var txtThisID = $(this).attr("id");
                    $("#" + txtThisID + "").removeClass("Redborder");
                    count1--
                    $("#ValidErrorTxtbx").hide()
                }
            }
        });
        if ((ISVmImageValid == true) && (IsSHSValid == true) && (IsRGNamevalid == true) && (IsVMSizevalid == true) && (count1 <= 0)) {
            $("#ShstxtNoOfRDSH").removeClass("Redborder");
            $("#SHSAzureVmImages").removeClass("Redborder");
            $("#SHSRG").removeClass("Redborder");
            $("#AzureSHSVMSizes").removeClass("Redborder");
            $("#ValidVMSize").hide();
            $("#NoOfSHSError").hide();
            $("#ValidSHSRG").hide();
            $("#VMImageSHSError").hide();
            CreateSHSFromImage();
        }
    });
    var count = '';
    var Isvalidate;
    var IsResourceValid;
    var IsVmSizesAvailable;
    var IsVmListAvailable;
    var IsIpvalidate = true;
    var AzureVmImages = true;
    $("#CreateDeploymentBtn").click(function () {
        count = '';
        if ($("#dropdownRG").val() == "No Resource Groups found with this Id") {
            $("#dropdownRG").addClass("Redborder");
            IsResourceValid = false;
            $("#IsResourceValid").show();
        }
        else {
            IsResourceValid = true
            $("#IsResourceValid").hide();
        }
        if ($("#dropdownVMSizes").val() == "No Vm size available") {
            $("#dropdownVMSizes").addClass("Redborder");
            IsVmSizesAvailable = false;
            $("#IsVmSizesAvailable").show();
        }
        else {
            IsVmSizesAvailable = true;
            $("#IsVmSizesAvailable").hide();
        }
        if ($("#AzureVmImages").is(":visible")) {
            if (($("#AzureVmImages option:selected").text() == "No VM images available") || ($("#AzureVmImages").val() == "")) {
                AzureVmImages = false
                $("#AzureVmImages").addClass("Redborder");
                $("#ErrorAzureVmImages").show();
            }
            else {
                $("#AzureVmImages").removeClass("Redborder");
                $("#ErrorAzureVmImages").hide();
                AzureVmImages = true
            }
        }
        else {
            $("#AzureVmImages").removeClass("Redborder");
            $("#ErrorAzureVmImages").hide();
            AzureVmImages = true
        }
        if ($("#VMList").is(":visible") == true) {
            if ($("#VMList").val() == "No VMs available") {
                $("#VMList").addClass("Redborder");
                IsVmListAvailable = false;
            }
            else {
                IsVmListAvailable = true;
                $("#VMList").removeClass("Redborder");
            }
        }
        else {
            $("#VMList").removeClass("Redborder");
            IsVmListAvailable = true;
        }
        $("#dicAddDeployment input[type='text']").each(function () {
            var curVal = $(this).val();
            if ((curVal == "")) {
                var txtThisID = $(this).attr("id");
                if (txtThisID == "txtIPAddress") { }
                else {
                    $("#" + txtThisID + "").addClass("Redborder");
                    $("#ErrorMsgDeploy").show()
                    count++
                }
            }
            else {
                var txtThisID = $(this).attr("id");
                $("#" + txtThisID + "").removeClass("Redborder");
                $("#ErrorMsgDeploy").hide()
                count--
            }
        });
        if ($("#txtAdminpassword").val() == "") {
            $("#txtAdminpassword").addClass("Redborder");
            $("#ErrorMsgDeploy").show()
        }
        if ($("#txtIPAddress").val() != "") {
            var regex = /^([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})[.]([0-9]{1,3})$/;
            var result = regex.test($("#txtIPAddress").val());
            if (result == false) {
                isfilledazinfo = false;
                $("#InvalidIPAddressP").show();
                $("#txtIPAddress").addClass("Redborder");
                IsIpvalidate = false;
            }
            else {
                $("#InvalidIPAddressP").hide();
                $("#txtEMail").removeClass("Redborder");
                IsIpvalidate = true;
            }
        }
        if ((count <= 0) && (IsIpvalidate == true) && (IsResourceValid == true) && (IsVmSizesAvailable == true) && (IsVmListAvailable == true)) {
            if ($("#rdDomain_new").is(":checked")) {
                CreatenewDomainAD();
            }
            else if ($("#rdDomain_existing").is(":checked")) {
                UseExistingDomainAD();
            }
        }
        else { }
    });
    function CreatenewDomainAD() {
        if ($("#radioFreshSHS").is(":checked")) {
            CreateRDSFromFreshSHS();
        } else if ($("#radioSHSImage").is(":checked")) {
            CreateRDSFromImage();
        }
    }
    function UseExistingDomainAD() {
        if ($("#radioFreshSHS").is(":checked")) {
            CreateRDSFromFreshSHS();
        } else if ($("#radioSHSImage").is(":checked")) {
            CreateRDSFromImage();
        }
    }
    $("input[name='createSHS']").click(function () {
        if ($("#radioFreshSHS").is(":checked")) {
            $("#FreshVHDMenuForm").hide();
            $("#UnmanagedVM").hide();
            $("#AzureVmImage").hide();
        } else if ($("#radioSHSImage").is(":checked")) {
            $("#FreshVHDMenuForm").show();
            $("#UnmanagedVM").hide();
            $("#AzureVmImage").show();
        }
    });
    $("#FreshVHDMenu").change(function () {
        $("#UnmanagedVM").hide();
        $("#AzureVmImage").hide();
        $('#' + $(this).val()).show();
    });
    $("#btnCreateSubscription").click(function () {
        var offerid = $("#dropdownOffer option:selected").val();
        var newsubscriptionname = $("#txtSubscriptionName").val();
        $.ajax({
            url: "/Home/CreateSubscription",
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: {
                customerId: $("#hfCustId").val(), offerId: offerid, friendlyName: newsubscriptionname
            },
            beforeSend: function () {
                $("#onlyLoader").show();
            },
            success: function (res) {
                console.log(res.res);
                $("#onlyLoader").hide();
                location.reload();
            },
            error: function () { $("#onlyLoader").hide(); }
        });
    });
    $("#TxtResourceName").keyup(function () {
        $("#TxtResourceName").removeClass("Redborder");
        $("#ErrorMsgTxt").hide();
    });
    $("#btnCreateResource").click(function () {
        SubId = $("#Subscription").val();
        Location = $("#LocationSelect").val();
        ResourceName = $("#TxtResourceName").val();
        if ((SubId == "") || (Location == "") || (ResourceName == "")) {
            if (SubId == "") {
                $("#Subscription").addClass("Redborder");
            }
            if ((Location == "")) {
                $("#LocationSelect").addClass("Redborder");
            }
            if (Location == "No Locations available") {
                $("#LocationSelect").addClass("Redborder");
                $("#ErrorMsgLocation").show();
            }
            if (ResourceName == "") {
                $("#TxtResourceName").addClass("Redborder");
                $("#ErrorMsgTxt").show();
            }
        }
        else {
            $("#ErrorMsgLocation").hide();
            $("#LocationSelect").removeClass("Redborder");
            $("#TxtResourceName").removeClass("Redborder");
            $("#Subscription").removeClass("Redborder");
            CreateResourceName();
        }
    });
    $("#dropdownSub").change(function () {
        LoadResourceValue();
        $("#dropdownRG").removeClass("Redborder");
        $("#dropdownVMSizes").removeClass("Redborder");
        $("#IsResourceValid").hide();
        $("#IsVmSizesAvailable").hide();
    });
    $("#Subscription").change(function () {
        LoadLocations();
    });
    $("#BtnCreateAnewResourceName").click(function () {
        LoadLocations();
        $("#ErrorMsgLocation").hide();
        $("#ErrorMsgTxt").hide();
        $("#FailedError").hide();
        $("#LocationSelect").removeClass("Redborder");
        $("#TxtResourceName").removeClass("Redborder");
        $("#Subscription").removeClass("Redborder");
        $("#createAnewResourceName input[type='text']").val("");
        var subid = $("#createAnewResourceName input[type='hidden']").val();
        $("#SubscriptionID").val(subid);
        var subName = $("#dropdownSub option:selected").text();
        $("#Subscription").val(subName);
    });
    $("#dropdownRG").change(function () {
        GetVms();
        GetVmList();
    });
    $("#LocationSelect").change(function () {
        $("#ErrorMsgTxt").hide();
    });
    $("#SHSRG").change(function () {
        LoadVmImageList();
    })
    function LoadResourceValue() {
        SubId = $("#dropdownSub").val();
        $.ajax({
            url: "/Home/GetResourceGroups?SubId=" + SubId,
            type: "GET",
            crossDomain: true,
            headers: {
                'Authorization': sessionStorage.getItem('Access_Token')
            },
            beforeSend: function () {
                $("#onlyLoaderDepl").show();
                $("#dropdownRG").html('')
            },
            complete: function () {
                GetVmList();
                GetVMImageList();
                GetVms();
            },
            success: function (res) {
                $("#onlyLoaderDepl").hide();
                if (res.length > 0) {
                    for (i = 0; i < res.length; i++) {
                        $("#dropdownRG").append("<option value=" + res[i].Location + ">" + res[i].Name + "</option>");
                    }
                }
                else {
                    $("#dropdownRG").append("<option>No Resource Groups found with this Id</option>");
                }
            },
            error: function () { $("#onlyLoaderDepl").hide(); }
        });
    }
});

function LoadSHSResourceGroup() {
    SubId = $("#TxtSubscriptionID").val();
    $.ajax({
        url: "/Home/GetResourceGroups?SubId=" + SubId,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#SHSRG").html('')
        },
        complete: function () {
            GetVms();
        },
        success: function (res) {
            $("#onlyLoaderDepl").hide();
            if (res.length > 0) {
                for (i = 0; i < res.length; i++) {
                    $("#SHSRG").append("<option value=" + res[i].Location + ">" + res[i].Name + "</option>");
                }
            }
            else {
                $("#SHSRG").append("<option>No Resource Groups found with this Id</option>");
            }
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
        }
    });
}

function LoadLocations() {
    var SubId = $("#dropdownSub").val();
    $.ajax({
        url: "/Home/GetLocations?SubId=" + SubId,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#LocationSelect").html('')
        },
        success: function (res) {
            $("#onlyLoaderDepl").hide();
            if (res.length > 0) {
                for (i = 0; i < res.length; i++) {
                    $("#LocationSelect").append("<option value=" + res[i].Name + ">" + res[i].DisplayName + "</option>");
                }
            }
            else {
                $("#LocationSelect").append("<option>No Locations available</option>");
            }
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
        }
    });
}

function CreateResourceName() {
    var SubId = $("#dropdownSub").val();
    $.ajax({
        url: "/Home/CreateResourceGroups?SubId=" + SubId + "&resourcegroupName=" + ResourceName + "&location=" + Location + "&TagName=tagtest",
        type: "POST",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoader").show();
            $("#btnCreateResource").removeAttr("data-dismiss", "modal")
        },
        success: function (res) {
            $("#onlyLoader").hide();
            $("#FailedError").hide();
            $("#CreateRGClosebtn").trigger("click")
            $("#dropdownRG").append("<option value=" + ResourceName + " selected>" + ResourceName + "</option>");
        },
        error: function () {
            $("#onlyLoader").hide();
            $("#FailedError").show();
        }
    });
}

function GetVms() {
    if ($("#dicAddDeployment").is(":visible")) {
        var SubId = $("#dropdownSub").val();
        var Locationvalue = $("#dropdownRG").val();
    }
    else if ($("#CreateSHSfromImageDiv").is(":visible")) {
        var SubId = $("#TxtSubscriptionID").val();
        var Locationvalue = $("#SHSRG").val()
    }

    $.ajax({
        url: "/Home/GetVmSizes?SubId=" + SubId + "&Location=" + Locationvalue,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#dropdownVMSizes").html('');
            $("#AzureSHSVMSizes").html('');
        },
        complete: function () {
            GetVmList();
        },
        success: function (res) {
            $("#onlyLoaderDepl").hide();
            if (res.length > 0) {
                if ($("#dicAddDeployment").is(":visible")) {
                    if (res.length > 0) {
                        for (i = 0; i < res.length; i++) {
                            $("#dropdownVMSizes").append("<option value=" + res[i].Name + ">" + res[i].Name + "</option>");
                        }
                    }
                }
                else if ($("#CreateSHSfromImageDiv").is(":visible")) {
                    if (res.length > 0) {
                        for (i = 0; i < res.length; i++) {
                            $("#AzureSHSVMSizes").append("<option value=" + res[i].Name + ">" + res[i].Name + "</option>");
                        }
                    }
                }
            }
            else {
                if ($("#dicAddDeployment").is(":visible")) {
                    $("#dropdownVMSizes").append("<option>No Vm size available</option>");
                }
                else if ($("#CreateSHSfromImageDiv").is(":visible")) {
                    $("#AzureSHSVMSizes").append("<option>No Vms available</option>");
                }
            }
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
        }
    });
}

function GetVMImageList() {
    var SubId = $("#dropdownSub").val();
    $.ajax({
        url: "/Home/GetVMImageListBySubId?SubId=" + SubId,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#AzureVmImages").html('')
        },
        success: function (res) {
            $("#onlyLoaderDepl").hide();
            if (res.length > 0) {
                for (i = 0; i < res.length; i++) {
                    $("#AzureVmImages").append("<option value=" + res[i].Id + ">" + res[i].Name + "</option>");
                }
            }
            else {
                $("#AzureVmImages").append("<option>No VM images available</option>");
            }
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
        }
    });
}

function LoadVmImageList() {
    var SubId = $("#TxtSubscriptionID").val();
    $.ajax({
        url: "/Home/GetVMImageListBySubId?SubId=" + SubId,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDeplSHS").show();
            $("#SHSAzureVmImages").html('')
        },
        success: function (res) {
            $("#onlyLoaderDeplSHS").hide();
            if (res.length > 0) {
                for (i = 0; i < res.length; i++) {
                    $("#SHSAzureVmImages").append("<option value=" + res[i].Id + ">" + res[i].Name + "</option>");
                }
            }
            else {
                $("#SHSAzureVmImages").append("<option>No VM images available</option>");
            }
        },
        error: function () {
            $("#onlyLoaderDeplSHS").hide();
        }
    });
}

function GetVmList() {
    var SubId = $("#dropdownSub").val();
    $.ajax({
        url: "/Home/GetVMListBySubId?SubId=" + SubId,
        type: "GET",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#VMList").html("")
        },
        success: function (res) {
            $("#onlyLoaderDepl").hide();
            if (res.length > 0) {
                for (i = 0; i < res.length; i++) {
                    $("#VMList").append("<option value=" + res[i].Name + ">" + res[i].Name + "</option>");
                }
            }
            else {
                $("#VMList").append("<option>No VMs available</option>");
            }
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
        }
    });
}

function CreateRDSFromFreshSHS() {
    if ($("#txtVNetName").is(":visible")) {
        var AdVNet = $("#txtVNetName").val();
        var AdSubNet = $("#txtSubnetName").val();
    }
    else {
        var AdVNet = "null";
        var AdSubNet = "null";
    }
    var SubId = $("#dropdownSub").val();
    var ResourceName = $("#dropdownRG option:selected").text();
    var DeployName = $("#txtDeploymentname").val();
    var IPAddress = $("#txtIPAddress").val();
    var ADDName = $("#txtDomainName").val();
    var AdminUserName = $("#txtAdminUsername").val();
    var AdminPassword = $("#txtAdminpassword").val();
    var WindowsServer = $("#dropdownWindowsServer").val();
    var VMSize = $("#dropdownVMSizes").val();
    var RDSHSCount = $("#txtNoOfRDSH").val();
    var url = (window.location.href).split('/')[2];
    $.ajax({
        url: "/Home/CreateRDS?SubscriptionID=" + SubId + "&ResourceGroup=" + ResourceName + "&RDSDeploymentName=" + DeployName + "&IPAddress=" + IPAddress + "&ADDomainName=" + ADDName + "&AdminUsername=" + AdminUserName + "&AdminPassword=" + AdminPassword + "&WindowsServer=" + WindowsServer + "&VMSizes=" + VMSize + "&NoOfRDSHS=" + RDSHSCount + "&URL=" + url + "&AzureVmImage=null&subnetName=" + AdSubNet + "&vNetName=" + AdVNet,
        type: "POST",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#blockUIwithLoader").show();
        },
        success: function (res) {
            if (res.aaData == "1") {
                $("#SuccessDeplyError").show();
                $("#FailedDeplyError").hide();
            }
            else {
                $("#FailedDeplyError").show();
                $("#SuccessDeplyError").hide();
            }
            $("#onlyLoaderDepl").hide();
            $("#blockUIwithLoader").hide();
            $("#FailedError").hide();
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
            $("#blockUIwithLoader").hide();
            $("#FailedError").show();
        }
    });
}

function CreateRDSFromImage() {
    if ($("#txtVNetName").is(":visible")) {
        var AdVNet = $("#txtVNetName").val();
        var AdSubNet = $("#txtSubnetName").val();
    }
    else {
        var AdVNet = "null";
        var AdSubNet = "null";
    }
    var SubId = $("#dropdownSub").val();
    var ResourceName = $("#dropdownRG option:selected").text();
    var DeployName = $("#txtDeploymentname").val();
    var IPAddress = $("#txtIPAddress").val();
    var ADDName = $("#txtDomainName").val();
    var AdminUserName = $("#txtAdminUsername").val();
    var AdminPassword = $("#txtAdminpassword").val();
    var WindowsServer = $("#dropdownWindowsServer").val();
    var VMSize = $("#dropdownVMSizes").val();
    var RDSHSCount = $("#txtNoOfRDSH").val();
    var AzureVmImages = $("#AzureVmImages").val();
    var location = $("#dropdownRG").val()
    var url = (window.location.href).split('/')[2];
    $.ajax({
        url: "/Home/CreateRDS?SubscriptionID=" + SubId + "&ResourceGroup=" + ResourceName + "&RDSDeploymentName=" + DeployName + "&IPAddress=" + IPAddress + "&ADDomainName=" + ADDName + "&AdminUsername=" + AdminUserName + "&AdminPassword=" + AdminPassword + "&WindowsServer=" + WindowsServer + "&VMSizes=" + VMSize + "&NoOfRDSHS=" + RDSHSCount + "&URL=" + url + "&Location=" + location + "&AzureVmImage=" + AzureVmImages + "&subnetName=" + AdSubNet + " & vNetName=" + AdVNet,
        type: "POST",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDepl").show();
            $("#blockUIwithLoader").show();
        },
        success: function (res) {
            if (res.aaData == "1") {
                $("#SuccessDeplyError").show();
                $("#FailedDeplyError").hide();
            }
            else {
                $("#FailedDeplyError").show();
                $("#SuccessDeplyError").hide();
            }
            $("#onlyLoaderDepl").hide();
            $("#blockUIwithLoader").hide();
            $("#FailedError").hide();
        },
        error: function () {
            $("#onlyLoaderDepl").hide();
            $("#blockUIwithLoader").hide();
            $("#FailedError").show();
        }
    });
}

function CreateSHSFromImage() {
    var subid = $("#TxtSubscriptionID").val();
    var resourceName = $("#SHSRG option:selected").text();
    var ResourceLocation = $("#SHSRG").val();
    var DeployName = $("#TxtDeplyName").val();
    var AdminName = $("#ShsAdminUserName").val();
    var AdminPassword = $("#ShsAdminpassword").val();
    var VMImage = $("#SHSAzureVmImages").val();
    var VMSize = $("#AzureSHSVMSizes").val();
    var NoOfRDSH = $("#ShstxtNoOfRDSH").val();
    var IPAddress = $("#txtSHSIPAddress").val();
    $.ajax({
        url: "/Home/CreateSHSFromImage?SubscriptionID=" + subid + "&ResourceGroup=" + resourceName + "&RDSDeploymentName=" + DeployName + "&IPAddress=" + IPAddress + "&AdminUsername=" + AdminName + "&AdminPassword=" + AdminPassword + "&VMSizes=" + VMSize + "&NoOfRDSHS=" + NoOfRDSH + "&Location=" + ResourceLocation + "&AzureVmImage=" + VMImage,
        type: "POST",
        crossDomain: true,
        headers: {
            'Authorization': sessionStorage.getItem('Access_Token')
        },
        beforeSend: function () {
            $("#onlyLoaderDeplSHS").show();
        },
        complete: function () {
            $("#onlyLoaderDeplSHS").hide();
        },
        success: function (res) {
            if (res == "1") {
                $("#SuccessSHSImageError").show();
                $("#FailedSHSImageError").hide();
            }
            else {
                $("#FailedSHSImageError").show();
                $("#SuccessSHSImageError").hide();
            }
        }
    });
}