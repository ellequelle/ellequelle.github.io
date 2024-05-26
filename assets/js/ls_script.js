const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const smallBodies = ['bennu', 'eros', 'didymos', 'ceres', 'cp67p', 'arrokoth'];
const planetList = planets.concat(smallBodies);

var planetLsDict = {};
for (let i=0; i<planetList.length; i++) {
    planetLsDict[planetList[i]] = {};
}

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



  function getLsPlanetTime(date_int, planet, dLs=false) {
    /* dLs : return Ls and dLs/dt in deg/second */
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
      ls1 = ls1 + 360.0;
    }
    /* linear interpolation to estimate Ls at date */
    dt = dt1 - dt0;
    dls = ls1 - ls0;
    ls = ls0 + dls / dt*(date_int - dt0);
    if (ls > 360) {
      ls = ls - 360.0;
    }
    
    if (dLs) {
        /* return Ls and derivative */
        return [ls, dls/dt];
    }
    /* return Ls */
    return ls;
  }

  function getLsPlanetTimeAsync(date_int, planet, callbackFunc, LsInfoDict=false) {
    /* dLs : return Ls and dLs/dt in deg/second */
    /* Send XMLHTTP request to get Ls from json data file. */
    fileExt = getDateJSONFileExt(date_int);
    fn = '/assets/data/solar-longitude/ls-hires/hires-' + planet + fileExt + '.json';

    /* Send request to get JSON table (list of rows). */
    var xmlhttp = new XMLHttpRequest();
    function respFunc(resp) {
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
        ls1 = ls1 + 360.0;
        }
        /* linear interpolation to estimate Ls at date */
        dt = dt1 - dt0;
        dls = ls1 - ls0;
        ls = ls0 + dls / dt*(date_int - dt0);
        if (ls > 360) {
        ls = ls - 360.0;
        }
        
        if (LsInfoDict != false) {
            LsInfoDict['Ls'] = ls;
            LsInfoDict['dLs'] = dls/dt;
            LsInfoDict['t0'] = date_int;
        }

        /* call function */
        callbackFunc(ls);
    };
    xmlhttp.addEventListener('load', respFunc);
    xmlhttp.open("GET", fn);
    xmlhttp.send();
  }


  async function getLsPlanetTimeAsync2(date_int, planet, LsInfoDict=false) {
    /* dLs : return Ls and dLs/dt in deg/second */
    /* Send XMLHTTP request to get Ls from json data file. */
    fileExt = getDateJSONFileExt(date_int);
    fn = '/assets/data/solar-longitude/ls-hires/hires-' + planet + fileExt + '.json';

    /* Send request to get JSON table (list of rows). */
    const resp = await fetch(fn, {
        method: 'GET',
    })
    return resp.json().then(
        (resp) => {
            var dtable = resp['data'];

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
            if ((ls0 > 300) & (ls1 < 60)) {
                /* account for crossing end of year */
                ls1 = ls1 + 360.0;
            }
            /* linear interpolation to estimate Ls at date */
            dt = dt1 - dt0;
            dls = ls1 - ls0;
            ls = ls0 + dls / dt*(date_int - dt0);
            if (ls > 360) {
                ls = ls - 360.0;
            }
            
            if (LsInfoDict != false) {
                LsInfoDict['Ls'] = ls;
                LsInfoDict['dLs'] = dls/dt;
                LsInfoDict['t0'] = date_int;
            }

            return ls;
    });
  }

  function updateDateNow() {
    datenow = new Date();
    document.getElementById('date-now').innerHTML = datenow.toLocaleString();
    updateLsCells(datenow.getTime()-86400*2*1000);
  }

  function updateLsCells(now_int) {
    for (let i=0; i<planetList.length; i++) {
        try {
            pdict = planetLsDict[planetList[i]];
            ls0 = pdict['Ls'];
            dls = pdict['dLs'];
            t0 = pdict['t0'];
            lscell = pdict['LsCell'];
            dt = now_int - t0;
            ls1 = ls0 + dls * dt;
            lscell.innerHTML = formatLs(ls1);
        } catch {}
    }
  }

  function formatLs(lsval, decimals=7, width=5) {
    return lsval.toFixed(decimals).padStart(decimals+width).replaceAll(' ','&nbsp;') + '&deg;';
  }

  function prettyName(pname) {
    if (pname.toLowerCase() == 'cp67p') return '67P/Churyumov–Gerasimenko';
    pname = pname[0].toUpperCase() + pname.toLowerCase().substr(1);
    return pname;
  }

  function initLsNowTable(e) {
    datenow = new Date();
    datenow_int = datenow.getTime();

    let el = document.getElementById('date-now');
    el.insertAdjacentHTML('beforeend', datenow.toLocaleString());

    let table = document.getElementById('ls-now-table');

    for (let i=0; i<planetList.length; i++) {
      let pl = planetList[i];
      let pname = prettyName(pl);
      let row = table.insertRow();
      let cell0 = row.insertCell();
    //   cell0.appendChild(document.createTextNode(pname));
      cell0.innerHTML = pname;
      cell0.setAttribute('class', 'ls-now-planet-name');
      cell1 = row.insertCell();
      cell1.setAttribute('class', 'ls-values');
      cell1.setAttribute('id', pl+'-ls-values');
      planetLsDict[pl] = {'LsCell':cell1};
      /*
      lsinfo = getLsPlanetTime(datenow_int, pl, true);
      lsval = lsinfo[0];
      planetLsDict[pl] = {'Ls':lsval, 'dLs':lsinfo[1], 't0':datenow_int, 'LsCell':cell1};
      cell1.innerHTML = formatLs(lsval, decimals, width);
      */
      getLsPlanetTimeAsync2(datenow_int, pl, planetLsDict[pl]).then((ls) => {
            document.getElementById(pl+'-ls-values').innerHTML = formatLs(ls);
        });
    }

    /* keep updating date, Ls */
    setInterval(updateDateNow, 100);

  }

  function createPlanetTable(planetName) {
    const pretty = prettyName(planetName);
    /* create table tag */
    const table = document.createElement('table');
    table.setAttribute('id', 'ls-'+planetName);
    table.setAttribute('class', 'display');
    table.setAttribute('style', 'width:80%');
    /* create head & foot */
    const thead = document.createElement('thead');
    if (planetName == 'mars') {
        thRow = '<tr>';
        thRow += '<th>Date</th>';
        thRow += '<th>Mars Year (<a href="/images/Clancy-etal-JGR-2000.pdf" title="From Clancy et al. (2000)">Clancy+2000</a>)</th>';
        thRow += '<th>Mars L<sub>s</sub></th>';
        thRow += '<th>Mars Sol Date (<a href="/images/Allison-etal-PSS-2000.pdf" title="From Equation 32 in Allison et al. (2000)">Allison+2000</a>)</th>';
        thRow += '</tr>';
    } else {
        thRow = '<tr><th>Date</th><th>' + pretty + ' L<sub>s</sub></th></tr>';
    }
    thead.insertAdjacentHTML('afterbegin', thRow);
    const tfoot = document.createElement('tfoot');
    tfoot.insertAdjacentHTML('afterbegin', thRow)
    /* add head & foot */
    table.insertAdjacentElement('afterbegin', thead);
    table.insertAdjacentElement('beforeend', tfoot);
    /* make span to contain table */
    const pspan = document.createElement('span');
    pspan.setAttribute('id', planetName);
    pspan.setAttribute('class', 'tablediv hidden');
    pspan.insertAdjacentHTML('afterbegin', '<h2>'+pretty+' Solar Longitude</h2>');
    pspan.insertAdjacentHTML('beforeend', 
        '<small>Download <a href="/assets/data/solar-longitude/'+planetName+'.json">json</a>, '
        + '<a href="/assets/data/solar-longitude/'+planetName+'.csv">csv</a></small>');
    /* add table to span and return */
    pspan.insertAdjacentElement('beforeend', table);
    return pspan;
  }



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
            DataTable.tables({ visible: true, api: true }).columns.adjust();
        });
    }

    // calculate current Ls values for table
    initLsNowTable();

    let lastEl = document.getElementById('bodylist');

    for (let i=0; i<planetList.length; i++) {
        column_list = [{ data : 'date' }, { data : 'Ls' }];
        planet = planetList[i];
        if (planet.toLowerCase() == 'mars') {
            column_list = [{ data : 'date' }, { data : 'MY' }, { data : 'Ls' }, { data : 'MSD' } ];
        }
        ptable = createPlanetTable(planet);
        lastEl.insertAdjacentElement('afterend', ptable);
        lastEl = ptable;
        new DataTable('#ls-' + planet, {
            ajax : 'assets/data/solar-longitude/' + planet + '.json',
            columns : column_list,
            // scrollY : true,
            scrollX : false,
            lengthMenu : [20, 30, 50, 100, 'All'],
            columnDefs: {
                targets : -1,
                className : 'dt-center',
                deferRender: true,
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
            });
    }

  }

  window.onload = initPage;