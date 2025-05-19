import {useState, useEffect} from 'react';
import * as formApi from '../apis/form-api'
import {X,Edit2,Loader2} from 'lucide-react'
import Input from './Input';
import { useNavigate } from 'react-router-dom';

// Individual Contact Card Component
export default function ContactCard({
    contact, 
    onUpdate, 
    onDelete,
    isEditingGlobally,
    setEditingId,
    editingId,
    onCardClick
}) {
    // Store original contact data for cancel operation
    const [originContact, setOriginContact] = useState({...contact});
    // Working copy of contact data
    const [editContact,setEditContact] = useState({...contact});

    // UI States
    const [isHovering, setIsHovering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    // Determine if this specific card is being edited
    const isEditing = editingId === contact.id;

    // Effect to reset editable contact when not in edit mode or when switching card
    useEffect(() => {
        if(!isEditing) {
            // Reset to the original values when exiting edit mode
            setEditContact({...contact});
        } else if (isEditing) {
            // When entering edit mode, store the original values
            setOriginContact({...contact});
        }
    },[isEditing, contact.id]);

    const navigate = useNavigate();

    // Function to handle card click
    const handleCardClick = (e) => {
        // Stop propagation to prevent any parent click handlers
        e.stopPropagation();

        // If this card is not being edited but another card is
        if(!isEditing && isEditingGlobally) {
            onCardClick(contact.id);
        }

        // Only navigate if not in edit mode
        if (!isEditing && !isEditingGlobally) {
            navigate("/details/" + contact.id);
        }
    };

    // Function to handle editing toggle
    const handleEditToggle = (e) => {
      // Stop event propagation to prevent the card click handler from firing 
      e.stopPropagation();

      if (isEditing) {
        // If already editing, act as cancel
        handleCancel();
      } else {
        // Start editing this card
        setOriginContact({...contact});
        setEditingId(contact.id);
      }

    };

    // Function to handle saving changes
    const handleSave = async (e) => {
      // Stop event propagation
      e && e.stopPropagation();

      setIsLoading(true);
      try {
        // const res = {data:true};
        const res = await formApi.updateContactApi(contact.id, editContact);
        if (res.data?.id) {
          onUpdate(contact.id, editContact);
          setEditingId(null); // Exit edit mode 
        }
      } catch (error) {
          console.error("Error message:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
          } else {
            // In case, error is not from Axios
            console.error("Unexpected error:", error);
          }
      } finally {
          setIsLoading(false);
      }
    }

    // Function to handle canceling changes
    const handleCancel = (e) => {
        // Stop event propagation
        e && e.stopPropagation();

        setEditContact({...originContact});
        setEditingId(null); //Exit edit mode
    }

    // Function to handle deleting the card
    const handleDelete = async (e) => {
        // Stop event propagation
        e.stopPropagation();

        setIsLoading(true);
        try {
            // const res = {data:true};
            const res = await formApi.deleteContactApi(contact.id);
            // console.log(res.data?.id)
            if(res.data?.id) {
              onDelete(contact.id)
            }
        } catch (error) {
          console.error("Error message:", error.message);
          if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
          } else {
            // In case, error is not from Axios
            console.error("Unexpected error:", error);
          }
        } finally {
          setIsLoading(false);
        }
    }

    // Function to handle input changes
    const handleChange = (e) => {
      // Stop event propagation to prevent card click
      e.stopPropagation();

      const {name,value} = e.target;
      setEditContact(prev => ({...prev,[name]:value}));
    };

    // Prevent input clicks from triggering card click
    const handleInputClick = (e) => {
        e.stopPropagation();
    };

    return (
      <div
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleCardClick}
        // className="relative bg-orange-300 block w-96 p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 hover:cursor-pointer"
        className={`relative bg-orange-300 block w-96 p-6 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 ${isEditing ? 'ring-2 ring-orange-600 shadow-xl' : 'hover:shadow-xl'} ${!isEditing && !isLoading ? 'cursor-pointer' : ''}`}
      >

        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-lg z-10">
            <Loader2 className="animate-spin text-blue-500" size={32}/>
          </div>
        )}

        {isHovering && !isLoading && (
        <>
            <button
            onClick={handleDelete}
            className="absolute top-2 right-2 text-grey-500 hover:text-red-700 transition-colors"
            >
            <X size={20}/>
            </button>

            <button
            onClick={handleEditToggle}
            className={`absolute top-2 left-2 transition-colors ${
              isEditing 
                ? 'text-gray-500 hover:text-gray-700' // Style for cancel functionality
                : 'text-blue-500 hover:text-blue-700' // Style for edit functionality
            }`}
            >
            <Edit2 size={20}/>
            </button>
        </>
        )}

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Details</h1>
        <div className="box-border border-t-4 border-black pt-2 pl-2">
        <div className="font-medium text-xl text-slate-900">
            {isEditing? (
            <div className="flex items-center space-x-2 space-y-0.5">
                <p>First name:</p>
                <Input
                    type="text"
                    name="firstName"
                    value={editContact.firstName}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    // error={error.firstName}
                    className="text-base rounded-lg block w-full h-5 p-1"
                />
            </div>
            ) : (
            <p>First name: <span className="font-normal text-md">{contact.firstName}</span></p>
            )}
        </div>
        <div className="font-medium text-xl text-slate-900">
            {isEditing? (
            <div className="flex items-center space-x-2 space-y-0.5">
                <p>Last name:</p>
                <Input
                    label="Last name:"
                    name="lastName"
                    value={editContact.lastName}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    // error={error.lastName}
                    className="text-base rounded-lg block w-full h-5 p-1"
                />
            </div>
            ) : (
            <p>Last name: <span className="font-normal text-md">{contact.lastName}</span></p>
            )}
        </div>
        <div className="font-medium text-xl text-slate-900">
            {isEditing? (
            <div className="flex items-center space-x-2 space-y-0.5">
                <p>E-mail:</p>
                <Input
                    type="text"
                    name="email"
                    value={editContact.email}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    // error={error.email}
                    className="text-base rounded-lg block w-full h-5 p-1"
                />
            </div>
            ) : (
            <p>E-mail: <span className="font-normal text-md">{contact.email}</span></p>
            )}
        </div>
        <div className="font-medium text-xl text-slate-900">
            {isEditing? (
            <div className="flex items-center space-x-2 space-y-0.5">
                <p>Phone:</p>
                <Input
                    type="text"
                    name="phone"
                    value={editContact.phone}
                    onChange={handleChange}
                    onClick={handleInputClick}
                    // error={error.phone}
                    className="text-base rounded-lg block w-full h-5 p-0.5"
                />
            </div>
            ) : (
            <p>Phone: <span className="font-normal text-md">{contact.phone}</span></p>
            )}
        </div>
        </div>

        {isEditing && (
        <div className="flex flex-end space-x-1">
            <button
                onClick={handleCancel}
                className="absolute bottom right-1 px-2 py-0.3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
            >
            Cancel  
            </button>

            <button
                onClick={handleSave}
                className="absolute bottom right-20 px-2 py-0.3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isLoading}
            >
            Ok
            </button>
        </div>
        )}
      </div>
    );
};