CREATE TABLE issues (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);

INSERT INTO issues (id, title, description) VALUES 
(1, 'Login page not responsive on mobile devices', 'The login page layout breaks when viewed on smartphones. Buttons and input fields overlap making it unusable.');

INSERT INTO issues (id, title, description) VALUES 
(2, 'API rate limiting not working as expected', 'Current rate limiting allows more requests than specified in the documentation. This could lead to server overload.');

INSERT INTO issues (id, title, description) VALUES 
(3, 'Add dark mode support', 'Implement a dark mode option for better user experience in low-light environments and to reduce eye strain.');

INSERT INTO issues (id, title, description) VALUES 
(4, 'Security vulnerability in password reset function', 'The current password reset mechanism is vulnerable to timing attacks. We need to implement a more secure method.');

INSERT INTO issues (id, title, description) VALUES 
(5, 'Optimize database queries for faster load times', 'Several pages are loading slowly due to inefficient database queries. We need to review and optimize these for better performance.');