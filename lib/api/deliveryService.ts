// services/deliveryApiService.ts

// Assuming your Driver, GeoLocation, and DriverStatus types are in a file named 'driver.ts'
// Adjust the import path as necessary.
import { Driver, GeoLocation, DriverStatus } from '../../types/driver';

// --- BEGIN OrderDTO Placeholder ---
// !! IMPORTANT: Please replace this with your actual OrderDTO interface
// based on your OrderDTO.java file.
export interface OrderDTO {
  orderId: string; // Example field
  pickupLocation: GeoLocation; // This field is used in your DeliveryService.java
  // Add other fields from your OrderDTO.java, for example:
  // customerId?: string;
  // dropoffLocation?: GeoLocation;
  // items?: any[]; // Replace 'any' with a proper type
  // status?: string; // Or a specific OrderStatus enum
}
// --- END OrderDTO Placeholder ---

/**
 * Base URL for the delivery API.
 * It's recommended to set NEXT_PUBLIC_DELIVERY_API_BASE_URL in your .env.local file.
 * Example: NEXT_PUBLIC_DELIVERY_API_BASE_URL=http://localhost:8080/api/v1/delivery
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_DELIVERY_API_BASE_URL || 'http://localhost:8080/api/v1/delivery';

/**
 * A generic type for simple message responses from the API.
 */
export interface ApiResponseWithMessage {
  message: string;
}

/**
 * Helper function to handle API responses.
 * @param response The fetch Response object.
 * @returns Promise<T> The parsed JSON data or parsed text as an error object.
 * @throws Error if the response is not ok and body cannot be parsed meaningfully.
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    // Handle NO_CONTENT (204) response which has no body
    if (response.status === 204) {
      return null as T; // Or an empty object/array depending on expected T
    }
    // Check content type before parsing
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return response.json() as Promise<T>;
    }
    // If it's plain text (often for simple messages or errors from Spring Boot)
    const text = await response.text();
    // Try to return it as T if T is string, otherwise wrap in a message object
    // This part is tricky as T is generic. For specific cases, it's better to handle text directly.
    if (typeof text === 'string' && (typeof (null as T) === 'string' || response.status !== 200)) {
         // If T is expected to be a string, or if it's an error message
        return { message: text } as unknown as T; // Cast, assuming T might be ApiResponseWithMessage for errors
    }
    return text as unknown as T; // Fallback for other text responses
  } else {
    // Attempt to parse error response body
    const contentType = response.headers.get("content-type");
    let errorBody: any = `API Error: ${response.status} ${response.statusText}`;
    try {
      if (contentType && contentType.includes("application/json")) {
        errorBody = await response.json();
      } else {
        errorBody = { message: await response.text() };
      }
    } catch (e) {
      // Ignore if error body parsing fails, use the status text
    }
    console.error("API Error:", errorBody);
    throw errorBody; // Throw the parsed error body or a generic error
  }
}


/**
 * Tests the delivery service endpoint.
 * Corresponds to: GET /api/v1/delivery/test
 * @returns A promise that resolves to a string message or null on error.
 */
export async function testDeliveryService(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/test`);
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error! status: ${response.status} - ${errorText || response.statusText}`);
    }
    return await response.text();
  } catch (error) {
    console.error("Failed to test delivery service:", error);
    return null;
  }
}

/**
 * Assigns a driver to an order.
 * Corresponds to: POST /api/v1/delivery/assign
 * @param orderData The order data.
 * @returns A promise that resolves to the assigned Driver, a message, or null on error.
 */
export async function assignDriver(orderData: OrderDTO): Promise<Driver | ApiResponseWithMessage | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });
    return await handleResponse<Driver | ApiResponseWithMessage>(response);
  } catch (error) {
    console.error("Failed to assign driver:", error);
    return null;
  }
}

/**
 * Gets a driver's current location by their ID.
 * Corresponds to: GET /api/v1/delivery/driver/{driverId}/location
 * @param driverId The ID of the driver.
 * @returns A promise that resolves to the driver's GeoLocation or null if not found/error.
 */
