import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/contact.css';

    const Contact = () => {
        const [email, setEmail] = useState('');
        const [question, setQuestion] = useState('');
         const [isComplaint, setIsComplaint] = useState(false);
        const [showForm, setShowForm] = useState(false);

        const handleSubmit = (e) => {
            e.preventDefault();
            // Handle form submission logic here
         };

         const handleToggleForm = () => {
             setShowForm(!showForm);
         };

        return (
              <div className='contact-menu'>
                <h1>Company Information</h1>
                <p>Owner: PDJK Corp. </p>
                <p>Email: generalResourceInform@Pdjk.org</p>
                <p>Phone: 1-800-233-4572</p>
                <p>Address: 1234 Main St. Suite 100, Anytown, USA 12345</p>
                <p>Hours: 9am-5pm, Monday-Friday</p>

                <h2>Contact Us</h2>

                <button onClick={handleToggleForm}>Any Questions or Complaints</button>

                {showForm && (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                         <label htmlFor="question">Question/Complaint:</label>
                          <textarea
                            id="question"
                              value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                             required
                         ></textarea>

                        <label htmlFor="isComplaint">Is this a complaint about a previous purchase?</label>
                         <input
                             type="checkbox"
                            id="isComplaint"
                            checked={isComplaint}
                            onChange={(e) => setIsComplaint(e.target.checked)}
                         />

                         <button type="submit">Submit</button>
                    </form>
                )}

                 <Link to="/contact"></Link>
             </div>
         );
     };

  export default Contact;
