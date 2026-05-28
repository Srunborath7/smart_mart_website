<template>
  <div class="container py-4">

    <!-- HEADER -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">

      <div>
        <h2 class="mb-1">👥 Users Management</h2>
        <small class="text-muted">Manage system users and roles</small>
      </div>

      <BaseButton variant="danger" @click="openCreate">
        + Add User
      </BaseButton>

    </div>

    <!-- SEARCH -->
    <div class="mb-3">
      <input
        v-model="search"
        class="form-control"
        placeholder="Search users..."
      />
    </div>

    <!-- TABLE -->
    <div class="card shadow-sm border-0">
      <div class="card-body">

        <div class="table-responsive">
          <table class="table table-hover align-middle">

            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(user, index) in filteredUsers" :key="user.id">

                <td data-label="#"> {{ index + 1 }} </td>

                <td data-label="Name">
                  <strong>{{ user.name }}</strong>
                </td>

                <td data-label="Email">
                  {{ user.email }}
                </td>

                <td data-label="Role">
                  <span class="badge bg-primary">
                    {{ user.role }}
                  </span>
                </td>

                <td data-label="Status">
                  <span class="badge bg-success">
                    Active
                  </span>
                </td>

                <td data-label="Action">
                  <button
                    class="btn btn-sm btn-danger w-100 w-md-auto"
                    @click="deleteUser(user)"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            </tbody>

          </table>
        </div>

        <div v-if="filteredUsers.length === 0" class="text-center text-muted py-4">
          No users found
        </div>

      </div>
    </div>

    <!-- MODAL -->
    <BaseModal v-model="open" title="Register User">

      <div class="mb-3">
        <label>Name</label>
        <input v-model="form.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Email</label>
        <input v-model="form.email" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Password</label>
        <input type="password" v-model="form.password" class="form-control" />
      </div>

      <div class="mb-3">
        <label>Role</label>
        <select v-model="form.role" class="form-control">
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      <template #footer>
        <BaseButton variant="secondary" @click="open = false">
          Cancel
        </BaseButton>

        <BaseButton variant="success" @click="registerUser">
          Save
        </BaseButton>
      </template>

    </BaseModal>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useApi } from '~/composables/api/useApi'
import Swal from 'sweetalert2'

const api = useApi()

const users = ref([])
const search = ref('')
const open = ref(false)

const form = ref({
  name: '',
  email: '',
  password: '',
  role: 'USER'
})

/* ================= FETCH USERS ================= */
const fetchUsers = async () => {
  try {
    const res = await api('/auth', {
      method: 'GET',
      credentials: 'include'
    })

    users.value = res.data || []
  } catch (err) {
    Swal.fire('Error', 'Failed to load users', 'error')
  }
}

/* ================= SEARCH FILTER ================= */
const filteredUsers = computed(() => {
  const keyword = search.value.toLowerCase()

  if (!keyword) return users.value

  return users.value.filter(u =>
    u.name.toLowerCase().includes(keyword) ||
    u.email.toLowerCase().includes(keyword)
  )
})

/* ================= OPEN MODAL ================= */
const openCreate = () => {
  form.value = {
    name: '',
    email: '',
    password: '',
    role: 'USER'
  }
  open.value = true
}

/* ================= REGISTER USER ================= */
const registerUser = async () => {
  try {
    await api('/auth/register', {
      method: 'POST',
      body: form.value
    })

    Swal.fire({
      icon: 'success',
      title: 'User created',
      timer: 1200,
      showConfirmButton: false
    })

    open.value = false
    fetchUsers()

  } catch (err) {
    Swal.fire('Error', 'Failed to create user', 'error')
  }
}

/* ================= DELETE USER ================= */
const deleteUser = async (user) => {
  const confirm = await Swal.fire({
    title: 'Delete user?',
    text: user.email,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes delete'
  })

  if (!confirm.isConfirmed) return

  try {
    await api(`/auth/${user.id}`, {
      method: 'DELETE'
    })

    Swal.fire('Deleted', 'User removed', 'success')
    fetchUsers()

  } catch (err) {
    Swal.fire('Error', 'Delete failed', 'error')
  }
}

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
table {
  border-radius: 12px;
  overflow: hidden;
}

/* ================= MOBILE CARD TABLE ================= */
@media (max-width: 768px) {
  table thead {
    display: none;
  }

  table,
  tbody,
  tr,
  td {
    display: block;
    width: 100%;
  }

  tbody tr {
    margin-bottom: 12px;
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.06);
    border: 1px solid #eee;
  }

  tbody td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border: none !important;
  }

  tbody td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #666;
    margin-right: 10px;
  }

  .btn {
    width: 100%;
  }
}
</style>