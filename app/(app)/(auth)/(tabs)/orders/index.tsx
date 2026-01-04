import { Colors } from '@/constants/theme';
import useOrderStore, {
  Order,
  OrderStatus,
  initialOrders,
} from "@/hooks/use-orderstore";
import {
  requestNotificationPermissions,
  sendDriverAssignedNotification,
} from "@/services/notificationService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TabType = OrderStatus;

const statusColors: Record<OrderStatus, string> = {
  new: "#FF9500",
  "driver-assigned": "#FF6B35",
  "in-transit": "#5856D6",
  collected: "#007AFF",
  delivered: "#34C759",
};

const statusLabels: Record<OrderStatus, string> = {
  new: "New Order",
  "driver-assigned": "Driver Assigned",
  "in-transit": "In Transit",
  collected: "Collected",
  delivered: "Delivered",
};

const DriverOrdersScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { orders, updateOrderStatus, addOrder, resetToInitialOrders } =
    useOrderStore();
  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [refreshing, setRefreshing] = useState(false);

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Add a test order (for demo purposes)
  const addTestOrder = () => {
    const randomOrder =
      initialOrders[Math.floor(Math.random() * initialOrders.length)];
    addOrder(randomOrder);
    Alert.alert(
      "New Order!",
      `Order from ${randomOrder.restaurantName} received!`
    );
  };

  // Reset orders to initial demo data
  const resetOrders = () => {
    Alert.alert(
      "Reset Orders",
      "This will reset all orders to the initial demo data. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetToInitialOrders();
            Alert.alert("Done", "Orders have been reset to initial data.");
          },
        },
      ]
    );
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - in production, this would fetch from API
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "new":
        return "driver-assigned";
      case "driver-assigned":
        return "in-transit";
      case "in-transit":
        return "collected";
      case "collected":
        return "delivered";
      default:
        return null;
    }
  };

  const getActionLabel = (status: OrderStatus): string => {
    switch (status) {
      case "new":
        return "Assign Driver";
      case "driver-assigned":
        return "Start Delivery";
      case "in-transit":
        return "Mark Collected";
      case "collected":
        return "Mark Delivered";
      default:
        return "";
    }
  };

  const handleStatusUpdate = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    Alert.alert(
      "Update Order Status",
      `Change order status to "${statusLabels[nextStatus]}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            updateOrderStatus(order.id, nextStatus);
            // Send push notification when driver is assigned
            if (nextStatus === "driver-assigned") {
              await sendDriverAssignedNotification(
                order.id,
                order.restaurantName
              );
            }
          },
        },
      ]
    );
  };

  const renderOrderCard = ({ item: order }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[order.status] },
            ]}
          >
            <Text style={styles.statusText}>{statusLabels[order.status]}</Text>
          </View>
        </View>
        <Text style={styles.orderTime}>
          {new Date(order.createdAt).toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.restaurantRow}>
        <Ionicons name="restaurant-outline" size={16} color={Colors.muted} />
        <Text style={styles.restaurantName}>{order.restaurantName}</Text>
      </View>

      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={16} color={Colors.muted} />
        <Text style={styles.address} numberOfLines={2}>
          {order.deliveryAddress}
        </Text>
      </View>

      <View style={styles.customerRow}>
        <Ionicons name="person-outline" size={16} color={Colors.muted} />
        <Text style={styles.customerName}>{order.customerName}</Text>
        <TouchableOpacity
          style={styles.callButton}
          onPress={() => Alert.alert("Call", `Calling ${order.customerPhone}`)}
        >
          <Ionicons name="call-outline" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Items:</Text>
        {order.items.map((item, index) => (
          <Text key={index} style={styles.itemText}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalText}>
          Total: KES {order.total.toLocaleString()}
        </Text>
        {order.status !== "delivered" && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: statusColors[order.status] },
            ]}
            onPress={() => handleStatusUpdate(order)}
          >
            <Text style={styles.actionButtonText}>
              {getActionLabel(order.status)}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={
          activeTab === "new"
            ? "notifications-outline"
            : activeTab === "driver-assigned"
            ? "person-outline"
            : activeTab === "in-transit"
            ? "bicycle-outline"
            : "receipt-outline"
        }
        size={64}
        color={Colors.muted}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === "new" && "No New Orders"}
        {activeTab === "driver-assigned" && "No Assigned Orders"}
        {activeTab === "collected" && "No Collected Orders"}
        {activeTab === "in-transit" && "No Orders In Transit"}
        {activeTab === "delivered" && "No Delivered Orders"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "new" && "New orders will appear here"}
        {activeTab === "driver-assigned" && "Assigned orders will appear here"}
        {activeTab === "collected" && "Collected orders will appear here"}
        {activeTab === "in-transit" && "Orders in transit will appear here"}
        {activeTab === "delivered" && "Completed deliveries will show here"}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={addTestOrder}>
            <Ionicons
              name="add-circle-outline"
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton} onPress={resetOrders}>
            <Ionicons name="refresh-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Ionicons name="bicycle" size={20} color={Colors.primary} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "new" && styles.activeTab]}
          onPress={() => setActiveTab("new")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "new" && styles.activeTabText,
            ]}
          >
            New ({orders.filter((o) => o.status === "new").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "driver-assigned" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("driver-assigned")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "driver-assigned" && styles.activeTabText,
            ]}
          >
            Assigned (
            {orders.filter((o) => o.status === "driver-assigned").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "in-transit" && styles.activeTab]}
          onPress={() => setActiveTab("in-transit")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "in-transit" && styles.activeTabText,
            ]}
          >
            Transit ({orders.filter((o) => o.status === "in-transit").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "collected" && styles.activeTab]}
          onPress={() => setActiveTab("collected")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "collected" && styles.activeTabText,
            ]}
          >
            Collected ({orders.filter((o) => o.status === "collected").length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "delivered" && styles.activeTab]}
          onPress={() => setActiveTab("delivered")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "delivered" && styles.activeTabText,
            ]}
          >
            Done ({orders.filter((o) => o.status === "delivered").length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: Colors.light,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  onlineText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.light,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.muted,
  },
  activeTabText: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  orderTime: {
    fontSize: 13,
    color: Colors.muted,
  },
  restaurantRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: Colors.muted,
  },
  customerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  customerName: {
    flex: 1,
    fontSize: 14,
    color: Colors.dark,
  },
  callButton: {
    padding: 8,
    backgroundColor: "#E3F2FD",
    borderRadius: 20,
  },
  itemsContainer: {
    backgroundColor: Colors.light,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemsTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.muted,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 4,
  },
});

export default DriverOrdersScreen;
