//Order======================================================================================================
$(".saveOrderBtn").attr('disabled', true)
$(".OrderDltBtn").attr('disabled', true)
$(".purchaseBtn").attr('disabled', true)
var total=0;
var totalLbl=0;
var totalLbl2=0;
var qtyRegEx = /^[0-9]{1,20}$/;
var cashRegEx = /^[0-9]{1,20}$/;
$('#selectCustomer,#selectItem,#Quantity').on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

$("#selectCustomer").change(function () {
    let temp = $("#selectCustomer").val();
    btnAction3();
    if (temp != null) {
        $("#selectCustomer").css('border', '2px solid green');
    }
})

$("#selectItem").change(function () {
    let temp = $("#selectItem").val();
    btnAction3();
    if (temp != null) {
        $("#selectItem").css('border', '2px solid green');
    }
})

$("#Quantity").keyup(function (event) {
    let temp = checkQuantity();
    btnAction3();
    if ("Enter" == event.key & temp == true) {
        $("#Discount").focus();
    }
})

function checkQuantity() {
    let temp = $("#Quantity").val();
    if (qtyRegEx.test(temp)) {
        $("#Quantity").css('border', '2px solid green');
        return true;
    } else {
        $("#Quantity").css('border', '2px solid red');
    }
}

function btnAction3() {
    let selectedCustomer = $("#selectCustomer").val();
    if (selectedCustomer != "Select Customer") {
        let selectedItem = $("#selectItem").val();
        if (selectedItem != "Select Item") {
            let qty = $("#Quantity").val();
            if (qtyRegEx.test(qty)) {
                    $(".saveOrderBtn").attr('disabled', false);
            } else {
                $(".saveOrderBtn").attr('disabled', true);
                return false;
            }
        } else {
            $(".saveOrderBtn").attr('disabled', true);
            return false;
        }
    } else {
        $(".saveOrderBtn").attr('disabled', true);
        return false;
    }

}


//========save==========//
$(".saveOrderBtn").click(function () {
    saveorder();

})

function saveorder() {
    var tempItem1=finditem($("#selectItem").val());
    var availableQty=tempItem1.qty;
    var requestedQty=$("#Quantity").val()*1;
    if(requestedQty>availableQty){
        alert("insufficient items");
    }else {
        //var itemName=checkItemAvailability($("#selectItem").val());
        if (checkItemAvailability($("#selectItem").val())) {
            var itemCode = tempItem1.code;
            var itemName = tempItem1.name;
            var itemPrice = tempItem1.price;
            var itemQty = $("#Quantity").val()*1;
            var totalPrice = itemPrice * itemQty;
            for (var i = 0; i < orderDetail.length; i++) {
                if (orderDetail[i].code == itemCode) {
                    orderDetail[i].code = itemCode
                    orderDetail[i].name = itemName;
                    orderDetail[i].price = itemPrice;
                    //var qty=itemQty*1;
                    orderDetail[i].qty = orderDetail[i].qty + itemQty;
                    orderDetail[i].totalPrice = orderDetail[i].totalPrice +totalPrice;
                }
            }
            addOrderToTable();
            changeQuantity(itemCode, itemQty);
            setTotalPriceToLable();
        } else {
            var itemCode = tempItem1.code;
            var itemName = tempItem1.name;
            var itemPrice = tempItem1.price;
            var itemQty = $("#Quantity").val()*1;
            var totalPrice = itemPrice * itemQty;

            var orderDetails = new OrderDetails(itemCode, itemName, itemPrice, itemQty, totalPrice);
            orderDetail.push(orderDetails);
            addOrderToTable();
            console.log(item)
            changeQuantity(itemCode, itemQty);
            setTotalPriceToLable();

        }
    }
}
function changeQuantity(itemCode,itemQty) {
    for(var i=0;i<item.length;i++){
        if(item[i].code==itemCode){
            var currentQty=item[i].qty;
            item[i].qty=currentQty-itemQty;
        }
    }
    setItemDetails();
    console.log(item)
}
function checkItemAvailability(itemName) {
    for(var i=0;i<orderDetail.length;i++){
        if(orderDetail[i].name==itemName){
            return true;
        }
    }
}
function setTotalPriceToLable() {
    for (var i=0;i<orderDetail.length;i++){
        total+=orderDetail[i].totalPrice;
    }
    console.log(total)
    $("#totalpriceLbl").text("Rs. "+total)
    $("#subTotalpriceLbl").text("Rs. "+total)
    totalLbl=total
    totalLbl2=total
    total=0;
}

