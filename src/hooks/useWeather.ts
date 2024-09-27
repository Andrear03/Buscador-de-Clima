import axios from "axios"
import { SearchType } from "../types"
import { object, string, number, parse, InferOutput} from "valibot"
import { useMemo, useState } from "react"

const  weatherSchema = object({
    name: string(),
    main: object({
        temp: number(),
        temp_max :number(),
        temp_min : number()
    })
})
const inicialstate ={
    name : '',
    main: {
        temp: 0,
        temp_max: 0,
        temp_min: 0,
    }
}
export type Weather = InferOutput<typeof weatherSchema>

export default function useWeather(){

    const [weather, setWeather] = useState<Weather>(inicialstate)
    const [loading, setLoading] = useState(false)
    const [notfound, setNotFound] = useState(false)

    const  fetchWeather = async (search: SearchType) => {
        const appId= import.meta.env.VITE_API_KEY
        setLoading(true)
        setWeather(inicialstate)
        try{
            const geourl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country}&appid=${appId}`
            const {data} = await axios(geourl)

            if(!data[0]){
                setNotFound(true)
                return 
            }
            const lat = data[0].lat
            const lon = data[0].lon 
            
            const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`
            const {data:weatherresult} = await axios (weatherurl)
            const result = parse(weatherSchema,weatherresult)
            console.log(result)
            if(result){
                setWeather({
                    name:result.name,
                    main:result.main,
                })
            }
         
        }catch(error){
            console.log(error)
        }finally{
            setLoading(false    )
        }
    }

    const hasWeatherData = useMemo(() => weather.name, [weather])
    return{
        weather,
        fetchWeather,
        hasWeatherData,
        loading,
        notfound
    }
}