$(document).ready(function () {
    $('#tblCustomers').DataTable();
    $("#MyCustomer").trigger("click");
    $("#btnCancel").click(function () {
        $("#dicAddCustomer").hide();
        $("#blockUI").hide();
    });
    $("#btnAddCustomer,#openAdd").click(function (event) {
        event.preventDefault();
        $("#blockUI").show();
        $("#dicAddCustomer").show();
        $("#dicAddCustomer input[type='text']").val('');
        $("#dicAddCustomer input[type='text']").removeClass("Redborder");
        $("#AddcustomerEmail").hide();
        $("#AddcustomerErrorMsg").hide()
    })
    $("#linkRDSDeployment").css("color", "gray")
    $("#tblCustomers tbody tr").each(function () {
        $(this).click(function () {
            $("#tblCustomers tbody tr").removeClass("table-row-selected");
            $(this).addClass("table-row-selected");
            $("#linkRDSDeployment").removeAttr("disabled");
            $("#linkRDSDeployment").css("color", "#0078d7")
        });
    });
    $(".linkRDSDeployment").click(function (event) {
        $(this).click(function () {
            $("#tblCustomers tbody tr").removeClass("table-row-selected");
            $(this).parent().addClass("table-row-selected");
        });
        $("#tblCustomers tbody tr").each(function () {
            $(this).click(function () {
                $("#tblCustomers tbody tr").removeClass("table-row-selected");
                $(this).addClass("table-row-selected");

                if ($("#tblCustomers tbody tr").hasClass("table-row-selected") == true) {
                    var CompanyName = $("#tblCustomers tbody tr.table-row-selected").find("td:eq(0)").text().trim();
                    var customerID = $("#tblCustomers tbody tr.table-row-selected").find("td:eq(2)").text().trim();
                    $.ajax({
                        url: "/Home/CustomerData",
                        type: "POST",
                        crossDomain: true,
                        dataType: "json",
                        data: { companyName: CompanyName, companyId: customerID },
                        success: function (res) {
                            var strHosterDomain = $("#hfHosterDomain").val();
                            var strClientID = $("#hfClientID").val();
                            var strRedirectURI = $("#hfRedirectURI").val();
                            var loginUrl = "https://login.microsoftonline.com/" + strHosterDomain + "/oauth2/authorize?client_id=" + strClientID + "&response_type=code&response_mode=form_post&redirect_uri=" + strRedirectURI + "&resource=https://graph.windows.net&prompt=admin_consent";
                            window.location.href = loginUrl;
                        },
                        complete: function () {
                            sessionStorage.clear();
                            sessionStorage.setItem("CompanyName", CompanyName)
                        }
                    });
                }
            });
        });
    });
    $("#AddCustomerFromId input[type='text']").keyup(function () {
        var txtThisID = $(this).attr("id");
        $("#" + txtThisID + "").removeClass("Redborder");
    });
    var count = '';
    var Isvalidate, IsEmailvalidate;
    $("#btnSubmit").click(function () {
        $("#AddCustomerFromId input[type='text']").each(function () {
            var curVal = $(this).val();
            if ((curVal == "")) {
                var txtThisID = $(this).attr("id");
                if (txtThisID == "txtAddress" || txtThisID == "txtZipcode" || txtThisID == "txtEMail" || txtThisID == "txtPhonenumber") {

                }
                else {
                    $("#" + txtThisID + "").addClass("Redborder");
                    $("#AddcustomerErrorMsg").show()
                    count++
                }
            }
            else {
                var txtThisID = $(this).attr("id");
                $("#" + txtThisID + "").removeClass("Redborder");
                $("#AddcustomerErrorMsg").hide()
                count--
            }
            if ($("#dropdownState").val() == "") {
                $("#dropdownState").addClass("Redborder");
            }
        });

        if ($("#txtEMail").val() != "") {

            var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            var result = regex.test($("#txtEMail").val());
            if (result == false) {
                isfilledazinfo = false;
                $("#AddcustomerEmail").show();
                $("#txtEMail").addClass("Redborder");
                IsEmailvalidate = false;
            }
            else {
                $("#AddcustomerEmail").hide();
                $("#txtEMail").removeClass("Redborder");
                IsEmailvalidate = true;
            }
        }
        else {
            $("#AddcustomerEmail").hide();
            $("#txtEMail").removeClass("Redborder");
            IsEmailvalidate = true;
        }

        if ((count <= 0) && (IsEmailvalidate == true)) {
            $("#AddcustomerEmail").hide();
            $("#AddcustomerErrorMsg").hide();
            var companyName = $("#txtCompanyName").val();
            var domainName = $("#txtDomainname").val();
            var address = $("#txtAddress").val();
            var city = $("#txtCity").val();
            var state = $("#dropdownState option:selected").val();
            var zipCode = $("#txtZipcode").val();
            var firstName = $("#txtFirstname").val();
            var lastName = $("#txtLastname").val();
            var emailID = $("#txtEMail").val();
            var phoneNumber = $("#txtPhonenumber").val();

            $.ajax({
                url: "/Home/CreateCustomer",
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: { companyName: companyName, domainName: domainName, address: address, city: city, state: state, zipCode: zipCode, firstName: firstName, lastName: lastName, emailID: emailID, phoneNumber: phoneNumber },
                beforeSend: function () {
                    $("#onlyLoader").show();
                },
                success: function (res) {
                    console.log(res.res);
                    $("#onlyLoader").hide();
                    location.reload();
                },
                error: function () {
                    $("#onlyLoader").hide();
                }
            });
        }
    });
    $("#openDelete").click(function () {
        event.preventDefault();
        var selectedCustomerId = "";
        $("#tblCustomers tbody tr").each(function () {
            if ($(this).hasClass("table-row-selected") == true) {
                selectedCustomerId = $(this).find("td:eq(2)").text().trim();
            }
        });
        $.ajax({
            url: "/Home/DeleteCustomer",
            type: "POST",
            crossDomain: true,
            dataType: "json",
            data: { selectedCustomerId: selectedCustomerId },
            beforeSend: function () {
                $("#blockUIwithLoader").show();
            },
            success: function (res) {
                console.log(res.res);
                $("#blockUIwithLoader").hide();
                location.reload();
            },
            error: function () { $("#blockUIwithLoader").hide(); }
        });
    });
});
