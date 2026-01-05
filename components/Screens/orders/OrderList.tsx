import { OrderStatus } from "@/data/orders";
import React from "react";
import { FlatList, RefreshControl, StyleSheet } from "react-native";
import OrderCard from "./OrderCard";

interface OrderListProps {
  orders: any[];
  getActionLabel: (status: OrderStatus) => string;
  handleStatusUpdate: (order: any) => void;
  statusColors: Record<OrderStatus, string>;
  refreshing: boolean;
  onRefresh: () => void;
  renderEmptyState: () => React.ReactElement;
}

const OrderList: React.FC<OrderListProps> = ({ orders, getActionLabel, handleStatusUpdate, statusColors, refreshing, onRefresh, renderEmptyState }) => {
  return (
    <FlatList
      data={orders}
      renderItem={({ item }) => (
        <OrderCard
          order={item}
          getActionLabel={getActionLabel}
          handleStatusUpdate={handleStatusUpdate}
          statusColors={statusColors}
        />
      )}
      keyExtractor={(item, index) => item.id || `order-${index}`}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={renderEmptyState}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
});

export default OrderList;
