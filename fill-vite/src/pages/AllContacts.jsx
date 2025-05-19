import { useState, useEffect } from 'react';
import * as formApi from '../apis/form-api'
import ContactList from '../components/ContactList';
import { useNavigate } from 'react-router-dom';

export default function AllContacts() {
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();  
  useEffect(() => {
    (async () => {
      try {
        const res = await formApi.getAllContactsApi();
        setDetails(res.data);
      } catch (error) {
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Status code:", error.response.status);
        } else {
          // In case, error is not from Axios
          console.error("Unexpected error:", error);
        }
      }
    })();
  }, []);
 
    return (
        <>
            <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">All Contancts</h1>
                <button className="mb-4" type="button" onClick={() => navigate(-1)}>
                    Back
                </button>
            <ContactList contacts={details} setContacts={setDetails} />
            
        </>
    )
};