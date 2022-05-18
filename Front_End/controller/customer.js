//Customer======================================================================================================
$("#saveBtn").attr('disabled', true);
$(".custSearchbtn").attr('disabled', true);
$(".updateBtn").attr('disabled', true);
$(".dltBtn").attr('disabled', true);
var tempCustomer;
var nicRegEx = /^[0-9]{10}$/;
var nameRegEx = /^[A-z ]{5,20}$/;
var addressRegEx = /^[A-z ]{5,20}$/;
var contactRegEx = /^[0-9]{10}$/;

$('#txtCustNic,#txtCustName,#txtCustAddress,#txtCustContact').on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

$("#txtCustNic").keyup(function (event) {
    let temp = checkNic();
    btnAction1();
    if ("Enter" == event.key & temp == true) {
        $("#txtCustName").focus();
    }
})

function checkNic() {
    let temp = $("#txtCustNic").val();
    if (nicRegEx.test(temp)) {
        $("#txtCustNic").css('border', '2px solid green');
        tempOne = true;

        return true;
    } else {
        $("#txtCustNic").css('border', '2px solid red');
    }
}

$("#txtCustName").keyup(function (event) {
    let temp = checkName();
    btnAction1();
    if ("Enter" == event.key & temp == true) {
        $("#txtCustAddress").focus();
    }
})

function checkName() {
    let temp = $("#txtCustName").val();
    if (nameRegEx.test(temp)) {
        $("#txtCustName").css('border', '2px solid green');
        tempTwo = true;

        return true;
    } else {
        $("#txtCustName").css('border', '2px solid red');
    }
}

$("#txtCustAddress").keyup(function (event) {
    let temp = checkAddress();
    btnAction1();
    if ("Enter" == event.key & temp == true) {
        $("#txtCustContact").focus();
    }
})

function checkAddress() {
    let temp = $("#txtCustAddress").val();
    if (addressRegEx.test(temp)) {
        $("#txtCustAddress").css('border', '2px solid green');
        tempThree = true;

        return true;
    } else {
        $("#txtCustAddress").css('border', '2px solid red');
    }
}

$("#txtCustContact").keyup(function (event) {
    let temp = checkContact();
    btnAction1();
    if ("Enter" == event.key & temp == true) {
        saveCustomer();
    }
})

function checkContact() {
    let temp = $("#txtCustContact").val();
    if (contactRegEx.test(temp)) {
        $("#txtCustContact").css('border', '2px solid green');

        return true;

    } else {
        $("#txtCustContact").css('border', '2px solid red');
    }
}

function btnAction1() {
    let nic = $("#txtCustNic").val();
    if (nicRegEx.test(nic)) {
        let name = $("#txtCustName").val();
        if (nameRegEx.test(name)) {
            let address = $("#txtCustAddress").val();
            if (addressRegEx.test(address)) {
                let contact = $("#txtCustContact").val();
                if (contactRegEx.test(contact)) {
                    $("#saveBtn").attr('disabled', false);
                } else {
                    $("#saveBtn").attr('disabled', true);
                    return false;
                }
            } else {
                $("#saveBtn").attr('disabled', true);
                return false;
            }
        } else {
            $("#saveBtn").attr('disabled', true);
            return false;
        }
    } else {
        $("#saveBtn").attr('disabled', true);
        return false;
    }
}

//=============save===============//

$(".btn1").click(function () {
    saveCustomer();
})

function saveCustomer() {
    var serialize=$("#formFrame1").serialize();
    console.log(serialize)
    $.ajax({
        url: "http://localhost:8080/java_EE_pos/customer",
        method: "POST",
        data: serialize,
        success: function (resp) {
            alert("successfully added");
        },
        error:function (ob, textStatus, error) {
            alert(ob);
            alert(textStatus);
            alert(error);
        }
    })
   /* if (customerAvailability(custNic)) {
        alert("Customer Already Exists")
    } else {
        var customerObj = new CustomerObject(custNic, custName, custAddress, custContact);
        customer.push(customerObj);
        addCustomerToTable();
        clearTextField();
        //console.log(customer);
        $("#saveBtn").attr('disabled', true);
        $("#tbl1>tr").click(function () {
            $("#saveBtn").attr('disabled', true);
            let custID = $(this).children().eq(0).text();
            let custName = $(this).children().eq(1).text();
            let custAddrress = $(this).children().eq(2).text();
            let custContact = $(this).children().eq(3).text();
            tempCustomer = custID;
            $(".txtNIC").val(custID);
            $(".txtNAME").val(custName);
            $(".txtADDRESS").val(custAddrress);
            $(".txtCONTACT").val(custContact);

            $(".txtCustNicUp").val(custID);
            $(".txtCustNameUp").val(custName);
            $(".txtCustAddressUp").val(custAddrress);
            $(".txtCustContactUp").val(custContact);

            $(".updateBtn").attr('disabled', false);
            $(".dltBtn").attr('disabled', false);
        })
        $("#tbl1>tr").dblclick(function () {
            $(this).remove();
        })

    }*/
}

