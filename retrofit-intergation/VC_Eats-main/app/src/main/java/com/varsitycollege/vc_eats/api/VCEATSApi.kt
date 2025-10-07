package com.varsitycollege.vc_eats.api

import android.app.Notification //not sure
import com.varsitycollege.vc_eats.models.AuthResponse
import com.varsitycollege.vc_eats.models.CreateMenuItemRequest
import com.varsitycollege.vc_eats.models.CreateOrderRequest
import com.varsitycollege.vc_eats.models.LoginRequest
import com.varsitycollege.vc_eats.models.User
import com.varsitycollege.vc_eats.models.Order
import com.varsitycollege.vc_eats.models.MenuItem
import com.varsitycollege.vc_eats.models.OrderResponse
import com.varsitycollege.vc_eats.models.RegisterRequest
import com.varsitycollege.vc_eats.models.UpdateMenuItemRequest
import com.varsitycollege.vc_eats.models.UpdateOrderStatusRequest
import retrofit2.Response
import retrofit2.http.*

interface VCEATSApi {

    // Authentication

    @POST("api/auth/register")
    suspend fun register(@Body request: RegisterRequest): AuthResponse

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): AuthResponse

    @POST("api/auth/me")
    suspend fun getCurrentUser(@Header("Authorization") token: String): Response<Unit>

    // Menu

    @GET("api/menu")
    suspend fun getAllMenuItems(): List<MenuItem>

    @GET("api/menu/categories")
    suspend fun getCategories(): List<String>

    @GET("api/menu/{id}")
    suspend fun getMenuItem(@Path("id") id: String): MenuItem

    @POST("api/menu")
    suspend fun createMenuItem(@Header("Authorization") token: String, @Body menuItem: CreateMenuItemRequest): MenuItem

    @PUT("api/menu/{id}") suspend fun updateMenuItem(@Header("Authorization") token: String, @Path("id") id: String, @Body menuItem: UpdateMenuItemRequest): MenuItem


    @DELETE("api/menu/{id}") suspend fun deleteMenuItem(@Header("Authorization") token: String, @Path("id") id: String): Response<Unit>


    //  ORDER

    @POST("api/orders") suspend fun createOrder(@Header("Authorization") token: String, @Body order: CreateOrderRequest): OrderResponse

    @GET("api/orders/my-orders")
    suspend fun getMyOrders(@Header("Authorization") token: String): List<Order>


    @GET("api/orders") suspend fun getAllOrders(@Header("Authorization") token: String): List<Order>


    @PATCH("api/orders/{id}/status") suspend fun updateOrderStatus(@Header("Authorization") token: String, @Path("id") id: String, @Body status: UpdateOrderStatusRequest): Order


    // HEALTH CHECK
    @GET("api/health")
    suspend fun healthCheck(): HealthResponse
}

// Health response model
data class HealthResponse(
    val status: String,
    val message: String,
    val timestamp: String
)

