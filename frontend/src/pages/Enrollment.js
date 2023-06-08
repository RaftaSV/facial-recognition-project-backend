import React, { useState } from 'react'
import FormCard from '../components/FormCard/FormCard';
import styles from './styles/enrollment.module.css';

const Enrollment = () => {
    const [sexo, setSexo] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [membresia, setMembresia] = useState('');

    const handleTelefonoChange = (event) => {
        setTelefono(event.target.value);
    };

    const handleFechaNacimientoChange = (event) => {
        setFechaNacimiento(event.target.value);
    };

    const handleSexoChange = (event) => {
        setSexo(event.target.value);
    };

    const handleMembresiaChange = (event) => {
        setMembresia(event.target.value);
    };

    const collectData = () => { }
    return (
        <div>
            <FormCard>
                <div className={styles['form-enclosed']}>
                    <h1 className={styles.h1}>Formulario de Registro</h1>
                    <form onSubmit={collectData}>
                        <label className={styles.label}>Nombres</label>
                        <br />
                        <input className={styles.input} type='text' name='names' />
                        <br />
                        <label className={styles.label}>Apellidos</label>
                        <br />
                        <input type='text' name='apellidos' />
                        <br />
                        <label className={styles.label}>Genero</label>
                        <br />
                        <select value={sexo} onChange={handleSexoChange}>
                            <option value="">Seleccione...</option>
                            <option value="M">M</option>
                            <option value="F">F</option>
                        </select>
                        <br />
                        <label className={styles.label}>Fecha de Nacimiento</label>
                        <br />
                        <input
                            type="date"
                            value={fechaNacimiento}
                            onChange={handleFechaNacimientoChange}
                        />
                        <br />
                        <label className={styles.label}>Telefono</label>
                        <br />
                        <input
                            type="tel"
                            pattern="[0-9]{4}-[0-9]{4}"
                            placeholder="Formato: 1234-4567"
                            value={telefono}
                            onChange={handleTelefonoChange}
                        />
                        <br />
                        <label className={styles.label}>Membresia</label>
                        <br />
                        <select value={membresia} onChange={handleMembresiaChange}>
                            <option value="">Seleccione...</option>
                            <option value="CLASE A">CLASE A</option>
                            <option value="CLASE B">CLASE B</option>
                        </select>
                    </form>
                </div>
            </FormCard>
        </div>
    )
}

export default Enrollment