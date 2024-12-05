var jpdbBaseURL = "http://api.login2explore.com:5577";
var jpdbIRL = "/api/irl";
var jpdbIML = "/api/iml";
var proDBName = "project-DB";
var proRelationName = "PROJECT-TABLE";
var connToken = "90934400|-31949227203880029|90957253";

$("#proid").focus();

function saveRecNo2LS(jsonObj){
    var lvData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvData.rec_no);
}

function getProIdAsJsonObj(){
    var proid = $("#proid").val();
    var jsonStr = {
        id: proid
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
    saveRecNo2LS(jsonObj);
    var record = JSON.parse(jsonObj.data).record;
    $("#proname").val(record.name);
    $("#prosign").val(record.assigned);
    $("#prodate").val(record.date);
    $("#prodead").val(record.deadline);
}

function resetForm(){
    $("#proid").val("");
    $("#proname").val("");
    $("#prosign").val("");
    $("#prodate").val("");
    $("#prodead").val("");
    $("#proid").prop("disabled", false);
    $("#save").prop("disabled", true);
    $("#change").prop("disabled", true);
    $("#reset").prop("disabled", true);
    $("#proid").focus();
}

function validateData(){
    var proid, proname, prosign, prodate, prodead;
    proid = $("#proid").val();
    proname = $("#proname").val();
    prosign = $("#prosign").val();
    prodate = $("#prodate").val();
    prodead = $("#prodead").val();

    if(proid === " "){
        alert("Project ID is missing");
        $("#proid").focus();
        return "";
    }

    if(proname === " "){
        alert("Project Name is missing");
        $("#proname").focus();
        return "";
    }

    if(prosign === " "){
        alert("Assigned-To is missing");
        $("#prosign").focus();
        return "";
    }

    if(prodate === " "){
        alert("Assignment-Date is missing");
        $("#prodate").focus();
        return "";
    }

    if(prodead === " "){
        alert("Deadline is missing");
        $("#prodead").focus();
        return "";
    }

    var jsonStrObj = {
        id: proid,
        name: proname,
        assigned: prosign,
        date: prodate,
        deadline: prodead
    };
    return JSON.stringify(jsonStrObj);
}

function getPro(){
    var proIdJsonObj = getProIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(
            connToken, 
            proDBName, 
            proRelationName, 
            proIdJsonObj);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(
            getRequest, 
            jpdbBaseURL, 
            jpdbIRL);
    jQuery.ajaxSetup({async: true});
    if(resJsonObj.status === 400){
        $("#save").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    }
    else if(resJsonObj.status === 200){
        $("#proid").prop("disabled", true);
        fillData(resJsonObj);
        $("#change").prop("disabled", false);
        $("#reset").prop("disabled", false);
        $("#proname").focus();
    }
}

function saveData(){
    var jsonStrObj = validateData();
    if(jsonStrObj === " "){
        return "";
    }
    var putRequest = createPUTRequest(
            connToken, 
            jsonStrObj, 
            proDBName, 
            proRelationName);
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(
            putRequest, 
            jpdbBaseURL, 
            jpdbIML);
    jQuery.ajaxSetup({async: true});
    resetForm();
    $("#proid").focus();
}

function changeData(){
    $("#change").prop("disabled", true);
    jsonChg = validateData();
    var updateRequest = createUPDATERecordrequest(
            connToken, 
            jsonChg, 
            proDBName, 
            proRelationName, 
            localStorage.getItem("recno"));
    jQuery.ajaxSetup({async: false});
    var resJsonObj = executeCommandAtGivenBaseUrl(
            updateRequest, 
            jpdbBaseURL, 
            jpdbIML);
    jQuery.ajaxSetup({async: true});
    console.log(resJsonObj);
    resetForm();
    $("#proid").focus();
}