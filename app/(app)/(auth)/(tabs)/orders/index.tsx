import { Colors } from '@/constants/theme';
import { OrderStatus } from "@/data/orders";
import { useAuthStore } from "@/hooks/use-userstore";
import {
  useAssignDriver,
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/useOrders";
import {
  requestNotificationPermissions,
  sendDriverAssignedNotification,
} from "@/services/notificationService";
import { OrderData } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
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
  pickup: "#007AFF",
  "in-transit": "#5856D6",
  delivered: "#34C759",
};

const statusLabels: Record<OrderStatus, string> = {
  new: "New Order",
  "driver-assigned": "Driver Assigned",
  pickup: "Pickup",
  "in-transit": "In Transit",
  delivered: "Delivered",
};

const OrdersScreen = () => {
  const insets = useSafeAreaInsets();

  // Get current user (driver)
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  // API-based orders (React Query) - API handles role-based filtering via auth token
  const { data: apiOrders, isLoading, isError, error, refetch } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const assignDriverMutation = useAssignDriver();

  // Debug logging
  useEffect(() => {
    console.log("[OrdersScreen] apiOrders:", apiOrders?.length, "total");
    console.log("[OrdersScreen] isLoading:", isLoading);
    console.log("[OrdersScreen] isError:", isError);
    if (isError) console.log("[OrdersScreen] error:", error);
    // Log unique statuses from API
    if (apiOrders && apiOrders.length > 0) {
      const statuses = [...new Set(apiOrders.map((o) => o.status))];
      console.log("[OrdersScreen] Unique statuses from API:", statuses);
    }
  }, [apiOrders, isLoading, isError, error]);

  // Map API status to frontend status (handle legacy "collected" status)
  const mapStatus = (status: string): OrderStatus => {
    if (status === "collected") return "pickup";
    return (status as OrderStatus) || "new";
  };

  // Map API orders to include required fields
  const orders: OrderData[] = useMemo(() => {
    console.log(
      "[OrdersScreen] Processing apiOrders:",
      apiOrders?.length || 0,
      "items"
    );
    if (apiOrders && apiOrders.length > 0) {
      return apiOrders.map((order) => ({
        ...order,
        id: order.id || "",
        status: mapStatus(order.status || "new"),
        createdAt: order.createdAt || new Date().toISOString(),
      }));
    }
    return [];
  }, [apiOrders]);

  const [activeTab, setActiveTab] = useState<TabType>("new");
  const [refreshing, setRefreshing] = useState(false);

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Filter orders by active tab (role filtering is done server-side)
  const filteredOrders = orders.filter((order) => order.status === activeTab);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.warn("Failed to refresh orders:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // For drivers, skip "new" status - they can only see assigned orders
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case "new":
        // Only admins can assign drivers
        return isAdmin ? "driver-assigned" : null;
      case "driver-assigned":
        return "pickup";
      case "pickup":
        return "in-transit";
      case "in-transit":
        return "delivered";
      default:
        return null;
    }
  };

  const getActionLabel = (status: OrderStatus): string => {
    switch (status) {
      case "new":
        return isAdmin ? "Assign Driver" : "";
      case "driver-assigned":
        return "Mark Pickup";
      case "pickup":
        return "Start Delivery";
      case "in-transit":
        return "Mark Delivered";
      default:
        return "";
    }
  };

  const handleStatusUpdate = (order: OrderData) => {
    const nextStatus = getNextStatus(order.status as OrderStatus);
    if (!nextStatus) return;

    Alert.alert(
      "Update Order Status",
      `Change order status to "${statusLabels[nextStatus]}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            // For new orders, assign the current driver
            if (order.status === "new" && nextStatus === "driver-assigned") {
              if (!user?.id) {
                Alert.alert("Error", "User not found. Please log in again.");
                return;
              }

              assignDriverMutation.mutate(
                { orderId: order.id || "", driverId: user.id },
                {
                  onSuccess: async () => {
                    await sendDriverAssignedNotification(
                      order.id || "",
                      order.clientName
                    );
                  },
                  onError: (error) => {
                    Alert.alert(
                      "Error",
                      "Failed to assign driver. Please try again."
                    );
                    console.warn("Failed to assign driver:", error);
                  },
                }
              );
            } else {
              // For other status updates, just update the status
              updateStatusMutation.mutate(
                { orderId: order.id || "", status: nextStatus },
                {
                  onSuccess: async () => {
                    // Additional handling if needed
                  },
                  onError: (error) => {
                    Alert.alert(
                      "Error",
                      "Failed to update order status. Please try again."
                    );
                    console.warn("Failed to update order status:", error);
                  },
                }
              );
            }
          },
        },
      ]
    );
  };

  const renderOrderCard = ({ item: order }: { item: OrderData }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColors[order.status as OrderStatus] },
            ]}
          >
            <Text style={styles.statusText}>
              {statusLabels[order.status as OrderStatus]}
            </Text>
          </View>
        </View>
        <Text style={styles.orderTime}>
          {new Date(order.createdAt || new Date()).toLocaleTimeString("en-KE", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <View style={styles.clientRow}>
        <Ionicons name="restaurant-outline" size={16} color={Colors.muted} />
        <Text style={styles.clientName}>{order.clientName}</Text>
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
          Total: KES{" "}
          {typeof order.total === "number" && !isNaN(order.total)
            ? order.total.toLocaleString("en-KE", { minimumFractionDigits: 2 })
            : "0.00"}
        </Text>
        {/* Show action button only if there's a valid next action */}
        {order.status !== "delivered" &&
          getActionLabel(order.status as OrderStatus) !== "" && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: statusColors[order.status as OrderStatus] },
              ]}
              onPress={() => handleStatusUpdate(order)}
            >
              <Text style={styles.actionButtonText}>
                {getActionLabel(order.status as OrderStatus)}
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
            : activeTab === "pickup"
            ? "bag-handle-outline"
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
        {activeTab === "pickup" && "No Pickup Orders"}
        {activeTab === "in-transit" && "No Orders In Transit"}
        {activeTab === "delivered" && "No Delivered Orders"}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === "new" && "New orders will appear here"}
        {activeTab === "driver-assigned" && "Assigned orders will appear here"}
        {activeTab === "pickup" && "Pickup orders will appear here"}
        {activeTab === "in-transit" && "Orders in transit will appear here"}
        {activeTab === "delivered" && "Completed deliveries will show here"}
      </Text>
    </View>
  );

  // Show loading state on initial load
  if (isLoading && orders.length === 0) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={onRefresh}>
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
          <View style={styles.tabContent}>
            <Text
              style={[
                styles.tabText,
                activeTab === "new" && styles.activeTabText,
              ]}
            >
              New
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === "new" && styles.activeTabCount,
              ]}
            >
              {orders.filter((o) => o.status === "new").length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "driver-assigned" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("driver-assigned")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                styles.tabText,
                activeTab === "driver-assigned" && styles.activeTabText,
              ]}
            >
              Assigned
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === "driver-assigned" && styles.activeTabCount,
              ]}
            >
              {orders.filter((o) => o.status === "driver-assigned").length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "pickup" && styles.activeTab]}
          onPress={() => setActiveTab("pickup")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                styles.tabText,
                activeTab === "pickup" && styles.activeTabText,
              ]}
            >
              Pickup
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === "pickup" && styles.activeTabCount,
              ]}
            >
              {orders.filter((o) => o.status === "pickup").length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "in-transit" && styles.activeTab]}
          onPress={() => setActiveTab("in-transit")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                styles.tabText,
                activeTab === "in-transit" && styles.activeTabText,
              ]}
            >
              Transit
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === "in-transit" && styles.activeTabCount,
              ]}
            >
              {orders.filter((o) => o.status === "in-transit").length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "delivered" && styles.activeTab]}
          onPress={() => setActiveTab("delivered")}
        >
          <View style={styles.tabContent}>
            <Text
              style={[
                styles.tabText,
                activeTab === "delivered" && styles.activeTabText,
              ]}
            >
              Done
            </Text>
            <Text
              style={[
                styles.tabCount,
                activeTab === "delivered" && styles.activeTabCount,
              ]}
            >
              {orders.filter((o) => o.status === "delivered").length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item, index) => item.id || `order-${index}`}
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
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.muted,
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
  tabContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.muted,
  },
  activeTabText: {
    color: "#fff",
  },
  tabCount: {
    fontSize: 9,
    fontWeight: "600",
    color: Colors.muted,
    marginLeft: 1,
    marginTop: -2,
  },
  activeTabCount: {
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
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  clientName: {
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

export default OrdersScreen;
