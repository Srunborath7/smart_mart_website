<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from "~/composables/api/useApi"
import BaseModal from '~/components/BaseModal.vue'
import BaseTable from '~/components/BaseTable.vue'
import BaseButton from '~/components/BaseButton.vue'
import "~/assets/css/categories.css"
import Swal from 'sweetalert2'

const api = useApi()

const open = ref(false)
const loading = ref(false)
const errorMessage = ref('')

const categories = ref([])

const search = ref('')

const isEdit = ref(false)
const selectedId = ref(null)

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

    categories.value = (res.data || []).sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at)
    })

  } catch (error) {
    errorMessage.value = 'Failed to load categories'
  } finally {
    loading.value = false
  }
}

const filteredCategories = computed(() => {
  if (!search.value) return categories.value

  return categories.value.filter(category =>
    category.name?.toLowerCase().includes(search.value.toLowerCase())
  )
})

const resetForm = () => {
  form.value = {
    name: '',
    is_active: true,
    description: ''
  }

  isEdit.value = false
  selectedId.value = null
}

const openCreate = () => {
  resetForm()
  open.value = true
}

const saveCategory = async () => {
  if (!form.value.name) {
    Swal.fire({
      icon: 'warning',
      title: 'Category name required'
    })
    return
  }

  try {
    if (isEdit.value) {

      await api(`/categories/${selectedId.value}`, {
        method: 'PUT',
        body: form.value,
        credentials: 'include'
      })

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Category updated successfully',
        position: 'top',
        toast: true,
        timer: 1200,
        showConfirmButton: false
      })

    } else {
      await api('/categories', {
        method: 'POST',
        body: form.value,
        credentials: 'include'
      })

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Category created successfully',
        position: 'top',
        toast: true,
        timer: 1200,
        showConfirmButton: false
      })
    }

    await fetchCategories()

    open.value = false
    resetForm()

  } catch (error) {

    console.error(error)

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: isEdit.value
        ? 'Failed to update category'
        : 'Failed to create category',
      position: 'top',
      toast: true,
    })
  }
}
const editCategory = (category) => {

  isEdit.value = true
  selectedId.value = category.id

  form.value = {
    name: category.name,
    description: category.description,
    is_active: category.is_active
  }

  open.value = true
}

const deleteCategory = async (category) => {

  const result = await Swal.fire({
    title: 'Delete Category?',
    text: `Delete "${category.name}" ?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  })

  if (!result.isConfirmed) return

  try {

    await api(`/categories/${category.id}`, {
      method: 'DELETE',
      credentials: 'include'
    })

    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Category deleted successfully',
      position: 'top',
      toast: true,
      timer: 1200,
      showConfirmButton: false
    })

    await fetchCategories()

  } catch (error) {

    console.error(error)

    Swal.fire({
      icon: 'error',
      title: 'Delete Failed',
      text: 'Unable to delete category',
      position: 'top',
      toast: true
    })
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div class="container py-4">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">

      <div>
        <h2 class="mb-0">Categories</h2>

        <small class="text-muted">
          Manage and organize your product categories easily.
        </small>
      </div>

      <BaseButton variant="danger" @click="openCreate">
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
              <h3>
                {{categories.filter(i => i.is_active).length}}
              </h3>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div class="card shadow-sm">
            <div class="card-body">
              <h6>Inactive</h6>
              <h3>
                {{categories.filter(i => !i.is_active).length}}
              </h3>
            </div>
          </div>
        </div>

      </div>
      <div class="mb-3">
        <input v-model="search" class="form-control" placeholder="Search categories..." />
      </div>
      <div v-if="filteredCategories.length === 0" class="alert alert-warning text-center">
        No categories found.
      </div>
      <BaseTable v-else :columns="[
        { label: '#', key: 'index' },
        { label: 'Category Name', key: 'name' },
        { label: 'Status', key: 'status' },
        { label: 'Description', key: 'description' },
        { label: 'Created', key: 'created' },
        { label: 'Action', key: 'action' }
      ]" :data="filteredCategories">

        <template #index="{ index }">
          {{ index + 1 }}
        </template>

        <template #name="{ row }">
          <div class="d-flex align-items-center">

            <div class="avatar bg-primary text-white rounded-circle me-2" style="
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
              ">
              {{ row.name?.charAt(0) }}
            </div>

            <span>{{ row.name }}</span>

          </div>
        </template>

        <template #description="{ row }">
          <span class="text-muted">
            {{ row.description || 'No description' }}
          </span>
        </template>

        <template #status="{ row }">
          <span class="badge" :class="row.is_active ? 'bg-success' : 'bg-secondary'">
            {{ row.is_active ? 'Active' : 'Inactive' }}
          </span>
        </template>

        <template #created="{ row }">
          {{ new Date(row.created_at).toLocaleDateString() }}
        </template>

        <template #action="{ row }">

          <button class="btn btn-sm btn-warning me-2" @click="editCategory(row)">
            Edit
          </button>

          <button class="btn btn-sm btn-danger" @click="deleteCategory(row)">
            Delete
          </button>

        </template>

      </BaseTable>

    </template>
    <BaseModal v-model="open" :title="isEdit ? 'Edit Category' : 'Add Category'">

      <div class="mb-3">
        <label class="form-label">
          Category Name
        </label>

        <input v-model="form.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">
          Description
        </label>

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
          {{ isEdit ? 'Update' : 'Save' }}
        </BaseButton>

      </template>

    </BaseModal>

  </div>
</template>