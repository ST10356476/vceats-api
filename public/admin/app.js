(() => {
  const { useState, useEffect, useRef } = React;

  // Small helper for fetch with token
  async function api(path, token, opts = {}) {
    opts.headers = opts.headers || {};
    if (token) opts.headers.Authorization = 'Bearer ' + token;
    const res = await fetch(path, opts);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || ('HTTP ' + res.status));
    return json;
  }

  function AdminApp() {
    const [token, setToken] = useState(localStorage.getItem('vceats_token'));
    const [view, setView] = useState('dashboard');

    const onLogout = () => { localStorage.removeItem('vceats_token'); setToken(null); };

    if (!token) return React.createElement(Login, { onLogin: (t) => setToken(t) });

    return React.createElement('div', { className: 'app' },
      React.createElement(Nav, { view, setView, onLogout }),
      React.createElement('div', { className: 'content' },
        view === 'dashboard' ? React.createElement(Dashboard, { token }) :
        view === 'orders' ? React.createElement(Orders, { token }) :
        view === 'menu' ? React.createElement(MenuManager, { token }) :
        React.createElement(Users, { token })
      )
    );
  }

  function Nav({ view, setView, onLogout }) {
    return React.createElement('nav', { className: 'admin-nav' },
      React.createElement('button', { className: view === 'dashboard' ? 'active' : '', onClick: () => setView('dashboard') }, 'Dashboard'),
      React.createElement('button', { className: view === 'orders' ? 'active' : '', onClick: () => setView('orders') }, 'Orders'),
      React.createElement('button', { className: view === 'menu' ? 'active' : '', onClick: () => setView('menu') }, 'Menu'),
      React.createElement('button', { className: view === 'users' ? 'active' : '', onClick: () => setView('users') }, 'Users'),
      React.createElement('div', { style: { flex: 1 } }),
      React.createElement('button', { onClick: onLogout, className: 'logout' }, 'Logout')
    );
  }

  function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submit = async (e) => {
      e && e.preventDefault();
      setLoading(true); setError(null);
      try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Login failed');
        const token = json.data.token;
        localStorage.setItem('vceats_token', token);
        onLogin(token);
      } catch (err) {
        setError(err.message || String(err));
      } finally { setLoading(false); }
    };

    return React.createElement('form', { className: 'login-form', onSubmit: submit },
      React.createElement('h2', null, 'Staff / Admin Login'),
      error ? React.createElement('div', { className: 'error' }, error) : null,
      React.createElement('input', { type: 'email', placeholder: 'Email', value: email, onChange: e => setEmail(e.target.value), required: true }),
      React.createElement('input', { type: 'password', placeholder: 'Password', value: password, onChange: e => setPassword(e.target.value), required: true }),
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement('button', { type: 'submit', disabled: loading }, loading ? 'Logging in...' : 'Login'),
        React.createElement('button', { type: 'button', onClick: () => { setEmail('staff@varsity.ac.za'); setPassword('password'); } }, 'Use Staff')
      ),
      React.createElement('div', { className: 'hint' }, 'Seeded accounts: staff@varsity.ac.za / password, admin@varsity.ac.za / password')
    );
  }

  function Dashboard({ token }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const statusCanvas = useRef(null);
    const daysCanvas = useRef(null);
    const itemsCanvas = useRef(null);

    useEffect(() => {
      let mounted = true;
      (async () => {
        setLoading(true); setError(null);
        try {
          const json = await api('/api/dashboard/stats', token);
          if (!mounted) return;
          setData(json.data);
        } catch (err) { setError(err.message || String(err)); }
        finally { setLoading(false); }
      })();
      return () => { mounted = false; };
    }, []);

    useEffect(() => {
      if (!data) return;
      // draw charts
      if (statusCanvas.current) new Chart(statusCanvas.current, { type: 'pie', data: { labels:['Pending','Preparing','Ready','Completed','Cancelled'], datasets:[{ data:[data.byStatus.pending,data.byStatus.preparing,data.byStatus.ready,data.byStatus.completed,data.byStatus.cancelled], backgroundColor:['#f6c23e','#4e73df','#1cc88a','#36b9cc','#e74a3b'] }] } });
      if (daysCanvas.current) { const labels = data.ordersPerDay.map(d => d._id); const counts = data.ordersPerDay.map(d => d.count); new Chart(daysCanvas.current, { type:'line', data:{ labels, datasets:[{ label:'Orders', data:counts, borderColor:'#4e73df', fill:false }] } }); }
      if (itemsCanvas.current) { const names = data.topMenuItems.map(i => i.name || 'Unknown'); const qty = data.topMenuItems.map(i => i.quantity); new Chart(itemsCanvas.current, { type:'bar', data:{ labels:names, datasets:[{ label:'Qty', data:qty, backgroundColor:'#1cc88a' }] } }); }
    }, [data]);

    if (loading) return React.createElement('div', { className: 'center' }, 'Loading dashboard...');
    if (error) return React.createElement('div', { className: 'error' }, error);

    return React.createElement('div', null,
      React.createElement('div', { className: 'cards' },
        React.createElement('div', { className: 'card' }, React.createElement('h3', null, 'Total Orders'), React.createElement('p', null, data.totalOrders)),
        React.createElement('div', { className: 'card' }, React.createElement('h3', null, 'Total Sales'), React.createElement('p', null, new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(data.totalSales || 0)))
      ),
      React.createElement('div', { className: 'charts' },
        React.createElement('div', { className: 'chart-block' }, React.createElement('h4', null, 'Orders by Status'), React.createElement('canvas', { ref: statusCanvas })),
        React.createElement('div', { className: 'chart-block' }, React.createElement('h4', null, 'Orders (Last 7 days)'), React.createElement('canvas', { ref: daysCanvas })),
        React.createElement('div', { className: 'chart-block full', style: { gridColumn: '1 / -1' } }, React.createElement('h4', null, 'Top Menu Items (30 days)'), React.createElement('canvas', { ref: itemsCanvas }))
      )
    );
  }

  function Orders({ token }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');

    const load = async () => {
      setLoading(true); setError(null);
      try {
        const q = filter ? ('?status=' + encodeURIComponent(filter)) : '';
        const json = await api('/api/orders' + q, token);
        setOrders(json.data.orders || []);
      } catch (err) { setError(err.message || String(err)); }
      finally { setLoading(false); }
    };

    useEffect(() => { load(); }, [filter]);

    const updateStatus = async (id, status) => {
      if (!confirm('Change status to ' + status + '?')) return;
      try {
        await api('/api/orders/' + id + '/status', token, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
        await load();
      } catch (err) { alert('Failed: ' + err.message); }
    };

    return React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Orders'),
      React.createElement(
        'div',
        { style: { marginBottom: 8 } },
        React.createElement('label', null, 'Filter by status: '),
        React.createElement(
          'select',
          { value: filter, onChange: e => setFilter(e.target.value) },
          React.createElement('option', { value: '' }, 'All'),
          React.createElement('option', { value: 'PENDING' }, 'PENDING'),
          React.createElement('option', { value: 'PREPARING' }, 'PREPARING'),
          React.createElement('option', { value: 'READY' }, 'READY'),
          React.createElement('option', { value: 'COMPLETED' }, 'COMPLETED'),
          React.createElement('option', { value: 'CANCELLED' }, 'CANCELLED')
        ),
        React.createElement('button', { onClick: load, style: { marginLeft: 8 } }, 'Refresh')
      ),
      loading
        ? React.createElement('div', { className: 'center' }, 'Loading...')
        : error
          ? React.createElement('div', { className: 'error' }, error)
          : React.createElement(
            'table',
            { className: 'data-table' },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Order#'),
                React.createElement('th', null, 'User'),
                React.createElement('th', null, 'Total'),
                React.createElement('th', null, 'Status'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement(
              'tbody',
              null,
              orders.map(o =>
                React.createElement(
                  'tr',
                  { key: o._id },
                  React.createElement('td', null, o.orderNumber),
                  React.createElement('td', null, o.user && o.user.name ? o.user.name : (o.user && o.user.email) || ''),
                  React.createElement('td', null, new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(o.total)),
                  React.createElement('td', null, o.status),
                  React.createElement(
                    'td',
                    null,
                    React.createElement(
                      'select',
                      { defaultValue: o.status, onChange: e => updateStatus(o._id, e.target.value) },
                      ['PENDING','PREPARING','READY','COMPLETED','CANCELLED'].map(s => React.createElement('option', { key: s, value: s }, s))
                    ),
                    React.createElement('button', { onClick: () => { alert(JSON.stringify(o, null, 2)); }, style: { marginLeft: 8 } }, 'View')
                  )
                )
              )
            )
          )
    );
  }

  function MenuManager({ token }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(null);

    const load = async () => {
      setLoading(true); setError(null);
      try {
        const json = await api('/api/menu', token);
        setItems(json.data.menuItems || []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => { load(); }, []);

    const save = async (payload) => {
      try {
        if (payload._id) {
          await api('/api/menu/' + payload._id, token, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        } else {
          await api('/api/menu', token, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        }
        setEditing(null);
        await load();
      } catch (err) {
        alert('Save failed: ' + err.message);
      }
    };

    const remove = async (id) => {
      if (!confirm('Delete item?')) return;
      try {
        await api('/api/menu/' + id, token, { method: 'DELETE' });
        await load();
      } catch (err) {
        alert('Delete failed: ' + err.message);
      }
    };

    return React.createElement(
      'div',
      null,
      React.createElement('h3', null, 'Menu Items'),
      React.createElement(
        'div',
        { style: { marginBottom: 8 } },
        React.createElement(
          'button',
          {
            onClick: () =>
              setEditing({
                name: '',
                description: '',
                price: 0,
                image: '',
                category: 'breakfast',
                available: true,
                isSpecial: false
              })
          },
          'Create New'
        )
      ),
      loading
        ? React.createElement('div', { className: 'center' }, 'Loading...')
        : error
          ? React.createElement('div', { className: 'error' }, error)
          : React.createElement(
            'table',
            { className: 'data-table' },
            React.createElement(
              'thead',
              null,
              React.createElement(
                'tr',
                null,
                React.createElement('th', null, 'Name'),
                React.createElement('th', null, 'Category'),
                React.createElement('th', null, 'Price'),
                React.createElement('th', null, 'Available'),
                React.createElement('th', null, 'Actions')
              )
            ),
            React.createElement(
              'tbody',
              null,
              items.map(it =>
                React.createElement(
                  'tr',
                  { key: it._id },
                  React.createElement('td', null, it.name),
                  React.createElement('td', null, it.category),
                  React.createElement('td', null, new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(it.price)),
                  React.createElement('td', null, it.available ? 'Yes' : 'No'),
                  React.createElement(
                    'td',
                    null,
                    React.createElement('button', { onClick: () => setEditing(it) }, 'Edit'),
                    React.createElement('button', { onClick: () => remove(it._id), style: { marginLeft: 8 } }, 'Delete')
                  )
                )
              )
            )
          ),
      editing ? React.createElement(MenuForm, { item: editing, onCancel: () => setEditing(null), onSave: save }) : null
    );
  }

  function MenuForm({ item, onCancel, onSave }) {
    const [form, setForm] = useState(item);
    useEffect(() => setForm(item), [item]);
    const change = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
    return React.createElement('div', { className: 'panel' },
      React.createElement('h4', null, item._id ? 'Edit Item' : 'Create Item'),
      React.createElement('input', { placeholder: 'Name', value: form.name || '', onChange: e => change('name', e.target.value) }),
      React.createElement('input', { placeholder: 'Description', value: form.description || '', onChange: e => change('description', e.target.value) }),
      React.createElement('input', { placeholder: 'Image URL', value: form.image || '', onChange: e => change('image', e.target.value) }),
      React.createElement('input', { placeholder: 'Price', type: 'number', value: form.price || 0, onChange: e => change('price', parseFloat(e.target.value) || 0) }),
      React.createElement('select', { value: form.category, onChange: e => change('category', e.target.value) }, React.createElement('option', { value: 'breakfast' }, 'breakfast'), React.createElement('option', { value: 'lunch' }, 'lunch'), React.createElement('option', { value: 'beverages' }, 'beverages'), React.createElement('option', { value: 'snacks' }, 'snacks')),
      React.createElement('label', null, React.createElement('input', { type: 'checkbox', checked: !!form.available, onChange: e => change('available', e.target.checked) }), ' Available'),
      React.createElement('label', null, React.createElement('input', { type: 'checkbox', checked: !!form.isSpecial, onChange: e => change('isSpecial', e.target.checked) }), ' Is special'),
      React.createElement('div', { style: { marginTop: 8 } }, React.createElement('button', { onClick: () => onSave(form) }, 'Save'), React.createElement('button', { onClick: onCancel, style: { marginLeft: 8 } }, 'Cancel'))
    );
  }

  function Users({ token }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
      let mounted = true;
      (async () => {
        setLoading(true); setError(null);
        try { const json = await api('/api/users', token); if (mounted) setUsers(json.data.users || []); } catch (err) { setError(err.message || String(err)); }
        finally { if (mounted) setLoading(false); }
      })();
      return () => { mounted = false; };
    }, []);
    return React.createElement('div', null,
      React.createElement('h3', null, 'Users'),
      loading
        ? React.createElement('div', { className: 'center' }, 'Loading...')
        : error
          ? React.createElement('div', { className: 'error' }, error)
          : React.createElement('table', { className: 'data-table' },
              React.createElement('thead', null,
                React.createElement('tr', null,
                  React.createElement('th', null, 'Name'),
                  React.createElement('th', null, 'Email'),
                  React.createElement('th', null, 'Role')
                )
              ),
              React.createElement('tbody', null,
                users.map(u => React.createElement('tr', { key: u._id }, React.createElement('td', null, u.name), React.createElement('td', null, u.email), React.createElement('td', null, u.role)))
              )
            )
    );
  }

  const domContainer = document.getElementById('root');
  ReactDOM.createRoot(domContainer).render(React.createElement(AdminApp));

})();
