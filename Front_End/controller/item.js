//Item======================================================================================================
$(".ItemSaveBtn").attr('disabled', true);
$("#itemSearchBtn").attr('disabled', true);
$(".ItemUpdateBtn").attr('disabled', true);
$(".itemDeleteBtn").attr('disabled', true);

var tempItem;
var codeRegEx = /^[0-9]{4}$/;
var itemNameRegEx = /^[A-z ]{3,20}$/;
var priceRegEx = /^[0-9]{2,10}$/;
var qtyRegEx = /^[0-9]{1,20}$/;

$('#txtItemCode,#txtItemName,#txtItemPrice,#txtItemQuantity').on('keydown', function (event) {
    if (event.key == "Tab") {
        event.preventDefault();
    }
});

$("#txtItemCode").keyup(function (event) {
    let temp = checkItemcCode();
    btnAction2();
    if ("Enter" == event.key & temp == true) {
        $("#txtItemName").focus();
    }
})

function checkItemcCode() {
    let temp = $("#txtItemCode").val();
    if (codeRegEx.test(temp)) {
        $("#txtItemCode").css('border', '2px solid green');
        return true;
    } else {
        $("#txtItemCode").css('border', '2px solid red');
    }
}

$("#txtItemName").keyup(function (event) {
    let temp = checkItemName();
    btnAction2();
    if ("Enter" == event.key & temp == true) {
        $("#txtItemPrice").focus();
    }
})

function checkItemName() {
    let temp = $("#txtItemName").val();
    if (itemNameRegEx.test(temp)) {
        $("#txtItemName").css('border', '2px solid green');
        return true;
    } else {
        $("#txtItemName").css('border', '2px solid red');
    }
}

$("#txtItemPrice").keyup(function (event) {
    let temp = checkItemPrice();
    btnAction2();
    if ("Enter" == event.key & temp == true) {
        $("#txtItemQuantity").focus();
    }
})

function checkItemPrice() {
    let temp = $("#txtItemPrice").val();
    if (priceRegEx.test(temp)) {
        $("#txtItemPrice").css('border', '2px solid green');
        return true;
    } else {
        $("#txtItemPrice").css('border', '2px solid red');
    }
}

$("#txtItemQuantity").keyup(function (event) {
    let temp = checkQty();
    btnAction2();
    if ("Enter" == event.key & temp == true) {
        saveItem();
    }
})

function checkQty() {
    let temp = $("#txtItemQuantity").val();
    if (qtyRegEx.test(temp)) {
        $("#txtItemQuantity").css('border', '2px solid green');
        return true;
    } else {
        $("#txtItemQuantity").css('border', '2px solid red');
    }
}

function btnAction2() {
    let code = $("#txtItemCode").val();
    if (codeRegEx.test(code)) {
        let name = $("#txtItemName").val();
        if (itemNameRegEx.test(name)) {
            let price = $("#txtItemPrice").val();
            if (priceRegEx.test(price)) {
                let qty = $("#txtItemQuantity").val();
                if (qtyRegEx.test(qty)) {
                    $(".ItemSaveBtn").attr('disabled', false);
                } else {
                    $(".ItemSaveBtn").attr('disabled', true);
                    return false;
                }
            } else {
                $(".ItemSaveBtn").attr('disabled', true);
                return false;
            }
        } else {
            $(".ItemSaveBtn").attr('disabled', true);
            return false;
        }
    } else {
        $(".ItemSaveBtn").attr('disabled', true);
        return false;
    }
}

//=============save===============//

$(".ItemSaveBtn").click(function () {
    saveItem();
})

