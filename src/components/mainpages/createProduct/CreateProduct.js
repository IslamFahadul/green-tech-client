import React, {useState, useContext, useEffect} from 'react'
import axios from 'axios'
import {GlobalState} from '../../../GlobalState'
import Loading from '../utils/loading/Loading'
import {useHistory, useParams} from 'react-router-dom'

const initialState = {
    product_id: '',
    title: '',
    price: 0,
    description: '',
    content: '',
    category: '',
    _id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token


    const handleUpload = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            const file = e.target.files[0]
            
            if(!file) return alert("File not exist.")

            if(file.size > 1024 * 1024) // 1mb
                return alert("Size too large!")

            if(file.type !== 'image/jpeg' && file.type !== 'image/png') // 1mb
                return alert("File format is incorrect.")

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)
            const res = await axios.post('/api/upload', formData, {
                headers: {'content-type': 'multipart/form-data', Authorization: token}
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    const handleDestroy = async () => {
        try {
            if(!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', {public_id: images.public_id}, {
                headers: {Authorization: token}
            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }
    const handleChangeInput = e =>{
        const {name, value} = e.target
        setProduct({...product, [name]:value})
    }

    const handleSubmit = async e =>{
        e.preventDefault()
        try {
            if(!isAdmin) return alert("You're not an admin")
            if(!images) return alert("No Image Upload")

            // if(onEdit){
            //     await axios.put(`/api/products/${product._id}`, {...product, images}, {
            //         headers: {Authorization: token}
            //     })
            // }
            else{
                await axios.post('/api/products', {...product, images}, {
                    headers: {Authorization: token}
                })
                setImages(false)
                setProduct(initialState)
            }
            // setCallback(!callback)
            // history.push("/")
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const styleUpload = {
        display: images ? "block" : "none"
    }
    return (
        <div className="create_product">
            <div className="upload">
                <input type="file" name="file" id="file_up" onChange={handleUpload} />
                {
                    loading ?<div id="file_img"><Loading /></div>
                    :<div id="file_img"style={styleUpload} >
                    <img src={images ? images.url : ''} alt=""/>
                    <span onClick={handleDestroy}>X</span>
                </div>

                }
                
                
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row">
                    <label htmlFor="product_id">product ID</label>
                    <input type="text" name="product_id" id="product_id" required
                    value={product.product_id} onChange={handleChangeInput}/>
                </div>
                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title" required
                    value={product.title} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price" required
                    value={product.price} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="description">Description</label>
                    <input type="text" name="description" id="description" required
                    value={product.description} onChange={handleChangeInput}/>
                </div>

                <div className="row">
                    <label htmlFor="content">Content</label>
                    <input type="text" name="content" id="content" 
                    value={product.content} onChange={handleChangeInput}/>
                </div>
                <div className="row">
                    <label htmlFor="categories">Categories</label>
                    <input type="text" name="categories" id="categories" 
                    value={product.categories} onChange={handleChangeInput}/>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateProduct;