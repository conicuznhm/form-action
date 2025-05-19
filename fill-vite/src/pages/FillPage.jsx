import { useState } from "react";
import Input from "../components/Input";
import validateFill from "../validators/validate-fill";
import { useNavigate, Link } from "react-router-dom";
import * as formApi from "../apis/form-api";

export default function FillPage() {
  const initialInput = {
    firstName: "",
    lastName: "",
    email: "",
    phone: ""
  };
  const [input, setInput] = useState(initialInput);
  const [error, setError] = useState({});
  const navigate = useNavigate();

  const handleInput = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
    error[e.target.name] && setError({ ...error, [e.target.name]: "" });
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const result = validateFill(input);
      const numError = Object.values(result).length;

      // console.log(input)

      if (numError) {
        setError(result);
      } else {
        setError({});
        const res = await formApi.createContactApi(input);
        // console.log(res.data?.id);
        setInput(initialInput);
        navigate("/details/" + res.data.id);
      }
    } catch (err) {
        console.error("Error message:", error.message);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Status code:", error.response.status);
        } else {
          // In case, error is not from Axios
          console.error("Unexpected error:", error);
        }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-center m-4">Contact Register</h1>
      <div className="h-auto w-2/6 rounded-md bg-sky-300 mx-auto py-2 flex flex-col gap-y-7 px-4">
        {/* <div className="flex flex-col gap-y-2 px-4 mx-auto"> */}
        <div className="text-end text-xl mt-2 font-bold hover:text-red-800">
          <Link to="/details">All Contacts</Link>
        </div>
        <div>
          <Input
            placeholder="First name"
            name="firstName"
            value={input.firstName}
            onChange={handleInput}
            error={error.firstName}
          />
        </div>
        <div>
          <Input
            placeholder="Last name"
            name="lastName"
            value={input.lastName}
            onChange={handleInput}
            error={error.lastName}
          />
        </div>
        <div>
          <Input
            placeholder="E-mail"
            name="email"
            value={input.email}
            onChange={handleInput}
            error={error.email}
          />
        </div>
        <div>
          <Input
            placeholder="Mobile phone"
            name="phone"
            value={input.phone}
            onChange={handleInput}
            error={error.phone}
          />
        </div>
        <div className="flex flex-row gap-x-10 justify-center">
          {/* <button className="text-white bg-gray-800 rounded-lg px-4" type="submit"> */}
          <button
            className="text-white w-40 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="submit"
          >
            Save
          </button>
          <button
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
            onClick={() => {
              setInput(initialInput);
              setError({});
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      {/* </div> */}
    </form>
  );
}
