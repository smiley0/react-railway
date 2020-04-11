const initState = {
    /*
    posts: [
        {id: "1", title: "111", body: "1111111111111111"},
        {id: "2", title: "222", body: "2222222222222222"},
        {id: "3", title: "333", body: "3333333333333333"}
    ]
    */
    searchInfo: {src: 'Zvolen osob.st.', dst: 'Bratislava hl.st.', date: '20.3.2020', time: '6:05'},
    connectionInfo: 
            {
                departure: "12:04:00",
                arrival: "13:33:00",
                duration: "5340.0",
                distance: 124,
                transfer_history: [
                    {
                        train: {
                            url: "http://127.0.0.1:8000/train/813/",
                            number: 813,
                            category: "http://127.0.0.1:8000/train-category/3/",
                            category_short: "R",
                            name: "Gemeran"
                        },
                        stop_from: {
                            id: 805,
                            station: "http://127.0.0.1:8000/station/11/",
                            station_name: "Bratislava hl.st.",
                            arrival_time: "12:04:00",
                            departure_time: "12:04:00",
                            distance: 0
                        },
                        stop_to: {
                            id: 806,
                            station: "http://127.0.0.1:8000/station/10/",
                            station_name: "Bratislava-Vinohrady",
                            arrival_time: "12:09:00",
                            departure_time: "12:10:00",
                            distance: 4
                        }
                    },
                    {
                        train: {
                            url: "http://127.0.0.1:8000/train/607/",
                            number: 607,
                            category: "http://127.0.0.1:8000/train-category/3/",
                            category_short: "R",
                            name: "ANDREA SHOP.SK"
                        },
                        stop_from: {
                            id: 606,
                            station: "http://127.0.0.1:8000/station/10/",
                            station_name: "Bratislava-Vinohrady",
                            arrival_time: "12:18:00",
                            departure_time: "12:20:00",
                            distance: 4
                        },
                        stop_to: {
                            id: 611,
                            station: "http://127.0.0.1:8000/station/5/",
                            station_name: "Trenčín",
                            arrival_time: "13:33:00",
                            departure_time: "13:35:00",
                            distance: 124
                        }
                    }
                ]
            }
        
        }    


const rootReducer = (state = initState, action) => {
    console.log('state:')
    console.log(state)
    console.log('action:')
    console.log(action)
    if(action.type === 'UPDATE_URL'){
        console.log('Update URL')
        return {
            ...state,
            searchInfo: action.url
        }
    }
    else if(action.type === 'SET_CONNECTION'){
        console.log('set Connection')
        return {
            ...state,
            connectionInfo: action.connection
        }
    }
    return state;
}

export default rootReducer