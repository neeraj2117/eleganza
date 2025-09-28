const paypal = require("paypal-rest-sdk");


paypal.configure({
    mode: 'sandbox',
    client_id: 'AUpTVI5hGp7lvb1buU3nC-IJ9yvtE4L29tkzslfVM0qh0TRtw7Va1qb6LCYaqwti4Iv-JRCc402e-2O8',
    client_secret: 'EADOHS_642Szdp8s33a7FZcVbwneaKA1pIwyLv7aS8ZNda3QqN95uX_J6Ikr_zPRokgOL0jmicIcjKHh',
});

module.exports = paypal;
