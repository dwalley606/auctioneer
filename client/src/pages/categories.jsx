import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../utils/queries';
import './css/categories.css';

const Categories = () => {
    const { loading, data } = useQuery(GET_CATEGORIES);
    const categories = data?.categories || [];
    
    return (
        <div className='categories'>
        <h1>Categories</h1>
        {loading ? (
            <p>Loading...</p>
        ) : (
            <ul>
            {categories.map((category) => (
                <li key={category.id}>
                <Link to={`/categories/${category.id}`}>{category.name}</Link>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
    }

export default Categories;