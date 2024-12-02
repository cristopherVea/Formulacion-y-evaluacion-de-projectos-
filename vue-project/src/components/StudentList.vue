<template>
    <v-container>
      <v-card>
        <v-card-title>
          Estudiantes
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
  
        <v-data-table
          :headers="headers"
          :items="students"
          :search="search"
          :loading="loading"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="viewDetails(item)">
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn icon @click="editStudent(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteStudent(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
  
        <v-dialog v-model="detailsDialog" max-width="700">
          <v-card>
            <v-card-title>Detalles del Estudiante</v-card-title>
            <v-card-text>
              <v-list>
                <v-list-item>
                  <v-list-item-title>{{ selectedStudent.nombre }}</v-list-item-title>
                  <v-list-item-subtitle>Matrícula: {{ selectedStudent.matricula }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Semestre: {{ selectedStudent.semestreIngreso }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
  
              <v-divider class="my-4"></v-divider>
              <v-card-title class="text-subtitle-1">Cursos Inscritos</v-card-title>
              <v-chip-group>
                <v-chip
                  v-for="course in selectedStudent.cursos"
                  :key="course.id"
                  color="primary"
                  closable
                  @click:close="unenrollCourse(selectedStudent, course)"
                >
                  {{ course.nombre }}
                </v-chip>
              </v-chip-group>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { studentService } from '../services/api'
  
  const search = ref('')
  const loading = ref(false)
  const detailsDialog = ref(false)
  const students = ref([])
  const selectedStudent = ref({})
  
  const headers = [
    { title: 'Nombre', key: 'nombre' },
    { title: 'Matrícula', key: 'matricula' },
    { title: 'Semestre', key: 'semestreIngreso' },
    { title: 'Acciones', key: 'actions', sortable: false }
  ]
  
  const initialize = async () => {
    loading.value = true
    try {
      const response = await studentService.getAll()
      students.value = response.data
    } catch (error) {
      console.error('Error loading students:', error)
    } finally {
      loading.value = false
    }
  }
  
  const viewDetails = (item) => {
    selectedStudent.value = item
    detailsDialog.value = true
  }
  
  onMounted(() => {
    initialize()
  })
  </script>