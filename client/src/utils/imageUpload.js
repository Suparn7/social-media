export const checkImage = (file) => {
    let err = "";

    if(!file){
        return err = "File does not exist."
    }

    if(file.size > 1024*1024){//1mb
         err = "File size too large, Maximum Limit is 1mb."
    }

    if(file.type !== 'image/jpeg' && file.type !== 'image/png'){
         err = "Image must be either of jpeg format or png format"
    }

    return err;
}

export const imageUpload = async(images) => {
    let imgArr = [];

    for(const item of images){
        const formData = new FormData();
        if(item.camera){
            formData.append("file", item.camera)
        }else{
            formData.append("file", item);
        }
        

        formData.append("upload_preset", "dwl0mmqx");
        formData.append("cloud_name", "suparn")

        const res = await fetch("https://api.cloudinary.com/v1_1/suparn/upload", {
            method: 'POST',
            body: formData
        })

        const data = await res.json();
        imgArr.push({public_id: data.public_id, url: data.secure_url})

    }
    return imgArr;
}