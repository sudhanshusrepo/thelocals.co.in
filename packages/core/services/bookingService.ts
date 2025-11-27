
import { supabase } from './supabase';
import { Booking, BookingStatus } from '../types';
import { logger } from './logger';

/**
 * @module bookingService
 * @description A service for managing bookings, payments, and reviews.
 */
export const bookingService = {
  /**
   * Creates a new booking.
   * @param {string} workerId - The ID of the worker being booked.
   * @param {string} userId - The ID of the user making the booking.
   * @param {string} note - A note or special instructions for the booking.
   * @param {number} price - The total price of the booking.
   * @returns {Promise<Booking>} The newly created booking object.
   * @throws {Error} If the booking creation fails.
   */
  async createBooking(workerId: string, userId: string, note: string, price: number) {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        worker_id: workerId,
        user_id: userId,
        status: 'pending',
        note: note,
        total_price: price,
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating booking', { error, workerId, userId });
      throw error;
    }
    return data;
  },

  /**
   * Retrieves all bookings for a specific user.
   * @param {string} userId - The ID of the user.
   * @returns {Promise<Booking[]>} A list of bookings for the user.
   * @throws {Error} If the database query fails.
   */
  async getUserBookings(userId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        workers(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching user bookings', { error, userId });
      throw error;
    }

    // Map the nested worker data to match WorkerProfile structure
    return data.map((b: any) => ({
        ...b,
        worker: b.worker ? {
            ...b.worker,
            reviewCount: b.worker.review_count,
            experienceYears: b.worker.experience_years,
            priceUnit: b.worker.price_unit,
            imageUrl: b.worker.image_url,
            isVerified: b.worker.is_verified,
            location: {
                lat: b.worker.location_lat,
                lng: b.worker.location_lng
            }
        } : undefined
    }));
  },

  /**
   * Retrieves all bookings for a specific worker.
   * @param {string} workerId - The ID of the worker.
   * @returns {Promise<Booking[]>} A list of bookings for the worker.
   * @throws {Error} If the database query fails.
   */
  async getWorkerBookings(workerId: string): Promise<Booking[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('worker_id', workerId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching worker bookings', { error, workerId });
      throw error;
    }
    return data || [];
  },

  /**
   * Updates the status of a specific booking.
   * @param {string} bookingId - The ID of the booking to update.
   * @param {BookingStatus} status - The new status of the booking.
   * @throws {Error} If the database update fails.
   */
  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
    
    if (error) {
      logger.error('Error updating booking status', { error, bookingId, status });
      throw error;
    }
  },

  /**
   * Marks a booking's payment status as 'paid'.
   * @param {string} bookingId - The ID of the booking to update.
   * @throws {Error} If the database update fails.
   */
  async processPayment(bookingId: string) {
    const { error } = await supabase
        .from('bookings')
        .update({ payment_status: 'paid' })
        .eq('id', bookingId);

    if (error) {
      logger.error('Error processing payment', { error, bookingId });
      throw error;
    }
  },

  /**
   * Submits a review for a booking.
   * @param {string} bookingId - The ID of the booking being reviewed.
   * @param {string} workerId - The ID of the worker being reviewed.
   * @param {string} userId - The ID of the user submitting the review.
   * @param {number} rating - The rating given to the worker (e.g., 1-5).
   * @param {string} comment - A written comment for the review.
   * @throws {Error} If the review submission fails.
   */
  async submitReview(bookingId: string, workerId: string, userId: string, rating: number, comment: string) {
      const { error } = await supabase
        .from('reviews')
        .insert({
            booking_id: bookingId,
            worker_id: workerId,
            user_id: userId,
            rating,
            comment
        });
      
      if (error) {
        logger.error('Error submitting review', { error, bookingId, workerId });
        throw error;
      }

      // Ensure booking is marked as completed if it wasn't already (though flow usually ensures this)
      await this.updateBookingStatus(bookingId, 'completed');
  }
};
