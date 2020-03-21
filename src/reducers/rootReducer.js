const initState = {
    /*
    posts: [
        {id: "1", title: "111", body: "1111111111111111"},
        {id: "2", title: "222", body: "2222222222222222"},
        {id: "3", title: "333", body: "3333333333333333"}
    ]
    */
    searchInfo: {src: 'Levice', dst: 'Trnava', date: '20.3.2020', time: '15:05'}
}


const rootReducer = (state = initState, action) => {
    console.log('state:')
    console.log(state)
    console.log('action:')
    console.log(action.url)
    if(action.type === 'UPDATE_URL'){
        console.log('Update URL')
        return {
            ...state,
            searchInfo: action.url
        }
    }
    return state;
}

export default rootReducer