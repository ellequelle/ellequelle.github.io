const planetList = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto',
      'cp67p', 'eros', 'ceres', 'bennu', 'didymos', 'arrokoth'];

function showPlanet(e, pname) {
    e.target.textContent.toLowerCase()
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
    /* if (planet == '67p') tableid = '#ls-_67p'; */
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

  function getDateJSONFileExt(date_int) {

    dt = date_int;
    /* split up into multiple smaller files */
    if (date_int <= Date.parse("1980-01-01")) {
        return '-a';
    } else if (dt > Date.parse("1980-01-01") & dt <= Date.parse("2000-01-01")) {
        return '-b';
    } else if (dt > Date.parse("2000-01-01") & dt <= Date.parse("2025-01-01")) {
        return '-c';
    } else if (dt > Date.parse("2025-01-01") & dt <= Date.parse("2050-01-01")) {
        return '-d';
    } else if (dt > Date.parse("2050-01-01") & dt <= Date.parse("2100-01-01")) {
        return '-e';
    } else if (dt > Date.parse("2100-01-01") & dt <= Date.parse("2200-01-01")) {
        return '-f';
    }
  }



  function getLsPlanetTime(date_int, planet) {
    /* Send XMLHTTP request to get Ls from json data file. */
    fileExt = getDateJSONFileExt(date_int);
    fn = '/assets/data/solar-longitude/ls-hires/hires-' + planet + fileExt + '.json';

    /* Send request to get JSON table (list of rows). */
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", fn, false);
    xmlhttp.send();
    var dtable = JSON.parse(xmlhttp.responseText)['data'];

    /* Find date in table. */
    let dt0 = 0;
    let dt1 = 0;
    let ls0 = 0;
    let ls1 = 0;
    for (i=0; i<dtable.length; i++) {
      trow = dtable[i];
      trdate_int = Date.parse(trow['date']); /* integer date */
      trls = parseFloat(trow['Ls']); /* ls value */
      /* look for smallest */
      if (trdate_int <= date_int) {
        dt0 = trdate_int;
        ls0 = trls;
      } else if (trdate_int >= date_int) {
        dt1 = trdate_int;
        ls1 = trls;
        break;
      }
    }
    // yearEnd = false;
    if (ls1 < ls0) {
      /* account for crossing end of year */
    //   yearEnd = true;
      ls1 = ls1 + 360.0;
    }
    /* linear interpolation to estimate Ls at date */
    dt = dt1 - dt0;
    dls = ls1 - ls0;
    ls = ls0 + dls / dt*(date_int - dt0);
    if (ls > 360) {
      ls = ls - 360.0;
    }
    
    /* return Ls */
    return ls;
  }

  function initLsNowTable(e) {
    datenow = new Date();
    datenow_int = datenow.getTime();

    let el = document.getElementById('date-now');
    el.insertAdjacentHTML('beforeend', datenow.toLocaleString());

    let table = document.getElementById('ls-now-table');

    for (let i=0; i<planetList.length; i++) {
      let pl = planetList[i];
      let pname = pl[0].toUpperCase() + pl.substr(1);
      if (pname.toLowerCase() == 'cp67p') pname = '67P/Churyumov–Gerasimenko';
      let row = table.insertRow();
      let cell0 = row.insertCell();
      cell0.appendChild(document.createTextNode(pname));
      cell1 = row.insertCell();
      cell1.appendChild(document.createTextNode(getLsPlanetTime(datenow_int, pl).toFixed(1)));
    }
  }

  function initPage() {

    // handle collapsible
    var coll = document.getElementsByClassName("pcollapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function() {
            this.classList.toggle("pactive");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
            content.style.display = "none";
            } else {
            content.style.display = "block";
            }
            DataTable.tables({ visible: true, api: true }).columns.adjust();
        });
    }

    // calculate current Ls values for table
    initLsNowTable();

    for (let i=0; i<planetList.length; i++) {
        column_list = [{ data : 'date' }, { data : 'Ls' }];
        planet = planetList[i];
        if (planet.toLowerCase() == 'mars') {
            column_list = [{ data : 'date' }, { data : 'MY' }, { data : 'Ls' }, { data : 'MSD' } ];
        }
        let dtable = new DataTable('#ls-' + planet, {
            ajax : 'assets/data/solar-longitude/' + planet + '.json',
            columns : column_list,
            // scrollY : true,
            scrollX : false,
            lengthMenu : [20, 30, 50, 100, 'All'],
            columnDefs: {
                targets : -1,
                className : 'dt-center',
            },
            // displayStart: 20,
            initComplete : function () {
                this.api()
                    .columns()
                    .every(function () {
                        let column = this;
                        let title = column.footer().textContent;
         
                        // Create input element
                        let input = document.createElement('input');
                        input.placeholder = title;
                        column.footer().replaceChildren(input);
         
                        // Event listener for user input
                        input.addEventListener('keyup', () => {
                            if (column.search() !== this.value) {
                                column.search(input.value).draw();
                            }
                        });
                    });
            },
            })
    }

    /*
    new DataTable('#dt-mercury', {
        ajax : 'assets/data/solar-longitude/mercury.json',
        columns : [
            { data : 'date' },
            { data : 'Ls' }
        ]
    });
    */

  }

  window.onload = initPage;