export const getSeatsUsed = async (): Promise<Seat[]> => {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/tickets/approved`;
  try {
    const response = await fetch(url, {
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
    console.error('Error fetching seats used:', error);
    throw error;
  }
};

export async function saveTickets(data: Ticket[]) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/tickets/save`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud POST');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching seats used:', error);
    throw error;
  }
}

export async function getIntegrityHash(data: BoldIntegrityHashInput) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/tickets/generate-integrity-hash`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud POST');
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error('Error fetching integrity hash:', error);
    throw error;
  }
}