export async function getDriverLocation(driverId: string): Promise<GeoLocation | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/driver/${driverId}/location`);
     if (response.status === 404) return null; // Driver or location not found
    return await handleResponse<GeoLocation>(response);
  } catch (error) {
    console.error(`Failed to get location for driver ${driverId}:`, error);
    return null;
  }
}

/**
 * Creates a new driver.
 * Corresponds to: POST /api/v1/delivery/drivers
 * @param driverData The data for the new driver.
 * The backend service sets defaults for location, status, and availability if not provided.
 * @returns A promise that resolves to the created Driver object or null on error.
 */
export async function createDriver(driverData: Partial<Driver>): Promise<Driver | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverData),
    });
    return await handleResponse<Driver>(response);
  } catch (error) {
    console.error("Failed to create driver:", error);
    return null;
  }
}

/**
 * Updates the location of an existing driver.
 * Corresponds to: PUT /api/v1/delivery/drivers/{driverId}/location
 * @param driverId The ID of the driver to update.
 * @param location The new GeoLocation of the driver.
 * @returns A promise that resolves to the updated Driver object or null on error.
 */
export async function updateDriverLocation(driverId: string, location: GeoLocation): Promise<Driver | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/location`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(location),
    });
    if (response.status === 404) return null; // Driver not found
    return await handleResponse<Driver>(response);
  } catch (error) {
    console.error(`Failed to update location for driver ${driverId}:`, error);
    return null;
  }
}

/**
 * Updates the status of an existing driver.
 * Corresponds to: PUT /api/v1/delivery/drivers/{driverId}/status
 * @param driverId The ID of the driver to update.
 * @param status The new DriverStatus.
 * @returns A promise that resolves to the updated Driver object or null on error.
 */
export async function updateDriverStatus(driverId: string, status: DriverStatus): Promise<Driver | null> {
  try {
    const payload = { status: status.toUpperCase() }; // Ensure status is uppercase as per controller logic
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (response.status === 404) return null; // Driver not found
    return await handleResponse<Driver>(response);
  } catch (error) {
    console.error(`Failed to update status for driver ${driverId}:`, error);
    return null;
  }
}

/**
 * Updates the information of an existing driver.
 * Corresponds to: PUT /api/v1/delivery/drivers/{driverId}
 * @param driverId The ID of the driver to update.
 * @param driverDetails The driver details to update. Can be a partial object.
 * @returns A promise that resolves to the updated Driver object or null on error.
 */
export async function updateDriverInfo(driverId: string, driverDetails: Partial<Driver>): Promise<Driver | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverDetails),
    });
    if (response.status === 404) return null; // Driver not found
    return await handleResponse<Driver>(response);
  } catch (error) {
    console.error(`Failed to update info for driver ${driverId}:`, error);
    return null;
  }
}

/**
 * Deletes a driver by their ID.
 * Corresponds to: DELETE /api/v1/delivery/drivers/{driverId}
 * @param driverId The ID of the driver to delete.
 * @returns A promise that resolves to an object with a message or null on error.
 */
export async function deleteDriver(driverId: string): Promise<ApiResponseWithMessage | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`, {
      method: 'DELETE',
    });
    if (response.status === 404) {
        const errorText = await response.text();
        console.warn(`Driver with ID ${driverId} not found for deletion.`);
        return { message: errorText || `Driver with ID ${driverId} not found.` };
    }
    // The backend returns a plain text success message
    const successMessage = await response.text();
    return { message: successMessage };
  } catch (error) {
    console.error(`Failed to delete driver ${driverId}:`, error);
    // Attempt to return the error message from the catch block if it's structured
    if (error && typeof (error as any).message === 'string') {
        return { message: (error as any).message };
    }
    return { message: `Failed to delete driver ${driverId}`};
  }
}

/**
 * Gets a driver by their ID.
 * Corresponds to: GET /api/v1/delivery/drivers/{driverId}
 * @param driverId The ID of the driver to fetch.
 * @returns A promise that resolves to the Driver object or null if not found/error.
 */
export async function getDriverById(driverId: string): Promise<Driver | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers/${driverId}`);
    if (response.status === 404) {
        console.warn(`Driver with ID ${driverId} not found.`);
        return null;
    }
    return await handleResponse<Driver>(response);
  } catch (error) {
    console.error(`Failed to fetch driver ${driverId}:`, error);
    return null;
  }
}

/**
 * Gets all drivers.
 * Corresponds to: GET /api/v1/delivery/drivers
 * @returns A promise that resolves to an array of Driver objects or null on error.
 * Returns an empty array if the backend responds with 204 No Content.
 */
export async function getAllDrivers(): Promise<Driver[] | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/drivers`);
    if (response.status === 204) { // No Content
      return [];
    }
    return await handleResponse<Driver[]>(response);
  } catch (error) {
    console.error("Failed to fetch all drivers:", error);
    return null;
  }
}
