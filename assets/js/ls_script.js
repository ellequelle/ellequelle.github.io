const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const smallBodies = ['bennu', 'eros', 'didymos', 'ceres', 'cp67p', 'arrokoth'];
const planetList = planets.concat(smallBodies);


function initPlanetLsDict(plsd) {
    for (let i = 0; i < planetList.length; i++) {
        plsd[planetList[i]] = {};
    }
    return plsd;
}

DATA_DIR = "/assets/data/solar-longitude/ls-hires/"
MIN_TIME = (new Date("1900-01-01T00:00Z")).getTime();
MAX_TIME = (new Date("2200-01-01T00:00Z")).getTime();


function getJSONFilePath(planet, date_int) {
    let yr = (new Date(date_int)).getFullYear();
    return DATA_DIR + "hires-" + planet + "-" + yr + ".json";
}

function getLsPlanetTimeNOTASYNC(date_int, planet, LsPlanetInfoDict) {

    date_int = Math.max(
        date_int,
        Math.min(date_int, MAX_TIME)
    );

    let fn = getJSONFilePath(planet, date_int);

    /* Send request to get JSON table (list of rows). */
    fetch(fn, {
        method: 'GET',
    }).then((resp) => { return resp.json() }).then(
        (json) => {
            var dtable = json['data'];

            /* Find date in table. */
            let dt0 = 0;
            let dt1 = 0;
            let ls0 = 0;
            let ls1 = 0;
            for (i = 0; i < dtable.length; i++) {
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
            ls = ls0 + dls / dt * (date_int - dt0);
            if (ls > 360) {
                ls = ls - 360.0;
            }

            LsPlanetInfoDict['Ls'] = ls;
            LsPlanetInfoDict['dLs'] = dls / dt;
            LsPlanetInfoDict['t0'] = date_int;
            LsPlanetInfoDict['tmin'] = dt0;
            LsPlanetInfoDict['tmax'] = dt1;

            updateLsCell(date_int, LsPlanetInfoDict);
        }
    );
}


async function getLsPlanetTimeAsync2(date_int, planet, LsInfoDict = false) {
    /* Calculate the solar longitude for planet at integer time date_int. */
    /* dLs : return Ls and dLs/dt in deg/second */
    /* Send XMLHTTP request to get Ls from json data file. */

    let fn = getJSONFilePath(planet, date_int);
    let ls = null;

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
            for (i = 0; i < dtable.length; i++) {
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
            ls = ls0 + dls / dt * (date_int - dt0);
            if (ls > 360) {
                ls = ls - 360.0;
            }

            if (LsInfoDict != false) {
                LsInfoDict['Ls'] = ls;
                LsInfoDict['dLs'] = dls / dt;
                LsInfoDict['t0'] = date_int;
                LsInfoDict['tmin'] = dt0;
                LsInfoDict['tmax'] = dt1;
            }
            return ls;
        });
}

// parse datetime as [date, time, seconds, decimal, additional digits]
dateMatch = new RegExp("^[0-9]{4}-[0-9]{2}-[0-9]{2}([\ T][0-9]{2}:[0-9]{2}(\.[0-9]{1,3}([0-9]+)*)*)*$");

// clean up datetime returned by Date.toString function
redate = new RegExp("\\(.+\\)", "i");


function updateLsCells(now_int, planetLsDict) {
    for (let i = 0; i < planetList.length; i++) {

        // try {
        let pdict = planetLsDict[planetList[i]];
        let ls0 = pdict['Ls'];
        let dls = pdict['dLs'];
        let t0 = pdict['t0'];
        let lsrow = pdict["LsRow"];
        let lscell = lsrow.getElementsByClassName("ls-values")[0];
        dt = now_int - t0;
        ls1 = ls0 + dls * dt;
        lscell.innerHTML = formatLs(ls1);
        // } catch {}
    }
}

function updateLsCell(time_int, LsPlanetInfoDict) {
    let t0 = LsPlanetInfoDict['t0'];
    let lsrow = LsPlanetInfoDict["LsRow"];
    let lscell = lsrow.getElementsByClassName("ls-values")[0];
    let dt = time_int - t0;
    let ls1 = LsPlanetInfoDict['Ls'] + LsPlanetInfoDict['dLs'] * dt;
    lscell.innerHTML = formatLs(ls1);
    return ls1;
}

function updateLsCellNew(date_int, planet, LsInfoDict) {
    let LsPlanetInfoDict = LsInfoDict[planet];
    if (date_int < LsPlanetInfoDict["tmin"] | date_int > LsPlanetInfoDict["tmax"]) {
        getLsPlanetTimeAsync2(date_int, planet, LsInfoDict).then(
            (ls) => {
                lscell.innerHTML = formatLs(ls1);
            }
        );
    } else {
        updateLsCell(date_int, LsInfoDict[planet]);
    }
}


