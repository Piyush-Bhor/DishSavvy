function toggleFilter(){
    if(document.getElementById('filter-form').style.display == "block"){
        document.getElementById('filter-form').style.display = "none";
    }
    else{
        document.getElementById('filter-form').style.display = "block";
    }
}

function togglePassword(){
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}