import NotificationRepository from "./notification.repository";
import type { InsertNotification, UpdateNotification } from "@/src/db";

async function findAll() {
  return await NotificationRepository.findAll();
}

async function findById(id: string) {
  return await NotificationRepository.findById(id);
}

async function findByFCMToken(token: string) {
  return await NotificationRepository.findByFCMToken(token);
}

async function insert(data: InsertNotification) {
  const notification = await NotificationRepository.findByFCMToken(
    data.fcmToken,
  );

  if (notification) {
    throw new Error(
      `Notification with FCM token ${data.fcmToken} already exists`,
    );
  }

  const [insertedNotifcation] = await NotificationRepository.insert(data);

  if (!insertedNotifcation) {
    throw new Error("Failed to insert notification");
  }

  return insertedNotifcation;
}

async function update(id: string, data: UpdateNotification) {
  const [updatedNotification] = await NotificationRepository.update(id, data);

  if (!updatedNotification) {
    throw new Error(`Failed to update notification with id: ${id}`);
  }

  return updatedNotification;
}

async function remove(id: string) {
  const [deletedNotification] = await NotificationRepository.remove(id);

  if (!deletedNotification) {
    throw new Error(`Failed to delete notification with id: ${id}`);
  }

  return deletedNotification;
}

const NotificationService = {
  findAll,
  findById,
  insert,
  update,
  remove,
  findByFCMToken,
};

export default NotificationService;
