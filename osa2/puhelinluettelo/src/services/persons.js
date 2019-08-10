import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => axios.get(baseUrl).then(r => r.data)

const create = newObject => axios
  .post(baseUrl, newObject)
  .then(r => r.data)

const deletePerson = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, newObject) => axios.put(`${baseUrl}/${id}`, newObject)

export default { getAll, create, deletePerson, update }
