import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

// Mock supabase
jest.mock('../../core/services/supabase', () => ({
    supabase: {
        auth: {
            getUser: jest.fn().mockResolvedValue({ data: { user: null } }),
            onAuthStateChange: jest.fn(() => ({
                data: { subscription: { unsubscribe: jest.fn() } }
            })),
            signOut: jest.fn(),
        },
    },
}));

describe('Header Minimal', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <Header
                    isHome={true}
                    title="Thelokals.com"
                    onSignInClick={() => { }}
                    onSearch={() => { }}
                />
            </BrowserRouter>
        );
    });
});
