---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

Education
======
* B.S. in Physics and Chemistry, Luther College, 2013
* M.S. in Atmospheric Science, The Pennsylvania State University, 2018
* Ph.D in Earth and Planetary Sciences, Johns Hopkins University, 2025 (expected)

Work experience
======
* Post-Masters research at NASA GSFC with [Scott Guzewich](https://science.gsfc.nasa.gov/solarsystem/bio/scott.d.guzewich) and [Carrie Anderson](https://science.gsfc.nasa.gov/sci/bio/carrie.m.anderson), 2019 to 2020
  
Skills
======
* Cloud microphysical modelling
* Orbital imagery analysis
* Numerical modeling and calculations using
  * Fortran (77/90)
  * [Python](https://python.org)
* Data processing and analysis using
  * [pandas](https://pandas.pydata.org/)
  * [Xarray](https://xarray.dev/)
  * [SciPy](https://scipy.org/)
  * [IPython](https://ipython.org/)
  * [Matplotlib](https://matplotlib.org/)
  * [Jupyter lab](https://jupyter.org/)

Publications
======
  (see [Google Scholar](https://scholar.google.com/citations?user=4Q3F054AAAAJ&hl=en) or [NASA ADS](https://ui.adsabs.harvard.edu/search/fq=%7B!type%3Daqp%20v%3D%24fq_database%7D&fq=%7B!type%3Daqp%20v%3D%24fq_aff%7D&fq_aff=(aff_facet_hier%3A%220%2FGSFC%22%20OR%20aff_facet_hier%3A%220%2FJHU%22%20OR%20aff_facet_hier%3A%220%2FPSU%22)&fq_database=(database%3Aastronomy%20OR%20database%3Aphysics)&q=%20author%3A%22hanson%2C%20l%20e%22&sort=date%20desc%2C%20bibcode%20desc&p_=0))
  <ul>{% for post in site.publications %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
Teaching
======
  <ul>{% for post in site.teaching %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>

Software
======
 * [mcspy](https://github.com/ellequelle/mcspy) python library to retrieve and consolidate atmospheric profile data from the [Mars Climate Sounder](https://mars.nasa.gov/mro/mission/instruments/mcs/)
 * [saturnLs](https://github.com/ellequelle/solar-longitude) python script for converting between date and solar longitude at Saturn
 