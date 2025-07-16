import { initializeApp, cert } from "firebase-admin/app";
import type { ServiceAccount } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import serviceAccount from "../../service-account.json" assert { type: "json" };

initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
});

export const messaging = getMessaging();
