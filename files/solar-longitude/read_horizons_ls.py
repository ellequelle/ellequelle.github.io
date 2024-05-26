from io import StringIO
import pandas as pd
import numpy as np

file_paths = (
"horizons_results_eros.txt",
"horizons_results_didymos.txt",
"horizons_results_bennu.txt",
"horizons_results_arrokoth.txt",
"horizons_results_cp67p.txt",
"horizons_results_ceres.txt",
"horizons_results_jupiter.txt",
"horizons_results_mars.txt",
"horizons_results_mercury.txt",
"horizons_results_neptune.txt",
"horizons_results_pluto.txt",
"horizons_results_saturn.txt",
"horizons_results_uranus.txt",
"horizons_results_venus.txt",
"horizons_results_earth.txt",
)

planet_list = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 
               'saturn', 'uranus', 'neptune', 'pluto',
      'cp67p', 'eros', 'ceres', 'bennu', 'didymos', 'arrokoth',
      ]

def ingest_horizon_ephem(fn):
    s = ""
    with open(fn, "r") as f:
        lines = f.readlines()
        readit = False
        for line in lines:
            if "$$SOE" in line:
                readit = True
                continue
            elif line.startswith("$$EOE"):
                readit = False
            if readit:
                s += line
    s = s.strip()

    #  Date__(UT)__HR:MN, , , hEcl-Lon,hEcl-Lat,      PlAng,  Tru_Anom,  App_Lon_Sun,
    df = pd.read_csv(StringIO(s), names=["date",0,1,"lon","lat","plang","truanom","Ls"], index_col=False)
    return df.drop(columns=[0,1])

def do_extra_mars(df):
    # calculate julian date
    df["JD"] = (df["date_dt"] - pd.to_datetime("1970-01-01")).astype(int)/1e9/86400 + 2440587.5
    # calculate Mars Standard Date (from eq 32 in Allison+2020,
    #  neglecting any difference between TAI and UTC)
    # df["MSD"] = (df["JD"] - 2405522)/1.02749
    df["MSD"] = (df["JD"] - 2400000.5 - 51549.0)/1.02749125 + 44796.0

    # Mars Standard Date at Ls 0, MY 0 (approximate)
    # MSD_MY0 = 28223.6 # 1953-05-24, JD 2434521.743054128
    JD_MY0 = 2434521.743054128 # ~1953-05-24, ~28223.6
    # years per JD
    YR_JD = 686.980 # d
    dJD = (df["JD"] - JD_MY0)
    # calculate Mars Year number (from Clancy+2000)
    df["MY"] = np.abs(dJD)//YR_JD*np.sign(dJD)
    df.loc[df["JD"]<JD_MY0, "MY"] += -1
    df["MY"] = df["MY"].astype(int)

    # sol dates for Mars landers
    # pathfinder sol (local time, starting at sol 1)
    df["pathfinder"] = df["MSD"] - 43905 - (2 + (13 + 1/60)/60)/24 + 1
    # spirit sol (local time, starting at sol 1)
    df["spirit"] = df["MSD"] - 46216 + (11 + (0 + 4/60)/60)/24 + 1
    # opportunity sol (local time, starting at sol 1)
    df["opportunity"] = df["MSD"] - 46236 - (1 + (1 + 6/60)/60)/24 + 1
    # phoenix sol (local time, starting at sol 0)
    df["phoenix"] = df["MSD"] - 47776 - (8 + (26 + 36/60)/60)/24
    # curiosity sol (local time, starting at sol 0)
    df["curiosity"] = df["MSD"] - 49269 + (9 + (9 + 41/60)/60)/24
    # insight sol (local time, starting at sol 0)
    df["insight"] = df["MSD"] - 51511 + (9 + (3 + 53/60)/60)/24
    # perseverance sol (local time, starting at sol 0)
    df["perseverance"] = df["MSD"] - 52304 + (5 + (9 + 43/60)/60)/24

    # round MSD to single digit precision
    df["MSD"] = df["MSD"].round(1)
    return df[["date", "Ls", "MSD", "MY", "date_dt"]]

def format_date(df):
    df["date_dt"] = pd.to_datetime(df.date)
    df["date"] = df["date_dt"].dt.strftime("%Y-%m-%d")
    return df

for planet in planet_list:
    print(planet)
    fn = "horizons_results_" + planet + ".txt"

    df = ingest_horizon_ephem("horizons_output/"+fn)
    df = format_date(df)
    dt = df["date_dt"]
    lx = (dt >= "1950-01-01") & (dt <= "2070-01-01")
    if planet in ["uranus", "neptune", "pluto", "arrokoth"]:
        lx &= df["date"].str.contains("-01-") | df["date"].str.contains("-06-")
    df = df.loc[lx]
    df["Ls"] = df["Ls"].round(3)
    # planet-specific processing
    if planet.lower() == "mars":
        df = do_extra_mars(df)
    else:
        df = df[["date","Ls"]]
    # fsdssaf
    fn = f"{planet}.json"
    # df.set_index("date").to_json("../../_data/"+fn, orient="table")
    df.set_index("date").to_json("../../assets/data/solar-longitude/"+fn, orient="table")
    df.set_index("date").to_csv("../../assets/data/solar-longitude/"+planet+".csv", index_label="date")
    # df.set_index("date").to_json(fn, orient="table")

    # if planet in ("didymos", "arrokoth"):
    #     continue
    fn_hires = "horizons_hires/horizons_results_hires-" + planet + ".txt"
    df = ingest_horizon_ephem("horizons_output/"+fn_hires)
    df = format_date(df)
    # planet-specific processing
    if planet.lower() == "mars":
        df = do_extra_mars(df)
    else:
        df = df[["date","Ls","date_dt"]]
    
    # df["date"] = df["date"].str.strip().str[:11]
    df["Ls"] = df["Ls"].round(6)
    df = df.set_index("date")
    fn = f"../../assets/data/solar-longitude/ls-hires/hires-{planet}.json"
    # fn = f"../../_data/ls-hires/hires-{planet}.json"

    dt = df["date_dt"]

    # split up into multiple smaller files with 3 months overlap
    lx = (dt <= "1980-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-a.json"), orient="table")

    lx = (dt >= "1979-09-01") & (dt <= "2000-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-b.json"), orient="table")

    lx = (dt >= "1999-09-01") & (dt <= "2025-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-c.json"), orient="table")

    lx = (dt >= "2024-09-01") & (dt <= "2050-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-d.json"), orient="table")

    lx = (dt >= "2049-09-01") & (dt <= "2100-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-e.json"), orient="table")

    lx = (dt >= "2099-09-01") & (dt <= "2200-03-05")
    df.loc[lx].to_json(fn.replace(".json", "-f.json"), orient="table")
