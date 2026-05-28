<template>
  <div class="container py-4">
    <div class="mb-4">
      <h2 class="fw-bold mb-1">
        👋 Welcome back, {{ auth.user?.name || 'User' }}
      </h2>
      <small class="text-muted">
        Here is what’s happening in your system today
      </small>
    </div>

    <!-- KPI CARDS -->
    <div class="row g-3 mb-4">

      <div class="col-md-3">
        <div class="card kpi-card shadow-sm border-0">
          <div class="card-body">
            <div class="kpi-title">💰 Revenue</div>
            <div class="kpi-value">$12,450</div>
            <small class="text-success">+12% today</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card shadow-sm border-0">
          <div class="card-body">
            <div class="kpi-title">🧾 Orders</div>
            <div class="kpi-value">128</div>
            <small class="text-success">+5 new</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card shadow-sm border-0">
          <div class="card-body">
            <div class="kpi-title">📦 Products</div>
            <div class="kpi-value">320</div>
            <small class="text-muted">in stock</small>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card kpi-card shadow-sm border-0">
          <div class="card-body">
            <div class="kpi-title">👥 Users</div>
            <div class="kpi-value">54</div>
            <small class="text-info">active system users</small>
          </div>
        </div>
      </div>

    </div>

    <!-- CHART + SUMMARY -->
    <div class="row g-3 mb-4">

      <!-- CHART -->
      <div class="col-md-8">
        <div class="card shadow-sm border-0">
          <div class="card-body">

            <h5 class="mb-3">📊 Sales Overview</h5>

            <div class="chart-placeholder">
              <div class="text-muted">
                📈 Chart Area (connect Chart.js or ApexCharts here)
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="col-md-4">
        <div class="card shadow-sm border-0">
          <div class="card-body">

            <h5 class="mb-3">⚡ System Status</h5>

            <div class="status-item">
              <span>Server</span>
              <span class="badge bg-success">Online</span>
            </div>

            <div class="status-item">
              <span>Database</span>
              <span class="badge bg-success">Connected</span>
            </div>

            <div class="status-item">
              <span>API</span>
              <span class="badge bg-success">Stable</span>
            </div>

            <div class="status-item">
              <span>Orders</span>
              <span class="badge bg-warning text-dark">Busy</span>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- RECENT ACTIVITY -->
    <div class="card shadow-sm border-0">
      <div class="card-body">

        <h5 class="mb-3">🕒 Recent Activity</h5>

        <ul class="list-group list-group-flush">

          <li class="list-group-item">
            🧾 New order created #INV-001
          </li>

          <li class="list-group-item">
            📦 Product "Coca Cola" updated
          </li>

          <li class="list-group-item">
            👤 New user registered
          </li>

          <li class="list-group-item">
            📊 Daily report generated
          </li>

        </ul>

      </div>
    </div>

  </div>
</template>

<script setup>
const auth = useAuthStore()

definePageMeta({
  middleware: 'auth'
})
</script>

<style scoped>
.kpi-card {
  border-radius: 14px;
  transition: 0.2s;
}

.kpi-card:hover {
  transform: translateY(-3px);
}

.kpi-title {
  font-size: 13px;
  color: #888;
}

.kpi-value {
  font-size: 26px;
  font-weight: bold;
}

.chart-placeholder {
  height: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 12px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>