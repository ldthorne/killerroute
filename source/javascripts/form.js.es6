class Form {
    constructor($form) {
        this.$form = $form;
        this.attachHandler();
    }
    attachHandler() {
        const self = this;
        this.$form.click(function (e) {
            e.preventDefault();
            self.submitForm();

        })
    }
    submitForm() {
        const locations = {
            destination: this.$form.find("#destination"),
            startingPoint: this.$form.find("#starting-point")
        }
        $.ajax({
            url: "",
            method: "POST",
            data: locations,
        }).then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.error(err);
        })

    }
}

