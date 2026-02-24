import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ userName, onOpenProfile }) {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good Morning' : currentHour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.greetingText}>{greeting}! 🌾</Text>
          <Text style={styles.nameText}>{userName || 'Farmer'}</Text>
        </View>
        <Pressable onPress={onOpenProfile} style={styles.avatarButton}>
          <Text style={styles.avatarText}>👨‍🌾</Text>
        </Pressable>
      </View>

      {/* Main Dashboard Card */}
      <View style={styles.dashboardCard}>
        <Text style={styles.dashTitle}>Today's Overview</Text>
        
        <View style={styles.bigStatRow}>
          <View style={styles.bigStat}>
            <Text style={styles.bigStatEmoji}>🌾</Text>
            <Text style={styles.bigStatNumber}>86</Text>
            <Text style={styles.bigStatLabel}>Health Score</Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.bigStat}>
            <Text style={styles.bigStatEmoji}>🌡️</Text>
            <Text style={styles.bigStatNumber}>28°</Text>
            <Text style={styles.bigStatLabel}>Current Temp</Text>
          </View>
        </View>

        <View style={styles.miniStatsRow}>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatLabel}>💧 Moisture</Text>
            <Text style={styles.miniStatValue}>62%</Text>
          </View>
          <View style={styles.miniStat}>
            <Text style={styles.miniStatLabel}>☀️ UV Index</Text>
            <Text style={styles.miniStatValue}>High</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <Pressable style={[styles.actionBtn, styles.primaryAction]}>
          <Text style={styles.actionBtnIcon}>📸</Text>
          <Text style={styles.actionBtnText}>Scan Plant</Text>
        </Pressable>
        <Pressable style={[styles.actionBtn, styles.secondaryAction]}>
          <Text style={styles.actionBtnIcon}>💬</Text>
          <Text style={styles.actionBtnTextAlt}>Ask AI</Text>
        </Pressable>
      </View>

      {/* Today's Tasks */}
      <View style={styles.contentSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For You Today</Text>
          <Text style={styles.taskCount}>3 tasks</Text>
        </View>

        <Pressable style={styles.taskCard}>
          <View style={styles.taskLeft}>
            <View style={styles.taskIconBox}>
              <Text style={styles.taskEmoji}>🪴</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Apply Pest Control</Text>
              <Text style={styles.taskDesc}>Neem spray • 5-7 PM today</Text>
            </View>
          </View>
          <View style={styles.urgentDot} />
        </Pressable>

        <Pressable style={styles.taskCard}>
          <View style={styles.taskLeft}>
            <View style={[styles.taskIconBox, styles.taskIconBlue]}>
              <Text style={styles.taskEmoji}>💧</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Water North Field</Text>
              <Text style={styles.taskDesc}>Tomorrow morning • Early</Text>
            </View>
          </View>
        </Pressable>

        <Pressable style={styles.taskCard}>
          <View style={styles.taskLeft}>
            <View style={[styles.taskIconBox, styles.taskIconYellow]}>
              <Text style={styles.taskEmoji}>👀</Text>
            </View>
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Check for Blight</Text>
              <Text style={styles.taskDesc}>Monitor leaves daily</Text>
            </View>
          </View>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6F8FA',
  },

  // Top Bar
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  greetingText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
  },
  avatarButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
  },

  // Dashboard Card
  dashboardCard: {
    backgroundColor: '#16A34A',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 14,
    borderRadius: 20,
    padding: 20,
  },
  dashTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DCFCE7',
    marginBottom: 18,
  },
  bigStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  bigStat: {
    flex: 1,
    alignItems: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bigStatEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  bigStatNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  bigStatLabel: {
    fontSize: 13,
    color: '#DCFCE7',
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  miniStat: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: 12,
  },
  miniStatLabel: {
    fontSize: 12,
    color: '#F0FDF4',
    marginBottom: 4,
  },
  miniStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 20,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryAction: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  secondaryAction: {
    backgroundColor: '#14532D',
  },
  actionBtnIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  actionBtnTextAlt: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  taskCount: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '600',
  },

  // Task Cards
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskIconBlue: {
    backgroundColor: '#DBEAFE',
  },
  taskIconYellow: {
    backgroundColor: '#FEF3C7',
  },
  taskEmoji: {
    fontSize: 20,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  taskDesc: {
    fontSize: 13,
    color: '#6B7280',
  },
  urgentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
});
