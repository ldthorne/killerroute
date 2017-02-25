class Form {
    constructor($form) {
        this.$form = $form;
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
        }).done(this.calculateCoords)
        .fail(function (err) {
            console.error(err);
        })

    }
    calculateCoords(response) {
        console.log(response)
        const points = [
            { lat: response.destinationCoords.lat, lng: response.startingCoords.lng },
            { lat: response.startingCoords.lat, lng: response.destinationCoords.lng },
            response.startingCoords,
            response.destinationCoords
        ]
        // $.get()
    }

    findRelevantCrimes(crimes) {
        const map = crimes.map(function(elem) {
            // return 
        });
    }
}

$(document).ready(function() { 
    $('#sidebar').find('form').each(function() {
        new Form($(this));
    });
})

