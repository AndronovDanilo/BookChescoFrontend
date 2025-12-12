const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('accessToken');
  }

  setToken(token) {
    localStorage.setItem('accessToken', token);
  }

  removeToken() {
    localStorage.removeItem('accessToken');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Request failed',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async login(credentials) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.accessToken) {
      this.setToken(data.accessToken);
    }
    return data;
  }

  async register(userData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    if (data.accessToken) {
      this.setToken(data.accessToken);
    }
    return data;
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async updateProfile(profileData) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  logout() {
    this.removeToken();
  }

  // Hotels endpoints
  async getHotels() {
    return this.request('/hotels');
  }

  async getHotel(id) {
    return this.request(`/hotels/${id}`);
  }

  async createHotel(hotelData) {
    return this.request('/hotels', {
      method: 'POST',
      body: JSON.stringify(hotelData),
    });
  }

  async updateHotel(id, hotelData) {
    return this.request(`/hotels/${id}`, {
      method: 'PUT',
      body: JSON.stringify(hotelData),
    });
  }

  async deleteHotel(id) {
    return this.request(`/hotels/${id}`, {
      method: 'DELETE',
    });
  }

  async getMyHotels() {
    return this.request('/hotels/my');
  }

  async getHotelsByOwner(ownerId) {
    return this.request(`/hotels/owner/${ownerId}`);
  }

  // Rooms endpoints
  async getRooms() {
    return this.request('/rooms');
  }

  async getRoom(id) {
    return this.request(`/rooms/${id}`);
  }

  async getRoomsByHotel(hotelId) {
    return this.request(`/rooms/hotel/${hotelId}`);
  }

  async createRoom(roomData) {
    return this.request('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  }

  async updateRoom(id, roomData) {
    return this.request(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  }

  async deleteRoom(id) {
    return this.request(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  // Users endpoints (Admin only)
  async getUsers() {
    return this.request('/users');
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Bookings endpoints
  async getBookings() {
    return this.request('/bookings');
  }

  async getMyBookings() {
    return this.request('/bookings/my');
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`);
  }

  async getBookingsByUser(userId) {
    return this.request(`/bookings/user/${userId}`);
  }

  async getBookingsByRoom(roomId) {
    return this.request(`/bookings/room/${roomId}`);
  }

  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async updateBooking(id, bookingData) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookingData),
    });
  }

  async deleteBooking(id) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async cancelBooking(id) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: 'cancelled' }),
    });
  }

  // Popular destinations
  async getPopularDestinations() {
    return this.request('/hotels/popular-destinations');
  }

  // Search hotels
  async searchHotels(params) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/hotels/search?${queryString}`);
  }

  // File upload helper
  async uploadFile(endpoint, file, fieldName = 'file') {
    const url = `${this.baseUrl}${endpoint}`;
    const token = this.getToken();
    
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (response.status === 204) {
        return null;
      }

      const data = await response.json();

      if (!response.ok) {
        throw {
          status: response.status,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {
        status: 0,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Photo upload endpoints
  async uploadUserPhoto(file) {
    return this.uploadFile('/photos/user', file);
  }

  async uploadHotelPhoto(hotelId, file) {
    return this.uploadFile(`/photos/hotel/${hotelId}`, file);
  }

  async uploadRoomPhoto(roomId, file) {
    return this.uploadFile(`/photos/room/${roomId}`, file);
  }

  async getHotelPhotos(hotelId) {
    return this.request(`/photos/hotel/${hotelId}`);
  }

  async getRoomPhotos(roomId) {
    return this.request(`/photos/room/${roomId}`);
  }

  async deletePhoto(photoId) {
    return this.request(`/photos/${photoId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;