function formatLs(lsval, decimals = 7, width = 5) {
    return lsval.toFixed(decimals).padStart(decimals + width).replaceAll(' ', '&nbsp;') + '&deg;';
}

function prettyName(pname) {
    if (pname.toLowerCase() == 'cp67p') return '67P/Churyumov–Gerasimenko';
    pname = pname[0].toUpperCase() + pname.toLowerCase().substr(1);
    return pname;
}

const LsTimeTable = {
    tablename: "LsTime",
    dateInput: null,
    lsTable: null,
    planetLsDict: {},
    planetLsData: null,

    getTime: function () {
        return (new Date(LsTimeTable.dateInput.value + "Z")).getTime();
    },
    initLsTimeTable: function () {

        LsTimeTable.dateInput = document.getElementById("ls-datetime");
        LsTimeTable.dateInput.value = (new Date()).toISOString().substring(0, 16);
        LsTimeTable.lsTable = document.getElementById("ls-time-table");
        initPlanetLsDict(LsTimeTable.planetLsDict);
        let timeint = LsTimeTable.getTime()

        for (let i = 0; i < planetList.length; i++) {
            let pl = planetList[i];
            // for (const pl in planetList) {
            let pname = prettyName(pl);
            let row = LsTimeTable.lsTable.insertRow();
            row.setAttribute("id", LsTimeTable.tablename + "-" + pl);
            let cell0 = row.insertCell();
            cell0.innerHTML = pname;
            cell0.setAttribute('class', 'ls-planet-name');
            let cell1 = row.insertCell();
            cell1.setAttribute('class', 'ls-values');
            cell1.setAttribute('id', pl + '-ls-values');
            LsTimeTable.planetLsDict[pl].LsRow = row;
            getLsPlanetTimeNOTASYNC(timeint, pl, LsTimeTable.planetLsDict[pl])
            // getLsPlanetTimeAsync2(
            //     timeint, pl, LsTimeTable.planetLsDict[pl], true
            //     ).then(
            //         updateLsCell(timeint, LsTimeTable.planetLsDict[pl])
            //         );
        }
        // updateLsCells(timeint, LsTimeTable.planetLsDict);
        LsTimeTable.dateInput.addEventListener("change", () => { LsTimeTable.updateLsTime() });
    },
    updateLsTime: function () {
        let timeint = LsTimeTable.getTime();
        for (let i = 0; i < planetList.length; i++) {
            let pl = planetList[i];
            getLsPlanetTimeNOTASYNC(timeint, pl, LsTimeTable.planetLsDict[pl]);
            // getLsPlanetTimeAsync2(
            //     timeint, pl, LsTimeTable.planetLsDict[pl]
            //     ).then(
            //         updateLsCell(timeint, LsTimeTable.planetLsDict[pl])
            //     );
        }
        // updateLsCells(timeint, LsTimeTable.planetLsDict);
    }
}



const LsNowTable = {
    datenowElement: null,
    table: null,
    planetLsDict: {},
    timer: -1,

    initLsNowTable: function () {
        this.datenowElement = document.getElementById("date-now");
        this.table = document.getElementById('ls-now-table');

        let datenow = new Date();
        let datenow_int = datenow.getTime();

        this.planetLsDict = initPlanetLsDict(this.planetLsDict);

        // Assemble table of planets
        for (let i = 0; i < planetList.length; i++) {
            let pl = planetList[i];
            let pname = prettyName(pl);
            let row = this.table.insertRow();
            let cell0 = row.insertCell();
            cell0.innerHTML = pname;
            cell0.setAttribute('class', 'ls-planet-name');
            cell1 = row.insertCell();
            cell1.setAttribute('class', 'ls-values');
            cell1.setAttribute('id', pl + '-ls-now-values');
            this.planetLsDict[pl]["LsRow"] = row;
            getLsPlanetTimeAsync2(datenow_int, pl, this.planetLsDict[pl]).then((ls) => {
                document.getElementById(pl + '-ls-now-values').innerHTML = formatLs(ls);
            });
        }
        /* keep updating date, Ls */
        this.timer = setInterval(this.updateDateNow, 100);
    },

    updateDateNow: function () {
        // get current datetime
        let datenow = new Date();
        // update current datetime on page
        document.getElementById('date-now').innerHTML = datenow.toString().replace(redate, "");
        // update Ls cells
        updateLsCells(datenow.getTime(), LsNowTable.planetLsDict);
    }
};



function initPage() {



    // calculate current Ls values for tables
    LsNowTable.initLsNowTable();
    LsTimeTable.initLsTimeTable();






}

window.onload = initPage;
