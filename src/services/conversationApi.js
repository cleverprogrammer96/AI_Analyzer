// Conversation management API calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const DUMMY_CONVERSATIONS_RESPONSE = {
  "conversations": [
    {
      "id": "conv_001",
      "title": "Payment Terms Analysis",
      "lastMessage": "What are the payment terms?",
      "timestamp": "2024-03-02T10:30:00Z"
    },
    {
      "id": "conv_002",
      "title": "Liability Clauses Review",
      "lastMessage": "Can you explain the liability clauses?",
      "timestamp": "2024-03-01T15:45:00Z"
    },
    {
      "id": "conv_003",
      "title": "Contract Comparison",
      "lastMessage": "Compare these two contracts",
      "timestamp": "2024-02-28T09:20:00Z"
    },
    {
      "id": "conv_004",
      "title": "Termination Conditions",
      "lastMessage": "What are the termination conditions?",
      "timestamp": "2024-02-27T14:10:00Z"
    },
    {
      "id": "conv_005",
      "title": "Intellectual Property Rights",
      "lastMessage": "Summarize IP clauses",
      "timestamp": "2024-02-26T11:30:00Z"
    }
  ]
};

const DUMMY_CONVERSATION_RESPONSE = {
  "conversationId": "conv_001",
  "messages": [
    {
      "message": {
        "request": {
          "role": "user",
          "text": "What are the payment terms?"
        },
        "response": {
          "result": {
            "answer": "The payment terms specify that payment shall be made within 30 days of invoice date. Late payments incur a 2% monthly interest charge.",
            "excerpt": "Payment shall be made within thirty (30) days of the invoice date. Any late payment shall incur interest at the rate of 2% per month.",
            "excerpt_page_no": 5,
            "document_name": "Service Agreement v2.3",
            "key_points": [
              "30-day payment window from invoice date",
              "2% monthly interest on late payments",
              "Payment method: wire transfer or check",
              "Invoices issued on the 1st of each month"
            ]
          }
        }
      }
    },
    {
      "message": {
        "request": {
          "role": "user",
          "text": "Are there any early payment discounts?"
        },
        "response": {
          "result": {
            "answer": "Yes, the contract offers a 2% discount for payments made within 10 days of invoice date.",
            "excerpt": "Client shall receive a discount of two percent (2%) if payment is received within ten (10) days of invoice date.",
            "excerpt_page_no": 5,
            "document_name": "Service Agreement v2.3"
          }
        }
      }
    },
    {
      "message": {
        "request": {
          "role": "user",
          "text": "What happens if payment is delayed beyond 60 days?"
        },
        "response": {
          "result": {
            "answer": "If payment is delayed beyond 60 days, the service provider has the right to suspend services until payment is received, and may terminate the agreement after 90 days of non-payment.",
            "excerpt": "In the event payment is not received within sixty (60) days, Provider may suspend Services. After ninety (90) days of non-payment, Provider may terminate this Agreement upon written notice.",
            "excerpt_page_no": 6,
            "document_name": "Service Agreement v2.3",
            "risks_or_flags": [
              "Service suspension after 60 days",
              "Possible contract termination after 90 days",
              "Additional collection costs may apply"
            ]
          }
        }
      }
    }
  ]
};

/**
 * Fetch all conversations for the current user
 * @returns {Promise<Array>} List of conversations
 */
export const fetchConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.conversations || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    throw error;
  }
};

/**
 * Fetch a specific conversation by ID
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Object>} Conversation data with messages
 */
export const fetchConversation = async (conversationId) => {
  return DUMMY_CONVERSATION_RESPONSE;
  try {
    const response = await fetch(`${API_BASE_URL}/conversation?conversationId=${conversationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching conversation:', error);
    throw error;
  }
};

/**
 * Transform backend message format to frontend format
 * @param {Array} backendMessages - Messages from /conversation API
 * @returns {Array} Messages in frontend format
 */
export const transformMessages = (backendMessages) => {
  if (!backendMessages || !Array.isArray(backendMessages)) {
    return [];
  }

  return backendMessages.map((msg, index) => {
    const request = msg.message?.request;
    const response = msg.message?.response;

    const messages = [];

    // Add user message
    if (request) {
      messages.push({
        id: `${Date.now()}-${index}-user`,
        role: 'user',
        content: request.text || request.content || '',
        timestamp: new Date().toISOString(),
      });
    }

    // Add assistant message
    if (response) {
      messages.push({
        id: `${Date.now()}-${index}-assistant`,
        role: 'assistant',
        content: response.result || response.text || response,
        timestamp: new Date().toISOString(),
      });
    }

    return messages;
  }).flat();
};