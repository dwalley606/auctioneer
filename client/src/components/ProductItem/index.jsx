import { Link } from 'react-router-dom';
import {pluralize} from '../../utils/helpers';

function ProductItem(item) {
    const {
        image,
        name,
        _id,
        price
    } = item;

    return (
        <Link to={`/products/${_id}`}>
            <div className='card px-1 py-1'>
                <img
                    alt={name}
                    src={`/images/${image}`}
                />
                <p>{name}</p>
                <p>{quantity} {pluralize('item', quantity)} in stock</p>
                <p>${price}</p>
            </div>
        </Link>
    );
}

export default ProductItem;