function saveItem() {
    let itemCode = $("#txtItemCode").val();
    let itemName = $("#txtItemName").val();
    let itemPrice = $("#txtItemPrice").val();
    let itemQuantity = $("#txtItemQuantity").val();

    if (itemAvailability(itemCode)) {
        alert("Item Already Exists")
    } else {
        var itemObj = new ItemObject(itemCode, itemName, itemPrice, itemQuantity);
        item.push(itemObj);
        addItemToTable();
        clearItemTextField();
        //console.log(customer);
        $(".ItemSaveBtn").attr('disabled', true);
        $("#tbl2>tr").click(function () {
            $(".ItemSaveBtn").attr('disabled', true);
            let code = $(this).children().eq(0).text();
            let itemName = $(this).children().eq(1).text();
            let price = $(this).children().eq(2).text();
            let qty = $(this).children().eq(3).text();
            tempItem = code;
            $("#txtItemCode").val(code);
            $("#txtItemName").val(itemName);
            $("#txtItemPrice").val(price);
            $("#txtItemQuantity").val(qty);

            $(".tempItemId").val(code);
            $(".tempItemName").val(itemName);
            $(".tempItemPrice").val(price);
            $(".tempItemQty").val(qty);

            $(".ItemUpdateBtn").attr('disabled', false);
            $(".itemDeleteBtn").attr('disabled', false);
        })
        $("#tbl2>tr").dblclick(function () {
            $(this).remove();
        })

    }
}

function itemAvailability(itemCode) {
    for (var i = 0; i < item.length; i++) {
        if (item[i].code == itemCode) {
            return true;
        }
    }
}

//=============update===============//

$(".ItemUpdateBtn").click(function () {
    let itemCode = $("#txtItemCode").val();
    let itemName = $("#txtItemName").val();
    let itemPrice = $("#txtItemPrice").val();
    let itemQuantity = $("#txtItemQuantity").val();
    var itemObj = new ItemObject(itemCode, itemName, itemPrice, itemQuantity);

    updateItem(tempItem, itemObj);

    clearItemTextField();
    addItemToTable();
    $("#tbl2>tr").click(function () {
        $(".ItemSaveBtn").attr('disabled', true);
        let code = $(this).children().eq(0).text();
        let itemName = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();
        tempItem = code;
        $("#txtItemCode").val(code);
        $("#txtItemName").val(itemName);
        $("#txtItemPrice").val(price);
        $("#txtItemQuantity").val(qty);

        $(".tempItemId").val(code);
        $(".tempItemName").val(itemName);
        $(".tempItemPrice").val(price);
        $(".tempItemQty").val(qty);

        $(".ItemUpdateBtn").attr('disabled', false);
        $(".itemDeleteBtn").attr('disabled', false);
    })
    $(".ItemSaveBtn").attr('disabled', true);
    $(".ItemUpdateBtn").attr('disabled', true);
    console.log(item);
})

function updateItem(tempItem, itemObj) {
    for (var i = 0; i < item.length; i++) {
        if (item[i].code == tempItem) {
            item[i].code = itemObj.code;
            item[i].name = itemObj.name;
            item[i].price = itemObj.price;
            item[i].qty = itemObj.qty;
        }
    }
}

//============search & getAll===========//
$(".itemSearchField").keyup(function (event) {
    var temp = $(".itemSearchField").val();
    if (temp != null) {
        $("#itemSearchBtn").attr('disabled', false);
    } else {
        $("#itemSearchBtn").attr('disabled', true);
    }
})

$("#itemSearchBtn").click(function () {
    var temp = $(".itemSearchField").val();
    var result = searchItem(temp);
    if (result != null) {
        $("#tbl2").empty();
        let row1 = `<tr><td>${result.code}</td><td>${result.name}</td><td>${result.price}</td><td>${result.qty}</td></tr>`;
        $("#tbl2").append(row1);
    } else {
        alert("No Such a Item")
    }
    $("#tbl2>tr").click(function () {
        $(".ItemSaveBtn").attr('disabled', true);
        let code = $(this).children().eq(0).text();
        let itemName = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();
        tempItem = code;
        $("#txtItemCode").val(code);
        $("#txtItemName").val(itemName);
        $("#txtItemPrice").val(price);
        $("#txtItemQuantity").val(qty);

        $(".tempItemId").val(code);
        $(".tempItemName").val(itemName);
        $(".tempItemPrice").val(price);
        $(".tempItemQty").val(qty);

        $(".ItemUpdateBtn").attr('disabled', false);
        $(".itemDeleteBtn").attr('disabled', false);
    })
})

