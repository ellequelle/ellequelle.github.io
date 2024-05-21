function showPlanet(e,pname) {
    els = document.getElementsByClassName("tablediv");
    for (i = 0; i < els.length; i++) {
      el = els[i];
      el.className = el.className.replace(' active', " hidden");
    }
    el = document.getElementById(pname);
    el.className = el.className.replace(' hidden', ' active');
  }