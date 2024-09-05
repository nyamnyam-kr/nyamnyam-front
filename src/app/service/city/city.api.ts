export async function insertCity(city: CityModel): Promise<any | {status: number}> {
    try {
        const cityDto= {
            cityName: city.cityName
        }
        console.log(cityDto)
        const resp = await fetch('http://211.188.50.33:8080/api/cities/insert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify(cityDto)
        });
        console.log(JSON.stringify(cityDto))
        const data: any=await resp.json();
        return data;
    } catch (error) {
        console.log('There has been a problem with your fetch operation:', error);
        return {status: 500};
    }
}