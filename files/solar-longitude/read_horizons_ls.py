from io import StringIO
import pandas as pd

file_paths = (
"horizons_results_433-eros.txt",
"horizons_results_65803-didymos.txt",
"horizons_results_101955-bennu.txt",
"horizons_results_486958-arrokoth.txt",
"horizons_results_ceres.txt",
"horizons_results_jupiter.txt",
"horizons_results_mars.txt",
"horizons_results_mercury.txt",
"horizons_results_neptune.txt",
"horizons_results_pluto.txt",
"horizons_results_saturn.txt",
"horizons_results_uranus.txt",
"horizons_results_venus.txt",
)

for fn in file_paths:
    planet = fn[17:-4]

    s = ""
    with open("horizons_output/"+fn, "r") as f:
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
    df["date"] = df["date"].str.strip().str[:11]
    df["Ls"] = df["Ls"].round(1)
    df[["date","Ls"]].set_index("date").to_json(f"{planet}.json", orient="table")
