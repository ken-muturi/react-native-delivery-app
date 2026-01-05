import { Colors } from "@/constants/theme";
import { OrderStatus } from "@/data/orders";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface OrderCardProps {
  order: any;
  getActionLabel: (status: OrderStatus) => string;
  handleStatusUpdate: (order: any) => void;
  statusColors: Record<OrderStatus, string>;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, getActionLabel, handleStatusUpdate, statusColors }) => {
  const [itemsExpanded, setItemsExpanded] = useState(false);
  return (
    <View style={{ backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: Colors.dark }}>{order.id}</Text>
        </View>
        <Text style={{ fontSize: 13, color: Colors.muted }}>
          {new Date(order.createdAt || new Date()).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Ionicons name="restaurant-outline" size={16} color={Colors.muted} />
        <Text style={{ fontSize: 15, fontWeight: "600", color: Colors.dark, marginLeft: 8 }}>{order.clientName}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
        <Ionicons name="location-outline" size={16} color={Colors.muted} />
        <Text style={{ flex: 1, fontSize: 14, color: Colors.muted, marginLeft: 8 }} numberOfLines={2}>{order.deliveryAddress}</Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Ionicons name="person-outline" size={16} color={Colors.muted} />
        <Text style={{ flex: 1, fontSize: 14, color: Colors.dark, marginLeft: 8 }}>{order.customerName}</Text>
        <TouchableOpacity style={{ padding: 8, backgroundColor: "#E3F2FD", borderRadius: 20 }} onPress={() => Alert.alert("Call", `Calling ${order.customerPhone}`)}>
          <Ionicons name="call-outline" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>
      <View style={{ backgroundColor: Colors.light, padding: 12, borderRadius: 8, marginBottom: 12 }}>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }} onPress={() => setItemsExpanded((v) => !v)} accessibilityRole="button" accessibilityLabel={itemsExpanded ? 'Collapse items' : 'Expand items'}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.muted }}>Items</Text>
          <Ionicons name={itemsExpanded ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} color={Colors.muted} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        {itemsExpanded && order.items.map((item: any, index: number) => (
          <Text key={index} style={{ fontSize: 14, color: Colors.dark, marginTop: 2 }}>
            {item.quantity}x {item.name}
          </Text>
        ))}
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {order.status !== "delivered" && getActionLabel(order.status as OrderStatus) !== "" && (
          <TouchableOpacity style={{ paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, backgroundColor: statusColors[order.status as OrderStatus] }} onPress={() => handleStatusUpdate(order)}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#fff" }}>{getActionLabel(order.status as OrderStatus)}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default OrderCard;
