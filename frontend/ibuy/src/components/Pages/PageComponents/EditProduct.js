import React, { useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap'
import '../PageComponents/PageComponentsCSS/EditProduct.css'

const EditProduct = ({ product_id, name, description, price, stock, categories, image }) => {

    const [newProductID, setNewProductID] = useState(product_id);
    const [newName, setNewName] = useState(name);
    const [newDescription, setNewDescription] = useState(description);
    const [newPrice, setNewPrice] = useState(price);
    const [newStock, setNewStock] = useState(stock);
    const [newCategories, setNewCategories] = useState(categories);
    const [newImage, setNewImage] = useState(image);

    const handleEditDetails = (e, pID) => {
        e.preventDefault()
        console.log(pID)

        const opts = {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "product_id": newProductID,
                "name": newName,
                "description": newDescription,
                "price": newPrice,
                "stock": newStock,
                "categories": newCategories,
                "image": newImage,
            })
        };

        try {
            var url = new URL("http://localhost:8181/items/" + pID)

            fetch(url, opts)
                .then(resp => {
                    if (resp.status === 200) return resp.json();
                    else alert("There is an error!");
                })
                .then(data => {
                    console.log("From Backend", data);
                    window.location.reload(true);
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
        setNewImage(utf8);
    }

    return (
        <div>
            <h1>Edit your Profile</h1>
            <Form>
                <Row>
                    <Form.Label column="lg" lg={2}>Product Name</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={newName} type="name" placeholder="Enter new product name" onChange={(e) => setNewName(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={2}>Product Description</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={newDescription} type="description" placeholder="Enter new product description" onChange={(e) => setNewDescription(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={2}>Price</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={newPrice} type="price" placeholder="Enter new price" onChange={(e) => setNewPrice(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={2}>Stock</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={newStock} type="stock" placeholder="Enter new stock" onChange={(e) => setNewStock(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={2}>Categories</Form.Label>
                    <Col xs={5}>
                        <Form.Control size="lg" value={newCategories} type="categories" placeholder="Enter new category" onChange={(e) => setNewCategories(e.target.value)} />
                    </Col>
                </Row>

                <Row>
                    <Form.Label column="lg" lg={2}>Product Image</Form.Label>
                    <Col xs={5}>
                    <Form.Control size="lg" name="file" type="file" onChange={imageHandler}/>
                        <Button onClick={(e) => handleEditDetails(e, newProductID)} variant="primary" type="submit">
                            Update Details
                        </Button>
                    </Col>
                </Row>
            </Form>

        </div>
    )
}

export default EditProduct