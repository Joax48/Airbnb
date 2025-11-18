import axios from "axios";
import { useState, useEffect } from "react";
axios.defaults.withCredentials = true;

const API = import.meta.env.VITE_IP_SERVER;

export const useSaved = () => {
  const [saved, setSaved] = useState([]);

  const loadSaved = async () => {
    try {
      const res = await axios.get(`${API}/api/saved`);
      setSaved(res.data);
    } catch (err) {
      console.error("Error cargando guardados", err);
    }
  };

  const toggleSave = async (type, item_id) => {
    try {
      const res = await axios.post(`${API}/api/saved/toggle`, {
        type,
        item_id,
      });

      const wasSaved = res.data.saved;

      if (wasSaved) {
        // Se guardo ahora - agregar al estado
        setSaved((prev) => [
          ...prev,
          { item_type: type, item_id: Number(item_id) },
        ]);
      } else {
        // Ya estaba guardado - eliminar del estado
        setSaved((prev) =>
          prev.filter(
            (s) => !(s.item_type === type && s.item_id === Number(item_id))
          )
        );
      }
    } catch (error) {
      console.error("Error guardando", error);
    }
  };

  useEffect(() => {
    loadSaved();
  }, []);

  return { saved, toggleSave };
};
