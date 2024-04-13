from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from .models import AppUser
import re

UserModel = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ("user_id", "email", "username", "avatar", "password")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = AppUser.objects.create(
            email=validated_data["email"],
            username=validated_data["username"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        instance.email = validated_data.get("email", instance.email)
        instance.username = validated_data.get("username", instance.username)
        if instance.avatar:
            instance.avatar = validated_data.get("avatar", instance.avatar)
        instance.save()
        return instance

    def validate_username(self, value):
        username_pattern = r"^[a-zA-Z0-9_.-]+$"
        username = value.strip()

        if not username:
            raise ValidationError("Please, you must choose a username")

        if not re.match(username_pattern, username):
            raise ValidationError(
                "Please choose another username, only letters, numbers, and ._- are allowed"
            )

        return value

    def validate_password(self, value):
        password = value.strip()

        if not password or len(password) < 8:
            raise ValidationError("Please choose another password, min 8 characters")
        if not any(char.isupper() for char in password) or not any(
            char.isdigit() for char in password
        ):
            raise ValidationError(
                "Please choose another password, at least one uppercase letter and one number"
            )
        return value
