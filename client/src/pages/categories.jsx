import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../utils/queries';
import './css/categories.css';

const Categories = () => {
    const { loading, data } = useQuery(GET_CATEGORIES);
    const categories = data?.categories || [];
    const [showFilter, setShowFilter] = useState(false);

    const handleFilterToggle = () => {
        setShowFilter(!showFilter);
    };

    return (
        <div className="categories">
            <h2>Categories</h2>
            <button onClick={handleFilterToggle}>Toggle Filter</button>
            {showFilter && (
                <div className="filter">
                <div className="filter-options">
                    <h3>Filter Options</h3>
                    <div className="filter-option">
                        <label htmlFor="shape">Shape:</label>
                        <select id="shape">
                            <option value="">All</option>
                            <option value="circle">Circle</option>
                            <option value="square">Square</option>
                            <option value="triangle">Triangle</option>
                        </select>
                    </div>
                    <div className="filter-option">
                        <label htmlFor="size">Size:</label>
                        <select id="size">
                            <option value="">All</option>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="extra-large">Extra Large</option>
                            <option value="extra-extra-large">2XL</option>
                        </select>
                    </div>
                    <div className="filter-option">
                        <label htmlFor="price-range">Price Range:</label>
                        <input type="range" id="price-range" min="0" max="10000000" />
                    </div>
                    <div className="filter-option">
                        <label htmlFor="color">Color:</label>
                        <select id="color">
                            <option value="">All</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                            <option value="green">Green</option>
                            <option value="yellow">Yellow</option>
                            <option value="orange">Orange</option>
                            <option value="purple">Purple</option>
                            <option value="black">Black</option>
                            <option value="white">White</option>
                            <option value="brown">Brown</option>
                            <option value="gray">Gray</option>
                            <option value="pink">Pink</option>
                            <option value="gold">Gold</option>
                            <option value="silver">Silver</option>
                            <option value="bronze">Bronze</option>
                        </select>
                    </div>
                    <div className="filter-option">
                        <label htmlFor="rating">Rating:</label>
                        <select id="rating">
                            <option value="">All</option>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                        </select>
                    </div>
                </div>
                </div>
            )}
            <div className="category-list">
                {categories.map((category) => (
                    <Link key={category.id} to={`/categories/${category.id}`}>
                        <div className="category">
                            <h3>{category.name}</h3>
                            <p>{category.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};


export default Categories;