
/**
 * iKhokha Paylink API Integration
 * 
 * This service calls the local backend which handles the secure communication
 * with iKhokha's API.
 */
export const createIkhokhaPaylink = async (amount: number, orderId: string) => {
  try {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, orderId }),
    });

    const data = await response.json();

    if (!response.ok) {
      const msg = data.responseMessage || data.message || `HTTP ${response.status}`;
      const code = data.responseCode ? ` (Code: ${data.responseCode})` : "";
      throw new Error(`${msg}${code}`);
    }
    
    if (data && data.paylinkUrl) {
      return data;
    } else {
      const msg = data.responseMessage || "The payment gateway did not return a link.";
      const code = data.responseCode ? ` (Code: ${data.responseCode})` : "";
      throw new Error(`${msg}${code}`);
    }
  } catch (error: any) {
    console.error("Payment Error:", error);
    throw new Error(error.message || "Payment initialization failed.");
  }
};
