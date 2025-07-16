import { messaging } from "../../lib/firebase-admin";

const deviceToken =
  "fw4msCWbreH140KjmZUzBh:APA91bGYw0EZ_WEPbBPZb7bycoFOQ4P25Cu2vA5U5JG0nb-xWcqHD19xuTXPZJZ5RWlP1Vt69R0pTPqUq1HF6j-3NhDPKTEuRfOdctcfXDCiakIVM5GZusM";

await messaging.send({
  token: deviceToken,
  notification: {
    title: "Test Notification",
    body: "Binspire Test Push Notifications",
  },
  webpush: {
    fcmOptions: {
      link: "https://yourapp.com/dashboard/map?id=bin123",
    },
  },
});
