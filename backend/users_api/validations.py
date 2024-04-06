from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
import re

UserModel = get_user_model()


def custom_validation(data):
    """
    Custom validation for user creation endpoint
    """
    email = data["email"].strip()
    username = data["username"].strip()
    password = data["password"].strip()
    
    if not email or UserModel.objects.filter(email=email).exists():
        raise ValidationError("Please choose another email, this one is already taken")
    
    if not password or len(password) < 8:
        raise ValidationError("Please choose another password, min 8 characters")
    
    if not username:
        raise ValidationError("Please, you must choose a username")
        
    username_pattern = r'^[a-zA-Z0-9_.-]+$'

    if not re.match(username_pattern, username):
        raise ValidationError("Please choose another username, only letters, numbers, and ._- are allowed")
    
    return data


def validate_email(data):
    email = data["email"].strip()
    if not email:
        raise ValidationError("an email is needed")
    return True


def validate_username(data):
    username = data["username"].strip()
    if not username:
        raise ValidationError("choose another username")
    return True


def validate_password(data):
    password = data["password"].strip()
    if not password:
        raise ValidationError("a password is needed")
    return True
