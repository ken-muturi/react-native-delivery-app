import { Colors } from "@/constants/theme";
import {
  useAssignDriver,
  useOrders,
  useUpdateOrderStatus,
} from "@/hooks/useOrders";
import { useOrderStatus } from "@/hooks/useOrderStatus";
import { useAuthStore } from "@/hooks/useUser";
import {
  requestNotificationPermissions,
  sendDriverAssignedNotification,
} from "@/services/notificationService";
import { OrderData } from "@/services/orderService";
import { OrderStatus } from "@/services/orderStatusService";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo } from "react";
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

const OrdersScreen = () => {
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = React.useState<TabType | null>(null);
  const [refreshing, setRefreshing] = React.useState(false);

  // Get current user (driver)
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "admin";

  // Get order statuses from API
  const { data: orderStatus, isLoading: isOrderStatusLoading } =
    useOrderStatus();

  // API-based orders (React Query) - API handles role-based filtering via auth token
  const {
    data: apiOrders,
    isLoading,
    refetch,
    error: ordersError,
  } = useOrders();
  const updateStatusMutation = useUpdateOrderStatus();
  const assignDriverMutation = useAssignDriver();

  // Map API orders to include required fields
  const orders: OrderData[] = useMemo(() => {
    if (apiOrders && apiOrders.length > 0) {
      return apiOrders.map((order) => ({
        ...order,
        id: order.id || "",
        status: order.status,
        createdAt: order.createdAt || new Date().toISOString(),
      }));
    }
    return [];
  }, [apiOrders]);

  // Update activeTab when orderStatus loads
  useEffect(() => {
    if (orderStatus && orderStatus.length > 0 && !activeTab) {
      setActiveTab(isAdmin ? orderStatus[0] : orderStatus[1]);
    }
  }, [orderStatus, isAdmin, activeTab]);

  // Request notification permissions on mount
  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  // Filter orders by active tab (role filtering is done server-side)
  const filteredOrders = orders.filter(
    (order) => order.status === activeTab?.abbrev,
  );

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

  const getOrderStatus = (abbrev?: string): OrderStatus | null => {
    if (!abbrev || !orderStatus) return null;
    return orderStatus?.find((status) => status.abbrev === abbrev) || null;
  };

  // For drivers, skip "new" status - they can only see assigned orders
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus.abbrev) {
      case "new":
        // Only admins can assign drivers
        return isAdmin ? getOrderStatus("driver-assigned") : null;
      case "driver-assigned":
        return getOrderStatus("pickup");
      case "pickup":
        return getOrderStatus("delivered");
      default:
        return null;
    }
  };

  const getActionLabel = (status: string): string => {
    switch (status) {
      case "new":
        return isAdmin ? "Assign Driver" : "";
      case "driver-assigned":
        return "Mark Picked Up";
      case "picked-up":
        return "Start Delivery";
      case "delivered":
        return "Mark Delivered";
      default:
        return "";
    }
  };

  const handleStatusUpdate = (order: OrderData) => {
    const statusObj = getOrderStatus(order.status);
    if (!statusObj) return;

    const nextStatus = getNextStatus(statusObj);
    if (!nextStatus) return;

    Alert.alert(
      "Update Order Status",
      `Change order status to "${nextStatus.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: async () => {
            // For new orders, assign the current driver
            if (
              order.status === "new" &&
              nextStatus.abbrev === "driver-assigned"
            ) {
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
                      order.clientName,
                    );
                  },
                  onError: (error) => {
                    Alert.alert(
                      "Error",
                      "Failed to assign driver. Please try again.",
                    );
                    console.warn("Failed to assign driver:", error);
                  },
                },
              );
            } else {
              // For other status updates, just update the status
              updateStatusMutation.mutate(
                { orderId: order.id || "", status: nextStatus.abbrev },
                {
                  onSuccess: async () => {
                    // Additional handling if needed
                  },
                  onError: (error) => {
                    Alert.alert(
                      "Error",
                      "Failed to update order status. Please try again.",
                    );
                    console.warn("Failed to update order status:", error);
                  },
                },
              );
            }
          },
        },
      ],
    );
  };

  const renderOrderCard = ({ item: order }: { item: OrderData }) => {
    const orderStatusObj = getOrderStatus(order.status);
    return (
      <View style={styles.orderCard}>
        <View style={styles.orderHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderId}>{order.id}</Text>
          </View>
          <Text style={styles.orderTime}>
            {new Date(order.createdAt || new Date()).toLocaleTimeString(
              "en-KE",
              {
                hour: "2-digit",
                minute: "2-digit",
              },
            )}
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
            onPress={() =>
              Alert.alert("Call", `Calling ${order.customerPhone}`)
            }
          >
            <Ionicons name="call-outline" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
        {order.driver && (
          <View style={styles.customerRow}>
            <Ionicons name="bicycle-outline" size={16} color={Colors.muted} />
            <Text style={styles.customerName}>
              {order.driver?.firstname} {order.driver?.othernames}
            </Text>
            <TouchableOpacity
              style={styles.callButton}
              onPress={() =>
                Alert.alert("Call", `Calling ${order.driver?.phone}`)
              }
            >
              <Ionicons name="call-outline" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.itemsContainer}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {order.items.map((item, index) => (
            <Text key={index} style={styles.itemText}>
              {item.quantity}x {item.name}
            </Text>
          ))}
        </View>

        <View style={styles.orderFooter}>
          {/* Show action button only if there's a valid next action */}
          {order.status !== "delivered" && orderStatusObj && (
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: orderStatusObj?.color || Colors.muted,
                },
              ]}
              onPress={() => handleStatusUpdate(order)}
            >
              <Text style={styles.actionButtonText}>
                {getActionLabel(order.status || "new")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name={"receipt-outline"} size={64} color={Colors.muted} />
      <Text style={styles.emptyTitle}>No {activeTab?.title} Orders</Text>
      <Text style={styles.emptySubtitle}>
        {activeTab?.title} orders will appear here
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

  // Show error state
  if (ordersError) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Ionicons
            name="alert-circle-outline"
            size={64}
            color={Colors.danger}
          />
          <Text style={styles.loadingText}>Failed to load orders</Text>
          <Text
            style={{
              color: Colors.muted,
              marginTop: 8,
              textAlign: "center",
              paddingHorizontal: 20,
            }}
          >
            {ordersError instanceof Error
              ? ordersError.message
              : "Unknown error"}
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 16,
              padding: 12,
              backgroundColor: Colors.primary,
              borderRadius: 8,
            }}
            onPress={() => refetch()}
          >
            <Text style={{ color: "white" }}>Retry</Text>
          </TouchableOpacity>
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
        {orderStatus?.map((status) => {
          if (!isAdmin && status.abbrev === "new") return null; // Skip "new" tab for non-admins
          return (
            <TouchableOpacity
              key={status.id}
              style={[
                styles.tab,
                activeTab?.id === status.id && styles.activeTab,
              ]}
              onPress={() => setActiveTab(status)}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab?.id === status.id && styles.activeTabText,
                  ]}
                >
                  {status.title}
                </Text>
                <Text
                  style={[
                    styles.tabCount,
                    activeTab === status && styles.activeTabCount,
                  ]}
                >
                  {
                    orders.filter(
                      (o) =>
                        o.status?.toLowerCase() === status.title.toLowerCase(),
                    ).length
                  }
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
};;

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
