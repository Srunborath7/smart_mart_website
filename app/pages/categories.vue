<script setup>
import { ref, onMounted } from 'vue'
import { useApi } from "~/composables/api/useApi"
import BaseModal from '~/components/BaseModal.vue'
import BaseTable from '~/components/BaseTable.vue'
import BaseButton from '~/components/BaseButton.vue'
import "~/assets/css/categories.css"
import Swal from 'sweetalert2'

const api = useApi()
const open = ref(false)
const categories = ref([])
const loading = ref(false)
const errorMessage = ref('')

const form = ref({
  name: '',
  is_active: true,
  description: ''
})

const fetchCategories = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const res = await api('/categories')
    categories.value = res.data || []
  } catch (error) {
    errorMessage.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

const saveCategory = async () => {
  if (!form.value.name) return

  try {
    Swal.fire({
      title: 'Saving category...',
      text: 'Please wait',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    await api('/categories', {
      method: 'POST',
      body: {
        name: form.value.name,
        is_active: form.value.is_active,
        description: form.value.description
      }
    })

    Swal.fire({
      icon: 'success',
      title: 'Saved!',
      text: 'Category created successfully',
      timer: 1000,
      showConfirmButton: false
    })

    // reset form
    form.value.name = ''
    form.value.is_active = true
    form.value.description = ''

    await fetchCategories()
    setTimeout(() => {
      open.value = false
    }, 700)

  } catch (error) {
    console.error(error)
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Failed to save category'
    })
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-0">Categories</h2>
        <small class="text-muted">
          Manage and organize your product categories easily.
        </small>
      </div>

      <BaseButton variant="primary" @click="open = true">
        + Add Category
      </BaseButton>

    </div>

    <div v-if="loading" class="text-center py-4">
      <div class="spinner-border"></div>
      <p class="mt-2">Loading categories...</p>
    </div>
    <div v-else-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>

    <template v-else>
      <div class="row mb-4 categories-stats">

        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h6>Total Categories</h6>
              <h3>{{ categories.length }}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h6>Active</h6>
              <h3>{{categories.filter(i => i.is_active === true).length}}</h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h6>Inactive</h6>
              <h3>{{categories.filter(i => i.is_active === false).length}}</h3>
            </div>
          </div>
        </div>

      </div>
      <div class="mb-3">
        <input class="form-control" placeholder="Search categories..." />
      </div>
      <div v-if="categories.length === 0" class="alert alert-warning text-center">
        No categories found.
      </div>
      <BaseTable v-else :columns="[
        { label: '#', key: 'index' },
        { label: 'Category Name', key: 'name' },
        { label: 'Status', key: 'status' },
        { label: 'Description', key: 'description' },
        { label: 'Created', key: 'created' },
        { label: 'Action', key: 'action' }
      ]" :data="categories">
        <template #index="{ index }">
          {{ index + 1 }}
        </template>
        <template #name="{ row }">
          <div class="d-flex align-items-center">
            <div class="avatar bg-primary text-white rounded-circle me-2"
              style="width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
              {{ row.name?.charAt(0) }}
            </div>
          </div>
        </template>
        <template #description="{ row }">
          <span class="text-muted">{{ row.description }}</span>
        </template>
        <template #status="{ row }">
          <span class="badge" :class="row.is_active === true ? 'bg-success' : 'bg-secondary'">
            {{ row.is_active === true ? 'Active' : 'Inactive' }}
          </span>
        </template>
        <template #created="{ row }">
          {{ new Date(row.created_at).toLocaleDateString() }}
        </template>
        <template #action>
          <button class="btn btn-sm btn-warning me-2">Edit</button>
          <button class="btn btn-sm btn-danger">Delete</button>
        </template>
      </BaseTable>
    </template>
    <BaseModal v-model="open" title="Add Category">

      <div class="mb-3">
        <label class="form-label">Category Name</label>
        <input v-model="form.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea v-model="form.description" class="form-control"></textarea>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="is_active" v-model="form.is_active" />
        <label class="form-check-label" for="is_active">
          Is Active
        </label>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="open = false">
          Cancel
        </BaseButton>
        <BaseButton variant="success" @click="saveCategory">
          Save
        </BaseButton>
      </template>
    </BaseModal>
  </div>
</template>