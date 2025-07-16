import { messaging } from "../../lib/firebase-admin";

const deviceToken =
  "eGr9rnKcphqpJI__jxgUfn:APA91bEu59V6Yj3RpbYREYicwZCozluH_RexZvh-TKm4V945SA8ihNAirFssmoHxjr4dIzxAkViEX-1zAz46zvX5kyCaHPryPwGs98H1Jw4UAbEEBGZtxvw";

await messaging.send({
  token: deviceToken,
  notification: {
    title: "Trash Bin Full!",
    body: "Click to view location on map.",
  },
  webpush: {
    fcmOptions: {
      link: "https://yourapp.com/dashboard/map?id=bin123",
    },
  },
});
