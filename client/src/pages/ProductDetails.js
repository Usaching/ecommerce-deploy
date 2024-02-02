import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout/Layout'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import "../styles/ProductDetailsStyle.css";
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const [cart,setCart] = useCart();
    const navigate = useNavigate();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([])

    //initial p details
    useEffect(() => {
        if(params?.slug) getProduct()
    }, [params?.slug])
    //get product
    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/get-product/${params.slug}`)
            setProduct(data?.product);
            getSimilarProduct(data?.product._id, data?.product.category._id);
        }catch(error) {
            console.log(error);
        }
    }
    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/related-product/${pid}/${cid}`);
            setRelatedProducts(data?.products);
        }catch(error) {
            console.log(error);
        }
    }
  return (
    <Layout>
        <div className='row container product-details'>
            <div className='col-md-6'>
                <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${product._id}`} className="card-img-top" alt={product.name} height="300" width={"300px"}/>
            </div>
            <div className='col-md-6'>
                <h1 className='text-center'>Product Details</h1>
                <h6>Name : {product.name}</h6>
                <h6>Description : {product.description}</h6>
                <h6>Price : {product.price?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD"
                })}</h6>
                <h6>Category : {product?.category?.name}</h6>
                <button className="btn btn-secondary ms-1" onClick={() => {
                    setCart([...cart, product]);
                    //store item in local storage
                    localStorage.setItem(
                    "cart",
                    JSON.stringify([...cart, product])
                    );
                    toast.success("Item Added to cart");
                }}>ADD TO CART</button>
            </div>
        </div>
        <hr />
        <div className='row container'>
            <h6>Similar product</h6>
            {relatedProducts.length < 1 && <p className='text-center'>No Similar Products found</p>}
            {/* {JSON.stringify(relatedProducts, null, 4)} */}
            <div className='d-flex flex-wrap'>
              {relatedProducts?.map((p) => (
                        
                <div className="card m-2" style={{width: '18rem'}} key={p._id}>
                    <img src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} className="card-img-top" alt={p.name} />
                    <div className="card-body">
                        <div className='card-name-price'>
                            <h5 className="card-title">{p.name}</h5>
                            <h5 className="card-title card-price">
                                {p.price.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                })}
                            </h5>
                        </div>
                        
                        <p className="card-text">{p.description.substring(0, 60)}...</p>
                        {/* <p className="card-text"> $ {p.price}</p> */}
                        <div className='card-name-price'>
                            
                            <button className="btn btn-primary ms-1" onClick={() => navigate(`/product/${p.slug}`)}>More Details</button>
                        </div>
                        

                        {/* <button className="btn btn-secondary ms-1" onClick={() => {
                            setCart([...cart, p]);
                            localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, p])
                            );
                            toast.success("Item Added to cart");
                        }}>
                            ADD TO CART
                        </button> */}
                        

                    </div>
                </div>
              ))}

                      
            </div>
        </div>
    </Layout>
  )
}

export default ProductDetails