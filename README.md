# Camping-and-Hiking-Trails
The way this app is used is it pulls trails and camp sites from REI's web api in order to find new camping spots and trails for a user to view. The flow starts with required user input city, state, search radius, number of requested hits. The user may opt to find either campsites, trails, or both. The user input is then put through google Geo to get the latitude and longitude so that the api web address can be created. Once the lat/long is obtained from google it must be converted to lat/long abbreviations that REI recognizes in order to run each of their API’s. Depending on if the user opted to obtain only camping spots, trails or both the code will go to the respective functions to run the API’s for either camping spots or trails. Once the api responds the DOM is manipulated with the returned information.

Issues encountered mainly pertain to the setup of the visual expectation of google markers displaying information from the returned api information. Additionally it was found the REI API does not have pictures to go with every trail or camp spot as originally expected. Additionally it was desired that there was more data that could be passed in the responses such as weather, elevation, and the full trail length/path. Unfortunately only limited data was offered.


Technologies used:
HTML
CSS3
JavaScript
jQuery
Google geo
Google maps/markers
REI hiking project API