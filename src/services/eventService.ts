import { projectId, publicAnonKey } from "../utils/supabase/info";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-973ebaac`;

export interface Event {
  id?: string;
  title: string;
  date: string;
  location: string;
  category: "Career" | "Social" | "Cultural" | "Academic";
  description?: string;
  organizer?: string; // "Admin" or Staff ID
  image?: string;
}

export const eventService = {
  // Tüm etkinlikleri getir
  getAll: async (): Promise<Event[]> => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) throw new Error("Failed to fetch events");
      return await response.json();
    } catch (error) {
      console.error("Error fetching events:", error);
      return [];
    }
  },

  // Yeni etkinlik oluştur
  create: async (event: Event): Promise<Event | null> => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(event)
      });
      if (!response.ok) throw new Error("Failed to create event");
      return await response.json();
    } catch (error) {
      console.error("Error creating event:", error);
      return null;
    }
  },

  // Etkinlik güncelle
  update: async (id: string, event: Partial<Event>): Promise<Event | null> => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(event)
      });
      if (!response.ok) throw new Error("Failed to update event");
      return await response.json();
    } catch (error) {
      console.error("Error updating event:", error);
      return null;
    }
  },

  // Etkinlik sil
  delete: async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${publicAnonKey}`
        }
      });
      return response.ok;
    } catch (error) {
      console.error("Error deleting event:", error);
      return false;
    }
  }
};
