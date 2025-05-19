import axios from "../config/axios";
export const createContactApi = input => axios.post("/submissions", input);
export const getContactApi = id => axios.get("/submissions/" + id);
export const getAllContactsApi = () => axios.get("/submissions");
export const updateContactApi = (id, input) => axios.patch("/submissions/" + id, input);
export const deleteContactApi = id => axios.delete("/submissions/" + id);