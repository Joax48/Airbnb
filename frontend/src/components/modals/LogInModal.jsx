import React, { useState } from "react";
import "../../style/LogInModal.css";
import axios from "axios";

const LogInModal = ({ onClose }) => {
    const [form, setForm] = useState({
        email: "",
        password: "", 
        otp: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setLoading(true);

        if (!form.email.trim() || !form.password.trim() || !form.otp.trim()) {
            setIsSuccess(false);
            setMessage("Por favor completa todos los campos");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:4000/api/users/Login", form);
            
            if (res.status !== 200) {
                setIsSuccess(false);
                setMessage(res.data.message || "Error en el inicio de sesión");
            } else {
                setIsSuccess(true);
                setMessage("Inicio de sesión exitoso");
                setTimeout( () => { onClose() }, 2500);
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage("Error en el servidor");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="logIn-modal-overlay" onClick={onClose}>
      <div className="logIn-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>

        <form onSubmit={handleSubmit}>

            <h2>Iniciar Sesión</h2>

            {message && <p className={ isSuccess ? "success-message" : "err-message" } >{message}</p>}

            <div className="form-group">
                <label htmlFor="email">Correo</label>
                <input type="email" name="email" placeholder="youremail@email.com"
                value={form.email} onChange={handleChange} required/>

                <label htmlFor="password">Contraseña</label>
                <input type="password" name="password"
                value={form.password} onChange={handleChange} required/>
                
                <label htmlFor="otp">Yubikey OTP</label>
                <input type="password" name="otp"
                value={form.otp} onChange={handleChange} required/>
            </div>

            <div className="confirm-btn-container">
                <button type="submit" className="confirm-btn">
                    { loading ? "Validando..." : "Confirmar" }
                </button>
            </div>
        </form>

      </div>
    </div>
  );
};

export default LogInModal;
