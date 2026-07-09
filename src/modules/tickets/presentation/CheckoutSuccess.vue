<template>
  <div class="checkout-result">
    <div class="result-card r-pop-in">
      <div class="stamp success" aria-hidden="true">
        <span class="stamp-icon">✓</span>
      </div>
      <span class="r-kicker">Pago confirmado</span>
      <h1 class="r-display">¡Listo! Tu compra fue exitosa</h1>
      <p>
        Tu pago se procesó de forma segura con Stripe y tus entradas se están
        emitiendo. En segundos aparecerán en <strong>Mis Entradas</strong> con su código QR.
      </p>
      <div class="actions">
        <button class="r-btn r-btn--primary r-btn--lg" @click="goToTickets">
          <i class="pi pi-ticket"></i> Ver mis entradas
        </button>
        <button class="r-btn r-btn--ghost" @click="goHome">Volver al inicio</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const goToTickets = () => router.push({ name: 'user-tickets' })
const goHome = () => router.push({ name: 'user-home' })
</script>

<style scoped>
.checkout-result {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 78vh;
  padding: 24px;
}
.result-card {
  max-width: 520px;
  text-align: center;
  border: var(--r-bd-3);
  background: var(--r-surface);
  padding: 48px 36px 40px;
  box-shadow: var(--r-sh-pop);
}
.stamp {
  width: 84px;
  height: 84px;
  margin: 0 auto 20px;
  border: var(--r-bd-3);
  display: grid;
  place-items: center;
  box-shadow: var(--r-sh-2);
  transform: rotate(-6deg);
}
.stamp.success { background: var(--r-success); }
.stamp-icon { font-size: 3rem; font-weight: 800; color: #fff; line-height: 1; }
.r-display { font-size: 1.9rem; font-weight: 700; margin: 14px 0 10px; }
p { color: var(--r-ink-soft); line-height: 1.65; margin: 0 auto 26px; max-width: 42ch; }
.actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
</style>
