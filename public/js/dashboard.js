async function fetchStats(token) {
  const res = await fetch('/api/dashboard/stats', {
    headers: { Authorization: token }
  });
  if (!res.ok) throw new Error('Failed to fetch stats: ' + res.status);
  return res.json();
}

function formatCurrency(n) {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(n);
}

document.getElementById('loadBtn').addEventListener('click', async () => {
  const tokenInput = document.getElementById('token').value.trim();
  if (!tokenInput) return alert('Please paste a Bearer token');

  try {
    const json = await fetchStats(tokenInput);
    if (!json.success) throw new Error('API returned failure');
    const data = json.data;

    document.getElementById('totalOrders').textContent = data.totalOrders;
    document.getElementById('totalSales').textContent = formatCurrency(data.totalSales || 0);

    // Orders by status
    const statusCtx = document.getElementById('statusChart').getContext('2d');
    new Chart(statusCtx, {
      type: 'pie',
      data: {
        labels: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'],
        datasets: [{
          data: [data.byStatus.pending, data.byStatus.preparing, data.byStatus.ready, data.byStatus.completed, data.byStatus.cancelled],
          backgroundColor: ['#f6c23e', '#4e73df', '#1cc88a', '#36b9cc', '#e74a3b']
        }]
      }
    });

    // Orders per day
    const days = data.ordersPerDay.map(d => d._id);
    const counts = data.ordersPerDay.map(d => d.count);
    const dayCtx = document.getElementById('ordersDayChart').getContext('2d');
    new Chart(dayCtx, {
      type: 'line',
      data: {
        labels: days,
        datasets: [{ label: 'Orders', data: counts, borderColor: '#4e73df', fill: false }]
      }
    });

    // Top items
    const itemNames = data.topMenuItems.map(i => i.name || 'Unknown');
    const itemQty = data.topMenuItems.map(i => i.quantity);
    const itemCtx = document.getElementById('topItemsChart').getContext('2d');
    new Chart(itemCtx, {
      type: 'bar',
      data: {
        labels: itemNames,
        datasets: [{ label: 'Qty', data: itemQty, backgroundColor: '#1cc88a' }]
      }
    });

  } catch (err) {
    console.error(err);
    alert('Failed to load dashboard. Check console for details.');
  }
});
