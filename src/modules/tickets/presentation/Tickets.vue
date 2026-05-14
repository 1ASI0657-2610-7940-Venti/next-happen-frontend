<template>
  <div class="tickets-page">
    <h1 class="page-title">Mis Entradas</h1>

    <div v-if="tickets.length" class="tickets-list">
      <div v-for="ticket in tickets" :key="ticket.id" class="ticket-card">
        <div class="ticket-header">
          <h3>{{ ticket.title }}</h3>
          <span class="ticket-date">{{ formatDate(ticket.date) }}</span>
        </div>

        <div class="ticket-body">
          <p><strong>Precio unitario:</strong> S/. {{ ticket.unitPrice.toFixed(2) }}</p>
          <p><strong>Cantidad:</strong> {{ ticket.quantity }}</p>
        </div>

        <div class="ticket-footer">
          <pv-button
            label="Ver evento"
            icon="pi pi-eye"
            class="btn-view"
            @click="goToEvent(ticket.eventId)"
          />
        </div>
      </div>
    </div>

    <p v-else class="no-tickets">Aún no has comprado entradas.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const tickets = ref([])
const API_URL = import.meta.env.VITE_API_URL

onMounted(async () => {
  try {
    const userId = localStorage.getItem("userId")

    if (!userId) return console.error("No hay userId en localStorage")

    // 1️⃣ Obtener tickets del usuario
    const res = await axios.get(`${API_URL}/api/users/${userId}/tickets`)
    const rawTickets = res.data

    // 2️⃣ Para cada ticket → obtener información completa del evento
    const finalTickets = await Promise.all(
      rawTickets.map(async (t) => {
        try {
          const eventRes = await axios.get(`${API_URL}/api/events/${t.eventId}`)
          const event = eventRes.data

          return {
            id: t.id,
            eventId: t.eventId,
            title: event.title,
            date: t.purchaseDate,
            unitPrice: event.price || 0,
            quantity: 1,
            total: event.price || 0, 
            image: event.photos?.[0] || "https://via.placeholder.com/500x300?text=Evento"
          }
        } catch (error) {
          console.error("Error cargando datos del evento:", t.eventId)
          return null
        }
      })
    )

    tickets.value = finalTickets.filter(e => e !== null)

    console.log("TICKETS FINALES:", tickets.value)

  } catch (err) {
    console.error("Error al obtener tickets:", err)
  }
})

function formatDate(date) {
  return new Date(date).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
}

function goToEvent(eventId) {
  router.push({ name: 'user-publishment', params: { id: eventId } })
}
</script>

<style scoped>
.tickets-page {
  margin: 40px;
  font-family: "Inter", sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 24px;
  font-size: 1.8rem;
  font-weight: 700;
}

/* ==== Grid ==== */
.tickets-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

/* ==== Tarjeta ==== */
.ticket-card {
  border: 2px solid #333;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 2);
  padding: 18px;
  background: #fffef3;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.ticket-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
}

.ticket-date {
  font-size: 0.9rem;
  color: #555;
}

.ticket-body {
  margin-top: 8px;
  line-height: 1.6;
}

.ticket-body .total {
  font-size: 1.05rem;
  color: #111;
  margin-top: 6px;
}

.ticket-footer {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

/* ==== Botón ==== */
.btn-view {
  background-color: #ffcd00;
  border: 2px solid #333;
  padding: 8px 14px;
  font-weight: 600;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 2);
}

:deep(.btn-view:hover) {
  background-color: #ffffff;
  border-color: #f59e0b;
  color: #f59e0b;
  box-shadow: none;
  cursor: pointer;
}

/* ==== Estado vacío ==== */
.no-tickets {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  margin-top: 40px;
}
</style>
