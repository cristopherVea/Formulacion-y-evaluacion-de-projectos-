<template>
  <v-container>
    <!-- Card Principal -->
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Estudiantes</span>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Nuevo Estudiante
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Búsqueda -->
        <div class="d-flex gap-4 mb-4">
          <v-text-field
            v-model="searchMatricula"
            label="Buscar por Matrícula"
            type="number"
            density="compact"
            class="max-w-xs"
            @keyup.enter="searchByMatricula"
            :rules="[v => !v || v > 0 || 'La matrícula debe ser positiva']"
            :loading="searchLoading"
            clearable
            @click:clear="clearSearch"
            hide-details
          ></v-text-field>
          
          <v-btn 
            color="primary"
            :loading="searchLoading"
            :disabled="!searchMatricula"
            @click="searchByMatricula"
            prepend-icon="mdi-magnify"
          >
            Buscar
          </v-btn>
        </div>

        <!-- Tabla -->
        <v-data-table
          :headers="headers"
          :items="students"
          :loading="loading"
          class="elevation-1"
        >
          <!-- Columna de Cursos -->
          <template v-slot:item.cursos="{ item }">
            {{ item.cursos?.length || 0 }} cursos
          </template>

          <!-- Columna de Acciones -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex justify-end gap-2">
              <v-tooltip text="Ver detalles" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    color="info"
                    v-bind="props"
                    @click="viewDetails(item)"
                    variant="text"
                  ></v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Editar estudiante" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-pencil"
                    size="small"
                    color="warning"
                    v-bind="props"
                    @click="editStudent(item)"
                    variant="text"
                  ></v-btn>
                </template>
              </v-tooltip>

              <v-tooltip text="Eliminar estudiante" location="top">
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    color="error"
                    v-bind="props"
                    @click="confirmDelete(item)"
                    variant="text"
                  ></v-btn>
                </template>
              </v-tooltip>
            </div>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Diálogo de Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ editMode ? 'Editar Estudiante' : 'Nuevo Estudiante' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="form" v-model="valid">
            <v-text-field
              v-model="editedItem.nombre"
              label="Nombre*"
              :rules="nameRules"
              required
              autofocus
            ></v-text-field>

            <v-text-field
              v-model="editedItem.matricula"
              label="Matrícula*"
              type="number"
              :rules="matriculaRules"
              required
              :disabled="editMode"
            ></v-text-field>

            <v-text-field
              v-model="editedItem.semestreIngreso"
              label="Semestre de Ingreso*"
              :rules="semestreRules"
              required
              placeholder="Ejemplo: 2024-1"
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
        <v-card-title class="bg-primary text-white">
          <span class="text-h5">Detalles del Estudiante</span>
        </v-card-title>

        <v-card-text class="pt-4">
          <v-list>
            <v-list-item>
              <v-list-item-title class="text-h6">
                {{ selectedStudent.nombre }}
              </v-list-item-title>
              <v-list-item-subtitle class="mt-1">
                Matrícula: {{ selectedStudent.matricula }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Semestre: {{ selectedStudent.semestreIngreso }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>

          <v-divider class="my-4"></v-divider>
          
          <!-- Cursos Inscritos -->
          <div class="text-h6 mb-2">Cursos Inscritos</div>
          <div v-if="selectedStudent.cursos?.length" class="mb-4">
            <v-chip
              v-for="curso in selectedStudent.cursos"
              :key="curso.id"
              color="primary"
              class="ma-1"
              closable
              @click:close="unenrollCourse(selectedStudent, curso)"
            >
              {{ curso.nombre }}
            </v-chip>
          </div>
          <v-alert
            v-else
            type="info"
            variant="tonal"
            class="mb-4"
          >
            El estudiante no está inscrito en ningún curso
          </v-alert>

          <!-- Inscribir en Curso -->
          <v-divider class="my-4"></v-divider>
          <div class="text-h6 mb-2">Inscribir en Curso</div>
          <v-row align="center">
            <v-col cols="8">
              <v-autocomplete
                v-model="selectedCourse"
                :items="availableCourses"
                item-title="nombre"
                label="Seleccionar curso"
                :loading="loadingCourses"
                return-object
                :disabled="enrolling"
              ></v-autocomplete>
            </v-col>
            <v-col cols="4">
              <v-btn
                color="primary"
                block
                :disabled="!selectedCourse"
                :loading="enrolling"
                @click="enrollInCourse"
              >
                Inscribir
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
        <v-card-title class="bg-error text-white text-h5">
          Confirmar Eliminación
        </v-card-title>
        
        <v-card-text class="pt-4">
          <p>¿Está seguro de que desea eliminar a este estudiante?</p>
          <div class="mt-2">
            <div class="font-weight-bold">{{ selectedStudent.nombre }}</div>
            <div>Matrícula: {{ selectedStudent.matricula }}</div>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn 
            color="grey" 
            variant="text" 
            @click="deleteDialog = false"
            :disabled="deleting"
          >
            Cancelar
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="deleteStudent"
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
import { studentService, courseService } from '@/services/api'

// Estados
const loading = ref(false)
const searchLoading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const enrolling = ref(false)
const loadingCourses = ref(false)
const valid = ref(true)
const search = ref('')
const searchMatricula = ref('')
const dialog = ref(false)
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const editMode = ref(false)
const students = ref([])
const availableCourses = ref([])
const selectedCourse = ref(null)
const selectedStudent = ref({})
const form = ref(null)

// Reglas de validación
const nameRules = [
  v => !!v || 'El nombre es requerido',
  v => v.length >= 3 || 'El nombre debe tener al menos 3 caracteres'
]

const matriculaRules = [
  v => !!v || 'La matrícula es requerida',
  v => Number(v) > 0 || 'La matrícula debe ser un número positivo',
  v => Number.isInteger(Number(v)) || 'La matrícula debe ser un número entero'
]

const semestreRules = [
  v => !!v || 'El semestre es requerido',
  v => /^\d{4}-[1-2]$/.test(v) || 'Formato inválido. Ejemplo: 2024-1'
]

// Configuración de la tabla
const headers = [
  { 
    title: 'Nombre', 
    key: 'nombre', 
    align: 'start', 
    sortable: true 
  },
  { 
    title: 'Matrícula', 
    key: 'matricula', 
    align: 'center', 
    sortable: true 
  },
  { 
    title: 'Semestre', 
    key: 'semestreIngreso', 
    align: 'center', 
    sortable: true 
  },
  {
    title: 'Cursos',
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
  nombre: '',
  matricula: '',
  semestreIngreso: ''
})

const defaultItem = {
  nombre: '',
  matricula: '',
  semestreIngreso: ''
}

// Métodos de inicialización
const initialize = async () => {
  loading.value = true
  try {
    const response = await studentService.getAll()
    students.value = response
  } catch (error) {
    console.error('Error al cargar estudiantes:', error)
    alert('Error al cargar la lista de estudiantes')
  } finally {
    loading.value = false
  }
}

const loadAvailableCourses = async () => {
  loadingCourses.value = true
  try {
    // Cargar todos los cursos
    const allCourses = await courseService.getAll()
    // Filtrar los cursos en los que el estudiante ya está inscrito
    const enrolledCourseIds = selectedStudent.value.cursos?.map(c => c.id) || []
    availableCourses.value = allCourses.filter(course => 
      !enrolledCourseIds.includes(course.id)
    )
  } catch (error) {
    console.error('Error al cargar cursos:', error)
    alert('Error al cargar los cursos disponibles')
  } finally {
    loadingCourses.value = false
  }
}

// Métodos de búsqueda
const searchByMatricula = async () => {
  if (!searchMatricula.value) {
    return initialize()
  }
  
  searchLoading.value = true
  try {
    const response = await studentService.getByMatricula(searchMatricula.value)
    students.value = response ? [response] : []
    if (!response) {
      alert('No se encontró ningún estudiante con esa matrícula')
    }
  } catch (error) {
    console.error('Error al buscar estudiante:', error)
    students.value = []
    if (error.response?.status === 404) {
      alert('No se encontró ningún estudiante con esa matrícula')
    } else {
      alert('Error al buscar estudiante')
    }
  } finally {
    searchLoading.value = false
  }
}

const clearSearch = () => {
  searchMatricula.value = ''
  initialize()
}

// Métodos CRUD
const openCreateDialog = () => {
  editMode.value = false
  editedItem.value = { ...defaultItem }
  dialog.value = true
}

const editStudent = (item) => {
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
    const studentData = {
      nombre: editedItem.value.nombre.trim(),
      matricula: editedItem.value.matricula,
      semestreIngreso: editedItem.value.semestreIngreso
    }

    if (editMode.value) {
      await studentService.update(studentData.matricula, studentData)
      alert('Estudiante actualizado exitosamente')
    } else {
      await studentService.create(studentData)
      alert('Estudiante creado exitosamente')
    }
    
    closeDialog()
    await initialize()
  } catch (error) {
    console.error('Error al guardar estudiante:', error)
    if (error.response?.status === 400 && error.response?.data?.error) {
      alert(error.response.data.error)
    } else {
      alert('Error al guardar el estudiante')
    }
  } finally {
    saving.value = false
  }
}

const confirmDelete = (item) => {
  selectedStudent.value = { ...item }
  deleteDialog.value = true
}

const deleteStudent = async () => {
  deleting.value = true
  try {
    await studentService.delete(selectedStudent.value.matricula)
    deleteDialog.value = false
    await initialize()
    alert('Estudiante eliminado exitosamente')
  } catch (error) {
    console.error('Error al eliminar estudiante:', error)
    if (error.response?.status === 404) {
      alert('El estudiante no existe o ya fue eliminado')
    } else {
      alert('Error al eliminar el estudiante')
    }
  } finally {
    deleting.value = false
  }
}

// Métodos de gestión de cursos
const viewDetails = async (item) => {
  selectedStudent.value = { ...item }
  await loadAvailableCourses()
  detailsDialog.value = true
}

const enrollInCourse = async () => {
  if (!selectedCourse.value || !selectedStudent.value) return
  
  enrolling.value = true
  try {
    await studentService.enrollInCourse(
      selectedStudent.value.matricula,
      selectedCourse.value.nombre
    )
    // Actualizar los datos del estudiante
    const updatedStudent = await studentService.getByMatricula(selectedStudent.value.matricula)
    selectedStudent.value = updatedStudent
    await loadAvailableCourses()
    selectedCourse.value = null
    alert('Estudiante inscrito en el curso exitosamente')
  } catch (error) {
    console.error('Error al inscribir en curso:', error)
    if (error.response?.status === 400) {
      alert('El estudiante ya está inscrito en este curso')
    } else {
      alert('Error al inscribir en el curso')
    }
  } finally {
    enrolling.value = false
  }
}

const unenrollCourse = async (student, course) => {
  if (!confirm(`¿Está seguro de que desea eliminar al estudiante del curso "${course.nombre}"?`)) {
    return
  }

  try {
    await studentService.unenrollFromCourse(student.matricula, course.nombre)
    // Actualizar los datos del estudiante
    const updatedStudent = await studentService.getByMatricula(student.matricula)
    selectedStudent.value = updatedStudent
    await loadAvailableCourses()
    alert('Estudiante eliminado del curso exitosamente')
  } catch (error) {
    console.error('Error al eliminar del curso:', error)
    alert('Error al eliminar al estudiante del curso')
  }
}

// Inicialización
onMounted(() => {
  initialize()
})
</script>