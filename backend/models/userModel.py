from datetime import datetime
import re
from werkzeug.security import generate_password_hash

def is_valid_email(email):
    """Validate email format using regex."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))

def get_user_schema(first_name, last_name, email, password, address="", city="", country="", role="user"):
    """Creates a user dictionary with validation and security improvements."""
    
    if not is_valid_email(email):
        raise ValueError("Invalid email format")
    
    hashed_password = generate_password_hash(password)

    return {
        "first_name": first_name,
        "last_name": last_name,
        "email": email,
        "password": hashed_password,  # Store hashed password
        "address": address,
        "city": city,
        "country": country,
        "role": role,  # Default role
        "created_at": datetime.now(),
    }