//========purchase==========//
$(".purchaseBtn").click(function () {
    makeOrder();
})
function makeOrder() {
    var cashTemp=$(".txtCash").val()*1;
    if(cashTemp<totalLbl2){
        $(".txtCash").css('border','2px solid red')
        alert("Insufficient balance")
    }else {
        let oid ="Order-"+makeOrderId();
        let date = today;
        let selectedCustomer = $("#selectCustomer").val();
        let totalPrice = $("#subTotalpriceLbl").text();
        let cash = $(".txtCash").val();
        let discount = $(".txtDiscount").val();
        let orderDetail = getOrderDetail();

        var orderObject = new OrderObject(oid, date, selectedCustomer, totalPrice,cash,discount, orderDetail);
        order.push(orderObject);
        setOrderDetailsToDropDown();
        clearOrderDetails();
        console.log("order")
        console.log(order)
        clearField();

        alert("Your order has been successfully added")
        $(".txtCash").css('border','2px solid #d8dde2')
        $(".txtDiscount").css('border','2px solid #d8dde2')
    }
}

function getOrderDetail() {
    var orderDetails=[];
    for (var i=0;i<orderDetail.length;i++){
        orderDetails[i]=orderDetail[i];
    }
    return orderDetails;
}
function clearOrderDetails() {
    orderDetail.splice(0,orderDetail.length)
}

//========others==========//
function getCustomerNames() {
   $('.customerSelection').empty();
    $('.customerSelection').append($('<option>', { text:"Select Customer"}));
    $.ajax({
        url: "http://localhost:8080/java_EE_pos/customer",
        method:"GET",
        success: function (resp) {
            for (var i=0;i<resp.data.length;i++) {
                $('.customerSelection').append($('<option>', { text:resp.data[i].name}));
            }
        }
    })
}
function getItemNames() {
   $('.itemSelection').empty();
    $('.itemSelection').append($('<option>', { text:"Select Item"}));
    $.ajax({
        url: "http://localhost:8080/java_EE_pos/item",
        method:"GET",
        success: function (resp) {
            for (var i=0;i<resp.data.length;i++) {
                $('.itemSelection').append($('<option>', { text:resp.data[i].name}));
            }
        }
    })

}

function setOrderDetailsToDropDown() {
    $('.orderIdDropDownContent').empty();
    $(".orderIdDropDownContent").append($('<option>', { text:"Select Order"}))
    for (var i=0;i<order.length;i++){
        $(".orderIdDropDownContent").append($('<option>', { text:order[i].oID}))
    }

    $(".orderIdDropDownContent>option").css('padding-left','10em')
}
$(".orderIdDropDownContent").change(function () {
    var tempOid=$(".orderIdDropDownContent").val();
    var tempOD=getOrderInfo(tempOid);
    $("#tbl3").empty();
    $("#selectCustomer").val(tempOD.custName);
    for (var i=0;i<tempOD.OrderDetails.length;i++) {
        let row3 = `<tr><td>${tempOD.OrderDetails[i].code}</td><td>${tempOD.OrderDetails[i].name}</td><td>${tempOD.OrderDetails[i].price}</td><td>${tempOD.OrderDetails[i].qty}</td><td>Rs. ${tempOD.OrderDetails[i].totalPrice}</td></tr>`;
        $("#tbl3").append(row3);
    }
})
function getOrderInfo(tempOid) {
    for (var i=0;i<order.length;i++){
        if(tempOid==order[i].oID){
            return order[i]
        }
    }

}
/*function setSelectedOrderToTable(tempOD) {
    console.log(tempOD)
    $("#tbl3").empty();
    for (var i=0;i<tempOD.length;i++) {
        console.log(tempOD[i].code)
        let row3 = `<tr><td>${tempOD[i].code}</td><td>${tempOD[i].name}</td><td>${tempOD[i].price}</td><td>${tempOD[i].qty}</td><td>Rs. ${tempOD[i].totalPrice}</td></tr>`;
        $("#tbl3").append(row3);
    }
}*/
$(".itemSelection").change(function () {
    setItemDetails();
})
$(".OrderRefreshBtn").click(function () {
    clearField();
})
$(".OrderSeeAllBtn").click(function () {
    $("#1stPage").css('display', 'none')
    $("#2ndPage").css('display', 'block')
    $("#3rdPage").css('display', 'none')
})
function setItemDetails() {
    var tempItemName=$(".itemSelection").val();
    if(tempItemName!="Select Item"){
        $.ajax({
            url: "http://localhost:8080/java_EE_pos/item",
            method:"GET",
            success: function (resp) {
                for (var i=0;i<resp.data.length;i++) {
                    if(resp.data[i].name===tempItemName){
                        $(".itemCode").val(resp.data[i].code);
                        $(".itemName").val(resp.data[i].name);
                        $(".itemPrice").val(resp.data[i].price);
                        $(".itemQty").val(resp.data[i].qty);
                        $(".itemCode,.itemName,.itemPrice,.itemQty").css("background-color"," #74b9ff");
                    }
                }
            }
        })
        /*var tempItem2=finditem(tempItemName);
        $(".itemCode").val(tempItem2.code);
        $(".itemName").val(tempItem2.name);
        $(".itemPrice").val(tempItem2.price);
        $(".itemQty").val(tempItem2.qty);
        $(".itemCode,.itemName,.itemPrice,.itemQty").css("background-color"," #74b9ff");*/

    }else{
        alert("select item")
    }

}
function finditem(tempItemName) {
    for (var i=0;i<item.length;i++){
        if(item[i].name==tempItemName){
            return item[i];
        }
    }
}

