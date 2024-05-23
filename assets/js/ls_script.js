function showPlanet(e,pname) {
    els = document.getElementsByClassName("tablediv");
    for (i = 0; i < els.length; i++) {
      el = els[i];
      el.className = el.className.replace(' active', " hidden");
    }
    el = document.getElementById(pname);
    el.className = el.className.replace(' hidden', ' active');
  }

  function getLsPlanet(date_int, planet) {
    tableid = '#ls-'+planet;
    if (planet == '67p') tableid = '#ls-_67p';
    table_rows = document.querySelectorAll(tableid + ' > tbody:nth-child(2) > tr');
    let dt0 = 0;
    let dt1 = 0;
    let ls0 = 0;
    let ls1 = 0;
    for (i=0; i<table_rows.length; i++) {
      tr_cells = table_rows[i].querySelectorAll('td');
      trdate_int = Date.parse(tr_cells[0].textContent); /* integer date */
      trls = parseFloat(tr_cells[1].textContent); /* ls value */
      /* look for smallest */
      if (trdate_int <= datenow_int) {
        dt0 = trdate_int;
        ls0 = trls;
      } else if (trdate_int >= datenow_int) {
        dt1 = trdate_int;
        ls1 = trls;
        break;
      }
    }
    if (ls1 < ls0) {
      /* crossing end of year */
      ls1 = ls1-360.0;
    }
    dt = dt1 - dt0;
    dls = ls1 - ls0;
    ls = ls0 + dls / dt*(datenow_int - dt0);
    if (ls <= 0) {
      ls += 360.0;
    }
    return ls.toFixed(1);
  }

  function initLsTable(e) {
    planetList = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
      '67p', 'eros', 'ceres', 'bennu', 'didymos', 'arrokoth'];


    datenow = new Date();
    datenow_int = datenow.getTime();
    // datenow_int = Date.parse('2024-Jan-29');
    // el = document.getElementById('venus-ls-now');
    // el.textContent = getLsPlanet(datenow_int, 'Venus');

    let table = document.getElementById('ls-now-table');

    let el = document.getElementById('ls-now-table-head-ls');
    el.childNodes[0].insertAdjacentHTML('beforeend', '</br>')
    el.childNodes[0].insertAdjacentHTML('beforeend', datenow.toLocaleString());

    for (let i=0; i<planetList.length; i++) {
      let pl = planetList[i];
      let pname = pl[0].toUpperCase() + pl.substr(1);
      if (pname == '67p') pname = '67P/Churyumov–Gerasimenko';
      let row = table.insertRow();
      let cell0 = row.insertCell();
      cell0.appendChild(document.createTextNode(pname));
      cell1 = row.insertCell();
      cell1.appendChild(document.createTextNode(getLsPlanet(datenow_int, pl)));
    }
  }


  window.onload = initLsTable;