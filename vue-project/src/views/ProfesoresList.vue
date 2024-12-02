<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Profesores</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nuevo Profesor
        </v-btn>
      </v-card-title>

      <v-card-text>
        <div class="d-flex gap-4 mb-4">
          <v-text-field
            v-model="searchTerm"
            label="Buscar por Nombre"
            density="compact"
            class="max-w-xs"
            @keyup.enter="handleSearch"
            :loading="searchLoading"
            clearable
            @click:clear="clearSearch"
            hide-details
          ></v-text-field>
          
          <v-btn 
            color="primary"
            :loading="searchLoading"
            :disabled="!searchTerm"
            @click="handleSearch"
            prepend-icon="mdi-magnify"
          >
            Buscar
          </v-btn>
        </div>

        <v-data-table
          :headers="headers"
          :items="filteredTeachers"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.cursos="{ item }">
            {{ item.cursos ? item.cursos.length : 0 }} cursos
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-2">
              <v-btn
                icon="mdi-eye"
                size="small"
                color="info"
                @click="viewDetails(item)"
                variant="text"
              ></v-btn>

              <v-btn
                icon="mdi-pencil"
                size="small"
                color="warning"
                @click="editTeacher(item)"
                variant="text"
              ></v-btn>

              <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                @click="confirmDelete(item)"
                variant="text"
              ></v-btn>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo de Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'Editar Profesor' : 'Nuevo Profesor' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="save">
            <v-text-field
              v-model="editedItem.nombre"
              label="Nombre del Profesor*"
              :rules="nameRules"
              required
              autofocus
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="closeDialog"
            :disabled="saving"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            @click="save"
            :loading="saving"
            :disabled="!valid"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Detalles -->
    <v-dialog v-model="detailsDialog" max-width="700px">
      <v-card>
        <v-card-title class="text-h5">
          Detalles del Profesor
        </v-card-title>

        <v-card-text class="pt-4">
          <div class="text-h6 mb-2">{{ selectedTeacher.nombre }}</div>
          <v-divider class="mb-4"></v-divider>

          <!-- Cursos Asignados -->
          <div class="text-h6 mb-2">Cursos Asignados</div>
          <div v-if="selectedTeacher.cursos?.length" class="mb-4">
            <v-chip
              v-for="curso in selectedTeacher.cursos"
              :key="curso.id"
              color="primary"
              class="ma-1"
              closable
              @click:close="removeCourse(selectedTeacher, curso)"
            >
              {{ curso.nombre }}
            </v-chip>
          </div>
          <v-alert
            v-else
            type="info"
            variant="tonal"
          >
            No hay cursos asignados
          </v-alert>

          <!-- Asignar Curso -->
          <v-divider class="my-4"></v-divider>
          <div class="text-h6 mb-2">Asignar Curso</div>
          <v-row align="center">
            <v-col cols="8">
              <v-autocomplete
                v-model="selectedCourse"
                :items="availableCourses"
                item-title="nombre"
                label="Seleccionar curso"
                :loading="loadingCourses"
                return-object
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-btn
                color="primary"
                block
                :disabled="!selectedCourse"
                :loading="assigning"
                @click="assignCourse"
              >
                Asignar
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="text"
            @click="detailsDialog = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de Confirmación de Eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          <p>¿Está seguro que desea eliminar al profesor?</p>
          <p class="font-weight-bold">{{ selectedTeacher.nombre }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            variant="text"
            @click="deleteDialog = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            @click="deleteTeacher"
            :loading="deleting"
          >
            Eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { teacherService, courseService } from '@/services/api'

// Estados
const loading = ref(false)
const searchLoading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const assigning = ref(false)
const loadingCourses = ref(false)
const valid = ref(true)
const searchTerm = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const editMode = ref(false)
const teachers = ref([])
const availableCourses = ref([])
const selectedCourse = ref(null)
const selectedTeacher = ref({})
const form = ref(null)

// Reglas de validación
const nameRules = [
  v => !!v || 'El nombre es requerido',
  v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
]

// Computed properties
const filteredTeachers = computed(() => {
  if (!searchTerm.value) return teachers.value
  
  const term = searchTerm.value.toLowerCase()
  return teachers.value.filter(teacher => 
    teacher.nombre.toLowerCase().includes(term)
  )
})

// Configuración de la tabla
const headers = [
  { 
    title: 'Nombre', 
    key: 'nombre', 
    align: 'start', 
    sortable: true 
  },
  { 
    title: 'Cursos Asignados', 
    key: 'cursos', 
    align: 'center',
    sortable: false
  },
  { 
    title: 'Acciones', 
    key: 'actions', 
    align: 'end',
    sortable: false 
  }
]

// Estado del formulario
const editedItem = ref({
  nombre: ''
})

const defaultItem = {
  nombre: ''
}

// Métodos de inicialización
const initialize = async () => {
  loading.value = true
  try {
    const response = await teacherService.getAll()
    teachers.value = response
  } catch (error) {
    console.error('Error loading teachers:', error)
    alert('Error al cargar los profesores')
  } finally {
    loading.value = false
  }
}

const loadAvailableCourses = async () => {
  loadingCourses.value = true
  try {
    const allCourses = await courseService.getAll()
    // Filtrar los cursos que ya están asignados al profesor
    const assignedCourseIds = selectedTeacher.value.cursos?.map(c => c.id) || []
    availableCourses.value = allCourses.filter(course => 
      !assignedCourseIds.includes(course.id)
    )
  } catch (error) {
    console.error('Error al cargar cursos:', error)
    alert('Error al cargar los cursos disponibles')
  } finally {
    loadingCourses.value = false
  }
}

// Métodos de búsqueda
const handleSearch = () => {
  if (filteredTeachers.value.length === 0) {
    alert('No se encontraron profesores')
  }
}

const clearSearch = () => {
  searchTerm.value = ''
  initialize()
}

// Métodos CRUD
const openCreateDialog = () => {
  editMode.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editTeacher = (item) => {
  editMode.value = true
  editedItem.value = { ...item }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { ...defaultItem }
  editMode.value = false
  if (form.value) {
    form.value.reset()
  }
}

const save = async () => {
  if (!valid.value) return
  
  saving.value = true
  try {
    if (editMode.value) {
      await teacherService.update(editedItem.value.id, editedItem.value)
      alert('Profesor actualizado exitosamente')
    } else {
      await teacherService.create(editedItem.value)
      alert('Profesor creado exitosamente')
    }
    closeDialog()
    await initialize()
  } catch (error) {
    console.error('Error saving teacher:', error)
    alert(error.response?.data?.error || 'Error al guardar el profesor')
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  selectedTeacher.value = { ...item }
  deleteDialog.value = true
}

const deleteTeacher = async () => {
  deleting.value = true
  try {
    await teacherService.delete(selectedTeacher.value.id)
    deleteDialog.value = false
    await initialize()
    alert('Profesor eliminado exitosamente')
  } catch (error) {
    console.error('Error deleting teacher:', error)
    alert('Error al eliminar el profesor')
  } finally {
    deleting.value = false
  }
}

// Métodos de gestión de cursos
const viewDetails = async (item) => {
  selectedTeacher.value = { ...item }
  await loadAvailableCourses()
  detailsDialog.value = true
}

const assignCourse = async () => {
  if (!selectedCourse.value || !selectedTeacher.value) return
  
  assigning.value = true
  try {
    await teacherService.assignCourse(
      selectedTeacher.value.id,
      selectedCourse.value.id
    )
    await refreshTeacherDetails()
    selectedCourse.value = null
    alert('Curso asignado exitosamente')
  } catch (error) {
    console.error('Error al asignar curso:', error)
    let errorMessage = 'Error al asignar el curso'
    if (error.response?.status === 400) {
      errorMessage = 'El curso ya está asignado a este profesor'
    } else if (error.response?.status === 404) {
      errorMessage = 'Profesor o curso no encontrado'
    }
    alert(errorMessage)
  } finally {
    assigning.value = false
  }
}

const removeCourse = async (professor, course) => {
  if (!confirm(`¿Está seguro que desea eliminar el curso "${course.nombre}" del profesor "${professor.nombre}"?`)) {
    return
  }

  try {
    await teacherService.removeCourse(professor.id, course.id)
    await refreshTeacherDetails()
    alert('Curso eliminado exitosamente del profesor')
  } catch (error) {
    console.error('Error al eliminar curso:', error)
    let errorMessage = 'Error al eliminar el curso'
    if (error.response?.status === 404) {
      errorMessage = 'Profesor o curso no encontrado'
    }
    alert(errorMessage)
  }
}

const refreshTeacherDetails = async () => {
  try {
    const updatedTeacher = await teacherService.getById(selectedTeacher.value.id)
    if (updatedTeacher) {
      selectedTeacher.value = updatedTeacher
      const index = teachers.value.findIndex(t => t.id === updatedTeacher.id)
      if (index !== -1) {
        teachers.value[index] = updatedTeacher
      }
      await loadAvailableCourses()
    }
  } catch (error) {
    console.error('Error al actualizar detalles del profesor:', error)
    alert('Error al actualizar la información del profesor')
  }
}

// Inicialización
onMounted(() => {
  initialize()
})
</script>



<style scoped>
.max-w-xs {
  max-width: 300px;
}
.gap-2 {
  gap: 0.5rem;
}
.gap-4 {
  gap: 1rem;
}
.elevation-1 {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.ma-1 {
  margin: 4px;
}
.mb-4 {
  margin-bottom: 16px;
}
.my-4 {
  margin-top: 16px;
  margin-bottom: 16px;
}
</style>