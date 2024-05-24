from io import StringIO
import pandas as pd

file_paths = (
"horizons_results_eros.txt",
"horizons_results_didymos.txt",
"horizons_results_bennu.txt",
"horizons_results_arrokoth.txt",
"horizons_results_67p.txt",
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
      '67p', 'eros', 'ceres', 'bennu', 'didymos', 'arrokoth',
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

for planet in planet_list:
    fn = "horizons_results_" + planet + ".txt"

    df = ingest_horizon_ephem("horizons_output/"+fn)
    dt = pd.to_datetime(df.date)
    df["date"] = dt.dt.strftime("%Y-%m-%d")
    lx = (dt >= "1960-01-01") & (dt <= "2070-01-01")
    if planet in ["saturn", "uranus", "neptune", "pluto", "arrokoth"]:
        lx &= df["date"].str.contains("-01-")
    elif planet == "earth":
        lx = (dt >= "2000-01-01") & (dt <= "2040-01-01")
    else:
        pass
        # lx &= df["date"].str.contains("-Jan-") | df["date"].str.contains("-Jun-")
    df = df.loc[lx]
    df["date"] = df["date"].str.strip().str[:11]
    df["Ls"] = df["Ls"].round(1)
    fn = f"{planet}.json"
    if planet == "67p":
        fn = "_"+fn
    df[["date","Ls"]].set_index("date").to_json("../../_data/"+fn, orient="table")
    df[["date","Ls"]].set_index("date").to_json(fn, orient="table")

    if planet in ("didymos", "arrokoth"):
        continue
    fn_hires = "horizons_hires/horizons_results_hires-" + planet + ".txt"
    df = ingest_horizon_ephem("horizons_output/"+fn_hires)
    df["date"] = df["date"].str.strip().str[:11]
    df["Ls"] = df["Ls"].round(3)
    df = df[["date","Ls"]].set_index("date")
    fn = f"../../_data/ls-hires/hires-{planet}.json"

    dt = pd.to_datetime(df.index)

    # split up into multiple smaller files
    lx = (dt <= "1980-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-a.json"))

    lx = (dt > "1980-01-01") & (dt <= "2000-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-b.json"))

    lx = (dt > "2000-01-01") & (dt <= "2025-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-c.json"))

    lx = (dt > "2025-01-01") & (dt <= "2050-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-d.json"))

    lx = (dt > "2050-01-01") & (dt <= "2100-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-e.json"))

    lx = (dt > "2100-01-01") & (dt <= "2200-01-01")
    df.loc[lx].to_json(fn.replace(".json", "-f.json"))
