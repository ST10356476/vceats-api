package com.varsitycollege.vc_eats

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.lifecycle.lifecycleScope
import com.varsitycollege.vc_eats.api.APIClient
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContentView(R.layout.activity_main)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main)) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }

        testApiConnection()

    }
    private fun testApiConnection() {
        // Show loading message
        Toast.makeText(this, "Connecting to API...", Toast.LENGTH_SHORT).show()

        lifecycleScope.launch {
            try {
                // Test 1: Health Check
                Log.d("API_TEST", "Testing health endpoint...")
                val health = APIClient.api.healthCheck()
                Log.d("API_TEST", "✅ Health: ${health.status} - ${health.message}")

                // Test 2: Get Menu Items
                Log.d("API_TEST", "Fetching menu items...")
                val menuItems = APIClient.api.getAllMenuItems()
                Log.d("API_TEST", "✅ Got ${menuItems.size} menu items")

                // Log first few items
                menuItems.take(3).forEach { item ->
                    Log.d("API_TEST", "  - ${item.name}: R${item.price}")
                }

                // Show success
                Toast.makeText(
                    this@MainActivity,
                    "✅ API Connected!\nFound ${menuItems.size} menu items",
                    Toast.LENGTH_LONG
                ).show()

            } catch (e: Exception) {
                Log.e("API_TEST", "❌ Connection failed", e)
                Toast.makeText(
                    this@MainActivity,
                    "❌ API Error: ${e.message}",
                    Toast.LENGTH_LONG
                ).show()
            }
        }
    }
}