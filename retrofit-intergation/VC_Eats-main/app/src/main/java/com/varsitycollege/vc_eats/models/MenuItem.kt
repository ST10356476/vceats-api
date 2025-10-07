package com.varsitycollege.vc_eats.models

data class MenuItem(
    var id: String = "",
    var name: String = "",
    var description: String = "",
    var price: Double = 0.0,
    var category: String = "",
    var isAvailable: Boolean = true,
    var isSpecial: Boolean = false,
    var allergens: List<String> = emptyList(),
    var imageUrl: String = "",
    var createdAt: Long = 0L,
    var updatedAt: Long = 0L
) {
    // No-argument constructor for Firebase
    constructor() : this("", "", "", 0.0, "", true, false, emptyList(), "", 0L, 0L)
}

data class CreateMenuItemRequest(
    val name: String,
    val description: String,
    val price: Double,
    val category: String,
    val isAvailable: Boolean = true,
    val isSpecial: Boolean = false,
    val allergens: List<String> = emptyList(),
    val imageUrl: String = ""
)

data class UpdateMenuItemRequest(
    val name: String? = null,
    val description: String? = null,
    val price: Double? = null,
    val category: String? = null,
    val isAvailable: Boolean? = null,
    val isSpecial: Boolean? = null,
    val allergens: List<String>? = null,
    val imageUrl: String? = null
)