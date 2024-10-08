import { countries } from "../../data/countries";
import styles from "./Form.module.css"
import { ChangeEvent, FormEvent, useState } from "react";
import type { SearchType } from "../../types";
import Alert from "../Alert/Alert";

type FromProps = {
    fetchWeather: (search: SearchType) => Promise<void>
}   

export default function Form({fetchWeather}: FromProps) {

    //estado busquedad con 2 propiedades
    const [search, setSearch] = useState<SearchType>({
        city: '',
        country:''
    })

    const [alert, setAlert] = useState('')

    const handleChange = (e : ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>)=>{
        setSearch({
            ...search,
            [e.target.name] : e.target.value
        })
    }

    const handleSubmit = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(Object.values(search).includes('')){
            setAlert('Todos los campos son obligatorios')
            return
        }
        fetchWeather(search)
    }
  return (
        <form 
            className={styles.form}
            onSubmit={handleSubmit}

        >
            {alert && <Alert>{alert}</Alert>}
            <div className={styles.field}>
                <label className={styles.label} htmlFor="city">Ciudad</label>
                <input
                    id="city"
                    type="text"
                    placeholder="Ciudad"
                    value={search.city}
                    name="city"
                    onChange={handleChange}
                />                
            </div>
            <div className={styles.field}>
                <label className={styles.label} htmlFor="country">Pais</label>
                <select
                    id="country"
                    value={search.country}
                    name="country"
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione un Pais</option>
                    {countries.map(countries =>(
                        <option
                            key={countries.code}
                            value={countries.code}
                        >
                            {countries.name}
                        </option>
                    ))}
                </select>              
            </div>
            <input className={styles.submit}type="submit" value='Consultar Clima'/>
        </form>
    )
}
