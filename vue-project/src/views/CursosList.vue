<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Comunidades </span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nueva Comunidad
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Búsqueda -->
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

        <!-- Tabla -->
        <v-data-table
          :headers="headers"
          :items="filteredCourses"
          :loading="loading"
          class="elevation-1"
        >
          <!-- Columna de Estudiantes -->
          <template v-slot:item.estudiantes="{ item }">
            {{ item.estudiantes?.length || 0 }} estudiantes
          </template>

          <!-- Columna de Profesores -->
          <template v-slot:item.profesores="{ item }">
            {{ item.profesores?.length || 0 }} profesores
          </template>

          <!-- Columna de Acciones -->
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
                @click="editCourse(item)"
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
          <span class="text-h5">{{ editMode ? 'Editar Curso' : 'Nuevo Curso' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.nombre"
              label="Nombre del Curso*"
              :rules="nameRules"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="closeDialog">
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
          Detalles del Curso
        </v-card-title>

        <v-card-text>
          <div class="text-h6 mb-4">{{ selectedCourse.nombre }}</div>
          
          <!-- Lista de estudiantes -->
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Estudiantes Inscritos
          </div>
          <div v-if="selectedCourse.estudiantes?.length" class="mb-4">
            <v-chip
              v-for="estudiante in selectedCourse.estudiantes"
              :key="estudiante.id"
              color="primary"
              class="ma-1"
              closable
              @click:close="removeStudent(selectedCourse, estudiante)"
            >
              {{ estudiante.nombre }} ({{ estudiante.matricula }})
            </v-chip>
          </div>
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mb-4"
          >
            No hay estudiantes inscritos en este curso
          </v-alert>

          <!-- Lista de profesores -->
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Profesores Asignados
          </div>
          <div v-if="selectedCourse.profesores?.length" class="mb-4">
            <v-chip
              v-for="profesor in selectedCourse.profesores"
              :key="profesor.id"
              color="success"
              class="ma-1"
              closable
              @click:close="removeTeacher(selectedCourse, profesor)"
            >
              {{ profesor.nombre }}
            </v-chip>
          </div>
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mb-4"
          >
            No hay profesores asignados a este curso
          </v-alert>

          <!-- Asignar profesor -->
          <v-divider class="my-4"></v-divider>
          <div class="text-subtitle-1 font-weight-bold mb-2">
            Asignar Profesor
          </div>
          <v-row align="center">
            <v-col cols="8">
              <v-autocomplete
                v-model="selectedTeacher"
                :items="availableTeachers"
                item-title="nombre"
                label="Seleccionar profesor"
                :loading="loadingTeachers"
                return-object
                hide-details
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-btn
                color="success"
                block
                :disabled="!selectedTeacher"
                :loading="assigning"
                @click="assignTeacher"
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
        <v-card-title class="text-h5">¿Eliminar Curso?</v-card-title>
        <v-card-text>
          ¿Está seguro de que desea eliminar este curso?
          <div class="mt-2">
            <strong>{{ selectedCourse.nombre }}</strong>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" variant="text" @click="deleteDialog = false">
            Cancelar
          </v-btn>
          <v-btn
            color="success"
            variant="text"
            @click="deleteCourse"
            :loading="deleting"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { courseService, teacherService } from '@/services/api'

// Estados
const loading = ref(false)
const searchLoading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const assigning = ref(false)
const loadingTeachers = ref(false)
const valid = ref(true)
const searchTerm = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const editMode = ref(false)
const courses = ref([])
const availableTeachers = ref([])
const selectedTeacher = ref(null)
const selectedCourse = ref({})
const form = ref(null)

// Reglas de validación
const nameRules = [
  v => !!v || 'El nombre es requerido',
  v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
]

// Computed properties
const filteredCourses = computed(() => {
  if (!searchTerm.value) return courses.value
  
  const term = searchTerm.value.toLowerCase()
  return courses.value.filter(course => 
    course.nombre.toLowerCase().includes(term)
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
    title: ' ,', 
    key: 'estudiantes', 
    align: 'center',
    sortable: false
  },
  { 
    title: '.', 
    key: 'profesores', 
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
  nombre: '',
  id: null
})

// Métodos de inicialización
const initialize = async () => {
  loading.value = true
  try {
    const response = await courseService.getAll()
    courses.value = response
  } catch (error) {
    console.error('Error loading courses:', error)
    alert('Error al cargar los cursos')
  } finally {
    loading.value = false
  }
}

const loadAvailableTeachers = async () => {
  loadingTeachers.value = true
  try {
    const allTeachers = await teacherService.getAll()
    const assignedTeacherIds = selectedCourse.value.profesores?.map(p => p.id) || []
    availableTeachers.value = allTeachers.filter(teacher => 
      !assignedTeacherIds.includes(teacher.id)
    )
  } catch (error) {
    console.error('Error loading teachers:', error)
    alert('Error al cargar los profesores disponibles')
  } finally {
    loadingTeachers.value = false
  }
}

// Métodos de búsqueda
const handleSearch = () => {
  if (filteredCourses.value.length === 0) {
    alert('No se encontraron cursos')
  }
}

const clearSearch = () => {
  searchTerm.value = ''
}

// Métodos CRUD
const openCreateDialog = () => {
  editMode.value = false
  editedItem.value = { nombre: '', id: null }
  dialog.value = true
}

const editCourse = (item) => {
  editMode.value = true
  editedItem.value = { ...item }
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  editedItem.value = { nombre: '', id: null }
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
      await courseService.update(editedItem.value.id, { 
        nombre: editedItem.value.nombre.trim() 
      })
      alert('Curso actualizado exitosamente')
    } else {
      await courseService.create({ 
        nombre: editedItem.value.nombre.trim() 
      })
      alert('Curso creado exitosamente')
    }
    
    closeDialog()
    await initialize()
  } catch (error) {
    console.error('Error saving course:', error)
    const errorMessage = error.response?.data?.error || 'Error al guardar el curso'
    alert(errorMessage)
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  selectedCourse.value = { ...item }
  deleteDialog.value = true
}

const deleteCourse = async () => {
  deleting.value = true
  try {
    await courseService.delete(selectedCourse.value.id)
    deleteDialog.value = false
    await initialize()
    alert('Curso eliminado exitosamente')
  } catch (error) {
    console.error('Error deleting course:', error)
    const errorMessage = error.response?.status === 404
      ? 'El curso no existe o ya fue eliminado'
      : 'Error al eliminar el curso'
    alert(errorMessage)
  } finally {
    deleting.value = false
  }
}

// Métodos de gestión de profesores y estudiantes
const viewDetails = async (item) => {
  selectedCourse.value = { ...item }
  await loadAvailableTeachers()
  detailsDialog.value = true
}

const assignTeacher = async () => {
  if (!selectedTeacher.value || !selectedCourse.value) return
  
  assigning.value = true
  try {
    await courseService.assignTeacher(
      selectedCourse.value.id,
      selectedTeacher.value.id
    )
    await refreshCourseDetails()
    selectedTeacher.value = null
    alert('Profesor asignado exitosamente')
  } catch (error) {
    console.error('Error assigning teacher:', error)
    const errorMessage = error.response?.data?.error || 'Error al asignar el profesor'
    alert(errorMessage)
  } finally {
    assigning.value = false
  }
}

const removeTeacher = async (course, teacher) => {
  if (!confirm(`¿Está seguro que desea remover al profesor "${teacher.nombre}" del curso?`)) {
    return
  }

  try {
    await courseService.removeTeacher(course.id, teacher.id)
    await refreshCourseDetails()
    alert('Profesor removido exitosamente')
  } catch (error) {
    console.error('Error removing teacher:', error)
    alert('Error al remover el profesor del curso')
  }
}

const removeStudent = async (course, student) => {
  if (!confirm(`¿Está seguro que desea remover al estudiante "${student.nombre}" del curso?`)) {
    return
  }

  try {
    await courseService.removeStudent(course.id, student.id)
    await refreshCourseDetails()
    alert('Estudiante removido exitosamente')
  } catch (error) {
    console.error('Error removing student:', error)
    alert('Error al remover el estudiante del curso')
  }
}

const refreshCourseDetails = async () => {
  try {
    const updatedCourse = await courseService.getById(selectedCourse.value.id)
    if (updatedCourse) {
      selectedCourse.value = updatedCourse
      // Actualizar la lista principal
      const index = courses.value.findIndex(c => c.id === updatedCourse.id)
      if (index !== -1) {
        courses.value[index] = updatedCourse
      }
      await loadAvailableTeachers()
    }
  } catch (error) {
    console.error('Error refreshing course details:', error)
    alert('Error al actualizar los detalles del curso')
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
.mr-2 {
  margin-right: 0.5rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.ma-1 {
  margin: 0.25rem;
}
.my-4 {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.elevation-1 {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
</style>