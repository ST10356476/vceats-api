package com.varsitycollege.vc_eats.models

data class User(
    val id: String = "",
    val name: String = "",
    val email: String = "",
    val role: String = "CUSTOMER", // CUSTOMER, STAFF, ADMIN
    val profileImageUrl: String = "",
    val createdAt: Long = System.currentTimeMillis()
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val name: String,
    val email: String,
    val password: String,
    val studentId: String,
    val phone: String = ""
)

data class AuthResponse(
    val token: String,
    val user: User,
    val message: String = ""
)