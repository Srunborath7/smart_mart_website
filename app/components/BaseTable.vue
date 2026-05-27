<script setup>
defineProps({
  columns: { type: Array, default: () => [] },
  data: { type: Array, default: () => [] }
})
</script>

<template>
  <div class="table-wrapper">

    <!-- DESKTOP TABLE -->
    <div class="table-desktop">
      <div class="table-responsive">
        <table class="table table-hover align-middle">

          <thead class="table-danger">
            <tr>
              <th v-for="(col, i) in columns" :key="i">
                {{ col.label }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in data" :key="index">
              <td v-for="col in columns" :key="col.key">
                <slot
                  :name="col.key"
                  :row="row"
                  :index="index"
                >
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
          </tbody>

        </table>
      </div>
    </div>

    <!-- MOBILE CARD VIEW -->
    <div class="table-mobile">
      <div v-for="(row, index) in data" :key="index" class="table-card">

        <div
          v-for="col in columns"
          :key="col.key"
          class="card-row"
        >
          <div class="card-label">{{ col.label }}</div>

          <div class="card-value">
            <slot
              :name="col.key"
              :row="row"
              :index="index"
            >
              {{ row[col.key] }}
            </slot>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
<style scoped>

.table-wrapper {
  width: 100%;
}

/* ===== DESKTOP DEFAULT ===== */
.table-mobile {
  display: none;
}

@media (max-width: 1700px) {
  .table-wrapper {
    overflow-x: auto;
  }
  .table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #0d6efd;
}
  .table {
    width: max-content;
    min-width: 100%;
  }

  /* ===== Scrollbar Styling ===== */
  .table-wrapper::-webkit-scrollbar {
    height: 8px;
  }

  .table-wrapper::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  .table-wrapper::-webkit-scrollbar-thumb {
    background: linear-gradient(90deg, #dc3545, #ff6b6b);
    border-radius: 10px;
  }

  .table-wrapper::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(90deg, #b02a37, #ff4d4d);
  }
}

@media (max-width: 768px) {
  .table-desktop {
    display: none;
  }

  .table-mobile {
    display: block;
  }

  .table-card {
    background: #fff;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  }

  .card-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border-bottom: 1px dashed #eee;
  }

  .card-row:last-child {
    border-bottom: none;
  }

  .card-label {
    font-weight: 600;
    color: #666;
    font-size: 13px;
  }

  .card-value {
    text-align: right;
    font-size: 14px;
  }
}
</style>
