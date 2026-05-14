<template>
  <div class="publishment-page" v-if="event">
    <h1 class="title">{{ event.title }}</h1>
    <p><strong>Organizador:</strong> {{ event.organizer }}</p>

    <!-- ==== Carrusel ==== -->
    <div class="carousel-container">
      <div class="carousel" ref="carousel">
        <div
          v-for="(photo, i) in event.photos"
          :key="i"
          class="carousel-card"
        >
          <img :src="photo" :alt="`${event.title} ${i + 1}`" />
        </div>
      </div>

      <button
        v-if="event.photos && event.photos.length > 1"
        class="btn prev"
        @click="move(-1)"
      >
        &#10094;
      </button>
      <button
        v-if="event.photos && event.photos.length > 1"
        class="btn next"
        @click="move(1)"
      >
        &#10095;
      </button>
    </div>

    <!-- ==== Información general ==== -->
    <p class="desc">{{ event.description }}</p>
    <p>
  <strong>Fecha:</strong>
  {{ new Date(event.startDate).toLocaleDateString() }}
  -
  {{ new Date(event.endDate).toLocaleDateString() }}
</p>
    <p><strong>Entradas disponibles:</strong> {{ event.quantity }}</p>
    <p><strong>Precio unitario:</strong> S/. {{ event.price }}</p>

    <!-- ==== Selector de cantidad ==== -->
    <div class="ticket-section">
      <label for="ticketCount"><strong>Cantidad de entradas:</strong></label>
      <div class="ticket-input">
        <button class="btn-qty" @click="decreaseQuantity">−</button>
        <input
          id="ticketCount"
          type="number"
          v-model.number="ticketCount"
          min="1"
          :max="event.quantity"
        />
        <button class="btn-qty" @click="increaseQuantity">+</button>
      </div>

      <p class="total">
        <strong>Total:</strong> S/. {{ totalPrice.toFixed(2) }}
      </p>
    </div>

    <!-- ==== Botón de acción ==== -->
    <div class="actions">
      <pv-button
        label="Comprar entrada"
        icon="pi pi-ticket"
        class="btn-buy"
        @click="buyTicket"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const event = ref(null)
const carousel = ref(null)
let index = 0

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5022'

// ==== Tickets ====
const ticketCount = ref(1)
const totalPrice = computed(() => (event.value ? event.value.price * ticketCount.value : 0))

function increaseQuantity() {
  if (ticketCount.value < event.value.quantity) ticketCount.value++
}

function decreaseQuantity() {
  if (ticketCount.value > 1) ticketCount.value--
}

onMounted(async () => {
  const res = await axios.get(`${API_URL}/api/events/${route.params.id}`)
  event.value = res.data
  await nextTick()
  applyTransform()
})

function getCardWidth() {
  const first = carousel.value?.querySelector('.carousel-card')
  if (!first) return 0
  const rect = first.getBoundingClientRect()
  const style = getComputedStyle(first)
  const gap = parseFloat(style.marginRight) || 20
  return rect.width + gap
}

function applyTransform() {
  if (!carousel.value) return
  const shift = -index * getCardWidth()
  carousel.value.style.transform = `translateX(${shift}px)`
}

function clampIndex(idx) {
  const total = event.value?.photos?.length || 1
  const max = Math.max(0, total - getVisibleCount())
  return Math.min(Math.max(0, idx), max)
}

function getVisibleCount() {
  const width = window.innerWidth
  if (width < 600) return 1
  if (width < 1000) return 2
  return 3
}

function move(direction) {
  index = clampIndex(index + (direction === 1 ? 1 : -1))
  applyTransform()
}

async function buyTicket() {
  try {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Debes iniciar sesión para comprar.");
      return;
    }

    const url = `${API_URL}/api/events/${event.value.id}/tickets/purchase?` +
                `userId=${userId}&quantity=${ticketCount.value}`;

    await axios.post(url);

    alert(`Compra realizada con éxito. Total: S/. ${totalPrice.value.toFixed(2)}`);
  } catch (error) {
    console.error("Error al comprar entrada:", error);
    alert("Ocurrió un error al procesar la compra.");
  }
}
</script>

<style scoped>
.title {
  text-align: center;
}

/* ==== Carrusel con separación ==== */
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
}

.carousel {
  display: flex;
  gap: 20px;
  transition: transform 0.4s ease;
}

.carousel-card {
  flex: 0 0 calc(33.33% - 20px);
  background: #fff;
  border: 2px solid #333;
  border-radius: 0;
  overflow: hidden;
}

.carousel-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Botones laterales */
.btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: #ffcd00;
  border: 2px solid #333;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 2);
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 5;
  width: 45px;
  height: 45px;
}

.btn:hover {
  background-color: #fff7ed;
  border-color: #f59e0b;
  color: #f59e0b;
  cursor: pointer;
  box-shadow: none;
}

.prev {
   left: 1.25rem;
}

.next {
   right: 1.25rem;
}

/* ==== Resto ==== */
.publishment-page {
  margin: 40px;
  font-family: "Inter", sans-serif;
}

.desc {
  font-size: 1.05rem;
  margin-bottom: 16px;
}

.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  padding-right: 20px; /* 🔹 Opcional: separación lateral */
}

.btn-buy {
  align-items: center;
  background-color: #ffcd00;
  border: 2px solid #333;
  padding: 8px 18px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 2);
}

:deep(.btn-buy:hover) {
  border: 2px solid #f59e0b;
  color: #f59e0b;
  background-color: #ffffff;
  box-shadow: none;
}

.ticket-input {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.ticket-input input {
  width: 60px;
  text-align: center;
  border: 2px solid #333;
  height: 33px;
  font-weight: 600;
  margin: 0 8px;
}

.btn-qty {
  background: #ffcd00;
  border: 2px solid #333;
  font-size: 1.1rem;
  width: 36px;
  height: 36px;
  cursor: pointer;
  gap: 2px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 2);
}

.btn-qty:hover {
  background: #fff7ed;
  border-color: #f59e0b;
  color: #f59e0b;
  box-shadow: none;
}

.total {
  margin-top: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 📱 Responsivo */
@media (max-width: 1000px) {
  .carousel-card {
    flex: 0 0 calc(50% - 20px);
  }
}

@media (max-width: 600px) {
  .carousel-card {
    flex: 0 0 100%;
  }
}
</style>
