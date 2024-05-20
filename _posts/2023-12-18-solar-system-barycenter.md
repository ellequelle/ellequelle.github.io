---
title: Solar System Barycenter
categories: solar_system_dynamics
excerpt: "When thinking about solar system we usually imagine the planets orbiting the Sun, but in reality, every object in the solar system, including the Sun, orbits a moving point called the solar system barycenter..."
author: Lavender Elle Hanson
author_profile: true
---

{% include base_path %}

When thinking about solar system we usually imagine the planets orbiting the Sun, but in reality,
every object in the solar system, including the Sun, orbits a moving point called the solar system
[*barycenter*](https://en.wikipedia.org/wiki/Barycenter_(astronomy)).
A barycenter is simply the center of mass of any orbital system.
It is usually close to the most massive body and in planetary systems it is often inside the stellar radius.
In binary systems the barycenter is always located between the centers of the two objects, like in this 
animation of the Earth-Moon system:

<img src="https://upload.wikimedia.org/wikipedia/commons/5/59/Orbit3.gif">

([wikipedia](https://en.wikipedia.org/wiki/Barycenter_(astronomy)#/media/File:Orbit3.gif))

Earth is so much more massive than the Moon that the Earth-Moon barycenter is within the Earth, but 
barycenters of other binary systems it may be between the two objects. For example, the Pluto-Charon
barycenter is well outside Pluto's radius, about 10% of the way to Charon.

Recently when explaining the meaning of barycenter to someone, I started wondering how often the solar system barycenter is outside the Sun, so I decided to figure it out.
JPL's [Navigation and Ancillary Information Facility](https://naif.jpl.nasa.gov/naif/) (NAIF) keeps track of all of the large objects in the solar system and publishes their positions and velocities and how they change over time, or what's known as the "ephemeris" data.
Since everything in the solar system, including the Sun, orbits around the barycenter, this is the reference point from which every object's position and velocity is measured.

To visualize the Sub-barycenter orbit, I looked up the positions of the Sun and the giant planets (Jupiter, Saturn, Uranus, and Neptune) for a series of times between 1800 and 2200 and made a set of figures.
Below is an animation of the position of the solar system barycenter (the red "x") in the horizontal plane between 1950 and 2050.
The black circle marks the outer boundary of the Sun and the colored arrows point in the direction of 
each of the the four giant planets.
When the four giant planets are all on the same side the barycenter is pulled far beyond the solar radius,
and when they are all pulling in different directions the barycenter falls close to the center of the Sun.

<a href="https://ellequelle.github.io/images/barycenter.html"><img src="https://ellequelle.github.io/images/barycenter.gif" style="width:500px;"></a>

Next, I wanted to see the position of the barycenter in all three coordinates over the entire time period.
The figure below shows the Sun-barycenter distance in the x, y, and z directions, with the bottom plot showing the euclidian distance.
It turns out our solar system's barycenter is almost always less than 2 solar radii from the center of the Sun (as you can see in the bottom plot), but its precise location varies quite a bit depending where the planets are in their orbits.
According to these calculations the solar system barycenter spends about 62% of its time outside the Sun's radius about and nearly 3% of its time beyond two solar radii.
The barycenter is only within the Sun about 38% of the time and within half a solar radius of the Sun's center less than 7% of the time.
In other words, you could say Earth actually spends less than half of its time "orbiting the Sun."

<img src="https://ellequelle.github.io/images/barycenter-400.png">

Calculations can be reproduced using <a href="/files/ss_barycenter.ipynb">this Jupyter notebook</a> (<a href="/files/ss_barycenter.pdf">also available as pdf</a>).
