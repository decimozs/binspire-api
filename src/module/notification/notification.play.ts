import { messaging } from "../../lib/firebase-admin";

const deviceTokens =
  "fw4msCWbreH140KjmZUzBh:APA91bGYw0EZ_WEPbBPZb7bycoFOQ4P25Cu2vA5U5JG0nb-xWcqHD19xuTXPZJZ5RWlP1Vt69R0pTPqUq1HF6j-3NhDPKTEuRfOdctcfXDCiakIVM5GZusM";

await messaging.send({
  token: deviceTokens,
  notification: {
    title: "Test Notification",
    body: "Binspire Test Push Notifications",
  },
  data: {
    date: new Date().toISOString(),
  },
  webpush: {
    fcmOptions: {
      link: "https://yourapp.com/dashboard/map?id=bin123",
    },
  },
});
