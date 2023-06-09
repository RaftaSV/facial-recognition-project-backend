import React, { useState, useRef } from 'react'
import useQuery from '../hooks/useQuery';
import FormCard from '../components/FormCard/FormCard';
import Webcam from 'react-webcam';
import styles from './styles/enrollment.module.css';

const Enrollment = () => {
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [sexo, setSexo] = useState('');
    const [photoData, setPhotoData] = useState('');
    const [fechaNacimiento, setFechaNacimiento] = useState('');
    const [telefono, setTelefono] = useState('');
    const [membresia, setMembresia] = useState('');

    const webcamRef = useRef(null);

    const { data } = useQuery('/Membrecias');

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

    const handleNamesChange = (event) => {
        setNombres(event.target.value);
    }

    const handleApellidosChange = (event) => {
        setApellidos(event.target.value);
    }

    const capturePhoto = async (e) => {
        e.preventDefault();
        const imageSrc = webcamRef.current.getScreenshot();

        const response = await fetch(imageSrc);
        const blob = await response.blob();

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = reader.result;
            setPhotoData(base64data);
            localStorage.setItem('photoBlob', base64data);
        };
    };


    const collectData = (event) => {
        event.preventDefault();

        const formData = {
            nombre: nombres,
            apellido: apellidos,
            sexo: sexo,
            fechaNacimiento: fechaNacimiento,
            telefono: telefono,
            membresia: membresia,
            imagenPerfil: localStorage.getItem('photoBlob') // Obtener la foto previamente guardada en el localStorage
        };

        localStorage.setItem('data', JSON.stringify(formData));

        // Puedes imprimir los datos en la consola para verificar que se hayan guardado correctamente
        console.log(formData);
    }
    return (
        <div>
            <FormCard>
                <div className={styles['form-enclosed']}>
                    <h1 className={styles.h1}>Formulario de Registro</h1>
                    <form className={styles.form} method='POST' onSubmit={collectData}>
                        <div className={styles['form-left']}>
                            <label className={styles.label}>Nombres</label>
                            <br />
                            <input className={styles.input} type='text' name='names' value={nombres} onChange={handleNamesChange} />
                            <br />
                            <label className={styles.label}>Apellidos</label>
                            <br />
                            <input className={styles.input} type='text' name='apellidos' value={apellidos} onChange={handleApellidosChange} />
                            <br />
                            <label className={styles.label}>Genero</label>
                            <br />
                            <select className={styles.select} value={sexo} onChange={handleSexoChange}>
                                <option value="">Seleccione...</option>
                                <option value="M">M</option>
                                <option value="F">F</option>
                            </select>
                            <br />
                            <label className={styles.label}>Fecha de Nacimiento</label>
                            <br />
                            <input
                                className={styles.input}
                                type="date"
                                value={fechaNacimiento}
                                onChange={handleFechaNacimientoChange}
                            />
                            <br />
                            <label className={styles.label}>Telefono</label>
                            <br />
                            <input
                                className={styles.input}
                                type="tel"
                                pattern="[0-9]{4}-[0-9]{4}"
                                placeholder="Formato: 1234-4567"
                                value={telefono}
                                onChange={handleTelefonoChange}
                            />
                            <br />
                            <label className={styles.label}>Membresia</label>
                            <br />
                            <select className={styles.select} value={membresia} onChange={handleMembresiaChange}>
                                <option value="">Seleccione...</option>
                                {data && data.map((registro) => (
                                    <option key={registro.idMembresia} value={registro.idMembresia}>
                                        {registro.descripcion}
                                    </option>
                                ))}
                            </select>
                            <div className={styles['form-bottom']}>
                                <button className={styles.button} type='submit'>Registrar nuevo Usuario</button>
                            </div>
                        </div>
                        <div className={styles['form-right']}>
                            <div className={styles.webcam}>
                                <Webcam audio={false} ref={webcamRef} screenshotFormat="image/jpeg" className={styles["webcam-container"]} />
                                <button onClick={capturePhoto} className={styles.capture}>Capturar Imagen</button>
                                {photoData !== '' ? <span>Foto capturada</span> : <span>Aun no se ha capturado</span>}
                            </div>
                        </div>

                    </form>
                </div>
            </FormCard>
        </div>
    )
}

export default Enrollment