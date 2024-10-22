





    function initPage() {

    // handle collapsible
    var coll = document.getElementsByClassName("pcollapsible");
    var i;
    for (i = 0; i < coll.length; i++) {
        var title = document.getElementById(coll[i].id + '-title');
        if (coll[i].classList.contains('pactive')) {
            title.innerHTML = "&ndash; " + title.innerHTML;
        } else {
            title.innerHTML = "&plus; " + title.innerHTML;
        }
        coll[i].addEventListener("click", function() {
            this.classList.toggle("pactive");
            var content = document.getElementById(this.id + '-content');
            if (content.style.display === "block") {
                content.style.display = "none";
                title.innerHTML = "&plus;" + title.innerHTML.substr(1);
            } else {
                content.style.display = "block";
                title.innerHTML = "&ndash;" + title.innerHTML.substr(1);
            }
        });
    }
    }
  window.onload = initPage;