function customerAvailability(custNic) {
    for (var i = 0; i < customer.length; i++) {
        if (customer[i].id == custNic) {
            return true;
        }
    }
}

function addCustomerToTable() {
    $("#tbl1").empty();
    for (var i = 0; i < customer.length; i++) {
        let row1 = `<tr><td>${customer[i].id}</td><td>${customer[i].name}</td><td>${customer[i].address}</td><td>${customer[i].contact}</td></tr>`;
        $("#tbl1").append(row1);
    }
}

function clearTextField() {
    $(".txtNIC").val("");
    $(".txtNAME").val("");
    $(".txtADDRESS").val("");
    $(".txtCONTACT").val("");

    $(".txtCustNicUp").val("");
    $(".txtCustNameUp").val("");
    $(".txtCustAddressUp").val("");
    $(".txtCustContactUp").val("");
    $("#saveBtn").attr('disabled', true);
    $(".custSearchbtn").attr('disabled', true);
    $(".updateBtn").attr('disabled', true);
    $(".dltBtn").attr('disabled', true);
}

//=============update===============//

$(".updateBtn").click(function () {
    let custNic = $(".txtNIC").val();
    let custName = $(".txtNAME").val();
    let custAddress = $(".txtADDRESS").val();
    let custContact = $(".txtCONTACT").val();
    var customerObj = new CustomerObject(custNic, custName, custAddress, custContact);

    updateCustomer(tempCustomer, customerObj);

    clearTextField();
    addCustomerToTable();
    $("#tbl1>tr").click(function () {
        $("#saveBtn").attr('disabled', true);
        let custID = $(this).children().eq(0).text();
        let custName = $(this).children().eq(1).text();
        let custAddrress = $(this).children().eq(2).text();
        let custContact = $(this).children().eq(3).text();
        tempCustomer = custID;
        $(".txtNIC").val(custID);
        $(".txtNAME").val(custName);
        $(".txtADDRESS").val(custAddrress);
        $(".txtCONTACT").val(custContact);

        $(".txtCustNicUp").val(custID);
        $(".txtCustNameUp").val(custName);
        $(".txtCustAddressUp").val(custAddrress);
        $(".txtCustContactUp").val(custContact);

        $(".updateBtn").attr('disabled', false);
        $(".dltBtn").attr('disabled', false);

    })
    $("#saveBtn").attr('disabled', true);
    $(".updateBtn").attr('disabled', true);
    console.log(customer);
})

function updateCustomer(tempCustomer, customerObj) {
    for (var i = 0; i < customer.length; i++) {
        if (customer[i].id == tempCustomer) {
            customer[i].id = customerObj.id;
            customer[i].name = customerObj.name;
            customer[i].address = customerObj.address;
            customer[i].contact = customerObj.contact;
        }
    }
}

//============search & getAll===========//
$(".custSearchField").keyup(function (event) {
    var temp = $(".custSearchField").val();
    if (temp != null) {
        $(".custSearchbtn").attr('disabled', false);
    } else {
        $(".custSearchbtn").attr('disabled', true);
    }
})

