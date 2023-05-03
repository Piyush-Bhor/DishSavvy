function toggleFilter(){
    if(document.getElementById('filter-form').style.display == "block"){
        document.getElementById('filter-form').style.display = "none";
    }
    else{
        document.getElementById('filter-form').style.display = "block";
    }
}

function togglePassword(){
    let field = document.getElementById("password");
    if (field.type === "password") {
        field.type = "text";
    } else {
        field.type = "password";
    }
}

function toggleFavourites(id){
    let star = document.getElementById(id);
    if(star.style.color=="black"){
        star.style.color="gold";
    }
    else{
        star.style.color="black";
    }
}