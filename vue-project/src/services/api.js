import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
    config => {
      console.log('Request:', config)
      return config
    },
    error => {
      console.error('Request Error:', error)
      return Promise.reject(error)
    }
  )
  
  api.interceptors.response.use(
    response => {
      console.log('Response:', response)
      return response.data
    },
    error => {
      console.error('Response Error:', error)
      if (error.response?.data) {
        console.error('Error Data:', error.response.data)
        console.error('Error Status:', error.response.status)
      }
      return Promise.reject(error)
    }
  )
  
  export const studentService = {
    getAll: () => api.get('/estudiantes'),
    create: (data) => api.post('/estudiantes', data),
    update: (matricula, data) => api.put(`/estudiantes/${matricula}`, data),
    delete: (matricula) => api.delete(`/estudiantes/${matricula}`),
    getByMatricula: (matricula) => api.get('/estudiantes', { 
      params: { matricula } 
    }),    enrollInCourse: (matricula, cursoNombre) => 
      api.post(`/estudiantes/${matricula}/cursos/${cursoNombre}`),
    unenrollFromCourse: (matricula, cursoNombre) => 
      api.delete(`/estudiantes/${matricula}/cursos/${cursoNombre}`)
  
  }


  export const teacherService = {
    getAll: () => api.get('/profesores'),
    getByName: (nombre) => api.get('/profesores', { params: { nombre } }),
    create: (data) => api.post('/profesores', data),
    update: (nombre, data) => api.put(`/profesores/${nombre}`, data),
    delete: (nombre) => api.delete(`/profesores/${nombre}`),
    assignCourse: (profesorNombre, cursoNombre) => 
      api.post(`/profesores/${profesorNombre}/cursos/${cursoNombre}`),
    removeCourse: (profesorNombre, cursoNombre) => 
      api.delete(`/profesores/${profesorNombre}/cursos/${cursoNombre}`),
    getCourses: (nombre) => api.get(`/profesores/${nombre}/cursos`)
  }
export const courseService = {
  getAll: () => api.get('/cursos'),
  getByName: (nombre) => api.get('/cursos', { params: { nombre } }),
  create: (data) => api.post('/cursos', data),
  update: (nombre, data) => api.put(`/cursos/${nombre}`, data),
  delete: (id) => api.delete(`/cursos/${id}`),
  assignTeacher: (cursoNombre, profesorNombre) => 
    api.post(`/cursos/${cursoNombre}/profesores/${profesorNombre}`),
  removeTeacher: (cursoNombre, profesorNombre) => 
    api.delete(`/cursos/${cursoNombre}/profesores/${profesorNombre}`),
  removeStudent: (cursoNombre, matricula) => 
    api.delete(`/cursos/${cursoNombre}/estudiantes/${matricula}`)
}

export default api