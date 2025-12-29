import { Colors } from '@/constants/theme';
import useOrderStore, { Order, OrderStatus } from '@/hooks/use-orderstore';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useState } from 'react';
import {
  Alert,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabType = OrderStatus;

const statusColors: Record<OrderStatus, string> = {
  new: '#FF9500',
  collected: '#007AFF',
  'in-transit': '#5856D6',
  delivered: '#34C759',
};

const statusLabels: Record<OrderStatus, string> = {
  new: 'New Order',
  collected: 'Collected',
  'in-transit': 'In Transit',
  delivered: 'Delivered',
};

const DriverOrdersScreen = () => {
  const insets = useSafeAreaInsets();
  const { orders, updateOrderStatus, addOrder } = useOrderStore();
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = orders.filter((order) => order.status === activeTab);

  // Add a test order (for demo purposes)
  const addTestOrder = () => {
    const randomOrder = sampleOrders[Math.floor(Math.random() * sampleOrders.length)];
    addOrder(randomOrder);
    Alert.alert('New Order!', `Order from ${randomOrder.restaurantName} received!`);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Simulate refresh - in production, this would fetch from API
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    switch (currentStatus) {
      case 'new':
        return 'collected';
      case 'collected':
        return 'in-transit';
      case 'in-transit':
        return 'delivered';
      default:
        return null;
    }
  };

  const getActionLabel = (status: OrderStatus): string => {
    switch (status) {
      case 'new':
        return 'Accept & Collect';
      case 'collected':
        return 'Start Delivery';
      case 'in-transit':
        return 'Mark Delivered';
      default:
        return '';
    }
  };

  const handleStatusUpdate = (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    Alert.alert(
      'Update Order Status',
      `Change order status to "${statusLabels[nextStatus]}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => updateOrderStatus(order.id, nextStatus),
        },
      ]
    );
  };

  const renderOrderCard = ({ item: order }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] }]}>
            <Text style={styles.statusText}>{statusLabels[order.status]}</Text>
          </View>
        </View>
        <Text style={styles.orderTime}>
          {new Date(order.createdAt).toLocaleTimeString('en-KE', {
            hour: '2-digit',
            minute: '2-digit',
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
          onPress={() => Alert.alert('Call', `Calling ${order.customerPhone}`)}>
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
        <Text style={styles.totalText}>Total: KES {order.total.toLocaleString()}</Text>
        {order.status !== 'delivered' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: statusColors[order.status] }]}
            onPress={() => handleStatusUpdate(order)}>
            <Text style={styles.actionButtonText}>{getActionLabel(order.status)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons
        name={activeTab === 'new' ? 'notifications-outline' : activeTab === 'in-transit' ? 'bicycle-outline' : 'receipt-outline'}
        size={64}
        color={Colors.muted}
      />
      <Text style={styles.emptyTitle}>
        {activeTab === 'new' && 'No New Orders'}
        {activeTab === 'collected' && 'No Collected Orders'}
        {activeTab === 'in-transit' && 'No Orders In Transit'}
        {activeTab === 'delivered' && 'No Delivered Orders'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'new' && 'New orders will appear here'}
        {activeTab === 'collected' && 'Collected orders will appear here'}
        {activeTab === 'in-transit' && 'Orders in transit will appear here'}
        {activeTab === 'delivered' && 'Completed deliveries will show here'}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.addOrderButton} onPress={addTestOrder}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerBadge}>
            <Ionicons name="bicycle" size={20} color={Colors.primary} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'new' && styles.activeTab]}
          onPress={() => setActiveTab('new')}>
          <Text style={[styles.tabText, activeTab === 'new' && styles.activeTabText]}>
            New ({orders.filter((o) => o.status === 'new').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'collected' && styles.activeTab]}
          onPress={() => setActiveTab('collected')}>
          <Text style={[styles.tabText, activeTab === 'collected' && styles.activeTabText]}>
            Collected ({orders.filter((o) => o.status === 'collected').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'in-transit' && styles.activeTab]}
          onPress={() => setActiveTab('in-transit')}>
          <Text style={[styles.tabText, activeTab === 'in-transit' && styles.activeTabText]}>
            Transit ({orders.filter((o) => o.status === 'in-transit').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => setActiveTab('delivered')}>
          <Text style={[styles.tabText, activeTab === 'delivered' && styles.activeTabText]}>
            Done ({orders.filter((o) => o.status === 'delivered').length})
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.dark,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  addOrderButton: {
    padding: 4,
  },
  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  onlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.light,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.muted,
  },
  activeTabText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  orderTime: {
    fontSize: 13,
    color: Colors.muted,
  },
  restaurantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  restaurantName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.dark,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  address: {
    flex: 1,
    fontSize: 14,
    color: Colors.muted,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    backgroundColor: '#E3F2FD',
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
    fontWeight: '600',
    color: Colors.muted,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: Colors.dark,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
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
