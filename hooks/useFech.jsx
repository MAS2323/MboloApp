import { useState, useEffect } from "react";
import axios from "axios";

export default function useFech(url) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [userType, setUserType] = useState("");
  const [user, setUser] = useState(null);
  const [userProducts, setUserProducts] = useState([]);

  const fetchData = async () => {
    setIsLoading(true);
    setIsLoggedIn(true);
    setError(null); // Resetea el error antes de una nueva solicitud

    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error.message); // Guarda el mensaje de error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData(); // Llama a fetchData para recargar los datos
  };

  return { data, isLoading, error, isLoggedIn, refetch };
}
