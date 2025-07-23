import { messaging } from "../../lib/firebase-admin";

const deviceTokens =
  "dQBW767EtZBKaylUTGYY_a:APA91bH3bZIY_rJtJWIoYDa6tXLJ655Vy_JMq0fo09GNxHeZrWBpNMTaOaSOaxeof1wXl6nFIw36GVawY7o4y_QmCX5XQGeWWO4BcqcnMgSsYRjA9cUQbDI";

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
