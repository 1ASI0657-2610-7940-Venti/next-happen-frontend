export class MetricsApi {
  constructor() {
    this.baseUrl = `${import.meta.env.VITE_API_URL}/api`;
  }

  async registerAction(eventId, action) {
    try {
      const res = await fetch(`${this.baseUrl}/metrics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,          // ← GUID tal cual, sin convertir
          action,
          timestamp: new Date().toISOString()
        })
      });

      if (!res.ok) {
        console.error("Error al registrar métrica:", await res.text());
      } else {
        console.log(`${action.toUpperCase()} registrada para evento ${eventId}`);
      }
    } catch (e) {
      console.error("Error en MetricsApi.registerAction:", e);
    }
  }

  async getAll() {
    try {
      const res = await fetch(`${this.baseUrl}/metrics`);
      if (!res.ok) throw new Error("Error al obtener métricas");
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }
}
