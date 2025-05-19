import { useState } from "react";
import ContactCard from "./ContactCard";

// Contact List Container Component
export default function ContactList({contacts,setContacts}) {
  
  // State to track which card is currently being edited     
  const [editingId, setEditingId] = useState(null)  

  // Function to update a contact in the array   
  const handleUpdateContact = (id, updatedData) => {
    setContacts(prev =>
        prev.map(contact =>
            contact.id === id ? {...contact, ...updatedData} : contact
        )
    );
  };

  // Function to delete a contact from the array   
  const handleDeleteContact = (id) => {
    
    //If deleting the card currently being edited, clear editing state 
    if (editingId === id) {
        setEditingId(null);
    }
    setContacts(prev => prev.filter(contact => contact.id !== id));
  };

 // Handle clicking on a card (for switching edit mode)   
  const handleCardClick = (contactId) => {
    if(editingId && editingId !== contactId) {
        
        // Find the previously edited contact
        const previousContact = contacts.find(el => el.id === editingId);
        if (previousContact) {
            // Exit edit mode on the previous card
            setEditingId(null);
        }
    }

    // Enable clicking on a non-edited card to edit it
    // if (!editingId) {
    //   setEditingId(contactId);
    // }
  }

  return (
    <div className="flex flex-wrap justify-center lg:justify-start gap-4">
      {contacts.map(contact => (
        <ContactCard
          key={contact.id}
          contact={contact}
          onUpdate={handleUpdateContact}
          onDelete={handleDeleteContact}
          isEditingGlobally={editingId !== null}
          editingId={editingId}
          setEditingId={setEditingId}
          onCardClick={handleCardClick}
        />
      ))}
      {contacts.length === 0 && (
        <p className="text-gray-500 text-center">No contacts available.</p>
      )}
    </div>
  );
}