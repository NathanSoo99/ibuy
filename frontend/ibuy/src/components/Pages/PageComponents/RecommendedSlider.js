import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { HomeImages } from './HomeImages'
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from 'react-icons/fa';
import '../PageComponents/PageComponentsCSS/RecommendedSlider.css'

const RecommendedSlider = ({ slides }) => {
    const history = useHistory();
    const [current, setCurrent] = useState(0);
    const length = slides.length;
    //console.log({slides})
    const nextSlide = () => {
        setCurrent(current === length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? length - 1 : current - 1);
    };

    const toProduct = (index) => {
        if (slides[index].product_id !== undefined) {
            history.push("/product/" + slides[index].product_id);
        } else if (slides[index].id !== undefined) {
            history.push("/product/" + slides[index].id);
        }
        
    }

    if (!Array.isArray(slides) || slides.length <= 0) {
        return null;
    }

    return (
        <div>
        <section className='rslider'>
            
            <FaArrowAltCircleLeft className='left-arrow' onClick={prevSlide} />
            <FaArrowAltCircleRight className='right-arrow' onClick={nextSlide} />
            
            {HomeImages.map((slide, index) => {
                return (
                    <div className={index === current ? 'slide active' : 'slide'} key={index}>
                        
                        {index === current && (<img onClick={() => toProduct(index)} src={slides[index].image} className='image' />)}
                    </div>
                );
            })}
        </section>
        </div>
        
    )
}

export default RecommendedSlider
