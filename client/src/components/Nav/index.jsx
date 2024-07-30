import Auth from '../../utils/auth';
import { Link } from 'react-router-dom';

function Nav() {
    function showNavigation() {
        if (Auth.loggedIn()) {
            return(
                <ul className='flex-row'>
                    <li className = 'mx-1'>
                        <Link to='/Home'>
                            Home
                        </Link>
                    </li>
                    <li className='mx-1'>
                        <Link to='/currentBids'>
                            Current Bids
                        </Link>
                    </li>
                    <li className='mx-1'>
                        <Link to='/auctions'>
                            Auctions
                        </Link>
                    </li>
                    <li className='mx-1'>
                        <a href='/' onClick={() => Auth.logout()}>
                            Logout
                        </a>
                    </li>
                </ul>
            )
        } else {
            return(
                <ul className='flex-row'>
                    <li className='mx-1'>
                        <Link to='/signup'>
                            Signup
                        </Link>
                    </li>
                    <li className='mx-1'>
                        <Link to='/login'>
                            Login
                        </Link>
                    </li>
                </ul>
            )
        }
    }
}