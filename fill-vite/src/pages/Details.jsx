import { useEffect, useState } from "react";
import * as formApi from "../apis/form-api";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Details() {
  const [detail, setDetail] = useState(null);
  //   const params =useParams()
  const { id } = useParams();

  useEffect(() => {
    const fetch = async params => {
      try {
        const res = await formApi.getContactApi(params);
        setDetail(res.data);
      } catch (error) {
        console.error(error.message);
        console.error(error.response.data);
      }
    };
    // fetch(params.id)
    fetch(id);
  }, []);
  return (
    <>
      <Link to={-1}>Back</Link>
      <div className="bg-orange-300 max-w-sm p-6 border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Details</h1>
        <div className="box-border border-t-4 border-black pt-2 pl-2">
          <div className="font-medium text-xl text-slate-900">
            First name: <span className="font-normal text-md">{detail?.firstName}</span>
          </div>
          <div className="font-medium text-xl text-slate-900">
            Last name: <span className="font-normal text-md">{detail?.lastName}</span>
          </div>
          <div className="font-medium text-xl text-slate-900">
            E-mail: <span className="font-normal text-md">{detail?.email}</span>
          </div>
          <div className="font-medium text-xl text-slate-900">
            Phone: <span className="font-normal text-md">{detail?.phone}</span>
          </div>
        </div>
      </div>
    </>
  );
}
