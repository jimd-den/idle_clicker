import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useWorkTimer } from '@/contexts/WorkTimerContext';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PlayScreen() {
    const { isRunning, elapsedTime, clicks, startTimer, pauseTimer, incrementClicks } = useWorkTimer();
    const timerColor = useThemeColor({}, 'tint');

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <ThemedText style={[styles.timerText, { color: timerColor }]} type="title">{formatTime(elapsedTime)}</ThemedText>
                <ThemedText>Units per minute: {(clicks / (elapsedTime / 60000)).toFixed(2)}</ThemedText>
            </View>

            <TouchableOpacity style={styles.clickButton} onPress={incrementClicks}>
                <Text style={styles.clickButtonText}>Click!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={isRunning ? pauseTimer : startTimer}>
                <Text style={styles.actionButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 20,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    clickButton: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    clickButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#687076',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
```

contexts/WorkTimerContext.tsx
```tsx
<<<<<<< SEARCH
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useWorkTimer } from '@/contexts/WorkTimerContext';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function PlayScreen() {
    const { isRunning, elapsedTime, clicks, startTimer, pauseTimer, incrementClicks } = useWorkTimer();
    const timerColor = useThemeColor({}, 'tint');

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <View style={styles.container}>
            <View style={styles.timerContainer}>
                <ThemedText style={[styles.timerText, { color: timerColor }]} type="title">{formatTime(elapsedTime)}</ThemedText>
                <ThemedText>Units per minute: {(clicks / (elapsedTime / 60000)).toFixed(2)}</ThemedText>
            </View>

            <TouchableOpacity style={styles.clickButton} onPress={incrementClicks}>
                <Text style={styles.clickButtonText}>Click!</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={isRunning ? pauseTimer : startTimer}>
                <Text style={styles.actionButtonText}>{isRunning ? 'Pause' : 'Start'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 20,
    },
    timerContainer: {
        alignItems: 'center',
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    clickButton: {
        backgroundColor: '#0a7ea4',
        paddingVertical: 20,
        paddingHorizontal: 40,
        borderRadius: 10,
    },
    clickButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    actionButton: {
        backgroundColor: '#687076',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
});
