<template>
  <div class="home-page">
    <h2 class="page-title">{{ $t('home.title') }}</h2>

    <div v-if="events.length" class="event-list">
      <EventCard
          v-for="event in events"
          :key="event.id"
          :event="event"
          @save="onSave"
          class="event-card"
      />
    </div>

    <p v-else>{{ $t('home.eventsPage.noEvents') }}</p>
  </div>
</template>

<script setup>
import EventCard from '@/modules/events/presentation/EventCard.vue'
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useSavedStore } from '@/modules/events/application/saved.store.js'

const { t } = useI18n()
const savedStore = useSavedStore()

// ✔️ ESTA ES TU VARIABLE REAL
const API = import.meta.env.VITE_API_URL

const events = ref([])
const savedIds = ref([])

onMounted(async () => {
  savedStore.loadSaved() // <- Asegurar que el estado visual cargue la key del usuario actual
  try {
    // ❌ API_URL → ❌ ERROR
    // ✔️ API → FUNCIONA
    const res = await axios.get(`${API}/api/events/public`)

    events.value = res.data.map(e => ({
      ...e,
      image: e.photos?.length
        ? e.photos[0]
        : 'https://via.placeholder.com/400x200?text=No+Image'
    }))

    console.log("Eventos cargados:", events.value)

  } catch (err) {
    console.error("Error cargando eventos:", err)
  }
})

async function onSave(id) {
  try {
    const key = 'nh_saved'
    const raw = localStorage.getItem(key)
    const arr = raw ? JSON.parse(raw) : []

    if (!arr.includes(id)) {
      arr.push(id)
      localStorage.setItem(key, JSON.stringify(arr))

      const userId = localStorage.getItem("userId")
      const token = localStorage.getItem("token")
      
      if (!userId || !token) {
        alert("Debes iniciar sesión para guardar eventos");
        return;
      }
      
      await axios.post(`${API}/api/users/${userId}/saved-events/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert(t('home.alerts.saved'))
    } else {
      alert(t('home.alerts.alreadySaved'))
    }
  } catch (error) {
    console.error('Error al guardar evento:', error)
    alert(t('home.alerts.error'))
  }
}
</script>


<style scoped>
.home-page {
  margin: 40px
}

.event-card{
  border: 2px solid #333;
  border-radius: 0;
  margin-top: 20px;
  box-shadow: 3px 3px 0 rgba(0, 0, 0,2);
}
</style>
