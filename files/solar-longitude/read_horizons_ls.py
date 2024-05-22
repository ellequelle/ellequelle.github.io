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

for fn in file_paths:
    planet = fn[17:-4]

    df = ingest_horizon_ephem("horizons_output/"+fn)
    dt = pd.to_datetime(df.date)
    lx = (dt >= "1960-01-01") & (dt <= "2070-01-01")
    if planet in ["saturn", "uranus", "neptune", "pluto", "arrokoth"]:
        lx &= df["date"].str.contains("-Jan-")
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
