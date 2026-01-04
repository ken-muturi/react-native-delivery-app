import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

/**
 * Request notification permissions
 * @returns boolean indicating if permissions were granted
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Failed to get notification permission");
    return false;
  }

  // Configure notification channel for Android
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("delivery-updates", {
      name: "Delivery Updates",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6B35",
    });
  }

  return true;
}

/**
 * Send a local notification immediately
 */
export async function sendLocalNotification(
  content: NotificationContent
): Promise<string> {
  const notificationId = await Notifications.scheduleNotificationAsync({
    content: {
      title: content.title,
      body: content.body,
      data: content.data || {},
      sound: true,
    },
    trigger: null, // null means show immediately
  });

  return notificationId;
}

/**
 * Send a driver assigned notification
 */
export async function sendDriverAssignedNotification(
  orderId: string,
  restaurantName: string
): Promise<string> {
  return sendLocalNotification({
    title: "🚴 Driver Assigned!",
    body: `A driver has been assigned to order ${orderId} from ${restaurantName}`,
    data: { orderId, type: "driver-assigned" },
  });
}

/**
 * Send an order status update notification
 */
export async function sendOrderStatusNotification(
  orderId: string,
  status: string,
  restaurantName: string
): Promise<string> {
  const statusMessages: Record<string, { title: string; body: string }> = {
    "driver-assigned": {
      title: "🚴 Driver Assigned!",
      body: `A driver has been assigned to your order from ${restaurantName}`,
    },
    "in-transit": {
      title: "🚗 On The Way!",
      body: `Your order from ${restaurantName} is on its way`,
    },
    collected: {
      title: "📦 Order Collected!",
      body: `Driver has collected your order from ${restaurantName}`,
    },
    delivered: {
      title: "✅ Delivered!",
      body: `Your order from ${restaurantName} has been delivered`,
    },
  };

  const message = statusMessages[status] || {
    title: "Order Update",
    body: `Order ${orderId} status updated to ${status}`,
  };

  return sendLocalNotification({
    title: message.title,
    body: message.body,
    data: { orderId, status, type: "order-status-update" },
  });
}
