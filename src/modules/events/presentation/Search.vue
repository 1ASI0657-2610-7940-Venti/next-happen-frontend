<template>
  <div class="search-container">
    <h2>Search events</h2>
    <input
        v-model="query"
        @input="filterEvents"
        placeholder="Buscar por nombre..."
        class="search-input"
    />
    <div class="events-grid">
      <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
      />
    </div>
  </div>
</template>

<script>
import EventCard from "@/modules/events/presentation/EventCard.vue";

export default {
  name: "Search",
  components: { EventCard },
  data() {
    return {
      query: "",
      events: [
        { id: 1, title: "Tech Conference 2025", image: "/src/assets/event1.jpg" },
        { id: 2, title: "Startup Meetup", image: "/src/assets/event2.jpg" },
        { id: 3, title: "AI Workshop", image: "/src/assets/event3.jpg" },
      ],
      filteredEvents: [],
    };
  },
  created() {
    this.filteredEvents = this.events;
  },
  methods: {
    filterEvents() {
      this.filteredEvents = this.events.filter(event =>
          event.title.toLowerCase().includes(this.query.toLowerCase())
      );
    },
  },
};
</script>