$(".custSearchbtn").click(function () {
    var temp = $(".custSearchField").val();
    var result = searchCustomer(temp);
    if (result != null) {
        $("#tbl1").empty();
        let row1 = `<tr><td>${result.id}</td><td>${result.name}</td><td>${result.address}</td><td>${result.contact}</td></tr>`;
        $("#tbl1").append(row1);
    } else {
        alert("No Such a Customer")
    }
    $("#tbl1>tr").click(function () {
        $("#saveBtn").attr('disabled', true);
        let custID = $(this).children().eq(0).text();
        let custName = $(this).children().eq(1).text();
        let custAddrress = $(this).children().eq(2).text();
        let custContact = $(this).children().eq(3).text();
        tempCustomer = custID;
        $(".txtNIC").val(custID);
        $(".txtNAME").val(custName);
        $(".txtADDRESS").val(custAddrress);
        $(".txtCONTACT").val(custContact);

        $(".txtCustNicUp").val(custID);
        $(".txtCustNameUp").val(custName);
        $(".txtCustAddressUp").val(custAddrress);
        $(".txtCustContactUp").val(custContact);
        $(".updateBtn").attr('disabled', false);
        $(".dltBtn").attr('disabled', false);
    })
})

function searchCustomer(temp) {
    for (var i = 0; i < customer.length; i++) {
        if ((customer[i].id == temp) | (customer[i].name == temp) | (customer[i].address == temp) | (customer[i].contact == temp)) {
            return customer[i];
        }
    }
}

$(".seeAllBtn").click(function () {
    clearTextField();
    addCustomerToTable();
    $("#tbl1>tr").click(function () {
        $("#saveBtn").attr('disabled', true);
        let custID = $(this).children().eq(0).text();
        let custName = $(this).children().eq(1).text();
        let custAddrress = $(this).children().eq(2).text();
        let custContact = $(this).children().eq(3).text();
        tempCustomer = custID;
        $(".txtNIC").val(custID);
        $(".txtNAME").val(custName);
        $(".txtADDRESS").val(custAddrress);
        $(".txtCONTACT").val(custContact);

        $(".txtCustNicUp").val(custID);
        $(".txtCustNameUp").val(custName);
        $(".txtCustAddressUp").val(custAddrress);
        $(".txtCustContactUp").val(custContact);

        $(".updateBtn").attr('disabled', false);
        $(".dltBtn").attr('disabled', false);
    })
})

//============delete===========//
$(".dltBtn").click(function () {
    var temp = $(".txtCustNicUp").val();
        if (confirm("Are you sure you want to delete this?")) {
            deleteCustomer(temp);
            clearTextField();
            addCustomerToTable();
            $("#tbl1>tr").click(function () {
                $("#saveBtn").attr('disabled', true);
                let custID = $(this).children().eq(0).text();
                let custName = $(this).children().eq(1).text();
                let custAddrress = $(this).children().eq(2).text();
                let custContact = $(this).children().eq(3).text();
                tempCustomer = custID;
                $(".txtNIC").val(custID);
                $(".txtNAME").val(custName);
                $(".txtADDRESS").val(custAddrress);
                $(".txtCONTACT").val(custContact);

                $(".txtCustNicUp").val(custID);
                $(".txtCustNameUp").val(custName);
                $(".txtCustAddressUp").val(custAddrress);
                $(".txtCustContactUp").val(custContact);

                $(".updateBtn").attr('disabled', false);
                $(".dltBtn").attr('disabled', false);
            })
        }
})
function deleteCustomer(temp) {
    for (var i = 0; i < customer.length; i++) {
        if (customer[i].id == temp) {
            customer.splice(i,1);
        }
    }
}

//==============others=============//
$(".refreshBtn").click(function () {
    clearTextField();
    addCustomerToTable();
    $("#tbl1>tr").click(function () {
        $("#saveBtn").attr('disabled', true);
        let custID = $(this).children().eq(0).text();
        let custName = $(this).children().eq(1).text();
        let custAddrress = $(this).children().eq(2).text();
        let custContact = $(this).children().eq(3).text();

        $(".txtNIC").val(custID);
        $(".txtNAME").val(custName);
        $(".txtADDRESS").val(custAddrress);
        $(".txtCONTACT").val(custContact);

        $(".txtCustNicUp").val(custID);
        $(".txtCustNameUp").val(custName);
        $(".txtCustAddressUp").val(custAddrress);
        $(".txtCustContactUp").val(custContact);

        $(".updateBtn").attr('disabled', false);
        $(".dltBtn").attr('disabled', false);
    })
})