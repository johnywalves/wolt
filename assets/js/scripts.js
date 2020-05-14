var moving = false, xPrev, yPrev;
var mapDiv = document.getElementById("map");
var titleDiv = document.getElementById("label");
var bodyDiv = document.querySelector("body");
var modalDiv = document.getElementById("modal");

window.onload = function () {
    window.addEventListener("mousedown", mouseDown, false);
    window.addEventListener("mousemove", mouseMove, true);
    window.addEventListener("mouseup", mouseUp, false);

    var slug = window.location.hash.slice(1);
    if (slug && slug !== "") {
        onOpenModal(slug);
    }
}

function mouseDown(e) {
    e.preventDefault();
    xPrev = e.clientX;
    yPrev = e.clientY;
    moving = true;
    bodyDiv.style.cursor = "move";
}

function mouseMove(e) {
    if (moving) {
        var x = parseInt(mapDiv.style.left.split("px").join("")) + (e.clientX - xPrev);
        if (x < 0) {
            mapDiv.style.left = x + "px";
        }

        var y = parseInt(mapDiv.style.top.split("px").join("")) + (e.clientY - yPrev);
        if (y < 0) {
            mapDiv.style.top = y + "px";
        }
    }
    xPrev = e.clientX;
    yPrev = e.clientY;
}

function mouseUp(e) {
    moving = false;
    bodyDiv.style.cursor = "default";
}

function onClickLink(event) {
    event.preventDefault();
    onOpenModal(event.target.href.split("#")[1]);
}

function onOpenModal(slug) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            window.removeEventListener("mousedown", mouseDown, false);
            window.removeEventListener("mousemove", mouseMove, true);
            window.removeEventListener("mouseup", mouseUp, false);

            history.pushState({ id: slug }, "", window.location.origin + "#" + slug);

            modalDiv.style.display = "block";
            document.getElementById("info").innerHTML = this.responseText.split('<span id="info">')[1].split('</span>')[0];
            document.querySelectorAll("#info a").forEach(function (object) { object.addEventListener("click", onClickLink) });
        }
    };
    xhttp.open("GET", slug + ".html", true);
    xhttp.send();
}

function onCloseModal() {
    modalDiv.style.display = "none";
    history.pushState({ id: "map" }, "", window.location.origin);
    window.onload();
}

function spotEnter(e, title) {
    var nameImg = "img-" + e.target.id;

    titleDiv.style.display = "block";
    titleDiv.innerText = title;

    if (document.getElementById(nameImg)) {
        document.getElementById(nameImg).src = "./assets/img/" + e.target.id + ".png";
    }
};

function spotLeave(e) {
    var nameImg = "img-" + e.target.id;

    titleDiv.style.display = "none";

    if (document.getElementById(nameImg)) {
        document.getElementById(nameImg).src = "./assets/img/blank.png";
    }
};