function addOrderToTable() {
    $("#tbl3").empty();
    for (var i = 0; i < orderDetail.length; i++) {
        let row3 = `<tr><td>${orderDetail[i].code}</td><td>${orderDetail[i].name}</td><td>${orderDetail[i].price}</td><td>${orderDetail[i].qty}</td><td>Rs. ${orderDetail[i].totalPrice}</td></tr>`;
        $("#tbl3").append(row3);
    }
}
function getItemName(order1) {
    for (var i = 0; i < order1.ItemName.length; i++) {
        //console.log("helloo "+order1.ItemName[i].name);
        return order1.ItemName[i].name;
    }
}
function makeOrderId() {
    var orderCount=order.length;
    return orderCount++;
}
function clearField() {
    $("#tbl3").empty();
    $("#selectCustomer").val("");
    $("#selectItem").val("");
    $("#Quantity").val("");

    $(".itemCode").val("");
    $(".itemName").val("");
    $(".itemPrice").val("");
    $(".itemQty").val("");
    $(".itemCode,.itemName,.itemPrice,.itemQty").css("background-color","#e9ecef");

    $("#totalpriceLbl").text("0000.00")
    $("#subTotalpriceLbl").text("0000.00")

    $(".txtCash").val("")
    $(".txtDiscount").val("")
    $(".txtBalance").val("")
    $(".purchaseBtn").attr('disabled', true)

}

$(".txtCash").keyup(function () {
    if (checkValidation()) {
        if(totalLbl!=0) {
            $(".purchaseBtn").attr('disabled', false)
        }
    }else{
        $(".purchaseBtn").attr('disabled', true)
    }
        setBalance(totalLbl);

})
$(".txtDiscount").keyup(function () {
    if (checkDiscountValidation()) {
        if (checkValidation()) {
            $(".purchaseBtn").attr('disabled', false)
        }
    }else{
        $(".purchaseBtn").attr('disabled', true)
    }


})

function checkValidation() {
    if (cashRegEx.test($(".txtCash").val())) {
        $(".txtCash").css('border', '2px solid green');
        return true;
    } else {
        $("#txtCash").css('border', '2px solid red');
    }
}
function checkDiscountValidation() {
    if (cashRegEx.test($(".txtDiscount").val())) {
        $(".txtDiscount").css('border', '2px solid green');
        return true;
    } else {
        $("#txtDiscount").css('border', '2px solid red');
    }
}
function setBalance(totalLbl) {
    var cash=$(".txtCash").val()*1;
    $(".txtBalance").val( cash-totalLbl);
}
$(".txtDiscount").keyup(function () {
    setDiscount();
})
function setDiscount() {
    var discount=$(".txtDiscount").val();
    var sub=totalLbl-(totalLbl*discount)/100;

    $("#subTotalpriceLbl").text("Rs. "+sub);
    //totalLbl=sub;
    totalLbl2=sub;
    setBalance(sub);
}

