/****************************************
Script by Kohl Meister
This app.js helps this website do things!
2018-03-25
****************************************/

// Variables
var map;
var windowOpen = null;
var flickrId = '3e2216e89756bb527fe8a0148ffba46f';
var clientId = '001JB2UODACYYIV52AZA3JNLWVBI10GDYRG1EMDT3TNECOCU';
var clientSecret = 'MY4C33UL3MQ2SHTFV52W1R5PPW0EDPE0JSFO0XKTA0M4RAI2';

var Location = function(data) {
  var self = this;
  // Data from initial locations, and lower case for filtering
  this.title = data.title;
  this.lowerTitle = data.title.toLowerCase();
  this.location = data.location;
  this.search = data.searchString;

/***********************************************
  **THIS SECTION WAS NEVER OPERATIONAL**
  *Issue with JSON response. Flickr isn't a standard JSON format? it prefixes
  *FlickrAPI(JSON) or something like that...?

  // Search flickr using locations
  var searchURL = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&text=" +
  data.searchString + "&format=json&api_key=3e2216e89756bb527fe8a0148ffba46f";
  this.aha = searchURL

  var rawJSON = Get(searchURL)
  var trimJSON = rawJSON.replace("jsonFlickrApi(","");
  var trimJSON2 = trimJSON.substr( 0, trimJSON.length - 1 );

  var jsonFormat = JSON.parse(trimJSON2);

  self.foto = jsonFormat.photos.photo.id[i];

  $.getJSON(searchURL).done(function(data) {
    if (data.stat == 'ok') {
      var imageUrl, flickrPhotoInfoUrl, originalImgSrc;
      self.foto = data.photos.photo.id[1]
    }
    //var photoURL = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getsizes&photo_id='+photoId+'&format=json&api_key='+flickrId

  }).fail(function() {
    alert('There was a problem retrieving information from Flickr. Please try again later.')
  });

***********************************************/

  // FourSquare URL
  var fsURL = 'https://api.foursquare.com/v2/venues/search?v=20180101&ll=' + this.location.lat + ',' + this.location.lng + '&client_id=' + clientId + '&client_secret=' + clientSecret + '&query=' + this.search;

  // Parse returned string into JSON using jQuery
  $.getJSON(fsURL).done(function(data) {
    var response = data.response.venues[0];
    self.address = response.location.formattedAddress;
    self.type = response.categories[0].name;
    self.url = response.url;
    self.stats = response.stats.checkinsCount;
  }).fail(function() {
    alert('There was a problem with the FourSquare API. Please try again later.');
  });

  // Information for each marker
  self.marker = new google.maps.Marker({
    map : map,
    position : data.location,
    title : data.title,
    animation : google.maps.Animation.DROP,
  });

  // Opens the info window when clicked from list view
  self.openWindow = function() {
    google.maps.event.trigger(self.marker, 'click');
  };

  // Listener to effect marker when clicked
  self.marker.addListener('click', function() {
    // If an info window is already open, close it
    if (windowOpen) {
      windowOpen.close();
    }

    // Content for info window
    var markerContent = [
      '<p><b>',self.title,'</b></p>',
      '<p>',self.address,'</p>',
      '<p>',self.type,'</p>',
      '<p>',self.url,'</p>',
      '<p>Number of user checkins: ',self.stats,'</p>'
    ];

    // Put content into google maps InfoWindow
    var infoWindow = new google.maps.InfoWindow({ content: markerContent.join('') });

    // Open info window on map & marker
    infoWindow.open(map, self.marker);
    windowOpen = infoWindow;

    // Make icon bounce then stop
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 2110);
  });
};

// M-V-VM - VM component
function myViewModel() {
  var self = this;
  // Variables to store searched string and places array
  this.searchBar = ko.observable('');
  this.places = ko.observableArray();

  // Creates map - centered on Calgary with custom style
  map = new google.maps.Map(document.getElementById('map'), {
    center : {lat : 51.0420, lng : -114.0555532},
    zoom : 15,
    styles : mapStyle
  });

  // Initial location data stored into observableArray
  placesOfInterest.forEach(function(input) {
    var aPlace = new Location(input);
    self.places.push(aPlace);
  });

  // Knockout computed function to determine if searched string matchs string in location list
  this.filterTheList = ko.computed(function() {
    return this.places().filter(function(aPlace) {
      var include = aPlace.lowerTitle.indexOf(this.searchBar().toLowerCase()) !== -1;
      aPlace.marker.setVisible(include);
      return include;
    }, this);
  }, this);
}

// Error net for failed google maps response
googleFail = function googleFail() {
  alert('There was a problem retrieving information from Google at this moment. Please try again later.');
};

// Initialize the app!
function init() {
  ko.applyBindings(new myViewModel());
}
