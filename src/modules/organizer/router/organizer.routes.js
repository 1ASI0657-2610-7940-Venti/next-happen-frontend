// --- Rutas de Organizer / Emprendedor ---
import Home from '@/modules/events/presentation/Home.vue'
import Entrepreneur from '@/modules/metrics/presentation/entrepreneur-metrics.vue'
import StandsList from '@/modules/stands/presentation/stands-list.vue'
import StandForm from '@/modules/stands/presentation/stand-form.vue'
import Notifications from '@/modules/notifications/presentation/Notifications.vue'
import Profile from '@/modules/iam/presentation/Profile.vue'

// --- Lazy load de Organizer Pages ---
const CreateEvent = () => import('@/modules/organizer/presentation/create-event.vue')
const Events = () => import('@/modules/organizer/presentation/events.vue')

export default [
    { path: '/org/entrepreneur', name: 'org-entrepreneur', component: Entrepreneur, meta: { requiresAuth: true, role: "Organizer" } },
    { path: '/org/register-stands/:eventId?', name: 'org-register-stands', component: StandsList, meta: { requiresAuth: true, role: "Organizer" } },
    { path: '/org/register-stands/:eventId/new', name: 'org-stand-new', component: StandForm, meta: { requiresAuth: true, role: "Organizer" } },
    { path: '/org/register-stands/:eventId/:id/edit', name: 'org-stand-edit', component: StandForm, meta: { requiresAuth: true, role: "Organizer" } },

    { path: '/org/dashboard', name: 'org-dashboard', component: { template: '<h1>Dashboard Organizador</h1>' }, meta: { requiresAuth: true, role: "Organizer" }},
    { path: '/org/create-event', name: 'org-create-event', component: CreateEvent, meta: { requiresAuth: true, role: "Organizer" }},
    { path: '/org/events', name: 'org-events', component: Events, meta: { requiresAuth: true, role: "Organizer" }},
    { path: '/org/notifications', name: 'org-notifications', component: Notifications, meta: { requiresAuth: true, role: "Organizer" }},
    { path: '/org/profile', name: 'org-profile', component: Profile, meta: { requiresAuth: true, role: "Organizer" }},
]

