import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import '../PageComponents/PageComponentsCSS/AddProducts.css'

const AddProducts = () => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [categories, setCategories] = useState('');
    const [image, setImage] = useState(null);
    const [redirect, setRedirect] = useState(false);

    const addProduct = (e) => {
        e.preventDefault();

        const opts = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "name": name,
                "description": description,
                "price": price,
                "stock": stock,
                "categories": categories,
                "image": image,
            })
        };

        try {
            fetch("http://localhost:8181/items", opts)
                .then(resp => {
                    if (resp.status === 200) {
                        setRedirect(true);
                        alert("Product added Successfully!");
                        return resp.json();
                    }
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                })
        } catch (error) {
            console.error("There is an Error!", error);
        }
    }

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {

            const fileReader = new FileReader();

            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }
    

    const imageHandler = async (e) => {
        console.log(e.target.files[0]);
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        const utf8 = decodeURIComponent(unescape(base64));
        // console.log(base64);
        // console.log(utf8);
        setImage(utf8);
    }

    if (redirect) {
        return <Redirect to="/admin" />
    }

    return (
        <div>
            <h1>Add a new Product here!</h1>
            <img src={image}/>
            <Form>
                <Row>
                    <Form.Label column="lg" lg={4}>Product Name</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={name} type="name" placeholder="Enter product name" onChange={(e) => setName(e.target.value)} />
                    </Col>
                    <Form.Label column="lg" lg={4}>Product Description</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={description} type="name" placeholder="Enter product description" onChange={(e) => setDescription(e.target.value)} />
                    </Col>
                    <Form.Label column="lg" lg={4}>Product Price</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={price} type="name" placeholder="Enter product price" onChange={(e) => setPrice(e.target.value)} />
                    </Col>
                    <Form.Label column="lg" lg={4}>Product Stock</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={stock} type="name" placeholder="Enter product stock" onChange={(e) => setStock(e.target.value)} />
                    </Col>
                    <Form.Label column="lg" lg={4}>Product Category</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={categories} type="name" placeholder="Enter product category" onChange={(e) => setCategories(e.target.value)} />
                    </Col>
                    <Form.Label column="lg" lg={4}>Add Product Image</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" name="file" type="file" onChange={imageHandler} />
                    </Col>
                </Row>
                <Button variant="primary" onClick={addProduct} variant="primary" type="submit">
                    Add Product
                </Button>
            </Form>
        </div>
    )

}

export default AddProducts