function searchItem(temp) {
    for (var i = 0; i < item.length; i++) {
        if ((item[i].code == temp) | (item[i].name == temp) | (item[i].price == temp) | (item[i].qty == temp)) {
            return item[i];
        }
    }
}

$(".itemSeeAllBtn").click(function () {
    clearItemTextField();
    addItemToTable();
    $("#tbl2>tr").click(function () {
        $(".ItemSaveBtn").attr('disabled', true);
        let code = $(this).children().eq(0).text();
        let itemName = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();
        tempItem = code;
        $("#txtItemCode").val(code);
        $("#txtItemName").val(itemName);
        $("#txtItemPrice").val(price);
        $("#txtItemQuantity").val(qty);

        $(".tempItemId").val(code);
        $(".tempItemName").val(itemName);
        $(".tempItemPrice").val(price);
        $(".tempItemQty").val(qty);

        $(".ItemUpdateBtn").attr('disabled', false);
        $(".itemDeleteBtn").attr('disabled', false);
    })
})

//============delete===========//
$(".itemDeleteBtn").click(function () {
    var temp = $(".tempItemId").val();
    if (confirm("Are you sure you want to delete this?")) {
        deleteItem(temp);
        clearItemTextField();
        addItemToTable();
        $("#tbl2>tr").click(function () {
            $(".ItemSaveBtn").attr('disabled', true);
            let code = $(this).children().eq(0).text();
            let itemName = $(this).children().eq(1).text();
            let price = $(this).children().eq(2).text();
            let qty = $(this).children().eq(3).text();
            tempItem = code;
            $("#txtItemCode").val(code);
            $("#txtItemName").val(itemName);
            $("#txtItemPrice").val(price);
            $("#txtItemQuantity").val(qty);

            $(".tempItemId").val(code);
            $(".tempItemName").val(itemName);
            $(".tempItemPrice").val(price);
            $(".tempItemQty").val(qty);

            $(".ItemUpdateBtn").attr('disabled', false);
            $(".itemDeleteBtn").attr('disabled', false);
        })
    }
})
function deleteItem(temp) {
    for (var i = 0; i < item.length; i++) {
        if (item[i].code == temp) {
            item.splice(i,1);
        }
    }
}

//==============others=============//
function addItemToTable() {
    $("#tbl2").empty();
    for (var i = 0; i < item.length; i++) {
        let row2 = `<tr><td>${item[i].code}</td><td>${item[i].name}</td><td>${item[i].price}</td><td>${item[i].qty}</td></tr>`;
        $("#tbl2").append(row2);
    }
}

function clearItemTextField() {
    $("#txtItemCode").val("");
    $("#txtItemName").val("");
    $("#txtItemPrice").val("");
    $("#txtItemQuantity").val("");

    $(".tempItemId").val("");
    $(".tempItemName").val("");
    $(".tempItemPrice").val("");
    $(".tempItemQty").val("");

    $(".ItemSaveBtn").attr('disabled', true);
    $("#itemSearchBtn").attr('disabled', true);
    $(".ItemUpdateBtn").attr('disabled', true);
    $(".itemDeleteBtn").attr('disabled', true);
}

$(".ItemRefreshBtn").click(function () {
    clearItemTextField();
    addItemToTable();
    $("#tbl2>tr").click(function () {
        $(".ItemSaveBtn").attr('disabled', true);
        let code = $(this).children().eq(0).text();
        let itemName = $(this).children().eq(1).text();
        let price = $(this).children().eq(2).text();
        let qty = $(this).children().eq(3).text();
        tempItem = code;
        $("#txtItemCode").val(code);
        $("#txtItemName").val(itemName);
        $("#txtItemPrice").val(price);
        $("#txtItemQuantity").val(qty);

        $(".tempItemId").val(code);
        $(".tempItemName").val(itemName);
        $(".tempItemPrice").val(price);
        $(".tempItemQty").val(qty);

        $(".ItemUpdateBtn").attr('disabled', false);
        $(".itemDeleteBtn").attr('disabled', false);
    })
})