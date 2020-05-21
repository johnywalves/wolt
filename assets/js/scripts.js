var moving = false, xPrev, yPrev;
var mapDiv = document.getElementById("map");
var titleDiv = document.getElementById("label");
var bodyDiv = document.querySelector("body");
var modalDiv = document.getElementById("modal");
var modalLoadingDiv = document.querySelector(".loading");
var modalContentDiv = document.querySelector(".content");

window.onload = function () {
    if (mapDiv) {
        window.addEventListener("mousedown", mouseDown, false);
        window.addEventListener("mousemove", mouseMove, true);
        window.addEventListener("mouseup", mouseUp, false);

        var slug = window.location.hash.slice(1);
        slug && slug !== "" && onOpenModal(slug);
    } else {
        document.querySelectorAll("article a").forEach(function (object) { object.addEventListener("click", onClickLink) });
    }
}

function mouseDown(e) {
    e.preventDefault();
    xPrev = e.clientX;
    yPrev = e.clientY;
    moving = true;
    bodyDiv.style.cursor = "grabbing";
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

    titleDiv.style.left = (e.clientX + 24) + "px";
    titleDiv.style.top = (e.clientY - 24) + "px";

    xPrev = e.clientX;
    yPrev = e.clientY;
}

function mouseUp(e) {
    moving = false;
    bodyDiv.style.cursor = "grab";
}

function onClickLink(event) {
    event.preventDefault();

    var slug = event.target.href.split("#")[1];
    var pathname = window.location.pathname;

    if (pathname[pathname.length - 1] !== "/") {
        window.location = `${window.location.href.split("/").slice(0, -1).join("/")}/${slug}.html`
    } else {
        onOpenModal(slug);
    }
}

function onOpenModal(slug) {
    modalDiv.style.display = "block";
    modalLoadingDiv.style.display = "block";
    modalContentDiv.style.display = "none";

    bodyDiv.style.cursor = "wait";

    window.removeEventListener("mousedown", mouseDown, false);
    window.removeEventListener("mousemove", mouseMove, true);
    window.removeEventListener("mouseup", mouseUp, false);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            history.pushState({ id: slug }, "", `${window.location.origin}${window.location.pathname}#${slug}`);

            modalLoadingDiv.style.display = "none";
            modalContentDiv.style.display = "block";

            bodyDiv.style.cursor = "default";

            document.querySelector("article").innerHTML = this.responseText.split('<article>')[1].split('</article>')[0];
            document.querySelectorAll("article a").forEach(function (object) { object.addEventListener("click", onClickLink) });
            document.querySelector("#modal .content a").href = `./${slug}.html`;
        }
    };
    xhttp.open("GET", slug + ".html", true);
    xhttp.send();
}

function onCloseModal() {
    modalDiv.style.display = "none";
    modalLoadingDiv.style.display = "none";
    modalContentDiv.style.display = "none";

    bodyDiv.style.cursor = "grab";

    history.pushState({ id: "map" }, "", `${window.location.origin}${window.location.pathname}`);
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