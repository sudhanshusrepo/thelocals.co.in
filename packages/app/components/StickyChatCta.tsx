import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Animated, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface StickyChatCtaProps {
    isVisible: boolean;
    onSend: (text: string) => void;
    placeholder?: string;
}

export const StickyChatCta: React.FC<StickyChatCtaProps> = ({ isVisible, onSend, placeholder = "Ask our AI to find a professional..." }) => {
    const [text, setText] = useState('');
    const slideAnim = useRef(new Animated.Value(100)).current; // Start hidden (below screen)

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? 0 : 100,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isVisible]);

    const handleSend = () => {
        if (text.trim()) {
            onSend(text);
            setText('');
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY: slideAnim }] }
            ]}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <View style={styles.mediaButtons}>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome name="microphone" size={20} color={Colors.slate[500]} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <FontAwesome name="video-camera" size={20} color={Colors.slate[500]} />
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={text}
                        onChangeText={setText}
                        multiline
                        maxLength={200}
                    />

                    <TouchableOpacity
                        style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!text.trim()}
                    >
                        <FontAwesome name="paper-plane" size={16} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: Colors.slate[200],
        padding: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    mediaButtons: {
        flexDirection: 'row',
        gap: 4,
        paddingBottom: 8,
    },
    iconButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: Colors.slate[100],
    },
    input: {
        flex: 1,
        backgroundColor: Colors.slate[100],
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 40,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.teal,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 2,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.slate[300],
    },
});
