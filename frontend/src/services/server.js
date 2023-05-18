import axios from 'axios';

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newPerson) => {
  console.log("Create newperson")
  console.log(newPerson)
  return axios.post(baseUrl, newPerson).then((response) => response.data);
};

const deletePerson = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response.data);
};

const switchNumber = (id, updatedData) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedData);
  return request.then((response) => response.data);
};

const server = {
  getAll,
  create,
  deletePerson,
  switchNumber
};

export default server;