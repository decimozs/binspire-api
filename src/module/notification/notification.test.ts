import { messaging } from "../../lib/firebase-admin";

const deviceTokens = [
  "fw4msCWbreH140KjmZUzBh:APA91bGYw0EZ_WEPbBPZb7bycoFOQ4P25Cu2vA5U5JG0nb-xWcqHD19xuTXPZJZ5RWlP1Vt69R0pTPqUq1HF6j-3NhDPKTEuRfOdctcfXDCiakIVM5GZusM",
  "dfRSdDUO41VcYSYineUy7O:APA91bHio2oya3G_V54Pbcr2xarg_FZuAWQiMuSCbiGlQgCFvkMs5xW5pQFkDT9n42QME4lKbxVivkUAIeT-rOYl3OOQmc_T-43-Ze5CqHII1lGX0VtOVcA",
  "fi6YTDzD0YdC4C0k52BLMo:APA91bF-t34fBxhGROZmdwoyAxOac5xw8LPKUZCETCs27er-ufDrdtcBo3s80DDLQ2vqwYpZrILvXNuArE6jPvbnsbY11aqeef95A5cVfG6u8dugHumv4zo",
];

await messaging.sendEachForMulticast({
  tokens: deviceTokens,
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
