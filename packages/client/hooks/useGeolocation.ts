import { useState, useEffect, useCallback } from 'react';
import { Coordinates } from '@core/types';

interface GeolocationState {
    location: Coordinates | null;
    error: string | null;
    isLoading: boolean;
}

export const useGeolocation = (defaultLocation?: Coordinates) => {
    const [state, setState] = useState<GeolocationState>({
        location: defaultLocation || null,
        error: null,
        isLoading: false,
    });

    const getLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setState(prev => ({
                ...prev,
                error: 'Geolocation is not supported by your browser',
                isLoading: false
            }));
            return;
        }

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    location: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    },
                    error: null,
                    isLoading: false
                });
            },
            (error) => {
                let errorMessage = 'An unknown error occurred.';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'User denied the request for Geolocation.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'The request to get user location timed out.';
                        break;
                }
                setState(prev => ({
                    ...prev,
                    error: errorMessage,
                    isLoading: false
                }));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    return { ...state, getLocation };
};
