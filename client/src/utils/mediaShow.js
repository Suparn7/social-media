export const imageShow = (src, themeReducer) => {
    return(
        <img src={src} alt="images" className="img-thumbnail" 
        style={{filter: themeReducer ? 'invert(1)' : 'invert(0)' }} />
    )
}

export const videoShow = (src, themeReducer) => {
    return(
        <video controls src={src} alt="images" className="img-thumbnail" 
        style={{filter: themeReducer ? 'invert(1)' : 'invert(0)' }} />
    )
}