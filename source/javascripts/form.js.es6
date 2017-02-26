class Form {
    constructor($form) {
        this.$form = $form;
        this.$map = $('#map')
        this.attachHandler();
    }
    attachHandler() {
        const self = this;
        this.$form.submit(function (e) {
            e.preventDefault();
            self.submitForm();
        })
    }
    submitForm() {
        const locations = {
            destination: this.$form.find("#destination").val(),
            startingPoint: this.$form.find("#starting-point").val()
        }
        if (!locations.destination || !locations.startingPoint) {
            alert('enter shit, dumbass')
        }
        $.ajax({
            url: 'https://infinite-ridge-11745.herokuapp.com/geocode',
            method: 'POST',
            data: JSON.stringify(locations),
            dataType: 'json'
        }).done((response) => {
            this.calculateCoords(response)
        })
        .fail(function (err) {
            console.error(err);
        })

    }
    calculateCoords(response) {
        console.log(response)
        this.startingCoords = response.startingCoords;
        this.destinationCoords = response.destinationCoords;
        const points = [
            { lat: response.destinationCoords.lat, lng: response.startingCoords.lng },
            { lat: response.startingCoords.lat, lng: response.destinationCoords.lng },
            response.startingCoords,
            response.destinationCoords
        ]
        $.ajax({
            url: 'http://62.220.148.175:5000/crime/api',
            method: 'POST',
            data: JSON.stringify(points),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json'
        })
        .then((crimes) => {
            console.log(crimes);
            this.findRelevantCrimes(crimes)
        })
        .catch(function(err) {
            console.error(err);
        })
        // $.get()
    }

    findRelevantCrimes(crimes) {
        crimes = crimes.points.map(function(elem) {
            return {
                lat: elem[0],
                lng: elem[1]
            }
        });
        let closebyCrimes = crimes.filter( (elem) => {
            var angleDeg = Math.atan2(elem.lat - this.startingCoords.lat, elem.lng - this.startingCoords.lng) * 180 / Math.PI;
            return angleDeg >= 20;
        });

        if (closebyCrimes.length > 5) {
            console.log('lotta crims heres')
            closebyCrimes = closebyCrimes.slice(0,3);
        }
        this.getDirections(closebyCrimes);
    }

    getDirections(crimes) {
        const origin = `origin=${this.startingCoords.lat}%2C${this.startingCoords.lng}`
        const destination = `destination=${this.destinationCoords.lat}%2C${this.destinationCoords.lng}`
        const directionsService = new google.maps.DirectionsService;
        const directionsDisplay = new google.maps.DirectionsRenderer({
            suppressMarkers: true
        });
        directionsDisplay.setMap(window.map);
        const waypoints = crimes.map((crime) => {
            return {
                location: crime,
                stopover: true
            }
        })

        console.log(waypoints.length)
        directionsService.route({
            origin: this.startingCoords,
            destination: this.destinationCoords,
            waypoints: waypoints,
            optimizeWaypoints: true,
            travelMode: 'DRIVING'
        }, function(res, status) {
            console.log(res, status)
            directionsDisplay.setDirections(res)
        })

        
    }
}

$(document).ready(function () {
    $('#sidebar').find('form').each(function () {
        var form = new Form($(this));
        const destination = $(this).find("#destination")[0];
        const startingPoint = $(this).find("#starting-point")[0];
        const options = { types: ["address"], strictBounds: true, bounds: new google.maps.LatLngBounds(new google.maps.LatLng(40.496020, -74.256508), new google.maps.LatLng(40.854265, -73.668605)) };
        new google.maps.places.Autocomplete(destination, options);
        new google.maps.places.Autocomplete(startingPoint, options);
    });
})

